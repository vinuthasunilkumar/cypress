import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";

const ConfirmDialog = (props: any) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (props.showConfirmModal) {
      setShowConfirmModal(props.showConfirmModal);
    }
  }, [props.showConfirmModal]);

  const handleClose = (isConfirmed: boolean) => {
    setShowConfirmModal(false);
    if (isConfirmed) {
      props.confirmOk(true);
    } else {
      props.confirmCancel(isConfirmed);
    }
  };

  return (
    <Modal
      show={showConfirmModal}
      onHide={() => handleClose(false)}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title style={{ width: "100%" }}>
          <h4 className="modal-title">
            <i className={props.iconClass} style={{ marginRight: "10px" }}></i>{" "}
            {props.title}
          </h4>
          <button type="button"
            style={{ display: "flex", marginTop: "-20px", float: "right" }}
            id="btnCloseModal"
            data-testid="CloseModalBtn"
            className="close-dialog-btn close-btn"
            data-dismiss="modal"
            onClick={() => handleClose(false)}
            tabIndex={1}
            onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => { event.key === "Tab" && event.shiftKey && event.preventDefault() }}
            onKeyUp={(event) => { event.type === "keydown" && event.key === "Enter" && handleClose(false) }}
          >
            <i className="fa fa-times"></i>
          </button>
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
          id="btnConfirm"
          data-testid="confirmButton"
          className="btn btn-primary"
          data-dismiss="modal"
          onClick={() => handleClose(true)}
          tabIndex={2}
        >
          {props.confirmButtonText}
        </button>
        <button
          type="button"
          id="btnCancel"
          data-testid="cancelButton"
          className="btn btn-cancel"
          data-dismiss="modal"
          onClick={() => handleClose(false)}
          tabIndex={3}
        >
          {props.cancelButtonText}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDialog;
