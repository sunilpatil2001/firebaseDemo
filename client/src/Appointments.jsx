import { Modal } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseUrl from './assets/baseUrl'

function Appointments() {
    const nevigate = useNavigate();
    const [appointments, getAppointments] = useState([{}])
    const [isShow, invokeModal] = useState(true)
    const initModal = () => {
        if (isShow) {
            nevigate('/doctor')
        }
        return invokeModal(!isShow)
    }
    const fetchInfo = async () => {
        return await axios.get(baseUrl + '/get_appointments').then(res => {
            getAppointments(res.data)
        })
    }
    useEffect(() => {
        const jwt = sessionStorage.getItem('jwt')
        const user = sessionStorage.getItem('user')
        if (!jwt || user !== 'doctor')
            nevigate('/signin')
        fetchInfo()
    }, [])
    return (
        <div className='slot'>
            <Modal show={isShow} aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton onClick={initModal}>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
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
                                        {appointments.map((data, i) => (
                                            <tr key={data.id} className="text-center">
                                                <th scope="col">{++i}</th>
                                                <td>{data.name}</td>
                                                <td>{data.date}</td>
                                                <td>{data.time}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Appointments;