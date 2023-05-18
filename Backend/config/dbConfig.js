const mysql =require('mysql')

const env=require('dotenv').config

const dbConfig=mysql.createConnection({
    host:"localhost",
    database:"infosys",
    user:"root",
    password:""
})

dbConfig.connect((error)=>{
    if(error) throw error
    console.log('database connected successfully')
})

  
   

module.exports=dbConfig