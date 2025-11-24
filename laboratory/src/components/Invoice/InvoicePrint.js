import React from 'react';
import './InvoicePrint.css';

const InvoicePrint = React.forwardRef(({ invoice, labInfo }, ref) => {
  const calculateSubtotal = () => {
    return invoice.items?.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.quantity || 1)), 0) || 0;
  };

  const subtotal = calculateSubtotal();
  const discountAmount = parseFloat(invoice.discount_amount || 0);
  const taxAmount = parseFloat(invoice.tax_amount || 0);
  const total = subtotal - discountAmount + taxAmount;
  const paidAmount = parseFloat(invoice.paid_amount || 0);
  const balance = total - paidAmount;

  return (
    <div ref={ref} className="invoice-print">
      {/* Header */}
      <div className="invoice-header">
        <div className="lab-info">
          <h1>{labInfo?.name || 'Laboratory Management System'}</h1>
          <p>{labInfo?.address || ''}</p>
          <p>Phone: {labInfo?.phone || ''} | Email: {labInfo?.email || ''}</p>
        </div>
        <div className="invoice-title">
          <h2>INVOICE</h2>
          <p>#{invoice.invoice_number}</p>
          <p>{new Date(invoice.invoice_date).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="invoice-divider"></div>

      {/* Patient Details */}
      <div className="invoice-section">
        <div className="section-title">Bill To:</div>
        <div className="patient-details">
          <p><strong>{invoice.patient_name}</strong></p>
          {invoice.patient_contact && <p>Phone: {invoice.patient_contact}</p>}
          {invoice.patient_email && <p>Email: {invoice.patient_email}</p>}
          {invoice.patient_address && <p>Address: {invoice.patient_address}</p>}
        </div>
      </div>

      {/* Items Table */}
      <div className="invoice-section">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Test Name</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.test_name}</td>
                <td>{item.description || '-'}</td>
                <td>{item.quantity || 1}</td>
                <td>₹{parseFloat(item.price).toFixed(2)}</td>
                <td>₹{(parseFloat(item.price) * parseInt(item.quantity || 1)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Calculations */}
      <div className="invoice-calculations">
        <div className="calc-row">
          <span>Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="calc-row discount">
            <span>Discount:</span>
            <span>- ₹{discountAmount.toFixed(2)}</span>
          </div>
        )}
        {taxAmount > 0 && (
          <div className="calc-row">
            <span>Tax:</span>
            <span>₹{taxAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="calc-row total">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        {paidAmount > 0 && (
          <div className="calc-row paid">
            <span>Paid:</span>
            <span>₹{paidAmount.toFixed(2)}</span>
          </div>
        )}
        {balance > 0 && (
          <div className="calc-row balance">
            <span>Balance Due:</span>
            <span>₹{balance.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Payment Details */}
      {invoice.payment_method && (
        <div className="invoice-section">
          <div className="section-title">Payment Information:</div>
          <p>Payment Method: <strong>{invoice.payment_method.toUpperCase()}</strong></p>
          <p>Payment Status: <strong className={`status-${invoice.payment_status}`}>
            {invoice.payment_status.toUpperCase()}
          </strong></p>
        </div>
      )}

      {/* Footer */}
      <div className="invoice-footer">
        <div className="footer-notes">
          <p><strong>Terms & Conditions:</strong></p>
          <p>Thank you for your business. Please make payment by the due date.</p>
        </div>
        <div className="footer-signature">
          <div className="signature-line"></div>
          <p>Authorized Signature</p>
        </div>
      </div>
    </div>
  );
});

InvoicePrint.displayName = 'InvoicePrint';

export default InvoicePrint;
