import React, { useContext, useEffect, useState } from 'react';

import Sidebar from '../components/Sidebar';
import { SidebarContext } from '../contexts/SidebarContext';
import axios from 'axios';

function ItemListPage() {

  const { isSidebarOpen } = useContext(SidebarContext);

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false); // For modal visibility
  const [selectedItem, setSelectedTest] = useState(null); // To store the test being edited
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const [selectedTests, setSelectedTests] = useState([]);
  const [allTests, setAllTests] = useState([]);

  // Fetch all tests when the component loads
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tests/all-tests`);
        setAllTests(response.data); // Assume response.data is the array of tests
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };
    fetchTests();
  }, []);


  // Function to handle test selection
  const handleTestSelect = (event) => {
    const selectedTestId = parseInt(event.target.value);

    // Find the test details by ID
    const selectedTest = allTests.find((test) => test.test_id === selectedTestId);

    // Avoid adding duplicates
    if (selectedTest && !selectedTests.some((test) => test.test_id === selectedTestId)) {
      setSelectedTests([...selectedTests, selectedTest]);
    }
  };

  // Function to remove a selected test
  const handleRemoveTest = (testId) => {
    setSelectedTests(selectedTests.filter((test) => test.test_id !== testId));
  };


  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tests//all-items`);
        setTests(response.data);

        console.log(response.data, "Yea this is the port 3030")

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

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/tests/item/${itemId}`); // Adjust your endpoint if needed
        setTests(tests.filter((test) => test.item_id !== itemId)); // Remove from state

      } catch (err) {
        setError(err.message);
      }
    }
  };

  // const handleUpdateSave = async (event) => {
  //   event.preventDefault();
  //   try {
  //     await axios.put(`${process.env.REACT_APP_API_URL}/api/tests/item/${selectedItem.item_id}`, selectedItem); // Update endpoint if needed
  //     setTests(tests.map((test) => (test.item_id === selectedItem.item_id ? selectedItem : test))); // Update in state
  //     setModalOpen(false); // Close the modal after saving
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };


  const handleUpdateSave = async (event) => {
    event.preventDefault();

    // Map selected tests to generate the related_test field (comma-separated string of test IDs)
    const related_test = selectedTests.map((test) => test.test_id).join(',');

    // Add or update the `related_test` field in the selected item object
    const updatedItem = {
      ...selectedItem,
      related_test, // Ensure the related_test is part of the updated item
    };

    try {
      // Make the PUT request to update the item with the related_test included
      await axios.put(`${process.env.REACT_APP_API_URL}/api/tests/item/${selectedItem.item_id}`, updatedItem);

      // Update the local state with the modified item
      setTests(tests.map((test) => (test.item_id === selectedItem.item_id ? updatedItem : test)));

      // Close the modal after saving
      setModalOpen(false);
    } catch (err) {
      // Handle any error that occurs during the update
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setSelectedTest({ ...selectedItem, [e.target.name]: e.target.value });
  };

  // Filter tests based on searchQuery
  const filteredTests = tests.filter(
    (test) =>
      test.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-700">Items list</h1>
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
              <thead className="text-base text-[#145883] bg-[#F0F2F3] whitespace-nowrap">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left w-1/6">Item ID</th>
                  <th scope="col" className="px-6 py-3 text-left w-1/3">Name</th>
                  <th scope="col" className="px-6 py-3 text-center w-1/6">Reg Date</th>
                  <th scope="col" className="px-6 py-3 text-center w-1/4">Price</th>
                  <th scope="col" className="px-6 py-3 text-center w-1/4 ">Tests type</th>
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
                      <tr key={test.item_id} className="bg-white border-b">
                        <td className="px-6 py-4 text-left">{test.item_id}</td>
                        <td className="px-6 py-4 text-left">{test.item_name}</td>
                        <td className="px-6 py-4 text-center">
                          {new Date(test.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center">{test.price}</td>
                        <td className="px-6 py-4 text-center">
                          {test.related_test.includes(',')
                            ? "Group"  // If there are commas, it means it's a group
                            : "Single"} 
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(test)}
                              style={{
                                background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
                              }}
                              className="text-xs whitespace-nowrap rounded font-bold text-white px-6 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out">
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(test.item_id)}
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
              <h2 className="text-xl font-bold mb-4">Edit Item details</h2>
              <form onSubmit={handleUpdateSave}>
                <div className="mb-4">
                  <label className="block text-gray-700">Item Name</label>
                  <input
                    type="text"
                    name="item_name"
                    value={selectedItem?.item_name || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                {/* <div className="mb-4">
                  <label className="block text-gray-700">Unit</label>
                  <input
                    type="text"
                    name="unit"
                    value={selectedItem?.unit || ''}
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
                    value={selectedItem?.ref_value || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div> */}
                {/* <div className="mb-4">
                  <label className="block text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={selectedItem?.price || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div> */}
                {/* Test Selection */}
                <label className="block text-gray-700 text-lg font-bold">Related Tests</label>
                <select
                  onChange={handleTestSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                >
                  <option value="">Select a test</option>
                  {allTests.map((test) => (
                    <option key={test.test_id} value={test.test_id}>
                      {test.test_name}
                    </option>
                  ))}
                </select>

                {/* Display selected tests in a table */}
                {selectedTests && selectedTests.length > 0 && (
                  <div className="mt-8 ">
                    <h2 className="text-2xl font-bold text-[#0C3C5B] mb-4">Selected Tests</h2>
                    <table className="w-full bg-white table-auto border-collapse border border-gray-300">
                      <thead>
                        <tr>
                          <th className="border border-gray-300 px-4 py-2">Test Name</th>
                          <th className="border border-gray-300 px-4 py-2">Unit</th>
                          <th className="border border-gray-300 px-4 py-2">Ref value</th>
                          <th className="border border-gray-300 px-4 py-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTests && selectedTests.map((test) => (
                          <tr key={test.test_id}>
                            <td className="border border-gray-300 px-4 py-2">{test.test_name}</td>
                            <td className="border border-gray-300 px-4 py-2">{test.unit}</td>
                            <td className="border border-gray-300 px-4 py-2">{test.ref_value}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <button
                                type="button"
                                onClick={() => handleRemoveTest(test.test_id)}
                                className="text-red-500 hover:underline"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

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

export default ItemListPage;
