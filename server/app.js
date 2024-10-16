const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
app.use(express.json());
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ruchitabaviskar17@gmail.com',
        pass: 'ysii fxqe kcjx xcue'
    }
});

const con = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12734811',
    password: 'ldf4j1sfjw',
    database: 'sql12734811'
})
/*const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'pms-sj'
});*/
con.connect((err) => {
    if (err)
        console.log("Error occured", err);
    else
        console.log("connected with database");
});
app.post('/signup', (req, res) => {
    const user = req.body.user
    const values = [
        req.body.fname,
        req.body.lname,
        req.body.contact,
        req.body.email,
        req.body.password,
    ]
    try {
        const query = `INSERT INTO ${user}(fname, lname, contact, email, pass) VALUES(?)`;
        con.query(query, [values], (error, result) => {
            if (error) throw error;
            return res.send('success')
        })
    }
    catch (e) {
        res.send('failed')
    }
})
app.post('/signin', (req, res) => {
    const email = req.body.email;
    const pass = req.body.pass;
    const user = req.body.user;
    const query = `SELECT * FROM ${user} WHERE email = '${email}' && pass = '${pass}'`;
    try {
        con.query(query, (error, result) => {
            if (error) throw error;
            if (result.length > 0) {
                const token = jwt.sign(result[0].id, 'pms secret key')
                res.cookie('authcookie', token, { httpOnly: true })
                res.send(token)
            }
            else {
                res.send('failed')
            }
        })
    }
    catch (e) {
        res.send('failed')
    }
})
app.post('/add_patient', (req, res) => {
    var date = new Date()
    var day = date.getDate()
    var month = date.getMonth() + 1
    var year = date.getFullYear()
    var date = day + "-" + month + "-" + year
    const data = [
        (req.body.name).toLowerCase(),
        req.body.contact,
        req.body.email,
        req.body.address,
        req.body.education,
        req.body.gender,
        req.body.marital,
        req.body.children,
        req.body.age,
        req.body.occupation,
        req.body.referral,
        req.body.medical.toString(),
        date
    ]
    try {
        const query = `SELECT * from patients where full_name LIKE '${(req.body.name).toLowerCase()}%'`;
        con.query(query, (req.body.name).toLowerCase(), (error, result) => {
            if (result.length > 0) {
                console.log(result.length)
                data[0] = data[0] + "-" + result.length
                try {
                    const query1 = "INSERT INTO patients(full_name, contact, email, address, education, gender, marital_status, children, age, occupation, referredBy, medical, date1) VALUES (?)"
                    con.query(query1, [data], (error) => {
                        if (error) throw error;
                        return res.send('success')
                    })
                } catch (e) {
                    res.send('failed')
                }
            }
            else {
                try {
                    const query1 = "INSERT INTO patients(full_name, contact, email, address, education, gender, marital_status, children, age, occupation, referredBy, medical) VALUES (?)"
                    con.query(query1, [data], (error) => {
                        if (error) throw error;
                        return res.send('success')
                    })
                } catch (e) {
                    res.send('failed')
                }
            }
        })
        console.log(data)

    }
    catch (e) {
        res.send('failed')
    }
})
app.get('/get_patients', (req, res) => {
    try {
        const query = "SELECT full_name FROM patients"
        var data = []
        con.query(query, (error, result) => {
            if (error) throw error;
            result.forEach(element => {
                data.push(element.full_name)
            });
            return res.send(data)
        })
    }
    catch (e) {
        res.send('failed')
    }
})
app.post('/add_appointments', (req, res) => {
    const data = [
        req.body.name,
        req.body.date,
        req.body.time
    ]
    try {
        const query = "INSERT INTO appointments(name, date, time) VALUES (?)"
        con.query(query, [data], (error) => {
            if (error) throw error;
            return res.send('success')
        })
    }
    catch (e) {
        res.send('failed')
    }
})
app.get('/get_appointments', (req, res) => {
    try {
        const query = "SELECT * FROM appointments"
        var data = []
        con.query(query, (error, result) => {
            var currentDate = new Date().toJSON().slice(0, 10);
            if (error) throw error;
            result.forEach(element => {
                if (element.date === currentDate)
                    data.push(element)
            });
            return res.send(data)
        })
    }
    catch (e) {
        res.send('failed')
    }
})
app.get('/get_all_appointments', (req, res) => {
    try {
        const query = "SELECT date, time FROM appointments"
        con.query(query, (error, result) => {
            if (error) throw error;
            return res.send(result)
        })
    }
    catch (e) {
        res.send('failed')
    }
})
app.post('/contact_info', (req, res) => {
    const fromDate = req.body.fromDate;
    const toDate = req.body.toDate;
    var data = []
    const query = `SELECT name, contact from appointments inner join patients on appointments.name = patients.full_name  where date >= '${fromDate}' and date <= '${toDate}'`
    try {
        con.query(query, (error, result) => {
            if (error) throw error;
            res.send(result)
        })
    }
    catch (e) {
        res.send('failed')
    }
})

app.post('/mse', (req, res) => {
    const diagnosis = [
        req.body.patientId,
        req.body.diagnosis.toString()
    ]
    const data = [
        (req.body.illness).toString(),
        (req.body.family).toString(),
        req.body.familyDesc,
        (req.body.mood).toString(),
        req.body.sleep,
        req.body.dreams,
        req.body.personality,
        req.body.personalityDesc,
        req.body.insight,
        req.body.judgement,
        req.body.recent,
        req.body.remote,
        (req.body.orientation).toString(),
        (req.body.hallucination).toString(),
        (req.body.delusion).toString(),
        (req.body.hallucinationDesc).toString(),
        (req.body.delusionDesc).toString(),
        (req.body.otherSymptoms).toString(),
        req.body.management,
        req.body.patientId
    ]
    try {
        const query = "INSERT INTO mse(illness, family, familyDesc, mood, sleep, dreams, personality, personalityDesc, insight, judgement, recent, remote, orientation, hallucination, delusion, hallucinationDesc, delusionDesc, otherSymptoms, management, patientId) VALUES (?)"
        con.query(query, [data], (error) => {
            if (error) throw error;
            const query = "INSERT INTO diagnosis(patientId, diagnosis) VALUES (?)"
            con.query(query, [diagnosis], (error, result) => {
                if (error) throw error;
                return res.send('success')
            })
        })
    }
    catch (e) {
        res.send('failed')
    }
})
app.post('/comments', (req, res) => {
    var date = new Date()
    var day = date.getDate()
    var month = date.getMonth() + 1
    var year = date.getFullYear()
    var datetime = day + "-" + month + "-" + year + " @ " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    const data = [
        req.body.patientId,
        datetime,
        req.body.comment
    ]
    try {
        const query = "INSERT INTO comments(patientId, date, comment) VALUES (?)"
        con.query(query, [data], (error) => {
            if (error) throw error;
            return res.send('success')
        })
    }
    catch (e) {
        res.send('failed')
    }
})

app.get('/comments/:id', (req, res) => {
    const Id = req.params.id
    console.log(Id);
    try {
        const query = "SELECT date, comment FROM comments where patientId = ?"
        con.query(query, Id, (error, result) => {
            if (error) throw error;
           console.log('comments server'+result.date);
            return res.send(result)
        })
    }
    catch (e) {
        res.send('failed')
    }
})
app.get('/mse/:id', (req, res) => {
    const Id = req.params.id
    try {
        const query = "SELECT mse.*, diagnosis.diagnosis, patients.marital_status, patients.age, patients.date1 FROM mse inner join diagnosis on diagnosis.patientId = mse.patientId inner join patients on mse.patientId = patients.id where mse.patientId = ?"
        con.query(query, Id, (error, result) => {
            if (error) throw error;
            console.log("result : ",result)
            return res.send(result)
        })
    }
    catch (e) {
        res.send('failed')
    }
})
app.post('/get_patient_data', (req, res) => {
    const name = req.body.name
    const query = "select * from mse where patientId = (select MAX(id) from patients where full_name = ?)"
    try {
        con.query(query, name, (error, result) => {
            if (error) throw error;
            if (result.length === 0) {
                con.query(`SELECT MAX(id) from patients where full_name = '${name}'`, (error, result) => {
                    if (error) throw error;
                    res.send(result)
                })
            }
            else {
                res.send(result)
            }
        })
    }
    catch (e) {
        res.send('failed')
    }
})
app.post('/send_email', (req, res) => {
    console.log(req.body)
    const email = req.body.email
    const user = req.body.user
    var str = '1234567890';
    var pass = '';
    for (var i = 1; i <= 6; i++) {
        var char = Math.floor(Math.random()
            * str.length + 1);

        pass += str.charAt(char)
    }
    const query = `select * from ${user} where email = '${email}'`
    try {
        con.query(query, (error, result) => {
            if (error) throw error;
            if (result.length === 0) {
                res.send('failed')
            }
            else {
                var mailOptions = {
                    from: 'ruchitabaviskar17@gmail.com',
                    to: email,
                    subject: 'OTP for Reseting Password',
                    text: 'Please use this OTP : ' + pass
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error)
                    } else {
                        res.send(pass);
                    }
                });
            }
        })
    }
    catch (e) {
        res.send('failed')
    }
})
app.post('/change_password', (req, res) => {
    const user = req.body.user
    const password = req.body.password
    const email = req.body.email
    const query = `UPDATE ${user} SET pass = '${password}' WHERE email = '${email}'`
    try {
        con.query(query, (error, result) => {
            if (error) throw error;
            res.send('success')
        })
    }
    catch (e) {
        res.send('failed')
    }

})
app.get('/get_appointments/:id', (req, res) => {
    const Id = req.params.id
    try {
        const query = "SELECT MAX(date) as date from appointments where patientId = ?"
        con.query(query, Id, (error, result) => {
            if (error) throw error;
            return res.send(result)
        })
    }
    catch (e) {
        res.send('failed')
    }
})
app.listen(3001, (error) => {
    if (error)
        console.log(error)
    else
        console.log('started')
});
