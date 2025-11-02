import React, { useState, useEffect, useContext } from 'react';
// import './Sidebar.css'; // Optional: move styles to a separate CSS file

import { SidebarContext } from '../contexts/SidebarContext';
import { HashLink } from 'react-router-hash-link';
// import Logo from '../../assets/images/image.png'
import Logo from '../assets/images/image.png'
import { Link } from 'react-router-dom';
// import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
const Sidebar = () => {
    //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [clientOpen, setClientOpen] = useState(false);
    const [testCategoryOpen, setTestCategoryOpen] = useState(false);
    const [ItemCategoryOpen, setItemCategoryOpen] = useState(false);
    const [ReportsOpen, setReportsOpen] = useState(false);


    useEffect(() => {
        const navbar = document.getElementById('navbar');
        const sidebar = document.getElementById('sidebar');
        sidebar.style.top = `${parseInt(navbar.clientHeight) - 1}px`;
    }, []);

    //   const toggleSidebar = () => {
    //     setIsSidebarOpen(!isSidebarOpen);
    //   };

    const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);

    return (
        <>
            {/* Navbar start */}
            <nav
                id="navbar"
                className="navbar sticky top-0 z-40 flex w-full justify-end  bg-[#145883] px-4 "
            >
                <div className='max-w-[96rem] w-full flex  justify-between mx-auto'>


                    <div className="flex flex-row justify-center space-x-2 items-center text-center font-semibold">
                        <HashLink smooth to="/">

                            <img className='w-[100%] h-8 md:h-10 lg:h-12' src={Logo} alt="" />
                        </HashLink>
                        <HashLink smooth to="/">
                            <h1 className='text-white font-bold lg:text-lg text-normal'>HMS</h1>
                        </HashLink>

                    </div>
                   

                    <div className='flex items-center space-x-2'>

                        <Link to="/Profile">

                            <svg className='h-6 w-6 lg:h-8 lg:w-8' viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="20" fill="white" />
                                <g clipPath="url(#clip0_390_252)">
                                    <path d="M20 21C21.5823 21 23.129 20.5308 24.4446 19.6518C25.7602 18.7727 26.7855 17.5233 27.391 16.0615C27.9965 14.5997 28.155 12.9911 27.8463 11.4393C27.5376 9.88743 26.7757 8.46197 25.6569 7.34315C24.538 6.22433 23.1126 5.4624 21.5607 5.15372C20.0089 4.84504 18.4003 5.00347 16.9385 5.60897C15.4767 6.21447 14.2273 7.23985 13.3482 8.55544C12.4692 9.87104 12 11.4178 12 13C12.0021 15.1211 12.8457 17.1547 14.3455 18.6545C15.8453 20.1544 17.8789 20.9979 20 21ZM20 7.66667C21.0548 7.66667 22.086 7.97947 22.963 8.5655C23.8401 9.15153 24.5237 9.98449 24.9274 10.959C25.331 11.9336 25.4366 13.0059 25.2309 14.0405C25.0251 15.0751 24.5171 16.0254 23.7712 16.7712C23.0254 17.5171 22.075 18.0251 21.0405 18.2309C20.0059 18.4366 18.9336 18.331 17.959 17.9274C16.9845 17.5237 16.1515 16.8401 15.5655 15.963C14.9795 15.086 14.6667 14.0548 14.6667 13C14.6667 11.5855 15.2286 10.229 16.2288 9.22877C17.229 8.22857 18.5855 7.66667 20 7.66667Z" fill="#8B8A8A" />
                                    <path d="M20 23.6667C16.8185 23.6703 13.7683 24.9357 11.5186 27.1854C9.26894 29.435 8.00353 32.4852 8 35.6667C8 36.0204 8.14048 36.3595 8.39052 36.6096C8.64057 36.8596 8.97971 37.0001 9.33333 37.0001C9.68696 37.0001 10.0261 36.8596 10.2761 36.6096C10.5262 36.3595 10.6667 36.0204 10.6667 35.6667C10.6667 33.1914 11.65 30.8174 13.4003 29.0671C15.1507 27.3167 17.5246 26.3334 20 26.3334C22.4754 26.3334 24.8493 27.3167 26.5997 29.0671C28.35 30.8174 29.3333 33.1914 29.3333 35.6667C29.3333 36.0204 29.4738 36.3595 29.7239 36.6096C29.9739 36.8596 30.313 37.0001 30.6667 37.0001C31.0203 37.0001 31.3594 36.8596 31.6095 36.6096C31.8595 36.3595 32 36.0204 32 35.6667C31.9965 32.4852 30.7311 29.435 28.4814 27.1854C26.2317 24.9357 23.1815 23.6703 20 23.6667Z" fill="#8B8A8A" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_390_252">
                                        <rect width="32" height="32" fill="white" transform="translate(4 5)" />
                                    </clipPath>
                                </defs>
                            </svg>

                        </Link>


                        <button
                            id="btnSidebarToggler"
                            type="button"
                            className="py-4 text-2xl text-white hover:text-gray-200"
                            onClick={toggleSidebar}
                        >
                            {isSidebarOpen ? (
                                <svg
                                    id="navOpen"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="lg:h-8 lg:w-8 h-6 w-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg className='lg:h-8 lg:w-8 h-6 w-6' viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="20" cy="20" r="20" fill="white" />
                                    <circle cx="2" cy="2" r="2" transform="matrix(-1 0 0 1 22 8)" fill="#8B8A8A" />
                                    <circle cx="2" cy="2" r="2" transform="matrix(-1 0 0 1 22 18)" fill="#8B8A8A" />
                                    <circle cx="2" cy="2" r="2" transform="matrix(-1 0 0 1 22 28)" fill="#8B8A8A" />
                                </svg>



                            )}
                        </button>

                    </div>



                </div>

            </nav>
            {/* Navbar end */}

            {/* Sidebar start */}
            <div id="containerSidebar" className="z-40 sidebar">
                <div className="navbar-menu relative z-40">
                    <nav
                        id="sidebar"
                        className={`fixed left-0 bottom-0 flex w-3/4 flex-col overflow-y-auto bg-[#0f405f] pt-6 pb-8 sm:max-w-xs lg:w-80 ${isSidebarOpen ? 'show' : '-translate-x-full'
                            }`}
                    >
                        <div className="px-4 pb-6">
                            <ul className="mb-8 text-sm font-medium">


                                {/* Dashboard Section */}
                                <li className='lg:text-lg text-normal'>
                                    <Link
                                        className="flex items-center rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-[#145883]"
                                        to="/"
                                    >
                                        <span className="select-none">Dashboard</span>
                                    </Link>
                                </li>
                                
                                {/* Patient Section */}
                                <li className="lg:text-lg text-normal">
                                    <div
                                        className="flex items-center justify-between rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-[#145883] cursor-pointer"
                                        onClick={() => setClientOpen(!clientOpen)}
                                    >
                                        <span className="select-none">Bill section</span>




                                        {clientOpen ?

                                            <span className="transition ">
                                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                                                    <path d="M6 15l6-6 6 6"></path>
                                                </svg>
                                            </span>


                                            :

                                            <span className="transition ">
                                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                                                    <path d="M6 9l6 6 6-6"></path>
                                                </svg>
                                            </span>


                                        }
                                    </div>
                                    {clientOpen && (
                                        <ul className="ml-4">
                                            <li>
                                                <Link
                                                    className="flex items-center rounded py-2 pl-4 pr-4 text-gray-50 hover:bg-[#145883]"
                                                    to="/patient-entry"
                                                >
                                                    <span className="select-none">New Bill generate</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="flex items-center rounded py-2 pl-4 pr-4 text-gray-50 hover:bg-[#145883]"
                                                    to="/patient-list"
                                                >
                                                    <span className="select-none">Manage Bills</span>
                                                </Link>

                                                {/* <Link
                                                    className="flex items-center rounded py-2 pl-4 pr-4 text-gray-50 hover:bg-[#145883]"
                                                    to="/patient-tests-list"
                                                >
                                                    <span className="select-none">Track Tests</span>
                                                </Link> */}
                                            </li>
                                        </ul>
                                    )}
                                </li>


                                {/* Test Category Section */}

                                <li className="lg:text-lg text-normal">
                                    <div
                                        className="flex items-center justify-between rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-[#145883] cursor-pointer"
                                        onClick={() => setTestCategoryOpen(!testCategoryOpen)}
                                    >
                                        <span className="select-none">Test Category</span>
                                        {/* {testCategoryOpen ? <FaChevronUp /> : <FaChevronDown />} */}

                                        {testCategoryOpen ?

                                            <span className="transition ">
                                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                                                    <path d="M6 15l6-6 6 6"></path>
                                                </svg>
                                            </span>


                                            :

                                            <span className="transition ">
                                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                                                    <path d="M6 9l6 6 6-6"></path>
                                                </svg>
                                            </span>


                                        }
                                    </div>
                                    {testCategoryOpen && (
                                        <ul className="ml-4">
                                            <li>
                                                <Link
                                                    className="flex items-center rounded py-2 pl-4 pr-4 text-gray-50 hover:bg-[#145883]"
                                                    to="/create-test"
                                                >
                                                    <span className="select-none">Add Test Category</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="flex items-center rounded py-2 pl-4 pr-4 text-gray-50 hover:bg-[#145883]"
                                                    to="/test-lists"
                                                >
                                                    <span className="select-none">Manage Test Category</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </li>


                                {/* Item Category Section */}

                                <li className="lg:text-lg text-normal">
                                    <div
                                        className="flex items-center justify-between rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-[#145883] cursor-pointer"
                                        onClick={() => setItemCategoryOpen(!ItemCategoryOpen)}
                                    >
                                        <span className="select-none">Item Category</span>
                                        {/* {testCategoryOpen ? <FaChevronUp /> : <FaChevronDown />} */}

                                        {ItemCategoryOpen ?

                                            <span className="transition ">
                                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                                                    <path d="M6 15l6-6 6 6"></path>
                                                </svg>
                                            </span>


                                            :

                                            <span className="transition ">
                                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                                                    <path d="M6 9l6 6 6-6"></path>
                                                </svg>
                                            </span>


                                        }
                                    </div>
                                    {ItemCategoryOpen && (
                                        <ul className="ml-4">
                                            <li>
                                                <Link
                                                    className="flex items-center rounded py-2 pl-4 pr-4 text-gray-50 hover:bg-[#145883]"
                                                    to="/create-item"
                                                >
                                                    <span className="select-none">Add Item Category</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="flex items-center rounded py-2 pl-4 pr-4 text-gray-50 hover:bg-[#145883]"
                                                    to="/Item-lists"
                                                >
                                                    <span className="select-none">Manage Item Category</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </li>


                                {/* Reports  Section */}

                                {/* <li className="lg:text-lg text-normal">
                                    <div
                                        className="flex items-center justify-between rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-[#145883] cursor-pointer"
                                        onClick={() => setReportsOpen(!ReportsOpen)}
                                    >
                                        <span className="select-none">Report</span>
                               

                                        {ReportsOpen ?

                                            <span className="transition ">
                                                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                                                    <path d="M6 15l6-6 6 6"></path>
                                                </svg>
                                            </span>


                                            :

                                            <span className="transition ">
                                                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                                                    <path d="M6 9l6 6 6-6"></path>
                                                </svg>
                                            </span>


                                        }
                                    </div>
                                    {ReportsOpen && (
                                        <ul className="ml-4">
                                            <li>
                                                <Link
                                                    className="flex items-center rounded py-2 pl-4 pr-4 text-gray-50 hover:bg-[#145883]"
                                                    to="/report-entry"
                                                >
                                                    <span className="select-none">Add Report</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="flex items-center rounded py-2 pl-4 pr-4 text-gray-50 hover:bg-[#145883]"
                                                    to="/reports-status"
                                                >
                                                    <span className="select-none">Manage Reports</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </li> */}


                                {/* Report */}
                                {/* <li className='lg:text-lg text-normal'>
                                    <a
                                        className="flex items-center rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-[#145883]"
                                        href="#dashboard"
                                    >
                                        <span className="select-none">Reports</span>
                                    </a>
                                </li> */}

                                <li className='lg:text-lg text-normal'>
                                    <Link
                                        className="flex items-center rounded py-2 pl-4 pr-4 text-gray-50 hover:bg-[#145883]"
                                        to="/patient-tests-list"
                                    >
                                        <span className="select-none">Track Tests</span>
                                    </Link>
                                    </li>


                                    {/* <li className='lg:text-lg text-normal'>
                                        <a
                                            className="flex items-center rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-[#145883]"
                                            href="#dashboard"
                                        >
                                            <span className="select-none">Setting</span>
                                        </a>
                                    </li> */}
                            </ul>
                        </div>
                    </nav>

                </div>
            </div>
            {/* Sidebar end */}


        </>
    );
};

export default Sidebar;
