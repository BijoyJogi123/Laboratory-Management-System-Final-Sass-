import React, { useState } from 'react';
import { HashLink } from 'react-router-hash-link';

const NavLinks = () => {
    const [showServices, setShowServices] = useState(false);
    const [showIndustries, setShowIndustries] = useState(false);
    const [showProducts, setshowProducts] = useState(false);

    return (
        <div className="flex space-x-6 items-center">


            {/* Products Dropdown */}
            <div
                className="relative"
                onMouseEnter={() => setshowProducts(true)}
                onMouseLeave={() => setshowProducts(false)}
            >
                <HashLink
                    className="px-4 font-bold text-lg text-white hover:text-blue-900"
                    smooth
                    to="/#industries"
                >
                    Products
                </HashLink>

                {showProducts && (
                    <div className="p-4 absolute left-0 mt-0 lg:w-[450px] bg-white shadow-lg rounded-lg z-10">
                        <div className='pt-4 '></div>
                        <HashLink className="block px-4 py-2 text-black hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]" smooth to="/HMS-product">
                            Hospital Management System (HMS)
                        </HashLink>
                        <HashLink className="block px-4 py-2 text-black hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]" servciesmooth to="/FMS-product">
                            Facility Management servcies (FMS)
                        </HashLink>
                        <HashLink className="block px-4 py-2 text-black hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]" smooth to="/LSMS-product">
                            Logistics Service Management System (LSMS)
                        </HashLink>
                        <HashLink className="block px-4 py-2 text-black hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]" smooth to="/LMS-product">
                            Loan Management System (LMS)
                        </HashLink>
                        <HashLink className="block px-4 py-2 text-black hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]" smooth to="/CRMS-product">
                            Criminal Record Management System (CRMS)
                        </HashLink>
                        <HashLink className="block px-4 py-2 text-black hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]" smooth to="/DMS-product">
                            Document Management System (DMS)
                        </HashLink>
                        <HashLink className="block px-4 py-2 text-black hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]" smooth to="/PAMS-product">
                            Payroll and Appraisal Management System (PAMS)
                        </HashLink>
                        <HashLink className="block px-4 py-2 text-black hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]" smooth to="/EPC-product">
                            E-Wallet and Prepaid Card (EPC)
                        </HashLink>
                    </div>
                )}
            </div>


            {/* Services Dropdown */}
            <div
                className="relative"
                onMouseEnter={() => setShowServices(true)}
                onMouseLeave={() => setShowServices(false)}
            >
                <HashLink
                    className="px-4 font-bold text-lg text-white hover:text-blue-900"
                    smooth
                    to="/#services"
                >
                    Services
                </HashLink>
                {showServices && (
                    <div className="absolute left-0 mt-0 lg:w-96 bg-white shadow-lg rounded-lg z-50 p-6">
                        <div className='pt-4 '></div>
                        <HashLink className="block px-4 py-2 text-black hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]" smooth to="/CMS-services">
                            Capacity Management Services (CMS)
                        </HashLink>
                        <HashLink className="block px-4 py-2 text-black hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]" smooth to="/ITSC-services">
                            IT Solutions & Consulting (ITSC)
                        </HashLink>
                        <HashLink className="block px-4 py-2 text-black hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]" smooth to="/FOS-services">
                        Finance and other support Solution (FOS)
                        </HashLink>
                        <HashLink className="block px-4 py-2 text-black hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]" smooth to="/BPS-services">
                            Business Process Solutions (BPS)
                        </HashLink>
                    </div>
                )}
            </div>

            {/* Industries Dropdown */}
            <div
                className="relative"
                onMouseEnter={() => setShowIndustries(true)}
                onMouseLeave={() => setShowIndustries(false)}
            >
                <HashLink
                    className="px-4 font-bold text-lg text-white hover:text-blue-900"
                    smooth
                    to="/#industries"
                >
                    Industries
                </HashLink>
                {showIndustries && (
                    <div className="p-6 absolute left-0 mt-0 lg:w-96 bg-white shadow-lg rounded-lg z-10">
                        <div className='pt-4 '></div>
                        <HashLink className="block px-4 py-2 text-black hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]" smooth to="/HC-industries">
                            Health Care
                        </HashLink>
                        <HashLink className="block px-4 py-2 text-black hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]" smooth to="/BF-industries">
                            Banking and Finanacial Industries
                        </HashLink>
                        <HashLink className="block px-4 py-2 text-black hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]" smooth to="/IT-industries">
                            Information Technology
                        </HashLink>
                        <HashLink className="block px-4 py-2 text-black hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]" smooth to="/AM-industries">
                            Automobile
                        </HashLink>
                        <HashLink className="block px-4 py-2 text-black hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]" smooth to="/FMCG-industries">
                            FMCG
                        </HashLink>
                        <HashLink className="block px-4 py-2 text-black hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]" smooth to="/AV-industries">
                            Aviation
                        </HashLink>
                        <HashLink className="block px-4 py-2 text-black hover:font-bold  hover:text-white hover:bg-gradient-to-r from-[#359fce] to-[#115db4]" smooth to="/AA-industries">
                            Agriculture and allied sector
                        </HashLink>
                    </div>
                )}
            </div>



            {/* Other Links */}
            <HashLink className="px-4 font-bold text-lg text-white hover:text-blue-900" smooth to="/About-us">
                About Us
            </HashLink>

            {/* <HashLink className="px-4 font-bold text-lg text-blue-400 hover:text-blue-900" to="/contact#contact">
                Contact Us
            </HashLink> */}

          
        </div>
    );
}

export default NavLinks;
