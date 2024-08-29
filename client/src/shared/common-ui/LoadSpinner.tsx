import React from "react";

const LoadSpinner = () => (
  <>
    <div className="sr-only">Loading</div>
    <div className={`spinner`}>
      <div className="lspinner"></div>
    </div>
  </>
);

export default LoadSpinner;
