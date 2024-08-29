import React from "react";
import { Link, NavLink } from "react-router-dom";
import MatrixCareLogo from "../../assets/images/MatrixCare_logo.svg";

const Header = () => {
  return (
    <header>      
      <div className="facilityLocation d-none d-md-block">      
        <span>Orderwriter Service
        </span>
      </div>

      <>
        <nav className="navbar navbar-expand-md menu-header navbar-default navbar-light">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#appMenu"
            aria-controls="appMenu"
            aria-expanded="false"
            aria-label="Toggle Navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <Link to="/" className="navbar-brand">
            <img width="280" height="40" alt="MxC logo" src={MatrixCareLogo} />
          </Link>
          <button
            className="navbar-toggler avatar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle Navigation"
          >
            <img
              alt="Neutral"
              className="rounded-circle user-avatar ll"
              width="40"
              height="40"
              src="../../images/neutral.jpg"
              title="Neutral"
            />{" "}
          </button>
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">{/* {loginLink} */}</li>
              <li className="nav-item">
                <a id="navbarLogOffCommand" className="nav-link" href="/">
                  Log Off
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#nullURL"
                  id="navbarUsernameMenu"
                  data-toggle="dropdown"
                  data-boundary="window"
                  data-offset="25px"
                  aria-expanded="false"
                >
                  <img
                    src="../../images/neutral.jpg"
                    className="rounded-circle"
                    width="40"
                    height="40"
                    alt="Neutral"
                  />
                  {localStorage?.getItem("nameOfUser")}
                </a>
              </li>
              <li className="nav-item dropdown d-none">
                <a
                  className="nav-link dropdown-toggle dropdown-usermenu"
                  href="#nullURL"
                  id="navbarUsernameMenu"
                  data-toggle="dropdown"
                  data-boundary="window"
                  data-offset="25px"
                  aria-expanded="false"
                >
                  <img
                    src="../../images/neutral.jpg"
                    className="rounded-circle"
                    width="40"
                    height="40"
                    alt="Neutral"
                  />
                  {localStorage?.getItem("nameOfUser")}
                </a>
                <div
                  className="dropdown-menu dropdown-menu-positioned"
                  aria-labelledby="navbarUsernameMenu"
                >
                  <a
                    className="dropdown-item"
                    href="#nullURL"
                    onClick={() =>
                      window.open(
                        process.env.REACT_APP_OKTA_BASE_URL +
                        "/enduser/settings",
                        "_blank",
                        "toolbar=no,scrollbars=yes,resizable=no,top=500,left=300,width=800,height=800"
                      )
                    }
                  >
                    Profile
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </nav>
        <nav className="navbar navbar-expand-md menu-bar menu-shadow menu-bar-light">
          <div className="collapse navbar-collapse" id="appMenu">
            <ul className="nav justify-content-center">
              <li className="nav-item">
                <NavLink id="navbarHomeCommand" className="nav-link" to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  id="navbarOrderCommand"
                  className="nav-link"
                  to="/medication-search"
                >
                  Medication Search
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  id="navbarCustomMedicationCommand"
                  className="nav-link"
                  to="/custom-medication-libraries"
                >
                  Custom Medication
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  id="navbarFacilitySetup"
                  className="nav-link"
                  to="/facility-setup"
                >
                  Facility
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  id="navbarFrequencyAdministrations"
                  className="nav-link"
                  to="/schedule-list"
                >
                  Frequency and Administration
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  id="navbarStockMedications"
                  className="nav-link"
                  to="/stock-medications"
                >
                  Stock Medications
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </>
    </header>
  );
};

export default Header;
