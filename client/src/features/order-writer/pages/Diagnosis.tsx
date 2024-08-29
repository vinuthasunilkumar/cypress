import React, { useCallback, useEffect, useState } from "react";
import {
  loadActiveDiagnoses,
  loadAllDiagnoses,
} from "../../../services/OrderWriterService";
import { HostContext, Medication } from "../../../types";
import MultiColumnSingleDD from "../../../shared/pages/MultiColumnSingleDD";
import { useDispatch, useSelector } from "react-redux";
import {
  setICD10Instruction,
  setSelectedDiagnoses,
  setSelectedDiagnosesType as reduxsetSelectedDiagnosesType,
} from "../../../redux/slices/orderWriterSlice";
import { defaultMedication } from "../../../shared/constants/DefaultMedication";
import { RootState } from "../../../redux/store";
import { styles } from "../../../helper/UtilStyles";
import { handleDispatch } from "../../../helper/Utils";
import { AsyncPaginate } from "react-select-async-paginate";
import {
  InputActionMeta,
  OptionProps,
  SingleValue,
  components,
} from "react-select";
import { DiagnosisConstants } from "../../../shared/enum/DiagnosisConstants";
import { DiagnosisMessages } from "../../../shared/enum/DiagnosisMsgEnums";

type DiagnosisSearchProps = {
  hostContext: HostContext;
  medicationId: number;
};

const pageLength = 10;

const Diagnosis = ({ hostContext, medicationId }: DiagnosisSearchProps) => {
  const [diagnoses, setDiagnoses] = useState<IDiagnoses[]>([]);
  const [searchDiagnosisValue, setSearchDiagnosisValue] = useState("");
  const [ectConfigId, setEctConfigId] = useState<string>(
    hostContext?.ectConfigId || ""
  );

  useEffect(() => {
    searchActiveResidentDiagnosis();
    if (medication.instructions.selectedDiagnosesType === "") {
      const payload = {
        medicationId: medicationId,
        selectedDiagnosesType: "ActiveForResident",
      };

      dispatch(reduxsetSelectedDiagnosesType(payload));
    }
  }, []);

  const searchActiveResidentDiagnosis = useCallback(async () => {
    loadActiveDiagnoses(
      hostContext?.residentId,
      hostContext?.baseUrl,
      ectConfigId
    ).then((response: IDiagnosisResponse) => {
      if (response !== undefined) {
        setDiagnoses(response.diagnosisDto);
      }
    });
  }, []);

  const medication: Medication =
    (useSelector((state: RootState) =>
      state.orderWriter.medications.find((med) => med.id === medicationId)
    ) as Medication) || defaultMedication;

  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState(
    medication?.instructions?.selectedDiagnosesType || ""
  );
  const clearState = () => {
    let diagnosis: IDiagnoses = { icd10Code: "", icd10Description: "" };
    handleDispatch(
      dispatch,
      medication.id,
      setSelectedDiagnoses,
      "selectedDiagnoses",
      diagnosis?.icd10Code
    );
    handleDispatch(
      dispatch,
      medication.id,
      setICD10Instruction,
      "icd10Instruction",
      diagnosis?.icd10Description
    );
    DiagnosisTypeChange("");
    const payload = {
      medicationId: medicationId,
      selectedDiagnosesType: "ActiveForResident",
    };

    dispatch(reduxsetSelectedDiagnosesType(payload));
    searchActiveResidentDiagnosis();
  };

  const handleActiveForResidentChanges = (selectedValue: IDiagnoses) => {
    handleDispatch(
      dispatch,
      medication.id,
      setSelectedDiagnoses,
      "selectedDiagnoses",
      selectedValue
    );
    handleDispatch(
      dispatch,
      medication.id,
      setICD10Instruction,
      "icd10Instruction",
      selectedValue?.icd10Description != null
        ? selectedValue?.icd10Code + " " + selectedValue?.icd10Description
        : selectedValue?.icd10Description
    );
  };

  const handleDiagnosisTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    if (selectedValue === "ActiveForResident") {
      searchActiveResidentDiagnosis();
    } else {
      setDiagnoses([]);
    }
    DiagnosisTypeChange(selectedValue);
  };

  const DiagnosisTypeChange = (selectedOption: string) => {
    const payload = {
      medicationId: medicationId,
      selectedDiagnosesType: selectedOption,
    };

    dispatch(reduxsetSelectedDiagnosesType(payload));
  };
  const twoColumns: IColumnType<ITwoColumn>[] = [
    {
      key: "icd10Code",
      width: 40,
    },
    {
      key: "icd10Description",
      width: 58,
    },
  ];

  const ValueContainer = useCallback(({ children, ...props }: any) => {
    return (
      components.ValueContainer && (
        <components.ValueContainer {...props}>
          {!!children && (
            <i
              className="fa fa-search"
              aria-hidden="true"
              style={{ position: "absolute", left: 6 }}
            />
          )}
          {children}
        </components.ValueContainer>
      )
    );
  }, []);

  const DropdownIndicator = (props: any) => {
    return (
      <components.DropdownIndicator {...props}>
        <i className="fa fa-caret-down up-down-caret" />
      </components.DropdownIndicator>
    );
  };

  // Loading an Diagnosis Options into a paginated dropdown
  const searchAllDiagnosis = async (
    searchQuery: string,
    loadedOptions: any,
    { page }: any
  ) => {
    if (searchQuery.length < 2) {
      return {
        options: [],
        hasMore: false,
        additional: {
          page: page + 1,
        },
      };
    }
    let pageNumber = page || 1;
    const searchResults = loadAllDiagnoses(
      pageNumber,
      searchQuery,
      pageLength
    ).then((response: IDiagnosisResponse) => {
      return response;
    });
    const responseJSON = await searchResults;
    return {
      options:
        responseJSON?.diagnosisDto?.length > 0 ? responseJSON.diagnosisDto : [],
      hasMore: page === 25 ? false : responseJSON?.moreResultsExist,
      additional: {
        page: page + 1,
      },
    };
  };

  // will be called once a user has entered something to search for Diagnosis
  const onDiagnosisNameChanged = useCallback(
    (newInputValue: string, { action }: InputActionMeta) => {
      setSearchDiagnosisValue(newInputValue);
    },
    []
  );

  // Custom styles for Async Paginate Control
  const customStyles = {
    menuOptStyle: (provided: any) => ({
      ...provided,
      overflowY: "auto",
      maxHeight: "400px",
    }),
    control: (provided: any, state: { isFocused: any }) => ({
      ...provided,
      borderRadius: "0px",
      borderColor: "#888",
      boxShadow: state.isFocused ? "0 0 0 2px #D3E3F8" : null,
    }),
    option: (provided: any, state: { isFocused: any; isSelected: any }) => ({
      ...provided,
      backgroundColor: state.isFocused || state.isSelected ? "#D3E3F8" : null,
      color: state.isFocused ? "black" : null,
    }),
    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      transform: state.selectProps.menuIsOpen && "rotate(180deg)",
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      paddingLeft: 24,
    }),
  };

  // will be called once a Dropdown Options List is closed to remove the typed diagnosis name
  const onDiagnosisDropdownClosed = () => {
    setSearchDiagnosisValue("");
  };

  // used to add the selected diagnosis in a list to display on UI
  const handleSearchAllDiagnosis = (selectedValue: SingleValue<IDiagnoses>) => {
    let diagnosesObj: SingleValue<IDiagnoses> = selectedValue;
    handleDispatch(
      dispatch,
      medication.id,
      setSelectedDiagnoses,
      "selectedDiagnoses",
      selectedValue
    );
    handleDispatch(
      dispatch,
      medication.id,
      setICD10Instruction,
      "icd10Instruction",
      diagnosesObj?.icd10Description != null
        ? diagnosesObj?.icd10Code + " " + diagnosesObj?.icd10Description
        : diagnosesObj?.icd10Description
    );
  };

  // Displaying a Icd10 code and Icd10 description Lable in Async Paginate DropDown
  const CheckboxOptionsForDiagnosis = ({
    ...props
  }: OptionProps<IDiagnoses>) => (
    <components.Option {...props}>
      <div className="row">
        <div className="col-4">
          <label
            className="ingredients-med-group-label"
            htmlFor={props.data.icd10Code}
            data-testid={props.data.icd10Code}
          >
            {props.data.icd10Code}
          </label>
        </div>
        <div className="col-8">
          <label
            className="ingredients-med-group-label ml-5"
            htmlFor={props.label}
            data-testid={props.label}
          >
            {props.label}
          </label>
        </div>
      </div>
    </components.Option>
  );

  return (
    <div className="form-group input-required mt-2">
      <label
        id="diagnosisLabel"
        style={{ fontSize: "20px" }}
        htmlFor="txtDiagnosis"
      >
        ICD-10 Diagnosis
      </label>
      <input className="form-control visually-hidden" id="txtDiagnosis" />
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label id={"searchDiagnoses"} htmlFor="txtICD-10">
              ICD-10
            </label>
            <input className="visually-hidden" id="txtICD-10" />
            <select
              data-testid="diagnosisType"
              className="form-control form-control-custom"
              onChange={(selectedValue) => {
                handleDiagnosisTypeChange(selectedValue);
              }}
              value={medication.instructions.selectedDiagnosesType}
            >
              <option value="ActiveForResident"> Active for Resident </option>
              <option value="SearchAll">Search All</option>
            </select>
          </div>
        </div>
        <div className="col-md-8 mt-1 ml-n2">
          {medication?.instructions?.selectedDiagnosesType ===
          "ActiveForResident" ? (
            <div className="form-group">
              <MultiColumnSingleDD
                columns={twoColumns}
                datafile={diagnoses}
                onChange={(selectedValue) => {
                  handleActiveForResidentChanges(selectedValue);
                }}
                selectLabelText={""}
                id={"ddlDiagnoses"}
                value={null}
                selectedValueCoulumn={"icd10Description"}
                lableClassName={""}
              />
            </div>
          ) : (
            <div className="form-group dropdownAllignment">
              <AsyncPaginate
                id="diagnosis"
                inputId="diagnosisName"
                name="diagnosis"
                loadOptions={searchAllDiagnosis}
                closeMenuOnSelect={true}
                getOptionValue={(option) => option.icd10Description}
                getOptionLabel={(option: { icd10Description: string }) =>
                  option.icd10Description
                }
                onChange={handleSearchAllDiagnosis}
                isSearchable={true}
                isMulti={false}
                noOptionsMessage={() =>
                  searchDiagnosisValue.length <
                  DiagnosisConstants.MinSearchCharactersLength
                    ? DiagnosisMessages.SearchCharactersLimitMessage
                    : DiagnosisMessages.NoResultsFoundMessage
                }
                loadingMessage={() => DiagnosisMessages.LoadingDiagnosisMessage}
                onInputChange={onDiagnosisNameChanged}
                hideSelectedOptions={true}
                components={{
                  Option: CheckboxOptionsForDiagnosis,
                  DropdownIndicator: DropdownIndicator,
                  ValueContainer: ValueContainer,
                }}
                isClearable={true}
                styles={customStyles}
                value={null}
                inputValue={searchDiagnosisValue}
                placeholder="Search query here"
                onMenuClose={onDiagnosisDropdownClosed}
                openMenuOnFocus={true}
                tabIndex={0}
                backspaceRemovesValue={false}
                additional={{
                  page: 1,
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div>
        <label id={"ICD-10-Diagnosis"} htmlFor="txtSelectedICD-10">
          Selected ICD-10
        </label>
        <input className="visually-hidden" id="txtSelectedICD-10" />
        {medication?.instructions?.selectedDiagnoses?.icd10Code != null ? (
          <div className="table-responsive">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>
                    <i
                      className="fa-regular fa-square-minus ml-1"
                      style={styles.remove_button}
                      onClick={() => clearState()}
                      onKeyDown={() => clearState()}
                    ></i>
                  </td>
                  <td>
                    {medication?.instructions?.selectedDiagnoses?.icd10Code}
                  </td>
                  <td>
                    {
                      medication?.instructions?.selectedDiagnoses
                        ?.icd10Description
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Diagnosis;
