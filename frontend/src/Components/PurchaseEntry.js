import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap";
import { faPlus, faEdit, faTimes, faSave } from "@fortawesome/free-solid-svg-icons";
import AddSupplier from "./AddSupplier";


function NewModal({ show, handleClose }) {
  const initialFormData = {
    supplierName: '',
    billNumber: '',
    invoiceDate: '',
    sl_no: '',
    barcode: '',
    item: '',
    itemDescription: '',
    qty: '',
    uom: '',
    rate: '',
    cgst: '',
    sgst: '',
    discount: '',
    netRate: '',
    amount: '',
    netAmount: '',
    groupName: '',
    margin: '',
    MRP: '',
    salesRate: '',
    minRate: '',
    paymentMode: '',
    tenderedAmount: '',
    balanceAmount: '',
    discountAmount: '',
    brand: '',
    itemCode: '',
    minimumRate: '',
    minStock: '',
    location: '',
    hasBatch: '',
    isActive: '',
    isFMP: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
  const [showPurPayModal, setShowPurPayModal] = useState(false);
  const [items, setItems] = useState([]);
  
  const [invoiceCounter, setInvoiceCounter] = useState(() => {
    const savedInvoiceCounter = localStorage.getItem('invoiceCounter');
    return savedInvoiceCounter !== null ? parseInt(savedInvoiceCounter, 10) : 1000;
  });
  const [purchaseCounter, setPurchaseCounter] = useState(() => {
    const savedPurchaseCounter = localStorage.getItem('purchaseCounter');
    return savedPurchaseCounter !== null ? parseInt(savedPurchaseCounter, 10) : 100000;
  });

  const resetCounters = () => {
    localStorage.removeItem('invoiceCounter');
    localStorage.removeItem('purchaseCounter');
    setInvoiceCounter(1000);
    setPurchaseCounter(100000);
  };  

  const handleAddItem = () => {
    setItems([...items, formData]);
    setFormData({
      sl_no: formData.sl_no,
      item: formData.item,
      itemDescription: formData.itemDescription,
      qty: formData.qty,
      uom: formData.uom,
      barcode: formData.barcode,
      rate: formData.rate,
      discount: formData.discount,
      netRate: formData.netRate,
      amount: formData.amount,
      netAmount: formData.netAmount,
      supplierName: formData.supplierName,
      purchaseNumber: formData.purchaseNumber,
      deliveryDate: formData.deliveryDate,
      invoiceNumber: formData.invoiceNumber,
      invoiceDate: formData.invoiceDate,
      cgst: formData.cgst,
      sgst: formData.sgst,
      groupName: formData.groupName,
      margin: formData.margin,
      MRP: formData.MRP,
      salesRate: formData.salesRate,
      minRate: formData.minRate,
      paymentMode: formData.paymentMode,
      tenderedAmount: formData.tenderedAmount,
      balanceAmount: formData.balanceAmount,
      discountAmount: formData.discountAmount,
      selectedSupplierId: formData.selectedSupplierId,
      brand: formData.brand,
      itemCode: formData.itemCode,
      minimumRate: formData.minRate,
      minStock: formData.minStock,
      location: formData.location,
      hasBatch: formData.hasBatch,
      isActive: formData.isActive,
      isFMP: formData.FMP,
    });
    setShowPurPayModal(false);
    setShowItemUpdateModal(false);

  };

  const handleDeleteItem = (index) => {
    setItems((prevItems) => prevItems.filter((item, i) => i !== index));
  };

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");

  useEffect(() => {
    fetchSuppliers();
    const intervalId = setInterval(fetchSuppliers, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/getAllSuppliers");
      if (!response.ok) {
        throw new Error("Failed to fetch suppliers");
      }
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error(error);
    }
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

  const handleSupplierChange = (event) => {
    const selectedSupplier = event.target.value;
    const selectedSupplierDetails = suppliers.find(supplier => supplier.supplierName === selectedSupplier);
    setSelectedSupplier(selectedSupplier);
    setSelectedSupplierId(selectedSupplierDetails._id);
    setFormData((prevState) => ({
      ...prevState,
      supplierName: selectedSupplier,
      selectedSupplierId: selectedSupplierDetails._id,
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
        item: selectedItem,
        uom: itemDetails.baseUom,
        rate: itemDetails.purchaseRate,
        groupName: itemDetails.groupName,
        brand: itemDetails.brand,
        itemCode: itemDetails.itemCode,
        minimumRate: itemDetails.minRate,
        minStock: itemDetails.minStock,
        location: itemDetails.location,
        hasBatch: itemDetails.hasBatch,
        isFMP: itemDetails.FMP,
        isActive: itemDetails.isActive,
      }));
    }
  };

  useEffect(() => {
    // Initialize the invoice number on component mount
    setFormData((prevState) => ({
      ...prevState,
      invoiceNumber: `PIN${invoiceCounter}`,
      purchaseNumber: `P${purchaseCounter}`,
    }));
  }, [invoiceCounter,purchaseCounter]);

  const handleSubmit = async (e) => {
    // e.preventDefault();
  
    if (!selectedSupplierId) {
      alert("Please select a supplier.");
      return;
    }
  
    const { purchaseNumber, deliveryDate, invoiceNumber, itemDescription, invoiceDate, barcode } = formData;
  
    const purchaseDetails = { purchaseNumber, deliveryDate, invoiceNumber, itemDescription, invoiceDate, barcode };
  
    const itemsData = items;
    try {
      const response = await fetch('http://localhost:4000/api/purchaseData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedSupplierId, purchaseDetails, itemsData }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      console.log('Data submitted successfully');
      const nextInvoiceCounter = invoiceCounter + 1;
      const nextPurchaseCounter = purchaseCounter + 1;
      setInvoiceCounter(nextInvoiceCounter);
      setPurchaseCounter(nextPurchaseCounter);
      localStorage.setItem('invoiceCounter', nextInvoiceCounter.toString());
      localStorage.setItem('purchaseCounter', nextPurchaseCounter.toString());
      alert('Data submitted successfully!');
      setFormData(initialFormData);
      setItems([]);
      setShowPurPayModal(false);
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };
  const handlePlusButtonClick = () => {
    const formControls = document.querySelectorAll('table tr:first-child input, table tr:first-child select');
    let allFilled = true;
  
    formControls.forEach(control => {
      if (control.type !== 'hidden' && control.value.trim() === '') {
        allFilled = false;
      }
    });
  
    if (allFilled) {
      setShowItemUpdateModal(true);
    } else {
      window.alert('Please select/fill all boxes before proceeding.');
    }
  };
  const validateFields = () => {
    const requiredFields = [
      'rate',
      'margin',
      'MRP',
      'salesRate',
      'minRate',
      'item'
    ];
  
    for (let field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        window.alert(`Please fill all required fields. ${field} cannot be empty.`);
        return false;
      }
    }
  
    return true;
  };
  
  
  const calculateTotalNetAmount = () => {
    return items.reduce((total, item) => total + parseFloat(item.netAmount || 0), 0);
  };
  

  const calculateBalance = () => {
    const tenderedAmount = parseFloat(formData.tenderedAmount || 0);
    const discountAmount = parseFloat(formData.discountAmount || 0);
    const totalNetAmount = calculateTotalNetAmount();
    
    return tenderedAmount - totalNetAmount + discountAmount;
  };
  
  const validatePaymentFields = () => {
    const requiredFields = [
      'paymentMethod',
      'payMethod',
      'tenderedAmount',
      'discountAmount'
    ];
  
    for (let field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        window.alert(`Please fill all required fields. ${field} cannot be empty.`);
        return false;
      }
    }
  
    return true;
  };
  
  const handlePaymentSubmit = () => {
    if (validatePaymentFields()) {
      // Proceed with payment processing
      handleSubmit(); // Assuming this function handles the actual payment logic
      setFormData(initialFormData); // Reset form data
      setShowPurPayModal(false);
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
                <b>Purchase Entry (Year: 2024-2025)</b>
              </p>
            </div>
            <Row>
              <Col sm={4}>
                <Form.Group controlId="formSupplier">
                  <Form.Label>Suppliers</Form.Label>
                  <Form.Select value={selectedSupplier} onChange={handleSupplierChange} size="sm">
                    <option value="">Select a supplier</option>
                    {suppliers.map((supplier, index) => (
                      <option key={index} value={supplier.supplierName}>
                        {supplier.supplierName}
                      </option>
                    ))}
                  </Form.Select>
                  {selectedSupplier && <p>You selected: {selectedSupplier}</p>}
                </Form.Group>
                <div className="d-flex justify-content-center mt-1">
                  <Button
                    variant="success"
                    size="sm"
                    className="mx-2"
                    onClick={() => setShowModalAddSupplier(true)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                  <Button variant="secondary" size="sm" className="mx-2">
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                </div>
              </Col>
              <Col sm={4}>
                <Form.Group controlId="formPurchaseNumber">
                  <Form.Label>Purchase#</Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    placeholder="Enter purchase number"
                    name="purchaseNumber"
                    value={formData.purchaseNumber}
                    onChange={handleInputChange}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col sm={4}>
                <Form.Group controlId="formDeliveryDate">
                  <Form.Label>Del.Date</Form.Label>
                  <Form.Control
                    type="date"
                    size="sm"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group controlId="formInvoiceNumber">
                  <Form.Label>Invoice#</Form.Label>
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
              <Col sm={4}>
                <Form.Group controlId="formInvoiceDate">
                  <Form.Label>Inv.Date</Form.Label>
                  <Form.Control
                    type="date"
                    size="sm"
                    name="invoiceDate"
                    value={formData.invoiceDate}
                    onChange={handleInputChange}
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
                    placeholder="Enter barcode"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
              <td>
              <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      size="sm"
                      name="itemDescription"
                      placeholder="Enter description"
                      value={formData.itemDescription}
                      onChange={handleInputChange}
                    />
                  </td>
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
                  <th>Discount</th>
                  <th>Net Rate</th>
                  <th>Amount</th>
                  <th>Net Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Form.Control
                      type="number"
                      size="sm"
                      name="sl_no"
                      placeholder="Enter item"
                      value={formData.sl_no}
                      onChange={handleInputChange}
                      required
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
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      size="sm"
                      name="uom"
                      placeholder="Enter UoM"
                      value={formData.uom}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      size="sm"
                      name="rate"
                      placeholder="Enter rate"
                      value={formData.rate}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      size="sm"
                      name="cgst"
                      placeholder="cgst"
                      value={formData.cgst}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      size="sm"
                      name="sgst"
                      placeholder="sgst"
                      value={formData.sgst}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      size="sm"
                      name="discount"
                      placeholder="Enter discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      size="sm"
                      name="netRate"
                      placeholder="Enter net rate"
                      value={formData.netRate}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      size="sm"
                      name="amount"
                      placeholder="Enter amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      size="sm"
                      name="netAmount"
                      placeholder="Enter net amount"
                      value={formData.netAmount}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <Button variant="success" size="sm">
                      <FontAwesomeIcon
                        icon={faPlus}
                        onClick={handlePlusButtonClick}
                        // onClick={() => setShowItemUpdateModal(true)}
                      />
                    </Button>
                  </td>
                </tr>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.sl_no}</td>
                    <td>{item.item}</td>
                    <td>{item.itemDescription}</td>
                    <td>{item.qty}</td>
                    <td>{item.uom}</td>
                    <td>{item.rate}</td>
                    <td>{item.cgst}</td>
                    <td>{item.sgst}</td>
                    <td>{item.discount}</td>
                    <td>{item.netRate}</td>
                    <td>{item.amount}</td>
                    <td>{item.netAmount}</td>
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
                <Button variant="secondary" onClick={resetCounters}>Reset Counters</Button>
                <Button
                  variant="success"
                  size="sm"
                  className="w-50"
                  // onClick={handleSubmit}
                  onClick={() => setShowPurPayModal(true)}
                >
                  Save
                </Button>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>

      {/*Item Update Modal */}
      <Modal
        show={showItemUpdateModal}
        onHide={() => setShowItemUpdateModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Item Rate Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <p>{formData.item}</p>
              <p>
                <strong>Group:</strong> {formData.groupName}
              </p>
              <p>
                <strong>Purch.Rate:</strong> {formData.rate}
              </p>
              <p>
                <strong>Last Supplied by :</strong> {formData.supplierName}
              </p>

              <Button
                variant="secondary"
                size="sm"
                style={{ marginTop: "11.8rem" }}


              >
                Convert to Batch Item
              </Button>
            </Col>

            <Col>
              <Row>
                <Col sm={10}>
                  <Form.Group controlId="formBarcode">
                    <Form.Label>Purch.Rate</Form.Label>
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder="Enter purchase rate"
                      name="rate"
                      value={formData.rate}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={10}>
                  <Form.Group controlId="formBarcode">
                    <Form.Label>Margin%</Form.Label>
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder="Enter margin%"
                      name="margin"
                      value={formData.margin}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={10}>
                  <Form.Group controlId="formBarcode">
                    <Form.Label>MRP</Form.Label>
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder="Enter mrp"
                      name="MRP"
                      value={formData.MRP}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={10}>
                  <Form.Group controlId="formBarcode">
                    <Form.Label>Sales Rate</Form.Label>
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder="Enter sales rate"
                      name="salesRate"
                      value={formData.salesRate}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={10}>
                  <Form.Group controlId="formBarcode">
                    <Form.Label>Min Rate</Form.Label>
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder="Enter min rate"
                      name="minRate"
                      value={formData.minRate}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Button
                    variant="success"
                    size="sm"
                    className="mt-2"
                    //  onClick={handleAddItem}
                    // onClick={() => setShowPurPayModal(true)}

                    // onClick={() => {
                    //   handleAddItem();
                    //   // setShowItemUpdateModal(false);
                    //   setFormData(initialFormData); // Reset form data
                    // }}


                    onClick={() => {
                      if (validateFields()) {
                        handleAddItem();
                        setFormData(initialFormData); // Reset form data
                        setShowItemUpdateModal(false);
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} /> Update
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal.Body>

      </Modal>

      {/*Purchase Payment Modal */}
      {/* <Modal show={showPurPayModal} onHide={() => setShowPurPayModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Purchase Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <p>Sales Payment[grand Amount :{formData.netAmount}]</p>
            </Col>
            <Col>
              <Form.Group controlId="radio">
                <Form.Label></Form.Label>
                <div className="d-flex justify-content-center">
                  <Form.Check type="radio"
                    label="Cash"
                    className="mr-3 mt-2"
                    style={{ marginRight: "10px" }} />
                  <Form.Check
                    type="radio"
                    label="Credit"
                    className="mr-3 mt-2"
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>

              <Row>
                <Col sm={10}>
                  <Form.Group controlId="formBarcode">
                    <Form.Label>Pay Method</Form.Label>
                    <Form.Control size="sm" as="select">
                      <option value="">Select an option</option>
                      <option value="option1">Cash </option>
                      <option value="option2">UPI</option>
                      <option value="option3">Option 3</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col>

              <Row>
                <Row>
                  <Col sm={10}>
                    <Form.Group controlId="formBarcode">
                      <Form.Label>Tendered Amount</Form.Label>
                      <Form.Control
                        type="text"
                        size="sm"
                        placeholder="Enter tendered amount"
                        name="tenderedAmount"
                        // value={formData.netAmount}

                        value={calculateTotalNetAmount()}
                        onChange={(e) => setFormData({...formData, tenderedAmount: e.target.value})}
                        // onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col sm={10}>
                    <Form.Group controlId="formBarcode">
                      <Form.Label>Balance Amount</Form.Label>
                      <Form.Control
                        type="text"
                        size="sm"
                        placeholder="Enter balance amount"
                        name="balanceAmount"
                        value={formData.balanceAmount}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col sm={10}>
                    <Form.Group controlId="formBarcode">
                      <Form.Label>Discount</Form.Label>
                      <Form.Control
                        type="text"
                        size="sm"
                        placeholder="Enter discount amount"
                        name="discountAmount"
                        // value={formData.discount}
                        // onChange={handleInputChange}
                        value={formData.discountAmount || 0}
                        onChange={(e) => setFormData({...formData, discountAmount: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Col>
                  <div className="d-flex justify-content-center">
                    <Button
                      variant="success"
                      size="sm"
                      className="mt-4"
                      style={{ marginRight: "10px" }}
                      // onClick={handleAddItem}
                      onClick={handleSubmit}
                    >
                      Pay
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="mt-4"
                      onClick={() => setShowPurPayModal(false)}
                    >
                      Clear
                    </Button>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal.Body>

      </Modal> */}


<Modal show={showPurPayModal} onHide={() => setShowPurPayModal(false)} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Purchase Payment</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Row>
      <Col>
        <p>Sales Payment[grand Amount :{calculateTotalNetAmount()}]</p>
      </Col>
      <Col>
        <Form.Group controlId="paymentMethod">
          <Form.Label>Payment Method</Form.Label>
          <div className="d-flex justify-content-center">
            <Form.Check
              inline
              type="radio"
              label="Cash"
              name="paymentMethod"
              id="cash-radio"
              checked={formData.paymentMethod === 'cash'}
              onChange={handleInputChange}
            />
            <Form.Check
              inline
              type="radio"
              label="Credit"
              name="paymentMethod"
              id="credit-radio"
              checked={formData.paymentMethod === 'credit'}
              onChange={handleInputChange}
            />
          </div>
        </Form.Group>
      </Col>
    </Row>
    <Row>
      <Col>
        <Row>
          <Col sm={10}>
            <Form.Group controlId="payMethod">
              <Form.Label>Pay Method</Form.Label>
              <Form.Control
                size="sm"
                as="select"
                name="payMethod"
                value={formData.payMethod}
                onChange={handleInputChange}
              >
                <option value="">Select an option</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="other">Other</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Col>
      <Col>
        <Row>
          <Col sm={10}>
            <Form.Group controlId="tenderedAmount">
              <Form.Label>Tendered Amount</Form.Label>
              <Form.Control
                type="number"
                size="sm"
                placeholder="Enter tendered amount"
                name="tenderedAmount"
                value={formData.tenderedAmount}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col sm={10}>
            <Form.Group controlId="discountAmount">
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="number"
                size="sm"
                placeholder="Enter discount amount"
                name="discountAmount"
                value={formData.discountAmount}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col sm={10}>
            <Form.Group controlId="balanceAmount">
              <Form.Label>Balance Amount</Form.Label>
              <Form.Control
                type="number"
                size="sm"
                placeholder="Enter balance amount"
                name="balanceAmount"
                value={calculateBalance()}
                readOnly
              />
            </Form.Group>
          </Col>
        </Row>
      </Col>
    </Row>
    <Row>
      <Col className="d-flex justify-content-center">
        <Button
          variant="success"
          size="sm"
          className="mt-4 mr-2"
          onClick={() => handlePaymentSubmit()}
        >
          Pay
        </Button>
        <Button
          variant="danger"
          size="sm"
          className="mt-4 ml-2"
          onClick={() => setShowPurPayModal(false)}
        >
          Clear
        </Button>
      </Col>
    </Row>
  </Modal.Body>
</Modal>

      <AddSupplier show={showModalAddSupplier} handleClose={handleModalClose} />
    </div>
  );
}

export default NewModal;
