import React from "react";
import { Form } from "react-bootstrap";

const Switch = (props: any) => {

  const onChangeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    props.onClick(
      isChecked,
      props.controlName,
      props.customMedicationId
    );
  };

  return (
    <Form.Check
      type="switch"
      className="custom-control custom-switch"
      style={{ zIndex: 0 }}
    >
      <Form.Check.Input
        id={props.controlName}
        name={props.controlName}
        className="custom-control-input"
        checked={props.isToggled}
        onChange={onChangeToggle}
        value={props.isToggled}
      />
      <Form.Check.Label
        data-testid={props.controlName}
        htmlFor={props.controlName}
        className="custom-control-label"
      >
        {props.icon ? <i className={`${props.icon} mr-1`}></i> : <></>}
        {props.label}
      </Form.Check.Label>
    </Form.Check>
  );
};
export default Switch;
