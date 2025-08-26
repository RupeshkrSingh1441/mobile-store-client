import React from 'react';
import axios from 'axios';

const CheckoutButton = ({ amount }) => {
    const handlePayment = async () => {
        try{
            const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/payment/create-order`, { amount });

            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,//INR
                order_id: data.orderId,
                handler: function (response) {
                    alert("Payment Successful: " + response.razorpay_payment_id + " " + response.razorpay_order_id + " " + response.razorpay_signature);                    
                },
                theme: {
                    color: '#3399cc'
                }
        };

        const razor = new window.Razorpay(options);
        razor.open();
    } catch (error) {
        console.error("Error in payment: ", error);
        alert("Payment failed. Please try again.");
    };
};
 return (
        <button className='btn btn-warning mt-3' onClick={handlePayment}>
            Buy Now ₹{amount}
        </button>
    );
};

export default CheckoutButton;