import { Modal } from 'react-bootstrap';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupValidation from './validations/signupValidation';
import axios from 'axios';
import baseUrl from './assets/baseUrl';
function Signup() {
  const nevigate = useNavigate();
  const [errors, setErrors] = useState({})
  const [values, setValues] = useState({
    user: "",
    fname: "",
    lname: "",
    contact: "",
    email: "",
    password: ""
  })
  const handleChange = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const x = SignupValidation(values)
    setErrors(x);
    try {
      if (Object.keys(x).length === 0) {
        document.getElementById('r').innerHTML = `<div class=" mt-2 spinner-border spinner-border-sm text-warning" role="status"><span class="visually-hidden">Loading...</span></div>`
        await axios.post(baseUrl+'/signup', values).then(res => {
          if (res.data === 'success') {
            document.getElementById('r').innerHTML = 'Account Created Successfully !!';
            document.getElementById('r').className = 'text-success mt-2';
            setTimeout(() => {
              nevigate('/signin');
            }, 3000);
          }
        })
      }
    }
    catch (e) {
      document.getElementById('r').innerHTML = 'Please try again !!'
      document.getElementById('r').className = 'text-danger mt-2';
      setTimeout(() => {
        nevigate('/');
      }, 2000);
    }
  }
  const showPass = (e) => {
    let temp = document.getElementById("password");
    if (temp.type === "password") {
      temp.type = "text";
    }
    else {
      temp.type = "password";
    }
  }
  const handleLeave = (e) => {
    if (!e.target.value)
      document.getElementById(e.target.id).style.borderBottom = '2px solid red'
    else
      document.getElementById(e.target.id).style.borderBottom = '1px solid black'
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
          <Modal.Title className='d-flex justify-content-center'>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="user"><strong>Role</strong></label>
              <select className="form-control" id='user' name='user' onChange={handleChange}>
                <option selected value="">select</option>
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            <div className="form-group m-0">
              <label htmlFor="fname"><strong>First Name</strong></label>
              <input type="text" name="fname" id='fname' className="form-control" onBlur={handleLeave} onChange={handleChange} placeholder="first name"
                autoComplete="off" />
              {errors.fname && <p className='text-danger m-0'>{errors.fname}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="fname"><strong>Last Name</strong></label>
              <input type="text" name="lname" id='lname' className="form-control" onBlur={handleLeave} onChange={handleChange} placeholder="last name"
                autoComplete="off" required />
              {errors.lname && <p className='text-danger m-0'>{errors.lname}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="contact"><strong>Contact</strong></label>
              <input type="tel" name="contact" id='contact' className="form-control" onBlur={handleLeave} onChange={handleChange} placeholder="contact" autoComplete="off" required />
              {errors.contact && <p className='text-danger m-0'>{errors.contact}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="email"><strong>Email address</strong></label>
              <input type="text" name="email" id='email' className="form-control" onBlur={handleLeave} onChange={handleChange} placeholder="email"
                autoComplete="off" required />
              {errors.email && <p className='text-danger m-0'>{errors.email}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="password"><strong>Password</strong></label>
              <input type="password" id='password' name="password" onChange={handleChange} className="form-control"
                placeholder="password"
                autoComplete="off" required />
              <input type='checkbox' onClick={showPass} /><span className='text mx-1'>show password</span>
              {errors.password && <p className='text-danger m-0'>{errors.password}</p>}

            </div>
            <div className="col-md-12 text-center mt-2">
              <h4 id='r'><input onClick={handleSubmit} type='submit' value='Sign up' className='btn btn-primary' /></h4>
            </div>
            <div className="col-md-12 text-center">
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Signup;