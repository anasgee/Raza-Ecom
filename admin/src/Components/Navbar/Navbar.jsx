import React from 'react';
import "./Navbar.css"
import navLogo from "../../assets/admin/nav-logo.svg";
import navRight from "../../assets/admin/nav-profile.svg";

const Navbar = () => {
  return (
    <div className='navBar'>
        <img className='navLogo' src={navLogo} alt='Navbar Logo'/>
        <img src={navRight} alt="Nav Profile" />
    </div>
  )
}

export default Navbar