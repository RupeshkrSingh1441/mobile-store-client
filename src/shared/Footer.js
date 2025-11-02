import React from 'react';

const Footer = () => (
    <footer className="sticky-footer">
        <div className="container">
            <span>&copy; {new Date().getFullYear()} Mobile Store. All rights reserved.</span>
        </div>
    </footer>
);

export default Footer;