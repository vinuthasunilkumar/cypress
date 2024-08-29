import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import SingleDropDown from "../../../shared/pages/SingleDropDown";
import { ExportStockMedicationRequestDto, StockMedicationLocation, StockMedicationSupplyRequiredFields, exportSMSupplyFieldsToValidate } from "../../../models/class/StockMedicationSupply";
import { DropdownItem } from "../../../models/class/FrequencyAdministration";
import SingleColumnMultiSelectDD from "../../../shared/pages/SingleColumnMultiSelectDD";
import { loadUnitsByFacilityId } from "../../../services/CustomerService";
import { STOCK_MED_MESSAGES, StockMedications } from "../../../shared/enum/StockMedicationsEnum";
import { FrequencyAdministration } from "../../../shared/enum/FrequencyAdministrationValidationMessages";
import { exportStockMedications, importStockMedications, importCountStockMedication, getStockMedicationFacilityList } from "../../../services/StockMedicationsService";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const ExportSMSupplyDialog = (props: any) => {
  const hostContext = useSelector((state: RootState) => state.hostContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorFields, setErrorFields] = useState<StockMedicationSupplyRequiredFields[]>(exportSMSupplyFieldsToValidate);
  const [selectedFacility, setSelectedFacility] = useState<DropdownItem | null>(null);
  const [facilityOptions, setFacilityOptions] = useState<DropdownItem[] | null>([]);
  const [selectedUnits, setSelectedUnits] = useState<DropdownItem[] | null>(null);
  const [unitList, setUnitList] = useState<DropdownItem[] | null>([]);
  const [facilityErrorMsg, setFacilityErrorMsg] = useState<string>("");
  const [remountComponent, setRemountComponent] = useState(0);
  const [stockMedLocations, setStockMedLocations] = useState<StockMedicationLocation[]>([]);
  const [showErrorSummary, setShowErrorSummary] = useState<boolean>(false);
  const [importNewTitle, setImportNewTitle] = useState<string>(STOCK_MED_MESSAGES.Import_Dialog_Title(null));
  const [isUnitsDisabled, setIsUnitsDisabled] = useState<boolean>(props.isImport);
  const corporationId = Number(hostContext?.parentId);
  const ectConfigId = Number(hostContext?.ectConfigId);
  const [globalFacilityId, setGlobalFacilityId] = useState<string>("");
  const [facilityName, setFacilityName] = useState<string>(hostContext.facilityName);

  useEffect(() => {
    if (sessionStorage.getItem("selectedSMSupplyLibraryDetails")) {
      const selectedSMLibraryDetails = JSON.parse(
        sessionStorage.getItem("selectedSMSupplyLibraryDetails")!
      );
      setGlobalFacilityId(selectedSMLibraryDetails.globalFacilityId);
    }
    if (props.showConfirmModal) {
      setShowConfirmModal(props.showConfirmModal);
      getFacilityListAsyn();
      if (selectedFacility === null) {
        setUnitList([]);
        setStockMedLocations([]);
        setSelectedUnits([]);
      }
    }
    let selectedSMLibraryDetails;
        if (sessionStorage.getItem("selectedSMSupplyLibraryDetails")) {
            selectedSMLibraryDetails = JSON.parse(
                sessionStorage.getItem("selectedSMSupplyLibraryDetails")!
            );
            setFacilityName(selectedSMLibraryDetails.description);
        }
  }, [props.showConfirmModal, selectedFacility]);

  useEffect(() => {
    if (props.isImport || selectedFacility !== null) {
      setIsUnitsDisabled(false);
    } else {
      setIsUnitsDisabled(true);
    }
  }, [props.isImport, selectedFacility]);

  const getFacilityListAsyn = async () => {
    let pageSize: number = 200;
    if (sessionStorage.getItem("selectedSMSupplyLibraryDetails")) {
      const selectedSMLibraryDetails = JSON.parse(
        sessionStorage.getItem("selectedSMSupplyLibraryDetails")!
      );
      pageSize = selectedSMLibraryDetails.totalCount;
    }
    let userFacilityResult: any = await getStockMedicationFacilityList(1, "", pageSize, corporationId, ectConfigId, false);
    let tempFaciliyOptions: DropdownItem[] = [];
    if (userFacilityResult) {
      userFacilityResult.stockMedicationLibraries?.forEach((item: any) => {
        if (item.globalFacilityId !== globalFacilityId && item.globalFacilityId !== null) {
          const objItem: DropdownItem = {
            id: item.globalFacilityId,
            value: item.description,
            label: item.description,
          }
          tempFaciliyOptions.push(objItem);
        }
      });
    }
    setFacilityOptions(tempFaciliyOptions);
  }

  const handleOk = async () => {
    validateFields(selectedFacility !== null, "facility", true);
    setFacilityErrorMsg(selectedFacility === null ? StockMedications.FacilityRequiredMessage : "");
    if (selectedFacility !== null) {
      const request: ExportStockMedicationRequestDto = {
        stockMedicationLocation: stockMedLocations
      }
      let response;
      let msg = "";
      if (props.isImport) {
        response = await importStockMedications(props.selectedStockMedIds!.toString(), globalFacilityId, selectedFacility?.value?.toString(), request);
      } else {
        response = await exportStockMedications(props.selectedStockMedIds!.toString(), selectedFacility?.value?.toString(), globalFacilityId, request);
      }
      if (response) {
        const totalCount = Object.keys(response);
        const exportImportCount = Object.values(response);
        const requestIdsCount = totalCount[0];
        const responseCount = exportImportCount[0];
        if (props.selectedCount === responseCount) {
          msg = props.isImport ? STOCK_MED_MESSAGES.Import_All() : STOCK_MED_MESSAGES.Export_All();
        } else {
          if (props.isImport && Number(responseCount) === Number(requestIdsCount) && Number(responseCount) !== 0 && Number(requestIdsCount) !== 0) {
            msg = STOCK_MED_MESSAGES.Import_All();
          } else {
            msg = props.isImport ?
              STOCK_MED_MESSAGES.Import_Message(responseCount as number, Number(requestIdsCount!)) :
              STOCK_MED_MESSAGES.Export_Message(responseCount as number, Number(requestIdsCount!));
          }
        }
      } else {
        msg = props.isImport ?
          STOCK_MED_MESSAGES.Import_Message(0, props.selectedCount) :
          STOCK_MED_MESSAGES.Export_Message(0, props.selectedCount);
      }
      resetAndClosePopup();
      setShowConfirmModal(false);
      props.confirmOk(true, msg);
    }
  };

  const handleClose = () => {
    resetAndClosePopup()
    props.confirmCancel(false);
  };

  const resetAndClosePopup = () => {
    setShowConfirmModal(false);
    resetErrorsSummary();
    setErrorFields(exportSMSupplyFieldsToValidate);
    setFacilityErrorMsg("");
    setSelectedFacility(null);
    resetUnits();
    setImportNewTitle("");
  }

  const validateFields = (isValid: boolean, fieldName: string, isShowSummary: boolean) => {
    errorFields.find(x => x.fieldName === fieldName)!.isValid = isValid;
    errorFields.forEach(element => {
      if (props.isImport) {
        element.label = FrequencyAdministration.ImportFrom;
      } else {
        element.label = FrequencyAdministration.ExportTo;
      }
    });
    setErrorFields([...errorFields]);
    setShowErrorSummary(isShowSummary!);
  }

  const resetUnits = () => {
    setSelectedUnits(null);
    setUnitList(null);
    setStockMedLocations([]);
  }

  const getImportFacilityRecordCount = async (facilityStrVal: string | number) => {
    return await importCountStockMedication(facilityStrVal?.toString());
  }

  const handleDropDownChange = async (item: DropdownItem | DropdownItem[], type: string) => {
    if (type === "ddlFacility") {
      if (Array.isArray(item)) {
        setSelectedFacility(item[0]);
        toggleUnitsDisabled(item);
      } else {
        validateFields(item !== null, "facility", false);
        setSelectedFacility(item);
        setFacilityErrorMsg(item === null ? StockMedications.FacilityRequiredMessage : "");
        if (!props.isImport) {
          if (item !== null && selectedFacility === null) {
            loadUnitsByFacility(item?.value?.toString());
          } else if (item !== null && item.label !== selectedFacility?.label) {
            loadUnitsByFacility(item?.value?.toString());
            resetUnits();
          } else if (item === null) {
            resetUnits();
          }
        }
        setImportStockMedicationsTitle(item);
      }
      toggleUnitsDisabled(item);
    }
    if (type === "ddlUnits") {
      const usersSelectedUnits = item as DropdownItem[];
      let userstockMedLocations: StockMedicationLocation[] = [];
      if (usersSelectedUnits.length) {
        usersSelectedUnits?.forEach((element: DropdownItem) => {
          const objNew: StockMedicationLocation = {
            id: 0,
            stockMedicationId: 0,
            unitId: element.value!.toString()
          };
          userstockMedLocations.push(objNew);
        });
        setSelectedUnits(usersSelectedUnits);
        setStockMedLocations(userstockMedLocations);
      } else {
        setSelectedUnits([]);
      }
    }
  }

  const toggleUnitsDisabled = (val: DropdownItem | DropdownItem[]) => {
    if (val !== null) {
      setIsUnitsDisabled(false);
    } else {
      setIsUnitsDisabled(true);
    }
  }

  const setImportStockMedicationsTitle = async (item: DropdownItem) => {
    if (item !== null) {
      let recordCount = await getImportFacilityRecordCount(item.value!);
      setImportNewTitle(STOCK_MED_MESSAGES.Import_Dialog_Title(recordCount));
    } else {
      setImportNewTitle(STOCK_MED_MESSAGES.Import_Dialog_Title(null));
    }
  }
  

  useEffect(() => {
    if (props.isImport) {
      loadUnitsByFacility(globalFacilityId);
    }
  }, [props.isImport])

  const loadUnitsByFacility = async (facilityId: string) => {
    let unitListResponse = await loadUnitsByFacilityId(facilityId);
    let newextractedResponse = extractUnits(unitListResponse);
    setUnitList(newextractedResponse);
    // Create an array to store random values
    const randomValues = new Uint32Array(1);
    // Use crypto.getRandomValues() to fill the array with cryptographically secure random values
    crypto.getRandomValues(randomValues);
    // Access the random value from the array
    const random = randomValues[0] / (0xffffffff + 1);
    // Use the random value as needed
    setRemountComponent(random);
  }

  const extractUnits = (data: any[]): { value: string; label: string }[] => {
    return data.map(unit => ({ value: unit.id, label: unit.unitName }));
  };

  const resetErrorsSummary = () => {
    errorFields.forEach(x => x.isValid = true);
    setErrorFields([...errorFields]);
  }

  const onErrorDialogClose = () => {
    setShowErrorSummary(false);
  }

  const getErrorsCountMessage = () => {
    let errorFieldCount = errorFields.filter(x => !x.isValid).length;
    if (errorFieldCount === 0) {
      setShowErrorSummary(false);
    }
    return errorFieldCount === 1 ? `${errorFieldCount} Error found` : `${errorFieldCount} Errors found`;
  }

  const navigateAndSetFocus = (fieldName: string) => {
    document?.getElementById(fieldName)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <Modal
      show={showConfirmModal}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title style={{ width: "100%" }}>
          <h4 className="modal-title">
            {
              props.iconClass && (<i className={props.iconClass} style={{ marginRight: "10px" }}></i>)
            }
            <b>{props.isImport && importNewTitle ? importNewTitle : props.title}</b>
          </h4>
          <button type="button"
            style={{ display: "flex", marginTop: "-20px", float: "right" }}
            id="btnCloseModal"
            data-testid="CloseModalBtn"
            className="close-dialog-btn"
            data-dismiss="modal"
            onClick={handleClose}
            onKeyDown={(event) => { event.key === "Tab" && event.shiftKey && event.preventDefault() }}
            onKeyUp={(event) => { event.type === "keydown" && event.key === "Enter" && handleClose() }}
            tabIndex={1} 
          >
            <i className="fa fa-times"></i>
          </button>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row m-0">
          {
            showErrorSummary && (
              <div className="col-md-12 p-0">
                <div className="alert alert-danger mb-0">
                  <i
                    id="alert-error-close-btn"
                    data-testid="alert-error-close-btn"
                    className="alert-close"
                    aria-hidden="true"
                    onClick={onErrorDialogClose}
                  ></i>
                  {
                    <h6 id="num-of-errors-found">
                      {getErrorsCountMessage()}
                    </h6>
                  }
                  <div className="alert-message-container">
                    {
                      errorFields.map((item) => (
                        <div key={item.fieldId}>
                          <button
                            data-testid="focusToField"
                            onClick={(e) => navigateAndSetFocus(item.fieldId!)}
                            onKeyDown={(e) => navigateAndSetFocus(item.fieldId!)}
                            className="error-message-button"
                          >
                            {item.label}
                          </button>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            )
          }
        </div>
        <div className={`row m-0 ${showErrorSummary ? "mt-2" : ""}`}>
        </div>
        <div className="row m-0 p-0" id="facility">
          <div className="col-md-12 m-0 p-0">
            <SingleDropDown
              id="ddlFacility"
              dataFieldId="id"
              dataFieldValue="value"
              datafile={facilityOptions}
              isSearchable={true}
              icon={null}
              placeholder="Select..."
              value={selectedFacility}
              selectLabelText={props.isImport ? FrequencyAdministration.ImportFrom : FrequencyAdministration.ExportTo}
              isSortByDataFieldId={true}
              isSearchIconNotRequired={true}
              isBlankOptionNotRequired={true}
              lableClassName="input-required mb-0"
              errorMessage={facilityErrorMsg}
              pageSize={5}
              onChange={(id) => handleDropDownChange(id, "ddlFacility")}
              tabIndex={2}              
            />
          </div>
        </div>
        <div className="row m-0 p-0">
          <div className={`form-group col-md-12 m-0 p-0`}>
            <div className="d-flex align-items-baseline inline-message im-notification">
              <span className="ml-2">
                {props.isImport ? StockMedications.StockMedicationImportIMessage : StockMedications.StockMedicationExportIMessage}
              </span>
            </div>
          </div>
        </div>
        <div className='row m-0 p-0'>
          <h4 className='col-md-12 mt-3 m-0 p-0'><b>  {props.isImport ? FrequencyAdministration.AssignImportedList : FrequencyAdministration.AssignExportedList}</b></h4>
        </div>
        <div className="row m-0 p-0" key={remountComponent}>
          <div className="col-md-12 m-0 p-0">
            <SingleColumnMultiSelectDD
              id="ddlUnits"
              dataFieldId="value"
              dataFieldValue="label"
              datafile={unitList}
              isSearchable={true}
              icon={null}
              placeholder="Choose an option"
              value={selectedUnits}
              isSearchIconNotRequired={true}
              isBlankOptionNotRequired={true}
              selectLabelText={props.isImport ? `Select ${facilityName?.toString()} Units` : STOCK_MED_MESSAGES.Export_Units_Label(selectedFacility?.label.toString())}
              isClearableNotRequired={true}
              hideSelectedValues={true}
              onChange={(id) => handleDropDownChange(id, "ddlUnits")}
              isDisabled={isUnitsDisabled}
              tabIndex={3}
            />
          </div>
        </div>
        <div className="row m-0 p-0">
          <div className={`form-group col-md-12 m-0 p-0`}>
            <div className="d-flex align-items-baseline inline-message im-notification">
              <span className="ml-2">
                {StockMedications.StockMedicationDefaultIMessage}
              </span>
            </div>
          </div>
        </div>
        {
          selectedUnits?.length! > 0 && (
            <div className="row m-0 p-0">
              <div className="col-md-12 m-0 p-0 assigned-to-box">
                <div className="form-group mb-0 p-1">
                  <label htmlFor="selectedUnits" className={`col-form-label p-0`}>Selected Units</label><br />
                  <span id="selectedUnits">
                    {
                      selectedUnits?.map((item, index) => (
                        <span key={item.value}>
                          {item.label}
                          {index !== selectedUnits.length - 1 && ', '}
                        </span>
                      ))
                    }
                  </span>
                </div>
              </div>
            </div>
          )
        }
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          id="btnConfirm"
          data-testid="confirmButton"
          className="btn btn-primary"
          data-dismiss="modal"
          onClick={handleOk}
          tabIndex={4}
        >
          {props.confirmButtonText}
        </button>
        <button
          type="button"
          id="btnCancel"
          data-testid="cancelButton"
          className="btn btn-cancel"
          data-dismiss="modal"
          onClick={handleClose}
          tabIndex={5}
        >
          {props.cancelButtonText}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
export default ExportSMSupplyDialog;
