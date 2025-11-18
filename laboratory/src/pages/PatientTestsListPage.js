import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { SidebarContext } from '../contexts/SidebarContext';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';

function PatientListPage() {
    const { isSidebarOpen } = useContext(SidebarContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientsTest, setPatientsTest] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch patients from the API
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await api.get('/patients/all-patients-tests');
                setPatientsTest(response.data);
                await checkReports(response.data); // Check for reports after fetching patients
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);



    // Fetch reports and update patients status
    const checkReports = async (patients) => {
        const updatedPatients = await Promise.all(patients.map(async (patient) => {
            try {
                const response = await api.get(`/reports/report/${patient.sales_item_id}`);
                const reports = response.data;

                // Check if reports exist
                if (reports && (Array.isArray(reports) ? reports.length > 0 : reports.report)) {
                    // Update status based on the current patient status
                    let updatedStatus = patient.status;

                    if (patient.status === 'In-Progress') {
                        updatedStatus = 'In-Progress'; // Keep status as 'In-Progress' if it's already in progress
                    } else if (patient.status === 'Sample Received') {
                        updatedStatus = 'Sample Received'; // If already marked as 'Sample Received', maintain it
                    } else {
                        updatedStatus = 'Report Generated'; // Set to 'Report Generated' if reports are found and no other status applies
                    }

                    return {
                        ...patient,
                        status: updatedStatus, // Set the updated status
                        isReportAvailable: true, // Flag to check if report exists
                        reports, // Include reports in the patient object
                    };
                }
            } catch (error) {
                console.error('Error fetching report for patient:', patient.sales_item_id, error);
            }

            // Return the patient with their original status if no reports found or status remains unchanged
            return {
                ...patient,
                isReportAvailable: false,
                status: patient.status // Maintain current status if no reports found
            };
        }));

        setPatientsTest(updatedPatients); // Update state with modified patients
    };


    // Filter patients based on search term
    const filteredPatients = patientsTest.filter((patient) =>
        patient.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.sales_item_id.toString().toLowerCase().includes(searchTerm.toLowerCase()) // Convert to string before applying toLowerCase
      );

    if (loading) {
        return <div>
            <div>
                <Sidebar />
                <main
                    id="mainContent"
                    className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
                    style={{ marginLeft: isSidebarOpen ? '20rem' : '0' }}
                >
                    <LoadingSpinner />
                </main>
            </div>
        </div>;
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
        </div>;
    }

    return (
        <div>
            <Sidebar />
            <main
                id="mainContent"
                className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-0 sm:ml-0 lg:ml-80' : 'ml-0'}`}
            // style={{ marginLeft: isSidebarOpen ? '20rem' : '0' }} // Adjust the value to match your sidebar width
            >
                <div className="mt-2">
                    <div className="relative overflow-x-auto p-4 max-w-7xl mx-auto items-center px-6 md:px-8 lg:px-8 py-2">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold text-gray-700">Test/Sample Tracking</h1>
                            {/* <input
                                type="text"
                                placeholder="Search by item or patient name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[#145883]"
                            /> */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by Name, Addmission id"
                                    className="text-sm px-4 py-2 border rounded border-[#767A7D] focus:outline-none focus:ring-2 focus:ring-gray-600 pr-10" // Added padding-right to make space for the icon
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

                        <table className="w-full text-sm text-center text-black">
                            <thead className="text-base text-[#145883] bg-[#F0F2F3]">
                                <tr>
                                    {/* <th className="px-6 py-3">Sales items</th>
                                    <th className="px-6 py-3">Sales ID</th>
                                    <th className="px-6 py-3">Item ID</th> */}
                                    <th className="px-6 py-3">Sl. no</th>
                                    <th className="px-6 py-3">Test id</th>
                                    <th className="px-6 py-3">Test name</th>
                                    <th className="px-6 py-3">Patient name</th>
                                    <th className="px-6 py-3">Collection date</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Reports</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.length > 0 ? (
                                    filteredPatients
                                        // .sort((a, b) => {
                                        //     const order = ["In-progress", "Sample Received", "Report Generated"];
                                        //     return order.indexOf(a.status) - order.indexOf(b.status);
                                        //   })   
                                        .sort((a, b) => {
                                            // Sort by 'created_at' field in descending order (latest first)
                                            const dateA = new Date(a.created_at);
                                            const dateB = new Date(b.created_at);
                                            return dateB - dateA; // Descending order
                                        })
                                        .map((patient, index) => (
                                            <tr key={patient.sales_item_id} className="bg-white border-b">
                                                {/* <td className="px-6 py-4">{patient.sales_item_id}</td>
                                            <td className="px-6 py-4">{patient.sales_id}</td>
                                            <td className="px-6 py-4">{patient.item_id}</td> */}

                                                <td className="px-6 py-4">{index + 1}</td>
                                                <td className="px-6 py-4">{patient.sales_item_id}</td>
                                                <td className="px-6 py-4">{patient.item_name}</td>
                                                <td className="px-6 py-4">{patient.patient_name}</td>
                                                <td className="px-6 py-4">{new Intl.DateTimeFormat('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                }).format(new Date(patient.created_at))}</td>
                                                <td className="px-6 py-4  text-xs">
                                                    <span className={`px-2 py-1 rounded ${patient.status === 'Sample Received' ? 'bg-blue-400' : patient.status === 'Report Generated' ? 'bg-green-400' : 'bg-yellow-400'} font-semibold`}>
                                                        {patient.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link
                                                        to={patient.isReportAvailable ? "/report-showcase" : "/report-entry"}
                                                        state={{ data: { patient } }}
                                                        style={{
                                                            background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
                                                        }}
                                                        className="text-xs whitespace-nowrap rounded font-bold text-white  px-4 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out">
                                                        {patient.status === 'Report Generated' || patient.status === 'Sample Received' ? 'View' : 'Update'}
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                            No matching records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default PatientListPage;
