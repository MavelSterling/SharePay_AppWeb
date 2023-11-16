import React, { useState } from 'react';
import logo from '../../assets/Logo.png';
import { Link } from 'react-router-dom';
import { FaBars, FaUser,FaUserFriends } from 'react-icons/fa';
import { FcCalendar,FcCurrencyExchange } from "react-icons/fc";


function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="sidebar-container">
            <div style={{ backgroundColor: '#ADD8E6' }}>
           
                <button className="toggle-btn" onClick={toggleSidebar}>
                <FaBars size={21} color="#000" />
                </button>

                <div className={`sidebar ${isOpen ? 'open' : 'closed'}`} style={{ backgroundColor: '#ADD8E6' }}>
           
                    <div style={{ padding: '15px', textAlign: 'center' }}>
                        <img src={logo} alt="SharePay Logo" width={100} />
                        <h2>SharePay App</h2>
                    </div>
                    <ul>
                        <li>
                            <Link to="/dashboard/user-information">
                            <FaUser /> Información del usuario
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/contacts">
                            <FaUserFriends /> Contactos
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/events">
                            <FcCalendar /> Eventos
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/payments">
                            <FcCurrencyExchange /> Pagos
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
