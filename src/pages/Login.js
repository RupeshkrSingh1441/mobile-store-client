import React, {useState} from 'react';
import axios from 'axios';

const Login =()=>{
    const [model, setModel] = useState({email:'', password:''});
    const [error, setError] = useState('');

    const handleChange = e => setModel({...model, [e.target.name]:e.target.value});

    const handleSubmit = async e => {
        e.preventDefault();
        try{
            const res = await axios.post('${process.env.REACT_APP_API_URL}/auth/login', model);
            localStorage.setItem("token",res.data.token);
            window.location.href = "/"; // redirect after login
        } catch(err){
            setError(err.res.data || "Login failed");
        }
    };

    return (
        <div className='container mt-5'>
          <h2>Login</h2>
          <form onSubmit ={handleSubmit}>
           <input type='email' name='email' className='form-control mb-2' placeholder='Email' onChange={handleChange}/>
           <input type='password' name='password' className='form-control mb-2' placeholder='Password' onChange={handleChange}/>
           <button className='btn btn-success'>Login</button>
          </form>
          {error && <div className='mt-3 alert alert-danger'>{error}</div>}
        </div>
    );
};

export default Login;