import React, { useState, useEffect, useRef } from "react";
import NavBar from "./NavBar";
import { Container, Row, Col, Form, Table, Button, Modal, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileExport, faPrint, faInfoCircle, faTrashAlt, faHouse, faPowerOff, faUser, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import logo from './Images/logo.png';
import NewPurchasesScheme from './newPurchaseScheme.js';
import ReferenceDetails from './ModalReferenceDetails.js';

export default function SchemPurchase() {

    const [showModal, setShowModal] = useState(false);
    const [showRefModal, setShowRefModal] = useState(false);
    const [searchRef, setSearchRef] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [scheme, setScheme] = useState([]);
    const [productsData, setProductsData] = useState([]);

    useEffect(() => {
        fetchSchmeName();
    }, []);

    const fetchSchmeName = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/getAllScheme');
            if (!response.ok) {
                throw new Error('Failed to fetch suppliers');
            }
            const data = await response.json();
            setProductsData(data.productsData);
            setScheme(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
    };
    const handleRefModalClose = () => {
        setShowRefModal(false);
    };
    const handleSaveValue = (value) => {
        setTableData([...tableData, value]);
    };


    
    const handleReferenceIdClick = (referenceId, customerData) => {
        setShowRefModal(true); // Open the modal
    
        const minLength = 4;  // Set the minimum length for the referenceId (e.g., EMPB)
    
        const searchReferenceId = (id) => {
            // Base case: Stop if the referenceId is shorter than the minimum length
            if (id.length < minLength) {
                return;
            }
    
            // Search for matches in scheme.customerData
            const matches = scheme.flatMap(scheme =>
                scheme.customerData.filter(customer => {
                    const ref = customer.referenceId;
                    // Match either the exact referenceId or one that is shorter by one character
                    return ref === id || (ref.startsWith(id.slice(0, -1)) && ref.length === id.length - 1);
                })
            );
    
            // Update the state with the matched results
            setSearchRef(prevResults => {
                // Filter to avoid duplicate entries in the searchRef array
                const uniqueMatches = matches.filter(newMatch =>
                    !prevResults.some(existing => existing.referenceId === newMatch.referenceId)
                );
                return [...prevResults, ...uniqueMatches];
            });
    
            // Log the matching referenceIds for debugging
            console.log(`Matches for "${id}":`, matches);
    
            // Recursively call the function with the shortened referenceId
            searchReferenceId(id.slice(0, -1)); // Remove the last character and search again
        };
    
        // Start the search with the full referenceId
        setSearchRef([]); // Clear previous results before starting a new search
        searchReferenceId(referenceId);
    
        // Pass the customer data to the modal
        setTableData(customerData);
    };
    

    return (
        <div>
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
            <div className="text-center mt-3" style={{ backgroundColor: "lightgrey" }}>
                <p>
                    <b>Scheme List (Year: 2024-2025)</b>
                </p>
            </div>

            <Container>
                <Row>
                    <Col sm={3}>
                        <Form.Group controlId="input2">
                            <Form.Label>Scheme</Form.Label>

                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group controlId="input4">
                            <Form.Label>Added By:</Form.Label>
                            <Form.Control size="sm" as="select">
                                <option value="">Select an option</option>
                                <option value="option1">Option 1</option>
                                <option value="option2">Option 2</option>
                                <option value="option3">Option 3</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group controlId="input2">
                            <Form.Label>Date From</Form.Label>
                            <Form.Control size="sm" type="date" />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group controlId="input3">
                            <Form.Label>To</Form.Label>
                            <Form.Control size="sm" type="date" />
                        </Form.Group>
                    </Col>
                </Row>

                <Table striped bordered hover responsive size="sm">
                    <thead>
                        <tr>
                            <th>SL No</th>
                            <th>Customer Name</th>
                            <th>Phone Number</th>
                            <th>Customer Id</th>
                            <th>Invoice Number</th>
                            <th>Scheme Name</th>
                            <th>refereceId</th>
                            <th>isActive</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scheme.map((scheme, index) => (
                            scheme.customerData.map((customer, customerIndex) => (
                                <tr key={`${index}-${customerIndex}`}
                                    onClick={() => handleReferenceIdClick(customer.referenceId, customer)} // Pass customer data along with referenceId
                                    style={{ cursor: 'pointer' }} // Adds pointer cursor for better UX
                                >
                                    <td>{customerIndex + 1}</td>
                                    <td>{customer.customerName}</td>
                                    <td>{customer.customerMobile}</td>
                                    <td>{customer.customerId}</td>
                                    <td>{customer.invoiceNumber}</td>
                                    <td>{scheme.SchemeName}</td>
                                    <td>{customer.referenceId}</td>
                                    <td>{scheme.isActive ? 'Active' : 'Inactive'}</td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                    {/* <tbody>
                        {scheme.map((scheme, index) => (
                            scheme.customerData.map((customer, customerIndex) => (
                                <tr key={`${index}-${customerIndex}`}
                                    onClick={() => handleReferenceIdClick(customer.referenceId)} // Calls the new search function
                                    style={{ cursor: 'pointer' }} // Adds pointer cursor for better UX
                                >
                                    <td>{customerIndex + 1}</td>
                                    <td>{customer.customerName}</td>
                                    <td>{customer.customerMobile}</td>
                                    <td>{customer.customerId}</td>
                                    <td>{customer.invoiceNumber}</td>
                                    <td>{scheme.SchemeName}</td>
                                    <td>{customer.referenceId}</td>
                                    <td>{scheme.isActive ? 'Active' : 'Inactive'}</td>
                                </tr>
                            ))
                        ))}
                    </tbody> */}


                </Table>
                <Row className="text-center mt-3">
                    <Col xs={2} className="px-1">
                        <Button variant="success" size="sm" className="w-50"
                            onClick={() => setShowModal(true)}
                        >
                            <FontAwesomeIcon icon={faPlus} /> New
                        </Button>
                    </Col>
                    <Col xs={2} className="px-1">
                        <Button variant="secondary" size="sm" className="w-50">
                            <FontAwesomeIcon icon={faInfoCircle} /> Details
                        </Button>
                    </Col>
                    <Col xs={2} className="px-1">
                        <Button variant="secondary" size="sm" className="w-50">
                            <FontAwesomeIcon icon={faFileExport} /> Export
                        </Button>
                    </Col>
                    <Col xs={2} className="px-1">
                        <Button variant="secondary" size="sm" className="w-50">
                            <FontAwesomeIcon icon={faPrint} /> Print
                        </Button>
                    </Col>
                    <Col xs={2} className="px-1">
                        <Button variant="secondary" size="sm" className="w-80">
                            <FontAwesomeIcon icon={faPrint} /> Print Voucher
                        </Button>
                    </Col>
                    <Col xs={{ span: 0, offset: 0 }} className="px-1 w-40">
                        <Button variant="secondary" size="sm">
                            <FontAwesomeIcon icon={faTrashAlt} /> Delete
                        </Button>
                    </Col>
                </Row>
            </Container>


            <NewPurchasesScheme show={showModal} handleClose={handleModalClose} handleSave={handleSaveValue} />
            <ReferenceDetails show={showRefModal} handleClose={handleRefModalClose} searchRef={searchRef}/>
            {/* <ReferenceDetails
                show={showRefModal}
                handleClose={handleRefModalClose}
                data={tableData} // Pass the selected row data here
            /> */}
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Value</th>
                    </tr>
                </thead>

            </table>

        </div>
    )
}
