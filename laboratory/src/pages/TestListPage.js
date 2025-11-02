import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../components/Navbar/NavBar';
import Sidebar from '../components/Sidebar';
import { SidebarContext } from '../contexts/SidebarContext';
import axios from 'axios';

function TestListPage() {
  const { isSidebarOpen } = useContext(SidebarContext);

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false); // For modal visibility
  const [selectedTest, setSelectedTest] = useState(null); // To store the test being edited
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tests/all-tests`);
        setTests(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleEdit = (test) => {
    setSelectedTest(test);
    setModalOpen(true); // Open the modal
  };

  const handleDelete = async (TestId) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/tests/test/${TestId}`); // Adjust your endpoint if needed
        setTests(tests.filter((test) => test.test_id !== TestId)); // Remove from state
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleUpdateSave = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/tests/test/${selectedTest.test_id}`, selectedTest); // Update endpoint if needed
      setTests(tests.map((test) => (test.test_id === selectedTest.test_id ? selectedTest : test))); // Update in state
      setModalOpen(false); // Close the modal after saving
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setSelectedTest({ ...selectedTest, [e.target.name]: e.target.value });
  };

  // Filter tests based on searchQuery
  const filteredTests = tests.filter(
    (test) =>
      test.test_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.ref_value.toString().includes(searchQuery)
  );

  return (
    <div>
      <Sidebar />
       <main
        id="mainContent"
        className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-0 sm:ml-0 lg:ml-80' : 'ml-0'}`}
      // style={{ marginLeft: isSidebarOpen ? '20rem' : '0' }} // Adjust the value to match your sidebar width
      >
        <div className='mt-2'>
          <div className="relative overflow-x-auto p-4 max-w-7xl mx-auto items-center px-6 md:px-8 lg:px-8 py-2">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-700">Tests list</h1>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Name or Rate"
                  value={searchQuery} // Bind input value to searchQuery state
                  onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
                  className="px-2 py-1 lg:px-4 lg:py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600 pr-10"
                />
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
              <thead className="text-base text-[#145883]  whitespace-nowrap bg-[#F0F2F3]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left w-1/6">Test ID</th>
                  <th scope="col" className="px-6 py-3 text-left w-1/3">Test Name</th>
                  <th scope="col" className="px-6 py-3 text-center w-1/6">Unit</th>
                  <th scope="col" className="px-6 py-3 text-center w-1/4">Reference Value</th>
                  <th scope="col" className="px-6 py-3 text-center w-1/6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center px-6 py-4">Loading...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="text-center px-6 py-4 text-red-600">{error}</td>
                  </tr>
                ) : (
                  filteredTests.length > 0 ? (
                    filteredTests.map((test) => (
                      <tr key={test.test_id} className="bg-white border-b">
                        <td className="px-6 py-4 text-left">{test.test_id}</td>
                        <td className="px-6 py-4 text-left">{test.test_name}</td>
                        <td className="px-6 py-4 text-center">{test.unit}</td>
                        <td className="px-6 py-4 text-center">{test.ref_value}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(test)}
                              style={{
                                background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
                              }}
                              className="text-xs whitespace-nowrap rounded font-bold text-white px-4 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out">
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(test.test_id)}
                              style={{
                                background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
                              }}
                              className="text-xs whitespace-nowrap rounded font-bold text-white px-4 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center px-6 py-4">No tests found</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>


          </div>
        </div>

        {/* Modal for editing a test */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
              <h2 className="text-xl font-bold mb-4">Edit Test</h2>
              <form onSubmit={handleUpdateSave}>
                <div className="mb-4">
                  <label className="block text-gray-700">Test Name</label>
                  <input
                    type="text"
                    name="test_name"
                    value={selectedTest?.test_name || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Unit</label>
                  <input
                    type="text"
                    name="unit"
                    value={selectedTest?.unit || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Reference Value</label>
                  <input
                    type="text"
                    name="ref_value"
                    value={selectedTest?.ref_value || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                {/* <div className="mb-4">
                  <label className="block text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={selectedTest?.price || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div> */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    style={{
                      background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
                    }}
                    className="rounded font-bold  text-white px-4 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
                    }}
                    className="rounded font-bold  text-white px-4 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default TestListPage;
