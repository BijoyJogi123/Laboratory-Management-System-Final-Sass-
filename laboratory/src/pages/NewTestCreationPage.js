import React, { useContext, useState } from 'react'
// import NavBar from '../components/Navbar/NavBar'
import Sidebar from '../components/Sidebar';
import { SidebarContext } from '../contexts/SidebarContext';
import api from '../utils/api';



function NewTestCreationPage() {

  const { isSidebarOpen } = useContext(SidebarContext);

  // State to hold form input values
  const [test_name, setTestName] = useState('');
  // const [tax_slab, settaxSlab] = useState(0);
  const [unit, setUnit] = useState('');
  const [ref_value, setReferenceValue] = useState('');
  // const [price, setPrice] = useState('');


  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Prepare data to send
    const testData = {
      test_name,
      // price,
      // tax_slab,
      unit,
      ref_value,
      
    };

    try {
      // Send POST request to the backend
      const response = await api.post('/tests/create-test', testData);
      console.log('Data saved successfully:', response.data);
      // Optionally, reset form or provide feedback to the user
      setTestName('');
      setUnit('');
      setReferenceValue('');
      // setPrice('');
      // settaxSlab(0);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };



  return (
    <>
      {/* <NavBar /> */}
      <Sidebar />



       <main
        id="mainContent"
        className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-0 sm:ml-0 lg:ml-80' : 'ml-0'}`}
      // style={{ marginLeft: isSidebarOpen ? '20rem' : '0' }} // Adjust the value to match your sidebar width
      >
        {/* Wrapper for spacing to avoid title hiding behind the navbar */}
        <div className="mt-2  max-w-3xl xl:max-w-4xl mx-auto  items-center px-6 md:px-8 lg:px-8   py-2"> {/* Adjust the top margin based on the height of the navbar */}
          {/* Page Title */}
          <div className="text-start mb-8 ">
            <h1 className="text-4xl font-bold text-[#0C3C5B]">Create New Test</h1>
          </div>

          {/* Form Container */}
          <div className="mt-12 flex items-center justify-center">
            <div className="bg-[#E4EBEF] shadow-lg rounded-lg p-8 w-full border border-[#0C3C5B]">

              {/* Form Fields */}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 items-center">
                  {/* Test Name */}
                  <label className="block text-gray-700 text-lg font-bold">Test Name</label>
                  <input
                    type="text"
                    placeholder="Enter test name"
                    value={test_name}
                    onChange={(e) => setTestName(e.target.value)} // Update state
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Unit */}
                  <label className="block text-gray-700 text-lg font-bold">Unit</label>
                  <input
                    type="text"
                    placeholder="Enter unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)} // Update state
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Reference Value */}
                  <label className="block text-gray-700 text-lg font-bold">Reference Value</label>
                  <input
                    type="text"
                    placeholder="Enter reference value"
                    value={ref_value}
                    onChange={(e) => setReferenceValue(e.target.value)} // Update state
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Price */}
                  {/* <label className="block text-gray-700 text-lg font-bold">Price</label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)} // Update state
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  /> */}


                   {/* tax slab */}
                   {/* <label className="block text-gray-700 text-lg font-bold">tax slab</label>
                  <input
                    type="number"
                    placeholder="Enter tex slab"
                    value={tax_slab}
                    onChange={(e) => settaxSlab(e.target.value)} // Update state
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  /> */}

                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-12">
                  <button
                    type="submit"
                    style={{ background: 'linear-gradient(180deg, #145883 0%, #01263E 100%)' }}
                    className="bg-blue-500 text-lg w-24 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  )
}

export default NewTestCreationPage
