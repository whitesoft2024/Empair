// export default Purchase;
import React, { useState, useEffect, useRef } from "react";
import NavBar from "./NavBar";
import { Container, Row, Col, Form, Table, Button, Modal, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileExport, faPrint, faInfoCircle, faTrashAlt, faHouse, faPowerOff, faUser, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import NewModal from './NewModal';
// import NewModal from './PurchaseEntry.js';
import AddSupplier from "./AddSupplier";
import logo from './Images/logo.png';

function Purchase() {
  const [tableHeaders, setTableHeaders] = useState([]);
  const dropdownRef = useRef(null);
  const [checkedItems, setCheckedItems] = useState({
    'Si_no': false,
    'Date': false,
    'Invoice No': false,
    'Due Date': false,
    'Supplier': false,
    'Purchaser': false,
    'Amount': false,
    'Total Amount': false,
    'Status': false,
    'Added By': false,
    'Last Update By': false,
    'Entry Date': false,
    'Bill Discount': false,
    'Scheme Discount': false,
    'Narration': false
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [name]: checked,
    }));
  };

  const handleOkClick = () => {
    const selectedHeaders = Object.keys(checkedItems).filter(item => checkedItems[item]);
    setTableHeaders(selectedHeaders);
    // Close the dropdown
    if (dropdownRef.current) {
      dropdownRef.current.click();
    }
  };

  const [showNewModal, setShowNewModal] = useState(false);
  const [tableData, setTableData] = useState([]);

  const handleModalClose = () => {
    setShowNewModal(false);
    setShowModalAddSupplier(false);
    setSelectedData(null);
  };

  const handleSaveValue = (value) => {
    setTableData([...tableData, value]);
  };
  const [showModalAddSupplier, setShowModalAddSupplier] = useState(false);
  const [supplierData, setSupplierData] = useState([]);

  const handleSupplier = (value) => {
    setSupplierData([...supplierData, value]);
  }

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');

  useEffect(() => {
    fetchSuppliers();
    const intervalId = setInterval(fetchSuppliers, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/getAllSuppliers');
      if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
      }
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSupplierChange = (event) => {
    setSelectedSupplier(event.target.value);
  };

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/getItems');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  const [purchase, setPurchase] = useState([]);

  useEffect(() => {
    fetchPurchaseData();
  }, []);

  const fetchPurchaseData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/getPurchaseData');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setPurchase(data);
    } catch (error) {
      console.error(error);
    }
  };

  const [selectedData, setSelectedData] = useState(null);

  const handleRowClick = (data) => {
    setSelectedData(data);
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
          <b>Purchase (Year: 2024-2025)</b>
        </p>
      </div>
      <Container>
        <Row>
          <Col sm={3}>
            <Form.Group controlId="input1">
              <Form.Label>Purchase</Form.Label>
              <Form.Control size="sm" type="text" />
            </Form.Group>
          </Col>
          <Col sm={3}>
            <Form.Group controlId="input2">
              <Form.Label>Supplier</Form.Label>
              <Form.Select value={selectedSupplier} onChange={handleSupplierChange} size="sm">
                <option value="">Select a supplier</option>
                {suppliers.map((supplier, index) => (
                  <option key={index} value={supplier.supplierName}>{supplier.supplierName}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm={3}>
            <Form.Group controlId="input3">
              <Form.Label>Purchaser:</Form.Label>
              <Form.Control size="sm" as="select">
                <option value="">Select an option</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Form.Control>
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
        </Row>

        <Row>
          <Col sm={3}>
            <Form.Group controlId="input1">
              <Form.Label>Ref#</Form.Label>
              <Form.Control size="sm" type="text" />
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
          <Col sm={3}>
            <Form.Group controlId="input4">
              <Form.Label>Due Date</Form.Label>
              <Form.Control size="sm" type="date" />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col sm={3}>
            <Form.Group controlId="input4">
              <Form.Label>Cost Center:</Form.Label>
              <Form.Control size="sm" as="select">
                <option value="">Select an option</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="checkboxes">
              <Form.Label></Form.Label>
              <div className="d-flex justify-content-end">
                <Form.Check
                  type="checkbox"
                  label="Paid"
                  className="mr-3 mt-2"
                />
                <Form.Check
                  type="checkbox"
                  label="Unpaid"
                  className="mr-3 mt-2"
                />
                <Form.Check
                  type="checkbox"
                  label="Partial Paid"
                  className="mt-2"
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Table striped bordered hover responsive size="sm">
          <thead>
            <tr>
              <th>SL No</th>
              <th>Supplier Name</th>
              <th>Purchase Number</th>
              <th>Delivery Date</th>
              <th>Invoice Number</th>
              <th>Item Description</th>
              <th>Invoice Date</th>
              <th>Barcode</th>
            </tr>
          </thead>
          <tbody>
            {purchase.flatMap((supplier, supplierIndex) =>
              supplier.purchaseData.map((item, itemIndex) => (
                <tr key={`${supplierIndex}-${itemIndex}`} onClick={() => handleRowClick(item)}>
                  <td>{supplierIndex + itemIndex + 1}</td>
                  <td>{supplier.supplierName}</td>
                  <td>{item.purchaseNumber}</td>
                  <td>{new Date(item.deliveryDate).toLocaleDateString()}</td>
                  <td>{item.invoiceNumber}</td>
                  <td>{item.itemDescription}</td>
                  <td>{new Date(item.invoiceDate).toLocaleDateString()}</td>
                  <td>{item.barcode}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <Row className="text-center mt-3">
          <Col xs={2} className="px-1">
            <Button variant="success" size="sm" className="w-50" onClick={() => setShowNewModal(true)}>
              <FontAwesomeIcon icon={faPlus} /> New
            </Button>
          </Col>
          <Col xs={2} className="px-1">
            <Button variant="success" size="sm" className="w-50" onClick={() => setShowModalAddSupplier(true)}>
              <FontAwesomeIcon icon={faPlus} /> Supplier
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
      <NewModal show={showNewModal} handleClose={handleModalClose} handleSave={handleSaveValue} />
      <AddSupplier show={showModalAddSupplier} handleClose={handleModalClose} handleSupplier={handleSupplier} />

      <Modal show={!!selectedData} size="xl" onHide={() => setSelectedData(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Purchase Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedData && (
            <div>
              <Table striped bordered hover responsive size="sm">
                <thead>
                  <tr>
                    <th>SL No</th>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>UOM</th>
                    <th>Rate</th>
                    <th>Discount</th>
                    <th>Net Rate</th>
                    <th>Amount</th>
                    <th>Net Amount</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>Group Name</th>
                    <th>Margin</th>
                    <th>MRP</th>
                    <th>Sales Rate</th>
                    <th>Min Rate</th>
                    <th>Payment Mode</th>
                    <th>Balance Amount</th>
                    <th>Brand</th>
                    <th>Item Code</th>
                    <th>Minimum Rate</th>
                    <th>Location</th>
                    <th>Has Batch</th>
                    <th>Is Active</th>
                    <th>Is FMP</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedData.itemsData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.sl_no}</td>
                      <td>{item.item}</td>
                      <td>{item.qty}</td>
                      <td>{item.uom}</td>
                      <td>{item.rate}</td>
                      <td>{item.discount}</td>
                      <td>{item.netRate}</td>
                      <td>{item.amount}</td>
                      <td>{item.netAmount}</td>
                      <td>{item.cgst}</td>
                      <td>{item.sgst}</td>
                      <td>{item.groupName}</td>
                      <td>{item.margin}</td>
                      <td>{item.MRP}</td>
                      <td>{item.salesRate}</td>
                      <td>{item.minRate}</td>
                      <td>{item.paymentMode}</td>
                      <td>{item.balanceAmount}</td>
                      <td>{item.brand}</td>
                      <td>{item.itemCode}</td>
                      <td>{item.minimumRate}</td>
                      <td>{item.location}</td>
                      <td>{item.hasBatch}</td>
                      <td>{item.isActive}</td>
                      <td>{item.isFMP}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedData(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
    </div>
  );
}

export default Purchase;