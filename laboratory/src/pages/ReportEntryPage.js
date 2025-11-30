import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../components/Navbar/NavBar'; // Assuming NavBar is imported
import { SidebarContext } from '../contexts/SidebarContext';
import Sidebar from '../components/Sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';
import { Link } from 'react-router-dom';



function ReportEntryPage() {

  const [patientType, setPatientType] = useState('');
  const { isSidebarOpen } = useContext(SidebarContext);


  const location = useLocation();
  const navigate = useNavigate();

  const { data } = location.state


  // Always declare hooks at the top level, outside of any conditionals
  const [patientTest, setPatientTests] = useState(data && data.patient);
  const [allItems, setAllItems] = useState([]);
  const [patients, setPatientst] = useState(null);
  const [loading, setLoading] = useState(true); // Manage loading state
  const [error, setError] = useState(null); // Manage error state

  const [remarks, setRemarks] = useState('');

  // State for storing tests and sub-tests
  const [tests, setTests] = useState([

    // {
    //   item_id: 1,
    //   item_name: "126252",
    //   price:"120",
    //   tax_slab:"130",
    //   unit: "mm/hr",
    //   ref_value: "1.00-3.00",
    //   created_at:"2024-10-17 00:44:08",
    //   results: "",
    //   subTests: [],
    // },

  ]);


  // Handle the change in input
  const handleRemarksChange = (e) => {
    setRemarks(e.target.value); // Update state with the input value
  };




  // console.log(patient,"This is the patient")

  // If patient data is missing, handle it with useEffect for redirection  
  useEffect(() => {
    if (!patientTest) {
      // If patient data is missing, redirect the user to another page (like the patient list)
      navigate('/patient-tests-list', { replace: true });
    }

    const fetchPatients = async () => {
      try {
        const response = await api.get(`/patients/specific-patient/${patientTest.sales_id}`);
        const patientData = response.data.patient || response.data;
        setPatientst(patientData); // Set the patient data
        setPatientType(patientData.patient_type);

        // console.log('Patient data:', patientData);
      } catch (error) {
        setError(error.message); // Handle error
      }
    };

    const fetchLabItem = async () => {
      try {
        // Fetch the lab item using patientTest.item_id
        const response = await api.get(`/tests/test/${patientTest.item_id}`);
        const labItemData = response.data.test || response.data;
        const labItemArray = Array.isArray(labItemData) ? labItemData : [labItemData];
        console.log('Lab item data:', labItemArray[0]?.related_test);

        // Assuming `related_test` is a string of comma-separated test IDs
        const relatedTestIds = labItemArray[0]?.related_test?.split(',').map(Number); // Convert to array of numbers
        console.log('Related Test IDs:', relatedTestIds);

        // Make a POST request to fetch tests based on related test IDs
        const responseTests = await api.post('/reports/tests/fetch', {
          testIds: relatedTestIds // Sending the array of test IDs
        });

        // Assuming the response contains the tests
        const testsData = responseTests.data;
        setTests(testsData)
        console.log('Fetched Tests:', testsData);

        // Update your state with the fetched tests
        // setFilteredTests(testsData); // Add related tests to the state

      } catch (error) {
        setError(error.message); // Handle error
      } finally {
        setLoading(false); // Disable loading after fetch
      }
    };



    const fetchAllItem = async () => {
      try {
        const response = await api.get('/tests/all-tests');
        setAllItems(response.data);

        // console.log('All items:', response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    // Fetch both patient and lab item data
    const fetchData = async () => {
      await fetchPatients();
      await fetchAllItem();
      await fetchLabItem();
    };

    fetchData();

  }, [patientTest, navigate]);


 


  const submitReport = async () => {
    console.log("yeeaaaaaaaaa", tests);
  
    const reportData = {
      sales_item_id: patientTest.sales_item_id,
      testReports: tests
    };
  
    const doctorRemarkData = {
      doctor_remark: remarks ,
      status:"Sample Received" 
    };
  
    try {
      // 1. Submit the report
      const reportResponse = await api.post('/reports/submit', reportData);
      const reportResult = reportResponse.data;
      console.log('Report submitted successfully:', reportResult);

      // 2. Submit the doctor's remark
      const remarkResponse = await api.put(`/patients/patient/sales/${patientTest.sales_item_id}`, doctorRemarkData);
      const remarkResult = remarkResponse.data;
      console.log('Doctor\'s remark updated successfully:', remarkResult);

      // 3. Fetch the updated report after the remark update
      const reportFetchResponse = await api.get(`/reports/report/${patientTest.sales_item_id}`);
      const reports = reportFetchResponse.data;
  
      if (reports.length > 0) {
        // Update patient status and report availability
        const patient = {
          ...patientTest,
          status: 'Sample Received',  // Update status if reports are found
          isReportAvailable: true,    // Set flag to indicate report is available
          reports                     // Add the reports data
        };
  
        console.log(patient, "Updated patient with reports");
  
        // 4. Navigate to the report showcase page with updated patient data
        navigate("/report-showcase", {
          state: { data: { patient } }  // Pass updated patient object in state
        });
      } else {
        console.log("No reports found for the patient");
      }
  
    } catch (error) {
      console.error('Error during report submission or update:', error);
      // Handle the error scenario (e.g., show an error message)
    }
  };
  




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





  return (
    <div>
      {/* Navbar */}
      {/* <div>
        <NavBar />
      </div> */}
      <Sidebar />

       <main
        id="mainContent"
        className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-0 sm:ml-0 lg:ml-80' : 'ml-0'}`}
      // style={{ marginLeft: isSidebarOpen ? '20rem' : '0' }} // Adjust the value to match your sidebar width
      >

        {/* Main Content */}
        <div className=''>
          <div className="relative overflow-x-auto p-4 max-w-7xl mx-auto items-center px-6 md:px-8 lg:px-8 py-2">


            {/* PAGE TITLE */}

            <h1 className="text-3xl  text-black font-bold py-4 px-3 my-2">Report Entry</h1>


            <div className='w-full bg-[#E4EBEF]'>

              <h1 className="text-2xl  text-[#145883] font-bold py-4 px-3">Patients Details</h1>

            </div>


            {/* Form */}
            <div className="bg-white shadow-lg  p-8 mb-6">
              <form className="grid grid-cols-1 md:grid-cols-2 md:gap-12 md:mx-8">

                {/* Left Column */}
                <div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2  items-center">
                    {/* Input Fields - Left Side */}
                    <label className={`block text-lg text-gray-600 font-semibold`}>
                      Add Id
                    </label>
                    <input
                      type="text"
                      placeholder="Enter admission ID"
                      value={patients.addm_id}
                      className={`w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500`}
                      // Disable the input field if patientType is 'inpatient'
                      disabled={patientType === 'outpatient'}
                    />

                    <label className="block  text-lg  text-[#4D4D4D] font-semibold ">Name</label>
                    <input
                      value={patients.patient_name}
                      type="text"
                      placeholder="Enter first name"
                      className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500  focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />

                    <label className="block  text-lg  text-[#4D4D4D] font-semibold ">Mobile no</label>
                    <input
                      type="text"
                      value={patients.patient_contact}
                      placeholder="Enter first name"
                      className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500  focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />

                    <label className="block  text-lg  text-[#4D4D4D] font-semibold ">Gender</label>
                    <select
                      value={patients.gender}
                      className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500  focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>

                    </select>

                    <label className="block  text-lg  text-[#4D4D4D] font-semibold ">Referred By</label>
                    <input
                      value={patients.ref_doctor}
                      type="text"
                      placeholder="Enter Doctor Name"
                      className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500  focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-center">
                    {/* Input Fields - Right Side */}



                    <label className="block  text-lg  text-[#4D4D4D] font-semibold ">Report Status</label>
                    <select
                      // value={patientTest.status}
                      onChange={(e) => setPatientType(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500  focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="">{patientTest.status}</option>
                      <option value="inpatient">in-Progress</option>
                      <option value="outpatient">Sample Received</option>
                      <option value="Report-generated">Report Generated</option>

                    </select>



                    <label className="block  text-lg  text-[#4D4D4D] font-semibold ">Patient Status</label>
                    <select
                      value={patientType}
                      // onChange={(e) => setPatientType(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500  focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="">{patients.patient_type}</option>
                      <option value="inpatient">in-Patient</option>
                      <option value="outpatient">Out-Patient</option>


                    </select>

                    <label className="block  text-lg  text-[#4D4D4D] font-semibold ">Age</label>
                    <input
                      type="text"
                      value={patients.age}
                      placeholder="Enter Age"
                      className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500  focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />

                    <label className="block  text-lg  text-[#4D4D4D] font-semibold ">Blood Group</label>
                    <input
                      type="text"
                      value={patients.blood_group}
                      placeholder="Enter Blood Group"
                      className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500  focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />

                    <label className="block  text-lg  text-[#4D4D4D] font-semibold ">Address</label>
                    <input
                      value={patients.patient_address}
                      type="text"
                      placeholder="Enter Full Address"
                      className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500  focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />


                  </div>
                </div>




              </form>
            </div>



            <table className="w-full text-sm text-center rtl:text-right text-black">
              <thead className="text-lg text-[#145883] bg-[#F0F2F3]">
                <tr>
                  <th scope="col" className="px-6 py-3">Test ID</th>
                  <th scope="col" className="px-6 py-3">Items name</th>
                  <th scope="col" className="px-6 py-3">Results</th>
                  <th scope="col" className="px-6 py-3">Unit</th>
                  <th scope="col" className="px-6 py-3">Reference value</th>
                  {/* <th scope="col" className="px-6 py-3">Price</th> */}
                  {/* <th scope="col" className="px-6 py-3">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {tests.map((test, index) => (
                  <React.Fragment key={test.item_id}>
                    <tr className="bg-white border-b">
                      <th className="px-6 py-4 font-medium whitespace-nowrap text-black">{test.test_id}</th>
                      <td className="px-6 py-4">{test.test_name}</td>
                      <td className="px-6 py-4">
                        <input
                          placeholder="Enter value here"
                          type="number"
                          value={test.results}
                          onChange={(e) => {
                            const updatedTests = [...tests];
                            updatedTests[index].results = e.target.value;
                            setTests(updatedTests);
                          }}
                          className="border border-gray-400 placeholder-gray-800 rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="px-6 py-4">{test.unit}</td>
                      <td className="px-6 py-4">{test.ref_value}</td>
                      {/* <td className="px-6 py-4">
                        <button
                          onClick={() => addSubTest(index)}
                          style={{
                            background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
                          }}
                          className="rounded font-bold text-white px-4 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
                        >
                          Add test
                        </button>
                      </td> */}
                    </tr>



                  </React.Fragment>
                ))}
              </tbody>
            </table>

            <div className="mt-4">
              <label htmlFor="remarks" className="block text-sm lg:text-lg font-medium text-gray-700">
                Doctor's Remarks
              </label>
              <textarea
                id="remarks"
                name="remarks"
                rows="4"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Add doctor's remarks here..."
                value={remarks}  // Bind value to the state
                onChange={handleRemarksChange}  // Handle input change
              ></textarea>


            </div>


          </div>

          <div className="flex justify-center mt-6 mb-2 space-x-4"> {/* Center alignment and spacing between buttons */}
            {/* <button
              style={{
                background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
              }}
              className=" rounded font-bold text-lg text-white px-6 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
            >
              Edit
            </button> */}


            <button
              // to={"/report-showcase"}
              onClick={() => submitReport()}
              // state={{ data: { patientTest } }}
              style={{
                background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
              }}
              className=" rounded font-bold text-lg text-white px-6 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
            >
              Send for Approval
            </button>
            <Link
              to="/patient-tests-list"
              style={{
                background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
              }}
              className="rounded font-bold text-lg text-white px-6 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
            >
              Cancel
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReportEntryPage;
