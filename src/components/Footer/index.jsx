import React from 'react';

const Footer = ({ title }) => {
    return (
        <footer className='bg-white' style={{ padding: '30px' }}>
            <p className='text-center text-muted mb-0'><b>Procul Disciplus - {new Date().getFullYear()}</b></p>
        </footer>
    );
}

export default Footer;