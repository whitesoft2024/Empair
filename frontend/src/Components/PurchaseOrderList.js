import React, { useState, useRef } from "react";
import NavBar from "./NavBar";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Button,
  Modal,
  Dropdown,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faFileExport,
  faPrint,
  faInfoCircle,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHouse,
  faPowerOff,
  faUser,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logo from './Images/logo.png';

function PurchaseOrderList() {
  return (
    <div>
      <nav className="navbar navbar-light ">
        <div className="container-fluid">
          <Link
            className="navbar-brand ms-5 d-flex align-items-center"
            to="/main"
          >
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
              {/* <ul className="list-unstyled mb-1 me-5">
                                <li className="me-2">: {user ? user.employee.fullname : 'N/A'}</li>
                                <li className="me-2">: {user ? user.branchDetails.branch_name : 'N/A'}</li>
                                <li className="me-2">: {user ? user.branchDetails.branchCode : 'N/A'}</li>
                                <li className="me-2">: {currentDate.toLocaleString()}</li>
                            </ul> */}
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
          <b>Purchase Order List (Year: 2024-2025)</b>
        </p>
      </div>
      <Container>
        <Row>
          <Col sm={4}>
            <Form.Group controlId="input1">
              <Form.Label>Date From</Form.Label>
              <Form.Control size="sm" type="date" />
            </Form.Group>
          </Col>
          <Col sm={4}>
            <Form.Group controlId="input1">
              <Form.Label>Order No</Form.Label>
              <Form.Control size="sm" type="number" />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <Form.Group controlId="input1">
              <Form.Label>To</Form.Label>
              <Form.Control size="sm" type="date" />
            </Form.Group>
          </Col>
          <Col sm={4}>
            <Form.Group controlId="input1">
              <Form.Label>Supplier</Form.Label>
              <Form.Control size="sm" type="text" />
            </Form.Group>
          </Col>
        </Row>

        <Table striped hover bordered className="mt-4" size="sm">
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Order No</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Supplier</th>
            </tr>
          </thead>
          <tbody>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tbody>
        </Table>

        <Row className="text-center mt-3">
      <Col xs={2} className="px-1">
        <Button variant="success" size="sm" className="w-50" >
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
      <Col xs={{ span: 2, offset: 2}} className="px-1 w-40">
        <Button variant="secondary" size="sm">
          <FontAwesomeIcon icon={faTrashAlt} /> Delete
        </Button>
      </Col>
    </Row>
      </Container>
    </div>
  );
}

export default PurchaseOrderList;
