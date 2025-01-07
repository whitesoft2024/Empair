import React , { useState, useRef  }from "react";
import NavBar from "./NavBar";
import { Container, Row, Col, Form, Table, Button ,Modal, Dropdown} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileExport, faPrint, faInfoCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faHouse, faPowerOff, faUser ,faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function PurchaseReturn() {
  return (
    <div>
        <nav className="navbar navbar-light ">
                <div className="container-fluid">
                    <Link className="navbar-brand ms-5 d-flex align-items-center" to='/main'>
                        <img src={"empireLogo1.ico"} alt="logo" width="100px" className="d-inline-block align-text-top" style={{backgroundColor:"lightgray"}}/>
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
                New Updates : Welcome to EMPAIR MARKETING PVT LTD....Have a nice day....                </marquee>
            </div>
      <NavBar />
      <div className="text-center mt-3" style={{backgroundColor:"lightgrey"}}>
        <p>
          <b>Purchase Return Entry (Year: 2024-2025)</b>
        </p>
      </div>
      <Container>
        <Row>
            <Col sm={4}>
            <Form.Group controlId="input1">
              <Form.Label>Return</Form.Label>
              <Form.Control size="sm" type="text" />
            </Form.Group>
            </Col>
            <Col sm={4}>
            <Form.Group controlId="input1">
              <Form.Label>Date</Form.Label>
              <Form.Control size="sm" type="date" />
            </Form.Group>
            </Col>
            <Col sm={4}>
            <Form.Group controlId="input1">
              <Form.Label>Purchase Manager</Form.Label>
              <Form.Control size="sm" type="number" />
            </Form.Group>
            </Col>
        </Row>
        <Row>
            
            <Col sm={4}>
            <Form.Group controlId="input1">
              <Form.Label>Purchase</Form.Label>
              <Form.Control size="sm" type="text" />
            </Form.Group>
            
            </Col>
        </Row>
        <Row className="mt-3">
        <Col sm={12}>
          <div className="d-flex justify-content-between">
            <Col sm={4}>
              <Form.Group controlId="input1">
                <Form.Label>Invoice#</Form.Label>
                <Form.Control size="sm" type="text" />
              </Form.Group>
            </Col>
            <div className="d-flex">
              <Col sm={4}>
                <Form.Group controlId="input2">
                  <Form.Label>Last Inv. Date</Form.Label>
                  <Form.Control size="sm" type="text" />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group controlId="input3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control size="sm" type="text" />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group controlId="input4">
                  <Form.Label>Outstanding</Form.Label>
                  <Form.Control size="sm" type="text" />
                </Form.Group>
              </Col>
            </div>
          </div>
        </Col>
      </Row>

      <Table striped hover bordered className="mt-4" size="sm">
        <thead>
            <tr>
            <th>Code</th>
            <th>Item</th>
            <th>Bill No.</th>
            <th>Godown</th>
            <th>Qty</th>
            <th>UoM</th>
            <th>Less</th>
            <th>Rate</th>
            <th>Amount</th>
            <th>Net Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
            </tr>
        </tbody>
      </Table>
      <Row className="mt-3">
      <Col>
        <div className="d-flex justify-content-between">
          <Button variant="success" size="sm" >Upload</Button>
          <div className="d-flex">
            <Button variant="secondary" size="sm" style={{ marginRight: '10px' }}>Print</Button>
            <Button variant="secondary" size="sm"  >Save</Button>
          </div>
        </div>
      </Col>
    </Row>
      </Container>
    </div>
  )
}

export default PurchaseReturn