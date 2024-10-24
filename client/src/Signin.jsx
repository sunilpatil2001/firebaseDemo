import { Modal } from 'react-bootstrap';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SigninValidation from './validations/signinValidation';
import { BiLogInCircle } from 'react-icons/bi';
import axios from 'axios';
import baseUrl from './assets/baseUrl';
function Signin() {
    const nevigate = useNavigate();
    const [errors, setErrors] = useState({})
    const [user, setUser] = useState("");
    const [values, setValues] = useState({
        email: "",
        pass: "",
        user: ""
    })
    const showPass = (e) => {
        let temp = document.getElementById("pass");
        if (temp.type === "password") {
            temp.type = "text";
        }
        else {
            temp.type = "password";
        }
    }
    const handleChange = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!user) {
            document.getElementById('fail').innerHTML = 'Please select the user'
        }
        const x = SigninValidation(values)
        setErrors(x);
        if (Object.keys(x).length === 0 && user) {
            values.user = user
            document.getElementById('s').innerHTML = `<div class="spinner-border spinner-border text-warning" role="status"><span class="visually-hidden">Loading...</span></div>`
            try {
                await axios.post(baseUrl + '/signin', values).then(res => {
                    console.log(res)
                    console.log(res.data !== "failed" && res.data !== "wrong creds")
                    if (res.data !== 'failed' && res.data !== "wrong creds") {
                        var userName = values.email.split('@')
                        sessionStorage.setItem('username', userName[0])
                        sessionStorage.setItem('jwt', res.data)
                        sessionStorage.setItem('user', user)
                        nevigate("/" + user);
                    }
                    else if (res.data === 'wrong creds') {
                        document.getElementById('r').innerHTML = 'wrong credentials !!';
                        document.getElementById('r').className = 'text-danger mt-2';
                        document.getElementById('s').innerHTML = `<p className="btn btn-primary">Sign In</p>`
                    }
                    else if (res.data === 'failed') {
                        document.getElementById('r').innerHTML = 'Server Error ... Refreshing !!';
                        document.getElementById('r').className = 'text-danger mt-2';
                        setTimeout(() => {
                            nevigate('/signin');
                        }, 3000);
                    }
                })
            }
            catch (e) {
                document.getElementById('r').innerHTML = 'something went wrong !!';
                document.getElementById('r').className = 'text-danger mt-2';
            }
        }
    }
    const initModal = () => {
        if (isShow) {
            nevigate('/')
        }
        return invokeModal(!isShow)
    }
    const [isShow, invokeModal] = useState(true)
    return (
        <div className='signup'>
            <Modal show={isShow} aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton onClick={initModal}>
                    <Modal.Title className='d-flex justify-content-center'><h2 className="text-center"><BiLogInCircle /> Sign In</h2></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4 id='r'> </h4>
                    <div className="m-0 col-sm-12 form-card">
                        <div className="form-check d-inline-block mt-3">
                            <input className="form-check-input" onClick={() => setUser('admin')} type="radio" name="user" value='admin' id="admin" required />
                            <label className="form-check-label" htmlFor="admin">
                                Admin
                            </label>
                        </div>
                        <div className="form-check d-inline-block">
                            <input className="form-check-input" onClick={() => setUser('doctor')} type="radio" name="user" value='doctor' id="doctor" required />
                            <label className="form-check-label" htmlFor="doctor">
                                Doctor
                            </label>
                        </div>
                        <p className="text-danger mx-2" id="fail"></p>
                        <form className="form m-2 mb-0">
                            <label className="form-label mt-4" htmlFor="email">Email</label>
                            <input type="email" className="form-control" onChange={handleChange} id="email" name="email" placeholder="enter your email" required />
                            {errors.email && <p className="text-danger">{errors.email}</p>}
                            <label className="form-label mt-3" htmlFor="pass">Password</label>
                            <input type="password" className="form-control" onChange={handleChange} id="pass" name="pass" placeholder="enter your password" required />
                            <input type='checkbox' onClick={showPass} /><span className='text mx-1'>show password</span>
                            {errors.pass && <p className="text-danger">{errors.pass}</p>}
                            <button id="s" className="btn btn-primary mt-2 d-block" onClick={handleSubmit}>Sign in</button>
                        </form>
                        <Link to='/password' className='mx-2'>forgot password ?</Link>
                        <div className="text-center">
                            <p>New User ? Sign up here</p>
                            <Link to="/signup"><button className="btn btn-primary">Sign up</button></Link>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Signin;