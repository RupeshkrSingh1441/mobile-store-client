import React, {useState} from 'react';
import axios from 'axios';

const Register =()=>{
    const [model, setModel] = useState({fullName:'', email:'', password:''});
    const [message, setMessage] = useState('');

    const handleChange = e => setModel({...model, [e.target.name]:e.target.value});

    const handleSubmit = async e => {
        e.preventDefault();
        try{
            const res = await axios.post('${process.env.REACT_APP_API_URL}/auth/register', model);
            setMessage(res.data);
        } catch(err){
            setMessage(err.res.data || "Error during registration");
        }
    };

    return (
        <div className='container mt-5'>
          <h2>Register</h2>
          <form onSubmit ={handleSubmit}>
           <input type='text' name='fullName' className='form-control mb-2' placeholder='Full Name' onChange={handleChange}/>
           <input type='email' name='email' className='form-control mb-2' placeholder='Email' onChange={handleChange}/>
           <input type='password' name='password' className='form-control mb-2' placeholder='Password' onChange={handleChange}/>
           <button className='btn btn-primary'>Register</button>
          </form>
          {message && <div className='mt-3 alert alert-info'>{message}</div>}
        </div>
    );
};

export default Register;