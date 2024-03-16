const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();
//require pdf schema
require("./pdfDetails");
const pdfSchema = mongoose.model("PdfDetails");
//const upload = multer({ dest: './files' })
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

main().catch(err => console.log(err));
async function main(){
    await mongoose.connect(process.env.MONGODB);
    


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
    
    const title = req.body.title;
    const fileName = req.file.filename;
    try {
      await pdfSchema.create({title : title, pdf:fileName});
      res.send({status:"ok"});
      
    } catch (error) {
      res.json({status:error});
      
    }
    
    
})





app.listen(5000,()=>{
    console.log("server is running on port 5000");
})


}

