import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import logo from './Images/logo.png';

function AddSupplier({ show, handleClose, handleSupplier }) {
  const [formData, setFormData] = useState({
    supplierName: "",
    phoneNumber: "",
    mobileNumber: "",
    address: "",
    emailId: "",
    website: "",
    city: "",
    pinCode: "",
    panNo: "",
    priceList: "",
    country: "",
    opening: "",
    loyalityNo: "",
    GSTno: "",
    dueDays: "",
    formalName: "",
    openBill: "",
    bank: "",
    isActive: false,
    allowCredit: false
  });

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handlePost = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/addSupplier", formData);
      console.log("Supplier data saved successfully", response.data);
      handleSupplier(response.data); // Optionally handle the response data
    } catch (error) {
      console.error("There was an error saving the supplier data!", error);
    }

    handleClose();
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Add Supplier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ border: "1px solid black", padding: "15px" }}>
            <div
              className="text-center mt-3"
              style={{ backgroundColor: "lightgrey" }}
            >
              <p>
                <b>Add Supplier</b>
              </p>
            </div>
            <Row>
              <Col sm={4}>
                <Form.Group controlId="formSupplier">
                  <Form.Label>Supplier</Form.Label>
                  <Form.Control
                    type="text"
                    name="supplierName"
                    placeholder="Enter supplier name"
                    value={formData.supplierName}
                    onChange={handleInputChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group controlId="formPhoneNumber">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="number"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group controlId="formMobileNumber">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobileNumber"
                    placeholder="Enter Mobile number"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <Form.Group controlId="formAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    placeholder="Enter Address"
                    onChange={handleInputChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group controlId="formEmailId">
                  <Form.Label>Email ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="emailId"
                    value={formData.emailId}
                    placeholder="Enter EmailID"
                    onChange={handleInputChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group controlId="formWebsite">
                  <Form.Label>Website</Form.Label>
                  <Form.Control
                    type="text"
                    name="website"
                    value={formData.website}
                    placeholder="Enter Website"
                    onChange={handleInputChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <Form.Group controlId="formCity">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    placeholder="Enter City"
                    onChange={handleInputChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group controlId="formPinCode">
                  <Form.Label>PinCode</Form.Label>
                  <Form.Control
                    type="number"
                    name="pinCode"
                    value={formData.pinCode}
                    placeholder="Enter PinCode"
                    onChange={handleInputChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group controlId="formPanNo">
                  <Form.Label>PAN No</Form.Label>
                  <Form.Control
                    type="text"
                    name="panNo"
                    value={formData.panNo}
                    placeholder="Enter PAN number"
                    onChange={handleInputChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <Form.Group controlId="formCountry">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col sm={4}></Col>
              <Col sm={4}>
                <Form.Group controlId="formPriceList">
                  <Form.Label>Price List</Form.Label>
                  <Form.Control
                    type="text"
                    name="priceList"
                    value={formData.priceList}
                    onChange={handleInputChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <Form.Group controlId="formLoyalityNo">
                  <Form.Label>Loyality No</Form.Label>
                  <Form.Control
                    type="text"
                    name="loyalityNo"
                    value={formData.loyalityNo}
                    onChange={handleInputChange}
                    placeholder="Enter Loyality Number"
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group controlId="formOpPoint">
                  <Form.Label>GST Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="GSTno"
                    value={formData.GSTno}
                    placeholder="Enter Op GST number"
                    onChange={handleInputChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group controlId="formOpening">
                  <Form.Label>Opening</Form.Label>
                  <Form.Control
                    type="text"
                    name="opening"
                    value={formData.opening}
                    onChange={handleInputChange}
                    placeholder="Enter Opening"
                    size="sm"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <Form.Group controlId="formFormalName">
                  <Form.Label>Formal Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="formalName"
                    value={formData.formalName}
                    onChange={handleInputChange}
                    placeholder="Enter Formal Name"
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group controlId="formDueDays">
                  <Form.Label>Due Days</Form.Label>
                  <Form.Control
                    type="text"
                    name="dueDays"
                    value={formData.dueDays}
                    onChange={handleInputChange}
                    placeholder="Enter Due Days"
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group controlId="formOpenBill">
                  <Form.Label>Open Bill</Form.Label>
                  <Form.Select
                    name="openBill"
                    value={formData.openBill}
                    onChange={handleInputChange}
                    size="sm"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <Form.Group controlId="formBank">
                  <Form.Label>Bank</Form.Label>
                  <Form.Control
                    type="text"
                    name="bank"
                    value={formData.bank}
                    onChange={handleInputChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group controlId="formCheckboxes" className="d-flex align-items-center mt-4">
                  <Form.Check
                    type="checkbox"
                    label="IsActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <Form.Check
                    type="checkbox"
                    label="Allow Credit"
                    name="allowCredit"
                    checked={formData.allowCredit}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="text-center mt-3">
              <Col className="px-1">
                <Button variant="success" size="sm" onClick={handlePost}>
                  Save
                </Button>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddSupplier;