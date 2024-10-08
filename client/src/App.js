import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import Signup from './Signup';
import AdminDashboard from './AdminDashboard';
import AddPatient from './AddPatient';
import BookSlot from './BookSlot';
import DoctorDashboard from './DoctorDashboard';
import PrescriptionForm from './PrescriptionForm';
import Signin from './Signin';
import NavBar from './NavBar';
import Mse from './Mse';
import Test from './Test';
import { useState } from 'react';
import Logout from './Logout';
import Password from './Password';
import Appointments from './Appointments';
import Contact from './Contact';

function App() {
  const [printData, setPrintData] = useState([])
  const [preview, setPreview] = useState(false)
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<NavBar />}>
            <Route path='' element={<LandingPage />}>
              <Route path='signin' element={<Signin />} />
              <Route path='signup' element={<Signup />} />
              <Route path='password' element={<Password />} />
              <Route path='contact' element={<Contact />} />
            </Route>
          </Route>
          <Route path='admin' element={<AdminDashboard />} />
          <Route path='logout' element={<Logout />} />
          <Route path='add' element={<AddPatient />} />
          <Route path='book' element={<BookSlot />} />
          <Route path='doctor' element={<DoctorDashboard />}>
            <Route path='mse' element={<Mse />} />
            <Route path='prescription' element={<PrescriptionForm setPrintData={setPrintData} />} />
            <Route path='appointments' element={<Appointments />} />
          </Route>
          <Route path='print' element={<Test printData={printData} />} />
          <Route />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
