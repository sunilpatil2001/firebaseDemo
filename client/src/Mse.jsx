import { useEffect, useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Select from 'react-select'
import { useNavigate } from 'react-router-dom';
import familyOptions from './options/family';
import moodOptions from './options/mood';
import hallucinationOptions from './options/hallucination';
import delusionOptions from './options/delusion';
import axios from 'axios';
import diagnosisOptions from './options/diagnosis';
import baseUrl from './assets/baseUrl'
import symptomsOptions from './options/symptoms';

function Mse() {
    var hId = 0
    var dId = 0
    const [selectedFamily, setSelectedFamily] = useState([]);
    const [diagnosis, setDiagnosis] = useState([]);
    const [symptoms, setSymptoms] = useState([]);
    const [selectedMood, setSelectedMood] = useState([]);
    const nevigate = useNavigate();
    const [finishStatus, setfinishStatus] = useState(false);
    const [show, setShow] = useState(true);
    const [values, setValues] = useState({
        illness: [],
        family: [],
        familyDesc: "",
        mood: [],
        sleep: "",
        dreams: "",
        personality: "",
        personalityDesc: "",
        insight: "",
        judgement: "",
        recent: "",
        remote: "",
        orientation: [],
        hallucination: [],
        delusion: [],
        hallucinationDesc: [],
        delusionDesc: [],
        patientId: "",
        diagnosis: [],
        management: "",
        otherSymptoms: []
    })
    const handleClose = () => {
        setShow(!show);
        nevigate('/doctor')
    }
    const handleChange = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }
    const handleAdd = (e) => {
        e.preventDefault()
        const extraDia = document.getElementsByClassName('diaAdd')
        diagnosisOptions.push({
            label: extraDia[0].value,
            value: extraDia[0].value
        })
        document.getElementById('extra').value = ""
    }
    const handleHallDesc = (e) => {
        if (e.target.checked) {
            document.getElementById('d' + e.target.id).disabled = false
        }
        else {
            document.getElementById('d' + e.target.id).disabled = true
        }
    }
    const handledelDesc = (e) => {
        if (e.target.checked)
            document.getElementById('d' + e.target.id).disabled = false
        else
            document.getElementById('d' + e.target.id).disabled = true
    }
    function handleFamily(data) {
        setSelectedFamily(data);
    }
    function handleMood(data) {
        setSelectedMood(data);
    }
    function handleDiagnosis(data) {
        setDiagnosis(data);
    }
    function handleSymptoms(data) {
        setSymptoms(data);
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
        e.preventDefault();
        document.getElementById('r').innerHTML = `<div class="mt-2 spinner-border spinner-border text-warning" role="status"><span class="visually-hidden">Loading...</span></div>`
        selectedFamily.forEach(element => {
            values.family.push(element.value)
        });
        selectedMood.forEach(element => {
            values.mood.push(element.value)
        })
        diagnosis.forEach(element => {
            values.diagnosis.push(element.value)
        })
        symptoms.forEach(element => {
            values.otherSymptoms.push(element.value)
        })
        const delusionCheck = document.querySelectorAll('.delusionCheck input[type="checkbox"]:checked')
        delusionCheck.forEach(element => {
            values.delusion.push(element.value)
        });
        const hallucinationDesc = document.querySelectorAll('.hallucinationCheck textarea')
        hallucinationDesc.forEach(element => {
            if (element.value !== '')
                values.hallucinationDesc.push(element.value)
        });
        const delusionDesc = document.querySelectorAll('.delusionCheck textarea')
        delusionDesc.forEach(element => {
            if (element.value !== '')
                values.delusionDesc.push(element.value)
        });
        const hallucinationCheck = document.querySelectorAll('.hallucinationCheck input[type="checkbox"]:checked')
        hallucinationCheck.forEach(element => {
            values.hallucination.push(element.value)
        });
        const orientationCheck = document.querySelectorAll('.orientationCheck input[type="checkbox"]:checked')
        orientationCheck.forEach(element => {
            values.orientation.push(element.value)
        });
        const duration = document.querySelectorAll('.duration input')
        duration.forEach(element => {
            element.value !== "" ? values.illness.push(element.value) : values.illness.push("0")
        });
        values.patientId = localStorage.getItem('id')
        try {
            await axios.post(baseUrl + '/mse', values).then(res => {
                if (res.data === 'success')
                    document.getElementById('r').innerHTML = 'MSE created Successfully'
                document.getElementById('r').className = 'mx-5 text-success'
                sessionStorage.setItem('mse', true)
                localStorage.removeItem('p-age')
                localStorage.removeItem('p-marital')
                setTimeout(() => {
                    nevigate('/doctor');
                }, 3000);
            })
        }
        catch (e) {
            document.getElementById('r').innerHTML = 'Please try again'
            document.getElementById('r').className = 'mx-5 text-danger'
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }
    useEffect(() => {
        const jwt = sessionStorage.getItem('jwt')
        const user = sessionStorage.getItem('user')
        if (!jwt || user !== 'doctor')
            nevigate('/signin')
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', onBackButtonEvent);
        return () => {
            window.removeEventListener('popstate', onBackButtonEvent);
        };
    })
    return (
        <div>
            <Offcanvas placement='top' show={show} onHide={handleClose} backdrop="static">
                <Offcanvas.Header closeButton className='p-2'>
                    <Offcanvas.Title>Mental State Examination</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <form>
                        <div className='row mse add'>
                            <div className="form-group col-md-6 col-sm-6">
                                <label htmlFor="illness" className='mb-2 mt-0'>Patient's Age</label>
                                <div className='duration mb-2'>
                                    <p><strong>{localStorage.getItem('p-age')}</strong></p>
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-sm-6">
                                <label htmlFor="illness" className='mb-2 mt-0'>Patient's Marital Status</label>
                                <div className='duration mb-2'>
                                    <p><strong>{localStorage.getItem('p-marital')}</strong></p>
                                </div>
                            </div>
                            <div className="form-group col-md-4 col-sm-6">
                                <label htmlFor="illness" className='mb-2'><strong>Present Illness Duration</strong></label>
                                <div className='duration'>
                                    <div>
                                        <input type='text' value={values.illness[0]} className='du text-center m-2 form-input' /><span>years</span>
                                    </div>
                                    <div>
                                        <input type='text' value={values.illness[1]} className='du text-center m-2 form-input' /><span>months</span>
                                    </div>
                                    <div>
                                        <input type='text' value={values.illness[2]} className='du text-center mb-2 m-2 form-input' /><span>weeks</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-md-4 col-sm-6">
                                <label htmlFor="family"><strong>Family History</strong></label>
                                <div className="dropdown-container mt-2">
                                    <Select className='dropdown' name='family[]' options={familyOptions} placeholder="select" value={selectedFamily} onChange={handleFamily} isSearchable={true} isMulti />
                                    <textarea className="form-control my-2" value={values.familyDesc} onChange={handleChange} rows='4' name='familyDesc' placeholder='Description' />
                                </div>
                            </div>
                            <div className="form-group col-md-4 col-sm-6">
                                <label htmlFor="family"><strong>Mood</strong></label>
                                <div className="dropdown-container mt-2">
                                    <Select className='dropdown' name='mood[]' options={moodOptions} placeholder="select" value={selectedMood} onChange={handleMood} isSearchable={true} isMulti />
                                </div>
                            </div>
                            <div className="form-group col-md-4 col-sm-6">
                                <label htmlFor="sleep" className='mb-2'><strong>Sleep</strong></label>
                                <select className="form-select" id='sleep' name='sleep' value={values.sleep} onChange={handleChange}>
                                    <option selected value="">select</option>
                                    <option value="disturbed">Disturbed</option>
                                    <option value="emawake">Emawake</option>
                                    <option value="excessive">Excessive</option>
                                    <option value="lateonset">Late On Set</option>
                                    <option value="losndisturbedsleep">Late On Set Disturbed Sleep</option>
                                    <option value="losnearlyawake">Late On Set Early Awakening</option>
                                    <option value="losnearlydisturbedsleep">Late On Set Early Disturbed Sleep</option>
                                    <option value="nosleep">No Sleep</option>
                                    <option value="nosleepdisturbance">No Sleep Disturbance</option>
                                </select>
                            </div>
                            <div className="form-group col-md-4 col-sm-6">
                                <label htmlFor="dreams" className='mb-2'><strong>Dreams</strong></label>
                                <textarea className="form-control" rows='4' value={values.dreams} name='dreams' id='dreams' onChange={handleChange} placeholder='Description' />
                            </div>
                            <div className="form-group col-md-4 col-sm-6">
                                <label htmlFor="personality" className='mb-2'><strong>Personality Traits</strong></label>
                                <select className="form-select" value={values.personality} id='personality' name='personality' onChange={handleChange}>
                                    <option selected value="">select</option>
                                    <option value="borderline">Borderline</option>
                                    <option value="compulsive">Compulsive</option>
                                    <option value="histrionic">Histrionic</option>
                                    <option value="narcissistic">Narcissistic</option>
                                    <option value="notspecified">Not Specified</option>
                                    <option value="obsessive">Obsessive</option>
                                    <option value="paranoid">Paranoid</option>
                                    <option value="schizoid">Schizoid</option>
                                    <option value="schizotypal">Schizotypal</option>
                                </select>
                                <textarea className="form-control my-2" rows='4' onChange={handleChange} name='personalityDesc' id='PersonalityDesc' value={values.personalityDesc} placeholder='Description' />
                            </div>
                            <div className="form-group col-md-4 col-sm-6">
                                <label htmlFor="insight" className='mb-2'><strong>Insight</strong></label>
                                <select className="form-select mb-2" id='insight' name='insight' value={values.insight} onChange={handleChange}>
                                    <option selected value="present">Present</option>
                                    <option value="absent">Absent</option>
                                </select>
                            </div>
                            <div className="form-group col-md-4 col-sm-6">
                                <label htmlFor="judgement" className='mb-2'><strong>Judgement</strong></label>
                                <select className="form-select" id='judgement' name='judgement' value={values.judgement} onChange={handleChange}>
                                    <option selected value="present">Present</option>
                                    <option value="impaired">Impaired</option>
                                </select>
                            </div>
                            <div className="form-group col-md-4 col-sm-6">
                                <label htmlFor="remote" className='mb-2'><strong>Remote Memory</strong></label>
                                <select className="form-select" id='remote' name='remote' value={values.remote} onChange={handleChange}>
                                    <option selected value="intact">Intact</option>
                                    <option value="impaired">Impaired</option>
                                </select>
                            </div>
                            <div className="form-group col-md-6 col-sm-6">
                                <label htmlFor="recent" className='mb-2'><strong>Recent Memory</strong></label>
                                <select className="form-select mb-2" value={values.recent} id='recent' name='recent' onChange={handleChange}>
                                    <option selected value="intact">Intact</option>
                                    <option value="impaired">Impaired</option>
                                </select>
                            </div>
                            <div className="form-group col-md-6 col-sm-6 orientationCheck">
                                <label htmlFor="recent" className='mb-3'><strong>Not Orientated to</strong></label><br />
                                <input type='checkbox' name='person' id='checkbox1' className='form-check-inline mx-2' value='person' /><span>Person</span>
                                <input type='checkbox' name='place' id='checkbox2' className='form-check-inline mx-2' value='place' /><span>Place</span>
                                <input type='checkbox' name='time' id='checkbox3' className='form-check-inline mx-2' value='time' /><span>Time</span>
                            </div>
                            <div className="form-group col-md-12 col-sm-12 row">
                                <label htmlFor="auditory" className='mb-3'><strong>Hallucination</strong></label><br />
                                {hallucinationOptions.map((data, index) => (
                                    <div className='col-md-3 col-sm-6 hallucinationCheck'>
                                        <input type='checkbox' name={data.value} id={'h' + (++hId)} onClick={handleHallDesc} className='form-check-inline mx-2' value={data.value} /><span>{data.label}</span>
                                        <textarea className="form-control my-2" value={values.hallucinationDesc[index]} id={'dh' + (hId++)} rows='4' disabled={true} placeholder='Description' />
                                    </div>
                                ))}
                            </div>
                            <div className="form-group col-md-12 col-sm-12 delusionCheck row">
                                <label htmlFor="auditory" className='mb-3'><strong>Delusion</strong></label><br />
                                {delusionOptions.map(data => (
                                    <div className='col-md-4 col-sm-6'>
                                        <input type='checkbox' name={data.value} id={'d' + (++dId)} onClick={handledelDesc} className='form-check-inline mx-2' value={data.value} /><span>{data.label}</span>
                                        <textarea className="form-control my-2" id={'dd' + (dId++)} rows='4' name='auditoryDesc' disabled={true} placeholder='Description' />
                                    </div>
                                ))}
                            </div>
                            <div className="form-group col-md-4 col-sm-6 treatment">
                                <label htmlFor="treatment"><strong>Other Symptoms</strong></label>
                                <div className="dropdown-container mt-2">
                                    <Select className='dropdown' name='otherSymptoms[]' options={symptomsOptions} placeholder="select" value={symptoms} onChange={handleSymptoms} isSearchable={true} isMulti />
                                </div>
                            </div>
                            <div className="form-group col-md-4 col-sm-6 diagnosis">
                                <label htmlFor="diagnosis"><strong>Diagnosis</strong></label>
                                <div className="dropdown-container mt-2">
                                    <Select className='dropdown' name='diagnosis[]' options={diagnosisOptions} placeholder="select" value={diagnosis} onChange={handleDiagnosis} isSearchable={true} isMulti />
                                </div>
                                <label htmlFor="exampleInputEmail1" className='m-1 text-danger'><strong>Not in list ? add from here</strong></label>
                                <div className="form-group m-0 d-flex">
                                    <input type="text" id='extra' name="name" className="form-control diaAdd" placeholder="full name"
                                        autoComplete="off" />
                                    <button onClick={handleAdd} className=" btn btn-primary">Add</button>
                                </div>
                            </div>
                            <div className="form-group col-md-4 col-sm-6 treatment">
                                <label htmlFor="treatment"><strong>Management</strong></label>
                                <textarea className="form-control my-2" name='management' onChange={handleChange} rows={8} placeholder='Description' />
                            </div>
                        </div>
                    </form>
                    <div className="col-md-12 text-end">
                        <h4 id='r'><button onClick={handleSubmit} className=" btn btn-primary mx-1">Submit</button></h4>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}

export default Mse;