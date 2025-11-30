import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const InvoicePrintView = () => {
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoiceAndSettings();
    }, [id]);

    const fetchInvoiceAndSettings = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch Invoice
            const invoiceRes = await axios.get(`http://localhost:5000/api/billing/invoices/${id}`, {
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

            setInvoice(invoiceRes.data.data || invoiceRes.data);
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

    if (loading) return <div className="p-8 text-center">Loading invoice...</div>;
    if (!invoice) return <div className="p-8 text-center text-red-600">Invoice not found</div>;

    const subtotal = invoice.total_amount || 0;
    const discount = invoice.discount_amount || 0;
    const tax = invoice.tax_amount || 0;
    const total = subtotal - discount + tax;

    return (
        <div className="bg-white p-8 max-w-[210mm] mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Header Section */}
            <div className="flex justify-between items-start mb-8">
                {/* Left: Lab Info */}
                <div>
                    {settings?.show_logo && (
                        <div className="mb-4">
                            <div className="text-4xl font-bold text-gray-400 border-2 border-gray-300 px-4 py-2 inline-block">
                                LOGO
                            </div>
                        </div>
                    )}
                    <div className="text-sm">
                        <p className="font-bold text-gray-800">{settings?.lab_name || 'Laboratory'}</p>
                        <p className="text-gray-600">{settings?.address || '[Street Address]'}</p>
                        <p className="text-gray-600">Phone: {settings?.phone || '(000) 000-0000'}</p>
                        <p className="text-gray-600">Email: {settings?.email || 'email@domain.com'}</p>
                    </div>
                </div>

                {/* Right: Invoice Title & Details */}
                <div className="text-right">
                    <h1 className="text-4xl font-bold text-gray-700 mb-4">INVOICE</h1>
                    <table className="text-sm border border-gray-300">
                        <tbody>
                            <tr>
                                <td className="bg-gray-100 px-4 py-2 font-semibold border-b border-r border-gray-300">INVOICE #</td>
                                <td className="px-4 py-2 border-b border-gray-300">{invoice.invoice_number}</td>
                            </tr>
                            <tr>
                                <td className="bg-gray-100 px-4 py-2 font-semibold border-r border-gray-300">DATE</td>
                                <td className="px-4 py-2">{new Date(invoice.invoice_date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Client & Payment Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Client Info */}
                <div>
                    <div className="bg-gray-100 px-3 py-2 font-bold text-sm mb-2 border border-gray-300">
                        CLIENT
                    </div>
                    <div className="text-sm space-y-1">
                        <p className="font-bold text-gray-800">{invoice.patient_name}</p>
                    </div>
                </div>

                {/* Payment To */}
                <div>
                    <div className="bg-gray-100 px-3 py-2 font-bold text-sm mb-2 border border-gray-300">
                        PLEASE MAKE PAYMENT TO
                    </div>
                    <div className="text-sm space-y-1">
                        <p className="font-bold text-gray-800">{settings?.lab_name || 'Laboratory'}</p>
                        <p className="text-gray-600">{settings?.address || '[Street Address]'}</p>
                    </div>
                </div>
            </div>

            {/* Services Description */}
            <div className="text-center mb-6">
                <p className="font-semibold text-gray-800">
                    For Medical Laboratory Services Rendered Through {new Date(invoice.invoice_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            </div>

            {/* Items Table */}
            <table className="w-full border border-gray-300 mb-6">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">DATE</th>
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">DESCRIPTION</th>
                        <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold">AMOUNT</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items && invoice.items.length > 0 ? (
                        invoice.items.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-4 py-2 text-sm align-top">
                                    {new Date(invoice.invoice_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-sm">
                                    {item.test_name || item.item_name || 'Medical Laboratory Test'}
                                    {item.test_code && <span className="text-gray-500"> ({item.test_code})</span>}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-sm text-right align-top">
                                    ₹{(item.price || item.test_price || item.unit_price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 text-sm align-top">
                                {new Date(invoice.invoice_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">
                                Medical Laboratory Tests and Services
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-sm text-right align-top">
                                ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                        </tr>
                    )}
                    {/* Empty rows for spacing */}
                    {[...Array(Math.max(0, 6 - (invoice.items?.length || 0)))].map((_, i) => (
                        <tr key={`empty-${i}`}>
                            <td className="border border-gray-300 px-4 py-3 text-sm">&nbsp;</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm">&nbsp;</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-right">-</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* EMI Schedule */}
            {invoice.emi_plan && (
                <div className="mb-8">
                    <h3 className="font-bold text-gray-700 mb-2">EMI Payment Schedule</h3>
                    <table className="w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Installment</th>
                                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Due Date</th>
                                <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold">Amount</th>
                                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.emi_plan.installments.map((inst) => (
                                <tr key={inst.installment_id}>
                                    <td className="border border-gray-300 px-4 py-2 text-sm">#{inst.installment_number}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm">
                                        {new Date(inst.due_date).toLocaleDateString()}
                                        {inst.payment_date && <span className="text-xs text-gray-500 block">Paid: {new Date(inst.payment_date).toLocaleDateString()}</span>}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm text-right">₹{inst.amount}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs ${inst.status === 'paid' ? 'bg-green-100 text-green-700' :
                                            inst.status === 'overdue' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {inst.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Totals */}
            <div className="flex justify-end mb-8">
                <div className="w-80">
                    <table className="w-full border border-gray-300">
                        <tbody>
                            <tr>
                                <td className="bg-gray-100 px-4 py-2 font-semibold text-sm border-b border-r border-gray-300">SUBTOTAL</td>
                                <td className="px-4 py-2 text-right text-sm border-b border-gray-300">
                                    ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                            </tr>
                            {tax > 0 && (
                                <>
                                    <tr>
                                        <td className="bg-gray-100 px-4 py-2 font-semibold text-sm border-b border-r border-gray-300">TAX RATE</td>
                                        <td className="px-4 py-2 text-right text-sm border-b border-gray-300">
                                            {((tax / subtotal) * 100).toFixed(4)}%
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bg-gray-100 px-4 py-2 font-semibold text-sm border-b border-r border-gray-300">TAX</td>
                                        <td className="px-4 py-2 text-right text-sm border-b border-gray-300">
                                            ₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                </>
                            )}
                            <tr>
                                <td className="bg-gray-100 px-4 py-2 font-bold text-sm border-r border-gray-300">TOTAL DUE</td>
                                <td className="px-4 py-2 text-right font-bold text-sm">
                                    ₹ {total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Terms */}
            <div className="text-sm text-gray-600 italic mb-4">
                {settings?.terms_conditions || 'All payments are due within 30 days'}
            </div>

            {/* Footer */}
            <div className="text-center text-sm font-semibold text-gray-700 pt-4 border-t border-gray-300">
                Thank you for your business!
            </div>
        </div>
    );
};

export default InvoicePrintView;
