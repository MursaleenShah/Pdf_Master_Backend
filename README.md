#              **PDF Extraction and Modification Server** 
This is a Node.js server application built using Express.js, Mongoose, Multer, and pdf-lib libraries. The server allows users to upload PDF files, store them in a MongoDB database, extract specific pages from the uploaded PDFs, and download the modified PDFs.

# Installation
Prerequisites
Ensure that you have Node.js installed before proceeding.

# Steps to Install
1. Clone this repository.
2. Install dependencies using 'npm install'.

# Usage
1. Make sure MongoDB is installed and running on your system.
2. Create a .env file in the project root directory and add your MongoDB connection string (MONGODB=your_connection_string).
3. Start the server by running 'npm run dev' or 'nodemon app.js'.

# Endpoints
1. `POST /upload-files`: Upload a PDF file to the server. Required parameters:
 `title`: Title of the PDF.
 `file`: PDF file to upload.
 `pageNumbers`: Comma-separated list (or a single page) of page numbers to extract.
2. `GET /get-files`: Retrieve a list of uploaded PDF files from the server.
3. `GET /get-modified-pdf/:id`: Download a modified PDF file based on the provided ID. The modified PDF contains the extracted pages specified during upload.

# Dependencies
1. Express.js: Web framework for Node.js.
2. Mongoose: MongoDB object modeling tool.
3. Multer: Middleware for handling multipart/form-data.
4. pdf-lib: Library for creating and modifying PDF documents.

# Contributions
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

