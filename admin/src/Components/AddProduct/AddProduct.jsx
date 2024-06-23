import React, { useState } from 'react'
import './AddProduct.css'
import upload_pic from "../../assets/admin/upload_area.svg"
import {toast} from 'react-toastify';
 
const AddProduct = () => {
const [image, setImage]=useState(false);
const [productDetails, setProductDetails]= useState({
    name:"",
    image:"",
    category:"",
    old_price:"",
    new_price:""

})

const handleDetails=(e)=>{
        setProductDetails({...productDetails,[e.target.name]:e.target.value});
        }


const handleImage =(e)=>{
setImage(e.target.files[0]);
}



const addProduct= async()=>{


    let responseData;
    let product = productDetails;

    let formData = new FormData();
    formData.append('product',image)
    await fetch("http://localhost:5000/upload",{
        method:"POST",
        body:formData,
        headers:{
            Accept:"application/json",
        }
    }).then((res)=>res.json()).then((data)=>responseData=data)

    if(responseData.success){
        product.image=responseData.image_url;
        console.log(product);
        
        await fetch('http://localhost:5000/addProduct',{

            method:"POST",
            body:JSON.stringify(product),
            headers:{
                Accept:"application/json",
                'Content-Type':"application/json"
            }
       }).then((res)=>res.json()).then((data)=>data.success?alert("Product Added"):alert("Failed"))
       
    }
    setProductDetails({
        name:"",
    image:"",
    category:"",
    old_price:"",
    new_price:""
    })

    
   
}



// const addProduct = async()=>{

//     let responseData;
//     let product = productDetails;


//     let formData= new FormData();
//     formData.append('product',image);

//     try{
//         const response= await fetch('http://localhost:5000/upload',{
//             body:formData,
//             method:'POST',
//             headers:{

//                 Accept:'application/json',
//             }
            
//         })
//         responseData= await response.json();

//         if(responseData.success){
//             product.image=responseData.image_url;
//             console.log(product);


          
//         }


//     }catch(err){
//         console.log(err)
//     }



// }



  return (
    <div className='add_product'>
        <div className="add_product_container">
            <h1>Add Product</h1>
            <div className="add_productItem">
                    <p>Product Title</p>
                    <input onChange={handleDetails} value={productDetails.name} type="text" name="name" placeholder='Enter Product Name' />
            </div>
            <div className="add_productItem">
                    <p>Price</p>
                    <div className="price">
                    <input value={productDetails.old_price} onChange={handleDetails}  type="text" name="old_price" placeholder='Enter Old Price' />
                    <input value={productDetails.new_price} onChange={handleDetails}  type="text" name="new_price" placeholder='Enter Offer Price' />
                    </div>
            </div>
            <div className="add_productItem">
                    <p>Category</p>
                    <select value={productDetails.category} onChange={handleDetails}  name="category" id="category">
                        <option value="select">Select Category</option>
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                        <option value="kid">Kid</option>
                    </select>
            </div>
            <div className="add_productItem">
                    <label htmlFor="file-input">
                        <img className='upload_img' src={image? URL.createObjectURL(image):upload_pic} alt="" />
                    </label>
                        <input value={productDetails.image}  onChange={handleImage}      type="file" name="image" id="file-input" hidden/>
            </div>
            <button onClick={()=>addProduct()} className='addProduct_btn'>Add</button>
        </div>      
    </div>
  )
}

export default AddProduct