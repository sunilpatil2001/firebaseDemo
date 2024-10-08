import { Link, useNavigate } from "react-router-dom";
import { Accordion } from "react-bootstrap"
import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import baseUrl from './assets/baseUrl'

function AdminDashboard() {
    const nevigate = useNavigate()
    const [fromDate, setFromDate] = useState('')
    const [showList, setShowList] = useState(false)
    const [appointments, getAppointments] = useState([{}])
    const [patients, setPatients] = useState([])
    var i = 0, j = 0
    const [dates, getDates] = useState({
        fromDate: "",
        toDate: ""
    })
    const handleChange = (event) => {
        getDates(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }
    const handleDate = (event) => {
        setFromDate(event.target.value)
    }
    const handleRecord = async (e) => {
        e.preventDefault()
        try {
            await axios.post(baseUrl + '/contact_info', dates).then(res => {
                setPatients(res.data)
                setShowList(!showList)
            })
        } catch (e) {
            console.log(e)
        }
    }
    const fetchInfo = async () => {
        return await axios.get(baseUrl + '/get_appointments').then(res => {
            getAppointments(res.data)
        })
    }
    useEffect(() => {
        const jwt = sessionStorage.getItem('jwt')
        const user = sessionStorage.getItem('user')
        if (!jwt || user !== 'admin')
            nevigate('/signin')
        fetchInfo()
    }, [])

    return (
        <><NavBar />
            <div className="admin row">
                <div className="mb-5">
                    <Link to='/add'><button className="btn btn-primary">Add new Patient</button></Link>
                </div>
                <div className="col list2 text-center">
                    <h4>Today's Appointments</h4>
                    <div className="table">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">Sr. No.</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map(data => (
                                    <tr key={data.id} className="text-center">
                                        <th scope="col">{++i}</th>
                                        <td>{data.name}</td>
                                        <td>{data.date}</td>
                                        <td>{data.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table></div>
                    <Link to='/book'><button className="btn btn-primary">Book a Slot</button></Link>
                </div>
                <div className="col mt-4">
                    <Accordion>
                        <Accordion.Item eventKey="0">
                        <Accordion.Header><b>Appointments Details</b></Accordion.Header>
                            <Accordion.Body>
                                <div>
                                    <div className="mt-3">
                                        <form className="row">
                                            <div className="form-group col">
                                                <label htmlFor="from" className=""><strong>From</strong></label>
                                                <input type="date" name="fromDate" onBlur={handleDate} onChange={handleChange} className="form-control mt-2"
                                                    autoComplete="off" required />
                                            </div>
                                            <div className="form-group col">
                                                <label htmlFor="from"><strong>To</strong></label>
                                                <input type="date" min={fromDate} name="toDate" onChange={handleChange} className="form-control mt-2"
                                                    autoComplete="off" required />
                                            </div>
                                            <input type="submit" className="btn btn-primary mt-2" value="Get record" onClick={handleRecord} />
                                        </form>
                                    </div>
                                    {showList &&
                                        <table className="table table-hover mt-3">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Sr. No.</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Contact</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {patients.length > 0 ? patients.map(data => (
                                                    <tr key={data.id} className="text-center">
                                                        <th scope="col">{++j}</th>
                                                        <td>{data.name}</td>
                                                        <td>{data.contact}</td>
                                                    </tr>
                                                )) : <td colSpan={3} className="bg-light text-center">No record found</td>}
                                            </tbody>
                                        </table>
                                    }
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
                {/* <div className="list col">
                    <div>
                        <BiSolidDownArrow onClick={() => setShow(!show)} className="d-inline mx-2" /><h3 className="d-inline">Appointments Details</h3>
                    </div>
                    {show &&
                        <div>
                            <div className="mt-3">
                                <form className="row">
                                    <div className="form-group col">
                                        <label htmlFor="from" className=""><strong>From</strong></label>
                                        <input type="date" name="fromDate" onBlur={handleDate} onChange={handleChange} className="form-control mt-2"
                                            autoComplete="off" required />
                                    </div>
                                    <div className="form-group col">
                                        <label htmlFor="from"><strong>To</strong></label>
                                        <input type="date" min={fromDate} name="toDate" onChange={handleChange} className="form-control mt-2"
                                            autoComplete="off" required />
                                    </div>
                                    <input type="submit" className="btn btn-primary mt-2" value="Get record" onClick={handleRecord} />
                                </form>
                            </div>
                            {showList &&
                                <table className="table table-hover mt-3">
                                    <thead>
                                        <tr>
                                            <th scope="col">Sr. No.</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Contact</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patients.length > 0 ? patients.map(data => (
                                            <tr key={data.id} className="text-center">
                                                <th scope="col">{++j}</th>
                                                <td>{data.name}</td>
                                                <td>{data.contact}</td>
                                            </tr>
                                        )) : <td colSpan={3} className="bg-light text-center">No record found</td>}
                                    </tbody>
                                </table>
                            }
                        </div>
                    }
                </div> */}
            </div >
        </>
    )
}

export default AdminDashboard