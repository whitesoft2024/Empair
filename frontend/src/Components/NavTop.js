import React from 'react'
import { Navbar, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";



function NavTop() {
  return (
    <div>
      <div>
        <nav className="navbar navbar-light ">
          <div className="container">
            <Link className="navbar-brand d-flex justify-content-between" to='/main'>
              <img src={"empireLogo1.ico"} alt="logo" width="100px" className="d-inline-block align-text-top" />
              <strong className="fs-2 mt-5 ">EMPAIR MARKETING PVT LTD</strong>
            </Link>
            <div className="d-flex" style={{ width: "400px" }}>
              <FontAwesomeIcon icon={faHouse} className=" me-5 mt-4" />
              <FontAwesomeIcon
                icon={faPowerOff}
                onClick={""}
                className="text-danger me-5 mt-4"
              />
              <div className="d-flex">
                <FontAwesomeIcon icon={faUser} className="me-3 mt-4" />
                <ul className="list-unstyled mb-1" style={{ width: "150px" }}>
                  <li className="me-2">User</li>
                  <li className="me-2"></li>
                  <li className="me-2"> </li>
                  <li>Date</li>
                </ul>
                <ul className="list-unstyled mb-1 me-5">

                </ul>
              </div>
            </div>
          </div>
        </nav>
        <div className="marquee  px-5 m-2">
          <marquee className="text-white" behavior="scroll" direction="left">
            New Updates : Welcome to EMPAIR MARKETING PVT LTD .... Have a nice day....
          </marquee>
        </div>
      </div>
    </div>
  )
}

export default NavTop