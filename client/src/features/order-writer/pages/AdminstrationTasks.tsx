import React from "react";

const AdminstrationTasks = () => {
  return (
    <div className="form-group mt-2">
      <label
        id="instructions2"
        style={{ fontSize: "20px" }}
        htmlFor="txtAdminstrationTasks"
      >
        Adminstration Tasks
      </label>
      <input className="visually-hidden" id="txtAdminstrationTasks" />
    </div>
  );
};

export default AdminstrationTasks;
