const express = require('express');
const json2csv = require('json2csv');
const fs = require('fs');
const router = express.Router();
const dbCon = require('../config/dbConfig');

// Endpoint to generate the customer report
router.get('/generateReport', (req, res) => {
  const { startDate, endDate } = req.query;

  const query = `SELECT * FROM customers WHERE date BETWEEN ? AND ?`; // Replace 'date' with the actual column name in your database table
  dbCon.query(query, [startDate, endDate], (err, results) => {
    if (err) {
      console.error('Error fetching customers:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const customers = results.map((customer) => ({
      customer_email: customer.customer_email,
      customer_name: customer.customer_name,
      template_name: customer.template_name,
      status: customer.status,
      uploadedby: customer.uploadedby,
      date: customer.date,
    }));

    try {
      const csvFields = ['customer_email', 'customer_name', 'template_name', 'status', 'uploadedby', 'date'];
      const csvData = json2csv.parse(customers, { fields: csvFields });
      const fileName = 'customer_report.csv';

      fs.writeFileSync(fileName, csvData);

      res.download(fileName, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
        }

        fs.unlinkSync(fileName); // Delete the file after download
      });
    } catch (error) {
      console.error('Error generating customer report:', error);
      res.status(500).json({ error: 'Failed to generate customer report' });
    }
  });
});

module.exports = router;
