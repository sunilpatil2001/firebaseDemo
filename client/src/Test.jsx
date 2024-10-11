import { Document, Page, Text, View, StyleSheet, Image, PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from './assets/rx.jpg'
const styles = StyleSheet.create({
    section: {
        margin: 10,
        padding: 10,
    },
    img: {
        width: 50,
        height: 50,
        marginLeft: 10,
    },
    date: {
        marginRight: 50,
        marginTop: 40,
        fontSize: 15
    },
    pname: {
        fontSize: 16,
        marginLeft: -16,
        width: 590,
        marginTop: 200,
        marginBottom:10
    },
    viewer: {
        fontSize: 15,
        width: window.outerWidth, //the pdf viewer will take up all of the width and height
        height: window.innerHeight,
    },
    row: {
        marginTop: -20,
        flexDirection: 'row',
        borderColor: 'blue',
        borderTop: 1,
        fontSize: 15,
        alignItems: 'center',
        justifyContent: 'center',
        fontStyle: 'bold',
        marginBottom: 20,

    },
    items: {
        flexDirection: 'row',
        marginBottom: 20,
        fontSize: 15,
        borderTop: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        fontStyle: 'bold',
    },
    name: {
        width: '40%',
        textAlign: 'center',
    },
    morning: {
        width: '20%',
        textAlign: 'center',
    },
    afternoon: {
        width: '20%',
        textAlign: 'center',
    },
    night: {
        width: '20%',
        textAlign: 'center',
    },
    days: {
        width: '20%',
        textAlign: 'center',
    }
});

function Test(props) {
    const nevigate = useNavigate()
    const [finishStatus, setfinishStatus] = useState(false);
    const [show, setShow] = useState(true);
    const handleClose = () => {
        setShow(!show);
        sessionStorage.removeItem('mse')
        nevigate('/doctor')
    }
    var date = new Date()
    var day = date.getDate()
    var month = date.getMonth().toString().length === 1 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
    var year = date.getFullYear()
    var currentdate = `${year}-${month}-${day}`
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
        console.log(props)
        localStorage.removeItem('id')
        const jwt = sessionStorage.getItem('jwt')
        const user = sessionStorage.getItem('user')
        if (!jwt || user !== 'doctor')
            nevigate('/signin')
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', onBackButtonEvent);
        return () => {
            window.removeEventListener('popstate', onBackButtonEvent);
        };
    }, [])
    return (
        <Offcanvas placement='top' show={show} onHide={handleClose} >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Print Prescription</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="m-0 p-0 overflow-hidden">
                <PDFViewer style={styles.viewer}>
                    <Document>
                        <Page size="A4" style={styles.page}>
                            <View style={styles.section} className="d-inline">
                                <Text style={styles.pname}>{sessionStorage.getItem('patient')}                                                                                       <Text style={styles.date}>{currentdate}</Text></Text>
                            </View>
                            <View style={styles.row} className="d-inline">
                                <Image src={logo} style={styles.img} />
                                <Text style={styles.name}>    </Text>
                                <Text style={styles.morning}>Morning</Text>
                                <Text style={styles.afternoon}>Afternoon</Text>
                                <Text style={styles.night}>Night</Text>
                                <Text style={styles.days}>Days</Text>
                            </View>
                            {props.printData.map(data => (
                                <View style={styles.items} className="d-inline">
                                    <Text className="d-inline">               </Text>
                                    <Text className="d-inline" style={styles.name}>{data.name ? data.name : ' '}</Text>
                                    <Text className="d-inline" style={styles.morning}>{data.morning ? data.morning : '0'}</Text>
                                    <Text className="d-inline" style={styles.afternoon}>{data.afternoon ? data.afternoon : '0'}</Text>
                                    <Text className="d-inline" style={styles.night}>{data.night ? data.night : '0'}</Text>
                                    <Text className="d-inline" style={styles.night}>{data.days ? data.days : '0'}</Text>
                                </View>
                            ))}
                            <Text style={styles.date}>Next Appointment : </Text>
                        </Page>
                    </Document>
                </PDFViewer>
            </Offcanvas.Body>
        </Offcanvas>
    );
}
export default Test;