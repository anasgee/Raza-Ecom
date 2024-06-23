import React, { useEffect, useState } from 'react';
import "./ListProduct.css"; 
import removeItem from "../../assets/admin/cross_icon.png";

const ListProduct = () => {

  const [products,setProducts]=useState([]);

  const fetchApi = async()=>{
      try{
        const response = await fetch('http://localhost:5000/allproducts');

          const data = await response.json();
          setProducts(data);

          console.log(data)
      }catch(err){
        console.log(err);
      }
  }



  // Remove item via admin pannel


  const removeItemHandle=async(id)=>{
    await fetch("http://localhost:5000/removeProduct",{
      method:"POST",
      body:JSON.stringify({id}),
      headers:{
        Accept:"application/json",
        'Content-Type':"application/json"
      }
    })
    await fetchApi();
  }
useEffect(()=>{
  fetchApi();
  
},[])


  return (
    <div className='list_product'>
      <h1>List All Products</h1>
        <div className="items">
          <p>Product</p>
          <p>Title</p>
          <p>Old Price</p>
          <p>New Price</p>
          <p>Category</p>
          <p>Remove</p>
        </div>

        <div className="products">
          {products.map((product,i)=>{
            return <div key={i} className="product_list">
              <img src={product.image} alt="" />
              <p>{product.name}</p>
              <p> ${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <img className='cross_item' onClick={()=>{removeItemHandle(product.id)}} src={removeItem} alt="" />
            </div>        
            })}
        </div>
    </div>
  )
}

export default ListProduct