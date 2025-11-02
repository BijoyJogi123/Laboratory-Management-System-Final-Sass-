import React, { useContext } from 'react'
import NavBar from '../components/Navbar/NavBar'
import Sidebar from '../components/Sidebar';
import { SidebarContext } from '../contexts/SidebarContext';

function TrackingPage() {

    const { isSidebarOpen } = useContext(SidebarContext);
    return (
        <div>
            {/* <div>
        <NavBar />
      </div> */}
            <Sidebar />


            <main
                id="mainContent"
                className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-0 sm:ml-0 lg:ml-80' : 'ml-0'}`}
            // style={{ marginLeft: isSidebarOpen ? '20rem' : '0' }} // Adjust the value to match your sidebar width
            >

                <div className='mt-2'>

                    <div className="relative overflow-x-auto p-4  max-w-7xl mx-auto  items-center px-6 md:px-8 lg:px-8   py-2">
                        {/* Header with Title and Search Box */}
                        <div className="flex justify-between items-center mb-4">
                            {/* Title */}
                            <h1 className="text-2xl font-bold text-gray-700">Report Lists</h1>

                            {/* Search Input Box with SVG Icon */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by Name"
                                    className="px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600 pr-10" // Added padding-right to make space for the icon
                                />
                                {/* Search Icon (SVG) */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#145883]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                                    />
                                </svg>
                            </div>
                        </div>




                        {/* Table */}
                        <table className="w-full text-sm text-left rtl:text-right text-black ">
                            <thead className="text-lg text-[#145883]  bg-[#F0F2F3]  ">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        SL No.
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Test ID
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Test Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Patient Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Collection Date
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Test Incharge
                                    </th>


                                </tr>
                            </thead>
                            <tbody>

                                <tr className="bg-white border-b ">
                                    <th
                                        scope="row"
                                        className="px-6 py-4 font-medium  whitespace-nowrap text-black"
                                    >
                                        1
                                    </th>

                                    <td className="px-6 py-4">12344</td>
                                    <td className="px-6 py-4">blood sugar</td>
                                    <td className="px-6 py-4">Siva bhakta</td>
                                    <td className="px-6 py-4">11/09/2024</td>
                                    <td className="px-6 py-4 bg-green-400 font-semibold ">Sample Recived</td>
                                    <td className="px-6 py-4 ">Dr Roma chakroborty</td>

                                </tr>


                                <tr className="bg-white border-b ">
                                    <th
                                        scope="row"
                                        className="px-6 py-4 font-medium  whitespace-nowrap text-black"
                                    >
                                        1
                                    </th>

                                    <td className="px-6 py-4">12345</td>
                                    <td className="px-6 py-4">blood sugar</td>
                                    <td className="px-6 py-4">Ram bhakta</td>
                                    <td className="px-6 py-4">11/09/2024</td>
                                    <td className="px-6 py-4 bg-red-400 font-semibold">Sample Pending</td>
                                    <td className="px-6 py-4 ">Dr Roma chakroborty</td>

                                </tr>
                                <tr className="bg-white border-b ">
                                    <th
                                        scope="row"
                                        className="px-6 py-4 font-medium  whitespace-nowrap text-black"
                                    >
                                        1
                                    </th>

                                    <td className="px-6 py-4">12345</td>
                                    <td className="px-6 py-4">blood sugar</td>
                                    <td className="px-6 py-4">Hanuman bhakta</td>
                                    <td className="px-6 py-4">11/09/2024</td>
                                    <td className="px-6 py-4 bg-yellow-400 font-semibold">In-progress</td>
                                    <td className="px-6 py-4 ">Dr Roma chakroborty</td>

                                </tr>


                            </tbody>
                        </table>
                    </div>

                </div>
            </main>





        </div>
    )
}

export default TrackingPage
