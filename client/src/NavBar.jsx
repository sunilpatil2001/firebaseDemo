import { Link, Outlet } from 'react-router-dom';
import './App.css'
import { FaUserDoctor } from "react-icons/fa6";
import { RiAdminLine } from "react-icons/ri";
import { FaPowerOff } from "react-icons/fa6";
function NavBar() {
    return (
        <div>
            <nav className="navbar navbar-expand-md fixed-top bg-primary shadow d-flex">
                <div className="container-fluid">
                    <a className="navbar-brand " href="/">Logo</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse " id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            <Link to={sessionStorage.getItem('user') ? '/'+sessionStorage.getItem('user') : '/'}><a className="nav-link" aria-current="page" href="/"><button className="btn btn-none text-light" data-bs-toggle={window.innerWidth > 770 ? "" : "collapse"} data-bs-target={window.innerWidth > 770 ? "" : "#navbarNavAltMarkup"}>{sessionStorage.getItem('user') !==null ? 
                            (sessionStorage.getItem('user') === 'doctor' ? <FaUserDoctor size={25}/> : <RiAdminLine size={25}/>) : 'Home'}</button></a></Link>
                            <Link to='/contact'><a className="nav-link" href=""><button className="btn btn-none text-light" data-bs-toggle={window.innerWidth > 770 ? "" : "collapse"} data-bs-target={window.innerWidth > 770 ? "" : "#navbarNavAltMarkup"}>Contact Us</button></a></Link>
                            {sessionStorage.getItem('user') === 'doctor' && <a className="nav-link" href='/'><Link to='appointments'><button className="btn btn-none text-light" data-bs-toggle={window.innerWidth > 770 ? "" : "collapse"} data-bs-target={window.innerWidth > 770 ? "" : "#navbarNavAltMarkup"}>Today's Appointments</button></Link></a>}
                            <Link to='/signin'><a className="nav-link" href='/' style={{ visibility: sessionStorage.getItem('username') === null ? '' : 'hidden' }}><button className="btn btn-none text-light" data-bs-toggle={window.innerWidth > 770 ? "" : "collapse"} data-bs-target={window.innerWidth > 770 ? "" : "#navbarNavAltMarkup"}>Login</button></a></Link>
                        </div>
                    </div>
                </div>
                {sessionStorage.getItem('username') !== null && <div className='username text-center w-md-25 w-md-50'>
                    <span className='d-inline mx-2'>{sessionStorage.getItem('username')}</span><Link to='/logout'className='text-light'><FaPowerOff className='d-inline' /></Link>
                </div>}
            </nav>
            <Outlet />
        </div>
    )
}

export default NavBar