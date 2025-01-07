import React from 'react';

function ProCusDetailModal({ rowData, onClose }) {
    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            role="dialog"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Row Details</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <p><strong>Customer Name:</strong> {rowData.referenceName}</p>
                        <p><strong>Amount Due:</strong> {rowData.referenceAmount}</p>
                        <p><strong>Mobile:</strong> {rowData.referenceMobile}</p>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProCusDetailModal;