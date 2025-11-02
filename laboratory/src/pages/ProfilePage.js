import React, { useContext } from 'react';
import Sidebar from '../components/Sidebar';
import { SidebarContext } from '../contexts/SidebarContext';
import { useAuth } from '../contexts/AuthContext';


const ProfilePage = () => {
  const userData = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '********',
    mobile: '+1234567890',
    gender: 'Male',
    dob: '1990-01-01'
  };

  const { isSidebarOpen } = useContext(SidebarContext);
  const { logout, user } = useAuth();

  const handleLogout = () => {
    // Show confirmation alert
    const isConfirmed = window.confirm("Are you sure you want to log out?");

    if (isConfirmed) {
      logout();
    } else {
      // If user presses "Cancel", do nothing
      console.log("User canceled logout");
    }
  };

  return (

    <>

      <Sidebar />


       <main
        id="mainContent"
        className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-0 sm:ml-0 lg:ml-80' : 'ml-0'}`}
      // style={{ marginLeft: isSidebarOpen ? '20rem' : '0' }} // Adjust the value to match your sidebar width
      >
        <div className="max-w-2xl mx-auto my-10 p-4 lg:space-y-8">

          {/* Align SVG and Title side by side */}
          <div className="flex flex-col space-y-4  lg:flex-row items-center justify-center lg:space-x-6">
            {/* SVG Icon */}
            <svg height='112' width="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="56" cy="56" r="56" fill="#E4EBEF" />
              <g clipPath="url(#clip0_419_59)">
                <path d="M56 58C60.3512 58 64.6047 56.7097 68.2225 54.2923C71.8404 51.875 74.6602 48.439 76.3254 44.419C77.9905 40.3991 78.4262 35.9756 77.5773 31.708C76.7284 27.4404 74.6331 23.5204 71.5564 20.4437C68.4796 17.3669 64.5596 15.2716 60.292 14.4227C56.0244 13.5739 51.6009 14.0095 47.581 15.6747C43.561 17.3398 40.1251 20.1596 37.7077 23.7775C35.2903 27.3953 34 31.6488 34 36C34.0058 41.833 36.3255 47.4254 40.4501 51.5499C44.5746 55.6745 50.167 57.9942 56 58ZM56 21.3333C58.9008 21.3333 61.7364 22.1935 64.1484 23.8051C66.5603 25.4167 68.4402 27.7073 69.5502 30.3873C70.6603 33.0673 70.9508 36.0163 70.3849 38.8613C69.8189 41.7064 68.4221 44.3197 66.3709 46.3709C64.3197 48.4221 61.7064 49.819 58.8613 50.3849C56.0163 50.9508 53.0673 50.6603 50.3873 49.5502C47.7073 48.4402 45.4167 46.5603 43.8051 44.1484C42.1935 41.7365 41.3333 38.9008 41.3333 36C41.3333 32.1102 42.8786 28.3796 45.6291 25.6291C48.3796 22.8786 52.1102 21.3333 56 21.3333Z" fill="#145883" />
                <path d="M56 65.3333C47.2508 65.343 38.8628 68.8228 32.6762 75.0094C26.4896 81.196 23.0097 89.5841 23 98.3332C23 99.3057 23.3863 100.238 24.0739 100.926C24.7616 101.614 25.6942 102 26.6667 102C27.6391 102 28.5718 101.614 29.2594 100.926C29.947 100.238 30.3333 99.3057 30.3333 98.3332C30.3333 91.526 33.0375 84.9976 37.8509 80.1842C42.6644 75.3707 49.1928 72.6666 56 72.6666C62.8072 72.6666 69.3356 75.3707 74.1491 80.1842C78.9625 84.9976 81.6667 91.526 81.6667 98.3332C81.6667 99.3057 82.053 100.238 82.7406 100.926C83.4282 101.614 84.3609 102 85.3333 102C86.3058 102 87.2384 101.614 87.9261 100.926C88.6137 100.238 89 99.3057 89 98.3332C88.9903 89.5841 85.5104 81.196 79.3238 75.0094C73.1372 68.8228 64.7492 65.343 56 65.3333Z" fill="#145883" />
              </g>
              <defs>
                <clipPath id="clip0_419_59">
                  <rect width="88" height="88" fill="white" transform="translate(12 14)" />
                </clipPath>
              </defs>
            </svg>

            {/* Title */}
            <h1 className="text-3xl font-bold  text-center">My Account</h1>
          </div>

          {/* Form Elements */}
          <div className="mb-4 mt-12 ">
            <label className="block text-[#565656] font-semibold lg:text-lg">Name</label>
            <input
              type="text"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 p-2 border-b-2"
              placeholder="Enter your Name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#565656] font-semibold lg:text-lg">Email Id</label>
            <input
              type="email"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 p-2 border-b-2"
              placeholder="Enter your Email Id"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#565656] font-semibold lg:text-lg">Password</label>
            <input
              type="password"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 p-2 border-b-2"
              placeholder="Enter your Password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#565656] font-semibold lg:text-lg">Mobile No.</label>
            <input
              type="number"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 p-2 border-b-2"
              placeholder="Enter your mobile number"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#565656] font-semibold lg:text-lg">Mobile No.</label>
            <input
              type="number"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 p-2 border-b-2"
              placeholder="Enter your mobile number"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#565656] font-semibold lg:text-lg">Address</label>
            <input
              type="text"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 p-2 border-b-2"
              placeholder="Enter your address"
            />
          </div>

          <div className="text-end space-x-2">
            <button
              style={{
                background: "linear-gradient(180deg, #145883 0%, #01263E 100%)"
              }}
              className=" rounded font-bold text-sm text-white px-6 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
            >
              Update
            </button>

            <button
              style={{
                background: "linear-gradient(180deg, #ff4c4c 0%, #8b0000 100%)"
              }}
              onClick={handleLogout}
              className=" rounded font-bold text-sm text-white px-6 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
            >
              Logout
            </button>
          </div>
        </div>
      </main>




    </>






  );
};

export default ProfilePage;
