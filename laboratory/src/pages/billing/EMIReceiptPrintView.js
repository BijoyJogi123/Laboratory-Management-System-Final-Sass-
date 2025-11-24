import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

const EMIReceiptPrintView = () => {
    const { id } = useParams();
    const [receipt, setReceipt] = useState(null);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReceiptAndSettings();
    }, [id]);

    const fetchReceiptAndSettings = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch Installment Receipt Data
            const receiptRes = await axios.get(`http://localhost:5000/api/emi/installments/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Fetch Settings
            let settingsData = null;
            try {
                const settingsRes = await axios.get('http://localhost:5000/api/settings/invoice', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                settingsData = settingsRes.data.data;
            } catch (err) {
                console.error('Error fetching settings:', err);
            }

            setReceipt(receiptRes.data.data || receiptRes.data);
            setSettings(settingsData);
            setLoading(false);

            // Auto-print when loaded
            setTimeout(() => {
                window.print();
            }, 1000);

        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading receipt...</div>;
    if (!receipt) return <div className="p-8 text-center text-red-600">Receipt not found</div>;

    return (
        <div className="bg-white p-8 max-w-[210mm] mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Header Section */}
            <div className="flex justify-between items-start mb-8 border-b pb-4">
                {/* Left: Lab Info */}
                <div>
                    {settings?.show_logo && (
                        <div className="mb-4">
                            <div className="text-2xl font-bold text-gray-400 border-2 border-gray-300 px-3 py-1 inline-block">
                                LOGO
                            </div>
                        </div>
                    )}
                    <div className="text-sm">
                        <p className="font-bold text-gray-800">{settings?.lab_name || 'Laboratory'}</p>
                        <p className="text-gray-600">{settings?.address || '[Street Address]'}</p>
                        <p className="text-gray-600">Phone: {settings?.phone || '(000) 000-0000'}</p>
                    </div>
                </div>

                {/* Right: Receipt Title & Details */}
                <div className="text-right">
                    <h1 className="text-3xl font-bold text-gray-700 mb-2">PAYMENT RECEIPT</h1>
                    <p className="text-sm text-gray-500">Receipt #: EMI-{receipt.emi_plan_id}-{receipt.installment_number}</p>
                    <p className="text-sm text-gray-500">Date: {new Date(receipt.payment_date || new Date()).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Payment Details */}
            <div className="mb-8">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Received From</p>
                            <p className="font-bold text-lg text-gray-900">{receipt.patient_name}</p>
                            {receipt.patient_contact && <p className="text-sm text-gray-600">{receipt.patient_contact}</p>}
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">Amount Received</p>
                            <p className="font-bold text-2xl text-green-600">₹{(receipt.paid_amount || 0).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction Details Table */}
            <table className="w-full border border-gray-300 mb-8">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Description</th>
                        <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold">Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2 text-sm">Invoice Number</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm text-right">{receipt.invoice_number}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2 text-sm">Installment Number</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm text-right">#{receipt.installment_number}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2 text-sm">Payment Mode</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm text-right capitalize">{receipt.payment_mode || 'Cash'}</td>
                    </tr>
                    {receipt.transaction_id && (
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 text-sm">Transaction ID</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm text-right">{receipt.transaction_id}</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Footer */}
            <div className="mt-12 pt-4 border-t border-gray-300 flex justify-between items-end">
                <div className="text-sm text-gray-500">
                    <p>Thank you for your payment.</p>
                    <p>This is a computer generated receipt.</p>
                </div>
                <div className="text-center">
                    <div className="h-16 w-32 border-b border-gray-400 mb-2"></div>
                    <p className="text-sm font-semibold text-gray-700">Authorized Signature</p>
                </div>
            </div>
        </div>
    );
};

export default EMIReceiptPrintView;
