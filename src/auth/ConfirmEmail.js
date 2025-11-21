import React,{useEffect,useState} from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const ConfirmEmail =() => {
    const [params] = useSearchParams();
    const [message,setMessage] = useState("Verifying...");

    useEffect(() => {
        const verify = async () => {
            try{
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/confirm-email`,{
                    params:{
                        userId: params.get("userId"),
                        token: params.get('token')
                    }
                });
                setMessage(res.data);
            } catch{
                setMessage('Email confirmation failed');
            }
        };
        verify();
    },[params]);

    return (
        <div className="login-wrapper d-flex align-items-center justify-content-center">
            <div className='login-form p-4 shadow-lg rounded'>
                <h2 className='mb-4 text-center'>Email confirmation</h2>
                <p className='mb-4 text-center'>{message}</p>
                </div>  
        </div>
    );
};

export default ConfirmEmail;