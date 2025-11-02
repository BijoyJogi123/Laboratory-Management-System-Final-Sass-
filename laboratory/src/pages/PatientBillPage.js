import React, { useContext, useEffect, useState } from 'react'

import Sidebar from '../components/Sidebar';
import { SidebarContext } from '../contexts/SidebarContext';
import Logo from '../assets/images/image.png'

// Assuming you have a NavBar component

import LoadingSpinner from '../components/LoadingSpinner';

import { useParams } from 'react-router-dom';

const PatientBillPage = () => {

    const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);

    const [patientData, setPatientData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0); // State for storing total price
    const [totalTax, setTotalTax] = useState(0);

    const { sales_id } = useParams(); // Get the sales_id from the URL



    const handleButtonClick = (event) => {
        // Prevent the form from automatically submitting (if it's in a form tag)
        // event.preventDefault();


        if (isSidebarOpen) {
            toggleSidebar();
            setTimeout(() => {
                window.print();
            }, 200)
        }
        else {
            window.print();
        }

        // // Trigger the print dialog


    };

    console.log(sales_id, "This is the sales_id")

    useEffect(() => {
        const fetchPatientTests = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/patients/patient/${sales_id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch patient tests');
                }
                const data = await response.json();

                console.log("patient Tests", data);
                setPatientData(data); // Set the fetched data

                // Calculate total price from the fetched items (convert total_price string to number)
                const calculatedTotalPrice = data.reduce((acc, item) => {
                    return acc + parseFloat(item.total_price); // Convert total_price to a number
                }, 0);
                setTotalPrice(calculatedTotalPrice); // Update total price state


                // calculate the total GST TAX

                const calculateTotalTax = data.reduce((acc, item) => {
                    return acc + parseFloat(item.tax_value); // Convert total_price to a number
                }, 0);
                setTotalTax(calculateTotalTax);


            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (sales_id) {
            fetchPatientTests(); // Fetch patient tests using the sales_id
        }
    }, [sales_id]);



    // Function to convert ArrayBuffer/Uint8Array to Base64

    if (loading) {
        return <div>
            <div>
                <Sidebar />
                <main
                    id="mainContent"
                    className={`transition-all duration-300 ${isSidebarOpen ? 'ml-0' : 'ml-0'}`}
                    style={{ marginLeft: isSidebarOpen ? '20rem' : '0' }}
                >
                    <LoadingSpinner />
                </main>
            </div>
        </div>; // Show loading state
    }

    if (error) {
        return <div>
            <div>
                <Sidebar />
                <main
                    id="mainContent"
                    className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
                    style={{ marginLeft: isSidebarOpen ? '20rem' : '0' }}
                >
                    Some technical Issue ...
                </main>
            </div>
        </div>; // Show error message
    }



    return (
        <>

            <Sidebar />


            <main
                id="mainContent"
                className={`open-sans-boom transition-all duration-300 ${isSidebarOpen ? 'md:ml-0 sm:ml-0 lg:ml-80' : 'ml-0'}`}
            // style={{ marginLeft: isSidebarOpen ? '20rem' : '0' }} // Adjust the value to match your sidebar width
            >

                <div id="printable" className="form-section">

                    <div className="flex flex-col justify-center items-center p-2">

                        {/* logo section */}

                        <div className='flex items-center w-[40rem] lg:w-[60rem] justify-between py-1'>
                            {/* Logo and Title Section */}
                            <div className='flex flex-col items-center'>
                                <img className='w-12 h-12' src={Logo} alt='logo' />
                                <h1 className='text-3xl font-bold text-[#145883] ml-2'>HMS</h1>
                            </div>

                            {/* Contact Information Section */}
                            <div className="text-end justify-end items-center text-[#145883] italic text-xs font-semibold">
                                <p>Near City center, Siliguri</p>
                                <p>West Bengal,734001</p>
                                <p className='flex justify-end space-x-2'>
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_588_83)">
                                            <path d="M0.000195503 3.64047C0.000195503 8.09714 5.90936 14.0005 10.3602 14.0005C11.3344 14.0005 12.2444 13.633 12.9152 12.9621L13.4985 12.2913C14.1752 11.6146 14.1752 10.4713 13.4694 9.76547C13.4519 9.74797 12.046 8.6688 12.046 8.6688C11.346 8.0038 10.2435 8.0038 9.54936 8.6688L8.6977 9.3513C6.83103 8.55797 5.50686 7.22797 4.6552 5.29714L5.33186 4.44547C6.0027 3.7513 6.0027 2.64297 5.33186 1.9488C5.33186 1.9488 4.2527 0.542969 4.2352 0.525469C3.52936 -0.180365 2.38603 -0.180365 1.68019 0.525469L1.0677 1.0563C0.367695 1.75047 0.000195503 2.66047 0.000195503 3.63464V3.64047Z" fill="#145883" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_588_83">
                                                <rect width="14" height="14" fill="white" transform="matrix(-1 0 0 1 14 0)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <span>1234567890</span>
                                </p>
                                <p className='flex justify-end space-x-2'>
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_588_85)">
                                            <path d="M13.9732 3.23242L9.06267 8.14292C8.51513 8.68907 7.77335 8.99578 7 8.99578C6.22665 8.99578 5.48487 8.68907 4.93733 8.14292L0.0268333 3.23242C0.0186667 3.32459 0 3.40801 0 3.49959V10.4996C0.00092625 11.2729 0.308514 12.0142 0.855295 12.561C1.40208 13.1077 2.1434 13.4153 2.91667 13.4163H11.0833C11.8566 13.4153 12.5979 13.1077 13.1447 12.561C13.6915 12.0142 13.9991 11.2729 14 10.4996V3.49959C14 3.40801 13.9813 3.32459 13.9732 3.23242Z" fill="#145883" />
                                            <path d="M8.23792 7.31817L13.5661 1.98942C13.308 1.56144 12.9439 1.2072 12.5091 0.96085C12.0742 0.714505 11.5832 0.584373 11.0834 0.583008H2.91675C2.41696 0.584373 1.92596 0.714505 1.4911 0.96085C1.05624 1.2072 0.692195 1.56144 0.434082 1.98942L5.76225 7.31817C6.091 7.64561 6.53609 7.82945 7.00008 7.82945C7.46407 7.82945 7.90917 7.64561 8.23792 7.31817Z" fill="#145883" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_588_85">
                                                <rect width="14" height="14" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                    <span>hms@gmail.com</span>
                                </p>
                            </div>
                        </div>


                        <div className='bg-[#145883] w-full  my-2'>

                            <p className='text-xl font-bold  text-white text-center px-2 py-1'>Invoice</p>

                        </div>

                        {/* Patient data */}

                        <div className="w-full lg:max-w-5xl max-w-full border-thin rounded mx-auto">
                            <div className='p-4'>
                                <div className="flex justify-between space-x-4">
                                    <div className="space-y-2">
                                        {/* Patient Name */}
                                        <div className="flex items-center">
                                            <p className="text-black text-xs lg:text-sm font-semibold w-24">
                                                <span className="font-bold">Name</span>
                                            </p>
                                            <p className="text-black text-xs lg:text-sm font-semibold">: </p>
                                            <p className="text-black text-xs lg:text-sm font-semibold">
                                                {patientData[0].patient_name}
                                            </p>
                                        </div>

                                        {/* Addmission Id */}
                                        {patientData[0].addm_id && (
                                            <div className="flex items-center">
                                                <p className="text-black text-xs lg:text-sm font-semibold w-24">
                                                    <span className="font-bold">Adm. Id</span>
                                                </p>
                                                <p className="text-black text-xs lg:text-sm font-semibold">:</p>
                                                <p className="text-black text-xs lg:text-sm font-semibold">
                                                    {patientData[0].addm_id}
                                                </p>
                                            </div>
                                        )}

                                        {/* Sex */}
                                        <div className="flex items-center">
                                            <p className="text-black text-xs lg:text-sm font-semibold w-24">
                                                <span className="font-bold">Sex</span>
                                            </p>
                                            <p className="text-black text-xs lg:text-sm font-semibold">: </p>
                                            <p className="text-black text-xs lg:text-sm font-semibold">
                                                {patientData[0].gender}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {/* Invoice No. */}
                                        <div className="flex items-center">
                                            <p className="text-black text-xs lg:text-sm font-semibold w-24">
                                                <span className="font-bold">Invoice No.</span>
                                            </p>
                                            <p className="text-black text-xs lg:text-sm font-semibold">: </p>
                                            <p className="text-black text-xs lg:text-sm font-semibold">
                                                {patientData[0].invoice_id}
                                            </p>
                                        </div>

                                        {/* Bill Date */}
                                        <div className="flex items-center">
                                            <p className="text-black text-xs lg:text-sm font-semibold w-24">
                                                <span className="font-bold">Bill Date</span>
                                            </p>
                                            <p className="text-black text-xs lg:text-sm font-semibold">: </p>
                                            <p className="text-black text-xs lg:text-sm font-semibold">
                                                {new Date(patientData[0].created_at).getDate()}/
                                                {new Date(patientData[0].created_at).getMonth() + 1}/
                                                {new Date(patientData[0].created_at).getFullYear()}
                                            </p>
                                        </div>

                                        {/* Payment Type */}
                                        <div className="flex items-center">
                                            <p className="text-black text-xs lg:text-sm font-semibold w-24">
                                                <span className="font-bold">Payment</span>
                                            </p>
                                            <p className="text-black text-xs lg:text-sm font-semibold">: </p>
                                            <p className="text-black text-xs lg:text-sm font-semibold">
                                                {patientData[0].payment_type}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>



                    <div className="flex flex-col justify-center mx-auto lg:max-w-5xl max-w-full">
                        <table className="text-center bg-white w-full border-collapse border border-[#145883]">
                            <thead>
                                <tr className="text-[#145883] border border-[#145883]">
                                    <th className="px-2 py-1 text-xs lg:text-sm font-semibold tracking-wider border-r border-[#145883]">Sl No.</th>
                                    <th className="px-2 py-1 text-xs lg:text-sm font-semibold tracking-wider border-r border-[#145883]">Item Name</th>
                                    <th className="px-2 py-1 text-xs lg:text-sm font-semibold tracking-wider border-r border-[#145883]">Quantity</th>
                                    <th className="px-2 py-1 text-xs lg:text-sm font-semibold tracking-wider border-r border-[#145883]">MRP</th>
                                    <th className="px-2 py-1 text-xs lg:text-sm font-semibold tracking-wider border-r border-[#145883]">Discount(%)</th>
                                    <th className="px-2 py-1 text-xs lg:text-sm font-semibold tracking-wider border-r border-[#145883]">
                                        {patientData[0]?.state === "West Bengal" ? "CGST_SGST(%)" : "IGST(%)"}
                                    </th>
                                    <th className="px-2 py-1 text-xs lg:text-sm font-semibold tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Dynamically render rows with data */}
                                {patientData && patientData.map((item, index) => (
                                    <tr key={index} className="border-[#145883]">
                                        <td className="text-center px-2 py-1 text-xs lg:text-sm text-black border-r border-[#145883]">{index + 1}</td>
                                        <td className="px-2 py-1 text-xs lg:text-sm text-black border-r border-[#145883]">{item.item_name}</td>
                                        <td className="px-2 py-1 text-xs lg:text-sm text-black border-r border-[#145883]">1</td>
                                        <td className="px-2 py-1 text-xs lg:text-sm text-black border-r border-[#145883]">{item.price}</td>
                                        <td className="px-2 py-1 text-xs lg:text-sm text-black border-r border-[#145883]">{item.dis_perc}%</td>
                                        <td className="px-2 py-1 text-xs lg:text-sm text-black border-r border-[#145883]">{item.tax_perc}%</td>
                                        <td className="px-2 py-1 text-xs lg:text-sm text-black">{item.total_price}</td>
                                    </tr>
                                ))}

                                {/* Conditionally render empty rows only if the patientData length is less than 5 */}
                                {patientData.length < 5 &&
                                    [...Array(5 - patientData.length)].map((_, index) => (
                                        <tr key={index} className="border-[#145883]">
                                            <td className="text-center px-2 py-1 text-xs lg:text-sm text-black border-r border-[#145883]">&nbsp;</td>
                                            <td className="px-2 py-1 text-xs lg:text-sm text-black border-r border-[#145883]">&nbsp;</td>
                                            <td className="px-2 py-1 text-xs lg:text-sm text-black border-r border-[#145883]">&nbsp;</td>
                                            <td className="px-2 py-1 text-xs lg:text-sm text-black border-r border-[#145883]">&nbsp;</td>
                                            <td className="px-2 py-1 text-xs lg:text-sm text-black border-r border-[#145883]">&nbsp;</td>
                                            <td className="px-2 py-1 text-xs lg:text-sm text-black border-r border-[#145883]">&nbsp;</td>
                                            <td className="px-2 py-1 text-xs lg:text-sm text-black">&nbsp;</td>
                                        </tr>
                                    ))
                                }

                                {/* Total row */}
                                <tr className="border border-[#145883]">
                                    <td colSpan={6} className="text-right px-2 py-1 font-bold text-xs lg:text-sm text-black border-r border-[#145883]">TOTAL TAX:</td>
                                    <td className="px-2 py-1 font-bold text-xs lg:text-sm text-black">₹{totalTax}</td>
                                </tr>

                                {/* Grand Total row */}
                                <tr className="border border-[#145883]">
                                    <td colSpan={6} className="text-right px-2 py-1 font-bold text-xs lg:text-sm text-black border-r border-[#145883]">GRAND TOTAL:</td>
                                    <td className="px-2 py-1 font-bold text-xs lg:text-sm text-black">₹{totalPrice}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>












                    <div className="flex  justify-center items-center space-y-2 p-2 max-w-5xl mx-auto">
                        <span className='px-2 italic  text-xl font-bold'>Note:</span>
                        <p className=' italic   px-2'> Please retain this bill for future reference. For any queries regarding your tests, feel free to contact our lab. Thank you for trusting us with your health. </p>

                    </div>
                    <div className='bg-[#145883] max-w-5xl mx-auto print-visible'>
                        <p className='text-white text-2xl uppercase text-center italic text-sm py-3 text-lg font-semibold'>
                            Thank you for choosing us! Wishing you good health.
                        </p>
                    </div>


                    <div className="flex justify-center items-center my-4">
                        <button
                            type="submit"
                            style={{ background: "linear-gradient(180deg, #145883 0%, #01263E 100%)" }}
                            onClick={() => handleButtonClick()}
                            className="text-center print-button hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Print invoice
                        </button>
                    </div>



                </div>



            </main>

        </>
    );
};

export default PatientBillPage;


