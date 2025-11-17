const db = require('../config/db.config');

const InventoryModel = {
  // Create Inventory Item
  createItem: async (itemData) => {
    const [result] = await db.query(
      `INSERT INTO inventory_items (
        tenant_id, item_name, item_code, category, unit,
        current_stock, min_stock_level, max_stock_level,
        unit_price, supplier_name, expiry_date, location, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        itemData.tenant_id,
        itemData.item_name,
        itemData.item_code,
        itemData.category,
        itemData.unit,
        itemData.current_stock || 0,
        itemData.min_stock_level || 0,
        itemData.max_stock_level,
        itemData.unit_price,
        itemData.supplier_name,
        itemData.expiry_date,
        itemData.location,
        itemData.is_active !== false
      ]
    );
    return { itemId: result.insertId, success: true };
  },

  // Get All Items
  getAllItems: async (tenantId, filters = {}) => {
    let query = `SELECT * FROM inventory_items WHERE tenant_id = ?`;
    const params = [tenantId];

    if (filters.category) {
      query += ` AND category = ?`;
      params.push(filters.category);
    }

    if (filters.is_active !== undefined) {
      query += ` AND is_active = ?`;
      params.push(filters.is_active);
    }

    if (filters.search) {
      query += ` AND (item_name LIKE ? OR item_code LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ` ORDER BY item_name`;

    const [items] = await db.query(query, params);
    return items;
  },

  // Get Item by ID
  getItemById: async (itemId, tenantId) => {
    const [items] = await db.query(
      `SELECT * FROM inventory_items WHERE item_id = ? AND tenant_id = ?`,
      [itemId, tenantId]
    );
    return items.length > 0 ? items[0] : null;
  },

  // Update Item
  updateItem: async (itemId, tenantId, updateData) => {
    const [result] = await db.query(
      `UPDATE inventory_items SET
        item_name = ?,
        item_code = ?,
        category = ?,
        unit = ?,
        current_stock = ?,
        min_stock_level = ?,
        max_stock_level = ?,
        unit_price = ?,
        supplier_name = ?,
        expiry_date = ?,
        location = ?,
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE item_id = ? AND tenant_id = ?`,
      [
        updateData.item_name,
        updateData.item_code,
        updateData.category,
        updateData.unit,
        updateData.current_stock,
        updateData.min_stock_level,
        updateData.max_stock_level,
        updateData.unit_price,
        updateData.supplier_name,
        updateData.expiry_date,
        updateData.location,
        updateData.is_active,
        itemId,
        tenantId
      ]
    );
    return result.affectedRows > 0;
  },

  // Delete Item
  deleteItem: async (itemId, tenantId) => {
    const [result] = await db.query(
      `DELETE FROM inventory_items WHERE item_id = ? AND tenant_id = ?`,
      [itemId, tenantId]
    );
    return result.affectedRows > 0;
  },

  // Record Transaction
  recordTransaction: async (transactionData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insert transaction
      await connection.query(
        `INSERT INTO inventory_transactions (
          tenant_id, item_id, transaction_type, quantity,
          transaction_date, reference_number, test_order_id, notes, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          transactionData.tenant_id,
          transactionData.item_id,
          transactionData.transaction_type,
          transactionData.quantity,
          transactionData.transaction_date || new Date(),
          transactionData.reference_number,
          transactionData.test_order_id,
          transactionData.notes,
          transactionData.created_by
        ]
      );

      // Update stock
      const stockChange = transactionData.transaction_type === 'purchase' 
        ? transactionData.quantity 
        : -transactionData.quantity;

      await connection.query(
        `UPDATE inventory_items 
         SET current_stock = current_stock + ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE item_id = ? AND tenant_id = ?`,
        [stockChange, transactionData.item_id, transactionData.tenant_id]
      );

      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Get Low Stock Items
  getLowStockItems: async (tenantId) => {
    const [items] = await db.query(
      `SELECT * FROM inventory_items 
       WHERE tenant_id = ? 
       AND current_stock <= min_stock_level 
       AND is_active = 1
       ORDER BY current_stock ASC`,
      [tenantId]
    );
    return items;
  },

  // Get Expiring Items
  getExpiringItems: async (tenantId, daysAhead = 30) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const [items] = await db.query(
      `SELECT *, DATEDIFF(expiry_date, CURDATE()) as days_to_expiry
       FROM inventory_items 
       WHERE tenant_id = ? 
       AND expiry_date IS NOT NULL
       AND expiry_date <= ?
       AND is_active = 1
       ORDER BY expiry_date ASC`,
      [tenantId, futureDate]
    );
    return items;
  },

  // Get Inventory Statistics
  getInventoryStats: async (tenantId) => {
    const [stats] = await db.query(
      `SELECT 
        COUNT(*) as total_items,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_items,
        SUM(CASE WHEN current_stock <= min_stock_level THEN 1 ELSE 0 END) as low_stock_items,
        SUM(current_stock * unit_price) as total_value
      FROM inventory_items
      WHERE tenant_id = ?`,
      [tenantId]
    );
    return stats[0];
  }
};

module.exports = InventoryModel;
