import React, { useContext, useEffect, useState } from 'react';

import Sidebar from '../components/Sidebar';
import { SidebarContext } from '../contexts/SidebarContext';
import Modal2 from '../components/Modal2'
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

function PatientEntryPage() {

  const navigate = useNavigate();
  const { isSidebarOpen } = useContext(SidebarContext);
  const [isModalOpen, setModalOpen] = useState(false);
  // const [selectedPatient, setSelectedPatient] = useState(null);

  // Patient Form data states

  const [patientType, setPatientType] = useState("");
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [gender, setGender] = useState("");
  const [refDoctor, setRefDoctor] = useState("");
  const [admissionId, setAdmissionId] = useState("");
  const [State, setState] = useState("");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [address, setAddress] = useState("");
  const [selectedPayment, setSelectedPayment] = useState('');
  const [totalPayment, settotalPayment] = useState('');

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];



  const openModal = () => {
    // setSelectedPatient(patient);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };


  const [rows, setRows] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({ item_id: '', item_name: '', price: 0, total_price: 0, tax_slab: 0, dis_perc: 0, tax_perc: 18, tax_slab: '0%' });



  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/tests/all-items');
        setAllItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleDelete = (id) => {
    const updatedRows = rows.filter(row => row.item_id !== id);
    setRows(updatedRows);
  };



  const handleEditClick = (rowId, item_id) => {
    const selectedItem = allItems.find(item => item.item_id === item_id);

    if (selectedItem) {
      // Log correct selected item for debugging
      console.log(rowId, "this is row id", selectedItem, "This is selected item");

      setEditRowId(rowId);

      // Ensure the state is updated with the selected item data
      setEditData({
        item_id: selectedItem.item_id,
        item_name: selectedItem.item_name,
        price: selectedItem.price,
        total_price: selectedItem.total_price, // Ensure this is correct in your `allItems` data
        tax_slab: selectedItem.tax_slab,
        dis_perc: selectedItem.dis_perc,
        tax_perc: selectedItem.tax_perc,
        tax_slab: selectedItem.tax_slab
      });
    }
  };


  const handleUpdate = (rowId) => {
    const updatedRows = rows.map(row => {
      if (row.item_id === rowId) {
        // Original price
        const originalPrice = parseFloat(editData.price);

        // Calculate discount
        const discountValue = editData.dis_perc > 0 ? (editData.dis_perc / 100) * originalPrice : 0;
        const priceAfterDiscount = originalPrice - discountValue;

        // Calculate tax
        const taxPerc = parseFloat(editData.tax_slab) || 0;
        const taxValue = (taxPerc / 100) * priceAfterDiscount;

        // Total price
        const totalPrice = priceAfterDiscount + taxValue;

        // Return the updated row

        console.log("Edit data after update:-", editData)

        return {
          ...row,
          item_id: editData.item_id,
          item_name: editData.item_name,
          price: originalPrice.toFixed(2),
          dis_perc: editData.dis_perc,
          dis_value: discountValue.toFixed(2),
          tax_perc: taxPerc,
          tax_slab: editData.tax_slab,
          tax_value: taxValue.toFixed(2),
          total_price: totalPrice.toFixed(2),
          test_status: "In-progress"
        };
      }
      return row;
    });

    // Update the rows with the updated data
    setRows(updatedRows);
    setEditRowId(null); // Exit edit mode
  };




  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'item_id') {
      const selectedItem = allItems.find(item => item.item_id == value); // Find selected item by its ID

      if (selectedItem) {
        // Use functional state update to ensure you get the latest `editData` value
        console.log("Before data:", selectedItem.item_id);

        setEditData(prevData => ({
          ...prevData,
          item_id: selectedItem.item_id,   // Update the selected item's ID
          item_name: selectedItem.item_name, // Update the name
          price: selectedItem.price, // Update the price
          tax_slab: selectedItem.tax_slab,
          tax_perc: selectedItem.tax_perc,
          dis_perc: selectedItem.dis_perc,
          total_price: selectedItem.total_price
        }));

        // To check if state has updated correctly, use useEffect
      }
    } else {
      // Use functional state update for other fields as well
      setEditData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  useEffect(() => {
    console.log("Updated editData:", editData);

  }, [editData]);





  // const handleTaxSelectChange = (e) => {
  //   const selectedTax = e.target.value;
  //   let taxPerc = 0;

  //   // Assign the tax percentage based on the selected option
  //   switch (selectedTax) {
  //     case 'IGST':
  //       taxPerc = 18; // IGST is 18%
  //       break;
  //     case 'CGST_SGST':
  //       taxPerc = 9 * 2; // CGST 9% + SGST 9%
  //       break;
  //     case 'UTGST':
  //       taxPerc = 12; // UTGST is 12%
  //       break;
  //     default:
  //       taxPerc = 0;
  //   }

  //   setEditData({
  //     ...editData,
  //     tax_slab: selectedTax,
  //     tax_perc: taxPerc
  //   });
  // };


  // Handle adding a new row
  const addRow = () => {
    const newRow = { item_id: rows.length + 1, item_name: 'New Item', price: 0, total_price: 0, dis_perc: 0, tax_perc: 0, tax_slab: "0%" }; // Changed to "New Item"
    setRows([...rows, newRow]);
  };


  // API request for sending data


  const handleCancel = () => {
    setPatientType('');
    setName('');
    setMobileNo('');
    setGender('');
    setRefDoctor('');
    setAdmissionId('');
    setState('');
    setAge('');
    setBloodGroup('');
    setAddress('');
  };


  // Function to calculate total payment from the rows (selected tests)
  const calculateTotalPayment = (items) => {
    return items.reduce((acc, item) => {
      // Ensure total_price is a string if it's a number or non-string type
      const price = typeof item.total_price === 'string'
        ? parseFloat(item.total_price.replace(/[^0-9.-]+/g, ''))  // Clean and parse if it's a string
        : parseFloat(item.total_price);  // Directly parse if it's a number

      // Check if price is a valid number
      if (!isNaN(price)) {
        return acc + price; // Add the valid price to the accumulator
      } else {
        return acc; // If price is invalid, skip it
      }
    }, 0);
  };

  // Use useEffect to recalculate totalPayment whenever rows change
  useEffect(() => {
    const total = calculateTotalPayment(rows);
    settotalPayment(total); // Update the totalPayment state
  }, [rows]); // Dependency array to trigger recalculation when rows change




  const handleSubmit = async () => {
    // e.preventDefault();



    // Validate required inputs
    if (!patientType) {
      toast.error('Patient type is required.');
      return;
    }
    if (!name) {
      toast.error('Patient name is required.');
      return;
    }
    if (!State) {
      toast.error('Enter yout State');
      return;
    }
    if (!mobileNo) {
      toast.error('Patient contact number is required.');
      return;
    }
    if (!gender) {
      toast.error('Gender is required.');
      return;
    }
    if (!age) {
      toast.error('Age is required.');
      return;
    }
    if (!rows || rows.length === 0) {
      toast.error('At least one test must be selected.');
      return;
    }




    // Generate a unique invoice ID: 'INV-YYYYMMDD-<salesId>'
    const generateInvoiceId = (salesId) => {
      const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Format as YYYYMMDD
      return `INV-${datePart}-${String(salesId).padStart(5, '0')}`;
    };


    // Calculate total payment
    const totalPayment = rows.reduce((acc, item) => {
      // Ensure total_price is treated as a valid number by removing commas and parsing as float
      const price = parseFloat(item.total_price.replace(/[^0-9.-]+/g, ''));

      // Check if price is a valid number
      if (!isNaN(price)) {
        return acc + price;
      } else {
        return acc; // If price is not valid, just return the accumulator without adding
      }
    }, 0);


    console.log(totalPayment, "YEaaaa")

    console.log(selectedPayment, "YEaaaa boom")



    // Structure data to match the expected format
    const dataToSend = {
      patientData: {
        patient_type: patientType,
        addm_id: patientType === 'inpatient' ? admissionId : null,
        patient_name: name,
        state: State,
        patient_contact: mobileNo,
        gender: gender,
        age: age,
        blood_group: bloodGroup,
        ref_doctor: refDoctor,
        patient_address: address,
        invoice_id: null, // Placeholder, will be replaced after receiving salesId
        total_payment: totalPayment,
        payment_type: selectedPayment
      },
      testIds: rows, // Replace with actual testIds if dynamically set
    };

    // settotalPayment(totalPayment);

    console.log(dataToSend, "Sending Data:");

    try {
      const response = await api.post('/patients/add-patients', dataToSend);

      const result = response.data;
      if (result) {
        // console.log('Patient added successfully:', result);

        // toast.success('Successfully toasted!')

        // Extract the patient ID (sales_id) from the response
        const salesId = result.patient?.id || result.patientId;

        // Generate the invoice ID using the sales ID
        const invoiceId = generateInvoiceId(salesId);


        console.log(invoiceId,"This is boom")

        // Now update the backend with the generated invoice ID
        const updateResponse = await api.put(`/patients/patient/${salesId}`, { invoice_id: invoiceId });

        if (updateResponse.data) {
          console.log('Invoice ID updated successfully.');

          closeModal()

          // Redirect to PatientBillPage with the sales_id
          navigate(`/patient-invoice/${salesId}`);

          // Clear form or perform any other actions
          handleCancel();
        } else {
          console.error('Failed to update invoice ID.');
        }
      } else {
        console.error('Failed to add patient:', result);
      }
    } catch (error) {
      console.error('Error while adding patient:', error);
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

        <Toaster
          position="top-center"
          reverseOrder={false}
        />

        <div>
          {/* Navbar */}
          <div>


          </div>

          {/* Main Content */}
          <div className=''>
            <div className="relative overflow-x-auto p-4 max-w-7xl mx-auto items-center px-6 md:px-8 lg:px-8 py-2">


              {/* PAGE TITLE */}

              <h1 className="text-xl  lg:text-3xl  text-black font-bold py-3 px-3 my-2">New bill entry</h1>

              <div className='w-full bg-[#E4EBEF]'>

                <h1 className="text-lg md:text-xl lg:text-2xl  text-[#145883] font-bold py-4 px-3">Patients Details</h1>

              </div>


              {/* Form */}
              <div className="bg-white shadow-lg  p-8">
                <form id="patientForm" className="grid grid-cols-1 md:grid-cols-2 md:gap-12 md:mx-8">
                  {/* Left Column */}
                  <div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-center">
                      <label className="block text-lg text-[#4D4D4D] font-semibold">Patient Type</label>
                      <select
                        value={patientType}
                        onChange={(e) => setPatientType(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        <option value="">Patient Type</option>
                        <option value="inpatient">In-Patient</option>
                        <option value="outpatient">Out-Patient</option>
                      </select>

                      <label className="block text-lg text-[#4D4D4D] font-semibold">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter first name"
                        className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      />

                      <label className="block text-lg text-[#4D4D4D] font-semibold">Mobile no</label>
                      <input
                        type="text"
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)}
                        placeholder="Enter mobile number"
                        className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      />

                      <label className="block text-lg text-[#4D4D4D] font-semibold">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>

                      <label className="block text-lg text-[#4D4D4D] font-semibold">Referred By</label>
                      <input
                        type="text"
                        value={refDoctor}
                        onChange={(e) => setRefDoctor(e.target.value)}
                        placeholder="Enter Doctor Name"
                        className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-center">
                      <label className={`block text-lg ${patientType === "inpatient" ? "text-[#4D4D4D]" : "text-gray-300"} font-semibold`}>
                        Admission ID
                      </label>
                      <input
                        type="text"
                        value={admissionId}
                        onChange={(e) => setAdmissionId(e.target.value)}
                        placeholder="Enter admission ID"
                        className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        disabled={patientType === "outpatient"}
                      />

                      {/* Thisis  */}

                      <label className="block text-lg text-[#4D4D4D] font-semibold">Age</label>
                      <input
                        type="text"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Enter Age"
                        className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      />

                      <label className="block text-lg text-[#4D4D4D] font-semibold">Blood Group</label>
                      <input
                        type="text"
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        placeholder="Enter Blood Group"
                        className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      />

                      <label className="block text-lg text-[#4D4D4D] font-semibold">State</label>
                      <select
                        value={State}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        {states.map((stateName, index) => (
                          <option key={index} value={stateName}>
                            {stateName}
                          </option>
                        ))}
                      </select>

                      <label className="block text-lg text-[#4D4D4D] font-semibold">Address</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter Full Address"
                        className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div>
                {rows.length > 0 ? (
                  <table className="min-w-full bg-white border border-gray-500 shadow-lg rounded-lg mt-6">
                    <thead className="bg-[#E9EBEC]">
                      <tr>
                        <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500 w-[15%]">Sl-no</th>
                        <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500 w-[25%]">Item Name</th>
                        <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500 w-[12%]">Price</th>
                        <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500 w-[12%]">Discount(%)</th>
                        <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500 w-[12%]">Tax (%)</th>
                        <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500 w-[20%]">Total Price</th>
                        <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500 w-[12%]">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={row.item_id}>
                          <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">{index + 1}</td>
                          <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">
                            {editRowId === row.item_id ? (
                              <select
                                value={editData.item_id}
                                name="item_id"
                                onChange={handleInputChange}
                                className="py-3 ps-4 pe-9 w-full bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="" disabled>Choose</option>
                                {allItems.map(item => (
                                  <option key={item.item_id} value={item.item_id}>
                                    {item.item_name}  {item.item_id}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              row.item_name // Ensure you show the correct item name
                            )}
                          </td>
                          <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">
                            {editRowId === row.item_id ? (
                              <input
                                type="number"
                                name="price"
                                value={editData.price}
                                onChange={handleInputChange}
                                className="border p-1"
                              />
                            ) : (
                              row.price
                            )}
                          </td>
                          <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">
                            {editRowId === row.item_id ? (
                              <input
                                type="number"
                                name="dis_perc"
                                value={editData.dis_perc}
                                onChange={handleInputChange}
                                className="border p-1"
                              />
                            ) : (
                              row.dis_perc
                            )}
                          </td>
                          <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">
                            {editRowId === row.item_id ? (
                              <select
                                type="text"
                                name="tax_slab"
                                onChange={handleInputChange}
                                value={editData.tax_slab} // New field for tax type
                                // onChange={handleTaxSelectChange} // Function to handle tax selection
                                className="border p-1"
                              >
                                <option value={editData.tax_slab}>{editData.tax_slab}</option>
                                {/* <option value="CGST_SGST">CGST + SGST (9% + 9%)</option>
                                <option value="UTGST">UTGST (12%)</option> */}
                              </select>
                            ) : (
                              row.tax_perc + " %"// Display the selected tax type (IGST, CGST + SGST, or UTGST)
                            )}
                          </td>
                          <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">
                            {editRowId === row.item_id ? (
                              <input
                                type="number"
                                name="total_price"
                                value={row.total_price}
                                // onChange={handleInputChange}
                                className="border p-1"
                              />
                            ) : (
                              row.total_price
                            )}
                          </td>
                          <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">
                            <div className="flex  text-center items-center justify-center space-x-4">
                              {editRowId === row.item_id ? (
                                <button onClick={() => handleUpdate(row.item_id)} className="text-blue-600">Update</button>
                              ) : (
                                <>
                                  <button onClick={() => handleEditClick(row.item_id, row.item_id, row.price)} style={{
                                    background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
                                  }}
                                    className="rounded text-sm font-bold text-white px-4 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out">Edit</button>
                                  <button onClick={() => handleDelete(row.item_id)} style={{
                                    background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
                                  }}
                                    className="rounded text-sm font-bold text-white px-4 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out">Delete</button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  // Show a message when there are no tests
                  <div className="mt-6 text-center">
                    <p className="text-gray-600  text-lg">No tests available. Add a new test to get started.</p>
                  </div>
                )}

                <div className="flex justify-end mt-4">
                  <button
                    onClick={addRow}
                    className="flex items-center text-[#145883] bg-[#E9EBEC] px-4 py-2 hover:text-white hover:bg-blue-600 focus:outline-none"
                  >
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.944 10.56H10.896V16.768H6.672V10.56H0.624V6.656H6.672V0.448H10.896V6.656H16.944V10.56Z" fill="#145883" />
                    </svg>
                    <span className='px-2 font-bold'>{rows.length > 0 ? "Add more" : "Add Tests"}  </span>
                  </button>
                </div>
              </div>


              {/* <div className="flex justify-end mt-4 "> 
                <button
                 
                  className="flex items-center text-[#145883] bg-[#E9EBEC]  px-4 py-2 hover:text-white  hover:bg-blue-600 focus:outline-none">
                  <svg className='hover:text-white' width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.944 10.56H10.896V16.768H6.672V10.56H0.624V6.656H6.672V0.448H10.896V6.656H16.944V10.56Z" fill="#145883" />
                  </svg>
                  <span className='px-2 font-bold'>
                    Add More
                  </span>

                </button>
              </div> */}


              <div className="flex justify-center mt-6 space-x-4"> {/* Center alignment and spacing between buttons */}
                <button
                  type="button"
                  // onClick={() => document.getElementById('patientForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                  onClick={() => openModal()}
                  style={{
                    background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
                  }}
                  className="rounded font-bold text-lg text-white px-6 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
                  }}
                  className="rounded font-bold text-lg text-white px-6 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
                >
                  Cancel
                </button>
              </div>





            </div>
          </div>

        </div>
      </main>
      {/* Modal Component */}
      <Modal2
        isOpen={isModalOpen}
        onClose={closeModal}
        setSelectedPayment={setSelectedPayment}
        selectedPayment={selectedPayment}
        totalPayment={totalPayment}
        handleSubmit={handleSubmit}


      // patientDetails={selectedPatient}
      />

    </>






  );
}

export default PatientEntryPage;





// import React, { useContext, useEffect, useState } from 'react';
// import NavBar from '../components/Navbar/NavBar'; // Assuming NavBar is imported
// import Sidebar from '../components/Sidebar';
// import { SidebarContext } from '../contexts/SidebarContext';
// import Modal2 from '../components/Modal2'
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';


// function PatientEntryPage() {

//   const navigate = useNavigate();
//   const { isSidebarOpen } = useContext(SidebarContext);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState(null);

//   // Patient Form data states

//   const [patientType, setPatientType] = useState("");
//   const [name, setName] = useState("");
//   const [mobileNo, setMobileNo] = useState("");
//   const [gender, setGender] = useState("");
//   const [refDoctor, setRefDoctor] = useState("");
//   const [admissionId, setAdmissionId] = useState("");
//   const [State, setState] = useState("");
//   const [age, setAge] = useState("");
//   const [bloodGroup, setBloodGroup] = useState("");
//   const [address, setAddress] = useState("");


//   const openModal = (patient) => {
//     setSelectedPatient(patient);
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//   };


//   const [rows, setRows] = useState([]);
//   const [allItems, setAllItems] = useState([]);
//   const [editRowId, setEditRowId] = useState(null);
//   const [editData, setEditData] = useState({ item_id: '', item_name: '', price: 0, total_price: 0, tax_slab: '', dis_perc: 0, tax_perc: 18, tax_slab: 'IGST' });



//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await axios.get('${process.env.REACT_APP_API_URL}/api/tests/all-items');
//         setAllItems(response.data);
//       } catch (error) {
//         console.error('Error fetching items:', error);
//       }
//     };

//     fetchItems();
//   }, []);

//   const handleDelete = (id) => {
//     const updatedRows = rows.filter(row => row.item_id !== id);
//     setRows(updatedRows);
//   };

//   // const handleEditClick = (rowId, item_id, price) => {

//   //   const selectedItem = allItems.find(item => item.item_id === item_id);

//   //   setEditRowId(rowId);
//   //   console.log(rowId, "this is row id", selectedItem, "This is selected item")

//   //   setEditData({
//   //     item_id: selectedItem.item_id,
//   //     item_name: selectedItem.item_name,
//   //     price: selectedItem.price,
//   //     total_price: selectedItem.toatl_price,
//   //     tax_slab: selectedItem.tax_slab,
//   //     dis_perc: selectedItem.dis_perc,
//   //     tax_perc: selectedItem.tax_perc,
//   //     tax_slab: selectedItem.tax_slab
//   //   });
//   // };

//   const handleEditClick = (rowId, item_id) => {
//     const selectedItem = allItems.find(item => item.item_id === item_id);

//     if (selectedItem) {
//       // Log correct selected item for debugging
//       console.log(rowId, "this is row id", selectedItem, "This is selected item");

//       setEditRowId(rowId);

//       // Ensure the state is updated with the selected item data
//       setEditData({
//         item_id: selectedItem.item_id,
//         item_name: selectedItem.item_name,
//         price: selectedItem.price,
//         total_price: selectedItem.total_price, // Ensure this is correct in your `allItems` data
//         tax_slab: selectedItem.tax_slab,
//         dis_perc: selectedItem.dis_perc,
//         tax_perc: selectedItem.tax_perc,
//         tax_slab: selectedItem.tax_slab
//       });
//     }
//   };


//   // const handleUpdate = (rowId) => {

//   //   console.log(rows, "thissssssssssss")



//   //   const updatedRows = rows.map(row => {
//   //     if (row.item_id === rowId) {

//   //       console.log("the updated id is ", row.item_id, "and Rowid is ", rowId)
//   //       // Original price
//   //       const originalPrice = parseFloat(editData.price);

//   //       // Initialize variables for calculations
//   //       let discountValue = 0;
//   //       let priceAfterDiscount = originalPrice;

//   //       // Check if discount percentage is defined and greater than 0
//   //       if (editData.dis_perc && editData.dis_perc > 0) {
//   //         discountValue = (editData.dis_perc / 100) * originalPrice;
//   //         priceAfterDiscount = originalPrice - discountValue;
//   //       }

//   //       // GST calculation
//   //       const taxPerc = parseFloat(editData.tax_perc) || 0; // Default tax percentage is 0 if undefined
//   //       const taxValue = (taxPerc / 100) * priceAfterDiscount;

//   //       // Total price after applying discount and tax
//   //       const totalPrice = priceAfterDiscount + taxValue;

//   //       // Return updated row with calculated values
//   //       return {
//   //         ...row,
//   //         item_name: editData.item_name,
//   //         price: originalPrice.toFixed(2), // original price
//   //         dis_perc: editData.dis_perc, // discount percentage
//   //         dis_value: discountValue.toFixed(2), // discount value
//   //         tax_perc: taxPerc, // tax percentage
//   //         tax_slab: editData.tax_slab,
//   //         tax_value: taxValue.toFixed(2), // tax value
//   //         total_price: totalPrice.toFixed(2), // total price after discount and tax
//   //         test_status: "In-progress"
//   //       };
//   //     }
//   //     return row;
//   //   });

//   //   setRows(updatedRows);
//   //   setEditRowId(null); // Exit edit mode

//   //   console.log(updatedRows, "Updated Rows with Discount and Tax");
//   // };

//   const handleUpdate = (rowId) => {
//     const updatedRows = rows.map(row => {
//       if (row.item_id === rowId) {
//         // Original price
//         const originalPrice = parseFloat(editData.price);

//         // Calculate discount
//         const discountValue = editData.dis_perc > 0 ? (editData.dis_perc / 100) * originalPrice : 0;
//         const priceAfterDiscount = originalPrice - discountValue;

//         // Calculate tax
//         const taxPerc = parseFloat(editData.tax_perc) || 0;
//         const taxValue = (taxPerc / 100) * priceAfterDiscount;

//         // Total price
//         const totalPrice = priceAfterDiscount + taxValue;

//         // Return the updated row

//         console.log("Edit data after update:-",editData)

//         return {
//           ...row,
//           item_id:editData.item_id,
//           item_name: editData.item_name,
//           price: originalPrice.toFixed(2),
//           dis_perc: editData.dis_perc,
//           dis_value: discountValue.toFixed(2),
//           tax_perc: taxPerc,
//           tax_slab: editData.tax_slab,
//           tax_value: taxValue.toFixed(2),
//           total_price: totalPrice.toFixed(2),
//           test_status: "In-progress"
//         };
//       }
//       return row;
//     });

//     // Update the rows with the updated data
//     setRows(updatedRows);
//     setEditRowId(null); // Exit edit mode
//   };



//   // const handleInputChange = (e) => {
//   //   const { name, value } = e.target;

//   //   // Check if the 'item_id' is being changed
//   //   if (name === 'item_id') {
//   //     const selectedItem = allItems.find(item => item.item_id == value); // Find selected item by its ID

//   //     console.log(selectedItem,"these are the selected items",name,value)

//   //     if (selectedItem) {

//   //        console.log("Selected item_id: ",selectedItem.item_id)

//   //       setEditData({
//   //         ...editData,
//   //         item_id: selectedItem.item_id,   // Update the selected item's ID
//   //         item_name: selectedItem.item_name, // Update the name
//   //         price: selectedItem.price, // Update the price
//   //         tax_slab: selectedItem.tax_slab,
//   //         tax_perc: selectedItem.tax_perc,
//   //         dis_perc: selectedItem.dis_perc,
//   //         total_price:selectedItem.total_price

//   //       });

//   //       console.log("Set Edit data:- ",editData)
//   //     }
//   //   } else {
//   //     setEditData({ ...editData, [name]: value });

//   //     console.log("Else part one Set Edit data:- ",editData)
//   //   }
//   // };



//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (name === 'item_id') {
//       const selectedItem = allItems.find(item => item.item_id == value); // Find selected item by its ID

//       if (selectedItem) {
//         // Use functional state update to ensure you get the latest `editData` value
//         console.log("Before data:", selectedItem.item_id);

//         setEditData(prevData => ({
//           ...prevData,
//           item_id: selectedItem.item_id,   // Update the selected item's ID
//           item_name: selectedItem.item_name, // Update the name
//           price: selectedItem.price, // Update the price
//           tax_slab: selectedItem.tax_slab,
//           tax_perc: selectedItem.tax_perc,
//           dis_perc: selectedItem.dis_perc,
//           total_price: selectedItem.total_price
//         }));

//         // To check if state has updated correctly, use useEffect
//       }
//     } else {
//       // Use functional state update for other fields as well
//       setEditData(prevData => ({
//         ...prevData,
//         [name]: value
//       }));
//     }
//   };

//   useEffect(() => {
//     console.log("Updated editData:", editData);
//   }, [editData]);





//   const handleTaxSelectChange = (e) => {
//     const selectedTax = e.target.value;
//     let taxPerc = 0;

//     // Assign the tax percentage based on the selected option
//     switch (selectedTax) {
//       case 'IGST':
//         taxPerc = 18; // IGST is 18%
//         break;
//       case 'CGST_SGST':
//         taxPerc = 9 * 2; // CGST 9% + SGST 9%
//         break;
//       case 'UTGST':
//         taxPerc = 12; // UTGST is 12%
//         break;
//       default:
//         taxPerc = 0;
//     }

//     setEditData({
//       ...editData,
//       tax_slab: selectedTax,
//       tax_perc: taxPerc
//     });
//   };


//   // Handle adding a new row
//   const addRow = () => {
//     const newRow = { item_id: rows.length + 1, item_name: 'New Item', price: 0, total_price: 0, dis_perc: 0, tax_perc: 0, tax_slab: "IGST" }; // Changed to "New Item"
//     setRows([...rows, newRow]);
//   };


//   // API request for sending data


//   const handleCancel = () => {
//     setPatientType('');
//     setName('');
//     setMobileNo('');
//     setGender('');
//     setRefDoctor('');
//     setAdmissionId('');
//     setState('');
//     setAge('');
//     setBloodGroup('');
//     setAddress('');
//   };




//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   // Structure data to match the expected format
//   //   const dataToSend = {
//   //     patientData: {
//   //       patient_type: patientType,
//   //       addm_id: patientType === 'inpatient' ? admissionId : null,
//   //       patient_name: name,
//   //       state: State,
//   //       patient_contact: mobileNo,
//   //       gender: gender,
//   //       age: age,
//   //       blood_group: bloodGroup,
//   //       ref_doctor: refDoctor,
//   //       patient_address: address,
//   //       invoice_id:salesId
//   //     },
//   //     testIds: rows, // Replace with actual testIds if dynamically set
//   //   };

//   //   console.log(dataToSend, "Yooooo this One:--");

//   //   try {
//   //     const response = await fetch('${process.env.REACT_APP_API_URL}/api/patients/add-patients', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify(dataToSend),
//   //     });

//   //     const result = await response.json();
//   //     if (response.ok) {
//   //       console.log('Patient added successfully:', result);

//   //       // Extract the patient ID (sales_id) from the response
//   //       const salesId = result.patientId;

//   //       // Redirect to PatientBillPage with the sales_id
//   //       navigate(`/patient-invoice/${salesId}`);

//   //       // Clear form or perform any other actions
//   //       handleCancel();
//   //     } else {
//   //       console.error('Failed to add patient:', result);
//   //       // Handle error
//   //     }
//   //   } catch (error) {
//   //     console.error('Error while adding patient:', error);
//   //   }
//   // };


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Generate a unique invoice ID: 'INV-YYYYMMDD-<salesId>'
//     const generateInvoiceId = (salesId) => {
//       const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Format as YYYYMMDD
//       return `INV-${datePart}-${String(salesId).padStart(5, '0')}`;
//     };

//     // Structure data to match the expected format
//     const dataToSend = {
//       patientData: {
//         patient_type: patientType,
//         addm_id: patientType === 'inpatient' ? admissionId : null,
//         patient_name: name,
//         state: State,
//         patient_contact: mobileNo,
//         gender: gender,
//         age: age,
//         blood_group: bloodGroup,
//         ref_doctor: refDoctor,
//         patient_address: address,
//         invoice_id: null, // Placeholder, will be replaced after receiving salesId
//       },
//       testIds: rows, // Replace with actual testIds if dynamically set
//     };

//     console.log(dataToSend, "Sending Data:");

//     try {
//       const response = await fetch('${process.env.REACT_APP_API_URL}/api/patients/add-patients', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(dataToSend),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         console.log('Patient added successfully:', result);

//         // Extract the patient ID (sales_id) from the response
//         const salesId = result.patientId;

//         // Generate the invoice ID using the sales ID
//         const invoiceId = generateInvoiceId(salesId);

//         // Now update the backend with the generated invoice ID
//         const updateResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/patients/patient/${salesId}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ invoice_id: invoiceId }),
//         });

//         if (updateResponse.ok) {
//           console.log('Invoice ID updated successfully.');

//           // Redirect to PatientBillPage with the sales_id
//           navigate(`/patient-invoice/${salesId}`);

//           // Clear form or perform any other actions
//           handleCancel();
//         } else {
//           console.error('Failed to update invoice ID.');
//         }
//       } else {
//         console.error('Failed to add patient:', result);
//       }
//     } catch (error) {
//       console.error('Error while adding patient:', error);
//     }
//   };



//   return (
//     <>
//       {/* <NavBar /> */}
//       <Sidebar />

//       <main
//         id="mainContent"
//         className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
//         style={{ marginLeft: isSidebarOpen ? '20rem' : '0' }} // Adjust the value to match your sidebar width
//       >
//         <div>
//           {/* Navbar */}
//           <div>


//           </div>

//           {/* Main Content */}
//           <div className=''>
//             <div className="relative overflow-x-auto p-4 max-w-7xl mx-auto items-center px-6 md:px-8 lg:px-8 py-2">


//               {/* PAGE TITLE */}

//               <h1 className="text-3xl  text-black font-bold py-4 px-3 my-2">Patient Entry</h1>

//               <div className='w-full bg-[#E4EBEF]'>

//                 <h1 className="text-2xl  text-[#145883] font-bold py-4 px-3">Patients Details</h1>

//               </div>


//               {/* Form */}
//               <div className="bg-white shadow-lg  p-8">
//                 <form id="patientForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 md:gap-12 md:mx-8">
//                   {/* Left Column */}
//                   <div>
//                     <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-center">
//                       <label className="block text-lg text-[#4D4D4D] font-semibold">Patient Type</label>
//                       <select
//                         value={patientType}
//                         onChange={(e) => setPatientType(e.target.value)}
//                         className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                       >
//                         <option value="">Patient Type</option>
//                         <option value="inpatient">In-Patient</option>
//                         <option value="outpatient">Out-Patient</option>
//                       </select>

//                       <label className="block text-lg text-[#4D4D4D] font-semibold">Name</label>
//                       <input
//                         type="text"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         placeholder="Enter first name"
//                         className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                       />

//                       <label className="block text-lg text-[#4D4D4D] font-semibold">Mobile no</label>
//                       <input
//                         type="text"
//                         value={mobileNo}
//                         onChange={(e) => setMobileNo(e.target.value)}
//                         placeholder="Enter mobile number"
//                         className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                       />

//                       <label className="block text-lg text-[#4D4D4D] font-semibold">Gender</label>
//                       <select
//                         value={gender}
//                         onChange={(e) => setGender(e.target.value)}
//                         className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                       >
//                         <option value="">Select Gender</option>
//                         <option value="male">Male</option>
//                         <option value="female">Female</option>
//                       </select>

//                       <label className="block text-lg text-[#4D4D4D] font-semibold">Referred By</label>
//                       <input
//                         type="text"
//                         value={refDoctor}
//                         onChange={(e) => setRefDoctor(e.target.value)}
//                         placeholder="Enter Doctor Name"
//                         className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                       />
//                     </div>
//                   </div>

//                   {/* Right Column */}
//                   <div>
//                     <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-center">
//                       <label className={`block text-lg ${patientType === "inpatient" ? "text-[#4D4D4D]" : "text-gray-300"} font-semibold`}>
//                         Admission ID
//                       </label>
//                       <input
//                         type="text"
//                         value={admissionId}
//                         onChange={(e) => setAdmissionId(e.target.value)}
//                         placeholder="Enter admission ID"
//                         className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                         disabled={patientType === "outpatient"}
//                       />

//                       <label className="block text-lg text-[#4D4D4D] font-semibold">PRN ID</label>
//                       <input
//                         type="text"
//                         value={State}
//                         onChange={(e) => setState(e.target.value)}
//                         placeholder="Enter PRN ID"
//                         className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                       />

//                       <label className="block text-lg text-[#4D4D4D] font-semibold">Age</label>
//                       <input
//                         type="text"
//                         value={age}
//                         onChange={(e) => setAge(e.target.value)}
//                         placeholder="Enter Age"
//                         className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                       />

//                       <label className="block text-lg text-[#4D4D4D] font-semibold">Blood Group</label>
//                       <input
//                         type="text"
//                         value={bloodGroup}
//                         onChange={(e) => setBloodGroup(e.target.value)}
//                         placeholder="Enter Blood Group"
//                         className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                       />

//                       <label className="block text-lg text-[#4D4D4D] font-semibold">Address</label>
//                       <input
//                         type="text"
//                         value={address}
//                         onChange={(e) => setAddress(e.target.value)}
//                         placeholder="Enter Full Address"
//                         className="w-full px-3 py-2 text-sm bg-[#F1F2F7] rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                       />
//                     </div>
//                   </div>
//                 </form>
//               </div>

//               <div>
//                 {rows.length > 0 ? (
//                   <table className="min-w-full bg-white border border-gray-500 shadow-lg rounded-lg mt-6">
//                     <thead className="bg-[#E9EBEC]">
//                       <tr>
//                         <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500 w-1/7">Sl-No</th>
//                         <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500 w-2/7">Item Name</th>
//                         <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500 w-1/7">Price</th>
//                         <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500 w-1/7">Discount(%)</th>
//                         <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500 w-1/7">Tax</th>
//                         <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500 w-2/7">Total Price</th>
//                         <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500 w-1/7">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {rows.map((row, index) => (
//                         <tr key={row.item_id}>
//                           <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">{index + 1}</td>
//                           <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">
//                             {editRowId === row.item_id ? (
//                               <select
//                                 value={editData.item_id}
//                                 name="item_id"
//                                 onChange={handleInputChange}
//                                 className="py-3 ps-4 pe-9 w-full bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               >
//                                 <option value="" disabled>Choose</option>
//                                 {allItems.map(item => (
//                                   <option key={item.item_id} value={item.item_id}>
//                                     {item.item_name}  {item.item_id}
//                                   </option>
//                                 ))}
//                               </select>
//                             ) : (
//                               row.item_name // Ensure you show the correct item name
//                             )}
//                           </td>
//                           <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">
//                             {editRowId === row.item_id ? (
//                               <input
//                                 type="number"
//                                 name="price"
//                                 value={editData.price}
//                                 onChange={handleInputChange}
//                                 className="border p-1"
//                               />
//                             ) : (
//                               row.price
//                             )}
//                           </td>
//                           <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">
//                             {editRowId === row.item_id ? (
//                               <input
//                                 type="number"
//                                 name="dis_perc"
//                                 value={editData.dis_perc}
//                                 onChange={handleInputChange}
//                                 className="border p-1"
//                               />
//                             ) : (
//                               row.dis_perc
//                             )}
//                           </td>
//                           <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">
//                             {editRowId === row.item_id ? (
//                               <select
//                                 type="text"
//                                 name="tax_slab"
//                                 value={editData.tax_slab} // New field for tax type
//                                 onChange={handleTaxSelectChange} // Function to handle tax selection
//                                 className="border p-1"
//                               >
//                                 <option value="IGST">IGST (18%)</option>
//                                 <option value="CGST_SGST">CGST + SGST (9% + 9%)</option>
//                                 <option value="UTGST">UTGST (12%)</option>
//                               </select>
//                             ) : (
//                               row.tax_slab // Display the selected tax type (IGST, CGST + SGST, or UTGST)
//                             )}
//                           </td>
//                           <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">
//                             {editRowId === row.item_id ? (
//                               <input
//                                 type="number"
//                                 name="total_price"
//                                 value={row.total_price}
//                                 // onChange={handleInputChange}
//                                 className="border p-1"
//                               />
//                             ) : (
//                               row.total_price
//                             )}
//                           </td>
//                           <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">
//                             <div className="flex  text-center items-center justify-center space-x-4">
//                               {editRowId === row.item_id ? (
//                                 <button onClick={() => handleUpdate(row.item_id)} className="text-blue-600">Update</button>
//                               ) : (
//                                 <>
//                                   <button onClick={() => handleEditClick(row.item_id, row.item_id, row.price)} style={{
//                                     background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
//                                   }}
//                                     className="rounded text-sm font-bold text-white px-4 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out">Edit</button>
//                                   <button onClick={() => handleDelete(row.item_id)} style={{
//                                     background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
//                                   }}
//                                     className="rounded text-sm font-bold text-white px-4 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out">Delete</button>
//                                 </>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   // Show a message when there are no tests
//                   <div className="mt-6 text-center">
//                     <p className="text-gray-600  text-lg">No tests available. Add a new test to get started.</p>
//                   </div>
//                 )}

//                 <div className="flex justify-end mt-4">
//                   <button
//                     onClick={addRow}
//                     className="flex items-center text-[#145883] bg-[#E9EBEC] px-4 py-2 hover:text-white hover:bg-blue-600 focus:outline-none"
//                   >
//                     <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
//                       <path d="M16.944 10.56H10.896V16.768H6.672V10.56H0.624V6.656H6.672V0.448H10.896V6.656H16.944V10.56Z" fill="#145883" />
//                     </svg>
//                     <span className='px-2 font-bold'>{rows.length > 0 ? "Add more" : "Add Tests"}  </span>
//                   </button>
//                 </div>
//               </div>


//               {/* <div className="flex justify-end mt-4 "> 
//                 <button

//                   className="flex items-center text-[#145883] bg-[#E9EBEC]  px-4 py-2 hover:text-white  hover:bg-blue-600 focus:outline-none">
//                   <svg className='hover:text-white' width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M16.944 10.56H10.896V16.768H6.672V10.56H0.624V6.656H6.672V0.448H10.896V6.656H16.944V10.56Z" fill="#145883" />
//                   </svg>
//                   <span className='px-2 font-bold'>
//                     Add More
//                   </span>

//                 </button>
//               </div> */}


//               <div className="flex justify-center mt-6 space-x-4"> {/* Center alignment and spacing between buttons */}
//                 <button
//                   type="button"
//                   onClick={() => document.getElementById('patientForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
//                   style={{
//                     background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
//                   }}
//                   className="rounded font-bold text-lg text-white px-6 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
//                 >
//                   Save
//                 </button>

//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   style={{
//                     background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
//                   }}
//                   className="rounded font-bold text-lg text-white px-6 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
//                 >
//                   Cancel
//                 </button>
//               </div>





//             </div>
//           </div>

//         </div>
//       </main>
//       {/* Modal Component */}
//       <Modal2
//         isOpen={isModalOpen}
//         onClose={closeModal}
//       // patientDetails={selectedPatient}
//       />

//     </>






//   );
// }

// export default PatientEntryPage;



{/* <label className="mt-6 block font-bold text-xl  text-[#4D4D4D]  ">Group of Tests</label> */ }
{/* <table className="min-w-full bg-white border border-gray-500 shadow-lg rounded-lg mt-6">
                <thead className="bg-[#E9EBEC]">
                  <tr>
                    <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500  w-1/5">Sl-No</th>
                 
                    <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500 w-3/5">Test Name</th>
                    <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500">price</th>
                    <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                
                  <tr>
                    <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">1</td>
            
                    <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">Blood Test</td>
                    <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">50</td>
                    <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">
                      <div className="flex items-center justify-center space-x-4"> 
                        <button className="flex items-center justify-center">
                          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_227_855)">
                              <path d="M21.0833 4.125C21.0833 3.36561 20.4677 2.75 19.7083 2.75H16.247C15.6678 1.10675 14.1173 0.00558594 12.375 0H9.62497C7.88263 0.00558594 6.33219 1.10675 5.75297 2.75H2.29163C1.53224 2.75 0.916626 3.36561 0.916626 4.125C0.916626 4.88439 1.53224 5.5 2.29163 5.5H2.74997V16.9583C2.74997 19.7428 5.00721 22 7.79163 22H14.2083C16.9927 22 19.25 19.7428 19.25 16.9583V5.5H19.7083C20.4677 5.5 21.0833 4.88439 21.0833 4.125ZM16.5 16.9583C16.5 18.224 15.474 19.25 14.2083 19.25H7.79163C6.52598 19.25 5.49997 18.224 5.49997 16.9583V5.5H16.5V16.9583Z" fill="#747272" />
                              <path d="M8.70837 16.5C9.46776 16.5 10.0834 15.8844 10.0834 15.125V9.625C10.0834 8.86561 9.46776 8.25 8.70837 8.25C7.94899 8.25 7.33337 8.86561 7.33337 9.625V15.125C7.33337 15.8844 7.94899 16.5 8.70837 16.5Z" fill="#747272" />
                              <path d="M13.2916 16.5C14.051 16.5 14.6666 15.8844 14.6666 15.125V9.625C14.6666 8.86561 14.051 8.25 13.2916 8.25C12.5322 8.25 11.9166 8.86561 11.9166 9.625V15.125C11.9166 15.8844 12.5322 16.5 13.2916 16.5Z" fill="#747272" />
                            </g>
                            <defs>
                              <clipPath id="clip0_227_855">
                                <rect width="22" height="22" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </button>
                        <button className="flex items-center justify-center">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 20h9" stroke="#747272" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L8 18H5v-3L16.5 3.5z" stroke="#747272" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>

               
                  <tr>
                    <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">2</td>
                
                    <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">X-Ray</td>
                    <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">100</td>
                    <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">
                      <div className="flex items-center justify-center space-x-4">
                        <button className="flex items-center justify-center">
                          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_227_855)">
                              <path d="M21.0833 4.125C21.0833 3.36561 20.4677 2.75 19.7083 2.75H16.247C15.6678 1.10675 14.1173 0.00558594 12.375 0H9.62497C7.88263 0.00558594 6.33219 1.10675 5.75297 2.75H2.29163C1.53224 2.75 0.916626 3.36561 0.916626 4.125C0.916626 4.88439 1.53224 5.5 2.29163 5.5H2.74997V16.9583C2.74997 19.7428 5.00721 22 7.79163 22H14.2083C16.9927 22 19.25 19.7428 19.25 16.9583V5.5H19.7083C20.4677 5.5 21.0833 4.88439 21.0833 4.125ZM16.5 16.9583C16.5 18.224 15.474 19.25 14.2083 19.25H7.79163C6.52598 19.25 5.49997 18.224 5.49997 16.9583V5.5H16.5V16.9583Z" fill="#747272" />
                              <path d="M8.70837 16.5C9.46776 16.5 10.0834 15.8844 10.0834 15.125V9.625C10.0834 8.86561 9.46776 8.25 8.70837 8.25C7.94899 8.25 7.33337 8.86561 7.33337 9.625V15.125C7.33337 15.8844 7.94899 16.5 8.70837 16.5Z" fill="#747272" />
                              <path d="M13.2916 16.5C14.051 16.5 14.6666 15.8844 14.6666 15.125V9.625C14.6666 8.86561 14.051 8.25 13.2916 8.25C12.5322 8.25 11.9166 8.86561 11.9166 9.625V15.125C11.9166 15.8844 12.5322 16.5 13.2916 16.5Z" fill="#747272" />
                            </g>
                            <defs>
                              <clipPath id="clip0_227_855">
                                <rect width="22" height="22" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </button>
                        <button className="flex items-center justify-center">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 20h9" stroke="#747272" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L8 18H5v-3L16.5 3.5z" stroke="#747272" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
               
                </tbody>
              </table> */}

{/* <div>
                <table className="min-w-full bg-white border border-gray-500 shadow-lg rounded-lg mt-6">
                  <thead className="bg-[#E9EBEC]">
                    <tr>
                      <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500 w-1/5">Sl-No</th>
                      <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500 w-3/5">Test Name</th>
                      <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500">price</th>
                      <th className="px-4 py-2 text-left text-[#145883] font-bold border-b border-r border-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={row.id}>
                        <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">{index + 1}</td>
                        <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">
                          {editRowId === row.id ? (
                            <select
                              value={editData.test_name}
                              name="test_name"
                              onChange={handleInputChange}
                              className="py-3 ps-4 pe-9 w-full bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="" disabled>Choose</option>
                              {[
                                "Complete Blood Count (CBC)",
                                "Basic Metabolic Panel (BMP)",
                                "Comprehensive Metabolic Panel (CMP)",
                                "Liver Function Test (LFT)",
                                "Renal Function Test (RFT)",
                                "Lipid Profile",
                                "Thyroid Profile",
                                "Hemoglobin A1c (HbA1c)",
                                "Prothrombin Time/International Normalized Ratio (PT/INR)",
                                "Partial Thromboplastin Time (PTT)",
                                "Urinalysis",
                                "Blood Culture",
                                "Stool Culture",
                                "Microbiology",
                                "Genetic Testing",
                                "Serology",
                                "Vitamin D",
                                "Human Chorionic Gonadotropin (HCG)",
                                "COVID-19 Test",
                                "Polymerase Chain Reaction (PCR)",
                                "Allergy Testing"
                              ].map((test, index) => (
                                <option key={index} value={test}>
                                  {test}
                                </option>
                              ))}
                            </select>
                          ) : (
                            row.test_name
                          )}
                        </td>
                        <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">
                          {editRowId === row.id ? (
                            <input
                              type="number"
                              name="price"
                              value={editData.price}
                              onChange={handleInputChange}
                              className="border p-1"
                            />
                          ) : (
                            row.price
                          )}
                        </td>
                        <td className="px-4 py-2 border-b border-r border-gray-500 text-gray-600">
                          <div className="flex items-center justify-center space-x-4">
                            {editRowId === row.id ? (
                              <button onClick={() => handleUpdate(row.id)} className="text-blue-600">Update</button>
                            ) : (
                              <button onClick={() => handleEditClick(row.id, row.test_name, row.price)} className="text-green-600">Edit</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={addRow}
                    className="flex items-center text-[#145883] bg-[#E9EBEC] px-4 py-2 hover:text-white hover:bg-blue-600 focus:outline-none"
                  >
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.944 10.56H10.896V16.768H6.672V10.56H0.624V6.656H6.672V0.448H10.896V6.656H16.944V10.56Z" fill="#145883" />
                    </svg>
                    <span className='px-2 font-bold'>Add More</span>
                  </button>
                </div>
              </div> */}






