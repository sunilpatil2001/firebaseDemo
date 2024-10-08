import { useEffect, useState } from "react";
import './App.css'
import TableRows from "./TableRows";
import { Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PrintIcon from '@mui/icons-material/Print';
function PrescriptionForm({ setPrintData }) {
    const nevigate = useNavigate();
    const [rowsData, setRowsData] = useState([]);
    const [finishStatus, setfinishStatus] = useState(false);
    const [show, setShow] = useState(true);
    const [on, setOn] = useState({
        morning: true,
        afternoon: true,
        night: true,
    })
    const addTableRows = () => {
        const rowsInput = {
            name: '',
            morning: '',
            afternoon: '',
            night: '',
            days: ''
        }
        setRowsData([...rowsData, rowsInput])
    }
    const handleClose = () => {
        setShow(!show);
        nevigate('/doctor')
    }
    var arr = []
    const handlePrint = () => {
        setPrintData(rowsData)
        nevigate('/print')
    }
    const deleteTableRows = (index) => {
        const rows = [...rowsData];
        rows.splice(index, 1);
        setRowsData(rows);
    }
    const onBackButtonEvent = (e) => {
        e.preventDefault();
        if (!finishStatus) {
            if (window.confirm("You cannot go back !!")) {
                setfinishStatus(true)
                // nevigate(-1)
            } else {
                window.history.pushState(null, null, window.location.pathname);
                setfinishStatus(false)
            }
        }
    }
    // const handleChange = (event, index) => {
    //     const { name, value } = event.target;
    //     const rowsInput = [...rowsData];
    //     rowsInput[index][name] = value;
    //     setRowsData(rowsInput);
    // }
    const handleText = (index, event) =>{
        const { name, value } = event.target;
        const rowsInput = [...rowsData];
        rowsInput[index][name] = value;
        setRowsData(rowsInput);
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
        <div className='addpetient'>
            <Offcanvas placement='top' show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Prescription</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="container">
                        <div className="row text-center">
                            <div className="col-12">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>SrN</th>
                                            <th>Name</th>
                                            <th>Morning</th>
                                            <th>Afternoon</th>
                                            <th>Night</th>
                                            <th>Days</th>
                                            <th><button className="btn btn-outline-success" onClick={addTableRows} >+</button></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <TableRows rowsData={rowsData} on={on} deleteTableRows={deleteTableRows} handleText={handleText} />
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-sm-4">
                            </div>
                        </div>
                        <div className="text-end mx-5">
                            <PrintIcon style={{ cursor: 'pointer' }} onClick={handlePrint} />
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    )

}
export default PrescriptionForm