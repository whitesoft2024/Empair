import React, { useState, useRef, useEffect } from "react";
import NavBar from "./NavBar";
import { Container, Row, Col, Form, Table, Button, Modal, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faFileExport, faPrint, faEdit, faImage, faHistory, faStar, faSave, } from "@fortawesome/free-solid-svg-icons";
import { faHouse, faPowerOff, faUser, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logo from './Images/logo.png';
export default function BatchList() {
    const [tableHeaders, setTableHeaders] = useState([]);
    const dropdownRef = useRef(null);
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [uoms, setUoms] = useState([]);
    const [selectedUom, setSelectedUom] = useState('');
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');

    const [checkedItems, setCheckedItems] = useState({
        Date: false,
        "Invoice No": false,
        "Due Date": false,
        Supplier: false,
        Purchaser: false,
        Amount: false,
        "Total Amount": false,
        Status: false,
        "Added By": false,
        "Last Update By": false,
        "Entry Date": false,
        "Bill Discount": false,
        "Scheme Discount": false,
        Narration: false,
      });
    
      const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setCheckedItems((prevCheckedItems) => ({
          ...prevCheckedItems,
          [name]: checked,
        }));
      };
      const handleOkClick = () => {
        const selectedHeaders = Object.keys(checkedItems).filter(
          (item) => checkedItems[item]
        );
        setTableHeaders(selectedHeaders);
        // Close the dropdown
        if (dropdownRef.current) {
          dropdownRef.current.click();
        }
      };
    
      const [show, setShow] = useState(false);
      const [formData, setFormData] = useState({
        itemCode: "",
        barCode: "",
        itemName: "",
        itemNameml: "",
        purchaseRate: "",
        salesRate: "",
        mrp: "",
        minRate: "",
        minStock: "",
        baseUom: '',
        brand: '',
        location: "",
        brandName: '',
        UOM: '',
        description: '',
        decimalPlace: '',
        expiryDays: "",
        parentGroup: "",
        groupName: '',
        isFinalGroup: false,
        isService: false,
        hasBatch: false,
        hasBatchNo: false,
        hasWarranty: false,
        rawMaterials: false,
        salesItem: false,
        stockTracking: false,
        isActive: false,
        FMP: false,
      });
    
      const handleShow = () => setShow(true);
    

    return (
        <div>
            <nav className="navbar navbar-light ">
                <div className="container-fluid">
                    <Link className="navbar-brand ms-5 d-flex align-items-center" to="/">
                        <img
                            src={logo}
                            alt="logo"
                            width="100px"
                            className="d-inline-block align-text-top"
                        />
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
                    New Updates : Welcome to EMPAIR MARKETING PVT LTD....Have a nice
                    day....{" "}
                </marquee>
            </div>
            <NavBar />
            <div
                className="text-center mt-3"
                style={{ backgroundColor: "lightgrey" }}
            >
                <p>
                    <b>Batch List (Year: 2024-2025)</b>
                </p>
            </div>
            <Container>
                <Row>
                    <Col sm={3}>
                        <Form.Group controlId="itemCode">
                            <Form.Label>ItemCode/BarCode</Form.Label>
                            <Form.Control size="sm" type="text" />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group controlId="itemName">
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control size="sm" type="text" />
                        </Form.Group>
                    </Col>
                    <Col sm={3} className="mt-4">
                        <Form.Check type="checkbox" label="Paid" className="mr-3 mt-2" />
                        <br/>
                        <Form.Check
                            type="checkbox"
                            label="Service Only"
                            className="mr-3 mt-2"
                        />
                    </Col>
                    <Col sm={3}>
                        <Form.Group controlId="BatchNo">
                            <Form.Label>Batch No</Form.Label>
                            <Form.Control size="sm" type="text" />
                        </Form.Group>
                    </Col>
                </Row>
                

                <Row>
                    <Col className="d-flex justify-content-end align-items-center">
                        <Dropdown>
                            <Dropdown.Toggle
                                as={Button}
                                variant="link"
                                style={{ color: "black" }}
                                ref={dropdownRef}
                            >
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="custom-dropdown-menu">
                                <Container>
                                    <Row>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Si_no"
                                                name="Si_no"
                                                checked={checkedItems["Si_no"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Barcode"
                                                name="Barcode"
                                                checked={checkedItems["Barcode"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="ManufactureDate"
                                                name="ManufactureDate"
                                                checked={checkedItems["ManufactureDate"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="ExpiryDate"
                                                name="ExpiryDate"
                                                checked={checkedItems["ExpiryDate"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>

                                    </Row>
                                    <Row>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="itemCode"
                                                name="itemCode"
                                                checked={checkedItems["itemCode"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Group Name"
                                                name="Group Name"
                                                checked={checkedItems["Group Name"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="SaleRate"
                                                name="SaleRate"
                                                checked={checkedItems["SaleRate"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="BatchNo"
                                                name="BatchNo"
                                                checked={checkedItems["BatchNo"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>

                                    </Row>
                                    <Row>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Purchase Rate"
                                                name="Purchase Rate"
                                                checked={checkedItems["Purchase Rate"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Minimum Rate"
                                                name="Minimum Rate"
                                                checked={checkedItems["Minimum Rate"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="MRP"
                                                name="MRP"
                                                checked={checkedItems["MRP"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>

                                    </Row>
                                    <Row>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Stock"
                                                name="Stock"
                                                checked={checkedItems["Stock"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Item Cost"
                                                name="Item Cost"
                                                checked={checkedItems["Item Cost"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Margin %"
                                                name="Margin %"
                                                checked={checkedItems["Margin %"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Total Stock Value"
                                                name="Total Stock Value"
                                                checked={checkedItems["Total Stock Value"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>

                                    </Row>
                                    <Row>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Op.Stock"
                                                name="Op.Stock"
                                                checked={checkedItems["Op.Stock"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Opening Stock Value"
                                                name="Opening Stock Value"
                                                checked={checkedItems["Opening Stock Value"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Mfg Date"
                                                name="Mfg Date"
                                                checked={checkedItems["Mfg Date"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Exp Date"
                                                name="Exp Date"
                                                checked={checkedItems["Exp Date"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>

                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Minimum Stock"
                                                name="Minimum Stock"
                                                checked={checkedItems["Minimum Stock"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Unit"
                                                name="Unit"
                                                checked={checkedItems["Unit"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Location"
                                                name="Location"
                                                checked={checkedItems["Location"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Has Batch"
                                                name="Has Batch"
                                                checked={checkedItems["Has Batch"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Is Active"
                                                name="Is Active"
                                                checked={checkedItems["Is Active"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Is FMP"
                                                name="Is FMP"
                                                checked={checkedItems["Is FMP"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Entry Date"
                                                name="Entry Date"
                                                checked={checkedItems["Entry Date"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="d-flex justify-content-end mt-2">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={handleOkClick}
                                            >
                                                OK
                                            </Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>

                <Row className="justify-content-end" style={{ marginTop: "10rem" }}>
                    <Col sm={3}>
                        <Form.Group controlId="stock">
                            <Form.Label>Stock </Form.Label>
                            <Form.Control size="sm" type="text" />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group controlId="stockValue">
                            <Form.Label>Stock Value </Form.Label>
                            <Form.Control size="sm" type="text" />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="text-center mt-3">
                    <Col xs={2} className="px-1">
                        <Button
                            variant="success"
                            size="sm"
                            className="w-50"
                            onClick={handleShow}
                        >
                            <FontAwesomeIcon icon={faPlus} /> New
                        </Button>
                    </Col>
                    <Col xs={2} className="px-1">
                        <Button variant="secondary" size="sm" className="w-50">
                            <FontAwesomeIcon icon={faEdit} /> Edit
                        </Button>
                    </Col>
                    <Col xs={2} className="px-1">
                        <Button variant="secondary" size="sm" className="w-50">
                            <FontAwesomeIcon icon={faImage} /> Image
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
                            <FontAwesomeIcon icon={faHistory} /> Summary
                        </Button>
                    </Col>
                    <Col xs={{ span: 0, offset: 0 }} className="px-1 w-50">
                        <Button variant="secondary" size="sm">
                            <FontAwesomeIcon icon={faStar} />
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}