import React, { useState } from 'react';
import Cash from '../assets/images/cash-icon.webp'; // Assuming you're importing your image
import Upi from '../assets/images/upi_logo_icon_169316.webp'
import PhonePay from '../assets/images/png-transparent-phonepe-hd-logo-removebg-preview.png'
import Gpay from '../assets/images/png-transparent-google-pay-send-online-wallet-mobile-payment-mobile-pay-text-trademark-payment-thumbnail-removebg-preview.png'
import Paytm from '../assets/images/png-transparent-paytm-social-icons-color-icon-thumbnail-removebg-preview (1).png'
import Card from '../assets/images/payment-visa-paypal-logo-credit-card-png-favpng-5jF1i9XTAssEYxKeGKj1etwgz-removebg-preview.png'

const Modal = ({ isOpen, onClose ,setSelectedPayment,selectedPayment,handleSubmit,totalPayment}) => {
    // const [selectedPayment, setSelectedPayment] = useState(''); // Manage selected payment

    if (!isOpen) return null;

    const paymentMethods = [
        { name: 'Cash', icon: Cash },   // Already imported above.
        { name: 'UPI', icon: Upi },   // Update these paths with actual images.
        { name: 'PhonePe', icon: PhonePay },
        { name: 'Gpay', icon: Gpay },
        { name: 'Paytm', icon: Paytm },
        { name: 'Debit Card', icon: Card },
    ];
    console.log(selectedPayment,"thisi si modal part")
    console.log(totalPayment,"paise")

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-[#145883]">Select Payment Method</h2>
                    <button
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        onClick={onClose}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    {/* Payment Methods Table */}


                <p className='text-gray-500 font-semibold'>Amount Paybal: <span className='text-gree-500 font-semibold'>₹{totalPayment && totalPayment}</span></p>


                    <div className="mt-6">
                        <table className="min-w-full bg-white border-[1px] border-gray-400 shadow-lg rounded-lg">
                            <thead className="bg-[#E9EBEC]">
                                <tr>
                                    <th className="px-4 py-2 text-center text-[#145883] font-bold border-b border-r border-gray-300">Select</th>
                                    <th className="px-4 py-2 text-center text-[#145883] font-bold border-b border-r border-gray-300">Icon</th>
                                    <th className="px-4 py-2 text-center text-[#145883] font-bold border-b border-r border-gray-300">Payment Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentMethods.map((method, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2 text-center border-b border-r border-gray-300">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method.name}
                                                checked={selectedPayment === method.name}
                                                onChange={() => setSelectedPayment(method.name)}
                                                className="mr-2"
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-center border-b border-r border-gray-300">
                                            {/* Centering the icon with flex */}
                                            <div className="flex justify-center">
                                                <img src={method.icon} alt={`${method.name} icon`} className="w-20 h-8 object-contain" />
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-center  border-b border-r border-gray-300">{method.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end p-4 border-t space-x-2">
                    <button
                    style={{
                        background: "linear-gradient(180deg, #FF6347 0%, #B22222 100%)"
                      }}
                        className="rounded text-sm font-bold text-white px-4 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                    style={{
                        background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
                      }}
                        className="rounded text-sm font-bold text-white px-4 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
                        onClick={() => setSelectedPayment('')}
                    >
                        Back
                    </button>
                    <button
                    style={{
                        background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
                      }}
                        className="rounded text-sm font-bold text-white px-4 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
                        onClick={() => handleSubmit()}
                    >
                        Pay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
