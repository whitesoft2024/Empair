import React, { useEffect, useState } from "react";
import NavBar from "../NavBar";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../Style/listStyle.css";
import ProCusDetailModal from './ProCusDetailModal';

function ProductionpurchaseList() {
    const [customerData, setCustomerData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false); 
    const [modalOpen, setModalOpen] = useState(false); 
    const [selectedRow, setSelectedRow] = useState(null);
    const [schemeData, setSchemeData] = useState([]);

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `http://localhost:4000/svv/getCusDetails`,
                    {
                        params: {
                            page: currentPage,
                            limit: itemsPerPage,
                        },
                    }
                );
                const rawData = response.data.rawMatchedData || [];
                // Grouping by referenceName and referenceMobile
                const groupedByMobile = rawData.reduce((acc, item) => {
                    const key = `${item.matchedDetail.referenceName}-${item.matchedDetail.referenceMobile}`;
                    if (!acc[key]) {
                        acc[key] = {
                            referenceName: item.matchedDetail.referenceName,
                            referenceMobile: item.matchedDetail.referenceMobile,
                            schemePurchaseId: item.matchedDetail.schemePurchaseId,
                            referenceAmount: 0,
                        };
                    }
                    acc[key].referenceAmount += item.matchedDetail.referenceAmount;
                    return acc;
                }, {});
                // Grouping by referenceName and schemePurchaseId
                const groupedByScheme = rawData.reduce((acc, item) => {
                    const key = `${item.matchedDetail.referenceName}-${item.matchedDetail.schemePurchaseId}`;
                    if (!acc[key]) {
                        acc[key] = {
                            referenceName: item.matchedDetail.referenceName,
                            schemePurchaseId: item.matchedDetail.schemePurchaseId,
                            details: []
                        };
                    }
                    acc[key].details.push({
                        referenceAmount: item.matchedDetail.referenceAmount,
                        otherField: item.matchedDetail.otherField,
                    });
                    return acc;
                }, {});
                setCustomerData(Object.values(groupedByMobile));
                setSchemeData(Object.values(groupedByScheme));
                setTotalPages(response.data.totalPages || 1);
            } catch (error) {
                console.error("Error fetching customer data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [currentPage, itemsPerPage]);

    const handleRowClick = (item) => {
        const matchingData = schemeData.filter(
            (scheme) => scheme.referenceName === item.referenceName
        );
        setSelectedRow(item);
        setModalOpen(true);
        console.log("Matching data:", matchingData);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalOpen(null);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <>
            {loading && (
                <div className="loader-overlay">
                    <div className="clock-loader"></div>
                </div>
            )}

            <nav className="navbar navbar-light">
                <div className="container-fluid">
                    <Link className="navbar-brand ms-5 d-flex align-items-center" to="/">
                        <strong className="fs-2">EMPAIR MARKETING PVT LTD</strong>
                    </Link>
                    <div className="d-flex" style={{ width: "600px" }}>
                        <FontAwesomeIcon icon={faHouse} className="me-5 mt-4" />
                        <FontAwesomeIcon
                            icon={faPowerOff}
                            onClick={() => { }}
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
                        </div>
                    </div>
                </div>
            </nav>
            <div className="marquee px-5 m-2">
                <marquee className="text-white" behavior="scroll" direction="left">
                    New Updates : Welcome to EMPAIR MARKETING PVT LTD....Have a nice
                    day....
                </marquee>
            </div>
            <NavBar />
            <div className="container">
                <h2>PRODUCTION PURCHASE LIST</h2>
                <ul className="responsive-table">
                    <li className="table-header">
                        <div className="col col-1">SI No</div>
                        <div className="col col-2">Customer Name</div>
                        <div className="col col-3">Amount Due</div>
                        <div className="col col-5">Mobile</div>
                    </li>

                    {customerData.map((item, index) => (
                        <li
                            className="table-row"
                            key={index}
                            onClick={() => handleRowClick(item)}
                        >
                            <div className="col col-1" data-label="SI No">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                            </div>
                            <div className="col col-2" data-label="Customer Name">
                                {item.referenceName}
                            </div>
                            <div className="col col-3" data-label="Amount Due">
                                {item.referenceAmount}
                            </div>
                            <div className="col col-5" data-label="Mobile">
                                {item.referenceMobile}
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="pagination">
                    <div>
                        <label>Items per page: </label>
                        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <div className="page-numbers">
                        {pageNumbers.map((pageNumber) => (
                            <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={currentPage === pageNumber ? "active" : ""}
                            >
                                {pageNumber}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>

            {modalOpen && selectedRow && (
                <ProCusDetailModal

                    rowData={selectedRow}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
}

export default ProductionpurchaseList;
