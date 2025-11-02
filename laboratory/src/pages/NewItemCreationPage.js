import React, { useContext, useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { SidebarContext } from '../contexts/SidebarContext';
import axios from 'axios';

function NewItemCreationPage() {
  const { isSidebarOpen } = useContext(SidebarContext);

  // State to hold form input values
  const [item_name, setItemName] = useState('');
  const [tax_slab, settaxSlab] = useState(2);
  const [unit, setUnit] = useState('1.00-2.00');
  const [ref_value, setReferenceValue] = useState('mm/hr');
  const [price, setPrice] = useState(0);
  const [department, setDepartment]= useState('');
  // Tests-related state
  const [allTests, setAllTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);

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

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Extract only the IDs of the selected tests
    const related_test = selectedTests.map((test) => test.test_id).join(',');

    // Prepare data to send
    const itemData = {
      item_name,
      department,
      price: parseFloat(price),
      tax_slab: parseInt(tax_slab, 10),
      unit,
      ref_value,
      related_test, // Send the selected test IDs
    };

    console.log(itemData, "bbooom")

    try {
      // Send POST request to the backend
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/tests/create-item`, itemData);
      console.log('Data saved successfully:', response.data);

      // Optionally, reset the form
      setItemName('');
      setUnit('');
      setDepartment('');
      setReferenceValue('');
      setPrice('');
      settaxSlab(0);
      setSelectedTests([]); // Clear selected tests after submission
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

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

  return (
    <>
      <Sidebar />
      <main
        id="mainContent"
        className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-0 sm:ml-0 lg:ml-80' : 'ml-0'}`}
      // style={{ marginLeft: isSidebarOpen ? '20rem' : '0' }} // Adjust the value to match your sidebar width
      >
        <div className="mt-2 max-w-3xl xl:max-w-4xl mx-auto items-center px-6 md:px-8 lg:px-8 py-2">
          <div className="text-start mb-8">
            <h1 className="text-4xl font-bold text-[#0C3C5B]">Create New Item</h1>
          </div>

          <div className="mt-12 flex items-center justify-center">
            <div className="bg-[#E4EBEF] shadow-lg rounded-lg p-8 w-full border border-[#0C3C5B]">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 items-center">

                  {/* Department */}
                  <label className="block text-gray-700 text-lg font-bold">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  >
                    <option value="">Select a department</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Immunology/Serology">Immunology/Serology</option>
                    <option value="Pathology">Pathology</option>
                    <option value="Molecular-Diagnostics">Molecular Diagnostics</option>
                    <option value="Cytogenetics">Cytogenetics</option>
                    <option value="Parasitology">Parasitology</option>
                  </select>




                  {/* Item Name */}
                  <label className="block text-gray-700 text-lg font-bold">Name</label>
                  <input
                    type="text"
                    value={item_name}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Enter Item name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  />

                  {/* Unit */}
                  {/* <label className="block text-gray-700 text-lg font-bold">Unit</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Enter unit"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  /> */}

                  {/* Reference Value */}
                  {/* <label className="block text-gray-700 text-lg font-bold">Reference Value</label>
                  <input
                    type="text"
                    value={ref_value}
                    onChange={(e) => setReferenceValue(e.target.value)}
                    placeholder="Enter reference value"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  /> */}

                  {/* Price */}
                  <label className="block text-gray-700 text-lg font-bold">Price</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  />

                  {/* Tax Slab */}
                  <label className="block text-gray-700 text-lg font-bold">Tax (%)</label>
                  <input
                    type="number"
                    value={tax_slab}
                    onChange={(e) => settaxSlab(e.target.value)}
                    placeholder="Enter Tax in %"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  />

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
                </div>

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

                {/* Submit Button */}
                <div className="flex justify-center mt-12">
                  <button
                    type="submit"
                    className="bg-blue-500 text-lg w-24 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
                    style={{ background: 'linear-gradient(180deg, #145883 0%, #01263E 100%)' }}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default NewItemCreationPage;
