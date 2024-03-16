const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();
//const upload = multer({ dest: './files' })
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

main().catch(err => console.log(err));
async function main(){
    await mongoose.connect(process.env.MONGODB);
    console.log("connected to mongodb");


app.get("/",async(req,res)=>{
    res.send("Success!");

});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './files')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage });

app.post("/upload-files",upload.single("file"),async(req,res)=>{
    console.log(req.file);
    res.send("hii");
})





app.listen(5000,()=>{
    console.log("server is running on port 5000");
})


}

