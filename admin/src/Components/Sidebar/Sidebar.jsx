import React from 'react';
import "./Sidebar.css"
import { NavLink } from 'react-router-dom';
import addProduct from "../../assets/admin/Product_Cart.svg"
import ListProduct from "../../assets/admin/Product_list_icon.svg"

const Sidebar = () => {
  return (
    <div className='SideBar'>
        <NavLink to='/addproduct' className='navLink' style={{textDecoration:"none"}}><div className='Product'>
            <img src={addProduct} alt="addProduct" />
            <p>Add Product</p></div></NavLink>
        <NavLink to='/listproduct' className='navLink' style={{textDecoration:"none"}}><div className='Product'>
            <img src={ListProduct} alt="listProduct" />
            <p>List Product</p></div></NavLink>
    </div>

  )
}

export default Sidebar