import React, { useEffect, useRef, useState, ClipboardEvent } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Modal from "react-bootstrap/Modal";
import {
  CustomMedicationLibraryConstants,
  CustomMedicationLibraryMsgEnum,
} from "../../../shared/enum/CustomMedicationLibrary";
import {
  CustomMedicationLibraryForm,
  CustomMedicationLibraryRequestDto,
} from "../../../models/class/CustomMedicationLibrary";
import Switch from "../../../shared/pages/Switch";
import { ToggleButton } from "../../../models/class/ToggleButton";
import { useNavigate } from "react-router-dom";
import {
  AddNewCustomMedicationLibrary,
  UpdateCustomMedicationLibrary,
  getAssignedFacilitiesByCmlId,
} from "../../../services/CustomMedicationLibraryService";
import { createMap, createMapper, forMember, mapFrom } from "@automapper/core";
import { classes } from "@automapper/classes";
import { RemoveSpaces } from "../../../helper/Utility";
import { ICusotmMedicationLibrarySaveResponse } from "../../../models/interface/ICustomMedicationLibrarySaveResponse";
import { ICustomMedicationLibrary } from "../../../models/interface/ICustomMedicationLibrary";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { OrderPlatformConfigurationRouteEnum } from "../../../shared/enum/OrderPlatFormConfigurationEnum";

const CustomMedicationLibrary = (props: CustomMedicationLibraryProps) => {
  const navigate = useNavigate();
  const hostContext = useSelector((state: RootState) => state.hostContext);
  const basePath = hostContext.basePath;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [addNewMode, setAddNewMode] = useState(true);
  const [showNotifyOnLostString, setShowNotifyOnLostString] = useState(false);
  const [textLength, setTextLength] = useState(0);
  const [showApiResponseMsg, setShowApiResponseMsg] = useState(false);
  const btnSaveLibraryRef = useRef<HTMLButtonElement>(null);
  const [requestResponse, setRequestResponse] = useState({
    textMessage: "",
    alertClassName: "",
  });

  const [
    customMedicationLibraryInactivatePermission,
    setCustomMedicationLibraryInactivatePermission,
  ] = useState(false);

  const [
    customMedicationLibraryEditPermission,
    setCustomMedicationLibraryEditPermission,
  ] = useState(false);

  const [facilityData, setFacilityData] = useState<IUserFacility[]>([]);
  const [showWarningConfirmModal, setShowWarningConfirmModal] = useState(false);
  const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(
    props.confirmButtonText !==
    CustomMedicationLibraryMsgEnum.CustomMedLibraryConfirmButtonText
  );

  useEffect(() => {
    setCustomMedicationLibraryInactivatePermission(
      hostContext.permission.customMedicationLibraryInactivate ?? false
    );
    setCustomMedicationLibraryEditPermission(
      hostContext.permission.customMedicationLibraryEdit ?? false
    );
  }, [hostContext]);

  let statusToggleButton = new ToggleButton();
  statusToggleButton.controlName = "library-status";
  statusToggleButton.label = "Active";
  statusToggleButton.isToggled = true;

  const [statusToggleButtonObj, setStatusToggleButtonObj] =
    useState<ToggleButton>(statusToggleButton);

  useEffect(() => {
    const fetchFacilityData = async () => {
      await getAssignedFacilitiesByCmlId(
        hostContext?.ectConfigId,
        hostContext?.parentId,
        hostContext?.userId,
        Number(props.editLibraryObject?.id ?? 0)
      ).then(async (response: IUserFacility[]) => {
        setFacilityData(response);
      });
    };
    if (showConfirmModal && Number(props?.editLibraryObject?.id ?? 0) > 0) {
      fetchFacilityData();
    }
  }, [showConfirmModal, Number(props?.editLibraryObject?.id ?? 0) > 0]);

  useEffect(() => {
    setAddNewMode(!!props.addNewMode);
    if (props?.editLibraryObject?.id) {
      setValue("Id", props?.editLibraryObject?.id);
      setValue("libraryName", props?.editLibraryObject?.description);
      setValue("status", props?.editLibraryObject?.isActive);
      setValue("corporationId", props.editLibraryObject?.corporationId);
      setTextLength(props.editLibraryObject?.description?.length);
      if (props.editLibraryObject.isActive) {
        setStatusToggleButtonObj((prevState: ToggleButton) => ({
          ...prevState,
          isToggled: true,
          label: "Active",
        }));
      } else {
        setStatusToggleButtonObj((prevState: ToggleButton) => ({
          ...prevState,
          isToggled: false,
          label: "Inactive",
        }));
      }
    }
  }, [props.editLibraryObject?.id, props.showConfirmModal]);

  useEffect(() => {
    if (props.showConfirmModal) {
      setShowConfirmModal(props.showConfirmModal);
      if (
        props.confirmButtonText !==
        CustomMedicationLibraryMsgEnum.CustomMedLibraryConfirmButtonText
      ) {
        setIsBtnDisabled(true);
      }
    }
  }, [props.showConfirmModal]);

  const validationSchema = Yup.object().shape({
    libraryName: Yup.string()
      .required(CustomMedicationLibraryMsgEnum.LibraryNameRequiredMessage)
      .matches(
        /^[a-zA-Z0-9-()/%.`~!@#$^&*()_+-={}[|\t/;:'"<>,.?/|\],\\pPrint ]+$/,
        CustomMedicationLibraryMsgEnum.LibraryNameAllowedCharacter
      )
      .max(
        CustomMedicationLibraryConstants.LibraryNameMaxLength,
        CustomMedicationLibraryMsgEnum.LibraryNameMaxLengthMessage
      ),
  });

  const {
    register,
    reset,
    setValue,
    handleSubmit,
    setFocus,
    getValues,
    trigger,
    formState: { isValid, errors },
  } = useForm<CustomMedicationLibraryForm>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      status: true,
      corporationId: 0,
    },
  });

  // Handle the paste Library Name event
  const handlePasteLibraryName = (event: ClipboardEvent<HTMLInputElement>) => {
    const existingCustMedName = getValues("libraryName");
    const pasteContent = event.clipboardData.getData("text");
    const charactersLength = existingCustMedName?.length + pasteContent?.length;
    if (
      charactersLength > CustomMedicationLibraryConstants.LibraryNameMaxLength
    ) {
      setShowNotifyOnLostString(true);
    }
  };

  // handle Library Name Change & update text/char count on UI
  const handleLibraryNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const data = event.target.value;
    if (
      showNotifyOnLostString &&
      data.length < CustomMedicationLibraryConstants.LibraryNameMaxLength
    ) {
      setShowNotifyOnLostString(false);
    }

    if (data.length <= CustomMedicationLibraryConstants.LibraryNameMaxLength) {
      setTextLength(data.length);
    }
    getUpdateBtnDisable();
  };

  const mapper = createMapper({ strategyInitializer: classes() });

  const mapRequestDto = () => {
    createMap(
      mapper,
      CustomMedicationLibraryForm,
      CustomMedicationLibraryRequestDto,
      forMember(
        (d) => d.Id,
        mapFrom((s) => (s.Id ? s.Id : 0))
      ),
      forMember(
        (d) => d.Description,
        mapFrom((s) => RemoveSpaces(s.libraryName))
      ),
      forMember(
        (d) => d.CorporationId,
        mapFrom((s) =>
          s.corporationId ? s.corporationId : Number(hostContext.parentId)
        )
      ),
      forMember(
        (d) => d.EctConfigId,
        mapFrom((s) =>
          s.ectConfigId ? s.ectConfigId : Number(hostContext.ectConfigId)
        )
      ),
      forMember(
        (d) => d.IsActive,
        mapFrom((s) => s.status)
      )
    );
  };

  // Handle the Save Library or Update Library
  const handleOk = async () => {
    setShowApiResponseMsg(false);
    btnSaveLibraryRef?.current?.blur();
    trigger();
    if (!isValid) setFocus("libraryName");
    const formData = {
      Id: getValues("Id"),
      libraryName: getValues("libraryName"),
      status: getValues("status"),
      corporationId: getValues("corporationId"),
      ectConfigId: getValues("ectConfigId"),
    };
    mapRequestDto();
    const customMedicationLibraryRequest = mapper.map(
      formData,
      CustomMedicationLibraryForm,
      CustomMedicationLibraryRequestDto
    );
    let saveResponse!: ICusotmMedicationLibrarySaveResponse;
    if (isValid && addNewMode) {
      saveResponse = await AddNewCustomMedicationLibrary(
        customMedicationLibraryRequest
      );
    } else if (isValid && !addNewMode) {
      saveResponse = await UpdateCustomMedicationLibrary(
        customMedicationLibraryRequest
      );
    }
    if (saveResponse?.statusCode === 500) {
      setRequestResponse({
        textMessage: saveResponse?.responseMessage,
        alertClassName: "alert alert-danger",
      });
      setShowApiResponseMsg(true);
    } else if (saveResponse?.statusCode === 200) {
      setShowConfirmModal(false);
      let selectedLibraryObj = {
        id: saveResponse.id,
        description: saveResponse.description,
        isActive: saveResponse.status,
        isAssigned: 0,
        corporationId: 0,
      };
      sessionStorage.setItem(
        "selectedLibraryDetails",
        JSON.stringify(selectedLibraryObj)
      );
      if (addNewMode) {
        navigateToCustomMedicationList(
          selectedLibraryObj.id,
          saveResponse?.responseMessage
        );
      } else {
        props.confirmOk!(saveResponse?.responseMessage);
      }
    }
  };

  //To Do Pass HostContext
  const navigateToCustomMedicationList = (Id?: number, message?: string) => {
    navigate(`${basePath}/custom-medications/${Id}`, { state: message });
  };

  // will be called on Close Popup event
  const handleClose = () => {
    reset({ libraryName: "", status: true }, { keepErrors: false });
    setStatusToggleButtonObj((prevState: ToggleButton) => ({
      ...prevState,
      isToggled: true,
      label: "Active",
    }));
    setTextLength(0);
    setShowConfirmModal(false);
    setShowApiResponseMsg(false);
    props.confirmCancel!(false);
  };

  // toggle the state for Library
  const toggleState = (state: boolean, label: string) => {
    if (state === false && facilityData?.length > 0) {
      setShowWarningConfirmModal(true);
      setValue("status", true);
    } else {
      setValue("status", state);
      if (state) {
        setStatusToggleButtonObj((prevState: ToggleButton) => ({
          ...prevState,
          isToggled: state,
          label: "Active",
        }));
      } else {
        setStatusToggleButtonObj((prevState: ToggleButton) => ({
          ...prevState,
          isToggled: state,
          label: "Inactive",
        }));
      }
    }
    getUpdateBtnDisable();
  };

  const confirmOkDefault = () => {
    setShowWarningConfirmModal(false);
  };
  // called on closing API response msg if any
  const closeApiResponseMsg = () => {
    setShowApiResponseMsg(false);
  };

  const navigateToFacilitySetup = (id: number) => {
    const obj = facilityData.find((x) => x.facilityId === id);
    if (obj) {
      let selectedFacility: IUserFacility = {
        facilityId: obj.facilityId,
        facilityName: obj.facilityName,
        corporateId: obj.corporateId,
        userId: obj.userId,
        ectConfigId: Number(hostContext?.ectConfigId),
        showFacilitySetup: false
      };

      navigate(`${basePath}${OrderPlatformConfigurationRouteEnum.OrderPlatformConfigurationFacilityList}/${id}`,
        {
          state: {
            isFromCustomMedicationLibrary: JSON.stringify(selectedFacility),
          }
        }
      );
    }
  };

  const assignedFacilitiies = () => {
    return (
      <>
        {facilityData?.map((val, key) => {
          return (
            <div key={"div" + key.toString()}>
              <button
                key={val.facilityId}
                data-testid={"btn" + key.toString()}
                className="anchor-button"
                tabIndex={0}
                onClick={() => navigateToFacilitySetup(val?.facilityId)}
                style={{
                  textDecoration: "underline",
                }}
              >
                {val.facilityName}
              </button>
            </div>
          );
        })}
      </>
    );
  };

  const getUpdateBtnDisable = () => {
    if (
      props.confirmButtonText === "Update" &&
      props.editLibraryObject?.id! > 0
    ) {
      const formData = {
        libraryName: getValues("libraryName"),
        status: getValues("status"),
      };
      if (
        formData.status === props.editLibraryObject!.isActive &&
        formData.libraryName === props.editLibraryObject!.description
      ) {
        setIsBtnDisabled(true);
      } else {
        setIsBtnDisabled(false);
      }
    }
  };

  if (!customMedicationLibraryEditPermission) {
    return (
      <div>
        <h1>MultiCare Platform</h1>
        <div className="alert alert-danger" role="alert">
          <div className="alert-message-container">
            You do not have permission(s)/security token(s) to perform this
            action. If you need to perform this task, please contact your Unit
            Supervisor or System Administrator to grant you the necessary
            permission(s)/security token(s)
            <br />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Modal
        show={showConfirmModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title style={{ width: "100%" }}>
            <h4 className="modal-title">{props.title}</h4>
            <span
              style={{ display: "flex", marginTop: "-20px", float: "right" }}
              id="btnCloseModal"
              data-testid="CloseModalBtn"
              className="close-dialog-btn"
              data-dismiss="modal"
              onClick={handleClose}
              onKeyDown={handleClose}
            >
              <i className="fa fa-times" style={{ marginRight: "10px" }}></i>
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form noValidate data-testid="form" onSubmit={handleSubmit(handleOk)}>
            <div className="row">
              <div className="col-12">
                {showApiResponseMsg &&
                  requestResponse.alertClassName &&
                  requestResponse.textMessage ? (
                  <div
                    className={`mb-0 ${requestResponse.alertClassName}`}
                    role="alert"
                  >
                    <i
                      id="btnCloseApiRespMsg"
                      data-testid="alert-error-close-btn"
                      className="alert-close"
                      aria-hidden="true"
                      onClick={closeApiResponseMsg}
                    ></i>
                    {requestResponse.textMessage}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="row">
              <div
                className={`form-group col-md-12 mb-0 m-0 p-0 ${showNotifyOnLostString ? "has-warning" : ""
                  } ${errors.libraryName ? "has-error has-feedback" : ""}`}
              >
                <label
                  htmlFor="libraryName"
                  id="lbl-libraryName"
                  className={`col-form-label p-0 ${errors.libraryName ? "has-error-label" : ""
                    }`}
                >
                  Library Name
                </label>
                <input
                  type="text"
                  tabIndex={0}
                  maxLength={
                    CustomMedicationLibraryConstants.LibraryNameMaxLength
                  }
                  data-testid="txtLibraryName"
                  onPaste={handlePasteLibraryName}
                  id="libraryName"
                  {...register("libraryName", {
                    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                      handleLibraryNameChange(event);
                    },
                  })}
                  className={`form-control ${errors.libraryName ? "has-error has-feedback" : ""
                    }`}
                />
                <span
                  className={`float-right ${errors.libraryName
                    ? "invalid-feedback-message"
                    : "field-warning-message"
                    }`}
                >
                  {textLength}/
                  {CustomMedicationLibraryConstants.LibraryNameMaxLength}
                </span>
                <div
                  className="invalid-feedback-message"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {errors.libraryName?.type === "required" ? (
                    <span>
                      {
                        CustomMedicationLibraryMsgEnum.LibraryNameRequiredMessage
                      }
                    </span>
                  ) : (
                    <></>
                  )}
                  {errors.libraryName?.type === "matches" ? (
                    <span>
                      {
                        CustomMedicationLibraryMsgEnum.LibraryNameAllowedCharacter
                      }
                    </span>
                  ) : (
                    <></>
                  )}
                  {errors.libraryName?.type === "max" ? (
                    <span>
                      {
                        CustomMedicationLibraryMsgEnum.LibraryNameMaxLengthMessage
                      }
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
                {showNotifyOnLostString ? (
                  <div
                    className="notifyonloststring"
                    id="notifyonloststringmsg"
                  >
                    {CustomMedicationLibraryMsgEnum.NotifyOnLostStringMessage}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            {customMedicationLibraryInactivatePermission && (
              <div className="row">
                <div className="form-group col-md-12 mb-0 m-0 p-0">
                  <label htmlFor="status" className="col-form-label p-0">
                    Status
                  </label>
                  <div className="inline-message im-notification">
                    <span className="ml-2">
                      Manage availability of this custom medication library for
                      current facility
                    </span>
                  </div>
                  <Switch
                    controlName={statusToggleButtonObj.controlName}
                    isToggled={statusToggleButtonObj.isToggled}
                    label={statusToggleButtonObj.label}
                    onClick={toggleState}
                  ></Switch>
                </div>
              </div>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            id="btnConfirm"
            data-testid="confirmButton"
            className="btn btn-primary"
            ref={btnSaveLibraryRef}
            onClick={handleOk}
            disabled={isBtnDisabled}
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
          >
            {props.cancelButtonText}
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        data-testid="confirmWarningModel"
        show={showWarningConfirmModal}
        onHide={confirmOkDefault}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title style={{ width: "100%" }}>
            <h4 className="modal-title">
              <i
                className={
                  CustomMedicationLibraryMsgEnum.CustomMedLibraryDialogIcon
                }
                style={{ marginRight: "10px" }}
              ></i>{" "}
              {CustomMedicationLibraryMsgEnum.CustomMedLibraryDialogTitle}
            </h4>
            <span
              style={{ display: "flex", marginTop: "-20px", float: "right" }}
              id="btnCloseModal"
              data-testid="CloseModalBtn"
              className="close-dialog-btn"
              data-dismiss="modal"
              onClick={confirmOkDefault}
              onKeyDown={confirmOkDefault}
            >
              <i className="fa fa-times"></i>
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You are about to inactivate this library. The following facilities
          have the library assigned as a Custom Medication Library.
          {assignedFacilitiies()}
          You must reassign a library for the facilities prior to inactivating
          the library.
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            id="btnConfirm"
            data-testid="confirmButton"
            className="btn btn-primary"
            data-dismiss="modal"
            onClick={confirmOkDefault}
          >
            {`Ok`}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default CustomMedicationLibrary;

type CustomMedicationLibraryProps = {
  showConfirmModal?: boolean;
  addNewMode?: boolean;
  title?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmCancel?: Function;
  confirmOk?: Function;
  editLibraryObject?: ICustomMedicationLibrary;
};
