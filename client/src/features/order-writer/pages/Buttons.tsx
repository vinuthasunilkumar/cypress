import React from "react";

type ButtonProps = {
  handleClick: any;
  prevClick: any;
  nextClick: any;
  cancelBtnClick:any;
  index: number;
};

const Buttons = ({
  handleClick,
  prevClick,
  nextClick,
  cancelBtnClick,
  index,
}: ButtonProps) => {

  return (
    <div className="row ml-2">
      <button
        type="button"
        className="btn btn-default mr-3"
        id="previousBtn"
        onClick={(event) => prevClick(event)}
        hidden={index === 0}
      >
        Previous
      </button>
      <button
        type="button"
        className="btn btn-primary ml-0"
        id="nextBtn"
        onClick={(event) => nextClick(event)}
        hidden={index > 2}
      >
        Next
      </button>
      <button
        type="button"
        className="btn btn-success ml-4"
        data-toggle="button"
        id="saveBtn"
        onClick={(event) => handleClick(event)}
      >
        <i className="fa-regular fa-floppy-disk mr-1"></i>
        {`Save`}
      </button>
      <button
        type="button"
        className="btn btn-cancel"
        id="cancelBtn"
        onClick={cancelBtnClick}
      >
        Cancel
      </button>
    </div>
  );
};
export default Buttons;
