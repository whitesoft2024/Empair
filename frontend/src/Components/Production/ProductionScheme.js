import React, { useState, useEffect, useRef } from "react";
import NavBar from "../NavBar.js";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faFileExport, faPrint, faInfoCircle, faTrashAlt, faHouse, faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { faCheckCircle, faTimesCircle, faCircle } from "@fortawesome/free-solid-svg-icons";
import logo from "../Images/logo.png";
import NewPurchasesScheme from "./newSchemePurchase.js";
import ReferenceDetails from "./ModalReferenceDetails.js";

export default function SchemPurchase() {
  const [showModal, setShowModal] = useState(false);
  const [showRefModal, setShowRefModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchRef, setSearchRef] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [scheme, setScheme] = useState([]);
  const [queryDetails, setQueryDetails] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState({
    customerName: "",
    referenceId: "",
    customerMobile: "",
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    const interval = setInterval(() => {
      fetchSchemeName();
    }, 1000);
    return () => clearInterval(interval);
  }, [page, limit]);

  const fetchSchemeName = async () => {
    try {
      const response = await fetch(`http://localhost:4000/svv/getAllCustomers?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch schemes");
      }
      const data = await response.json();

      // Convert schemes object with numerical keys to an array
      const schemesArray = Object.values(data.schemes);
      setProductsData(data.productsData);
      setTotalPages(data.totalPages);
      setScheme(schemesArray); // Set as an array for table mapping
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle changes to page and limit, then fetch data accordingly
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage); // Set new page number
    }
  };

  const handleNextPage = () => setPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const handlePrevPage = () => setPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
    setPage(1); // Reset to first page on limit change
  };

  // Determine page numbers to display around the current page
  const pageNumbers = [];
  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, page + 2);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }


  const handleModalClose = () => {
    setShowModal(false);
  };
  const handleRefModalClose = () => {
    setShowRefModal(false);
  };
  const handleSaveValue = (value) => {
    setTableData([...tableData, value]);
  };

  const searchReferenceId = (referenceId) => {
    const minLength = 4;
    const matches = scheme.flatMap((scheme) =>
      scheme.customerData.flatMap((customer) =>
        customer.reference.filter(
          (ref) =>
            ref.referenceId === referenceId ||
            (ref.referenceId.startsWith(referenceId.slice(0, -1)) &&
              ref.referenceId.length === referenceId.length - 1)
        )
      )
    );
    setSearchRef(matches);

    if (referenceId.length > minLength) {
      searchReferenceId(referenceId.slice(0, -1));
    }
  };

  const handleReferenceIdClick = (referenceId, customer) => {
    console.log("Clicked details:", {
        referenceId,
        customerName: customer.customerName,
        customerMobile: customer.customerMobile,
        schemePurchaseId: customer.schemePurchaseId,
    });

    setShowRefModal(true);

    const queryParams = new URLSearchParams({
        referenceId,
        customerName: customer.customerName,
        customerMobile: customer.customerMobile,
        schemePurchaseId: customer.schemePurchaseId,
    });

    fetch(`http://localhost:4000/api/searchRefId?${queryParams.toString()}`)
        .then((response) => response.json())
        .then((data) => {
            console.log("Search results:", data);

            if (data.queryDetails) {
                console.log("Query Details:", data.queryDetails);
                setSelectedCustomer(data.queryDetails); // Save separately for display
            }

            if (data.data) {
                const formattedResults = data.data.map((result, index) => ({
                    level: result.Length || `Level ${index + 1}`,
                    customerName: result.customerName,
                    referenceId: result.referenceId,
                    customerMobile: result.customerMobile,
                    schemePurchaseId: result.schemePurchaseId,
                    referenceAmount: result.referenceAmount,
                }));

                console.table(formattedResults);
                setSearchRef(formattedResults);
            } else {
                console.error("No data found in the response.");
            }
        })
        .catch((error) => console.error("Error fetching search results:", error));
};


  // const handleReferenceIdClick = (referenceId, customer) => {
  //   // Log clicked details
  //   console.log("Clicked details:", {
  //     referenceId,
  //     customerName: customer.customerName,
  //     customerMobile: customer.customerMobile,
  //     schemePurchaseId: customer.schemePurchaseId,
  //   });
  
  //   // Set the selected customer details for display
  //   setShowRefModal(true);
  
  //   // Send referenceId and other details to backend using GET method
  //   const queryParams = new URLSearchParams({
  //     referenceId,
  //     customerName: customer.customerName,
  //     customerMobile: customer.customerMobile,
  //     schemePurchaseId: customer.schemePurchaseId,
  //   });
  
  //   fetch(`http://localhost:4000/api/searchRefId?${queryParams.toString()}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Search results:", data);
  
  //       if (data.data) {
  //         // Update searchRef state with backend results
  //         setSearchRef(data.data);
  
  //         // Format and display results in the frontend
  //         const formattedResults = data.data.map((result, index) => ({
  //           level: result.Length || `Level ${index + 1}`, // Use "Length" or fallback
  //           customerName: result.customerName,
  //           referenceId: result.referenceId,
  //           customerMobile: result.customerMobile,
  //           schemePurchaseId: result.schemePurchaseId,
  //           referenceAmount: result.referenceAmount,
  //         }));
  
  //         console.table(formattedResults); // Console log for debugging
  //         setSearchRef(formattedResults); // Update state with formatted results
  //       } else {
  //         console.error("No data found in the response.");
  //       }
  //     })
  //     .catch((error) => console.error("Error fetching search results:", error));
  // };

  
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
        <div className="container">
          <Table className="container">
            <thead>
              <tr>
                <th><h4>SL No</h4></th>
                <th><h4>Customer Name</h4></th>
                <th><h4>Phone Number</h4></th>
                <th><h4>Customer Id</h4></th>
                <th><h4>Invoice Number</h4></th>
                <th><h4>Scheme Name</h4></th>
                <th><h4>Reference Id</h4></th>
                <th><h4>Request</h4></th>
              </tr>
            </thead>
            <tbody>
              {scheme.length > 0 ? (
                scheme.map((schemeItem, index) => {
                  const customer = schemeItem.customerData;
                  const fullReferenceId = customer.referenceId;

                  // Format the reference ID
                  const truncatedReferenceId = fullReferenceId.length > 11
                    ? `${fullReferenceId.slice(0, 5)}...${fullReferenceId.slice(-4)}`
                    : fullReferenceId;
                  return (
                    <tr
                      key={index}
                      onClick={() => handleReferenceIdClick(fullReferenceId, customer)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{(page - 1) * limit + index + 1}</td>
                      <td>{customer.customerName}</td>
                      <td>{customer.customerMobile}</td>
                      <td>{customer.customerId}</td>
                      <td>{customer.invoiceNumber}</td>
                      <td>{schemeItem.SchemeName}</td>
                      <td title={fullReferenceId}>{truncatedReferenceId}</td>
                      <td>
                        {schemeItem.referenceData.length > 0 ? (
                          schemeItem.referenceData[0].request === 'yes' ? (
                            <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
                          ) : schemeItem.referenceData[0].request === 'no' ? (
                            <FontAwesomeIcon icon={faTimesCircle} className="text-danger" />
                          ) : (
                            <FontAwesomeIcon icon={faCircle} className="text-warning" />
                          )
                        ) : (
                          <FontAwesomeIcon icon={faCircle} className="text-warning" />
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8">No data available</td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination Controls */}
          <div className="pagination">
            <select onChange={handleLimitChange} value={limit}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
            <div className="page-numbers">
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={page === pageNumber ? "active" : ""}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
            <button onClick={handleNextPage} disabled={page === totalPages}>Next</button>

            <div className="page-numbers">Page {page} of {totalPages}</div>
          </div>
        </div>

        <Row className="text-center mt-3">
          <Col xs={2} className="px-1">
            <Button
              variant="success"
              size="sm"
              className="w-50"
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

      <NewPurchasesScheme
        show={showModal}
        handleClose={handleModalClose}
        handleSave={handleSaveValue}
      />
      <ReferenceDetails
        show={showRefModal}
        handleClose={handleRefModalClose}
        searchRef={searchRef}
        customerDetails={selectedCustomer}
      />
    </div>
  );
}
