import React, { useState, useRef, useEffect } from "react";
import NavBar from "./NavBar";
import { Container, Row, Col, Form, Table, Button, Modal, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPowerOff, faUser, faEllipsisV, faArrowLeft, faArrowRight, } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logo from './Images/logo.png';
import axios from "axios";

export default function ItemList() {
    const dropdownRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [typedPage, setTypedPage] = useState("");

    const initialCheckedItems = ({
        'Si_no': true,
        'Item Code': true,
        "Barcode": true,
        "Item Name": true,
        'ItemNameml': false,
        'Group Name': true,
        'Purchase Rate': false,
        'Sale Rate': true,
        'MRP': false,
        'Minimum Rate': false,
        'Opening Stock': false,
        'Unit': false,
        'Brand': false,
        'Location': false,
        'Expiry Days': false,
        'Is Service': false,
        'Has Batch': false,
        'Has Serial No': false,
        'Has Warranty': false,
        'Raw Materials': false,
        'Sales Item': false,
        'Stock Tracking': false,
        'expiredItem': false,
        'Is FMP': false,
    });
    const [checkedItems, setCheckedItems] = useState(initialCheckedItems);
    const [tableHeaders, setTableHeaders] = useState(
        Object.keys(initialCheckedItems).filter(key => initialCheckedItems[key])
    );

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;

        // List of headers that should always remain checked
        const alwaysCheckedHeaders = ["Si_no", "Item Code", "Barcode", "Item Name", "Group Name", "Sale Rate"];

        // Prevent unchecking the always checked headers
        if (!checked && alwaysCheckedHeaders.includes(name)) {
            return;
        }

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

    const handleSelectAllClick = () => {
        const allChecked = Object.keys(checkedItems).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setCheckedItems(allChecked);
    };

    // Add this function in the same place where you have other handler functions
    const handleClearAllClick = () => {
        const newCheckedItems = Object.keys(checkedItems).reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {});
        setCheckedItems(newCheckedItems);
    };

    const [items, setItems] = useState([]);
   const [search, setSearch] = useState("");

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:4000/api/getAllItems`, {
                params: {
                    page: currentPage,
                    limit: itemsPerPage,
                    search: search.trim() || undefined, 
                },
            });

            setItems(response.data.data || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [currentPage, itemsPerPage, search]);

    const handleSearch = () => {
        setCurrentPage(1); // Reset to the first page
        fetchItems();
    };


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // Update current page
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1); // Increment page
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1); // Decrement page
        }
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value)); // Update items per page
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handleTypedPageChange = (event) => {
        const value = event.target.value;
        // Allow only numbers
        if (/^\d*$/.test(value)) {
            setTypedPage(value);
        }
    };

    const handleGoToPage = () => {
        const page = parseInt(typedPage, 10);
        if (page && page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        } else {
            alert(`Please enter a valid page number between 1 and ${totalPages}.`);
        }
    };

    return (
        <div>
            {loading && (
                <div className="loader-overlay">
                    <div className="clock-loader"></div>
                </div>
            )}
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
                    <b>Item List (Year: 2024-2025)</b>
                </p>
            </div>
            <Container>
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
                                                label="Item Code"
                                                name="Item Code"
                                                checked={checkedItems["Item Code"]}
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
                                                label="Item Name"
                                                name="Item Name"
                                                checked={checkedItems["Item Name"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="ItemNameml"
                                                name="ItemNameml"
                                                checked={checkedItems["ItemNameml"]}
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
                                                label="Sale Rate"
                                                name="Sale Rate"
                                                checked={checkedItems["Sale Rate"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>



                                    </Row>
                                    <Row>
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
                                                label="Opening Stock"
                                                name="Opening Stock"
                                                checked={checkedItems["Opening Stock"]}
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
                                    </Row>
                                    <Row>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Brand"
                                                name="Brand"
                                                checked={checkedItems["Brand"]}
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
                                                label="Expiry Days"
                                                name="Expiry Days"
                                                checked={checkedItems["Expiry Days"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Is Service"
                                                name="Is Service"
                                                checked={checkedItems["Is Service"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
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
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Has Serial No"
                                                name="Has Serial No"
                                                checked={checkedItems["Has Serial No"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Has Warranty"
                                                name="Has Warranty"
                                                checked={checkedItems["Has Warranty"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Raw Materials"
                                                name="Raw Materials"
                                                checked={checkedItems["Raw Materials"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Sales Item"
                                                name="Sales Item"
                                                checked={checkedItems["Sales Item"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Stock Tracking"
                                                name="Stock Tracking"
                                                checked={checkedItems["Stock Tracking"]}
                                                onChange={handleCheckboxChange}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Check
                                                type="checkbox"
                                                label="expiredItem"
                                                name="expiredItem"
                                                checked={checkedItems["expiredItem"]}
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
                                    </Row>
                                    <Row className="mt-3">
                                        <Col className="d-flex justify-content-center">
                                            <Button onClick={handleOkClick}>OK</Button>
                                            <Button onClick={handleSelectAllClick} className="ms-3">Select All</Button>
                                            <Button onClick={handleClearAllClick} className="ms-3">Clear All</Button> {/* Add this line */}
                                        </Col>
                                    </Row>

                                </Container>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
                <div className="search-bar" style={{ marginBottom: "1rem" }}>
                <input
                    type="text"
                    placeholder="Search by ItemName"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ marginRight: "10px" }}
                />
                <Button variant="primary" onClick={handleSearch}>
                    Find
                </Button>
            </div>
                <Table striped bordered hover responsive size="sm">
                    <thead>
                        <tr>
                            {tableHeaders.map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, itemIndex) => (
                            <tr key={`row-${itemIndex}`}>
                                {/* {tableHeaders.includes("Si_no") && <td>{itemIndex + 1}</td>} */}
                                {tableHeaders.includes("Si_no") && <td>{(currentPage - 1) * itemsPerPage + itemIndex + 1}</td>}
                                {tableHeaders.includes("Item Code") && <td>{item.itemCode}</td>}
                                {tableHeaders.includes("Barcode") && <td>{item.barCode}</td>}
                                {tableHeaders.includes("Item Name") && <td>{item.itemName}</td>}
                                {tableHeaders.includes("ItemNameml") && <td>{item.itemNameml}</td>}
                                {tableHeaders.includes("Group Name") && <td>{item.groupName}</td>}
                                {tableHeaders.includes("Purchase Rate") && <td>{item.purchaseRate}</td>}
                                {tableHeaders.includes("Sale Rate") && <td>{item.salesRate}</td>}
                                {tableHeaders.includes("MRP") && <td>{item.mrp}</td>}
                                {tableHeaders.includes("Minimum Rate") && <td>{item.minRate}</td>}
                                {tableHeaders.includes("Opening Stock") && <td>{item.opStock}</td>}
                                {tableHeaders.includes("Unit") && <td>{item.baseUom}</td>}
                                {tableHeaders.includes("Brand") && <td>{item.brand}</td>}
                                {tableHeaders.includes("Location") && <td>{item.location}</td>}
                                {tableHeaders.includes("Expiry Days") && <td>{item.expiryDays}</td>}
                                {tableHeaders.includes("Is Service") && <td>{item.isService}</td>}
                                {tableHeaders.includes("Has Batch") && <td>{item.hasBatch}</td>}
                                {tableHeaders.includes("Has Serial No") && <td>{item.hasSerialNo}</td>}
                                {tableHeaders.includes("Has Warranty") && <td>{item.hasWarranty}</td>}
                                {tableHeaders.includes("Raw Materials") && <td>{item.rawMaterials}</td>}
                                {tableHeaders.includes("Sales Item") && <td>{item.salesItem}</td>}
                                {tableHeaders.includes("Stock Tracking") && <td>{item.stockTracking}</td>}
                                {tableHeaders.includes("expiredItem") && <td>{item.expiredItem}</td>}
                                {tableHeaders.includes("Is FMP") && <td>{item.FMP}</td>}
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className="pagination-buttons">
                    <div className="go-to-page">
                        <label>Go to page: </label>
                        <input
                            type="text"
                            value={typedPage}
                            onChange={handleTypedPageChange}
                            placeholder="Page number"
                            style={{ width: "60px", marginRight: "10px" }}
                        />
                        <Button variant="secondary" onClick={handleGoToPage}>
                            Go
                        </Button>
                    </div>
                    <Button
                        variant="primary"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1} // Disable if on the first page
                    >
                        <FontAwesomeIcon icon={faArrowLeft} /> Previous
                    </Button>
                    <div className="page-numbers">
                        {pageNumbers.slice(
                            Math.max(0, currentPage - 3),
                            currentPage + 2
                        ).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={currentPage === pageNumber ? "active" : ""}
                            >
                                {pageNumber}
                            </button>
                        ))}
                    </div>
                    <Button
                        variant="primary"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages} // Disable if on the last page
                    >
                        Next <FontAwesomeIcon icon={faArrowRight} />
                    </Button>
                    <div>
                        <label>Items per page: </label>
                        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </Container>
        </div>
    )
};