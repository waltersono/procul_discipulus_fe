import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutContext } from '../../contexts/layout';
import './style.css';

import Sidebar from '../../components/Sidebar';
// import Footer from '../../components/Footer';

const Dashboard = () => {
    const { isOpen } = useContext(LayoutContext);
    return (
        <div className='d-flex'>
            <Sidebar />
            <main className={isOpen ? 'open main' : 'close main'}>
                <Outlet />                
                {/* <Footer /> */}
            </main>
        </div>
    );
};

export default Dashboard;