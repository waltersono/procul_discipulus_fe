import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import { LayoutContext } from '../../contexts/layout';

import { FaBars } from "react-icons/fa";
import { Image } from "react-bootstrap";
import defaultProfile from '../../assets/images/profile.png';

const Header = () => {
    const { isShow, showProfile, toggle, pageTitle } = useContext(LayoutContext);
    const { signOut, user } = useContext(AuthContext);
    const navigate = useNavigate();
    return (
        <header style={{ padding: '15px', backgroundColor: '#FFFFFF' }} className='nav_bar border-bottom'>
            <div className='d-flex align-items-center'>
                <span style={{ marginLeft: '0px', cursor: 'pointer' }} className='bars'><FaBars onClick={toggle} /></span>
                <span className='ms-2 text-dark mb-1'>{pageTitle}</span>
            </div>
            <div className=''>
                <button className='border-0 bg-white p-0' onClick={showProfile}>
                    <span className='text-dark me-2' style={{fontWeight: 600}}>{user.name} {user.surname}</span>
                    <Image src={defaultProfile} className='' alt='User Image' width={30} />
                </button>
                <div className='user-menu p-2' style={{ width: '250px', marginRight: isShow ? '0' : '-250px' }}>
                    <div className='text-center'>
                        <Image src={defaultProfile} className='' alt='User Image' width={130} />
                        <p>
                            <b className='text-white'>{user.name} {user.surname}</b> <br />
                            <small>Membro desde {new Date(user.created_at).getFullYear()}</small>
                        </p>
                    </div>
                    <div className='w-100 d-flex justify-content-between p-2'>
                        <button
                            onClick={(e) => { showProfile(); /*navigate('/administrators/profile');*/ }}
                            className='btn btn-success btn-flat'
                        >Perfil</button>
                        <button
                            onClick={(e) => { signOut(); navigate('/'); }}
                            className='btn btn-danger btn-flat float-right'
                        >Sair</button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;