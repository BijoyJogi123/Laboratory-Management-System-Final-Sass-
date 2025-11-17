const db = require('../config/db.config');

const LedgerModel = {
  // Get Party Ledger
  getPartyLedger: async (tenantId, partyId, fromDate, toDate) => {
    // Get opening balance
    const [openingBalance] = await db.query(
      `SELECT balance FROM party_ledger 
       WHERE tenant_id = ? AND party_id = ? AND entry_date < ?
       ORDER BY entry_date DESC, ledger_id DESC LIMIT 1`,
      [tenantId, partyId, fromDate]
    );

    const opening = openingBalance.length > 0 ? parseFloat(openingBalance[0].balance) : 0;

    // Get ledger entries
    const [entries] = await db.query(
      `SELECT * FROM party_ledger
       WHERE tenant_id = ? AND party_id = ? 
       AND entry_date BETWEEN ? AND ?
       ORDER BY entry_date, ledger_id`,
      [tenantId, partyId, fromDate, toDate]
    );

    // Get closing balance
    const closing = entries.length > 0 
      ? parseFloat(entries[entries.length - 1].balance)
      : opening;

    // Get party details
    const [party] = await db.query(
      `SELECT party_name, party_type FROM party_ledger
       WHERE tenant_id = ? AND party_id = ?
       LIMIT 1`,
      [tenantId, partyId]
    );

    return {
      party_id: partyId,
      party_name: party.length > 0 ? party[0].party_name : 'Unknown',
      party_type: party.length > 0 ? party[0].party_type : 'unknown',
      opening_balance: opening,
      closing_balance: closing,
      entries: entries
    };
  },

  // Add Ledger Entry
  addLedgerEntry: async (entryData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get current balance
      const [lastEntry] = await connection.query(
        `SELECT balance FROM party_ledger 
         WHERE tenant_id = ? AND party_id = ?
         ORDER BY entry_date DESC, ledger_id DESC LIMIT 1`,
        [entryData.tenant_id, entryData.party_id]
      );

      const currentBalance = lastEntry.length > 0 ? parseFloat(lastEntry[0].balance) : 0;
      
      // Calculate new balance
      let newBalance = currentBalance;
      if (entryData.voucher_type === 'invoice' || entryData.voucher_type === 'debit_note') {
        newBalance += parseFloat(entryData.credit_amount || 0);
      } else if (entryData.voucher_type === 'payment' || entryData.voucher_type === 'credit_note') {
        newBalance -= parseFloat(entryData.debit_amount || 0);
      }

      // Add cashback and TDS adjustments
      newBalance -= parseFloat(entryData.cashback_amount || 0);
      newBalance -= parseFloat(entryData.tds_party || 0);
      newBalance += parseFloat(entryData.tds_self || 0);

      // Insert entry
      const [result] = await connection.query(
        `INSERT INTO party_ledger (
          tenant_id, party_id, party_name, party_type, entry_date,
          voucher_type, voucher_number, invoice_number, payment_mode,
          credit_amount, debit_amount, cashback_amount, tds_party, tds_self,
          balance, description, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          entryData.tenant_id,
          entryData.party_id,
          entryData.party_name,
          entryData.party_type,
          entryData.entry_date || new Date(),
          entryData.voucher_type,
          entryData.voucher_number,
          entryData.invoice_number,
          entryData.payment_mode,
          entryData.credit_amount || 0,
          entryData.debit_amount || 0,
          entryData.cashback_amount || 0,
          entryData.tds_party || 0,
          entryData.tds_self || 0,
          newBalance,
          entryData.description,
          entryData.created_by
        ]
      );

      await connection.commit();
      return { ledgerId: result.insertId, newBalance, success: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Get All Parties with Balances
  getAllPartiesWithBalances: async (tenantId, partyType = null) => {
    let query = `
      SELECT 
        party_id,
        party_name,
        party_type,
        MAX(entry_date) as last_transaction_date,
        (SELECT balance FROM party_ledger pl2 
         WHERE pl2.tenant_id = pl.tenant_id 
         AND pl2.party_id = pl.party_id
         ORDER BY entry_date DESC, ledger_id DESC LIMIT 1) as current_balance
      FROM party_ledger pl
      WHERE tenant_id = ?
    `;
    const params = [tenantId];

    if (partyType) {
      query += ` AND party_type = ?`;
      params.push(partyType);
    }

    query += ` GROUP BY party_id, party_name, party_type ORDER BY party_name`;

    const [parties] = await db.query(query, params);
    return parties;
  },

  // Get Ledger Summary
  getLedgerSummary: async (tenantId, fromDate, toDate) => {
    const [summary] = await db.query(
      `SELECT 
        COUNT(DISTINCT party_id) as total_parties,
        SUM(credit_amount) as total_credit,
        SUM(debit_amount) as total_debit,
        SUM(cashback_amount) as total_cashback,
        SUM(tds_party) as total_tds_party,
        SUM(tds_self) as total_tds_self,
        COUNT(*) as total_transactions
      FROM party_ledger
      WHERE tenant_id = ? AND entry_date BETWEEN ? AND ?`,
      [tenantId, fromDate, toDate]
    );

    return summary[0];
  },

  // Delete Ledger Entry
  deleteLedgerEntry: async (ledgerId, tenantId) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get entry details
      const [entries] = await connection.query(
        `SELECT * FROM party_ledger WHERE ledger_id = ? AND tenant_id = ?`,
        [ledgerId, tenantId]
      );

      if (entries.length === 0) {
        throw new Error('Ledger entry not found');
      }

      const entry = entries[0];

      // Delete entry
      await connection.query(
        `DELETE FROM party_ledger WHERE ledger_id = ? AND tenant_id = ?`,
        [ledgerId, tenantId]
      );

      // Recalculate balances for subsequent entries
      const [subsequentEntries] = await connection.query(
        `SELECT ledger_id FROM party_ledger
         WHERE tenant_id = ? AND party_id = ? 
         AND (entry_date > ? OR (entry_date = ? AND ledger_id > ?))
         ORDER BY entry_date, ledger_id`,
        [tenantId, entry.party_id, entry.entry_date, entry.entry_date, ledgerId]
      );

      // Recalculate each subsequent entry
      for (const subEntry of subsequentEntries) {
        const [prevEntry] = await connection.query(
          `SELECT balance FROM party_ledger
           WHERE tenant_id = ? AND party_id = ? AND ledger_id < ?
           ORDER BY entry_date DESC, ledger_id DESC LIMIT 1`,
          [tenantId, entry.party_id, subEntry.ledger_id]
        );

        const prevBalance = prevEntry.length > 0 ? parseFloat(prevEntry[0].balance) : 0;

        const [currentEntry] = await connection.query(
          `SELECT * FROM party_ledger WHERE ledger_id = ?`,
          [subEntry.ledger_id]
        );

        if (currentEntry.length > 0) {
          const curr = currentEntry[0];
          let newBalance = prevBalance;
          
          if (curr.voucher_type === 'invoice' || curr.voucher_type === 'debit_note') {
            newBalance += parseFloat(curr.credit_amount || 0);
          } else if (curr.voucher_type === 'payment' || curr.voucher_type === 'credit_note') {
            newBalance -= parseFloat(curr.debit_amount || 0);
          }

          newBalance -= parseFloat(curr.cashback_amount || 0);
          newBalance -= parseFloat(curr.tds_party || 0);
          newBalance += parseFloat(curr.tds_self || 0);

          await connection.query(
            `UPDATE party_ledger SET balance = ? WHERE ledger_id = ?`,
            [newBalance, subEntry.ledger_id]
          );
        }
      }

      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};

module.exports = LedgerModel;
