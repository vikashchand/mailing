const nodemailer = require('nodemailer');
const env=require('dotenv').config()
const SMTP_MAIL= process.env.SMTP_MAIL
const SMTP_PASSWORD =process.env.SMTP_PASSWORD

const sendMail = async (email,mailSubject,content) => {


try {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: SMTP_MAIL,
            pass: SMTP_PASSWORD
            
        }
    });

    const mailOptions = {
        from: SMTP_MAIL,
        to: email,
        subject: mailSubject,
        html: content
    
    }
       // Send the email
       await transporter.sendMail(mailOptions,function(err,info){


        if(err){
            console.log(err);
        }
        else{
            console.log('Email sent'+info.response);
        }   
       });

} catch (error) {
    console.log(error);
}



    // const htmlTemplate = fs.readFileSync('otp.html', 'utf8');
     // Create a nodemailer transporter using your email service configuration
     
}


module.exports = sendMail;