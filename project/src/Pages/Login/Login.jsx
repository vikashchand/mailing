import React from 'react';
import { useFormik } from "formik";
import { loginSchema } from "../../Schemas/index"
import { Link } from 'react-router-dom';
import '../Registration/Registration.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: loginSchema,
      onSubmit: (values, action) => {
        console.log("Login Form Values:", values);
        action.resetForm();
      },
    });

    const loginHandle=()=>{
      axios.post('http://localhost:5000/user/login',
      {email:values.email,password:values.password})
      .then(data=>{
        if(data.data.status===200){
          toast.success(data.data.message)
        }
        else{
          toast.error(data.data.message);
        }
      })
      .catch(error=>console.log(error))
    }
  return (
    <>
      <div className="container">
        <div className="modal">
          <div className="modal-container">
            <div className="modal-left">
              <h1 className="modal-title">Welcome Back!</h1>
              <p className="modal-desc">
                Infosys project - Login to your account
              </p>
              <ToastContainer />
              <form onSubmit={handleSubmit}>
                <div className="input-block">
                  <label htmlFor="email" className="input-label">
                    Username or Email
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    name="email"
                    id="email"
                    placeholder="Username or Email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.email && touched.email ? (
                    <p className="form-error">{errors.email}</p>
                  ) : null}
                </div>
                <div className="input-block">
                  <label htmlFor="password" className="input-label">
                    Password
                  </label>
                  <input
                    type="password"
                    autoComplete="off"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.password && touched.password ? (
                    <p className="form-error">{errors.password}</p>
                  ) : null}
                </div>
                <div className="modal-buttons">
                  <button className="input-button" type="submit"
                  onClick={()=>{

                    loginHandle()
                  }}
                  >
                    Login
                    
                  </button>
                </div>
              </form>
              <p className="sign-up">
                Don't have an account? <Link to="/">Sign Up now</Link>
              </p>
            </div>
            <div className="modal-right">
              <img
                src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
