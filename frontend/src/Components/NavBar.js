import React from 'react'
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import NavTop from './NavTop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUndo, faClipboardList, faBox, faList } from '@fortawesome/free-solid-svg-icons'; 

function NavBar() {
  return (
    <div>
        {/* <NavTop/> */}
         <Navbar className='nav-color'  expand="lg">
      <Container>
        {/* <Navbar.Brand href="#home">BrandName</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown  title={<span style={{ color: 'white' }}>Purchase</span>} id="basic-nav-dropdown" className="nav-text">
            <NavDropdown.Item href="/purchase" >Purchase</NavDropdown.Item>
              <NavDropdown.Item href="Purchasereturn">Purchase Return</NavDropdown.Item>
              <NavDropdown.Item href="Purchaseorder">Purchase Order</NavDropdown.Item>
              <NavDropdown.Item href="Receipt Note">Receipt Note</NavDropdown.Item>
              <NavDropdown.Item href="Receipt Note">Receipt Note Request List</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown  title={<span style={{ color: 'white' }}>Sales</span>} id="basic-nav-dropdown" className="nav-text">
              <NavDropdown.Item href="#action/3.1">Sales Invoice</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Sales Order</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Quotation</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Service Register</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Delivery Note</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Reprint Invoice</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title={<span style={{ color: 'white' }}>Items</span>} id="basic-nav-dropdown" className="custom-dropdown">
              <NavDropdown.Item href="/stock">Stock List</NavDropdown.Item>
              <NavDropdown.Item href="/batch">Batch List</NavDropdown.Item>
              <NavDropdown.Item href="/item">Item List</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Print Barcode</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Stock Adjustment</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Write Off Items</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Stock Transfer</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Item Opening Stock List</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Item Price Analyser</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Item Price Updater</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown  title={<span style={{ color: 'white' }}>Production</span>} id="basic-nav-dropdown" className="custom-dropdown">
              <NavDropdown.Item href="/productionpurchase">Production purchase</NavDropdown.Item>
              <NavDropdown.Item href="/productionScheme">Production Scheme</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Production Advanced List</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Production Staff List</NavDropdown.Item>
              <NavDropdown.Item href="/productionCustomerList">Production Customer List</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">BOM List</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title={<span style={{ color: 'white' }}>Accounts</span>} id="basic-nav-dropdown" className="custom-dropdown">
              <NavDropdown.Item href="#action/3.1">Receipt</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2"> Payment</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Loyality Card Customers</NavDropdown.Item>
              <NavDropdown.Item href="/customerForm">Customer</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Suppliers</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Account Ledger</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Journal Voucher</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Contra</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Bank REconciliation</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown  title={<span style={{ color: 'white' }}>HR</span>} id="basic-nav-dropdown" className="custom-dropdown">
              <NavDropdown.Item href="#action/3.1">Employee List</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">HR Management</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">HR Payment List</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Salary Procees</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Grades LIst</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">HR Master</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown  title={<span style={{ color: 'white' }}>Reports</span>} id="basic-nav-dropdown" className="custom-dropdown">
              <NavDropdown.Item href="#action/3.1">Advnaced Accounting Reports</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Stock Reports</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Purchase Reports</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Sales Reports</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Outstanding Report</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Shift Summary</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Shift Close Report</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Pending POS Orders</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Custom Reports</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Deleted Transactions</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Updated Transactions</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown  title={<span style={{ color: 'white' }}>Cheque Management</span>} id="basic-nav-dropdown" className="custom-dropdown">
              <NavDropdown.Item href="#action/3.1">Cheque Receipt</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Cheque Payment</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown  title={<span style={{ color: 'white' }}>Offers & Rewards</span>} id="basic-nav-dropdown" className="custom-dropdown">
              <NavDropdown.Item href="#action/3.1">Offers</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Offers Item Group</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Offer Detail Report</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Rewards</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Reward Settings</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Reward Point Sale Report</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown  title={<span style={{ color: 'white' }}>Settings & Configuration</span>} id="basic-nav-dropdown" className="custom-dropdown">
              <NavDropdown.Item href="#action/3.1">Company Settings</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">User Settings</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Application Settings</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Sales Reports</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Terminals</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">SAP Integration</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">License</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown  title={<span style={{ color: 'white' }}>Tools</span>} id="basic-nav-dropdown" className="custom-dropdown">
              <NavDropdown.Item href="#action/3.1">Cheque Printing</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Calculater</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Invoice Templates</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Tasks</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Barcode Templates</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Note</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Maintenance</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </div>
  )
}

export default NavBar