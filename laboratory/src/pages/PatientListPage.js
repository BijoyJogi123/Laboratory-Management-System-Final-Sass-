import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { SidebarContext } from '../contexts/SidebarContext';
import Modal from '../components/Modal';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner'

function PatientListPage() {
    const { isSidebarOpen } = useContext(SidebarContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true); // Manage loading state
    const [error, setError] = useState(null); // Manage error state
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Fetch patients from the API
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await api.get('/patients/all-patients');
                setPatients(response.data); // Set the patient data
            } catch (error) {
                setError(error.message); // Handle error
            } finally {
                setLoading(false); // Disable loading after fetch
            }
        };

        fetchPatients();
    }, []);

    const openModal = (patient) => {
        setSelectedPatient(patient);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };


    const handleEdit = (patient) => {
        setSelectedPatient(patient);
        setModalOpen(true); // Open the modal
    };

    const handleUpdateSave = async (event) => {
        event.preventDefault();

        try {
            await api.put(`/patients/patient/${selectedPatient.sales_id}`, selectedPatient);
            setPatients(patients.map((patient) => (patient.item_id === selectedPatient.item_id ? selectedPatient : patient))); // Update in state
            setModalOpen(false); // Close the modal after saving
        } catch (err) {
            setError(err.message);
        }
    };

    //  To Delete patients

    const handleDelete = async (salesId) => {
        try {
            console.log("sales id", salesId)
            // Sending DELETE request to delete the patient by sales_id
            await api.delete(`/patients/patient/${salesId}`);

            // After deletion, update the patients list in the state by filtering out the deleted patient
            setPatients(patients.filter((patient) => patient.sales_id !== salesId));

            // Optionally, close the modal if it's related to the delete action
            setModalOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    // Filter patients based on search term
    const filteredPatients = patients.filter((patient) =>
        patient.patient_contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ( patient.addm_id && patient.addm_id.toLowerCase().includes(searchTerm.toLowerCase()) )
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

    const handleChange = (e) => {
        setSelectedPatient({ ...selectedPatient, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <Sidebar />
            <main
                id="mainContent"
                className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-0 sm:ml-0 lg:ml-80' : 'ml-0'}`}
            // style={{ marginLeft: isSidebarOpen ? '20rem' : '0' }} // Adjust the value to match your sidebar width
            >
                <div className="mt-2">
                    <div className="relative overflow-x-auto p-4 max-w-7xl mx-auto items-center px-2 md:px-8 lg:px-8 py-2">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-700">Manage Patients</h1>
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



                        {/* Table */}
                        <table className="w-full text-sm text-center text-black">
                            <thead className="text-base text-[#145883] bg-[#F0F2F3] whitespace-nowrap">
                                <tr>
                                    <th className="px-2 py-3">Sales id</th>
                                    <th className="px-2 py-3">Patient type</th>
                                    <th className="px-2 py-3">Addm id</th>
                                    <th className="px-2 py-3">Prn id</th>
                                    <th className="px-2 py-3">Patient</th>
                                    <th className="px-2 py-3">Gender</th>
                                    <th className="px-2 py-3">Doctor</th>
                                    <th className="px-2 py-3">Date</th>
                                    <th className="px-2 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.length > 0 ? (
                                    filteredPatients
                                    .sort((a, b) => {
                                        // Sort by 'created_at' field in descending order (latest first)
                                        const dateA = new Date(a.created_at);
                                        const dateB = new Date(b.created_at);
                                        return dateB - dateA; // Descending order
                                      })
                                    .map((patient) => (
                                        <tr key={patient.id} className="bg-white border-b">
                                            <td className="px-2 py-4">{patient.sales_id}</td>
                                            <td className="px-2 py-4">{patient.patient_type}</td>
                                            <td className="px-2 py-4">{patient.addm_id ? patient.addm_id : '_'}</td>
                                            <td className="px-2 py-4">{patient.prn_id}</td>
                                            <td className="px-2 py-4">{patient.patient_name}</td>
                                            <td className="px-2 py-4">{patient.gender}</td>
                                            <td className="px-2 py-4">{patient.ref_doctor}</td>
                                            <td className="px-2 py-4"> {
                                                new Intl.DateTimeFormat('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                }).format(new Date(patient.created_at))}</td>


                                            <td className="px-2 py-4 flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(patient)}
                                                    style={{
                                                        background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
                                                    }}
                                                    className="rounded font-bold text-sm  text-white px-2 py-1 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out">
                                                    Update
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(patient.sales_id)}
                                                    style={{
                                                        background: "linear-gradient(180deg, #FF5C5C 0%, #8B0000 100%)"
                                                    }}
                                                    className="rounded font-bold text-sm  text-white px-2 py-1 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out">
                                                    Delete
                                                </button>


                                                <button
                                                    onClick={() => navigate(`/patient-invoice/${patient.sales_id}`)}
                                                    style={{
                                                        background: "linear-gradient(180deg, #4CAF50 0%, #006400 100%)"
                                                    }}
                                                    className="rounded font-bold text-sm text-white px-2 py-1 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
                                                >
                                                    Invoice
                                                </button>
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

            {/* Modal Component */}
            {/* <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                patientDetails={selectedPatient}
            /> */}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto z-20">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Edit Patient</h2>
                        <form onSubmit={handleUpdateSave}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Patient Type</label>
                                <select
                                    name="patient_type"
                                    value={selectedPatient?.patient_type || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        handleChange(e); // Call the original handleChange function

                                        // If the selected patient type is 'outpatient', set addm_id to '-' and disable the input
                                        if (value === 'outpatient') {
                                            setSelectedPatient((prev) => ({
                                                ...prev,
                                                addm_id: '-', // Set addm_id to "-" when selecting "Out-Patient"
                                            }));
                                        } else {
                                            setSelectedPatient((prev) => ({
                                                ...prev,
                                                addm_id: '', // Clear addm_id when selecting "In-Patient"
                                            }));
                                        }
                                    }}
                                    className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    required
                                >
                                    <option value="">Select patient type</option>
                                    <option value="inpatient">In-Patient</option>
                                    <option value="outpatient">Out-Patient</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700">Admission ID</label>
                                <input
                                    type="text"
                                    name="addm_id"
                                    value={selectedPatient?.addm_id || ''}
                                    onChange={handleChange} // Keep this unchanged to allow input when enabled
                                    className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    disabled={selectedPatient?.patient_type === 'outpatient'} // Disable input if "Out-Patient" is selected
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Patient Name</label>
                                <input
                                    type="text"
                                    name="patient_name"
                                    value={selectedPatient?.patient_name || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">PRN ID</label>
                                <input
                                    type="text"
                                    name="prn_id"
                                    value={selectedPatient?.prn_id || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Patient Contact</label>
                                <input
                                    type="text"
                                    name="patient_contact"
                                    value={selectedPatient?.patient_contact || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Gender</label>
                                <select
                                    name="gender"
                                    value={selectedPatient?.gender || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    required
                                >
                                    <option value={selectedPatient?.gender || ''}>{selectedPatient?.gender}</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={selectedPatient?.age || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Blood Group</label>
                                <input
                                    type="text"
                                    name="blood_group"
                                    value={selectedPatient?.blood_group || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Referring Doctor</label>
                                <input
                                    type="text"
                                    name="ref_doctor"
                                    value={selectedPatient?.ref_doctor || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Patient Address</label>
                                <input
                                    type="text"
                                    name="patient_address"
                                    value={selectedPatient?.patient_address || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    required
                                />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    style={{
                                        background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
                                    }}
                                    className="rounded font-bold text-white px-4 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
                                    }}
                                    className="rounded font-bold text-white px-4 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



        </div>
    );
}

export default PatientListPage;
