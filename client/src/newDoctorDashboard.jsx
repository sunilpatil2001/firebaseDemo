import { Link, useNavigate } from "react-router-dom"
import NavBar from "./NavBar"
import './App.css'
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import baseUrl from './assets/baseUrl'

var full_name = ""
function DoctorDashboard() {
    const listRef = useRef(null);
    const nevigate = useNavigate()
    const ms = sessionStorage.getItem('mse')
    const [searchItem, setSearchItem] = useState('')
    const [isMse, setMse] = useState(false)
    const [preview, setPreview] = useState(false)
    const [id, setId] = useState('')
    const [mse, getMse] = useState([])
    const [showList, setShowList] = useState(true)
    const [names, getNames] = useState([]);
    const [clickable, setClickable] = useState(false)
    const [comments, getComments] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState(names)
    const [values, setValues] = useState({
        name: "",
        comment: "",
        patientId: ""
    })
    const handleChange = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }
    const handleInput = (e) => {
        setShowList(false)
        if (e.key.length === 1)
            full_name = full_name + e.key
        if (e.key === 'Backspace')
            full_name = full_name.substring(0, full_name.length - 1);
        setSearchItem(full_name)
        const filteredItems = names.filter((user) =>
            user.toLowerCase().includes(full_name.toLowerCase())
        );
        setFilteredUsers(filteredItems);
    }
    const handleComment = async (e) => {
        e.preventDefault()
        values.patientId = localStorage.getItem('id')
        await axios.post(baseUrl + '/comments', values).then(res => {
            fetchComments()
        })
        values.comment = ""
        handleLength(values.comment)
    }
    const handlePreview = async (e) => {
        e.preventDefault()
        var patientId = localStorage.getItem('id')
        await axios.get(baseUrl + '/mse/' + patientId).then(res => {
            getMse(res.data)
            console.log(res.data)
            console.log("efiehfhejk")
        })
        setPreview(false)
    }
    const handleDetails = async (e) => {
        e.preventDefault();
        sessionStorage.removeItem('mse')
        try {
            if (full_name) {
                document.getElementById('m').innerHTML = ''
                sessionStorage.setItem('patient', values.name)
                await axios.post(baseUrl + '/get_patient_data', values).then(res => {
                    if (res.data[0].patientId !== undefined) {
                        localStorage.setItem('id', res.data[0].patientId)
                        setClickable(true)
                        setMse(true)
                        setPreview(true)
                    }
                    else {
                        localStorage.setItem('id', res.data[0].id)
                        setId('createMse')
                        setClickable(true)
                        setMse(false)
                        setPreview(true)
                    }
                })
                fetchComments()
            }
            else {
                document.getElementById('m').innerHTML = 'Please select patient'
            }
        }
        catch (e) {
            window.location.reload()
        }
    }
    const handleLength = (input) => {
        document.getElementById('length').innerHTML = input.length + ' of 100';
    }
    const fetchComments = async () => {
        alert('fetchcomments client');
        return await axios.get(baseUrl + '/comments/' + localStorage.getItem('id')).then(res => {
            getComments(res.data)
        })
    }
    const fetchInfo = async () => {
        return await axios.get(baseUrl + '/get_patients').then(res => {
            for (let i = 0; i < Object.keys(res.data).length; i++) {
                getNames(res.data)
            }
        })
    }
    useEffect(() => {
        full_name = ""
        const jwt = sessionStorage.getItem('jwt')
        const user = sessionStorage.getItem('user')
        if (!jwt || user !== 'doctor')
            nevigate('/signin')
        fetchInfo()
    }, [])
    useEffect(() => {
        function myfunction(value) {
            const item = value.getBoundingClientRect();
            return (
                item.top >= 0 &&
                item.left >= 0 &&
                item.bottom <= (
                    window.innerHeight ||
                    document.documentElement.clientHeight) &&
                item.right <= (
                    window.innerWidth ||
                    document.documentElement.clientWidth)
            );
        }
        const elementToCheck = document.getElementById('div1');
        window.addEventListener('scroll', () => {
            if (myfunction(elementToCheck)) {
                listRef.current?.scrollIntoView()
            }
        });
    }, [handleComment])
    return (
        <div className="doctor" id="doctor">
            <NavBar />
            <div className="mt-3">
                <h3 className="text-center">Patient's Details</h3>
                <form className="mx-5">
                    <div className="form-group mb-2">
                        <h6 className="text-danger" id="m"> </h6>
                        <input type='text' value={searchItem} onKeyUp={handleInput} onChange={handleChange} name='name' id='name' placeholder='search name' autoComplete='off' />
                        <ul hidden={showList} onClick={() => setShowList(true)} className='list-group names'>
                            {filteredUsers.length > 0 ? filteredUsers.map(data => (
                                <li onClick={() => { setSearchItem(data); setValues({ name: data }); full_name = data }} className="list-group-item">{data}</li>
                            )) : <li disabled className="list-group-item">No patient found</li>}
                        </ul>
                        <button onClick={handleDetails}>Get Details</button>
                    </div>
                    <Link to='prescription' style={{ textDecoration: 'none', pointerEvents: clickable ? '' : 'none' }} className="text-light mx-5 m-0 prescription"><button>Prescription</button></Link>
                </form>
            </div>
            <div className="row mt-3 px-2">
                <div className="col col-md-8 col-sm-12">
                    <div className="text-center">
                        <p><b>Mental State Examination</b></p>
                        {!ms && !isMse && <Link to='mse' style={{ pointerEvents: clickable ? '' : 'none' }} className="btn btn-primary mb-2" id={id}>Create MSE</Link>}
                        {(ms || preview) && (ms || isMse) && <button className="btn btn-primary" onClick={handlePreview}>Preview MSE</button>}
                    </div>
                    {!preview && mse.map(data => (
                        <div className='row mse preview m-1'>
                            <div className="form-group col-md-6 col-sm-6">
                                <label htmlFor="illness">Present Illness Duration</label>
                                <div className='duration'>
                                    <strong><p>{data.illness !== null ? data.illness.split(',')[0] + " years " + data.illness.split(',')[1] + " months " + data.illness.split(',')[2] + " weeks" : ""}</p></strong>
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-sm-6">
                                <label htmlFor="family">Family History</label>
                                <div>
                                    <p>{data.family}</p>
                                    <label htmlFor="family">Description</label>
                                    <p>{data.familyDesc}</p>
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-sm-6">
                                <label htmlFor="family">Mood</label>
                                <div>
                                    <p>{data.mood}</p>
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-sm-6">
                                <label htmlFor="sleep">Sleep</label>
                                <p>{data.sleep}</p>
                            </div>
                            <div className="form-group col-md-6 col-sm-6">
                                <label htmlFor="dreams">Dreams</label>
                                <p>{data.dreams}</p>
                            </div>
                            <div className="form-group col-md-6 col-sm-6">
                                <label htmlFor="personality">Personality Traits</label>
                                <p>{data.personality}</p>
                                <label htmlFor="family">Description</label>
                                <p>{data.personalityDesc}</p>
                            </div>
                            <div className="form-group col-md-6 col-sm-6">
                                <label htmlFor="insight">Insight</label>
                                <p>{data.insight}</p>
                            </div>
                            <div className="form-group col-md-6 col-sm-6">
                                <label htmlFor="judgement">Judgement</label>
                                <p>{data.judgement}</p>
                            </div>
                            <div className="form-group col-md-6 col-sm-6">
                                <label htmlFor="remote">Remote Memory</label>
                                <p>{data.remote}</p>
                            </div>
                            <div className="form-group col-md-6 col-sm-6">
                                <label htmlFor="recent">Recent Memory</label>
                                <p>{data.recent}</p>
                            </div>
                            { data.orientation !== null && data.orientation !== "" && <div className="form-group col-md-12 col-sm-12">
                                <label htmlFor="recent">Not Orientated to</label><br />
                                <p>{data.orientation}</p>
                            </div>}
                            <div className="form-group col-md-12 col-sm-12"<<<<<<< migrate-olddata
                                <label htmlFor="auditory"><strong>Hallucination</strong></label><br />
                                {((data.hallucination == null)&& (data.hallucinationDesc != "" ))?
                                    <div>

                                        <label htmlFor="auditory"><strong>Description</strong></label><br />
                                        <p>{data.hallucinationDesc}</p>
                                    </div>
                                 : null}


                                <label htmlFor="auditory">Hallucination</label><b main
                                {data.hallucination !== null ? data.hallucination.split(',').map((item, i) => (
                                    <div>
                                        <p>{item}</p>
                                        <label htmlFor="auditory">Description</label><br />
                                        <p>{data.hallucinationDesc.split(',')[i]}</p>
                                    </div>
                                )) : null}
                            </div>
                            <div className="form-group col-md-12 col-sm-12"> migrate-olddata
                                <label htmlFor="auditory"><strong>Delusion</strong></label><br />
                                {((data.delusion == null)&& (data.delusionDesc != "" ))?
                                    <div>

                                        <label htmlFor="auditory"><strong>Description</strong></label><br />
                                        <p>{data.delusionDesc}</p>
                                    </div>
                                    : null}
                                {data.hallucination !== null ? data.delusion.split(',').map((item, i)
                                <label htmlFor="auditory">Delusion</label><br />
                                {data.delusion !== null ? data.delusion.split(',').map((item, i) => (
                                    <div>
                                        <p>{item}</p>
                                        <label htmlFor="auditory">Description</label><br />
                                        <p>{data.delusionDesc.split(',')[i]}</p>
                                    </div>
                                )) : null}
                            </div>
                            <div className="form-group col-md-6 col-sm-12">
                                <label htmlFor="auditory">Other Symptoms</label><br />
                                <div>
                                    <p>{data.otherSymptoms}</p>
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-sm-12">
                                <label htmlFor="auditory">Diagnosis</label><br />
                                <div>
                                    <p>{data.diagnosis}</p>
                                </div>
                            </div>
                            <div className="form-group col-md-12 col-sm-12">
                                <label htmlFor="auditory">Management</label><br />
                                <div>
                                    <p>{data.management}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="col col-md-4 col-sm-12 comments pt-2">
                    <p className="text-center"><b>Follow-up notes</b></p>
                    <ul className="list-group">
                        {comments.length > 0 ? comments.map(data => (
                            <li className="list-group-item pb-0">
                                <span>{data.date}</span>
                                <p>{data.comment}</p>
                            </li>
                        )) : <p className="text-center">No Comments</p>}
                        <div ref={listRef}> </div>
                    </ul>
                    <form className="form-control p-0 my-2">
                        <h6 id='length' className="m-0 text-danger" style={{ fontSize: 12 }}> </h6>
                        <input type="text" id="comment" onChange={handleChange} onKeyUp={() => handleLength(values.comment)} name="comment" placeholder="comment" value={values.comment} />
                        <div id="div1"> </div>
                        <button onClick={handleComment} disabled={clickable ? false : true}>send</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default DoctorDashboard