const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const env=require('dotenv').config()
const SMTP_MAIL= process.env.SMTP_MAIL
const SMTP_PASSWORD =process.env.SMTP_PASSWORD
const dbCon = require('../config/dbConfig');


// // Read the email template based on the template name
// const getEmailTemplate = (templateName) => {
//   const templatesDir = path.join(__dirname, 'templates');
//   const templatePath = path.join(templatesDir, `${templateName}.html`);
//   console.log('Template path:', templatePath);
//   try {
//     const templateContent = fs.readFileSync(templatePath, 'utf-8');
//     return templateContent;
//   } catch (error) {
//     console.error('Error reading template file:', error);
//     throw error;
//   }
// };

// // Send email using nodemailer
// const sendEmail = async (recipientEmail, templateName) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       port:465,
//       secure: true,
//       logger:false,
//       debug:true,
//       secureConnection: false,
      
//       auth: {
//         user: SMTP_MAIL,
//         pass: SMTP_PASSWORD,
        
//       },
//       tls:{
//           rejectUnauthorized:false
//       }
//   });

//     const mailOptions = {
//       from: SMTP_MAIL,
//       to: recipientEmail,
//       subject: 'Welcome to Your Web App',
//       html: getEmailTemplate(templateName), // Use the template based on template name
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully!');
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw error;
//   }
// };

// // Route to send email
// router.post('/send-email', async (req, res) => {
//   const { recipientEmail, templateName } = req.body;
//   try {
//     await sendEmail(recipientEmail, templateName);
//     res.json({ message: 'Email sent successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error sending email' });
//   }
// });
// Send email using nodemailer


// Send email using nodemailer
// const sendEmail = async (recipientEmail, templateName) => {
  //try {
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   port: 465,
    //   secure: true,
    //   logger: false,
    //   debug: true,
    //   secureConnection: false,

    //   auth: {
    //     user: SMTP_MAIL,
    //     pass: SMTP_PASSWORD,
    //   },
    //   tls: {
    //     rejectUnauthorized: false,
    //   },
    // });

//     // Retrieve the email template based on the template name from the "templates" table
//     dbCon.query('SELECT * FROM templates WHERE type = ?', [templateName], async (error, results) => {
//       if (error) {
//         console.error(error);
//         return;
//       }
      
//       const template = results[0];
//       if (!template) {
//         console.error('Template not found');
//         return;
//       }

//       const mailOptions = {
//         from: SMTP_MAIL,
//         to: recipientEmail,
        
//         html: template.body, // Use the template body
//       };

//       await transporter.sendMail(mailOptions);
//       console.log('Email sent successfully!');
//     });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw error;
//   }
// };
// // Route to send email
// router.post('/send-email', async (req, res) => {
//   const { recipientEmail, templateName } = req.body;
//   try {
//     sendEmail(recipientEmail, templateName);
//     res.json({ message: 'Email sent successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error sending email' });
//   }
// });




//module.exports = router;


// const sendEmail = async (recipientEmail, templateName, res) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       port: 465,
//       secure: true,
//       logger: false,
//       debug: true,
//       secureConnection: false,
//       auth: {
//         user: SMTP_MAIL,
//         pass: SMTP_PASSWORD,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });

//     // Retrieve the email template based on the template name from the "templates" table
//     dbCon.query('SELECT * FROM templates WHERE type = ?', [templateName], async (error, results) => {

//       // Inside the query callback for retrieving the template


//       if (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error retrieving email template' }); // Send an error response
//         return;
//       }

//       const template = results[0];
     
//       if (!template) {
//         console.error('Template not found');
//         res.status(404).json({ error: 'Not sent as Template not found' }); // Include the error message in the response
//         return;
//       }

//       const mailOptions = {
//         from: SMTP_MAIL,
//         to: recipientEmail,
//         html: template.body, // Use the template body
//       };

//       try {
//         await transporter.sendMail(mailOptions);
//         console.log('Email sent successfully!');
//         res.json({ message: 'Email sent successfully' }); // Send success response
//       } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).json({ error: 'Error sending email' }); // Send an error response
//       }
//     });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     res.status(500).json({ error: 'Error sending email' }); // Send an error response
//   }
// };


// router.post('/send-email', async (req, res) => {
//   const { recipientEmail, templateName } = req.body;
//   try {
//     console.log('Recipient:', recipientEmail);
//     console.log('TemplateName:', templateName);

//     await sendEmail(recipientEmail, templateName, res);
//   } catch (error) {
//     console.error('Error sending email:', error);
//     res.status(500).json({ error: 'Error sending email' });
//   }
// });


// module.exports = router;


const sendEmail = async (recipientEmail, templateName, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      logger: false,
      debug: true,
      secureConnection: false,
      auth: {
        user: SMTP_MAIL,
        pass: SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Retrieve the email template based on the template name from the "templates" table
    dbCon.query('SELECT * FROM templates WHERE type = ?', [templateName], async (error, results) => {

      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving email template' }); // Send an error response
        return;
      }

      const template = results[0];

      if (!template) {
        console.error('Template not found');
        res.status(404).json({ error: 'Not sent as Template not found' }); // Include the error message in the response
        return;
      }

      const mailOptions = {
        from: SMTP_MAIL,
        to: recipientEmail,
        html: template.body, // Use the template body
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!', info.response);
        res.json({ message: 'Email sent successfully', response: info.response }); // Send success response along with the info.response object
      } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error sending email', response: error.response }); // Send an error response along with the error.response object
      }
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending email' }); // Send an error response
  }
};


router.post('/send-email', async (req, res) => {
  const { recipientEmail, templateName } = req.body;
  try {
    console.log('Recipient:', recipientEmail);
    console.log('TemplateName:', templateName);

    await sendEmail(recipientEmail, templateName, res);
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending email' });
  }
});


module.exports = router;
