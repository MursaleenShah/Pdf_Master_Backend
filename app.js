const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
dotenv.config();
//require pdf schema
require("./pdfDetails");
const pdfSchema = mongoose.model("PdfDetails");
//const upload = multer({ dest: './files' })
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
//serve files folder as static(for accessibility)
app.use("/files", express.static("files"));

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGODB);

  app.get("/", async (req, res) => {
    res.send("Success!");
  });

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./files");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + file.originalname);
    },
  });

  const upload = multer({ storage: storage });

  //route to post files on server and save on database
  app.post("/upload-files", upload.single("file"), async (req, res) => {
    console.log(req.file);

    const title = req.body.title;
    const fileName = req.file.filename;
    //extract page numbers from req
    const pageNumbers = req.body.pageNumbers;
    try {
      await pdfSchema.create({
        title: title,
        pdf: fileName,
        pageNumbers: pageNumbers,
      });
      res.send({ status: "ok" });
    } catch (error) {
      res.json({ status: error });
    }
  });
  //route to get data from server
  app.get("/get-files", async (req, res) => {
    pdfSchema.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  });

  //route to download the modified pdf based on pagenumber

  app.get("/get-modified-pdf/:id", async (req, res) => {
    const pdfDetails = await pdfSchema.findById(req.params.id);
    const filePath = `./files/${pdfDetails.pdf}`;

    try {
      const pdfDoc = await PDFDocument.load(fs.readFileSync(filePath));
      const pageNumbers = pdfDetails.pageNumbers
        .split(",")
        .map((page) => parseInt(page.trim())); // parse page numbers
      const modifiedPdfDoc = await PDFDocument.create();

      // Copy pages from the original PDF document
      for (const pageNumber of pageNumbers) {
        const [copiedPage] = await modifiedPdfDoc.copyPages(pdfDoc, [
          pageNumber - 1,
        ]); // Page numbers are 0-based
        modifiedPdfDoc.addPage(copiedPage);
      }

      // Save modified PDF to a new file
      const modifiedPdfBytes = await modifiedPdfDoc.save();
      const modifiedFileName = `modified_${pdfDetails.pdf}`;
      fs.writeFileSync(`./files/${modifiedFileName}`, modifiedPdfBytes);

      res.download(`./files/${modifiedFileName}`);
    } catch (error) {
      console.error("Error modifying PDF:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.listen(5000, () => {
    console.log("server is running on port 5000");
  });
}
