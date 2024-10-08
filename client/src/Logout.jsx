import { useState } from "react"
import { Modal } from "react-bootstrap"
import { BiLogInCircle } from "react-icons/bi"
import { useNavigate } from "react-router-dom"


function Logout() {
    const nevigate = useNavigate()
    const [isShow, invokeModal] = useState(true)
    const initModal = () => {
        if (isShow) {
            nevigate(-1)
        }
        return invokeModal(!isShow)
    }
    const handleLogout = () => {
        sessionStorage.removeItem('username')
        sessionStorage.removeItem('id')
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('jwt')
        localStorage.removeItem('id')
        nevigate('/')
    }
    return (
        <Modal show={isShow} aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton onClick={initModal}>
                <Modal.Title className='d-flex justify-content-center'><h2 className="text-center"><BiLogInCircle />Log Out</h2></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 id='r'>do you really want to log out ?</h5>
                <button className="btn btn-primary mx-5" onClick={handleLogout}>Yes</button>
                <button className="btn btn-danger" onClick={initModal}>No</button>
            </Modal.Body>
        </Modal>
    )
}

export default Logout