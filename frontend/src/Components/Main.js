import React from 'react'
import NavBar from './NavBar'
import { Button, Container, Row, Col,Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from './Images/logo.png';

function Main() {
  return (
    <div>
        <NavBar/>
        <Container className="mt-5" style={{ marginRight: "100px" }}>
        <Row>
          <Col xs={12} md={6} >
            <Row className="mb-2">
              <Col>
              <Link to='/purchase'>
                <Button  size="md" className="button-color w-100">Purchase</Button>
                </Link>
              </Col>
              <Col>
                <Button  size="md" className="button-color w-100">Purchase Order</Button>
              </Col>
              <Col>
                <Button  size="md" className="button-color w-100">Purchase Return</Button>
              </Col>
            </Row>
            <Row className="mb-2 mt-4">
              <Col>
                <Button  size="md" className=" button-color w-100">Sales Invoice</Button>
              </Col>
              <Col>
                <Button  size="md" className=" button-color w-100">Sales Order</Button>
              </Col>
              <Col>
                <Button  size="md" className="button-color w-100">Quotation</Button>
              </Col>
            </Row>
            <Row className="mb-2 mt-4">
              <Col>
                <Button  size="md" className="button-color w-100">Stock List</Button>
              </Col>
              <Col>
                <Button size="md" className="button-color w-100">Batch List</Button>
              </Col>
              <Col>
                <Button  size="md" className="button-color w-100">Print Barcode</Button>
              </Col>
            </Row>
            <Row className="mb-2 mt-4">
              <Col>
                <Button  size="md" className="button-color w-100">Stock Report</Button>
              </Col>
              <Col>
                <Button  size="md" className="button-color w-100">Purchase Report</Button>
              </Col>
              <Col>
                <Button  size="md" className="button-color w-100">Sales Report</Button>
              </Col>
            </Row>
            <Row>
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th colSpan={4} className=" text-white text-center">Purchase</th>
                </tr>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Main