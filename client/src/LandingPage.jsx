import "./App.css";
import { Outlet } from "react-router-dom";
import logo from './assets/psychiatrist.jpg'
import dr from './assets/doctor.jpg'


function LandingPage() {
    return (
        <div>
            <div className="image row">
                <div className="slogan col-md-6 col-sm-12">
                    <p className="p-2 psy mt-sm-1 m-0"><b>You are not alone in your journey</b></p>
                    <h5 className="px-3 psy"> towards better mental health</h5>
                    <h3 className="text-center text-primary mt-sm-0 mt-sm-5 online"><b>-- Online Consultation --</b></h3>
                    <div className="text-center">
                        <button className="btn btn-primary">Book a slot</button>
                    </div>
                </div>
                <img src={logo} className="col-md-6 col-sm-12" />
                <div className="info p-3 col-md-6 col-sm-12">
                    <div className="text-center">
                        <img src={dr} className="drImage w-25" />
                    </div>
                    <div className="mb-4 px-sm-1 p-0" align="justify">
                        Dr. ABC is a highly esteemed psychiatrist with over X years of experience in the field of mental health. Holding a medical degree from XYZ, Dr. ABC has dedicated their career to understanding the complexities of the human mind and providing compassionate, evidence-based care to patients of all ages.
                    </div>
                    <div className="mb-4 px-sm-1" align="justify">
                        Dr. ABC's practice is built on the principles of empathy, respect, and collaboration. They believe in empowering patients by involving them in their treatment plans and fostering a supportive environment where individuals feel safe to share their thoughts and feelings.
                        In addition to their clinical work, Dr. ABC is an active member of PQR and regularly contributes to academic research and publications in the field.
                    </div>
                    <div className="mb-4 px-sm-1" align="justify">
                        Dr. ABC is renowned for their thoughtful and personalized approach to mental health care, earning the trust and gratitude of patients and colleagues alike. Whether addressing complex psychiatric conditions or providing guidance through life's challenges, Dr. ABC is committed to helping individuals achieve optimal mental wellness and lead fulfilling lives.
                    </div>
                </div>
            </div>

            <Outlet />
        </div>
    )
}

export default LandingPage