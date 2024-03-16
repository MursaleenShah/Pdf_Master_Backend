const mongoose = require("mongoose");
//creating a schema for pdf
const PdfDetailsSchema = new mongoose.Schema({
    pdf:String,
    title:String
});
//creating a model for schema
const PdfDetails = mongoose.model("PdfDetails",PdfDetailsSchema);