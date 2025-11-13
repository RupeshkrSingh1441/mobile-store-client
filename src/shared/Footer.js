import React from 'react';
import "../components/Footer.css";

const Footer = () => (
    <footer className="sticky-footer footer text-center py-3">
        <div className="container">
            <span>&copy; {new Date().getFullYear()} Mobile Store. All rights reserved.</span>
        </div>
    </footer>
);

export default Footer;