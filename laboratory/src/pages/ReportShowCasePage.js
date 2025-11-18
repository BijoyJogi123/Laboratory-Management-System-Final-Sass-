import React, { useContext, useEffect, useState } from 'react'
import NavBar from '../components/Navbar/NavBar';
import Sidebar from '../components/Sidebar';
import { SidebarContext } from '../contexts/SidebarContext';
import Logo from '../assets/images/image.png'
import { useLocation, useNavigate } from 'react-router-dom';
// Assuming you have a NavBar component
import { Link } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';



const ReportShowCasePage = () => {

  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //for the signature

  const [signature, setSignature] = useState(null);
  const [Fetchsignature, setFetchsignature] = useState(null);


  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {}; // Handle the case where state is undefined

  console.log(data, "yeeeee hoo")

  const handleButtonClick = (flag) => {
    // Prevent the form from automatically submitting (if it's inside a form tag)
    // event.preventDefault();

    if (flag) {
      if (isSidebarOpen) {
        toggleSidebar();

        // Call the submitReport function
        submitReport();

        // Trigger the print dialog
        setTimeout(() => {
          window.print();
        }, 200);

        // Set the redirect after print
        window.onafterprint = () => {
          navigate('/patient-tests-list');
        };

      } else {
        submitReport();
        // Trigger the print dialog
        window.print();

        // Set the redirect after print
        window.onafterprint = () => {
          navigate('/patient-tests-list');
        };
      }
    } else {
      if (isSidebarOpen) {
        toggleSidebar();

        setTimeout(() => {
          window.print();
        }, 200);
      } else {
        window.print();

        // Set the redirect after print
        window.onafterprint = () => {
          navigate('/patient-tests-list');
        };
      }
    }
  };



  console.log(data.patient.doctor_sign, "boomyyy");



  const handleSignatureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignature(reader.result); // Store the base64 encoded signature
      };
      reader.readAsDataURL(file);
    }
  };


  const submitReport = async () => {
    const reportData = {

      doctor_sign: signature,  // assuming you're capturing doctor's remarks
      status: "Report Generated"

    };

    console.log(data.patient.sales_item_id, "nnopjdsapfgjajsdifj")

    console.log(reportData, "alshdkhadshj")

    try {
      const response = await api.put(`/patients/patient/sales/${data && data.patient.sales_item_id}`, reportData);

      if (!response.data) {
        throw new Error('Failed to submit report');
      }

      const result = response.data;
      console.log('Report submitted successfully:', result);
      // Navigate or show success message
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };



  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const len = buffer.length; // Use buffer.length for Uint8Array
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(buffer[i]);
    }
    return window.btoa(binary); // Encode the binary string as Base64
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Check if data and sales_id are defined before making the request
        if (data && data.patient && data.patient.sales_id) {
          const response = await api.get(`/patients/specific-patient/${data.patient.sales_id}`);
          const userData = response.data.patient || response.data;
          setPatient(userData); // Set the retrieved user data in state

          console.log(userData, "toooo Yooo")

        } else {
          throw new Error('Sales ID is not available');
        }

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData(); // Call the fetch function
  }, [data]); // Depend on data to refetch if it changes

  // Function to convert a byte array to Base64
  const byteArrayToBase64 = (byteArray) => {
    const binaryString = byteArray.map((byte) => String.fromCharCode(byte)).join('');
    return window.btoa(binaryString); // Convert binary string to Base64
  };



  useEffect(() => {
    if (data && data.patient.doctor_sign && data.patient.doctor_sign.data) {
      const byteArray = data.patient.doctor_sign.data;

      if (Array.isArray(byteArray)) {
        const uint8Array = new Uint8Array(byteArray);
        const base64String = arrayBufferToBase64(uint8Array);
        const base64Image = `data:image/png;base64,${base64String}`;

        console.log("Generated Base64 Image String:", base64Image); // Debugging line
        setFetchsignature(base64Image);
      }
    }
  }, [data]);




  // Function to convert ArrayBuffer/Uint8Array to Base64


  if (loading) {
    return <div>
      <div>
        <Sidebar />
        <main
          id="mainContent"
          className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-0 sm:ml-0 lg:ml-80' : 'ml-0'}`}
        // style={{ marginLeft: isSidebarOpen ? '20rem' : '0' }} // Adjust the value to match your sidebar width
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
        className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-0 sm:ml-0 lg:ml-80' : 'ml-0'}`}
      // style={{ marginLeft: isSidebarOpen ? '20rem' : '0' }} // Adjust the value to match your sidebar width
      >

        <div id="printable" className="form-section">

          <header className=" flex flex-col justify-center items-center p-2">

            {/* logo section */}

            <div className='flex items-center w-[40rem] lg:w-[60rem] justify-between py-4'>
              {/* Logo and Title Section */}
              <div className='flex items-center'>
                <img className='w-10 h-10' src={Logo} alt='logo' />
                <h1 className='text-3xl font-bold text-[#145883] ml-2'>HMS</h1>
              </div>

              {/* Contact Information Section */}
              <div className="text-start text-[#145883] italic text-xs font-semibold">
                <p>Near City center, Siliguri Darjeeling, 734001, West Bengal</p>
                <p>adgstsbg@gmail.com | www.hospotal.com</p>
                <p>Corporate Identity Number: 12345678rsvaf23erty</p>
              </div>
            </div>

            <h1 class="text-3xl underline font-semibold text-[#0C3C5B] mb-4">
              Department {data.patient && data.patient.department}
            </h1>
            


            {/* Patient data */}

            <div className="w-full max-w-5xl border-thin  rounded mx-auto">

              {/* Patient Info Section */}

              {/* <div className=' p-6'>

                <div className="flex justify-between">


                  <div className="space-y-2 ">
                  

                    <div className="grid grid-cols-6  items-center">
                      <p className="text-gray-700 text-sm lg:text-lg col-span-2 font-semibold">
                        <span className='font-bold'>Name</span>
                      </p>
                      <p className="text-gray-700 text-sm lg:text-lg col-span-1 font-semibold text-center">
                        <span className="font-bold text-sm lg:text-lg">:</span>
                      </p>
                      <p className="text-gray-700 text-sm lg:text-sm col-span-3 font-semibold ">
                        {patient && patient.patient_name}
                      </p>
                    </div>

                    <div className="grid grid-cols-6  items-center">
                      <p className="text-gray-700 text-sm lg:text-lg col-span-2 font-semibold">
                        <span className='font-bold'>Sex</span>
                      </p>
                      <p className="text-gray-700 text-sm lg:text-lg col-span-1 font-semibold text-center">
                        <span className="font-bold text-sm ">:</span>
                      </p>
                      <p className="text-gray-700 text-sm lg:text-sm col-span-3 font-semibold">
                        {patient && patient.gender}
                      </p>
                    </div>

                  </div>


                  <div className="space-y-2 ">
                  

                    <div className="grid grid-cols-6  items-center">
                      <p className="text-gray-700 text-sm lg:text-lg col-span-2 font-semibold">
                        <span className='font-bold'>Patient Id</span>
                      </p>
                      <p className="text-gray-700 text-lg col-span-1 font-semibold text-center">
                        <span className="font-bold text-lg">:</span>
                      </p>
                      <p className="text-gray-700 text-sm col-span-3 font-semibold">
                        {patient && patient.prn_id}
                      </p>
                    </div>

                    <div className="grid grid-cols-6  items-center">
                      <p className="text-gray-700 text-sm lg:text-lg col-span-2 font-semibold">
                        <span className='font-bold'>Refered By</span>
                      </p>
                      <p className="text-gray-700 text-lg col-span-1 font-semibold text-center">
                        <span className="font-bold text-lg">:</span>
                      </p>
                      <p className="text-gray-700 text-sm col-span-3 font-semibold">
                        {patient && patient.ref_doctor}
                      </p>
                    </div>



                  </div>



                  <div className="space-y-2 px-4">
              

                    <div className="grid grid-cols-5  items-center">
                      <p className="text-gray-700 text-sm lg:text-lg col-span-2 font-semibold">
                        <span className='font-bold'>Age</span>
                      </p>
                      <p className="text-gray-700 text-sm lg:text-lg col-span-1 font-semibold text-center">
                        <span className="font-bold text-lg">:</span>
                      </p>
                      <p className="text-gray-700 text-sm col-span-2 font-semibold">
                        {patient && patient.age}
                      </p>
                    </div>

                    <div className="grid grid-cols-5  items-center">
                      <p className="text-gray-700 text-sm lg:text-lg col-span-2 font-semibold">
                        <span className='font-bold'>Invoice Id</span>
                      </p>
                      <p className="text-gray-700 text-lg col-span-1 font-semibold text-center">
                        <span className="font-bold text-lg">:</span>
                      </p>
                      <p className="text-gray-700 text-sm col-span-2 font-semibold">
                        {patient && patient.invoice_id}
                      </p>
                    </div>

                   

                  </div>


                </div>


  


                <div className="flex justify-center items-center md:gap-12 mt-2 lg:mt-8">

                  <div className="space-y-2 px-2">
                

                    <div className="grid grid-cols-5  items-center">
                      <p className="text-gray-700 text-xs lg:text-sm col-span-2 font-semibold">
                        <span className='font-bold '>Patient Reg.</span>
                      </p>
                      <p className="text-gray-700 text-xs lg:text-sm col-span-1 font-semibold text-center">
                        <span className="font-bold text-xs lg:text-sm">:</span>
                      </p>
                      <p className="text-gray-700 text-xs lg:text-sm col-span-2 font-semibold">

                        {

                          new Intl.DateTimeFormat('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          }).format(new Date(patient && patient.created_at))

                        }
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 px-2">
                  

                    <div className="grid grid-cols-5  items-center">
                      <p className="text-gray-700 text-xs lg:text-sm col-span-2 font-semibold">
                        <span className='font-bold '>Reviced On</span>
                      </p>
                      <p className="text-gray-700 text-xs lg:text-sm col-span-1 font-semibold text-center">
                        <span className="font-bold text-xs lg:text-sm">:</span>
                      </p>
                      <p className="text-gray-700 text-xs lg:text-sm col-span-2 font-semibold">
                        {

                          new Intl.DateTimeFormat('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          }).format(new Date(data && data.patient.created_at))

                        }
                      </p>
                    </div>


                  </div>



                  <div className="space-y-2 px-2">
                

                    <div className="grid grid-cols-5  items-center">
                      <p className="text-gray-700 text-xs lg:text-sm col-span-2 font-semibold">
                        <span className='font-bold '>Reported On</span>
                      </p>
                      <p className="text-gray-700 text-xs lg:text-sm col-span-1 font-semibold text-center">
                        <span className="font-bold text-lg">:</span>
                      </p>
                      <p className="text-gray-700 text-xs lg:text-sm col-span-2 font-semibold">

                        {

                          new Intl.DateTimeFormat('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          }).format(new Date(data.patient.reports[0]?.reported_at))

                        }
                      </p>
                    </div>





                  </div>


                </div>


              </div> */}

              <div className="p-6">
                <div className="flex justify-between">
                  {/* Left Side */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <p className="text-gray-700 text-sm lg:text-lg font-semibold mr-2">Name:</p>
                      <p className="text-gray-700 text-sm lg:text-lg">{patient && patient.patient_name}</p>
                    </div>

                    <div className="flex items-center">
                      <p className="text-gray-700 text-sm lg:text-lg font-semibold mr-2">Sex:</p>
                      <p className="text-gray-700 text-sm lg:text-lg">{patient && patient.gender}</p>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <p className="text-gray-700 text-sm lg:text-lg font-semibold mr-2">Patient Id:</p>
                      <p className="text-gray-700 text-sm lg:text-lg">{patient && patient.prn_id}</p>
                    </div>

                    <div className="flex items-center">
                      <p className="text-gray-700 text-sm lg:text-lg font-semibold mr-2">Referred By:</p>
                      <p className="text-gray-700 text-sm lg:text-lg">{patient && patient.ref_doctor}</p>
                    </div>
                  </div>

                  {/* Middle Section */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <p className="text-gray-700 text-sm lg:text-lg font-semibold mr-2">Age:</p>
                      <p className="text-gray-700 text-sm lg:text-lg">{patient && patient.age}</p>
                    </div>

                    <div className="flex items-center">
                      <p className="text-gray-700 text-sm lg:text-lg font-semibold mr-2">Invoice Id:</p>
                      <p className="text-gray-700 text-sm lg:text-lg">{patient && patient.invoice_id}</p>
                    </div>
                  </div>
                </div>

                {/* Dates of the Reports */}
                <div className="flex justify-between items-center mt-6">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <p className="text-gray-700 text-xs lg:text-sm font-semibold mr-2">Patient Reg:</p>
                      <p className="text-gray-700 text-xs lg:text-sm">
                        {patient && new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(patient.created_at))}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <p className="text-gray-700 text-xs lg:text-sm font-semibold mr-2">Received On:</p>
                      <p className="text-gray-700 text-xs lg:text-sm">
                        {data && new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(data.patient.created_at))}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <p className="text-gray-700 text-xs lg:text-sm font-semibold mr-2">Reported On:</p>
                      <p className="text-gray-700 text-xs lg:text-sm">
                        {data.patient.reports[0] && new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(data.patient.reports[0].reported_at))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>




            </div>


          </header>



          <div className=" flex flex-col  border-thin  mx-auto max-w-5xl  rounded ">
            <table className="text-left bg-white mx-6">
              <thead>
                <tr className="text-[#145883]">
                  <th className=" px-4 py-2 underline text-base lg:text-xl font-bold uppercase ">
                    Test Name
                  </th>
                  <th className="text-center px-4 py-2 underline text-base lg:text-xl  font-bold uppercase ">
                    Results
                  </th>
                  <th className="text-center px-4 py-2 underline text-base lg:text-xl  font-bold uppercase ">
                    Unit
                  </th>
                  <th className="text-center px-4 py-2 underline text-base lg:text-xl  whitespace-nowrap font-bold uppercase ">
                    Reference Value
                  </th>

                </tr>
              </thead>
              <tbody>
                {/* Map through the report data */}
                {/* {data.patient.reports && data.patient.reports.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 font-semibold text-xs lg:text-lg text-gray-700">
                      {item.test_name} 
                    </td>
                    <td className="text-center px-4 py-2 font-semibold text-sm lg:text-lg text-gray-700 whitespace-nowrap">
                      {item.results} 
                    </td>
                    <td className="text-center px-4 py-2 font-semibold text-sm lg:text-lg text-gray-700 whitespace-nowrap">
                      {item.unit}
                    </td>
                    <td className="text-center px-4 py-2 font-semibold text-sm lg:text-lg text-gray-700 whitespace-nowrap">
                      {item.ref_value} 
                    </td>

                  </tr>

                ))} */}






                {data.patient.reports && data.patient.reports.length > 1 ? (
                  <>
                    {/* If there are multiple reports, show the item_name as a header */}
                    <tr>
                      <td
                        className="px-4 py-2 font-bold text-xs lg:text-lg text-gray-700 underline uppercase"
                        colSpan="4"
                      >
                        {data.patient.item_name} {/* This is the name of the report package */}
                      </td>
                    </tr>

                    {/* Loop through and display individual tests */}
                    {data.patient.reports.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 font-semibold text-xs lg:text-lg text-gray-700">
                          {item.test_name} {/* Test name */}
                        </td>
                        <td className="text-center px-4 py-2 font-semibold text-sm lg:text-lg text-gray-700 whitespace-nowrap">
                          {item.results} {/* Test results */}
                        </td>
                        <td className="text-center px-4 py-2 font-semibold text-sm lg:text-lg text-gray-700 whitespace-nowrap">
                          {item.unit} {/* Test unit */}
                        </td>
                        <td className="text-center px-4 py-2 font-semibold text-sm lg:text-lg text-gray-700 whitespace-nowrap">
                          {item.ref_value} {/* Test reference value */}
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <>
                    {/* If there's only a single test, show it directly */}
                    {data.patient.reports.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 font-bold text-xs  lg:text-lg text-gray-700">
                          {item.test_name} {/* Single test name */}
                        </td>
                        <td className="text-center px-4 py-2 font-semibold text-sm lg:text-lg text-gray-700 whitespace-nowrap">
                          {item.results} {/* Single test results */}
                        </td>
                        <td className="text-center px-4 py-2 font-semibold text-sm lg:text-lg text-gray-700 whitespace-nowrap">
                          {item.unit} {/* Single test unit */}
                        </td>
                        <td className="text-center px-4 py-2 font-semibold text-sm lg:text-lg text-gray-700 whitespace-nowrap">
                          {item.ref_value} {/* Single test reference value */}
                        </td>
                      </tr>
                    ))}
                  </>
                )}









                {/* Report status row */}
                <tr>
                  <td className="text-start px-4 py-2 font-semibold text-lg text-gray-700" colSpan={4}>
                    <div className='py-4'>
                      {/* Report Status */}
                      <p className='font-semibold text-sm '>
                        <span className='font-bold text-sm lg:text-lg'>Report Status: </span> {data.patient.status}
                      </p>

                      {/* Doctor Remark */}
                      <p className='font-semibold text-sm mt-2'>
                        <span className='font-bold text-sm'>Doctor Remark:</span> {data.patient.doctor_remark || 'N/A'}
                      </p>
                    </div>
                  </td>
                </tr>

                {/* Add more rows as needed */}
              </tbody>
            </table>


            <p className='py-2 text-lg text-[#145883]  font-bold  text-center'>*END OF REPORT*</p>
            {/* <p className='py-4  font-semibold  '><span className='font-bold text-lg'>Report Status:</span> Final </p> */}


            <div className="grid  grid-cols-2 gap-6 md:gap-12 ">

              <div className="space-y-2 px-4">
                {/* Input Fields - Left Side */}

                <div className="grid grid-cols-5  items-center">
                  <p className="text-gray-700 text-sm col-span-2 font-semibold">
                    <span className='font-bold text-sm'>Final Report Printed ON</span>
                  </p>
                  <p className="text-gray-700 text-sm col-span-1 font-semibold text-center">
                    <span className="font-bold text-lg">:</span>
                  </p>
                  <p className="text-gray-700 text-sm col-span-2 font-semibold">
                    {new Date().toLocaleDateString('en-GB')}
                  </p>

                  {/* <p className="text-gray-700 text-sm col-span-2 font-semibold">
                      <span className='font-bold '>Printed ON</span>
                    </p>
                    <p className="text-gray-700 text-sm col-span-1 font-semibold text-center">
                      <span className="font-bold text-lg">:</span>
                    </p>
                    <p className="text-gray-700 text-sm col-span-2 font-semibold">
                      29-09-2024
                    </p> */}


                </div>





              </div>


              <div className="flex flex-col space-y-2 w-full max-w-sm mx-auto mb-2">
                {/* Doctor Selection Field */}
                <label className="text-sm font-semibold text-gray-700" htmlFor="doctorSelect">
                  Doctor Name
                </label>
                <select
                  id="doctorSelect"
                  className="text-sm w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#145883]"
                >
                  <option value="" disabled selected>
                    {data.patient.doctor_sign ? patient.ref_doctor : "-- Select Doctor --"}
                  </option>
                  <option value={patient && patient.ref_doctor}>{patient && patient.ref_doctor}</option>


                </select>




                {/* Display uploaded signature in a box */}
                <div className="mt-4 p-2">
                  <label className="block text-sm lg:text-lg font-medium text-gray-700 mb-2">Upload Doctor's Signature</label>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept="image/*"
                    id="signatureUpload"
                    onChange={handleSignatureUpload}
                    style={{ display: 'none' }}
                  />

                  {/* Clickable upload area */}
                  <div className="w-full h-20 border border-dashed border-gray-400 rounded-md flex items-center justify-center cursor-pointer">
                    {data && data.patient.doctor_sign && Fetchsignature ? (
                      // Display the doctor's signature if it already exists
                      <img
                        src={Fetchsignature} // Use the existing doctor's signature
                        alt="Doctor's Signature"
                        className="object-contain h-20"
                      />
                    ) : (
                      // Allow user to upload a signature if not already present
                      <div onClick={() => document.getElementById('signatureUpload').click()}>
                        {signature ? (
                          <img
                            src={signature}
                            alt="Doctor's Signature"
                            className="object-contain h-20"
                          />
                        ) : (
                          <p className="text-gray-500">Click here to upload signature</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Save Button */}

                {!data.patient.doctor_sign && !Fetchsignature ?

                  <button
                    type="submit"
                    style={{ background: "linear-gradient(180deg, #145883 0%, #01263E 100%)" }}
                    onClick={() => handleButtonClick(true)}
                    className="print-button hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Upload Report
                  </button>
                  :

                  <button
                    type="submit"
                    style={{ background: "linear-gradient(180deg, #145883 0%, #01263E 100%)" }}
                    onClick={() => { handleButtonClick(false) }}
                    className="print-button hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Print Report
                  </button>



                }
              </div>



            </div>



          </div>

          <footer className=''>
            <div className="flex flex-col space-y-4 justify-center items-center p-2">
              <p className='text-gray-600 italic text-sm font-semibold'>Keep The Records carefully and bring them along during your next visit</p>

            </div>
            <div className='bg-[#145883] max-w-5xl mx-auto print-visible'>
              <p className='text-white text-center italic text-sm py-3 text-lg font-semibold'>
                Keep The Records carefully and bring them along during your next visit
              </p>
            </div>
            <div className="flex flex-col justify-center items-center space-y-2 p-2">

              <p className='text-[#145883] italic text-sm font-semibold'>Near City center, Siliguri Darjeeling, 734001,West Bengal</p>

            </div>
          </footer>

        </div>

      </main>

    </>
  );
};

export default ReportShowCasePage;


