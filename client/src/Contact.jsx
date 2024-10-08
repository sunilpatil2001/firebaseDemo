import { Modal } from 'react-bootstrap';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Contact() {
    const nevigate = useNavigate()
    const [isShow, invokeModal] = useState(true)
    const initModal = () => {
        if (isShow) {
            nevigate(-1)
        }
        return invokeModal(!isShow)
    }
    return (
        <div className='slot'>
            <Modal show={isShow} aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton onClick={initModal}>
                    <h4>Contact Us</h4>
                </Modal.Header>
                <Modal.Body>
                    <div className='text-center'>
                        <h5>------ Address ------</h5>
                        <h6> 56/78, 14th A Cross, 2nd Main, Garden Layout, JP Nagar 7th Phase</h6><hr/>
                        <h5>------ Email ------</h5>
                        <h6>abc@gmail.com</h6><hr/>
                        <h5>------ Contact No ------</h5>
                        <h6>9999999999</h6>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Contact;