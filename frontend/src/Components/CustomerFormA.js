import "bootstrap/dist/css/bootstrap.min.css";
import { FaTimes } from "react-icons/fa";
import NavBar from "./NavBar";
import { Container, Row, Col, Form, Table, Button, Modal, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { } from '@fortawesome/free-solid-svg-icons';
import NewModal from './NewModal';
import AddSupplier from "./AddSupplier";
import logo from './Images/logo.png';
import { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { faHouse, faEdit, faPowerOff, faEllipsisV, faUser, faArrowLeft, faArrowRight, faPlus, faFileExport, faPrint, faInfoCircle, faTrashAlt, } from "@fortawesome/free-solid-svg-icons";
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
import axios from "axios";

function ImageUpload() {
    const [activeForm, setActiveForm] = useState("Member");
    const [membershipTypeCounts, setMembershipTypeCounts] = useState({});
    const [currentDate, setCurrentDate] = useState(new Date());
    const loginUserTime = currentDate.toLocaleString()
    //
    const [memberships, setMemberships] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [filteredMemberships, setFilteredMemberships] = useState(memberships);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchReceipt, setSearchReceipt] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    // const [currentPage, setCurrentPage] = useState(1);
    const [nextPages, setNextPages] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [allMemberships, setAllMemberships] = useState([]);

    //
    const [formData, setFormData] = useState({
        sl_no: '',
        userTime: loginUserTime,
        membershipType: "",
        membershipId: "",
        customerName: "Mr.",
        date: "",
        guardianName: "Mr.",
        relation: "",
        address: "",
        customerMobile: "",
        telephoneNo: "",
        amount: "100",
        referenceName: "",
        referenceMobile: "",
        dateOfBirth: "",
        age: "",
        bloodGroup: "",
        profession: "",
        district: "",
        taluk: "",
        cityVillageName: "",
        panchayathName: "",
        postalCityName: "",
        pinCode: "",
        email: "",
        annualIncome: "",
        caste: "",
        subCaste: "",
        gender: "",
        maritalStatus: "",
        nomineeName: "",
        nomineeMobile: "",
        nomineeRelation: "",
        recipt: '',
        BankName: '',
        AccountNo: '',
        BranchName: '',
        ifsc : '',
    });

    const updateMembershipId = () => {
        const branchCode = "N/A";
        let membershipType = formData.membershipType || "I";

        if (!membershipTypeCounts[membershipType]) {
            setMembershipTypeCounts(prevCounts => ({
                ...prevCounts,
                [membershipType]: 1,
            }));
        } else {
            // Increment count for the membership type
            setMembershipTypeCounts(prevCounts => ({
                ...prevCounts,
                [membershipType]: prevCounts[membershipType] + 1,
            }));
        }

        const onFormSubmit = () => {
            const newNumber = membershipTypeCounts[membershipType] || 1;
            const newMembershipId = `MSCS${membershipType}${newNumber.toString().padStart(5, '0')}`.slice(0, 13);
            const adjustedMembershipId = newMembershipId.padEnd(13, 'X');


            // Update form data with the new membership ID
            setFormData(prevFormData => ({
                ...prevFormData,
                membershipId: adjustedMembershipId,
            }));
        };

        // Call the onFormSubmit function to simulate form submission
        onFormSubmit();
    };

    const handleNext = (e) => {
        e.preventDefault();
        // Define the order of forms
        const formOrder = ["Member", "Verification", "Cash"];
        const currentIndex = formOrder.indexOf(activeForm);
        updateMembershipId();
        if (currentIndex < formOrder.length - 1) {
            setActiveForm(formOrder[currentIndex + 1]);
        }
    };

    const handlePrevious = (e) => {
        e.preventDefault();
        // Define the order of forms
        const formOrder = ["Member", "Verification", "Cash"];
        const currentIndex = formOrder.indexOf(activeForm);

        if (currentIndex > 0) {
            setActiveForm(formOrder[currentIndex - 1]);
        }
    };

    const showPreviousButton = activeForm !== "Member";
    const showNextButton = activeForm !== "Cash";
    const showSubmitButton = activeForm === "Cash";

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "referenceName") {
            // If referenceName is changed, find the corresponding employee and update referenceMobile
            const selectedEmployee = employees.find(employee => employee.employeeName === value);
            if (selectedEmployee) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    referenceName: value,
                    referenceMobile: selectedEmployee.mobile,
                }));
            } else {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    referenceName: value,
                    referenceMobile: '',
                }));
            }
        } else if (name === "membershipType") {
            // If membershipType is changed, update membershipId
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value,
            }), () => {
                // Call the function to generate membership ID after state update
                updateMembershipId();
            });
        } else {
            // For other fields, update form data without generating membership ID
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };

    function generateReciptNumber(recipt) {
        // Retrieve the last used number for the branch code from local storage
        let lastNumber = localStorage.getItem(`lastNumber_${recipt}`);

        if (!lastNumber) {
            lastNumber = 1; // Start with 00000001
            localStorage.setItem(`lastNumber_${recipt}`, lastNumber);
        } else {
            lastNumber = parseInt(lastNumber) + 1; // Increment by one
            localStorage.setItem(`lastNumber_${recipt}`, lastNumber);
        }

        // Generate the ID with the format "MS" + lastNumber with padding
        return `MS${lastNumber.toString().padStart(8, '0')}/2024-25`;
    }


    useEffect(() => {
        if (formData.membershipType) {
            updateMembershipId();
        }
    }, [formData.membershipType]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    //image Upload  Functionality

    const [aadharNumber, setAadharNumber] = useState('');
    const [aadharFrontImage, setAadharFrontImage] = useState(null);
    const [aadharBackImage, setAadharBackImage] = useState(null);
    const [panNumber, setpanNumber] = useState('');
    const [panImage, setPanImage] = useState(null);
    const [signatureImage, setSignatureImage] = useState(null);
    const [isValidPan, setIsValidPan] = useState(true);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Cash");
    const [transactionId, setTransactionId] = useState("");
    const [cashTransactionId, setcashTransactionId] = useState("");
    const [transactionTime, setTransactionTime] = useState("");

    const handleAadharNumberChange = (e) => {
        const inputValue = e.target.value;

        // Check if the entered value is a 12-digit number
        if (/^\d{0,12}$/.test(inputValue) || inputValue === '') {
            setAadharNumber(inputValue);
        }
    };

    const handlepanNumberChange = (e) => {
        const inputValue = e.target.value.toUpperCase(); // Convert to uppercase

        // Check if the entered value loosely matches the PAN card format
        if (/^[A-Z]{0,5}[0-9]{0,4}[A-Z]{0,1}$/.test(inputValue) || inputValue === '') {
            setpanNumber(inputValue);
            setIsValidPan(true);
        } else {
            setIsValidPan(false);
        }
    };

    const TARGET_PIXELS = 1.5 * 1000 * 1000; // Targeting screens with about 1.5 million pixels

    const handleImageChange = (event, setImageState) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                const img = new Image();

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Calculate the scale factor to maintain aspect ratio while fitting within the target pixel count
                    const scaleFactor = Math.min(1, Math.sqrt(TARGET_PIXELS / (img.width * img.height)));
                    canvas.width = img.width * scaleFactor;
                    canvas.height = img.height * scaleFactor;

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // Convert the canvas content to base64 and set as state
                    setImageState(canvas.toDataURL('image/jpeg'));
                };

                img.src = reader.result;
            };

            reader.readAsDataURL(file);
        }
    };


    const handleAadharFrontImageChange = (event) => {
        handleImageChange(event, setAadharFrontImage);

    };

    const handleAadharBackImageChange = (event) => {
        handleImageChange(event, setAadharBackImage);
    };

    const handlePanImageChange = (event) => {
        handleImageChange(event, setPanImage);
    };

    const handleSignatureChange = (event) => {
        handleImageChange(event, setSignatureImage);
    };

    const generateTransactionId = () => {
        let cashtransactionId = '';
        for (let i = 0; i < 16; i++) {
            cashtransactionId += Math.floor(Math.random() * 10);
        }
        return cashtransactionId;
    };
    useEffect(() => {
        setcashTransactionId(generateTransactionId());
    }, []);


    //reference mobile fetching
    const [employees, setEmployees] = useState([]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!aadharNumber || !formData.customerName || !formData.address || !formData.customerMobile) {
            alert("Please fill in the Aadhar number, customer name, and address before submitting.");
            return; // Exit the function early if any of the required fields are empty
        }
        try {
            const receiptNumber = generateReciptNumber();

            const response = await fetch("http://localhost:4000/api/customers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    aadharNumber,
                    aadharFrontImage,
                    aadharBackImage,
                    panNumber,
                    panImage,
                    signatureImage,
                    selectedPaymentMethod,
                    cashTransactionId,
                    transactionId,
                    transactionTime,
                    receiptNumber: receiptNumber, // Include generated receipt number as receiptNumber field
                }),
            });
            if (response.ok) {
                console.log("Form data sent successfully");
                console.log(formData);
                console.log("Generated Receipt Number:", receiptNumber); // Log generated receipt number
                alert("Successful")
                updateMembershipId();
                console.log(updateMembershipId());
                // window.location.href = "/list";
            } else {
                console.error(
                    "Failed to send form data. Server returned:",
                    response.status,
                    response.statusText
                );
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    const [show, setShow] = useState(false); // Initially set to false to hide the modal
    const [currentPage, setCurrentPage] = useState(1);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const nextPage = () => {
        if (currentPage < 3) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
        if (show) {
            setCurrentPage(1); // Reset to the first page when the modal is opened
        }
    }, [show]);

    useEffect(() => {
        fetchMemberships(currentPage, pageSize, searchReceipt);
    }, [currentPage, pageSize, searchReceipt]);

    const fetchMemberships = async (page, size, searchTerm = '', searchReceipt = '') => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:4000/api/getCustomers?page=${page}&limit=${size}&searchTerm=${searchTerm}&searchReceipt=${searchReceipt}`);
            setMemberships(response.data.data);
            setAllMemberships(response.data.data);
            setNextPages(response.data.nextPage);
        } catch (error) {
            console.error('Error fetching memberships data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        fetchMemberships(1, pageSize, value);
    };


    const handleNextPage = () => {
        if (nextPages) {
            setCurrentPage(currentPage + 1);
            fetchMemberships(currentPage + 1, pageSize, searchTerm); // Include searchTerm
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            fetchMemberships(currentPage - 1, pageSize, searchTerm); // Include searchTerm
        }
    };

    const handleRowClick = (membership) => {
        setSelectedRow(membership);
    };

    return (
        <>

            <nav className="navbar navbar-light ">
                <div className="container-fluid">
                    <Link className="navbar-brand ms-5 d-flex align-items-center" to='/'>
                        <img src={logo} alt="logo" width="100px" className="d-inline-block align-text-top" />
                        <strong className="fs-2 ">EMPAIR MARKETING PVT LTD</strong>
                    </Link>
                    <div className="d-flex" style={{ width: "600px" }}>
                        <FontAwesomeIcon icon={faHouse} className=" me-5 mt-4" />
                        <FontAwesomeIcon
                            icon={faPowerOff}
                            onClick={""}
                            className="text-danger me-5 mt-4"
                        />
                        <div className="d-flex">
                            <FontAwesomeIcon icon={faUser} className="me-3 mt-4" />
                            <ul className="list-unstyled mb-1" style={{ width: "150px" }}>
                                <li className="me-2">Employee</li>
                                <li className="me-2">Place</li>
                                <li className="me-2">Time</li>
                                <li>Date</li>
                            </ul>

                        </div>
                    </div>
                </div>
            </nav>
            <div className="marquee  px-5 m-2">
                <marquee className="text-white" behavior="scroll" direction="left">
                    New Updates : Welcome to EMPAIR MARKETING PVT LTD....Have a nice day.... </marquee>
            </div>
            <NavBar />
            <Button variant="primary" onClick={handleShow}>
                ADD NEW CUSTOMER
            </Button>
            <div className="text-center mt-3" style={{ backgroundColor: "lightgrey" }}>
                <p>
                    <b>CUSTOMERS (Year: 2024-2025)</b>
                </p>

                <center>
                    <div className="table-container">
                        {isLoading ? (
                            <div className="loading-animation">Loading...</div>
                        ) : (
                            <Table striped bordered hover id='print-content'>
                                <thead>
                                    <tr>
                                        <th>Sl NO</th>
                                        <th>CUSTOMER NAME</th>
                                        <th>MEMBERSHIP ID</th>
                                        <th>MEMBERSHIP JOIN DATE</th>
                                        <th>ADDRESS</th>
                                        <th>PHONE NUMBER</th>
                                        <th>REFERENCE NAME</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {memberships.map((membership, index) => (
                                        <tr key={membership._id} onClick={() => handleRowClick(membership)} className={selectedRow === membership ? 'selected-row' : ''}>
                                            <td>{index + 1}</td>
                                            <td>{membership.customerName}</td>
                                            <td>{membership.customerId}</td>
                                            <td>{membership.date}</td>
                                            <td>{membership.address}</td>
                                            <td>{membership.customerMobile}</td>
                                            <td>{membership.referenceName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                        <div className="pagination-buttons">
                            <Button onClick={handlePreviousPage} disabled={currentPage === 1}><FontAwesomeIcon icon={faArrowLeft} /> Previous</Button>
                            <span>Page {currentPage}</span>
                            <Button onClick={handleNextPage} disabled={!nextPage}>Next <FontAwesomeIcon icon={faArrowRight} /></Button>

                        </div>
                    </div>
                </center>
            </div>


            <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
                <Modal.Header closeButton>
                    <Modal.Title>CUSTOMER REGISTER FORM</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body">
                    {currentPage === 1 && (
                        <div className="col">
                            <div className="form-row d-flex flex-row">
                                <div className="form-group col-md-4">
                                    <label className="label">CUSTOMER_TYPE*:</label>
                                    <select
                                        id="inputState"
                                        className="form-control"
                                        name="customerType"
                                        value={formData.customerType}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>
                                            --Select--
                                        </option>
                                        <option value="I">Individual</option>
                                        <option value="I">B</option>
                                        {/* <option value="I">C</option> */}
                                    </select>
                                </div>
                                <div className="form-group col-md-4 pl-3">
                                    <label className="label">CUSTOMER_ID:</label>
                                    <input
                                        name="customerId"
                                        className="form-control"
                                        id="inputPassword4"
                                        value={formData.customerId}
                                        onChange={handleChange}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="form-row d-flex flex-row ">
                                <div className="form-group col-md-4">
                                    <label className="label">CUSTOMER NAME*</label>
                                    <div className="d-flex ">
                                        <div className="dropdownicon">
                                            <select
                                                id="smallsize"
                                                className="form-control form-control-sm"
                                                name="customerName"
                                                value={formData.customerName}
                                                onChange={handleChange}
                                            >
                                                <option value="Mr.">Mr.</option>
                                                <option value="Ms.">Ms.</option>
                                                <option value="Mrs.">Mrs.</option>
                                            </select>
                                        </div>
                                        <input
                                            name="customerName"
                                            value={formData.customerName}
                                            onChange={handleChange}
                                            type="text"
                                            className="form-control"
                                            style={{ width: "64%" }}
                                            id="inputAddress"
                                            placeholder=""
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group pl-3 col-md-4">
                                    <label className="label">DATE*</label>
                                    {/* <div className="form-control">
                                      {currentDate.toLocaleString()}
                                       </div> */}
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="date"
                                        name="date"
                                        value={formData.date}
                                        placeholder="Date"
                                    />
                                </div>
                            </div>
                            <div className="form-row d-flex flex-row">
                                <div className="form-group col-md-4">
                                    <label className="label">GUARDIAN NAME:</label>
                                    <div className="d-flex ">
                                        <div className="dropdownicon">
                                            <select
                                                id="smallsize"
                                                className="form-control form-control-sm "
                                                name="guardianName"
                                                value={formData.guardianName}
                                                onChange={handleChange}
                                            >
                                                <option> </option>
                                                <option value="Mr.">Mr.</option>
                                                <option value="Ms.">Ms.</option>
                                                <option value="Mrs.">Mrs.</option>
                                            </select>
                                        </div>
                                        <input
                                            name="guardianName"
                                            value={formData.guardianName}
                                            onChange={handleChange}
                                            type="text"
                                            className="form-control"
                                            style={{ width: "64%" }}
                                            id="inputAddress"
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                                <div className="form-group pl-3 col-md-4">
                                    <label className="label">RELATION:</label>
                                    <select
                                        id="inputState"
                                        className="form-control"
                                        value={formData.relation}
                                        onChange={(e) =>
                                            setFormData({ ...formData, relation: e.target.value })
                                        }
                                    >
                                        <option value="" disabled>
                                            -Select-.
                                        </option>
                                        <option value="Father">Father</option>
                                        <option value="Mother">Mother</option>
                                        <option value="Wife">Wife</option>
                                        <option value="Husband">Husband</option>
                                        <option value="Son">Son</option>
                                        <option value="Daughter">Daughter</option>
                                        <option value="Brother">Brother</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row d-flex flex-row">
                                <div className="form-group col-md-4">
                                    <label className="label">ADDRESS*</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="inputEmail4"
                                        style={{ height: "70px" }}
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group pl-3 col-md-4">
                                    <label className="label">CUSTOMER MOBILE</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="inputPassword4"
                                        name="customerMobile"
                                        value={formData.customerMobile}
                                        onChange={handleChange}
                                        maxLength={10}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row d-flex flex-row">
                                <div className="form-group col-md-4">
                                    <label className="label">TELEPHONE NO:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="inputEmail4"
                                        value={formData.telephoneNo}
                                        name="telephoneNo"
                                        onChange={handleChange}
                                        maxLength={11}
                                    />
                                </div>
                                <div className="form-group pl-3 col-md-4">
                                    <label className="label">AMOUNT</label>
                                    <input
                                        className="form-control"
                                        id="inputPassword4"
                                        placeholder="RS.100"
                                        value={formData.amount}
                                        name="amount"
                                        onChange={handleChange}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="form-row d-flex flex-row">
                                <div className="form-group col-md-4">
                                    <label className="label">REFERENCE NAME:</label>
                                    <select
                                        className="form-control"
                                        value={formData.referenceName}
                                        name="referenceName"
                                        onChange={handleChange}
                                    >
                                        <option value="">Select an employee</option>
                                        {employees.map(employee => (
                                            <option key={employee.id} value={employee.employeeName}>{employee.employeeName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group pl-3 col-md-4">
                                    <label className="label">REFERENCE MOBILE:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="inputPassword4"
                                        value={formData.referenceMobile}
                                        name="referenceMobile"
                                        onChange={handleChange}
                                        maxLength={10}
                                    />
                                </div>
                            </div>
                            <div className="form-row d-flex flex-row">
                                <div className="form-group col-md-4">
                                    <label className="label">DATE OF BIRTH:</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={formData.dateOfBirth}
                                        name="dateOfBirth"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group pl-3 col-md-4">
                                    <label className="label">AGE:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={formData.age}
                                        name="age"
                                        onChange={handleChange}
                                        maxLength={2}
                                    />
                                </div>
                            </div>
                            <div className="form-row d-flex flex-row">
                                <div className="form-group col-md-4">
                                    <label className="label">BLOOD GROUP:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.bloodGroup}
                                        name="bloodGroup"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group pl-3 col-md-4">
                                    <label className="label">PROFESSION:</label>
                                    <input
                                        className="form-control"
                                        value={formData.profession}
                                        name="profession"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-row d-flex flex-row">
                                <div className="form-group col-md-4">
                                    <label className="label">DISTRICT:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.district}
                                        name="district"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group pl-3 col-md-4">
                                    <label className="label">TALUK:</label>
                                    <input
                                        className="form-control"
                                        value={formData.taluk}
                                        name="taluk"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-row d-flex flex-row">
                                <div className="form-group col-md-4">
                                    <label className="label">CITY/VILLAGE NAME</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.cityVillageName}
                                        name="cityVillageName"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group pl-3 col-md-4">
                                    <label className="label">PANCHAYATH NAME:</label>
                                    <input
                                        className="form-control"
                                        value={formData.panchayathName}
                                        name="panchayathName"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-row d-flex flex-row">
                                <div className="form-group col-md-4">
                                    <label className="label">POSTAL CITY NAME:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.postalCityName}
                                        name="postalCityName"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group pl-3 col-md-4">
                                    <label className="label">PIN CODE</label>
                                    <input
                                        type="number"
                                        minLength='6'
                                        className="form-control"
                                        value={formData.pinCode}
                                        name="pinCode"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-row d-flex flex-row">
                                <div className="form-group col-md-4">
                                    <label className="label">E_MAIL:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={formData.email}
                                        name="email"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group pl-3 col-md-4">
                                    <label className="label">ANNUAL INCOME</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={formData.annualIncome}
                                        name="annualIncome"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-row d-flex flex-row">
                                <div className="form-group col-md-4">
                                    <label className="label">CASTE:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.caste}
                                        name="caste"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group pl-3 col-md-4">
                                    <label className="label">SUB CASTE:</label>
                                    <input
                                        className="form-control"
                                        value={formData.subCaste}
                                        name="subCaste"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-row d-flex flex-row">
                                <div className="form-group col-md-4">
                                    <label className="label">GENDER:</label>
                                    <select
                                        id="inputState"
                                        name="gender"
                                        className="form-control"
                                        value={formData.gender}
                                        onChange={(e) =>
                                            setFormData({ ...formData, gender: e.target.value })
                                        }
                                    >
                                        <option selected>-Select-.</option>
                                        <option value={"Male"}>Male</option>
                                        <option value={"Female"}>Female</option>
                                        <option value={"Others"}>Others</option>
                                    </select>
                                </div>
                                <div className="form-group pl-3 col-md-4">
                                    <label className="label">MARITAL_STATUS:</label>
                                    <select
                                        id="inputState"
                                        className="form-control"
                                        value={formData.maritalStatus}
                                        name="maritalStatus"
                                        onChange={(e) =>
                                            setFormData({ ...formData, maritalStatus: e.target.value })
                                        }
                                    >
                                        <option selected>-Select-.</option>
                                        <option value={"Married"}>Married</option>
                                        <option value={"Unmarried"}>Unmarried</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row row d-flex flex-row">
                                <div className="form-group  col-md-4">
                                    <label className="label">NOMINEE NAME:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Name"
                                        name="nomineeName"
                                        value={formData.nomineeName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group  col-md-4">
                                    <label className="label">NOMINEE MOBILE</label>
                                    <input
                                        type="number"
                                        maxLength={10}
                                        className="form-control"
                                        placeholder="Mobile number"
                                        value={formData.nomineeMobile}
                                        name="nomineeMobile"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group  col-md-3">
                                    <label className="label">NOMINEE RELATION</label>
                                    <select
                                        id="inputState"
                                        className="form-control"
                                        value={formData.nomineeRelation}
                                        name="nomineeRelation"
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                nomineeRelation: e.target.value,
                                            })
                                        }
                                    >
                                        <option selected>-Select-.</option>
                                        <option value={"Father"}>Father</option>
                                        <option value={"Mother"}>Mother</option>
                                        <option value={"Wife"}>Wife</option>
                                        <option value={"Husband"}>Husband</option>
                                        <option value={"Son"}>Son</option>
                                        <option value={"Daughter"}>Daughter</option>
                                        <option value={"Brother"}>Brother</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                    {currentPage === 2 && (
                        <div className="Verification form">
                            <h2>Upload your KYC documents</h2>
                            <form className="mt-4">
                                {/* Aadhar section */}
                                <div className="row px-5">
                                    <label htmlFor="aadhaar">
                                        <strong>Aadhaar Card Details</strong>
                                        <input className='form-control mt-3' type="text" placeholder='Enter your Aadhaar Card number' value={aadharNumber} onChange={handleAadharNumberChange} />
                                    </label>

                                    <div className="col-md-6 mb-4">
                                        <div className="file-input-box border rounded p-3">
                                            <label htmlFor="frontAadhaar" className="form-label">
                                                Front side of Aadhaar :
                                            </label>
                                            <input
                                                className="form-control"
                                                type="file"
                                                id="frontAadhaar"
                                                onChange={handleAadharFrontImageChange}
                                            />
                                            <div className=" card image-preview-box border rounded mt-2">
                                                <div className='card-body' style={{ width: '100%', height: '200px' }}>
                                                    {aadharFrontImage && (
                                                        <img
                                                            src={aadharFrontImage}
                                                            alt="Aadhar Front Preview"
                                                            style={{ width: '100%', height: '100%' }}
                                                        />
                                                    )}
                                                    {!aadharFrontImage && <div className="no-file-chosen-label">img preview</div>}
                                                </div>
                                            </div>
                                            {aadharFrontImage && (
                                                <div id="cancel-btn" onClick={() => setAadharFrontImage(null)}>
                                                    <i className="fas fa-times"></i>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <div className="file-input-box border rounded p-3">
                                            <label htmlFor="backAadhaar" className="form-label">
                                                Back side of Aadhaar :
                                            </label>
                                            <input
                                                className="form-control"
                                                type="file"
                                                id="backAadhaar"
                                                onChange={handleAadharBackImageChange}
                                            />
                                            <div className=" card image-preview-box border rounded mt-2">
                                                <div className='card-body' style={{ width: '100%', height: '200px' }}>
                                                    {aadharBackImage && (
                                                        <img
                                                            src={aadharBackImage}
                                                            alt="Aadhar Back Preview"
                                                            style={{ width: '100%', height: '100%' }}
                                                        />
                                                    )}
                                                    {!aadharBackImage && <div className="no-file-chosen-label">img preview</div>}
                                                </div>
                                            </div>
                                            {aadharBackImage && (
                                                <div id="cancel-btn" onClick={() => setAadharBackImage(null)}>
                                                    <i className="fas fa-times"></i>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* PAN section */}
                                <div className='row px-5'>

                                    <label htmlFor="panCard">
                                        <strong>Pan Card Details</strong>
                                        <input className='form-control mt-3' type="text" placeholder='Enter the pan card number' value={panNumber} onChange={handlepanNumberChange} />
                                    </label>
                                    <div style={{ color: 'red', marginTop: '5px' }}>
                                        {!isValidPan && 'Please enter a valid PAN card number.'}
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <div className="file-input-box border rounded p-3">
                                            <label htmlFor="panCard" className="form-label">
                                                Pan card image :
                                            </label>
                                            <input
                                                className="form-control"
                                                type="file"
                                                id="panCard"
                                                onChange={handlePanImageChange}
                                            />
                                            <div className=" card image-preview-box border rounded mt-2">
                                                <div className='card-body' style={{ width: '100%', height: '200px' }}>
                                                    {panImage && (
                                                        <img
                                                            src={panImage}
                                                            alt="Pan Card Preview"
                                                            style={{ width: '100%', height: '100%' }}
                                                        />
                                                    )}
                                                    {!panImage && <div className="no-file-chosen-label">img preview</div>}
                                                </div>
                                            </div>
                                            {panImage && (
                                                <div id="cancel-btn" onClick={() => setPanImage(null)}>
                                                    <i className="fas fa-times"></i>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* signature section */}
                                <div className='row px-5'>
                                    <label htmlFor="signature">
                                        <strong>Signature</strong>
                                    </label>
                                    <div className="col-md-6 mt-3 mb-4">
                                        <div className="file-input-box border rounded p-3">
                                            <label htmlFor="signature" className="form-label">
                                                Signature image :
                                            </label>
                                            <input
                                                className="form-control"
                                                type="file"
                                                id="signature"
                                                onChange={handleSignatureChange}
                                            />
                                            <div className=" card image-preview-box border rounded mt-2">
                                                <div className='card-body' style={{ width: '100%', height: '200px' }}>
                                                    {signatureImage && (
                                                        <img
                                                            src={signatureImage}
                                                            alt="Pan Card Preview"
                                                            style={{ width: '100%', height: '100%' }}
                                                        />
                                                    )}
                                                    {!signatureImage && <div className="no-file-chosen-label">img preview</div>}
                                                </div>
                                            </div>
                                            {signatureImage && (
                                                <div id="cancel-btn" onClick={() => setSignatureImage(null)}>
                                                    <i className="fas fa-times"></i>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                    {currentPage === 3 && (
                        <div className="Cash form">
                            <div class="row justify-content-center">
                                <div class="col-lg-9 col-12">
                                    
                                </div>
                                <div class="containerAC">
                                <h2>Customer Bank Details</h2>
                                    <form action="action_page.php">

                                        <label for="fname">Bank Name:</label>
                                        <input
                                                type="text"
                                                className="form-control"
                                                value={formData.BankName}
                                                name="BankName"
                                                onChange={handleChange}
                                                placeholder="Your last Bank Name.."
                                            />
                                        <label for="lname">Ac/no:</label>
                                        <input
                                                type="text"
                                                className="form-control"
                                                value={formData.AccountNo}
                                                name="AccountNo"
                                                placeholder="Your last Ac/no.."
                                                onChange={handleChange}
                                            />
                                        
                                        <label for="lname">IFSC:</label>
                                        <input
                                                type="text"
                                                className="form-control"
                                                value={formData.ifsc}
                                                name="ifsc"
                                                onChange={handleChange}
                                                placeholder="Your last ifsc.."
                                            />

                                        <label for="lname">Branch Name:</label>
                                        <input
                                                type="text"
                                                className="form-control"
                                                value={formData.BranchName}
                                                name="BranchName"
                                                onChange={handleChange}
                                                placeholder="Your last Branch Name.."
                                            />
                                    </form>
                                </div>
                            </div>
                        </div>

                    )}
                </Modal.Body>
                <Modal.Footer>
                    {currentPage > 1 && (
                        <Button variant="secondary" onClick={prevPage}>
                            Back
                        </Button>
                    )}
                    {currentPage < 3 ? (
                        <Button variant="primary" onClick={nextPage}>
                            Next
                        </Button>
                    ) : (
                        <Button variant="success" onClick={handleSubmit}>
                            Finish
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ImageUpload 