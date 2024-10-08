import axios from 'axios';
import Select from 'react-select'
import { useEffect, useState } from 'react';
import AddpatientValidation from './validations/addPatientValidation';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useNavigate } from 'react-router-dom';
import medicalOptions from './options/medical';
import baseUrl from './assets/baseUrl';

function AddPatient() {
    const [finishStatus, setfinishStatus] = useState(false);
    const nevigate = useNavigate();
    const [show, setShow] = useState(true);
    const [medical, setMedical] = useState([]);
    const [errors, setErrors] = useState({})
    const [values, setValues] = useState({
        name: "",
        contact: "",
        email: "",
        address: "",
        education: "",
        gender: "",
        marital: "",
        children: null,
        age: null,
        occupation: "",
        referral: "",
        medical: []
    })
    function handleMedical(data) {
        setMedical(data);
    }
    const handleClose = () => {
        setShow(!show);
        nevigate('/admin')
    }
    const handleChange = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }
    const onBackButtonEvent = (e) => {
        e.preventDefault();
        if (!finishStatus) {
            if (window.confirm("Do you want to go back ?")) {
                setfinishStatus(true)
                // your logic
            } else {
                window.history.pushState(null, null, window.location.pathname);
                setfinishStatus(false)
            }
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const x = AddpatientValidation(values)
        setErrors(x);
        medical.forEach(element => {
            values.medical.push(element.value)
        })
        console.log(values)
        try {
            if (Object.keys(x).length === 0) {
                document.getElementById('r').innerHTML = `<div class=" spinner-border spinner-border text-warning" role="status"><span class="visually-hidden">Loading...</span></div>`
                await axios.post(baseUrl + '/add_patient', values).then(res => {
                    if (res.data === 'success')
                        document.getElementById('r').innerHTML = 'Patient Added Successfully'
                    document.getElementById('r').className = 'text-success'
                    setTimeout(() => {
                        nevigate('/admin');
                    }, 3000);
                })
            }
        } catch (e) {
            document.getElementById('r').innerHTML = 'Please try again'
            document.getElementById('r').className = 'text-danger'
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }
    useEffect(() => {
        const jwt = sessionStorage.getItem('jwt')
        const user = sessionStorage.getItem('user')
        if (!jwt || user !== 'admin')
            nevigate('/signin')
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', onBackButtonEvent);
        return () => {
            window.removeEventListener('popstate', onBackButtonEvent);
        };
    })
    return (
        <div className='addpetient'>
            <Offcanvas placement='top' show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Add Patient</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <form>
                        <div className='row add'>
                            <div className="form-group col-md-4 col-sm-6">
                                <label htmlFor="exampleInputEmail1"><strong>Full Name</strong></label>
                                <input type="text" name="name" className="form-control" onChange={handleChange} placeholder="full name"
                                    autoComplete="off" />
                                {errors.name && <p className='text-danger m-0'>{errors.name}</p>}
                            </div>
                            <div className="form-group col-md-4 col-sm-6">
                                <label htmlFor="contact"><strong>Contact</strong></label>
                                <input type="tel" name="contact" id='contact' className="form-control" onChange={handleChange} placeholder="contact" autoComplete="off" />
                                {errors.contact && <p className='text-danger m-0'>{errors.contact}</p>}
                            </div>
                            <div className="form-group col-md-4 col-sm-6 medical">
                                <label htmlFor="medical"><strong>Medical History</strong></label>
                                <div className="dropdown-container mt-2">
                                    <Select className='dropdown' name='medical[]' options={medicalOptions} placeholder="select" value={medical} onChange={handleMedical} isSearchable={true} isMulti />
                                </div>
                            </div>
                            <div className="form-group col-md-4 col-sm-6">
                                <label htmlFor="exampleInputEmail1"><strong>Email</strong></label>
                                <input type="email" name="email" className="form-control" onChange={handleChange} placeholder="email" autoComplete="off" />
                                {errors.email && <p className='text-danger m-0'>{errors.email}</p>}
                            </div>
                            <div className="form-group col-md-4 col-sm-6">
                                <label htmlFor="address"><strong>Address</strong></label>
                                <input type="text" name="address" id='address' className="form-control" onChange={handleChange} placeholder="address"
                                    autoComplete="off" />
                            </div>
                            <div className="form-group col-md-4 col-sm-6">
                                <label htmlFor="education"><strong>Education</strong></label>
                                <select className='form-select' id='education' name='education' onChange={handleChange}>
                                    <option value='' selected>select</option>
                                    <option value='Architect'>Architect</option>
                                    <option value='BA'>BA</option>
                                    <option value='BAMS'>BAMS</option>
                                    <option value='Bcom'>Bcom</option>
                                    <option value='Bsc'>Bsc</option>
                                    <option value='CA'>CA</option>
                                    <option value='HSC'>HSC</option>
                                    <option value='Illiterate'>Illiterate</option>
                                    <option value='IT'>IT</option>
                                    <option value='MBBS'>MBBS</option>
                                    <option value='Other'>Other</option>
                                    <option value='PG'>PG</option>
                                    <option value='PhD'>PhD</option>
                                    <option value='Primary'>Primary</option>
                                    <option value='Secondary'>Secondary</option>
                                    <option value='SSC'>SSC</option>
                                </select>
                            </div>
                            <div className="form-group col-md-4 col-sm-6">
                                <label htmlFor="gender"><strong>Gender</strong></label>
                                <select className="form-select" id='gender' name='gender' onChange={handleChange}>
                                    <option selected>select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="other">Prefer not to say</option>
                                </select>
                                {errors.gender && <p className='text-danger m-0'>{errors.gender}</p>}
                            </div>
                            <div className="form-group col-md-4 col-sm-6">
                                <label htmlFor="merital"><strong>Marital Status</strong></label>
                                <select className="form-select" id='merital' name='marital' onChange={handleChange}>
                                    <option selected>select</option>
                                    <option value="Married">Married</option>
                                    <option value="Unmarried">Unmarried</option>
                                    <option value="Widow">Widow/er</option>
                                    <option value="Divorcee">Divorcee</option>
                                    <option value="Deserted">Deserted</option>
                                </select>
                            </div>
                            <div className="form-group col-md-4 col-sm-6">
                                <label htmlFor="child"><strong>Children</strong></label>
                                <input type="number" min='0' max='9' value={values.children} id='child' name="children" className="form-control" onChange={handleChange} placeholder="children" autoComplete="off" />
                            </div>
                            <div className="form-group col-md-4 col-sm-6">
                                <label htmlFor="age"><strong>Age</strong></label>
                                <input type="number" min='0' max='150' id='age' name="age" className="form-control" onChange={handleChange} placeholder="age" autoComplete="off" />
                            </div>
                            <div className="form-group col-md-4 col-sm-6">
                                <label htmlFor="occupation"><strong>Occupation</strong></label>
                                <select className="form-select" id='occupation' name='occupation' onChange={handleChange}>
                                    <option selected>select</option>
                                    <option value="Builder">Builder</option>
                                    <option value="Business">Business</option>
                                    <option value="Carpenter">Carpenter</option>
                                    <option value="CGService">CGService</option>
                                    <option value="Doctor">Doctor</option>
                                    <option value="Driver">Driver</option>
                                    <option value="Farmer">Farmer</option>
                                    <option value="Housewife">Housewife</option>
                                    <option value="Labourer">Labourer</option>
                                    <option value="Lawyer">Lawyer</option>
                                    <option value="Meson">Meson</option>
                                    <option value="MGService">MGService</option>
                                    <option value="Other">Other</option>
                                    <option value="PvtService">PvtService</option>
                                    <option value="Student">Student</option>
                                    <option value="Teacher">Teacher</option>
                                    <option value="Unemployeed">Unemployeed</option>
                                </select>
                            </div>
                            <div className="form-group col-md-4 col-sm-6">
                                <label htmlFor="ref"><strong>Referred By</strong></label>
                                <input type="text" id='ref' name="referral" className="form-control" onChange={handleChange} placeholder="Referral" autoComplete="off" />
                            </div>
                        </div>
                        <div className="col-md-12 text-center mt-4">
                            <h4 id='r'><button onClick={handleSubmit} className="btn btn-block btn-primary">Add</button></h4>
                        </div>
                    </form>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}

export default AddPatient;