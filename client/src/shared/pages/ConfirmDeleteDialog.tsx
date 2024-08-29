import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";

const ConfirmDeleteDialog = (props: any) => {
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  useEffect(() => {
    if (props.showConfirmDeleteModal) {
      setShowConfirmDeleteModal(props.showConfirmDeleteModal);
    }
  }, [props.showConfirmDeleteModal]);

  const handleClose = (isConfirmed: boolean) => {
    if (!isConfirmed) {
      props.confirmCancel(isConfirmed);
    } else {
      props.confirmOk(true);
    }
    setShowConfirmDeleteModal(false);
  };

  return (
    <>
      <Modal
        show={showConfirmDeleteModal}
        onHide={() => handleClose(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title style={{ width: "100%" }}>
            <h4 className="modal-title">
              <i
                className={props.iconClass}
                style={{ marginRight: "10px" }}
              ></i>{" "}
              {props.title}
            </h4>
            <button type="button"
              style={{ display: "flex", marginTop: "-20px", float: "right" }}
              id="btnCloseModal"
              data-testid="CloseModalBtn"
              className="close-dialog-btn close-btn"
              data-dismiss="modal"
              onClick={() => handleClose(false)}
              onKeyDown={(event) => { event.key === "Tab" && event.shiftKey && event.preventDefault() }}
              onKeyUp={(event) => { event.type === "keydown" && event.key === "Enter" && handleClose(false) }}
              tabIndex={1}
            >
              <i className="fa fa-times"></i>
            </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <b>{props.messageTitle}</b>
          </p>
          <p>{props.messageContent}</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            id="confirmDeleteButton"
            onClick={() => handleClose(true)}
            data-dismiss="modal"
            className="btn btn-danger"
            data-testid="confirmDeleteButton"
            tabIndex={2}
          >
            {props.confirmButtonText}
          </button>
          <button
            type="button"
            id="cancelDeleteButton"
            className="btn btn-cancel"
            data-dismiss="modal"
            onClick={() => handleClose(false)}
            tabIndex={3}
            data-testid="cancelDeleteButton">
            {props.cancelButtonText}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmDeleteDialog;
