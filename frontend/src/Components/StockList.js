import React, { useState, useRef, useEffect } from "react";
import NavBar from "./NavBar";
import { Container, Row, Col, Form, Table, Button, Modal, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faFileExport, faPrint, faEdit, faImage, faHistory, faStar, faSave, } from "@fortawesome/free-solid-svg-icons";
import { faHouse, faPowerOff, faUser, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logo from './Images/logo.png';
import { Toaster, toast } from 'sonner'

// ...

function StockList() {
  // const [tableHeaders, setTableHeaders] = useState([]);
  const dropdownRef = useRef(null);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [uoms, setUoms] = useState([]);
  const [selectedUom, setSelectedUom] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');

  const initialCheckedItems = ({
    'Si_no': true,
    'Referance No': false,
    'MainBarcode': true,
    'Batch Barcode': false,
    'Product Name': true,
    'Group Name': false,
    'Brand': false,
    'Item Code': false,
    'Purchase Rate': true,
    'Sale Rate': true,
    'Minimum Rate': false,
    'MRP': false,
    'Stock': true,
    'Item Cost': false,
    'Margin %': true,
    'Total Stock Value': true,
    'Op.Stock': false,
    'Opening Stock Value': false,
    'Mfg Date': false,
    'Exp Date': false,
    'Minimum Stock': false,
    'HSN Number': false,
    'Unit': false,
    'Location': false,
    'Has Batch': false,
    'Is Active': false,
    'Is FMP': false,
    'Entry Date': false,
    // "Barcode": false,
    // "Item Name": false,
    // 'ItemNameml': false,
    // 'Expiry Days': false,
    // 'Is Service': false,
    // 'Has Batch No': false,
    // 'Has Batch Warranty': false,
    // 'Raw Materials': false,
    // 'Sales Item': false,
    // 'Stock Tracking': false,
  });
  const [checkedItems, setCheckedItems] = useState(initialCheckedItems);
  const [tableHeaders, setTableHeaders] = useState(
    Object.keys(initialCheckedItems).filter(key => initialCheckedItems[key])
  );

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    // List of headers that should always remain checked
    const alwaysCheckedHeaders = ["Si_no", "Item Code", "Group Name", "Sale Rate"];

    // Prevent unchecking the always checked headers
    if (!checked && alwaysCheckedHeaders.includes(name)) {
      return;
    }

    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [name]: checked,
    }));
  };

  const handleOkClick = () => {
    const selectedHeaders = Object.keys(checkedItems).filter(
      (item) => checkedItems[item]
    );
    setTableHeaders(selectedHeaders);
    // Close the dropdown
    if (dropdownRef.current) {
      dropdownRef.current.click();
    }
  };

  const handleSelectAllClick = () => {
    const allChecked = Object.keys(checkedItems).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setCheckedItems(allChecked);
  };

  // Add this function in the same place where you have other handler functions
  const handleClearAllClick = () => {
    const newCheckedItems = Object.keys(checkedItems).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setCheckedItems(newCheckedItems);
  };

  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    itemCode: "",
    barCode: "",
    itemName: "",
    itemNameml: "",
    purchaseRate: "",
    salesRate: "",
    mrp: "",
    minRate: "",
    opStock: "",
    hsnNumber:'',
    baseUom: '',
    brand: '',
    location: "",
    brandName: '',
    description: '',
    decimalPlace: '',
    expiryDays: "",
    parentGroup: "",
    groupName: '',
    cgst: "",
    sgst: "",
    isFinalGroup: "",
    isService: false,
    hasBatch: false,
    HasSerialNo: false,
    hasWarranty: false,
    rawMaterials: false,
    salesItem: false,
    stockTracking: false,
    expiredItem: false,
    FMP: false,
  });

  const handleInputChange = (e) => {
    const { name, type, checked } = e.target;

    // Determine the value to update based on the input type
    const valueToUpdate = type === 'checkbox' ? checked : e.target.value;

    setFormData({
      ...formData,
      [name]: valueToUpdate,
    });
  };

  //fetch group
  const fetchGroupStock = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/getAllGroup');
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGroupStock();
  }, [selectedGroup]);

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
    setFormData(prevState => ({ ...prevState, groupName: event.target.value }));
  };

  //fetch Brand

  useEffect(() => {
    fetchBrandStock();
  }, []);

  const fetchBrandStock = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/getAllBrand');
      if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
      }
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
    setFormData(prevState => ({ ...prevState, brand: event.target.value }));
  };

  //fetch UOM

  useEffect(() => {
    fetchUomStock();
  }, []);

  const fetchUomStock = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/getAllUOM');
      if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
      }
      const data = await response.json();
      setUoms(data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleUomChange = (event) => {
    setSelectedUom(event.target.value);
    setFormData(prevState => ({ ...prevState, baseUom: event.target.value }));
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showModalGroup, setShowModalGroup] = useState(false);

  const handleShowModalGroup = () => setShowModalGroup(true);
  const handleCloseModalGroup = () => setShowModalGroup(false);

  const [showModalBrand, setShowModalBrand] = useState(false);

  const handleShowModalBrand = () => setShowModalBrand(true);
  const handleCloseModalBrand = () => setShowModalBrand(false);

  const [showModalUom, setShowModalUom] = useState(false);

  const handleShowModalUom = () => setShowModalUom(true);
  const handleCloseModalUom = () => setShowModalUom(false);


  useEffect(() => {
    fetchGroupStock();
  }, [showModalGroup]);

  const handleGrpSubmit = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/addGroup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      toast.success('Group Added!!!')
      handleCloseModalGroup();
      // After successful submission, refresh the group list
      fetchGroupStock();
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };


  useEffect(() => {
    fetchUomStock();
  }, [showModalUom]);

  const handleUOMSubmit = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/addUOM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      toast.success('Unit Added!!!')
      fetchUomStock();
      handleCloseModalUom();
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };

  useEffect(() => {
    fetchBrandStock();
  }, [showModalBrand]);

  const handleBrandSubmit = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/addBrand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      toast.success('Brand Added!!!')
      fetchBrandStock();
      handleCloseModalBrand();
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };

  const handleItemSubmit = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/addItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // alert('Item added successfully!');
      toast.success('Item Added Successfully')

      window.location.reload();

    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [uniqueItems, setUniqueItems] = useState([]);

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
      console.log(suppliers);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-light ">
        <div className="container-fluid">
          <Link className="navbar-brand ms-5 d-flex align-items-center" to="/">
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
          <b>Stock List (Year: 2024-2025)</b>
        </p>
      </div>
      <Container>
        <Row>
          <Col sm={3}>
            <Form.Group controlId="itemCode">
              <Form.Label>ItemCode/BarCode</Form.Label>
              <Form.Control size="sm" type="text" />
            </Form.Group>
          </Col>
          <Col sm={3}>
            <Form.Group controlId="itemName">
              <Form.Label>Item Name</Form.Label>
              <Form.Control size="sm" type="text" />
            </Form.Group>
          </Col>
          <Col sm={3} className="mt-4">
            <Form.Check type="checkbox" label="Paid" className="mr-3 mt-2" />
          </Col>
          <Col sm={3}>
            <Form.Group controlId="BatchNo">
              <Form.Label>Batch No</Form.Label>
              <Form.Control size="sm" type="text" />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col sm={3}>
            <Form.Group controlId="category">
              <Form.Label>Category </Form.Label>
              <Form.Control size="sm" type="text" />
            </Form.Group>
          </Col>
          <Col sm={3}>
            <Form.Group controlId="ion">
              <Form.Label>ion</Form.Label>
              <Form.Control size="sm" type="text" />
            </Form.Group>
          </Col>
          <Col sm={3}></Col>
          <Col sm={3}>
            <Form.Group controlId="godown">
              <Form.Label>Godown</Form.Label>
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
          <Col sm={2} className="mt-4">
            <Form.Check
              type="checkbox"
              label="Service Only"
              className="mr-3 mt-2"
            />
          </Col>
          <Col sm={2} className="mt-4">
            <Form.Check
              type="checkbox"
              label="Zero Stock Item"
              className="mr-3 mt-2"
            />
          </Col>
          <Col sm={2} className="mt-4">
            <Form.Check
              type="checkbox"
              label="Expired Item"
              className="mr-3 mt-2"
              name="isExpired"
              onChange={handleInputChange}
            />
          </Col>

          <Col sm={2} className="mt-4">
            <Form.Check
              type="checkbox"
              label="Expired Item Only"
              className="mr-3 mt-2"
            />
          </Col>
          <Col sm={2} className="mt-4">
            <Form.Check
              type="checkbox"
              label="Min Stock Exceeded Only"
              className="mr-3 mt-2"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={3}>
            <Form.Group controlId="godown">
              <Form.Label>Show</Form.Label>
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
          <Col className="d-flex justify-content-end align-items-center">
            <Dropdown>
              <Dropdown.Toggle
                as={Button}
                variant="link"
                style={{ color: "black" }}
                ref={dropdownRef}
              >
                <FontAwesomeIcon icon={faEllipsisV} />
              </Dropdown.Toggle>
              <Dropdown.Menu className="custom-dropdown-menu">
                <Container>
                  <Row>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Si_no"
                        name="Si_no"
                        checked={checkedItems["Si_no"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Referance No"
                        name="Referance No"
                        checked={checkedItems["Referance No"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="MainBarcode"
                        name="MainBarcode"
                        checked={checkedItems["MainBarcode"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Batch Barcode"
                        name="Batch Barcode"
                        checked={checkedItems["Batch Barcode"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>

                  </Row>
                  <Row>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Product Name"
                        name="Product Name"
                        checked={checkedItems["Product Name"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Group Name"
                        name="Group Name"
                        checked={checkedItems["Group Name"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Brand"
                        name="Brand"
                        checked={checkedItems["Brand"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Item Code"
                        name="Item Code"
                        checked={checkedItems["Item Code"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>

                  </Row>
                  <Row>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Purchase Rate"
                        name="Purchase Rate"
                        checked={checkedItems["Purchase Rate"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Sale Rate"
                        name="Sale Rate"
                        checked={checkedItems["Sale Rate"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Minimum Rate"
                        name="Minimum Rate"
                        checked={checkedItems["Minimum Rate"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="MRP"
                        name="MRP"
                        checked={checkedItems["MRP"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>

                  </Row>
                  <Row>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Stock"
                        name="Stock"
                        checked={checkedItems["Stock"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Item Cost"
                        name="Item Cost"
                        checked={checkedItems["Item Cost"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Margin %"
                        name="Margin %"
                        checked={checkedItems["Margin %"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Total Stock Value"
                        name="Total Stock Value"
                        checked={checkedItems["Total Stock Value"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>

                  </Row>
                  <Row>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Op.Stock"
                        name="Op.Stock"
                        checked={checkedItems["Op.Stock"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Opening Stock Value"
                        name="Opening Stock Value"
                        checked={checkedItems["Opening Stock Value"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Mfg Date"
                        name="Mfg Date"
                        checked={checkedItems["Mfg Date"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Exp Date"
                        name="Exp Date"
                        checked={checkedItems["Exp Date"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                  </Row>
                  <Row>

                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Minimum Stock"
                        name="Minimum Stock"
                        checked={checkedItems["Minimum Stock"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="HSN Number"
                        name="HSN Number"
                        checked={checkedItems["HSN Number"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Unit"
                        name="Unit"
                        checked={checkedItems["Unit"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Location"
                        name="Location"
                        checked={checkedItems["Location"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    
                  </Row>
                  <Row>
                  <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Has Batch"
                        name="Has Batch"
                        checked={checkedItems["Has Batch"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Is Active"
                        name="Is Active"
                        checked={checkedItems["Is Active"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Is FMP"
                        name="Is FMP"
                        checked={checkedItems["Is FMP"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Check
                        type="checkbox"
                        label="Entry Date"
                        name="Entry Date"
                        checked={checkedItems["Entry Date"]}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col className="d-flex justify-content-center">
                      <Button onClick={handleOkClick}>OK</Button>
                      <Button onClick={handleSelectAllClick} className="ms-3">Select All</Button>
                      <Button onClick={handleClearAllClick} className="ms-3">Clear All</Button> {/* Add this line */}
                    </Col>
                  </Row>
                </Container>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>

        <Table striped bordered hover responsive size="sm">
          <thead>
            <tr>
              {tableHeaders.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, supplierIndex) =>
              supplier.purchaseData.map((item, itemIndex) => (
                item.itemsData.map((product, itemsIndex) => (
                  <tr key={`row-${supplierIndex}-${itemIndex}-${itemsIndex}`}>
                    {tableHeaders.includes("Si_no") && <td>{supplierIndex + itemIndex + itemsIndex + 1}</td>}
                    {tableHeaders.includes("Referance No") && <td>{product.referenceNo}</td>}
                    {tableHeaders.includes("MainBarcode") && <td>{item.barcode}</td>}
                    {tableHeaders.includes("Batch Barcode") && <td>{product.batchBarcode}</td>}
                    {tableHeaders.includes("Product Name") && <td>{product.item}</td>}
                    {tableHeaders.includes("Group Name") && <td>{product.groupName}</td>}
                    {tableHeaders.includes("Brand") && <td>{product.brand}</td>}
                    {tableHeaders.includes("Item Code") && <td>{product.itemCode}</td>}
                    {tableHeaders.includes("Purchase Rate") && <td>{product.rate}</td>}
                    {tableHeaders.includes("Sale Rate") && <td>{product.salesRate}</td>}
                    {tableHeaders.includes("Minimum Rate") && <td>{product.minRate}</td>}
                    {tableHeaders.includes("MRP") && <td>{product.MRP}</td>}
                    {tableHeaders.includes("Stock") && <td>{product.qty}</td>}
                    {tableHeaders.includes("Item Cost") && <td>{product.rate}</td>}
                    {tableHeaders.includes("Margin %") && <td>{product.margin}</td>}
                    {tableHeaders.includes("Total Stock Value") && <td>{product.amount}</td>}
                    {tableHeaders.includes("Op.Stock") && <td></td>}
                    {tableHeaders.includes("Opening Stock Value") && <td></td>}
                    {tableHeaders.includes("Mfg Date") && <td></td>}
                    {tableHeaders.includes("Exp Date") && <td>{new Date(item.deliveryDate).toLocaleDateString()}</td>}
                    {tableHeaders.includes("Minimum Stock") && <td>{item.opStock}</td>}
                    {tableHeaders.includes("HSN Number") && <td>{item.hsnNumber}</td>}
                    {tableHeaders.includes("Unit") && <td>{product.uom}</td>}
                    {tableHeaders.includes("Location") && <td>{product.location}</td>}
                    {tableHeaders.includes("Has Batch") && <td>{product.hasBatch}</td>}
                    {tableHeaders.includes("Is Active") && <td>{product.isActive}</td>}
                    {tableHeaders.includes("Is FMP") && <td>{product.isFMP}</td>}
                    {tableHeaders.includes("Entry Date") && <td>{item.itemDescription}</td>}
                  </tr>
                ))
              ))
            )}
          </tbody>
        </Table>

        <Row className="justify-content-end" style={{ marginTop: "10rem" }}>
          <Col sm={3}>
            <Form.Group controlId="stock">
              <Form.Label>Stock </Form.Label>
              <Form.Control size="sm" type="text" />
            </Form.Group>
          </Col>
          <Col sm={3}>
            <Form.Group controlId="stockValue">
              <Form.Label>Stock Value </Form.Label>
              <Form.Control size="sm" type="text" />
            </Form.Group>
          </Col>
        </Row>

        <Row className="text-center mt-3">
          <Col xs={2} className="px-1">
            <Button
              variant="success"
              size="sm"
              className="w-50"
              onClick={handleShow}
            >
              <FontAwesomeIcon icon={faPlus} /> New
            </Button>
          </Col>
          <Col xs={2} className="px-1">
            <Button variant="secondary" size="sm" className="w-50">
              <FontAwesomeIcon icon={faEdit} /> Edit
            </Button>
          </Col>
          <Col xs={2} className="px-1">
            <Button variant="secondary" size="sm" className="w-50">
              <FontAwesomeIcon icon={faImage} /> Image
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
              <FontAwesomeIcon icon={faHistory} /> Summary
            </Button>
          </Col>
          <Col xs={{ span: 0, offset: 0 }} className="px-1 w-50">
            <Button variant="secondary" size="sm">
              <FontAwesomeIcon icon={faStar} />
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Item Details Modal */}

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Item Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col sm={9}>
                <Form>
                  <Row>
                    <Col sm={6}>
                      <Form.Group controlId="itemCode">
                        <Form.Label>Item Code</Form.Label>
                        <Form.Control
                          size="sm"
                          name="itemCode"
                          value={formData.itemCode}
                          onChange={handleInputChange}
                          type="text"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group controlId="barCode">
                        <Form.Label>Bar Code</Form.Label>
                        <Form.Control
                          size="sm"
                          name="barCode"
                          value={formData.barCode}
                          onChange={handleInputChange}
                          type="text"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="itemName">
                        <Form.Label>Item Name</Form.Label>
                        <Form.Control
                          size="sm"
                          type="text"
                          name="itemName"
                          value={formData.itemName}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="itemNameml">
                        <Form.Label>Item Name ML</Form.Label>
                        <Form.Control
                          size="sm"
                          type="text"
                          name="itemNameml"
                          value={formData.itemNameml}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {/* <Form.Group controlId="groupName">
                        <Form.Label>Group Name</Form.Label>
                        <Form.Select value={selectedGroup} onChange={handleGroupChange} size="sm">
                          <option value="">Select a Group Name</option>
                          {groups.map((group, index) => (
                            <option key={index} value={group.groupName}>{group.groupName}</option>
                          ))}
                        </Form.Select>
                      </Form.Group> */}
                      <Form.Group controlId="groupName">
                        <Form.Label>Select Group</Form.Label>
                        <Form.Control as="select" value={selectedGroup} onChange={handleGroupChange}>
                          <option value="">Select a Group Name</option>
                          {groups.map(group => (
                            <option key={group.id} value={group.groupName}>{group.groupName}</option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>

                    <Col xs={2} className="mt-4 px-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-50"
                        onClick={handleShowModalGroup}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Form.Group controlId="purchaseRate">
                        <Form.Label>Purchase Rate</Form.Label>
                        <Form.Control
                          size="sm"
                          type="text"
                          name="purchaseRate"
                          value={formData.purchaseRate}
                          onChange={handleInputChange}
                          placeholder="0.00"
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group controlId="salesRate">
                        <Form.Label>Sales Rate</Form.Label>
                        <Form.Control
                          size="sm"
                          name="salesRate"
                          value={formData.salesRate}
                          onChange={handleInputChange}
                          type="text"
                          placeholder="0.00"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Form.Group controlId="mrp">
                        <Form.Label>MRP</Form.Label>
                        <Form.Control
                          size="sm"
                          type="text"
                          name="mrp"
                          value={formData.mrp}
                          onChange={handleInputChange}
                          placeholder="0.00"
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group controlId="minRate">
                        <Form.Label>Min. Rate</Form.Label>
                        <Form.Control
                          size="sm"
                          type="text"
                          name="minRate"
                          value={formData.minRate}
                          onChange={handleInputChange}
                          placeholder="0.00"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Form.Group controlId="sgst">
                        <Form.Label>SGST</Form.Label>
                        <Form.Control
                          size="sm"
                          type="text"
                          name="sgst"
                          value={formData.sgst}
                          onChange={handleInputChange}
                          placeholder="0.00"
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group controlId="cgst">
                        <Form.Label>CGST</Form.Label>
                        <Form.Control
                          size="sm"
                          type="text"
                          name="cgst"
                          value={formData.cgst}
                          onChange={handleInputChange}
                          placeholder="0.00"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Form.Group controlId="opStock">
                        <Form.Label>Op. Stock</Form.Label>
                        <Form.Control
                          size="sm"
                          type="text"
                          name="opStock"
                          value={formData.opStock}
                          onChange={handleInputChange}
                          placeholder="0.00"
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group controlId="hsnNumber">
                        <Form.Label>HSN number</Form.Label>
                        <Form.Control
                          size="sm"
                          type="text"
                          name="hsnNumber"
                          value={formData.hsnNumber}
                          onChange={handleInputChange}
                          placeholder="0.00"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      <Form.Group controlId="baseUom">
                        <Form.Label>Base UoM</Form.Label>
                        <Form.Select value={selectedUom} onChange={handleUomChange} size="sm">
                          <option value="">Select a Measurements</option>
                          {uoms.map((uom, index) => (
                            <option key={index} value={uom.UOM}>{uom.UOM}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col xs={2} className="mt-4 px-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-50"
                        onClick={handleShowModalUom}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </Col>
                    <Col sm={4}>
                      <Form.Group controlId="brand">
                        <Form.Label>Brand</Form.Label>
                        <Form.Select value={selectedBrand} onChange={handleBrandChange} size="sm">
                          <option value="">Select a Brand</option>
                          {brands.map((brand, index) => (
                            <option key={index} value={brand.brandName}>{brand.brandName}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col xs={2} className="mt-4 px-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-50"
                        onClick={handleShowModalBrand}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </Col>
                  </Row>
                  <Row>

                  </Row>

                  <Row>
                    <Col sm={9}>
                      <Form.Group controlId="location">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                          size="sm"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          type="text"
                          placeholder="Place"
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={3}>
                      <Form.Group controlId="expiryDays">
                        <Form.Label>Expiry Days</Form.Label>
                        <Form.Control
                          size="sm"
                          name="expiryDays"
                          value={formData.expiryDays}
                          onChange={handleInputChange}
                          type="text"
                          placeholder="Expiry Days"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Col>
              <Col sm={3}>
                <Form>
                  <Form.Group>
                    <div style={{ marginBottom: "10px" }}>
                      <Form.Check
                        type="checkbox"
                        label="Is Service"
                        name="isService"
                        id="isService"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <Form.Check
                        type="checkbox"
                        label="Has Batch"
                        name="hasBatch"
                        id="hasBatch"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <Form.Check
                        type="checkbox"
                        label="Has Serial No"
                        name="HasSerialNo"
                        id="HasSerialNo"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <Form.Check
                        type="checkbox"
                        label="Has Warranty"
                        name="hasWarranty"
                        id="hasWarranty"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <Form.Check
                        type="checkbox"
                        label="Raw Materials"
                        name="rawMaterials"
                        id="rawMaterials"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <Form.Check
                        type="checkbox"
                        label="Sales Item"
                        name="salesItem"
                        id="salesItem"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <Form.Check
                        type="checkbox"
                        label="Stock Tracking"
                        name="stockTracking"
                        id="stockTracking"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <Form.Check
                        type="checkbox"
                        label="Expired Item"
                        className="mr-3 mt-2"
                        name="expiredItem"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <Form.Check
                        type="checkbox"
                        label="FMP"
                        name="FMP"
                        id="FMP"
                        onChange={handleInputChange}
                      />
                    </div>
                    <Form.Label>Curr. Cost:</Form.Label>
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </Form>
          <Row className="text-center mt-3">
            <Col className="px-1">
              <Button variant="success" size="sm" onClick={handleItemSubmit}>
                <FontAwesomeIcon icon={faSave} /> Save
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      {/* group Modal */}
      <Modal show={showModalGroup} onHide={handleCloseModalGroup}>
        <Modal.Header closeButton>
          <Modal.Title>Product Groups</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Modal content */}
          <Row>
            <Col sm={9}>
              <Form.Group controlId="parentGroup">
                <Form.Label>Parent Group</Form.Label>
                <Form.Control size="sm" type="text" name="parentGroup" value={formData.parentGroup} onChange={handleInputChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={9}>
              <Form.Group controlId="groupName">
                <Form.Label>Group Name</Form.Label>
                <Form.Control size="sm" type="text" name="groupName" value={formData.groupName} onChange={handleInputChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Check
                type="checkbox"
                label="Is Active"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
            </Col>
            <Col>
              <Form.Check
                type="checkbox"
                label="Is Final Group"
                name="isFinalGroup"
                id="isFinalGroup"
                checked={formData.isFinalGroup}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row className="text-center mt-3">
            <Col className="px-1">
              <Button variant="success" size="sm" onClick={handleGrpSubmit}>
                <FontAwesomeIcon icon={faSave} /> Save
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      {/* Uom Modal */}
      <Modal show={showModalUom} onHide={handleCloseModalUom}>
        <Modal.Header closeButton>
          <Modal.Title>Units of Measurements</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Modal content */}
          <Row>
            <Col sm={9}>
              <Form.Group controlId="UOM">
                <Form.Label>UOM</Form.Label>
                <Form.Control size="sm" type="text" name="UOM" value={formData.UOM} onChange={handleInputChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={9}>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control size="sm" type="text" name="description" value={formData.description} onChange={handleInputChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={9}>
              <Form.Group controlId="decimalPlace">
                <Form.Label>Decimal Place</Form.Label>
                <Form.Control size="sm" type="text" name="decimalPlace" value={formData.decimalPlace} onChange={handleInputChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Check
                type="checkbox"
                label="Is Active"
                name="isActive"
                id="isActive"
              />
            </Col>
          </Row>
          <Row className="text-center mt-3">
            <Col className="px-1">
              <Button variant="success" size="sm" onClick={handleUOMSubmit}>
                <FontAwesomeIcon icon={faSave} /> Save
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      {/* Brand Modal */}
      <Modal show={showModalBrand} onHide={handleCloseModalBrand}>
        <Modal.Header closeButton>
          <Modal.Title>Brands</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Modal content */}

          <Row>
            <Col sm={9}>
              <Form.Group controlId="brandName">
                <Form.Label>Brand Name</Form.Label>
                <Form.Control size="sm" type="text" name="brandName" value={formData.brandName} onChange={handleInputChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Check
                type="checkbox"
                label="Is Active"
                name="isActive"
                id="isActive"
              />
            </Col>
          </Row>
          <Row className="text-center mt-3">
            <Col className="px-1">
              <Button variant="success" size="sm" onClick={handleBrandSubmit}>
                <FontAwesomeIcon icon={faSave} /> Save
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
      <Toaster position="top-center" expand={true} richColors />
    </div>
  );
}

export default StockList;