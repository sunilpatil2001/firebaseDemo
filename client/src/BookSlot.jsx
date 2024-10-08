import { Modal } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BookslotValidation from './validations/bookSlotValidation';
import baseUrl from './assets/baseUrl'

var full_name = ""
function BookSlot() {
  const [searchItem, setSearchItem] = useState('')
  const nevigate = useNavigate();
  const [errors, setErrors] = useState({})
  const [time, setTime] = useState("")
  const [showList, setShowList] = useState(true)
  const [names, getNames] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(names)
  const [finishStatus, setfinishStatus] = useState(false);
  var slots = ['10:00AM', '10:30AM', '11:00AM', '11:30AM', '12:00PM', '12:30PM', '02:00PM', '02:30PM', '03:00PM', '03:30PM', '04:00PM', '04:30PM', '05:00PM', '05:30PM', '07:00PM', '07:30PM', '08:00PM', '08:30PM', '09:00PM', '09:30PM']
  const [isShow, invokeModal] = useState(true)
  const [values, setValues] = useState({
    name: "",
    date: "",
    time: ""
  })
  const handleChange = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
  }
  const initModal = () => {
    if (isShow) {
      nevigate('/admin')
      full_name = ""
    }
    return invokeModal(!isShow)
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
  const handleClick = async () => {
    await axios.get(baseUrl + '/get_all_appointments').then(res => {
      const date = document.getElementById('date').value
      var Slots = []
      res.data.forEach(element => {
        if (element.date === date)
          Slots.push(element.time)
      });
      setTime(Slots)
      slots = slots.filter(function (el) {
        return !time.includes(el);
      });
    })
  }
  slots = slots.filter(function (el) {
    return !time.includes(el);
  });
  const handleBookSlot = async (e) => {
    e.preventDefault()
    const x = BookslotValidation(values)
    setErrors(x);
    if (Object.keys(x).length === 0) {
      try {
        document.getElementById('r').innerHTML = `<div class="mt-2 spinner-border spinner-border text-warning" role="status"><span class="visually-hidden">Loading...</span></div>`
        await axios.post(baseUrl + '/add_appointments', values).then(res => {
          if (res.data === 'success') {
            document.getElementById('r').innerHTML = 'Slot Booked'
            document.getElementById('r').className = 'text-success'
            setTimeout(() => {
              initModal();
            }, 2000);
          }
        })
      }
      catch (e) {
        document.getElementById('r').innerHTML = 'Please try again'
        document.getElementById('r').className = 'text-danger'
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }

    }
  }
  const fetchInfo = async () => {
    return await axios.get(baseUrl + '/get_patients').then(res => {
      for (let i = 0; i < Object.keys(res.data).length; i++) {
        getNames(res.data)
      }
    })
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
  useEffect(() => {
    const jwt = sessionStorage.getItem('jwt')
    const user = sessionStorage.getItem('user')
    if (!jwt || user !== 'admin')
      nevigate('/signin')
    fetchInfo()
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', onBackButtonEvent);
    return () => {
      window.removeEventListener('popstate', onBackButtonEvent);
    };

  }, [])
  return (
    <div className='slot'>
      <Modal animation='fade' show={isShow} aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton onClick={initModal}>
          <h4>Book a Slot</h4>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group col-md-12">
              <label htmlFor="name" className='mb-2'><strong>Name</strong></label>
              <input type='text' className='form-control' value={searchItem} onKeyUp={handleInput} onChange={handleChange} name='name' id='name' placeholder='search name' autoComplete='off' />
              <ul hidden={showList} onClick={() => setShowList(true)} className='list-group names'>
                {filteredUsers.length > 0 ? filteredUsers.map(data => (
                  <li onClick={() => { setSearchItem(data); setValues({ ...values, name: data }); full_name = data }} class="list-group-item">{data}</li>
                )) : <li disabled class="list-group-item">No patient found</li>}
              </ul>
            </div>
            {errors.name && <p className='text-danger m-0'>{errors.name}</p>}
            <div className="form-group">
              <label htmlFor="date"><strong>Date</strong></label>
              <input type="date" id='date' name="date" className="form-control mt-2" min={new Date().toISOString().split('T')[0]} onChange={handleChange} onInput={handleClick} placeholder="select date"
                autoComplete="off" />
              {errors.date && <p className='text-danger m-0'>{errors.date}</p>}

            </div>
            <div className="form-group">
              <label htmlFor="time"><strong>Time</strong></label>
              <select className='form-select' id='time' name='time' onChange={handleChange}>
                <option selected>select</option>
                {slots.length > 0 ? slots.map(data => (
                  <option value={data}>{data}</option>
                )) : <option disabled value="">No Slots Available</option>}
              </select>
              {errors.time && <p className='text-danger m-0'>{errors.time}</p>}
            </div>
            <h4 id='r'><input type='submit' onClick={handleBookSlot} className='btn btn-primary mt-3' value='Book Slot' /></h4>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default BookSlot;