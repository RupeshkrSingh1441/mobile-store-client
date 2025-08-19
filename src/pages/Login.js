import React, {useContext,useState} from 'react';
//import {AuthContext} from '../auth/AuthContext';
import axios from 'axios';

const Login =()=>{
    const [model, setModel] = useState({email:'', password:''});
    const [error, setError] = useState('');
    //const [login] = useContext(AuthContext) || [null, () => {}];
    

    const handleChange = e => setModel({...model, [e.target.name]:e.target.value});

    const handleSubmit = async e => {
        e.preventDefault();
        try{
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, model);
                //"https://localhost:7006/api/auth/login",model);                
            console.log("Login Response:", res);
            // const taken = res.data.token;
            // login(taken); // Update AuthContext with the new token
            localStorage.setItem("token",res.data.token);
            window.location.href = "/"; // redirect after login
        } catch(err){
            console.log("Login Error:", err);
            setError(err.response?.data || "Login failed");
        }
    };

    return (
        <div className='login-wrapper d-flex align-items-center justify-content-center'>         
          <form  className='login-form p-4 shadow-lg rounded' onSubmit ={handleSubmit}>
          <h2 className='mb-4 text-center'>Login</h2>
          <div className='mb-3'> <input type='email' name='email' className='form-control mb-2' placeholder='Email' onChange={handleChange}/></div>          
           <div className='mb-3'><input type='password' name='password' className='form-control mb-2' placeholder='Password' onChange={handleChange}/></div>           
           <button className='btn btn-success w-100'>Login</button>
           {error && <div className='mt-3 alert alert-danger'>{error}</div>}
          </form>
        </div>
    );
};

export default Login;