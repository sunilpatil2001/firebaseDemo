import axios from "axios"
import { useState } from "react"
import { Modal } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import baseUrl from './assets/baseUrl'

function Pasword() {
    const nevigate = useNavigate()
    const [isShow, invokeModal] = useState(true)
    const [valid, setValid] = useState(false)
    const [otp, setOtp] = useState("")
    const [values, setValues] = useState({
        email: "",
        password: "",
        user: "",
        otp: ""
    })
    const initModal = () => {
        if (isShow) {
            nevigate(-1)
        }
        return invokeModal(!isShow)
    }
    const handleChange = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }
    const handleOtp = async (e) => {
        e.preventDefault()
        document.getElementById('p').innerHTML = `<div class=" mt-2 spinner-border spinner-border-sm text-warning" role="status"><span class="visually-hidden">Loading...</span></div>`
        await axios.post(baseUrl + '/send_email', values).then(res => {
            if (res.data === 'failed') {
                document.getElementById('p').innerHTML = "Email is not registered !"
                document.getElementById('p').className = "text-danger"
            }
            else if (res.data !== 'failed') {
                setOtp(res.data)
                document.getElementById('p').innerHTML = "Email sent successfully !!"
                document.getElementById('p').className = "text-success"
            }
        })
    }
    const handleMatch = () => {
        console.log(values.otp === otp.toString())
        if (values.otp !== otp.toString()) {
            document.getElementById('t').innerHTML = "OTP doesn't match"
            document.getElementById('t').className = "text-danger"
        }
        else {
            document.getElementById('t').innerHTML = "OTP matched"
            document.getElementById('t').className = "text-success"
            setValid(true)
        }
    }
    const showPass = (e) => {
        let temp = document.getElementById("new password");
        if (temp.type === "password") {
            temp.type = "text";
        }
        else {
            temp.type = "password";
        }
    }
    const handleUpdate = async (e) => {
        e.preventDefault()
        var passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        if (values.password.length < 8 || !passwordRegex.test(values.password)) {
            document.getElementById('pass').innerHTML = "Password must contain at least 8 characters including a Upper and lower letter, number, special character";
            document.getElementById('pass').className = "text-danger"
        }
        else if (valid) {
            document.getElementById('pass').innerHTML = "Password accepted";
            document.getElementById('pass').className = "text-success"
            document.getElementById('su').innerHTML = `<div class=" mt-2 spinner-border spinner-border-sm text-warning" role="status"><span class="visually-hidden">Loading...</span></div>`
            try {
                await axios.post(baseUrl + '/change_password', values).then(res => {
                    if (res.data === 'success') {
                        document.getElementById('su').innerHTML = "Password changed successfully !!"
                        document.getElementById('su').className = "text-success"
                        setTimeout(() => {
                            nevigate('/signin');
                        }, 2000);
                    }
                })
            }
            catch (e) {
                document.getElementById('su').innerHTML = "somthing went wrong !!"
                document.getElementById('su').className = "text-danger"
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        }
    }
    return (
        <Modal show={isShow} aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton onClick={initModal}>
                <Modal.Title className='d-flex justify-content-center'><h3 className="text-center">Reset Password</h3></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="form m-2 mb-0">
                    <div className="form-group">
                        <label htmlFor="user">Role</label>
                        <select className="form-control" id='user' name='user' onChange={handleChange}>
                            <option selected value="">select</option>
                            <option value="admin">Admin</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </div>
                    <label className="form-label" htmlFor="email">Please enter your registered email</label>
                    <input type="email" className="form-control" onChange={handleChange} id="email" name="email" placeholder="enter your email" required />
                    <h6 id="p"><button className="btn btn-primary mt-2" onClick={handleOtp}>Send OTP</button></h6>
                </form>
                <form className="form mx-2 mb-0">
                    <label className="form-label" htmlFor="otp">OTP</label>
                    <input type="text" onChange={handleChange} onBlur={handleMatch} className="form-control mt-0 pt-0" id="otp" name="otp" placeholder="enter OTP received in email" required />
                    <h6 id="t"> </h6>
                    <label className="form-label mt-2" htmlFor="new password">new password</label>
                    <input type="password" className="form-control mt-0 pt-0" onChange={handleChange} id="new password" name="password" placeholder="new password" required />
                    <input type='checkbox' onClick={showPass} /><span className='text mx-1'>show password</span>
                    <h6 id="pass" > </h6>
                    <h4 id="su"><button className="btn btn-primary mt-2" onClick={handleUpdate}>Change</button></h4>
                </form>
            </Modal.Body>
        </Modal>
    )
}
export default Pasword