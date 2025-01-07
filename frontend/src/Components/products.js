import React, { useState, useEffect, useRef } from "react";
import NavBar from "./NavBar";
import { Container, Row, Col, Form, Table, Button, Modal, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileExport, faPrint, faInfoCircle, faTrashAlt, faHouse, faPowerOff, faUser, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import NewModal from './newProduction';
// import AddSupplier from "./AddSupplier";
import logo from './Images/logo.png';

function Products() {

  const [showModal, setShowModal] = useState(false);
  const [tableData, setTableData] = useState([]);

  const handleModalClose = () => {
    setShowModal(false);
    setShowModalAddSupplier(false);
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

  const [scheme, setScheme] = useState([]);

  useEffect(() => {
    fetchPurchaseData();
  }, []);

  const fetchPurchaseData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/getAllScheme');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setScheme(data);
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
          <b>Product List (Year: 2024-2025)</b>
        </p>
      </div>
      <Container>
        <Row>
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
              <th>Scheme Name</th>
              <th>Barcode</th>
              <th>invoiceDate</th>
              <th>Invoice Number</th>
              <th>isActive</th>
            </tr>
          </thead>
          <tbody>
            {scheme.flatMap((supplier, supplierIndex) =>
              <tr key={`${supplierIndex}`} onClick={() => handleRowClick(supplier)}>
                <td>{supplierIndex + 1}</td>
                <td>{supplier.SchemeName}</td>
                <td>{supplier.barcode  || supplier.schemeBarCode}</td>
                <td>{new Date(supplier.invoiceDate).toLocaleDateString()}</td>
                <td>{supplier.invoiceNumber}</td>
                <td>{supplier.isActive}</td>
              </tr>
            )}
          </tbody>
        </Table>


        <Row className="text-center mt-3">
          <Col xs={2} className="px-1">
            <Button variant="success" size="sm" className="w-50" onClick={() => setShowModal(true)}>
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
                    <th>Item Code</th>
                    <th>Item Name</th>
                    <th>Item Name ml</th>
                    <th>Barcode</th>
                    <th>Quantity</th>
                    <th>Group Name</th>
                    <th>Purchase Rate</th>
                    <th>Sales Rate</th>
                    <th>MRP</th>
                    <th>Minimum Rate</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>Opening Stock</th>
                    <th>UOM</th>
                    <th>Brand</th>
                    <th>Location</th>
                    <th>Expiry Days</th>
                    <th>isService</th>
                    <th>hasBatch</th>
                    <th>hasSerialNo</th>
                    <th>hasWarranty</th>
                    <th>rawMaterials</th>
                    <th>salesItem</th>
                    <th>stockTracking</th>
                    <th>expiredItem</th>
                    <th>FMP</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedData.productsData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.itemCode}</td>
                      <td>{item.itemName}</td>
                      <td>{item.itemNameml}</td>
                      <td>{item.barCode}</td>
                      <td>{item.qty}</td>
                      <td>{item.groupName}</td>
                      <td>{item.purchaseRate}</td>
                      <td>{item.salesRate}</td>
                      <td>{item.mrp}</td>
                      <td>{item.minRate}</td>
                      <td>{item.cgst}</td>
                      <td>{item.sgst}</td>
                      <td>{item.opStock}</td>
                      <td>{item.baseUom}</td>
                      <td>{item.brand}</td>
                      <td>{item.location}</td>
                      <td>{item.expiryDays}</td>
                      <td>{item.isService}</td>
                      <td>{item.hasBatch}</td>
                      <td>{item.hasSerialNo}</td>
                      <td>{item.hasWarranty}</td>
                      <td>{item.rawMaterials}</td>
                      <td>{item.salesItem}</td>
                      <td>{item.stockTracking}</td>
                      <td>{item.expiredItem}</td>
                      <td>{item.FMP}</td>
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
      <NewModal show={showModal} handleClose={handleModalClose} handleSave={handleSaveValue} />
      {/* <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier, supplierIndex) =>
            supplier.purchaseData.map((item, itemIndex) => (
              <tr key={`row-${supplierIndex}-${itemIndex}`}>
                {Object.keys(supplier.purchaseData[0]).map((key) => {
                  if (checkedItems[key]) {
                    return (
                      <td key={`${key}-${itemIndex}`}>{item[key]}</td>
                    );
                  }
                  return null; 
                })}
              </tr>
            ))
          )}
        </tbody>

      </table> */}
      {/* <AddSupplier show={showModalAddSupplier} handleClose={handleModalClose} handleSupplier={handleSupplier} /> */}
      {/* <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Value</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {supplierData.map((data, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{data.supplier}</td>
              <td>{data.purchaseNumber}</td>
              <td>{data.deliveryDate}</td>
              <td>{data.invoiceNumber}</td>
              <td>{data.invoiceDate}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
}

export default Products;