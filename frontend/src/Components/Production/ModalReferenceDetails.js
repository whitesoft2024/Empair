import React from "react";
import { Modal, Table, Button } from "react-bootstrap";
import { Toaster, toast } from 'sonner'

function ModalReferenceDetails({ show, handleClose, searchRef, customerDetails }) {

    const {referenceId } = customerDetails;
    const filteredReferences = searchRef.filter(ref => ref.customerName);

    const otherCustomers = filteredReferences.map(ref => ({
        _id: ref._id,
        referenceName:ref.customerName,
        referenceNumber:ref.customerMobile,
        referenceId:ref.referenceId,
        schemePurchaseId:ref.schemePurchaseId,
        referenceAmount: ref.referenceAmount || 'N/A', 
    }));
    

    // Handle the button click to send data
const handleSendData = async () => {
    try {
        // Prepare the data to send
        const dataToSend = {
            customerDetails,
            otherCustomers,
        };

        console.log("Sending data:", JSON.stringify(dataToSend));

        // Send data to the backend
        const response = await fetch("http://localhost:4000/svv/addRefDetails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        });

        // Check if the response status indicates the request was already sent
        if (response.status === 400) {
            const errorData = await response.json();
            if (errorData.message === "Request already sent.") {
                // Show toast if the request was already sent
                toast.error("This request has already been sent.");
                return;
            }
            throw new Error(errorData.message || "Failed to send data.");
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Show success toast
        toast.success("Data sent successfully!");
        handleClose();
    } catch (error) {
        console.error("Error sending customer details:", error);
        if (error instanceof Error) {
            console.error("Error message:", error.message);
        }

        // Show error toast for general failure
        toast.error("Failed to send data. Please try again.");
    }
};


    return (
        <div>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{referenceId} Reference Details </Modal.Title>

                    <Button
                        variant="primary"
                        onClick={handleSendData}
                    >Send</Button>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover responsive size="sm">
                        <thead>
                            <tr>
                                <th>Sl_No</th>
                                <th>Customer Name</th>
                                <th>Reference Name</th>
                                <th>Reference ID</th>
                                <th>Customer Mobile</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredReferences.map((ref, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{ref.customerName || 'N/A'}</td>
                                        <td>{ref.referenceName || 'N/A'}</td>
                                        <td>{ref.referenceId || 'N/A'}</td>
                                        <td>{ref.customerMobile || 'N/A'}</td>
                                        <td>{ref.referenceAmount || 'N/A'}</td>
                                    </tr>
                                ))
                            }
                        </tbody>

                    </Table>
                </Modal.Body>
            </Modal>
            <Toaster />
        </div>
    );
}

export default ModalReferenceDetails;