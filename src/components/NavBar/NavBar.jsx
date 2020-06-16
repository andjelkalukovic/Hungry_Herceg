import React from "react";
import { Link, useHistory } from "react-router-dom";
import './NavBar.css'
import { authService } from "../../services/auth.service";


const NavBar = () => {
    const history = useHistory()
    return (
        <div className="nav-bar">
            <div className="logo">
                <img src="/img/logo192.png" alt="logo" className="logo-icon" 
                onClick={() => history.push('/home') }/>
            </div>
            <div className="nav-fildes">
                <div></div>
                <div className="nav-filed homeFiled">
                    <Link to='/home' className='homeLink'>
                        <div className="icon-wrapper">
                            <img src="/img/home1.png" alt="icon" className="nav-bar-icon" />
                        </div>
                        <div className="nav-text">
                        Home</div>
                        </Link>
                </div>

                <div className="nav-filed">
                    <Link to='/createpoll'>
                        <div className="icon-wrapper">
                            <img src="/img/poll1.png" alt="icon" className="nav-bar-icon" />
                        </div>
                        <div className="nav-text">New Poll</div>
                        </Link>
                </div>


                <div className="nav-filed rest">
                    <Link to='/profile'>
                        <div className="icon-wrapper">
                            <img src="/img/profile1.png" alt="icon" className="nav-bar-icon" />
                        </div>
                        <div className="nav-text rest">
                        Profile</div>
                        </Link>
                </div>

                <div className="nav-filed">
                    <div  onClick={() => { authService.LogOut(); history.push('/login') }} className='logoutLink'>
                        <div className="icon-wrapper">
                            <img src="/img/logout2.png" alt="icon" className="nav-bar-icon" />
                        </div>
                        <div className="nav-text rest logout">Log Out</div>
                        </div>
                </div>
            </div>
        </div>
    )
}


export default NavBar