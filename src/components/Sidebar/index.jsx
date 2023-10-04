import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutContext } from '../../contexts/layout';
import { AuthContext } from '../../contexts/auth';
import { FaUserGraduate } from "react-icons/fa";
import { TbHeartRateMonitor } from 'react-icons/tb';
import { SiBookstack } from 'react-icons/si';
import { GrCertificate } from 'react-icons/gr';
import { AiOutlinePoweroff } from 'react-icons/ai';
import { Image } from "react-bootstrap";
import defaultProfile from '../../assets/images/simbolo.png';
import './styles.css';

const Sidebar = () => {
    const { isOpen, toggle } = useContext(LayoutContext);
    const { signOut } = useContext(AuthContext);
    const navigate = useNavigate();
    const activeSideBar = () => {
        const currentPage = window.location.href;
        const currentItem = document.querySelectorAll('.link');
        for (let i = 0; i < currentItem.length; i++) {
            if (currentItem[i].href.startsWith(currentPage)) {
                currentItem[i].classList.add('active');
                break;
            }
            console.log('')
        }
    }
    activeSideBar();

    const menuItem = [
        {
            path: "/cursos",
            name: "Cursos",
            icon: <TbHeartRateMonitor />
        },
        {
            path: "/material",
            name: "Material",
            icon: <SiBookstack />
        },
        {
            path: "/certificados",
            name: "Certificados",
            icon: <GrCertificate />
        },
        {
            path: "/perfil",
            name: "Meu Perfil",
            icon: <FaUserGraduate />
        },

    ]

    const handleSignOut = () => {
        const advice = "Desejas realmente terminar sessão do sistema ?";
        if(window.confirm(advice) == true){
            signOut(); navigate('/');
        }
    }

    return (
        <div className={isOpen ? 'open sidebar bg_tracking' : 'close sidebar bg_tracking'}>
            <header className='top_section border-bottom'>
                    <Image src={defaultProfile} className={isOpen ? 'open logo-img' : 'close logo-img'} alt='User Image' width={30} />
                {/*  */}
                <div className='text logo-text'>
                    <span className={isOpen ? 'open name ps-2' : 'close name ps-2'}><span style={{color: '#cc1c1e'}}>Procul</span><span style={{color: '#fcfcfc'}}>Discipulus</span></span>
                </div>
            </header>
            <div className='menu'>
                {menuItem.map((item, index) => (
                    <NavLink to={item.path} key={index} className='link' onClick={toggle}>
                        <div className='icon'>{item.icon}</div>
                        <div className={isOpen ? 'open link_text' : 'close link_text'}>{item.name}</div>
                    </NavLink>
                ))}
            </div>
            <footer>
                <button type='button' onClick={handleSignOut} className='btn btn-danger w-100 px-1' style={{backgroundColor: '#cc1c1e',color: '#fcfcfc'}}><AiOutlinePoweroff /> {isOpen ? 'Terminar sessão' : ''}</button>
            </footer>
        </div>
    );
}

export default Sidebar;