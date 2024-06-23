import React from 'react';
import "./admin.css"; 
import Sidebar from '../Components/Sidebar/Sidebar';
import { Routes,Route } from 'react-router-dom';
import AddProduct from '../Components/AddProduct/AddProduct';
import ListProduct from '../Components/ListProduct/ListProduct';

const Admin = () => {
  return (
    <div className='admin'>
      {/* To set Side Bar for all routes on admin pannel */}
         
           <Sidebar/>

           {/* To set routes for the add product or list all products */}

           <Routes>
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/listproduct" element={<ListProduct />} />
            
           </Routes>

    </div>
  )
}

export default Admin