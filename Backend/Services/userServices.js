const dbCon = require('../config/dbConfig');

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const checkPassword = (data) => {
    if (data.length > 0) {
      if (data[0].password === password) {
        res.json({
          status: 200,
          message: 'Login success',
        });
      } else {
        res.json({
          status: 400,
          message: 'Password does not match',
        });
      }
    }
  };

  const sqlQuery = `SELECT * FROM registration WHERE email = ?`;
  const sqlQuery1 = `SELECT * FROM registration WHERE username = ?`;

  try {
    console.log('Executing SQL Query:', sqlQuery, [email]);
    const data = await executeQuery(sqlQuery, [email]);
    

    if (data.length === 0) {
      console.log('Executing SQL Query:', sqlQuery1, [email]);
      const data1 = await executeQuery(sqlQuery1, [email]);
      

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

module.exports = { userLogin };
