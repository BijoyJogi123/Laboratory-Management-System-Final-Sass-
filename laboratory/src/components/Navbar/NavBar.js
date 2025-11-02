import React, { useState, useEffect } from 'react';
import NavLinks from './NavLinks';
import { HashLink } from 'react-router-hash-link';
import Logo from '../../assets/images/image.png'
import { Link } from 'react-router-dom';

const NavBar = () => {
    const [top, setTop] = useState(!window.scrollY);
    const [isOpen, setisOpen] = React.useState(false);
    function handleClick() {
        setisOpen(!isOpen);
    }


    useEffect(() => {
        const scrollHandler = () => {
            window.pageYOffset > 10 ? setTop(false) : setTop(true)
        };
        window.addEventListener('scroll', scrollHandler);
        return () => window.removeEventListener('scroll', scrollHandler);
    }, [top]);

    return (
       

        <nav className="fixed top-0  lg:top-0 w-full z-20 transition duration-300 ease-in-out  bg-[#145883] shadow-lg">
            <div className="max-w-[1320px] mx-auto flex flex-row justify-between items-center px-6 md:px-8 lg:px-8   py-2">
                <div className="flex flex-row justify-center space-x-2 items-center text-center font-semibold">
                    <HashLink smooth to="/#hero">
                        {/* <h1 className="font-extrabold text-4xl text-blue-900">mld</h1> */}
                        <img className='w-[100%] h-12' src={Logo} alt="" />
                    </HashLink>
                    <h1 className='text-white font-bold text-lg'>HMS</h1>
                </div>
                <div className="group flex flex-col items-center">
                    <button className="p-2 rounded-lg lg:hidden text-blue-900" onClick={handleClick}>
                        <svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
                            ) : (
                                <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                            )}
                        </svg>
                    </button>
                    <div className='hidden space-x-6 lg:inline-block p-5'>
                        <NavLinks />
                    </div>



                    {/* THIS IS THE MOBILE SCREEN */}

                    <div className={`fixed transition-transform duration-300 ease-in-out flex justify-center left-0 w-full h-auto bg-white lg:hidden shadow-xl top-14 ${isOpen ? "block" : "hidden"}`}>
                        <div className='flex flex-col w-full px-4'>
                            <div className="grid divide-y divide-neutral-200 w-full mt-8 lg:hidden" style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto", scrollbarWidth: "none" }}>

                                {/* Platforms Section */}

                                <div className="md:py-5 py-2">
                                    <details className="group">
                                        <summary className="mt-4 px-4 py-2 rounded flex flex-row items-center justify-between w-full">
                                            <span className='text-white font-bold text-lg'>Products</span>
                                            <span className="transition group-open:rotate-180">
                                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                                                    <path d="M6 9l6 6 6-6"></path>
                                                </svg>
                                            </span>
                                        </summary>
                                        <div className="text-neutral-600 mt-3 group-open:animate-fadeIn">
                                            <ul className='w-full'>
                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/HMS-product" className="hover:text-white block mt-4 px-4 py-2 rounded w-full">Hospital Management System</Link>
                                                </li>
                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/FMS-product" className="hover:text-white block mt-4 px-4 py-2 rounded w-full">Facility Management Systme</Link>
                                                </li>
                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/LSMS-product" className="hover:text-white block mt-4 px-4 py-2 rounded w-full">Logistics Service Management System</Link>
                                                </li>
                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/LMS-product" className="hover:text-white block mt-4 px-4 py-2 rounded w-full">Loan Management System</Link>
                                                </li>
                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/CRMS-product" className="hover:text-white block mt-4 px-4 py-2 rounded w-full">Criminal Record Management System</Link>
                                                </li>
                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/DMS-product" className="hover:text-white block mt-4 px-4 py-2 rounded w-full">Document Management System</Link>
                                                </li>
                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/PAMS-product" className="hover:text-white block mt-4 px-4 py-2 rounded w-full">Payroll and Appraisal Management System</Link>
                                                </li>
                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/EPC-product" className="hover:text-white block mt-4 px-4 py-2 rounded w-full">E-Wallet and Prepaid Card</Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </details>
                                </div>

                                {/* Services Section */}

                                <div className="md:py-5 py-2">
                                    <details className="group">
                                        <summary className="mt-4 px-4 py-2 rounded flex flex-row items-center justify-between w-full">
                                            <span className='text-white font-bold text-lg'>Services</span>
                                            <span className="transition group-open:rotate-180">
                                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                                                    <path d="M6 9l6 6 6-6"></path>
                                                </svg>
                                            </span>
                                        </summary>
                                        <div className="text-neutral-600 mt-3 group-open:animate-fadeIn">
                                            <ul className='w-full'>
                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/CMS-services" className="hover:text-white block mt-4 px-4 py-2 rounded w-full">Capacity Management Services </Link>
                                                </li>
                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/ITSC-product" className="hover:text-white block mt-4 px-4 py-2 rounded w-full">IT Solutions & Consulting</Link>
                                                </li>
                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/SSS-product" className="hover:text-white block mt-4 px-4 py-2 rounded w-full">Skilled Staffing Solutions</Link>
                                                </li>
                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/BPS-product" className="hover:text-white block mt-4 px-4 py-2 rounded w-full">Business Process Solutions</Link>
                                                </li>

                                            </ul>
                                        </div>
                                    </details>
                                </div>

                                {/* Dashboard Section */}
                                <div className="md:py-5 py-2">
                                    <details className="group">
                                        <summary className="mt-4 px-4 py-2 rounded flex flex-row items-center justify-between w-full">
                                            <span className='text-white font-bold text-lg'>Industries</span>
                                            <span className="transition group-open:rotate-180">
                                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                                                    <path d="M6 9l6 6 6-6"></path>
                                                </svg>
                                            </span>
                                        </summary>
                                        <div className="text-neutral-600 mt-3 group-open:animate-fadeIn">
                                            <ul className='w-full'>
                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/HC-industries" className="hover:text-white block mt-4 px-4 py-2 rounded w-full">Health Care</Link>
                                                </li>
                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/BF-industries" className="hover:text-white block mt-4 px-4 py-2 rounded w-full">Banking and Finanacial Industries</Link>
                                                </li>
                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/IT-industries" className="hover:text-white block mt-4 px-4 py-2 rounded w-full">Information Technology</Link>
                                                </li>
                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/AM-industries" className="hover:text-white block mt-4 px-4 py-2 rounded w-full">Automobile</Link>
                                                </li>
                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/FMCG-industries" className="hover:text-white block mt-4 px-4 py-2 rounded w-full">FMCG</Link>
                                                </li>
                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/AV-industries" className="hover:text-white block mt-4 px-4 py-2 rounded w-full">Aviation</Link>
                                                </li>
                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/AA-industries" className="hover:text-white block mt-4 px-4 py-2 rounded w-full">Agriculture and allied sector</Link>
                                                </li>


                                            </ul>
                                        </div>
                                    </details>
                                </div>



                                {/* Company Section */}

                                <div className="md:py-5 py-2">
                                    <details className="group">
                                        <summary className="mt-4 px-4 py-2 rounded flex flex-row items-center justify-between w-full">
                                            <span className='text-white font-bold text-lg'>Company</span>
                                            <span className="transition group-open:rotate-180">
                                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                                                    <path d="M6 9l6 6 6-6"></path>
                                                </svg>
                                            </span>
                                        </summary>
                                        <div className="text-neutral-600 mt-3 group-open:animate-fadeIn">
                                            <ul className='w-full'>
                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/about-us" className="block mt-4 px-4 py-2 rounded w-full">About-us</Link>
                                                </li>

                                                <li className='hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]'>
                                                    <Link to="/contact-us" className="block mt-4 px-4 py-2 rounded w-full">Contact us</Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </details>
                                </div>

                                {/* Sign In and Contact Us Links */}
                                <div className=' items-center justify-between py-6 w-full'>

                                    <Link to="/contact" className="text-lg px-4 py-3 rounded font-bold bg-gradient-to-r from-[#359fce] to-[#115db4] hover:bg-blue-800 w-full text-center text-white" >Contact Us</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )

}


export default NavBar;
