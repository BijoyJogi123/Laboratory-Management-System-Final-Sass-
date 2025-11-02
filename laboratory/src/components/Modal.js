import React, { useState } from 'react';

const Modal = ({ isOpen, onClose }) => {
    const [testType, setTestType] = useState('single'); // Manage test type selection
    const [selectedGroupTests, setSelectedGroupTests] = useState([]); // Manage group tests selection

    if (!isOpen) return null;

    // Function to handle group tests selection
    // const handleGroupTestsChange = (e) => {
    //     const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    //     setSelectedGroupTests(selectedOptions);
    // };

    const handleGroupTestsChange = (test) => {
        setSelectedGroupTests((prevSelected) => {
            if (prevSelected.includes(test)) {
                // Remove the test from the selection
                return prevSelected.filter(t => t !== test);
            } else {
                // Add the test to the selection
                return [...prevSelected, test];
            }
        });
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-[#145883]">Select Lab Tests</h2>
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
                    {/* Select Fields for Test Type and Lab Tests */}
                    <div className="mt-6">
                        <label className="block text-lg font-semibold text-[#4D4D4D]">Test Type</label>
                        <select
                            value={testType}
                            onChange={(e) => setTestType(e.target.value)}
                            className="w-full px-3 py-2 mt-2 text-sm bg-white rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            <option value="single">Single Test</option>
                            <option value="group">Group of Tests</option>
                        </select>


                        {testType === 'group' && (
                            <div className='mt-6'>
                                <label className="block text-lg font-semibold text-[#4D4D4D]">Package test Name</label>
                                <select
                                    value={testType}
                                    onChange={(e) => setTestType(e.target.value)}
                                    className="w-full px-3 py-2 mt-2 text-sm bg-white rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    <option value="Complete Blood Count">Complete Blood Count</option>
                                    <option value="Liver Function Test">Liver Function Test</option>
                                    <option value="Kidney Function Test">Kidney Function Test</option>
                                    <option value="Thyroid Profile">Thyroid Profile</option>
                                    <option value="Diabetes Profile">Diabetes Profile</option>
                                </select>

                            </div>

                        )}

                        {/* If group is selected, show multi-select field for tests */}
                        {testType === 'group' && (
                            <div className="mt-4">
                                <label className="block text-lg font-semibold text-[#4D4D4D]">Select Lab Tests</label>
                                <div className="mt-6 max-h-28 overflow-y-auto border  border-gray-500 rounded-lg">
                                    {[
                                        "Complete Blood Count (CBC)",
                                        "Basic Metabolic Panel (BMP)",
                                        "Comprehensive Metabolic Panel (CMP)",
                                        "Liver Function Test (LFT)",
                                        "Renal Function Test (RFT)",
                                        "Lipid Profile",
                                        "Thyroid Profile",
                                        "Hemoglobin A1c (HbA1c)",
                                        "Prothrombin Time/International Normalized Ratio (PT/INR)",
                                        "Partial Thromboplastin Time (PTT)",
                                        "Urinalysis",
                                        "Blood Culture",
                                        "Stool Culture",
                                        "Microbiology",
                                        "Genetic Testing",
                                        "Serology",
                                        "Vitamin D",
                                        "Human Chorionic Gonadotropin (HCG)",
                                        "COVID-19 Test",
                                        "Polymerase Chain Reaction (PCR)",
                                        "Allergy Testing"
                                    ].map((test, index) => (
                                        <label key={index} className="justify-between px-12 flex items-center mb-2 cursor-pointer">

                                            <span
                                                className={`p-2 rounded-lg ${selectedGroupTests.includes(test) ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}
                                            >
                                                {test}
                                            </span>

                                            <input
                                                type="checkbox"
                                                value={test}
                                                checked={selectedGroupTests.includes(test)} // Check if selected
                                                onChange={() => handleGroupTestsChange(test)} // Update selection
                                                className="mr-2"
                                            />

                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Selected Lab Tests */}
                    {testType === 'group' && selectedGroupTests.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-[#145883]">Selected Lab Tests</h3>



                            <table className="min-w-full bg-white border border-gray-500 shadow-lg rounded-lg mt-4">
                                <thead className="bg-[#E9EBEC]">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500">Sl-No</th>
                                        <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500">Test Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedGroupTests.map((test, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2 border-b border-r border-gray-500">{index + 1}</td>
                                            <td className="px-4 py-2 border-b border-r border-gray-500">{test}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end p-4 border-t">
                    <button
                        className="bg-[#145883] text-white px-4 py-2 rounded-lg hover:bg-[#123a5c] transition-all"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
