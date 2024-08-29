import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";

const NotifyOkDialog = (props: any) => {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (props.showModal) {
      setShowModal(props.showModal);
    }
  }, [props.showModal]);
  const handleClose = () => {
    setShowModal(false);
    props.handleClose(true);
  };
  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title style={{ width: "100%" }}>
          <h4 className="modal-title" id="modalTitle" data-testid="modalTitle">
            <i
              className="fa fa-check neo-success"
              style={{ marginRight: "10px" }}
            ></i>
            {props.title}
          </h4>
          <span
            className="close-dialog-btn"
            style={{ display: "flex", marginTop: "-20px", float: "right" }}
            id="btnClose"
            data-testid="btnClose"
            onClick={handleClose}
          >
            <i className="fa fa-times"></i>
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p id="messageTitle">
          <b>{props.messageTitle}</b>
        </p>
        <p id="messageContent">{props.messageContent}</p>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          id="btnOk"
          data-testid="btnOk"
          className="btn btn-primary"
          data-dismiss="modal"
          onClick={handleClose}
        >
          {props.okButtonText}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default NotifyOkDialog;
