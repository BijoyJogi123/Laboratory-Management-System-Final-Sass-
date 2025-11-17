import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import axios from 'axios';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const PartyLedger = () => {
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    party_type: '',
    search: '',
    from_date: '',
    to_date: ''
  });

  useEffect(() => {
    fetchParties();
    fetchSummary();
  }, [filters]);

  useEffect(() => {
    if (selectedParty) {
      fetchLedgerEntries(selectedParty.party_id);
    }
  }, [selectedParty]);

  const fetchParties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/ledger/parties', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      setParties(response.data.data || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching parties:', error);
      setLoading(false);
    }
  };

  const fetchLedgerEntries = async (partyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/ledger/party/${partyId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          from_date: filters.from_date,
          to_date: filters.to_date
        }
      });
      setLedgerEntries(response.data.data?.entries || []);
    } catch (error) {
      console.error('Error fetching ledger entries:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/ledger/summary', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          from_date: filters.from_date,
          to_date: filters.to_date
        }
      });
      setSummary(response.data.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const getVoucherTypeColor = (type) => {
    const colors = {
      invoice: 'bg-purple-100 text-purple-700',
      payment: 'bg-green-100 text-green-700',
      receipt: 'bg-blue-100 text-blue-700',
      journal: 'bg-yellow-100 text-yellow-700',
      credit_note: 'bg-orange-100 text-orange-700',
      debit_note: 'bg-red-100 text-red-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <MainLayout title="Party Ledger" subtitle="Track financial transactions and balances">
      {summary && (
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Parties</p>
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-purple-600 font-bold">{summary.total_parties || 0}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{summary.total_transactions || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Total transactions</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Credit</p>
              <ArrowTrendingUpIcon className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">₹{(summary.total_credit || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Credit amount</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Debit</p>
              <ArrowTrendingDownIcon className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-600">₹{(summary.total_debit || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Debit amount</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Cashback</p>
              <CurrencyDollarIcon className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-600">₹{(summary.total_cashback || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Total cashback</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Parties</h2>
              <p className="text-sm text-gray-500 mt-1">{parties.length} parties</p>
            </div>
            <button className="btn-primary flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Add Entry
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search parties..."
                className="input-field w-full pl-10"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <select
              className="input-field w-full"
              value={filters.party_type}
              onChange={(e) => setFilters({ ...filters, party_type: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="patient">Patients</option>
              <option value="doctor">Doctors</option>
              <option value="supplier">Suppliers</option>
              <option value="other">Others</option>
            </select>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {parties.map((party) => (
              <div
                key={party.party_id}
                className={`p-4 rounded-xl cursor-pointer transition-colors ${
                  selectedParty?.party_id === party.party_id
                    ? 'bg-purple-50 border-2 border-purple-200'
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
                onClick={() => setSelectedParty(party)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-medium">
                    {(party.party_name || 'P')[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{party.party_name}</p>
                    <p className="text-xs text-gray-500 capitalize">{party.party_type}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      (party.current_balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ₹{Math.abs(party.current_balance || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(party.last_transaction_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {selectedParty ? `${selectedParty.party_name} Ledger` : 'Select a Party'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {selectedParty ? `${ledgerEntries.length} transactions` : 'Choose a party to view ledger'}
              </p>
            </div>
            {selectedParty && (
              <div className="flex items-center gap-3">
                <button className="btn-secondary flex items-center gap-2">
                  <FunnelIcon className="w-4 h-4" />
                  Filter
                </button>
                <button className="btn-secondary flex items-center gap-2">
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <input
              type="date"
              className="input-field"
              value={filters.from_date}
              onChange={(e) => setFilters({ ...filters, from_date: e.target.value })}
              placeholder="From date"
            />
            <input
              type="date"
              className="input-field"
              value={filters.to_date}
              onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
              placeholder="To date"
            />
          </div>

          {selectedParty ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Voucher</th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Credit</th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Debit</th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerEntries.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-gray-500">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    ledgerEntries.map((entry) => (
                      <tr key={entry.ledger_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {new Date(entry.entry_date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`badge ${getVoucherTypeColor(entry.voucher_type)}`}>
                            {entry.voucher_type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-purple-600 font-medium">
                          {entry.invoice_number || entry.voucher_number}
                        </td>
                        <td className="py-4 px-4 text-sm font-medium text-green-600">
                          {entry.credit_amount > 0 ? `₹${entry.credit_amount.toLocaleString()}` : '-'}
                        </td>
                        <td className="py-4 px-4 text-sm font-medium text-red-600">
                          {entry.debit_amount > 0 ? `₹${entry.debit_amount.toLocaleString()}` : '-'}
                        </td>
                        <td className="py-4 px-4 text-sm font-medium text-gray-900">
                          ₹{Math.abs(entry.balance || 0).toLocaleString()}
                          <span className={`ml-1 text-xs ${entry.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {entry.balance >= 0 ? 'Cr' : 'Dr'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <DocumentTextIcon className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium">Select a party to view ledger</p>
              <p className="text-sm">Choose from the parties list to see transaction history</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default PartyLedger;