import React from "react";
import { Modal,Table } from "react-bootstrap";

function ModalReferenceDetails({ show, handleClose, searchRef }) {
    
    return (
        <div>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Reference Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover responsive size="sm">
                        <thead>
                            <tr>
                                <th>Sl_No</th>
                                <th>Customer Name</th>
                                <th>Reference ID</th>
                                <th>Reference Name</th>
                                <th>Phone Number</th>
                                {/* Add other columns as needed */}
                            </tr>
                        </thead>
                        <tbody>
                            {searchRef.map((customer, index) => (
                                <tr key={index}>
                                    <td>{index++ }</td>
                                    <td>{customer.customerName }</td>
                                    <td>{customer.referenceId}</td>
                                    <td>{customer.referenceName}</td>
                                    <td>{customer.customerMobile}</td>
                                    {/* Add other fields as needed */}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ModalReferenceDetails
