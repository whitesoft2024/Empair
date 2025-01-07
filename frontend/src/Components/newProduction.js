import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap";
import { faPlus, faEdit, faTimes, faSave} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import AddSupplier from "./AddSupplier";
import { Toaster, toast } from 'sonner'

function NewProduction({ show, handleClose }) {
    const initialFormData = {
        supplierName: '',
        billNumber: '',
        invoiceDate: '',
        sl_no: '',
        itemName: '',
        itemNameml: '',
        itemDescription: '',
        qty: '',
        uom: '',
        baseUom: '',
        rate: '',
        cgst: '',
        sgst: '',
        schemeBarCode: '',
        barCode: '',
        discount: '',
        netRate: '',
        amount: '',
        netAmount: '',
        groupName: '',
        margin: '',
        salesRate: '',
        paymentMode: '',
        tenderedAmount: '',
        balanceAmount: '',
        discountAmount: '',
        SchemeName: '',
        itemCode: '',
        minRate: '',
        minStock: '',
        location: '',
        hasBatch: '',
        isActive: '',
        isFMP: '',
        id: '',
        mrp: '',
        isService: '',
        hasBatch: '',
        hasSerialNo: '',
        hasWarranty: '',
        rawMaterials: '',
        salesItem: '',
        stockTracking: '',
        expiredItem: '',
        FMP: '',
    };
    const [formData, setFormData] = useState(initialFormData);
    const [scheme, setScheme] = useState([]);
    const [selectedScheme, setSelectedScheme] = useState('');
    const [showModalScheme, setShowModalScheme] = useState(false);
    const handleShowModalScheme = () => setShowModalScheme(true);
    const handleCloseModalScheme = () => setShowModalScheme(false);
    const [productinvoiceCounter, setProductInvoiceCounter] = useState(() => {
        const savedInvoiceCounter = localStorage.getItem('productinvoiceCounter');
        return savedInvoiceCounter !== null ? parseInt(savedInvoiceCounter, 10) : 1000;
    });

    useEffect(() => {
        // Initialize the invoice number on component mount
        setFormData((prevState) => ({
            ...prevState,
            invoiceNumber: `PROIN${productinvoiceCounter}`,
        }));
    }, [productinvoiceCounter]);


    useEffect(() => {
        fetchSchmeName();
    }, [setShowModalScheme]);

    const handleSchemeSubmit = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/addScheme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            toast.success('Products Added!!!')
            fetchSchmeName();
            handleCloseModalScheme();
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
    };
    useEffect(() => {
        fetchSchmeName();
    }, []);

    const fetchSchmeName = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/getAllScheme');
            if (!response.ok) {
                throw new Error('Failed to fetch suppliers');
            }
            const data = await response.json();
            setScheme(data);
        } catch (error) {
            console.error(error);
        }
    };



    const handleInputChange = (e) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };


    useEffect(() => {
        if (formData.qty && formData.rate) {
            const netRate = parseFloat(formData.qty) * parseFloat(formData.rate);
            setFormData((prevState) => ({
                ...prevState,
                netRate: netRate.toFixed(2),
            }));
        }
    }, [formData.qty, formData.rate]);

    useEffect(() => {
        if (formData.cgst && formData.sgst && formData.netRate) {
            const amount = parseFloat(formData.netRate) + parseFloat(formData.cgst) + parseFloat(formData.sgst);
            setFormData((prevState) => ({
                ...prevState,
                amount: amount.toFixed(2), // Assuming you want 2 decimal places
            }));
        }
    }, [formData.cgst, formData.sgst, formData.netRate]);

    useEffect(() => {
        if (formData.amount && formData.discount) {
            const discountedAmount = parseFloat(formData.amount) - parseFloat(formData.discount);
            setFormData((prevState) => ({
                ...prevState,
                netAmount: discountedAmount.toFixed(2), // Assuming you want 2 decimal places
            }));
        }
    }, [formData.amount, formData.discount]);

    useEffect(() => {
        if (formData.margin && formData.rate) {
            const mrp = parseFloat(formData.rate) * (1 + parseFloat(formData.margin) / 100);
            setFormData((prevState) => ({
                ...prevState,
                salesRate: mrp.toFixed(2),
            }));
        }
    }, [formData.margin, formData.rate]);


    const [showModalAddSupplier, setShowModalAddSupplier] = useState(false);

    const handleModalClose = () => {
        setShowModalAddSupplier(false);
    };

    const [showItemUpdateModal, setShowItemUpdateModal] = useState(false);
    const [items, setItems] = useState([]);

    const handleDeleteItem = (index) => {
        setItems((prevItems) => prevItems.filter((item, i) => i !== index));
        setItemsNew((prevItems) => prevItems.filter((item, i) => i !== index));
    };

    const [addItems, setAddItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState("");

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/getItems");
            if (!response.ok) {
                throw new Error("Failed to fetch suppliers");
            }
            const data = await response.json();
            setAddItems(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSchemeChange = (event) => {
        const selectScheme = event.target.value;
        const selectedSupplierDetails = scheme.find(schemes => schemes.SchemeName === selectScheme);
        setSelectedScheme(selectScheme);
        setFormData((prevState) => ({
            ...prevState,
            id: selectedSupplierDetails._id,
        }));
    };


    const handleItemChange = async (event) => {
        const selectedItem = event.target.value;
        const itemDetails = addItems.find((item) => item.itemName === selectedItem);
        console.log(itemDetails);
        setSelectedItem(selectedItem);
        if (itemDetails) {
            setFormData((prevState) => ({
                ...prevState,
                itemCode: itemDetails.itemCode,
                barCode: itemDetails.barCode,
                itemName: selectedItem,
                itemNameml: itemDetails.itemNameml,
                groupName: itemDetails.groupName,
                purchaseRate: itemDetails.purchaseRate,
                salesRate: itemDetails.salesRate,
                mrp: itemDetails.mrp,
                minRate: itemDetails.minRate,
                sgst: itemDetails.sgst,
                cgst: itemDetails.cgst,
                opStock: itemDetails.opStock,
                baseUom: itemDetails.baseUom,
                brand: itemDetails.brand,
                location: itemDetails.location,
                expiryDays: itemDetails.expiryDays,
                isService: itemDetails.isService,
                hasBatch: itemDetails.hasBatch,
                hasSerialNo: itemDetails.hasSerialNo,
                hasWarranty: itemDetails.hasWarranty,
                rawMaterials: itemDetails.rawMaterials,
                salesItem: itemDetails.salesItem,
                stockTracking: itemDetails.stockTracking,
                expiredItem: itemDetails.expiredItem,
                FMP: itemDetails.FMP,
            }));
        }
    };

    const handleInputChangeNew = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const [itemsNew, setItemsNew] = useState([]);

    const handleAddItemTable = () => {
        const newItem = { ...formData };
        setItemsNew((prevItems) => [...prevItems, newItem]);
        // Clear the form data after adding
        setFormData({
            isActive: formData.isActive,
            invoiceNumber: formData.invoiceNumber,
            schemeBarCode: formData.schemeBarCode,
            invoiceDate: formData.invoiceDate,
            sl_no: formData.sl_no,
            itemName: formData.itemName,
            itemDescription: formData.itemDescription,
            qty: formData.qty,
            uom: formData.uom,
            baseUom: formData.baseUom,
            brand: formData.brand,
            location: formData.location,
            purchaseRate: formData.purchaseRate,
            discount: formData.discount,
            netRate: formData.netRate,
            amount: formData.amount,
            netAmount: formData.netAmount,
            purchaseNumber: formData.purchaseNumber,
            deliveryDate: formData.deliveryDate,
            cgst: formData.cgst,
            sgst: formData.sgst,
            groupName: formData.groupName,
            isFMP: formData.isFMP,
            itemCode: formData.itemCode,
            salesRate: formData.salesRate,
            id: formData.id,
            barCode: formData.barCode,
            itemNameml: formData.itemNameml,
            groupName: formData.groupName,
            purchaseRate: formData.purchaseRate,
            salesRate: formData.salesRate,
            mrp: formData.mrp,
            minRate: formData.minRate,
            sgst: formData.sgst,
            cgst: formData.cgst,
            opStock: formData.opStock,
            brand: formData.brand,
            location: formData.location,
            expiryDays: formData.expiryDays,
            isService: formData.isService,
            hasBatch: formData.hasBatch,
            hasSerialNo: formData.hasSerialNo,
            hasWarranty: formData.hasWarranty,
            rawMaterials: formData.rawMaterials,
            salesItem: formData.salesItem,
            stockTracking: formData.stockTracking,
            expiredItem: formData.expiredItem,
            FMP: formData.FMP,
        });
        setSelectedItem('');
    };

    const handleSubmit = async () => {
        try {
            const requestBody = {
                ...formData,
                items: itemsNew, // Include the itemsNew array in the request body
            };
            console.log("Submitting formData:", requestBody);
            const response = await axios.post('http://localhost:4000/api/addProducts', requestBody);
            toast.success('Products Added!!!')
            const nextInvoiceCounter = productinvoiceCounter + 1;
            setProductInvoiceCounter(nextInvoiceCounter);
            localStorage.setItem('productinvoiceCounter', nextInvoiceCounter.toString());
            setFormData({ ...initialFormData });
            setSelectedScheme('');
            setSelectedItem('');
            setItemsNew([]);
            handleCloseModalScheme(); // Assuming you want to close the modal after successful submission
            if (!response.ok) {
                throw new Error('Network response was not ok');
                toast.error('got an error')
            }
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
            
        }
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <div style={{ border: "1px solid black", padding: "15px" }}>
                        <div
                            className="text-center mt-3"
                            style={{ backgroundColor: "lightgrey" }}
                        >
                            <p>
                                <b>Product List 5000 (Year: 2024-2025)</b>
                            </p>
                        </div>
                        <Row>
                            <Col sm={4}>
                                <Form.Group controlId="formSupplier">
                                    <Form.Label>Product Schme</Form.Label>
                                    <Form.Select value={selectedScheme} onChange={handleSchemeChange} size="sm">
                                        <option value="">Select a Scheme</option>
                                        {scheme.map((brand, index) => (
                                            <option key={index} value={brand.SchemeName}>{brand.SchemeName}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <div className="d-flex justify-content-center mt-1">
                                    <Button
                                        variant="success"
                                        size="sm"
                                        className="mx-2"
                                        onClick={handleShowModalScheme}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Button>
                                    <Button variant="secondary" size="sm" className="mx-2">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Button>
                                </div>
                            </Col>
                            <Col sm={4}>
                                <Form.Group controlId="formInvoiceNumber">
                                    <Form.Label>Product Invoice</Form.Label>
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        placeholder="Enter invoice number"
                                        name="invoiceNumber"
                                        value={formData.invoiceNumber}
                                        onChange={handleInputChange}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={4}>
                                <Form.Group controlId="formBarcode">
                                    <Form.Label>Barcode</Form.Label>
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        placeholder="Enter barCode"
                                        name="schemeBarCode"
                                        value={formData.schemeBarCode}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={4}>
                                <Form.Group controlId="formInvoiceDate">
                                    <Form.Label>Production Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        size="sm"
                                        name="invoiceDate"
                                        value={formData.invoiceDate}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={4}>
                                <Form.Group controlId="formInvoiceDate">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        name="itemDescription"
                                        placeholder="Enter description"
                                        value={formData.itemDescription}
                                        onChange={handleInputChangeNew}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={4}>

                            </Col>
                        </Row>

                        <Table striped hover className="mt-4" size="sm">
                            <thead
                                style={{ backgroundColor: "lightgrey", textAlign: "center" }}
                            >
                                <tr>
                                    <th>SL No</th>
                                    <th>Item</th>
                                    <th>QTY</th>
                                    <th>UoM</th>
                                    <th>PRate</th>
                                    <th>cgst</th>
                                    <th>sgst</th>
                                    <th>sales Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            size="sm"
                                            name="sl_no"
                                            readOnly
                                            placeholder="Enter item"
                                            value={formData.sl_no}
                                            onChange={handleInputChangeNew}
                                        />
                                    </td>
                                    <td>
                                        <Form.Select
                                            value={selectedItem}
                                            onChange={handleItemChange}
                                            size="sm"
                                        >
                                            <option value="">Select a item Name</option>
                                            {addItems.map((item, index) => (
                                                <option key={index} value={item.itemName}>
                                                    {item.itemName}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            size="sm"
                                            name="qty"
                                            placeholder="Enter quantity"
                                            value={formData.qty}
                                            onChange={handleInputChangeNew}
                                        />
                                    </td>
                                    <td>
                                        <Form.Control
                                            type="text"
                                            size="sm"
                                            name="baseUom"
                                            placeholder="Enter UoM"
                                            readOnly
                                            value={formData.baseUom}
                                            onChange={handleInputChangeNew}
                                        />
                                    </td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            size="sm"
                                            name="rate"
                                            readOnly
                                            placeholder="Enter rate"
                                            value={formData.purchaseRate}
                                            onChange={handleInputChangeNew}
                                        />
                                    </td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            size="sm"
                                            name="cgst"
                                            placeholder="cgst"
                                            readOnly
                                            value={formData.cgst}
                                            onChange={handleInputChangeNew}
                                        />
                                    </td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            size="sm"
                                            name="sgst"
                                            placeholder="sgst"
                                            readOnly
                                            value={formData.sgst}
                                            onChange={handleInputChangeNew}
                                        />
                                    </td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            size="sm"
                                            name="salesRate"
                                            placeholder="salesRate"
                                            readOnly
                                            value={formData.salesRate}
                                            onChange={handleInputChangeNew}
                                        />
                                    </td>
                                    
                                    <td>
                                        <Button variant="success" size="sm">
                                            <FontAwesomeIcon
                                                icon={faPlus}
                                                onClick={handleAddItemTable} />
                                        </Button>
                                    </td>
                                </tr>
                                {itemsNew.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{item.itemName}</td>
                                        <td>{item.qty}</td>
                                        <td>{item.baseUom}</td>
                                        <td>{item.purchaseRate}</td>
                                        <td>{item.cgst}</td>
                                        <td>{item.sgst}</td>
                                        <td>{item.salesRate}</td>
                                        <td>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteItem(index)}
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Row className="text-center mt-3">
                            <Col xs={3} className="px-1">
                                <Button variant="secondary" size="sm" className="w-50">
                                    Purchase Order
                                </Button>
                            </Col>
                            <Col xs={3} className="px-1">
                                <Button variant="secondary" size="sm" className="w-50">
                                    Receipt Note
                                </Button>
                            </Col>
                            <Col xs={3} className="px-1">
                                <Button variant="secondary" size="sm" className="w-50">
                                    Update
                                </Button>
                            </Col>
                            <Col xs={3} className="px-1">
                                <Button variant="secondary" size="sm" className="w-50">
                                    Print
                                </Button>
                            </Col>
                            <Col xs={{ span: 2, offset: 5 }} className="px-1">
                                <Button variant="success" size="sm" onClick={handleSubmit}>
                                    <FontAwesomeIcon icon={faSave} /> Save
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={showModalScheme} onHide={handleCloseModalScheme}>
                <Modal.Header closeButton>
                    <Modal.Title>Scheme Name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Modal content */}

                    <Row>
                        <Col sm={9}>
                            <Form.Group controlId="brandName">
                                <Form.Label>Scheme Name</Form.Label>
                                <Form.Control size="sm" type="text" name="SchemeName" value={formData.SchemeName} onChange={handleInputChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Check
                                type="checkbox"
                                label="Is Active"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                            />

                        </Col>
                    </Row>
                    <Row className="text-center mt-3">
                        <Col className="px-1">
                            <Button variant="success" size="sm" onClick={handleSchemeSubmit}>
                                <FontAwesomeIcon icon={faSave} /> Save
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
            <AddSupplier show={showModalAddSupplier} handleClose={handleModalClose} />

            <Toaster position="top-center" expand={true} richColors />
        </div>
    );
}

export default NewProduction;
