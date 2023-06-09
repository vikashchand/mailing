const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const router = express.Router();
const dbCon = require('../config/dbConfig');

const upload = multer({ dest: 'uploads/' });



// Route for file upload
router.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Read the uploaded Excel file
  const workbook = XLSX.readFile(file.path);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  // Convert Excel data to JSON
  
  // Convert Excel data to JSON
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Extract email and customer_name values
const emailColumnIndex = 0; // Adjust the column index for customer_email
const customerNameColumnIndex = 1; // Adjust the column index for customer_name
const templateIdColumnIndex = 2; // Adjust the column index for template_id
const statusColumnIndex = 3; // Adjust the column index for status

// Skip the first row (assuming it contains column headings)
const dataWithoutHeadings = data.slice(1);

const values = dataWithoutHeadings.map(row => [
  row[emailColumnIndex],
  row[customerNameColumnIndex],
  row[templateIdColumnIndex],
  row[statusColumnIndex]
]);

const query = "INSERT INTO customers (customer_email, customer_name, template_id, status) VALUES ?";

dbCon.query(query, [values], (error, results) => {
  if (error) {

    console.error('Error importing data status:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
  } else {
    console.log("Data exported successfully.");
    res.json({ message: 'Data exported successfully' });
  }
});

});

module.exports = router;
