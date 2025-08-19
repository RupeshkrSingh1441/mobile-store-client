import React, {useState} from 'react';
import axios from 'axios';
//import './Register.css;'

const Register =()=>{
    const [model, setModel] = useState({fullName:'', email:'', password:''});
    const [message, setMessage] = useState('');

    const handleChange = e => setModel({...model, [e.target.name]:e.target.value});

    const handleSubmit = async e => {
        e.preventDefault();
        try{
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, model);
            setMessage(res.data);
        } catch(err){
            setMessage(err.response?.data || "Error during registration");
        }
    };

    return (
        <div className='register-wrapper d-flex align-items-center justify-content-center'>         
          <form className='register-form p-4 shadow-lg rounded' onSubmit ={handleSubmit}>
          <h2 className='mb-4 text-center'>Register</h2>
          <div className='mb-3'>
           <input type='text' name='fullName' className='form-control mb-2' placeholder='Full Name' onChange={handleChange}/>
           </div>
           <div className='mb-3'>
           <input type='email' name='email' className='form-control mb-2' placeholder='Email' onChange={handleChange}/>
           </div>
           <div className='mb-3'>
           <input type='password' name='password' className='form-control mb-2' placeholder='Password' onChange={handleChange}/>
           </div>
           <button className='btn btn-primary w-100'>Register</button>
           {message && <div className='mt-3 alert alert-success'>{message}</div>}
          </form>
        </div>
    );
};

export default Register;