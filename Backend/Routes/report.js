const express = require('express');
const json2csv = require('json2csv');
const fs = require('fs');
const router = express.Router();
const dbCon = require('../config/dbConfig');

// Endpoint to generate the customer report
router.get('/generateReport', (req, res) => {
  const query = 'SELECT * FROM customers'; // Replace with your actual database query
  dbCon.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching customers:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const customers = results.map((customer) => ({
      customer_email: customer.customer_email,
      customer_name: customer.customer_name,
      template_id: customer.template_id,
      status: customer.status,
    }));

    try {
      const csvFields = ['customer_email', 'customer_name', 'template_id', 'status'];
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
