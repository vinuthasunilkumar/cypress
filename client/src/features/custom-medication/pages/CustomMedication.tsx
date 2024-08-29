import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  ClipboardEvent,
} from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { AsyncPaginate, wrapMenuList } from "react-select-async-paginate";
import {
  ActionMeta,
  GroupBase,
  InputActionMeta,
  MultiValue,
  OptionsOrGroups,
} from "react-select";
import LoadSpinner from "../../../shared/common-ui/LoadSpinner";
import {
  loadIngredients,
  loadMedicationGroups,
} from "./../../../services/CustomMedicationService";
import ConfirmDialog from "../../../shared/pages/ConfirmDialog";
import { CustomMedicationMessages } from "../../../shared/enum/CustomMedMsgEnums";
import { CustomMedicationsConstants } from "../../../shared/enum/CustomMedicationsConstants";
import scheduleOptions from "./../../../assets/static-files/ScheduleOptions.json";
import {
  CustomMedicationForm,
  CustomMedicationRequestDto,
  EditCustomMedicationResponseDto,
} from "../../../models/class/CustomMedicationForm";
import { ToggleButton } from "../../../models/class/ToggleButton";
import { createMapper } from "@automapper/core";
import { classes } from "@automapper/classes";
import Switch from "../../../shared/pages/Switch";
import ConfirmDeleteDialog from "../../../shared/pages/ConfirmDeleteDialog";
import {
  AddNewCustomMedication,
  DeleteCustomMedication,
  GetCustomMedicationById,
  UpdateCustomMedication,
} from "../../../services/CustomMedicationService";
import { IMedGroups } from "../../../models/interface/IMedGroups";
import { ICustomMedicationLibrary } from "../../../models/interface/ICustomMedicationLibrary";
import { ICustomMedication } from "../../../models/interface/ICustomMedication";
import DropdownIndicator from "../../../shared/pages/DropdownContainer";
import { customStyles } from "../../../shared/constants/CustomStylesForDropdown";
import { ICustomMedicationsSaveResponse } from "../../../models/interface/ICustomMedicationsSaveResponse";
import { ErrorSummary } from "./ErrorSummary";
import { mapRequestDto } from "./SaveRequestMapper";
import { mapEditDto } from "./EditRequestMapper";
import { ValidationSchema } from "./ValidationSchema";
import ValueContainer from "./ValueContainer";
import { IngredientsMenuOptionsList } from "./IngredientsMenuOptionsList";
import CheckboxOptionsForIngredients from "./CheckboxOptionsForIngredients";
import CheckboxOptionsForMedGroups from "./CheckboxOptionsForMedGroups";
import SelectedMedGroups from "./SelectedMedGroups";
import SelectedIngredients from "./SelectedIngredients";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import SingleDropDown from "../../../shared/pages/SingleDropDown";
import { DropdownItem } from "../../../models/class/FrequencyAdministration";

const CustomMedication = () => {
  const { customMedicationId } = useParams();
  const hostContext = useSelector((state: RootState) => state.hostContext);
  const basePath = hostContext.basePath;

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingHostContext, setIsLoadingHostContext] = useState(true);
  const isLoading = isLoadingData || isLoadingHostContext;
  const addNewMode = !!(
    customMedicationId === undefined || customMedicationId === null
  );
  const navigate = useNavigate(); //used for routing
  const [selectedIngredients, setSelectedIngredients] = useState<
    IMedicationSearchResults[]
  >([]); // used for displaying the selected Ingredients
  const [selectedMedGroups, setSelectedMedGroups] = useState<IMedGroups[]>([]); // used for displaying the selected Medication Groups
  const [selectedDeaScheduleOption, setSelectedDeaScheduleOption] =
    useState<DropdownItem | null>(null); // will be used for handling the selected Schedule Dropdown value
  const [deaScheduleErrorMessage, setDeaScheduleErrorMessage] = useState<string | null>(CustomMedicationMessages.DeaScheduleRequiredMessage);
  const [isControlledSubstanceFlag, setIsControlledSubstanceFlag] =
    useState<boolean>(false); // used for displaying the Schedule Dropdown
  const [textLength, setTextLength] = useState<number>(0);
  const [residentId, setResidentID] = useState(hostContext.residentId);
  const [baseUrl, setBaseUrl] = useState(hostContext.baseUrl);
  const [ingredientName, setIngredientName] = useState<string>(""); // used set and display the Ingreident name in Async Paginate
  const [medicationGroupName, setMedicationGroupName] = useState<string>("");
  const [isMedicationGroupNameChanged, setIsMedicationGroupNameChanged] =
    useState<boolean>(false);
  const [isSaveBtnClicked, setIsSaveBtnClicked] = useState<boolean>(false);
  const [showNotifyOnLostString, setShowNotifyOnLostString] =
    useState<boolean>(false);
  const [showApiResponseMsg, setShowApiResponseMsg] = useState<boolean>(false);
  let medGroupsOptions: IMedGroups[] = [];
  let ingredientOptions: IMedicationSearchResults[] = [];
  const [showErrorSummary, setShowErrorSummary] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isControlledSubstanceChecked, setIsControlledSubstanceChecked] =
    useState<boolean | null>();
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
    useState<boolean>(false);
  const [editCustomMedicationsData, setEditCustomMedicationsData] =
    useState<ICustomMedication | null>(null);
  const [libraryDetails, setLibraryDetails] =
    useState<ICustomMedicationLibrary>();
  const btnDeleteRef = useRef<HTMLButtonElement>(null);
  const btnCancelRef = useRef<HTMLButtonElement>(null);
  const btnSaveRef = useRef<HTMLButtonElement>(null);
  const pageLength: number = 10; // used for displaying the items in Ingredients Multiselect DropDown

  const [
    customMedicationLibraryInactivatePermission,
    setCustomMedicationLibraryInactivatePermission,
  ] = useState(false);
  const [
    customMedicationDeletePermission,
    setCustomMedicationDeletePermission,
  ] = useState(false);
  const [
    customMedicationLibraryEditPermission,
    setCustomMedicationLibraryEditPermission,
  ] = useState(false);

  useEffect(() => {
    setCustomMedicationLibraryInactivatePermission(
      hostContext.permission.customMedicationLibraryInactivate ?? false
    );
    setCustomMedicationDeletePermission(
      hostContext.permission.customMedicationDelete ?? false
    );
    setCustomMedicationLibraryEditPermission(
      hostContext.permission.customMedicationLibraryEdit ?? false
    );
    setIsLoadingHostContext(false);
  }, [hostContext]);

  let statusToggleButton = new ToggleButton();
  statusToggleButton.controlName = "status";
  statusToggleButton.label = "Active";
  statusToggleButton.isToggled = true;

  const [statusToggleButtonObj, setStatusToggleButtonObj] =
    useState<ToggleButton>(statusToggleButton);

  const [requestResponse, setRequestResponse] = useState({
    textMessage: "",
    alertClassName: "",
  });

  // Call Get By Id API Here
  const getDataForEditCustomMedications = async (id: number) => {
    if (id) {
      //calling API & stroing response
      const editCustomObj = await GetCustomMedicationById(id);
      // pass the response object to assign data to UI fields
      if (editCustomObj) {
        setEditCustomMedicationObj(editCustomObj);
        setEditCustomMedicationsData(editCustomObj);
      }
    }
  };
  // Assign & set Form UI data
  const setEditCustomMedicationObj = (
    customMedicationData: ICustomMedication
  ) => {
    if (customMedicationData) {
      customMedicationData.isControlledSubstance =
        customMedicationData.deaClassId != 0 &&
          customMedicationData.deaClassId != null
          ? true
          : false;
      setTextLength(customMedicationData.description?.length);
      const selectedSchedule = scheduleOptions.find(x => x.id === customMedicationData.deaClassId);
      if (selectedSchedule) {
        const newOption: DropdownItem = {
          label: selectedSchedule.label,
          value: selectedSchedule.id,
        }
        setSelectedDeaScheduleOption(newOption);
      }
      let statusToggleButton = new ToggleButton();
      statusToggleButton.controlName = "status";
      statusToggleButton.label = customMedicationData.isActive
        ? "Active"
        : "Inactive";
      statusToggleButton.isToggled = customMedicationData.isActive;
      setStatusToggleButtonObj(statusToggleButton);
      setSelectedIngredients(
        customMedicationData.fdbIngredientLists?.length > 0
          ? customMedicationData.fdbIngredientLists
          : []
      );
      setSelectedMedGroups(
        customMedicationData.fdbMedGroupLists?.length > 0
          ? customMedicationData.fdbMedGroupLists
          : []
      );
      const mapper = createMapper({ strategyInitializer: classes() });
      mapEditDto(mapper);
      const editObject = mapper.map(
        customMedicationData,
        EditCustomMedicationResponseDto,
        CustomMedicationForm
      );
      const fields: (keyof CustomMedicationForm)[] = [
        "Id",
        "customMedicationName",
        "isControlledSubstance",
        "deaSchedule",
        "fdbMedications",
        "fdbMedGroups",
        "status",
      ];
      fields.forEach((field) => setValue(field, editObject[field]), {
        shouldDirty: false,
      });
      reset({}, { keepValues: true });
      if (customMedicationData.isControlledSubstance) {
        setIsControlledSubstanceFlag(true);
        setIsControlledSubstanceChecked(true);
      } else {
        setIsControlledSubstanceFlag(false);
        setIsControlledSubstanceChecked(false);
      }
    }
  };

  const {
    register,
    unregister,
    setValue,
    handleSubmit,
    reset,
    setFocus,
    getValues,
    control,
    formState: { isValid, errors, isDirty },
  } = useForm<CustomMedicationForm>({
    resolver: yupResolver(ValidationSchema),
    mode: "onChange",
    defaultValues: {
      status: true,
    },
  });

  const checkValidateForm = () => {
    btnSaveRef?.current?.blur();
    setShowApiResponseMsg(false);
    setShowErrorSummary(true);
    setIsSaveBtnClicked(true);
  };

  useEffect(() => {
    setIsLoadingData(true);
    if (sessionStorage.getItem("selectedLibraryDetails")) {
      const obj: string | null = sessionStorage.getItem(
        "selectedLibraryDetails"
      );
      setLibraryDetails(JSON.parse(obj!));
    }
    if (customMedicationId) {
      getDataForEditCustomMedications(Number(customMedicationId));
    }
    setIsLoadingData(false);
  }, []);

  useEffect(() => {
    if (isDirty) {
      if (isValid) {
        setShowErrorSummary(false);
      } else {
        showErrorSummary
          ? setShowErrorSummary(true)
          : setShowErrorSummary(false);
      }
    }
  }, [isValid, errors]);

  const closeApiResponseMsg = () => {
    setShowApiResponseMsg(false);
  };

  const isObjectEmpty = (obj: any) => {
    return Object.keys(obj).length === 0;
  }

  const onSubmitHandler = async (data: any) => {
    setIsSaveBtnClicked(true);
    setShowErrorSummary(true);
    setShowApiResponseMsg(false);
    if (isValid || isObjectEmpty(errors)) {
      const mapper = createMapper({ strategyInitializer: classes() });
      mapRequestDto(mapper);
      const customMedicationRequest = mapper.map(
        data,
        CustomMedicationForm,
        CustomMedicationRequestDto
      );
      let saveResponse!: ICustomMedicationsSaveResponse;
      if (addNewMode) {
        saveResponse = await AddNewCustomMedication(customMedicationRequest);
      } else {
        saveResponse = await UpdateCustomMedication(customMedicationRequest);
      }
      if (saveResponse?.statusCode === 500) {
        setRequestResponse({
          textMessage: saveResponse?.responseMessage,
          alertClassName: "alert alert-danger",
        });
        setShowApiResponseMsg(true);
      } else if (saveResponse?.statusCode === 200) {
        navigateToList(true, saveResponse?.responseMessage);
      }
    }
  };

  const navigateToList = (isSaved: boolean, message?: string) => {
    if (isSaved)
      navigate(
        `${basePath}/custom-medications/${libraryDetails?.id ? libraryDetails.id : 0
        }`,
        { state: message }
      );
    else
      navigate(
        `${basePath}/custom-medications/${libraryDetails?.id ? libraryDetails.id : 0
        }`
      );
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const data = event.target.value;
    showNotifyOnLostString &&
      data.length < CustomMedicationsConstants.customMedicationNameMaxLength ? (
      setShowNotifyOnLostString(false)
    ) : (
      <></>
    );
    if (
      data.length <= CustomMedicationsConstants.customMedicationNameMaxLength
    ) {
      setTextLength(data.length);
    }
  };

  const handleDropDownChange = (item: DropdownItem, type: string) => {
    switch (type) {
      case "DEASchedule": {
        setSelectedDeaScheduleOption(item);
        setValue("deaSchedule", item?.value!?.toString(), { shouldDirty: true });
        if (item?.label !== "") {
          setDeaScheduleErrorMessage("");
          if (errors && errors.deaSchedule) {
            delete errors.deaSchedule;
          }
        }
        break;
      }
    }
  };
  // used to handle the toggle button for Status
  const toggleState = (state: boolean, label: string) => {
    setValue("status", state, {
      shouldDirty: true,
    });
    // Updating the label for Status based on toggle state
    state
      ? setStatusToggleButtonObj((prevState: ToggleButton) => ({
        ...prevState,
        isToggled: state,
        label: "Active",
      }))
      : setStatusToggleButtonObj((prevState: ToggleButton) => ({
        ...prevState,
        isToggled: state,
        label: "Inactive",
      }));
  };

  useEffect(() => {
    if (!isControlledSubstanceFlag) { setSelectedDeaScheduleOption(null); }
  }, [isControlledSubstanceFlag])

  const controlledSubstanceHandler = (status: boolean) => {
    setIsControlledSubstanceChecked(status);
    setIsControlledSubstanceFlag(status);
    if (!addNewMode && editCustomMedicationsData?.isControlledSubstance) {
      const deaScheduleValue = status
        ? editCustomMedicationsData.deaClassId?.toString()
        : "";
      setValue("deaSchedule", deaScheduleValue);
      if (!status) {
        editCustomMedicationsData.isControlledSubstance = false;
      }
      return;
    }
    if (status) {
      register("deaSchedule");
    } else {
      setSelectedDeaScheduleOption(null);
      unregister("deaSchedule", { keepError: false });
      setValue("deaSchedule", "", {
        shouldDirty: false,
      });
    }
  };

  // Loading an Ingredients Options into a paginated dropdown
  const loadIngredientsOptions = async (
    searchQuery: string,
    loadedOptions: OptionsOrGroups<IMedicationSearchResults, GroupBase<IMedicationSearchResults>>,
    { page }: any
  ) => {
    if (
      searchQuery.length < CustomMedicationsConstants.MinSearchCharactersLength
    ) {
      return {
        options: [],
        hasMore: false,
        additional: {
          page: page + 1,
        },
      };
    }
    let pageNumber = page ? page : 1;
    const responseJSON = await loadIngredients(
      pageNumber,
      searchQuery,
      residentId,
      baseUrl,
      pageLength
    ).then((response: IMedicationSearchResultsDto) => {
      return response;
    });
    return {
      options: responseJSON?.items?.length > 0 ? responseJSON.items : [],
      hasMore:
        page === CustomMedicationsConstants.MaxIngredientsResultsPagesToBeLoaded
          ? false
          : responseJSON?.moreResultsExist,
      additional: {
        page: page + 1,
      },
    };
  };

  const ingredientsMenuList = useCallback(
    wrapMenuList(IngredientsMenuOptionsList),
    []
  );

  // used to add the selected ingredients in a list to display on UI
  const onSelectIngredients = (value: MultiValue<IMedicationSearchResults>) => {
    if (
      value?.length <= CustomMedicationsConstants.MaxIngredientsSelectionLimit
    ) {
      value?.forEach((itm: IMedicationSearchResults) => {
        if (itm) {
          const obj: IMedicationSearchResults = {
            id: itm.id,
            description: itm.description,
            gcnSequenceNumber: itm.hasOwnProperty('elements') ? itm?.elements?.gcnSequenceNumber : itm?.gcnSequenceNumber,
          };
          ingredientOptions.push(obj);
        }
      });
      setSelectedIngredients(ingredientOptions);
      setIngredientName(ingredientName);
      setValue("fdbMedications", ingredientOptions, { shouldDirty: true });
    }
  };

  // will be called once a user has entered something to search for Ingredients
  const onIngredientsNameChanged = useCallback(
    (newInputValue: string, { action }: InputActionMeta) => {
      setIngredientName(newInputValue);
    },
    []
  );

  // will be called once a Dropdown Options List is closed to remove the typed ingredient name
  const onIngredientsDropdownClosed = () => {
    setIngredientName("");
  };

  // used for removing the selected Ingredient item from displayed list
  const HandleRemoveIngredients = (id: number) => {
    const newList = selectedIngredients.filter((item) => item?.id !== id);
    setSelectedIngredients(newList);
    setValue("fdbMedications", newList, { shouldDirty: true });
  };

  const loadMedicationGroupsOptions = async (
    searchQuery: string,
    loadedOptions: OptionsOrGroups<IMedGroups, GroupBase<IMedGroups>>,
    { page }: any
  ) => {
    let query = "";
    let pageNumber = page ? page : 1;
    if (isMedicationGroupNameChanged) {
      if (
        searchQuery.length <
        CustomMedicationsConstants.MinSearchCharactersLength
      ) {
        return {
          options: [],
          hasMore: false,
          additional: {
            page: page + 1,
          },
        };
      }
      query = searchQuery;
    }
    const searchResults = loadMedicationGroups(
      pageNumber,
      query,
      residentId,
      baseUrl
    ).then((response: IMedicationSearchResultsDto) => {
      return response;
    });
    const responseJSON = await searchResults;
    return {
      options: responseJSON?.items?.length > 0 ? responseJSON?.items : [],
      hasMore: responseJSON?.moreResultsExist,
      additional: {
        page: page + 1,
      },
    };
  };

  const onSelectMedicationGroups = (value: MultiValue<IMedGroups>) => {
    if (
      value?.length <=
      CustomMedicationsConstants.MaxMedicationGroupsSelectionLimit
    ) {
      value?.forEach((itm: IMedGroups) => {
        if (itm) {
          const obj: IMedGroups = {
            id: itm.id,
            description: itm.description,
          };
          medGroupsOptions.push(obj);
        }
      });
      setSelectedMedGroups(medGroupsOptions);
      setMedicationGroupName(medicationGroupName);
      setIsMedicationGroupNameChanged(false);
      setValue("fdbMedGroups", medGroupsOptions, { shouldDirty: true });
    }
  };

  const onMedicationGroupNameChanged = useCallback(
    (newInputValue: string, { action }: InputActionMeta) => {
      setMedicationGroupName(newInputValue);
      setIsMedicationGroupNameChanged(true);
    },
    []
  );

  // will be called once a Dropdown Options List is closed to remove the typed medication group name
  const onMedicationGroupsDropdownClosed = () => {
    setMedicationGroupName("");
    setIsMedicationGroupNameChanged(false);
  };

  // used for removing the selected Medication Groups from displayed list
  const HandleRemoveMedGroups = (id: number) => {
    const newList = selectedMedGroups.filter((item) => item.id !== id);
    setSelectedMedGroups(newList);
    setValue("fdbMedGroups", newList, { shouldDirty: true });
  };

  const onErrorDialogClose = () => {
    setShowErrorSummary(false);
  };

  const navigateAndSetFocus = (fieldName: keyof CustomMedicationForm) => {
    setFocus(fieldName);
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const existingCustMedName = getValues("customMedicationName");
    const pasteContent = event.clipboardData.getData("text");
    const charactersLength = existingCustMedName?.length + pasteContent?.length;
    if (
      charactersLength >
      CustomMedicationsConstants.customMedicationNameMaxLength
    ) {
      setShowNotifyOnLostString(true);
    }
  };

  const btnCancelClick = () => {
    btnCancelRef?.current?.blur();
    setShowApiResponseMsg(false);
    if (isDirty || showErrorSummary || isSaveBtnClicked) {
      setShowConfirmModal(true);
    } else {
      navigateToList(false);
    }
  };

  const confirmCancel = () => {
    setShowConfirmModal(false);
  };

  const btnDeleteClick = () => {
    btnDeleteRef?.current?.blur();
    setShowApiResponseMsg(false);
    setShowConfirmDeleteModal(true);
  };

  // CALL DELETE API
  const confirmDeleteOk = async () => {
    setShowConfirmDeleteModal(false);
    setShowApiResponseMsg(false);
    const deleteResponse = await DeleteCustomMedication(
      Number(customMedicationId)
    );
    if (deleteResponse?.status === 404) {
      setRequestResponse({
        textMessage: deleteResponse?.data?.ResponseMessage,
        alertClassName: "alert alert-danger",
      });
      setShowApiResponseMsg(true);
    } else if (deleteResponse?.status === 200) {
      navigateToList(true, deleteResponse?.data?.ResponseMessage);
    } else {
      setRequestResponse({
        textMessage: "An unexpected error occurred.",
        alertClassName: "alert alert-danger",
      });
      setShowApiResponseMsg(true);
    }
  };

  const confirmDeleteCancel = () => {
    setShowConfirmDeleteModal(false);
  };

  if (!customMedicationLibraryEditPermission && !isLoading) {
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
    <div className="container-fluid">
      {isLoading ? (
        <LoadSpinner />
      ) : (
        <>
          <form
            className="custom-form"
            noValidate
            data-testid="form"
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <div className="row m-0 p-0">
              <div className="col-12 mt-3 m-0 p-0">
                <h1>Custom Medication</h1>
                <a
                  className="text-underline-hover"
                  style={{ cursor: "pointer" }}
                  onClick={btnCancelClick}
                >
                  Custom Medication
                </a>{" "}
                &nbsp; / {addNewMode ? "Add New" : "Update"}
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-6">
                <button
                  type="submit"
                  data-testid="btnSave"
                  className="btn btn-success"
                  ref={btnSaveRef}
                  onClick={checkValidateForm}
                >
                  Save
                </button>
                <button
                  type="button"
                  data-testid="btnReset"
                  className="btn btn-outline-secondary"
                  ref={btnCancelRef}
                  onClick={btnCancelClick}
                >
                  Cancel
                </button>
                {!addNewMode && customMedicationDeletePermission ? (
                  <>
                    <button
                      type="button"
                      data-testid="btnDelete"
                      className="ml-lg-5 btn btn-danger"
                      onClick={btnDeleteClick}
                      ref={btnDeleteRef}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <hr />
            <div className="row">
              {showApiResponseMsg ? (
                <div className="col-md-6">
                  {requestResponse.alertClassName &&
                    requestResponse.textMessage ? (
                    <div
                      className={requestResponse.alertClassName}
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
              ) : (
                <></>
              )}
            </div>
            <div className="row">
              {showErrorSummary ? (
                <ErrorSummary
                  errors={errors}
                  navigateAndSetFocus={navigateAndSetFocus}
                  onErrorDialogClose={onErrorDialogClose}
                />
              ) : (
                <></>
              )}
            </div>
            <div className="row">
              <div
                className={`form-group col-md-6 input-required mb-0 ${showNotifyOnLostString ? "has-warning" : ""
                  } ${errors.customMedicationName ? "has-error has-feedback" : ""
                  }`}
                data-toggle="tooltip"
                data-placement="top"
                title="Mandatory field"
              >
                <label
                  htmlFor="customMedicationName"
                  id="lbl-customMedicationName"
                  className={`col-form-label m-0 p-0 ${errors.customMedicationName ? "has-error-label" : ""
                    }`}
                >
                  Custom Medication Name
                </label>
                <input
                  type="text"
                  maxLength={
                    CustomMedicationsConstants.customMedicationNameMaxLength
                  }
                  data-testid="txtCustomMedicationName"
                  data-toggle="tooltip"
                  onPaste={handlePaste}
                  id="customMedicationName"
                  {...register("customMedicationName")}
                  {...register("customMedicationName", {
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      handleTextChange(e);
                    },
                  })}
                  className={`form-control gray-border-control ${errors.customMedicationName ? "has-error has-feedback" : ""
                    }`}
                />
                <span
                  className={`float-right ${errors.customMedicationName
                    ? "invalid-feedback-message"
                    : "field-warning-message"
                    }`}
                >
                  {textLength}/
                  {CustomMedicationsConstants.customMedicationNameMaxLength}
                </span>
                <div
                  className="invalid-feedback-message"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {errors.customMedicationName?.type === "required" ? (
                    <span>
                      {CustomMedicationMessages.CustomMedNameRequiredMessage}
                    </span>
                  ) : (
                    <></>
                  )}
                  {errors.customMedicationName?.type === "matches" ? (
                    <span>
                      {
                        CustomMedicationMessages.CustomMedicationAllowedCharacter
                      }
                    </span>
                  ) : (
                    <></>
                  )}
                  {errors.customMedicationName?.type === "max" ? (
                    <span>
                      {CustomMedicationMessages.CustomMedicationMaxLength}
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
                    {CustomMedicationMessages.NotifyOnLostStringMessage}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="row m-0">
              <div className="col-md-6">
                <div className="row">
                  <div className="form-group col-md-6 input-required mb-0 m-0 p-0">
                    <legend
                      className={`col-form-label m-0 p-0 ${errors.isControlledSubstance ? "has-error-label" : ""
                        }`}
                    >
                      Controlled Substance?
                    </legend>
                    <div className="form-check form-check-inline">
                      <input
                        className={`form-check-input controlledSubtanceRadioBtn ${errors.isControlledSubstance ? "is-invalid" : ""
                          }`}
                        id="isControlledSubstance"
                        value="false"
                        checked={isControlledSubstanceChecked === false}
                        data-testid="notControlledSubstance"
                        {...register("isControlledSubstance", {
                          required: {
                            value: true,
                            message:
                              CustomMedicationMessages.IsControlledSubstanceRequiredMessage as string,
                          },
                        })}
                        onClick={(e) => controlledSubstanceHandler(false)}
                        type="radio"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="isControlledSubstance"
                      >
                        No
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className={`form-check-input controlledSubtanceRadioBtn ${errors.isControlledSubstance ? "is-invalid" : ""
                          }`}
                        id="controlledSubstance"
                        value="true"
                        checked={isControlledSubstanceChecked === true}
                        data-testid="controlledSubstance"
                        {...register("isControlledSubstance", {
                          required: {
                            value: true,
                            message:
                              CustomMedicationMessages.IsControlledSubstanceRequiredMessage as string,
                          },
                        })}
                        onClick={(e) => controlledSubstanceHandler(true)}
                        type="radio"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="controlledSubstance"
                      >
                        Yes
                      </label>
                    </div>
                    <div
                      className={`${errors.isControlledSubstance
                        ? "invalid-feedback-message"
                        : ""
                        }`}
                    >
                      {errors.isControlledSubstance?.type === "nullable" ? (
                        <span>
                          {
                            CustomMedicationMessages.IsControlledSubstanceRequiredMessage
                          }
                        </span>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  {isControlledSubstanceFlag && (
                    <div className="col-md-6">
                      <Controller
                        control={control}
                        {...register("deaSchedule")}
                        render={({ field }) => (
                          <SingleDropDown
                            id="deaSchedule"
                            dataFieldId="id"
                            dataFieldValue="value"
                            datafile={scheduleOptions}
                            isSearchable={false}
                            isClearableNotRequired={true}
                            isSearchIconNotRequired={true}
                            icon={null}
                            placeholder=""
                            value={selectedDeaScheduleOption}
                            isBlankOptionNotRequired={true}
                            selectLabelText="DEA Schedule"
                            lableClassName={isControlledSubstanceFlag ? "input-required" : ""}
                            errorMessage={errors.deaSchedule ? deaScheduleErrorMessage : ""}
                            onChange={(id) => handleDropDownChange(id, "DEASchedule")
                            }
                          />
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6 mb-0">
                <label className="col-form-label p-0" htmlFor="txtIngredientName">
                  Ingredients
                </label>
                {selectedIngredients?.length > 0 ? (
                  <>
                    <span className="badge badge-default ml-1">
                      {selectedIngredients.length}
                    </span>
                    <span className="max-selection-warning-msg">
                      {
                        CustomMedicationMessages.IngredientsMaximumSelectionMessage
                      }
                    </span>
                  </>
                ) : (
                  <></>
                )}
                <div className="input-group ingredient-multiselect">
                  <AsyncPaginate
                    id="ingredients"
                    inputId="txtIngredientName"
                    name="ingredients"
                    loadOptions={loadIngredientsOptions}
                    closeMenuOnSelect={false}
                    getOptionValue={(option) => option.description}
                    getOptionLabel={(option: { description: string }) =>
                      option.description
                    }
                    onChange={(
                      newValue: MultiValue<IMedicationSearchResults>,
                      actionMeta: ActionMeta<IMedicationSearchResults>
                    ) => onSelectIngredients(newValue)}
                    isSearchable={true}
                    isMulti={true}
                    noOptionsMessage={() =>
                      ingredientName.length <
                        CustomMedicationsConstants.MinSearchCharactersLength
                        ? CustomMedicationMessages.SearchCharactersLimitMessage
                        : CustomMedicationMessages.NoResultsFoundMessage
                    }
                    loadingMessage={() =>
                      CustomMedicationMessages.LoadingIngredientsMessage
                    }
                    onInputChange={onIngredientsNameChanged}
                    hideSelectedOptions={false}
                    components={{
                      MenuList: ingredientsMenuList,
                      Option: (props) => (
                        <CheckboxOptionsForIngredients
                          {...props}
                          selectedIngredientsCount={selectedIngredients.length}
                        />
                      ),
                      ClearIndicator: () => null,
                      IndicatorSeparator: () => null,
                      DropdownIndicator: DropdownIndicator,
                      ValueContainer: ValueContainer,
                    }}
                    styles={customStyles}
                    value={selectedIngredients}
                    inputValue={ingredientName}
                    placeholder="Search query here"
                    onMenuClose={onIngredientsDropdownClosed}
                    openMenuOnFocus={true}
                    backspaceRemovesValue={false}
                    additional={{
                      page: 1,
                    }}
                  />
                </div>
                {selectedIngredients?.length == 0 ? (
                  <span className="field-warning-message float-left">
                    {CustomMedicationMessages.NoIngredientsSelectedMessage}
                  </span>
                ) : (
                  <></>
                )}
              </div>
            </div>
            {selectedIngredients?.length > 0 ? (
              <SelectedIngredients
                selectedIngredients={selectedIngredients}
                HandleRemoveIngredients={HandleRemoveIngredients}
              />
            ) : (
              <></>
            )}
            <div className="row">
              <div className="form-group col-md-6 mb-0">
                <label className="col-form-label p-0" htmlFor="txtMedicationGroup">
                  Medication Group
                </label>
                {selectedMedGroups?.length > 0 ? (
                  <>
                    <span className="badge badge-default ml-1">
                      {selectedMedGroups.length}
                    </span>
                    <span className="max-selection-warning-msg">
                      {
                        CustomMedicationMessages.MedicationGroupsMaximumSelectionMessage
                      }
                    </span>
                  </>
                ) : (
                  <></>
                )}
                <div className="input-group ingredient-multiselect">
                  <AsyncPaginate
                    id="medicationGroup"
                    inputId="txtMedicationGroup"
                    name="medicationGroup"
                    loadOptions={loadMedicationGroupsOptions}
                    closeMenuOnSelect={false}
                    getOptionValue={(option) => option.description}
                    getOptionLabel={(option: { description: string }) =>
                      option.description
                    }
                    onChange={(
                      newValue: MultiValue<IMedGroups>,
                      actionMeta: ActionMeta<IMedGroups>
                    ) => onSelectMedicationGroups(newValue)}
                    isSearchable={true}
                    isMulti={true}
                    noOptionsMessage={() =>
                      medicationGroupName.length <
                        CustomMedicationsConstants.MinSearchCharactersLength
                        ? CustomMedicationMessages.SearchCharactersLimitMessage
                        : CustomMedicationMessages.NoResultsFoundMessage
                    }
                    loadingMessage={() =>
                      CustomMedicationMessages.LoadingMedicationGroupsMessage
                    }
                    onInputChange={onMedicationGroupNameChanged}
                    hideSelectedOptions={false}
                    components={{
                      Option: (props) => (
                        <CheckboxOptionsForMedGroups
                          {...props}
                          selectedMedGroupsCount={selectedMedGroups.length}
                        />
                      ),
                      ClearIndicator: () => null,
                      IndicatorSeparator: () => null,
                      DropdownIndicator: DropdownIndicator,
                      ValueContainer: ValueContainer,
                    }}
                    styles={customStyles}
                    value={selectedMedGroups}
                    inputValue={medicationGroupName}
                    placeholder="Search query here"
                    onMenuClose={onMedicationGroupsDropdownClosed}
                    openMenuOnFocus={true}
                    backspaceRemovesValue={false}
                    additional={{
                      page: 1,
                    }}
                  />
                </div>
                {selectedMedGroups?.length == 0 ? (
                  <span className="field-warning-message float-left">
                    {CustomMedicationMessages.NoMedicationGroupsSelectedMessage}
                  </span>
                ) : (
                  <></>
                )}
              </div>
            </div>
            {selectedMedGroups?.length > 0 ? (
              <SelectedMedGroups
                selectedMedGroups={selectedMedGroups}
                HandleRemoveMedGroups={HandleRemoveMedGroups}
              />
            ) : (
              <></>
            )}
            {customMedicationLibraryInactivatePermission && (
              <div className="row m-0 mt-1 p-0">
                <div className="form-group col-md-12 m-0 p-0">
                  <div className="col-md-6 pl-5 m-0">
                    <span className="span-highlight-label col-form-label p-0">
                      Status
                    </span>
                    <div className="inline-message im-notification">
                      <span className="ml-1">
                        {
                          CustomMedicationMessages.ManageAvailabilityOfCustomMedication
                        }
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
              </div>
            )}
          </form>
          <ConfirmDialog
            showConfirmModal={showConfirmModal}
            iconClass={CustomMedicationMessages.CustomMedConfirmDialogIcon}
            title={CustomMedicationMessages.CustomMedConfirmDialogTitle}
            messageTitle={
              CustomMedicationMessages.CustomMedConfirmDialogMessageTitle
            }
            messageContent={
              CustomMedicationMessages.CustomMedConfirmDialogMessageContent
            }
            confirmButtonText={
              CustomMedicationMessages.CustomMedConfirmDialogConfirmButtonText
            }
            cancelButtonText={
              CustomMedicationMessages.CustomMedConfirmDialogCancelButtonText
            }
            confirmOk={navigateToList}
            confirmCancel={confirmCancel}
          ></ConfirmDialog>
          <ConfirmDeleteDialog
            showConfirmDeleteModal={showConfirmDeleteModal}
            iconClass={CustomMedicationMessages.CustomMedConfirmDialogIcon}
            title={CustomMedicationMessages.DeleteCustomMedConfirmDialogTitle}
            messageTitle={
              CustomMedicationMessages.DeleteCustomMedConfirmDialogMessageTitle
            }
            messageContent={
              CustomMedicationMessages.DeleteCustomMedConfirmDialogMessageContent
            }
            confirmButtonText={
              CustomMedicationMessages.DeleteCustomMedConfirmButtonText
            }
            cancelButtonText={
              CustomMedicationMessages.DeleteCustomMedCancelButtonText
            }
            confirmOk={confirmDeleteOk}
            confirmCancel={confirmDeleteCancel}
          ></ConfirmDeleteDialog>
        </>
      )}
    </div>
  );
};
export default CustomMedication;
