const express = require('express');
const app = express();
const mongoose= require("mongoose")
const jwt= require("jsonwebtoken")
const PORT = process.env.PORT || 5000;
const multer = require('multer');
const path  = require('path');  //to access backend directory
const cors = require('cors');
const { type } = require('os');


mongoose.connect("mongodb+srv://anasraza:ecommerce@ecommerce.g7quoqo.mongodb.net/ECommerce").then(()=>{
    console.log("MongoDB Connected")
}).catch((err)=>{
    console.log(err)
})

app.use(express.json());
app.use(cors());

app.get("/",(req, res)=>{
    res.send("Hello From the server side")
})



// To upload photo on the directory we can use multer middleware.

const storage = multer.diskStorage({
    destination: "./upload/images",
    filename:(req,file,cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
})

const upload= multer({storage:storage});

app.use("/images",express.static("upload/images"));

app.post("/upload", upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${PORT}/images/${req.file.filename}`
    })
})




// Signup schema

const User= mongoose.model("User",{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    
    }

    
})


// End Point for signup

app.post("/signup",async(req,res)=>{
    try{
        const check = await User.findOne({email:req.body.email});
        if(check){
            res.json({sucess:false, message:"Bhai jan hor koi email lgao"});
        }
        let cart={};
        for (let i=0;i<300;i++){
            cart[i]=0;
        }
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            cartData:cart
        })
        await user.save();
        const data={
            user:{
                id:user.id,
            }

        }
        const token = jwt.sign(data,"SecretMessage");
        res.json({success:true, token})


    }catch(error){
        console.log(error)
    }
}
)

// login endpoint

app.post("/login",async(req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email})
        if(user){
            const passwordCompare= await req.body.password===user.password;
            if(passwordCompare){
                const data={
                    user:{
                        id:user.id,
                    
                    }
                }
                const token= jwt.sign(data,"SecretMessage");
                res.json({success:true,token})

            }else{
                    res.json({success:false,message:"Password is incorrect"})
            }
        }else{
            res.json({success:false,message:"User does not exist"})
        }
    }catch(error){
        console.log(error)
    }
})




// PRODUCT SCHEMA

const Product =new mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
    },
    new_price:{
        type:String,
        required:true
    },
    old_price:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        // required:true,
    }
})
app.get('/allproducts',async(req,res)=>{
    try{
        let products = await Product.find({});
        res.json(products);
    }catch(err){
        console.log(err)
    }
})
app.post("/addProduct",async(req,res)=>{
    try{

        //To find if last product is available, then add new product with id+1; instead we use the id field every time, this will fetch last product and add it with id+1
        let products=await Product.find({});
        let id;
        if(products.length>0){
            let last_product_array = products.slice(-1);
            let last_product = last_product_array[0];
            id=last_product.id+1;
        }
        else{
            id=1;
        }

        const product = new Product({
            id:id,
            name:req.body.name,
            image:req.body.image,
            category:req.body.category,
            new_price:req.body.new_price,
            old_price:req.body.old_price,
            available:req.body.available,
        })
        // console.log(product);
        await product.save();
        console.log("Product Added");
        res.json({
            success:true,
            name:req.body.name
        })
    }catch(error){
        console.log(error)
    }
});

app.post("/removeProduct",async(req,res)=>{
    try{
     await Product.findOneAndDelete({id:req.body.id});
        console.log("Product Removed");
        res.json({
            success:true,
            id:req.body.id
        })
        // await product.save();
    }
    catch(error){
        console.log(error)
    }   
})

// New Collection Product
app.get('/newcollection',async(req,res)=>{

    try{
        let products= await Product.find({});
        let newCollection= products.slice(1).slice(-8);
        res.send(newCollection)
    }
    catch(err){
        console.log(err)
    }
})

// Endpoint for women collections
app.get("/womens",async(req,res)=>{
    try{
        let products= await Product.find({category:"women"});
        let popular= products.slice(1,4);
        // let data= response.json()
        res.send(popular);
    }
    catch(err){
        console.log(err)
    }
});

// MiddleWare to authenticate user
const verifyUser = async(req,res,next)=>{

    const token = req.header("auth-token");
    if(token){
        try{
            const data= jwt.verify(token,"SecretMessage");
            req.user=data.user;
            next();
        }catch(err){
            console.log(err)
        }
    }
}



app.post('/addToCart',verifyUser,async(req,res)=>{
// console.log(req.body,req.user)
    let userData= await User.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] +=1;
    await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    console.log("Added item to cart to" ,req.user.id )

})
app.post('/removeFromCart',verifyUser,async(req,res)=>{
// console.log(req.body,req.user)
    let userData= await User.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -=1;
    await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    console.log("Remove item from cart")

})

app.post('/getCart',verifyUser,async(req,res)=>{
    let userData = await User.findOne({_id:req.user.id});
    res.json(userData.cartData);
})



app.listen(PORT,(error)=>{
    try{
        console.log(`Server is listening to the port ${PORT}`)
    }
    catch(error){
        console.log(`Error in starting the server ${error}`)
    }

})
