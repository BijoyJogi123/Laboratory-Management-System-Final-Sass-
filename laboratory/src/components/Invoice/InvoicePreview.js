import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import html2pdf from 'html2pdf.js';
import axios from 'axios';
import { XMarkIcon, PrinterIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const InvoicePreview = ({ invoice, isOpen, onClose }) => {
  const [settings, setSettings] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/settings/lab-info', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSettings({
        lab_name: 'LabHub Medical Laboratory',
        address: '123 Medical Street, Healthcare City',
        phone: '+91-1234567890',
        email: 'info@labhub.com',
        website: 'www.labhub.com',
        license_number: 'LAB-2024-001',
        logo_url: null,
        terms_conditions: 'All payments are due within 30 days'
      });
    }
  };

  const handleDownload = () => {
    const element = printRef.current;
    const opt = {
      margin: 10,
      filename: `Invoice-${invoice.invoice_number}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const onPrint = () => {
    const width = 800;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(
      `/print/invoice/${invoice.invoice_id}`,
      'Print Invoice',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
    );
  };

  if (!isOpen || !invoice) return null;

  const subtotal = invoice.total_amount || 0;
  const discount = invoice.discount_amount || 0;
  const tax = invoice.tax_amount || 0;
  const total = subtotal - discount + tax;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Invoice Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Invoice Preview */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div ref={printRef} className="bg-white p-12 shadow-sm printable-area" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Header Section */}
            <div className="flex justify-between items-start mb-8">
              {/* Left: Lab Info */}
              <div>
                {settings?.logo_url && (
                  <div className="mb-4">
                    <img
                      src={`http://localhost:5000${settings.logo_url}`}
                      alt="Laboratory Logo"
                      className="h-16 w-auto object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="text-sm">
                  <p className="font-bold text-lg text-gray-800 mb-1">{settings?.lab_name || 'Laboratory'}</p>
                  <p className="text-gray-600">{settings?.address || '[Street Address]'}</p>
                  <p className="text-gray-600">Phone: {settings?.phone || '(000) 000-0000'}</p>
                  <p className="text-gray-600">Email: {settings?.email || 'email@domain.com'}</p>
                  {settings?.website && (
                    <p className="text-gray-600">Website: {settings.website}</p>
                  )}
                  {settings?.license_number && (
                    <p className="text-gray-600">License: {settings.license_number}</p>
                  )}
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

            {/* Totals - Only show if no EMI plan */}
            {!invoice.emi_plan && (
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
            )}

            {/* EMI Payment Schedule Table */}
            {invoice.emi_plan && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-700 mb-3 text-sm">EMI Payment Schedule</h3>
                <table className="w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">Date</th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">Installment</th>
                      <th className="border border-gray-300 px-3 py-2 text-right text-xs font-semibold">Amount</th>
                      <th className="border border-gray-300 px-3 py-2 text-center text-xs font-semibold">Status</th>
                      <th className="border border-gray-300 px-3 py-2 text-right text-xs font-semibold">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.emi_plan.installments.map((inst, idx) => {
                      const previousPaid = invoice.emi_plan.installments
                        .slice(0, idx)
                        .filter(i => i.status === 'paid')
                        .reduce((sum, i) => sum + parseFloat(i.paid_amount || 0), 0);
                      const currentBalance = invoice.total_amount - invoice.emi_plan.down_payment - previousPaid - (inst.status === 'paid' ? parseFloat(inst.paid_amount || 0) : 0);

                      return (
                        <tr key={inst.installment_id} className={inst.status === 'paid' ? 'bg-green-50' : ''}>
                          <td className="border border-gray-300 px-3 py-2 text-xs">
                            {inst.status === 'paid'
                              ? new Date(inst.payment_date).toLocaleDateString('en-IN')
                              : new Date(inst.due_date).toLocaleDateString('en-IN')
                            }
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-xs">
                            EMI #{inst.installment_number}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-xs text-right font-medium">
                            ₹{parseFloat(inst.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-xs text-center">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${inst.status === 'paid' ? 'bg-green-100 text-green-700' :
                              inst.status === 'overdue' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                              {inst.status === 'paid' ? 'Paid' : inst.status === 'overdue' ? 'Overdue' : 'Pending'}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-xs text-right font-medium">
                            ₹{currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-gray-100 font-semibold">
                      <td colSpan="2" className="border border-gray-300 px-3 py-2 text-xs text-right">Total EMI Amount:</td>
                      <td className="border border-gray-300 px-3 py-2 text-xs text-right">
                        ₹{(invoice.emi_plan.emi_amount * invoice.emi_plan.number_of_installments).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td colSpan="2" className="border border-gray-300 px-3 py-2 text-xs"></td>
                    </tr>
                    <tr className="bg-green-50 font-semibold">
                      <td colSpan="2" className="border border-gray-300 px-3 py-2 text-xs text-right text-green-700">Amount Paid:</td>
                      <td className="border border-gray-300 px-3 py-2 text-xs text-right text-green-700">
                        ₹{invoice.emi_plan.installments.filter(i => i.status === 'paid').reduce((sum, i) => sum + parseFloat(i.paid_amount || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td colSpan="2" className="border border-gray-300 px-3 py-2 text-xs"></td>
                    </tr>
                    <tr className="bg-red-50 font-semibold">
                      <td colSpan="2" className="border border-gray-300 px-3 py-2 text-xs text-right text-red-700">Remaining Balance:</td>
                      <td className="border border-gray-300 px-3 py-2 text-xs text-right text-red-700">
                        ₹{(invoice.balance_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td colSpan="2" className="border border-gray-300 px-3 py-2 text-xs"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Totals - Only show if no EMI plan */}
            {!invoice.emi_plan && (
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
            )}

            {/* Terms */}
            <div className="text-sm text-gray-600 italic mb-4">
              {settings?.terms_conditions || 'All payments are due within 30 days'}
            </div>

            {/* Footer */}
            <div className="text-center text-sm font-semibold text-gray-700 pt-4 border-t border-gray-300">
              Thank you for your business!
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t p-4 bg-white flex justify-end gap-3">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
          <button
            onClick={onPrint}
            className="btn-primary flex items-center gap-2"
          >
            <PrinterIcon className="w-5 h-5" />
            Print Invoice
          </button>
          <button
            onClick={handleDownload}
            className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
