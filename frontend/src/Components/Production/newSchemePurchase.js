import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Row, Col, Table, Dropdown } from "react-bootstrap";
import { faPlus, faEdit, faTimes, faSave } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Toaster, toast } from 'sonner'

function NewPurchaseScheme({ show, handleClose }) {
    const initialFormData = {
        supplierName: '',
        billNumber: '',
        invoiceDate: '',
        sl_no: '',
        itemName: '',
        newReferenceId: '',
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
        invoiceNumber: '',
        schemePurchaseId: '',
        referenceName: '',
        referenceId: '',
    };
    const [formData, setFormData] = useState(initialFormData);
    const [scheme, setScheme] = useState([]);
    const [selectedScheme, setSelectedScheme] = useState('');
    const [showModalScheme, setShowModalScheme] = useState(false);
    const handleShowModalScheme = () => setShowModalScheme(true);
    const handleCloseModalScheme = () => setShowModalScheme(false);
    const [schemePurchaseInvoiceCounter, setSchemePurchaseInvoiceCounter] = useState(() => {
        const savedInvoiceCounter = localStorage.getItem('schemePurchaseInvoiceCounter');
        return savedInvoiceCounter !== null ? parseInt(savedInvoiceCounter, 10) : 1000;
    });
    const [schemePurchaseIdCounter, setSchemePurchaseIdCounter] = useState(() => {
        const savedIdCounter = localStorage.getItem('schemePurchaseIdCounter');
        return savedIdCounter !== null ? parseInt(savedIdCounter, 10) : 1000;
    });
    const [productsData, setProductsData] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        setFormData((prevState) => ({
            ...prevState,
            invoiceNumber: `SPROIN${schemePurchaseInvoiceCounter}`,
            schemePurchaseId: `EMP05K${schemePurchaseIdCounter}`,
        }));
    }, [schemePurchaseInvoiceCounter, schemePurchaseIdCounter]);

    useEffect(() => {
        fetchSchmeName();
    }, []);

    const fetchSchmeName = async () => {
        try {
            const response = await fetch('http://localhost:4000/svv/getAllScheme');
            if (!response.ok) {
                throw new Error('Failed to fetch suppliers');
            }
            const data = await response.json();
            // setProductsData(data.products);
            console.log(data);
            // Array to hold all items from all products
            const allItems = [];

            // Iterate through each scheme
            data.forEach(scheme => {
                // If the scheme has products, we check for 'items' inside products
                if (scheme.products && scheme.products.length > 0) {
                    scheme.products.forEach(product => {
                        // Check if the product has an 'items' array and collect them
                        if (product.items && product.items.length > 0) {
                            allItems.push(...product.items); // Spread the items into the allItems array
                        }
                    });
                }
            });

            // Log the extracted items
            console.log("Extracted Items:", allItems); // Logs only the items

            // Optionally set products data and scheme, but only if needed
            setProductsData(allItems); // Sets the product items
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

    const [showModalAddSupplier, setShowModalAddSupplier] = useState(false);

    const handleModalClose = () => {
        setShowModalAddSupplier(false);
    };

    const handleSchemeChange = (event) => {
        const selectScheme = event.target.value;

        // Find the selected scheme details by SchemeName
        const selectedSupplierDetails = scheme.find(schemes => schemes.SchemeName === selectScheme);

        // Set the selected scheme and its ID
        setSelectedScheme(selectScheme);
        setFormData((prevState) => ({
            ...prevState,
            id: selectedSupplierDetails._id,
        }));

        // Log the selected scheme for debugging
        console.log('Selected scheme:', selectScheme);

        // Find the products array from the selected scheme
        const selectedSchemeProducts = selectedSupplierDetails?.products || [];

        // Set the filteredProducts state with the products array
        setFilteredProducts(selectedSchemeProducts);

        // Log the filtered products immediately after finding them
        console.log('Filtered products:', selectedSchemeProducts);  // This will show the correct products right after filtering

        // IMPORTANT: Don't log `filteredProducts` state directly here because it won't reflect the update yet
    };

    // UseEffect to log filteredProducts state when it changes
    useEffect(() => {
        // Log the filtered products state
        console.log('Filtered products state updated:', filteredProducts);

        // Extract and log the items from each product in the filtered products
        const productItems = filteredProducts.map(product => product.items);

        // If you want to log all items in a flat array (if there are multiple products)
        const allItems = productItems.flat();  // Flatten the array if there are multiple products

        console.log('Items from filtered products:', allItems);
    }, [filteredProducts]);

    const handleInputChangeNew = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const resetCounters = () => {
        localStorage.removeItem('schemePurchaseInvoiceCounter');
        localStorage.removeItem('schemePurchaseIdCounter');
        setSchemePurchaseInvoiceCounter(1000);
        setSchemePurchaseIdCounter(1000);
        toast.success('Counters reset to default!');
    };


    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        if (
            !formData.customerMobile ||
            !formData.invoiceDate ||
            !formData.referenceId
        ) {
            toast.error(`Please fill in ${!formData.customerMobile ? 'customer mobile' : ''}${!formData.invoiceDate ? ' invoice date' : ''}${!formData.referenceId ? ' reference Id' : ''} before submitting.`);
            return; // Exit the function if required fields are empty
        }
        try {
            const updatedFormData = {
                ...formData,
                invoiceNumber: formData.invoiceNumber || `SPROIN${schemePurchaseInvoiceCounter}`,
                schemePurchaseId: formData.schemePurchaseId || `EMP05K${schemePurchaseIdCounter}`,
            };
            updatedFormData.SchemeName = selectedScheme;

            const response = await axios.post('http://localhost:4000/svv/addCustomers', updatedFormData);
            if (response.status === 400 && response.data.error) {
                toast.error(response.data.error);  // Show toast alert with the error message
                return; // Exit the function on error
            }
            toast.success('Products Added!!!');

            const nextInvoiceCounter = schemePurchaseInvoiceCounter + 1;
            setSchemePurchaseInvoiceCounter(nextInvoiceCounter);
            localStorage.setItem('schemePurchaseInvoiceCounter', nextInvoiceCounter.toString());

            const nextIdCounter = schemePurchaseIdCounter + 1;
            setSchemePurchaseIdCounter(nextIdCounter);
            localStorage.setItem('schemePurchaseIdCounter', nextIdCounter.toString());

            // Reset form data after successful submission
            setFormData({ ...initialFormData });
            setSelectedScheme('');
            handleCloseModalScheme();
            window.location.href = "/productionpurchase"

            if (!response.ok) {
                throw new Error('Network response was not ok');
                toast.error('An error occurred');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);  // Show toast alert with the specific error message
            } else {
                toast.error('An error occurred. Please try again.');  // Show generic error message
            }
            console.error('There was a problem with your fetch operation:', error);

        }
    };

    const [customers, setCustomers] = useState([]);
    const [nextPages, setNextPages] = useState(null);
    const [filteredReferences, setFilteredReferences] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoadMoreClicked, setIsLoadMoreClicked] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);


    const [reference, setReference] = useState([
        { name: 'Empair', customerMobile: '9999999999', referID: 'EMP' },
    ]);


    useEffect(() => {
        fetchCustomers(currentPage, pageSize);
        setIsLoadMoreClicked(true);

    }, [currentPage, pageSize]);

    const fetchCustomers = async (page, size, searchTerm = "") => {
        try {
            const response = await axios.get(`http://localhost:4000/api/getCustomers?searchTerm=${searchTerm}`);
            setCustomers(prevCustomers => [...prevCustomers, ...response.data.data]);
            setNextPages(response.data.nextPage);
        } catch (error) {
            console.error("Error fetching memberships data:", error);
        }
    };

    const handleNumberSelect = (value) => {
        fetchData(value);
        setFormData(prevFormData => ({
            ...prevFormData,
            customerMobile: value,
        }));
        setSearchTerm(value);
        setShowDropdown(false);

    };
    const getUniqueCustomerValues = () => {
        const uniqueCustomers = customers.reduce((acc, customer) => {
            acc[customer.customerMobile] = customer;
            return acc;
        }, {});
        return Object.values(uniqueCustomers);
    };
    const uniqueCustomerValues = getUniqueCustomerValues();
    const fetchData = (mobile) => {
        const filteredCustomers = customers.filter(
            (customer) => customer.customerMobile === mobile
        );
        if (filteredCustomers.length > 0) {
            setFormData(filteredCustomers[0]);
            setSearchTerm(filteredCustomers[0].customerMobile);
        } else {
            setFormData(null);
        }
    };

    //reference

    const [search, setSearch] = useState('');

    const fetchReference = async (searchTerm) => {
        try {
            const response = await fetch(`http://localhost:4000/svv/getReference?mobileNumber=${searchTerm}`);
            if (!response.ok) {
                throw new Error('Failed to fetch references');
            }
            const data = await response.json();

            const fetchedData = data.data.map(item => item.customerData).flat();

            // Fix: Don't append, replace the reference state with new fetched data
            setReference([
                { name: 'Empair', customerMobile: '9999999999', referID: 'EMP' }, // Ensure Empair is always present
                ...fetchedData
            ]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (search) {
            fetchReference(search);
        }
    }, [search]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        // Fix: Only filter and display when there's a valid search term
        if (value.trim() !== '') {
            const searchTerm = value.replace(/\D/g, '');  // Remove non-digit characters
            const filtered = reference.filter(item =>
                item.customerMobile && item.customerMobile.toString().includes(searchTerm)
            );
            setFilteredReferences(filtered);
            setShowDropdown(filtered.length > 0);
        } else {
            setFilteredReferences([]);
            setShowDropdown(false);
        }
    };

    const handleReferenceSelect = (selectedReference) => {
        setFormData({
            ...formData,
            referenceName: selectedReference.name || selectedReference.customerName,
            referenceMobile: selectedReference.customerMobile,
            referenceId: selectedReference.referID || selectedReference.referenceId,
        });

        setShowDropdown(false);
        setSearch(selectedReference.customerMobile);
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
                                <b>Scheme Purchase 5000 (Year: 2024-2025)</b>
                            </p>
                        </div>
                        <Row>
                            <Col sm={4}>
                                <div onMouseLeave={() => setDropdownOpen(false)}>
                                    <Form.Group controlId="formSupplier">
                                        <Form.Label>Customer Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search..."
                                            style={{ width: "15rem" }}
                                            value={searchTerm}
                                            size="sm"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const numericValue = value.replace(/\D/g, '');
                                                if (!isNaN(numericValue)) {
                                                    setSearchTerm(numericValue);
                                                }
                                            }}
                                            onFocus={() => setShowDropdown(true)}
                                        />
                                        {showDropdown && searchTerm && (
                                            <ul className="dropdown-menu2">
                                                {uniqueCustomerValues.filter((customer) =>
                                                    customer.customerMobile.toLowerCase().includes(searchTerm.toLowerCase())
                                                ).map((customer, index) => (
                                                    <li key={index} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleNumberSelect(customer.customerMobile); setShowDropdown(false); }}>
                                                        {customer.customerName} - {customer.customerMobile}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </Form.Group>
                                </div>
                            </Col>
                            <Col sm={4}>
                                <Form.Group controlId="formInvoiceNumber">
                                    <Form.Label>Customer Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        name="invoiceNumber"
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={4}>
                                <Form.Group controlId="formInvoiceNumber">
                                    <Form.Label>Scheme Purchase Invoice</Form.Label>
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
                                <Form.Group controlId="formInvoiceNumber">
                                    <Form.Label>Customer Id</Form.Label>
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        placeholder="Enter invoice number"
                                        name="customerId"
                                        value={formData.customerId}
                                        onChange={handleInputChange}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={4}>
                                <Form.Group controlId="formInvoiceNumber">
                                    <Form.Label>Scheme Purchase Id</Form.Label>
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        name="invoiceNumber"
                                        value={formData.schemePurchaseId}
                                        onChange={handleInputChange}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={4}>
                                <Form.Group controlId="formInvoiceDate">
                                    <Form.Label>Scheme Purchase Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        size="sm"
                                        name="invoiceDate"
                                        value={formData.invoiceDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={4}>
                                <Form.Group controlId="formBarcode">
                                    <Form.Label>Product Schme</Form.Label>
                                    <Form.Select value={selectedScheme} onChange={handleSchemeChange} size="sm">
                                        <option value="">Select a Scheme</option>
                                        {scheme.map((brand, index) => (
                                            <option key={index} value={brand.SchemeName}>{brand.SchemeName}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col sm={4}>
                                <Form.Group controlId="formInvoiceDate">
                                    <Form.Label>Reference Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by mobile number"
                                        value={search}
                                        onChange={handleSearchChange}
                                    />
                                    {showDropdown && (
                                        <Dropdown.Menu show>
                                            {filteredReferences.length > 0 ? (
                                                filteredReferences.map((item, index) => (
                                                    <Dropdown.Item
                                                        key={index}
                                                        onClick={() => handleReferenceSelect(item)}
                                                    >
                                                        {item.name} {item.customerMobile} {item.customerName} {item.schemePurchaseId}
                                                    </Dropdown.Item>
                                                ))
                                            ) : (
                                                <Dropdown.Item>No results found</Dropdown.Item>
                                            )}
                                        </Dropdown.Menu>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col sm={4}>
                                <Form.Group controlId="formInvoiceNumber">
                                    <Form.Label>Reference Id</Form.Label>
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        placeholder="Enter invoice number"
                                        name="referenceId"
                                        value={formData.referenceId}
                                        onChange={handleInputChange}
                                        readOnly
                                    />
                                </Form.Group>
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
                                        <Form.Control
                                            type="text"
                                            size="sm"
                                            name="itemName"
                                            readOnly
                                            placeholder="Enter item"
                                            value={formData.itemName}
                                            onChange={handleInputChangeNew}
                                        />
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

                                </tr>
                                {filteredProducts.map((product, productIndex) =>
                                    product.items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.itemName}</td>
                                            <td>{item.qty}</td>
                                            <td>{item.baseUom}</td>
                                            <td>{item.purchaseRate}</td>
                                            <td>{item.cgst}</td>
                                            <td>{item.sgst}</td>
                                            <td>{item.salesRate}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                        <Row className="text-center mt-3">
                            <Col xs={3} className="px-1">
                                <Button variant="secondary" size="sm" className="w-50">
                                    Purchas_Order
                                </Button>
                            </Col>
                            <Col xs={3} className="px-1">
                                <Button variant="secondary" size="sm" className="w-50">
                                    Receipt_Note
                                </Button>
                            </Col>
                            <Col xs={2} className="px-1">
                                <Button variant="danger" size="sm" onClick={resetCounters}>
                                    Reset Counters
                                </Button>

                            </Col>
                            <Col xs={2} className="px-1">
                                <Button variant="secondary" size="sm" className="w-50">
                                    Update
                                </Button>
                            </Col>
                            <Col xs={2} className="px-1">
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
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        fontSize: '15px',  // Increase font size here
                    },
                }}
                expand={true}
                richColors
            />
        </div>
    );
}

export default NewPurchaseScheme;