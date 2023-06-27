const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const dbCon = require('../config/dbConfig');
const userServices = require('../Services/userServices');

const templatesPath = path.join(__dirname, 'templates');

const executeQuery = (sql, params) => {
  return new Promise((resolve, reject) => {
    dbCon.query(sql, params, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

const auditLog = async (email, type, templateName) => {
  const time = new Date().toISOString();

  const insertQuery = `INSERT INTO adminpowersaudit (email, type, template_name, time) VALUES (?, ?, ?, ?)`;
  const insertValues = [email, type, templateName, time];

  console.log('Executing SQL Query:', insertQuery, insertValues);
  await executeQuery(insertQuery, insertValues);
};



// Get the contents of a specific template
router.get('/', async (req, res) => {
  const { template } = req.query;
  const templatePath = path.join(templatesPath, `${template}.html`);
  const email = userServices.getLoggedInUserEmail();

  try {
    const data = await fs.promises.readFile(templatePath, 'utf8');
    res.json({ template: data });
    await auditLog(email, 'reading', template); // Use res.locals.email from the userLogin middleware
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to read the template file' });
  }
});

// Update the contents of a specific template
router.put('/', async (req, res) => {
  const { template } = req.query;
  const updatedTemplate = req.body.template;
  const templatePath = path.join(templatesPath, `${template}.html`);
  const email = userServices.getLoggedInUserEmail();
  try {
    await fs.promises.writeFile(templatePath, updatedTemplate);
    res.json({ message: 'Template updated successfully' });
    await auditLog(email, 'updating', template); // Use res.locals.email from the userLogin middleware
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update the template file' });
  }
});

// Delete a specific template
router.delete('/', async (req, res) => {
  const { template } = req.query;
  const templatePath = path.join(templatesPath, `${template}.html`);
  const email = userServices.getLoggedInUserEmail();

  try {
    await fs.promises.unlink(templatePath);
    res.json({ message: 'Template deleted successfully' });
   
    await auditLog(email, 'deleting', template); // Use res.locals.email from the userLogin middleware
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete the template file' });
  }
});
























module.exports = router;
