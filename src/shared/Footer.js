import React from 'react';

const Footer = () => (
    <footer className="bg-light text-center py-3 mt-auto">
        <div className="container">
            <span>&copy; {new Date().getFullYear()} Mobile Store. All rights reserved.</span>
        </div>
    </footer>
);

export default Footer;