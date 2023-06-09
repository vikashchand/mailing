const dbCon = require('../config/dbConfig');


const randomstring = require('randomstring');

const sendMail = require('../helpers/sendMail');

const bcrypt=require('bcryptjs')
const jwt =require('jsonwebtoken')
const SECURITYKEY=process.env.SECURITYKEY

const fs = require('fs');
const currentTime = new Date().toISOString("en-US", { timeZone: "Asia/Kolkata" });

const env=require('dotenv').config()
const SMTP_MAIL= process.env.SMTP_MAIL
const SMTP_PASSWORD =process.env.SMTP_PASSWORD

const nodemailer = require('nodemailer');
const sendWelcomeEmail = async (email) => {
 // const htmlTemplate = fs.readFileSync('otp.html', 'utf8');
  // Create a nodemailer transporter using your email service configuration
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port:465,
    secure: true,
    logger:false,
    debug:true,
    secureConnection: false,
    
    auth: {
        user: SMTP_MAIL,
        pass: SMTP_PASSWORD,
        
    },
    tls:{
        rejectUnauthorized:false
    }
});
  // Prepare the email content
 
  const mailOptions = {
    from: SMTP_MAIL,
    to: email,
    subject: 'You logged in successfully',
    html: `<p>Hi,</p><p>You have successfully logged in to your account.</p><p>Date and Time: ${currentTime}</p>`
  };
   // Send the email
   await transporter.sendMail(mailOptions);
  };


  const auditLog = async (actor, type) => {
    const action = (type === 'login') ? 'User login' : 'User signup';
    const time =  new Date().toISOString("en-US", { timeZone: "Asia/Kolkata" });
  
    const insertQuery = `INSERT INTO audit (actor, type, action, time) VALUES (?, ?, ?, ?)`;
    const insertValues = [actor, type, action, time];
   
    
    console.log('Executing SQL Query:', insertQuery, insertValues);
    await executeQuery(insertQuery, insertValues);
  };

  let loggedInUserEmail = '';
  



  const userLogin = async (req, res) => {
    const { identifier, password } = req.body;
  
    const checkPassword = async (data) => {
      if (data.length > 0) {
        const accountStatus = data[0].account_status;
  
        if (accountStatus === 'active') {
          const hashedPassword = data[0].password;
  
          console.log('Entered Password:', password);
          console.log('Hashed Password from DB:', data[0].password);
  
          const sqlQuery2 = `SELECT * FROM users WHERE is_admin = '${data[0].is_admin}'`;
  
          const isMatch = await bcrypt.compareSync(password.trim(), hashedPassword);
  
          if (isMatch) {
            await dbCon.query(sqlQuery2, async (error, data2) => {
              if (data2) {
                const auth = jwt.sign({ data: data2 }, SECURITYKEY);
                await dbCon.query(`UPDATE users SET last_login = NOW() WHERE id = '${data[0].id}'`);
  
                res.json({
                  status: 200,
                  message: 'Login success',
                  token: auth,
                  email: data2[0].email,
                });
                
              }

             
              loggedInUserEmail=data[0].email;
  
                await auditLog(data[0].email, 'login');
                await sendWelcomeEmail(data[0].email);
            }
            
            );
          } else {
            res.json({
              status: 400,
              message: 'Password does not match',
            });
          }
        } else {
          res.json({
            status: 400,
            message: 'Account is inactive. Please contact the admin department.',
          });
        }
      }
    };
  
    const sqlQuery = `SELECT * FROM users WHERE email = ?`;
    const sqlQuery1 = `SELECT * FROM users WHERE username = ?`;
  
    try {
      console.log('Executing SQL Query:', sqlQuery, [identifier]);
      const data = await executeQuery(sqlQuery, [identifier]);
  
      if (data.length === 0) {
        console.log('Executing SQL Query:', sqlQuery1, [identifier]);
        const data1 = await executeQuery(sqlQuery1, [identifier]);
  
        if (data1.length === 0) {
          res.json({
            status: 400,
            message: 'User does not exist',
          });
        } else {
          checkPassword(data1);
        }
      } else {
        checkPassword(data);
      }
    } catch (error) {
      console.error('Error:', error);
      res.json({
        message: error.message,
      });
    }
  };
  
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
  





  
  const userSignup = async (req, res) => {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashpwd = await bcrypt.hash(password, salt);
  
    const sqlEmailQuery = `SELECT * FROM users WHERE email = ?`;
    const sqlUsernameQuery = `SELECT * FROM users WHERE username = ?`;
    const values = [email];
  
    try {
      console.log('Executing SQL Query:', sqlEmailQuery, values);
      const emailData = await executeQuery(sqlEmailQuery, values);
      console.log('Result of Email Check Query:', emailData);
  
      console.log('Executing SQL Query:', sqlUsernameQuery, [username]);
      const usernameData = await executeQuery(sqlUsernameQuery, [username]);
      console.log('Result of Username Check Query:', usernameData);
      if (emailData.length > 0) {
        res.json({
          status: 400,
          message: 'User with this email already exists',
        });
      } else if (usernameData.length > 0) {
        res.json({
          status: 400,
          message: 'User with this username already exists',
        });
      } else {
        // Insert new user into the registration table
        const insertQuery = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
      
        const insertValues = [username, email, hashpwd];
        console.log('Hashed Password:', hashpwd);
      
        console.log('Executing SQL Query:', insertQuery, insertValues);
        await executeQuery(insertQuery, insertValues);
      
        res.json({
          status: 200,
          message: 'a Verification mail has been sent to your email id',
        });

        let mailSubject='mail verification';
        const randomToken= randomstring.generate();
        let content='<p>hii '+req.body.username+'</p><p>please click on the link to verify your email</p><a href="http://localhost:5000/mail-verification?token='+randomToken+'">click here</a>';
      sendMail(req.body.email,mailSubject,content);

      dbCon.query('UPDATE users set token=? where email=?',[randomToken,req.body.email],(err,result)=>{
        if(err){
            return res.status(400).send({
                msg:err});
                    }
                          });
                          
                          
                          await auditLog(email, 'signup');
      }
    } catch (error) {
      console.error('Error:', error);
      res.json({
      message: error.message,
      });
      }
      };

      const getLoggedInUserEmail = () => {
        return loggedInUserEmail;
      };



const verifyMail =(req,res)=>{
  var token=req.query.token;

  dbCon.query('SELECT * FROM users WHERE token=?',token,function(error,result,fields){

if(error){

  console.log(error.message);
}
if(result.length>0){

  dbCon.query(`UPDATE users Set token = null,is_verified = 1 where id= '${result[0].id}' `);

  return res.render('mail-verification', {
    message: 'Your email has been verified',
    loginLink: 'http://localhost:3000/login'
  });
  

}
else{
  return res.render('404');
}



        });


      }




const usersList=(req, res) => {
  const query = 'SELECT * FROM users';
  dbCon.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
};
const customerList=(req, res) => {
  const query = 'SELECT * FROM customers';
  dbCon.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
};






const deleteUser = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM users WHERE id = ?';
  dbCon.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'User deleted successfully' });
  });
};

const updateUserAccountStatus = (req, res) => {
  const { id } = req.params;
  const { account_status } = req.body;

  const query = 'UPDATE users SET account_status = ? WHERE id = ?';
  dbCon.query(query, [account_status, id], (err, results) => {
    if (err) {
      console.error('Error updating account status:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Account status updated successfully' });
  });
};






const updatecustomerStatus = (req, res) => {
  const  {id}  = req.params;
  const { status } = req.body;

console.log("hiii",id);
  const query = 'UPDATE customers SET status = ? WHERE customer_email = ?';
  

  dbCon.query(query, [status, id], (err, results) =>  {
    if (err) {
      console.error('Error updating account status:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Account status updated successfully' });
    console.log(results);

  });
};







const forgetPassword = (req, res) => {
  var email = req.body.email;
  dbCon.query('SELECT * FROM users WHERE email=? limit 1', email, function(error, result, fields) {
    if (error) {
      console.log(error);
      return res.status(400).json({ message: error });
    }

    if (result.length > 0) {
      let mailSubject = 'forget password';
      const randomToken = randomstring.generate();
      let content = '<p>hii ' + result[0].username + '</p><p>please click on the link to reset your password</p><a href="http://localhost:5000/forget-Password?token=' + randomToken + '">click here</a>';
      sendMail(email, mailSubject, content);

      dbCon.query(`DELETE FROM password_resets where email ='${email}'`);
      dbCon.query(`INSERT into password_resets(email,token) values('${email}','${randomToken}')`);

      return res.status(200).json({ status: 200, message: 'Reset Email has been sent to mail' });
    }

    return res.status(404).json({ status: 404, message: 'Email not found' });
  });
};




const resetPassword= (req,res)=>{



try {
  var token=req.query.token;
  if(token==undefined){
   res.render('404');
  }

dbCon.query('SELECT * FROM password_resets WHERE token=?',token,function(error,result,fields){

if(error){
  console.log(error.message); }

if(result.length>0){

  dbCon.query('SELECT * FROM users WHERE email=?',result[0].email,function(error,result,fields){

    if(error){
      console.log(error.message); }


      
  res.render('reset-password',{user:result[0]});
  });


}
else{
  res.render('404');
}

}
)
} catch (error) {
  console.log(error.message);
}


}




const resetPasswordPost = (req, res) => {

  const updatedTime = new Date().toISOString("en-US", { timeZone: "Asia/Kolkata" });
  if (req.body.password !== req.body.confirm_password) {
    res.render('reset-password', {error_message:'Password does not match',user:{id:req.body.user_id,email:req.body.email}});
   
  }

  bcrypt.hash(req.body.confirm_password,10,(err,hash)=>{
if(err){

  console.log(err);
}

dbCon.query(`DELETE FROM password_resets where email ='${req.body.email}'`);

dbCon.query(`UPDATE  users SET password ='${hash}' where id ='${req.body.user_id}'`);

dbCon.query(`UPDATE  users SET updated_at ='${updatedTime}' where id ='${req.body.user_id}'`);


return res.render('message', {
  message: 'Your password has been changed successfully',
  loginLink: 'http://localhost:3000/login'
});


  })
}




// GET request to fetch all templates
const fetchTemp = (req, res) => {
  dbCon.query('SELECT * FROM templates', (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
};

// POST request to create a new template
const newTemp = (req, res) => {
  const { body, type } = req.body;
  const email = getLoggedInUserEmail();
  const insertQuery = `INSERT INTO adminpowersaudit (email, type, template_name) VALUES (?, ?, ?)`;
  const insertValues = [email, "Creating", type];

  dbCon.query(insertQuery, insertValues, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log('Executing SQL Query:', insertQuery, insertValues);
  

    dbCon.query('INSERT INTO templates (body, type) VALUES (?, ?)', [body, type], (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.sendStatus(201);
    });
  });
};


// PUT request to update a template
const updateTemp = (req, res) => {
  const { body, type } = req.body;
  const email = getLoggedInUserEmail();
  const templateId = req.params.templateId; // Make sure to retrieve the templateId

  const insertQuery = `INSERT INTO adminpowersaudit (email, type, template_name) VALUES (?, ?, ?)`;
  const insertValues = [email, 'updating', type];

  dbCon.query(insertQuery, insertValues, (error, auditResults) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log(insertQuery,insertValues);

    dbCon.query('UPDATE templates SET body = ? WHERE id = ?', [body, templateId], (error, updateResults) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.sendStatus(201);
    });
  });
};



// DELETE request to delete a template
const DeleteTemp =(req, res) => {
  const templateId = req.params.id;
  const { type } = req.body;
  const email = getLoggedInUserEmail();
  
  const insertQuery = `INSERT INTO adminpowersaudit (email, type, template_name) VALUES (?, ?, ?)`;
  const insertValues = [email, 'Deleting', type];

  dbCon.query(insertQuery, insertValues, (error, auditResults) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log(insertQuery,insertValues);

  dbCon.query('DELETE FROM templates WHERE id = ?', [templateId], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.sendStatus(201);
  });
});
};


const audit =(req, res) => {
  dbCon.query('SELECT * FROM audit', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch audit logs' });
    } else {
      res.json(results);
    }
  });
};


const adminpowersaudit =(req, res) => {
  dbCon.query('SELECT * FROM adminpowersaudit', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch audit logs' });
    } else {
      res.json(results);
    }
  });
};
const customers =(req, res) => {
  dbCon.query('SELECT * FROM customers', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch audit logs' });
    } else {
      res.json(results);
    }
  });
};





      
      module.exports = { userLogin, userSignup, 
        getLoggedInUserEmail ,
        verifyMail,deleteUser,
        usersList,customerList,updateUserAccountStatus,
        updatecustomerStatus,
        forgetPassword,resetPassword,resetPasswordPost
      ,fetchTemp,newTemp,updateTemp,DeleteTemp,audit,adminpowersaudit,customers
      
      };