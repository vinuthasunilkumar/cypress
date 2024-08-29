import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import classnames from "classnames";
import { jsonToCSV, useCSVReader } from "react-papaparse";
import { ImportListMessageEnum } from "../enum/ImportListMessageEnums";
import { UploadCustomMedications } from "../../services/CustomMedicationService";
import { generateFileName } from "../../helper/Utility";
import CsvDownload from "../../helper/CsvDownload";
import { ICustomMedicationLibrary } from "../../models/interface/ICustomMedicationLibrary";
import { IValidationErrors } from "../../models/interface/IValidationErrors";

const styles = {
  csvReader: {
    display: "flex",
    flexDirection: "row",
    width: "105%",
  } as CSSProperties,
  browseFile: {
    width: "20%",
    border: "1px solid #136BC9",
    padding: ".2em .4em",
    borderRadius: "4px 0 0 4px",
    backgroundColor: "#136BC9",
    color: "#FFF",
  } as CSSProperties,
  acceptedFile: {
    border: "1px solid #B7B7B7",
    borderRadius: "0 4px 4px 0",
    height: 35,
    lineHeight: 2.5,
    width: "80%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  } as CSSProperties,
  remove: {
    borderRadius: 0,
    padding: "0 20px",
  } as CSSProperties,
  progressBarBackgroundColor: {
    backgroundColor: "red",
  } as CSSProperties,
};

const ImportList = ({
  isImportEnabled,
  uploadFileUrl,
  validateFileUrl,
  setIsImportEnabled,
  onOverLayClick,
  onCloseImportList,
}: Props) => {
  const [isValidFileSelected, setIsValidFileSelected] = useState(false);
  const [isUploadButtonEnabled, setUploadButtonEnabled] = useState(false);
  const [isRemoveButtonEnabled, setIsRemoveButtonEnabled] = useState(false);
  const [showApiResponseMessage, setShowApiResponseMessage] = useState(false);
  const [showWarningMessage, setShowWarningMessage] = useState(true);
  const { CSVReader } = useCSVReader();
  const [errorsList, setErrorsList] = useState<IValidationErrors[]>([]);
  const [apiRequestData, setApiRequestData] = useState<any>();
  const [libraryDetails, setLibraryDetails] =
    useState<ICustomMedicationLibrary>();
  const placeholderText = "No file selected";
  const [selectedFile, setSelectedFile] = useState<any>({
    file: "",
    fileName: placeholderText,
  });
  const [requestResponse, setRequestResponse] = useState({
    textMessage: "",
    alertClassName: "",
  });

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // mb * kb * bytes => 5MB

  const sideMenuClasses = classnames("side-menu", {
    "side-menu-active": isImportEnabled,
  });

  const sideMenuContentClasses = classnames("side-menu_content", {
    "side-menu_content-active": isImportEnabled,
    "overflow-auto": isImportEnabled, // new class to enable scrolling
  });

  const btnCloseImport = () => {
    setIsImportEnabled(false);
    setShowApiResponseMessage(false);
    setErrorsList([]);
    document.body.style.overflow = "visible";
    closeDialog(false);
  };

  const closeDialog = (isSucceed: boolean) => {
    onCloseImportList(isSucceed);
  };

  const closeApiResponseMsg = () => {
    setShowApiResponseMessage(false);
  };

  useEffect(() => {
    if (sessionStorage.getItem("selectedLibraryDetails")) {
      const obj: string | null = sessionStorage.getItem(
        "selectedLibraryDetails"
      );
      setLibraryDetails(JSON.parse(obj!));
    }
  }, []);

  useEffect(() => {
    if (isValidFileSelected && errorsList?.length === 0) {
      setTimeout(() => {
        setShowApiResponseMessage(false);
        setShowWarningMessage(false);
        setUploadButtonEnabled(true);
        setIsRemoveButtonEnabled(true);
      }, 3000);
    }
  }, [isValidFileSelected, errorsList, selectedFile]);

  useEffect(() =>{
    if(isImportEnabled) {
      let styleBtn = document.getElementById('btnChooseFile');
      if(styleBtn){
        styleBtn?.focus();      
    }
    }
  },[isImportEnabled]);

  const handleOnFileAccepted = useCallback((file: any, event: any) => {
    resetForm();
    const fileName = event.name;
    let fileExtension = fileName?.substr(fileName?.lastIndexOf(".") + 1);
    if (fileExtension?.toLowerCase() !== "csv") {
      setShowApiResponseMessage(true);
      setIsValidFileSelected(false);
      setRequestResponse({
        textMessage: ImportListMessageEnum.IncorrectFileFormatMessage,
        alertClassName: "alert alert-danger",
      });
      return;
    }
    setApiRequestData(event);
    selectedFile.file = file.data;
    selectedFile.fileName = event.name;
    setSelectedFile(selectedFile);
    setIsValidFileSelected(true);
    setRequestResponse({
      textMessage: ImportListMessageEnum.ImportFileNeedsToBeValidMessage,
      alertClassName: "alert alert-info",
    });
    setShowApiResponseMessage(true);
  }, []);

  const handleOnUploadRejected = (file: any) => {
    setErrorsList([]);
    setUploadButtonEnabled(false);
    setIsValidFileSelected(false);
    setShowApiResponseMessage(true);
    setShowWarningMessage(true);
    const fileName = file[0].file?.name;
    selectedFile.file = file[0].file;
    selectedFile.fileName = placeholderText;
    setSelectedFile(selectedFile);
    let fileExtension = fileName?.substr(fileName?.lastIndexOf(".") + 1);
    if (fileExtension?.toLowerCase() !== "csv") {
      setRequestResponse({
        textMessage: ImportListMessageEnum.IncorrectFileFormatMessage,
        alertClassName: "alert alert-danger",
      });
      return;
    }
    if (selectedFile?.file?.size > MAX_FILE_SIZE) {
      setRequestResponse({
        textMessage: ImportListMessageEnum.FileSizeLimitExceedMessage.replace(
          "{0}",
          "5 MB"
        ),
        alertClassName: "alert alert-danger",
      });
      return;
    }
  };

  const handleOnError = ({ err, file, inputElem, reason }: any) => {
    setUploadButtonEnabled(false);
  };

  const handleOnRemoveFile = useCallback((data?: any) => {
    setUploadButtonEnabled(false);
    setIsRemoveButtonEnabled(false);
    selectedFile.file = "";
    setSelectedFile(selectedFile);
    setIsValidFileSelected(false);
    setErrorsList([]);
    setShowWarningMessage(true);
    setShowApiResponseMessage(false);
  }, []);

  const validateAndUploadFile = async () => {
    setUploadButtonEnabled(false);
    let request = {
      csvFile: apiRequestData,
    };
    let response = await UploadCustomMedications(libraryDetails?.id, request);
    if (response?.data?.validationErrors?.length > 0) {
      setShowApiResponseMessage(true);
      setErrorsList(response?.data?.validationErrors);
      const errorsLength = response?.data?.validationErrors?.length;
      let errorMessgae = ImportListMessageEnum.FileHasErrors.replace(
        "{0}",
        errorsLength.toString()
      );
      errorMessgae =
        errorsLength === 1
          ? errorMessgae.replace("errors", "error")
          : errorMessgae;
      setRequestResponse({
        textMessage: errorMessgae,
        alertClassName: "alert alert-danger",
      });
    } else if (response?.data?.validationErrors?.length === 0) {
      closeDialog(true);
    }
  };

  const btnExportErrorsClick = () => {
    const exportFileName = generateFileName(
      libraryDetails?.description + " Custom Medications Import Errors",
      ".csv"
    );
    let jsonErrorsList: any = [];
    if (errorsList?.length > 0) {
      errorsList.forEach((item: IValidationErrors, index: number) => {
        if (item) {
          let errorObj = {
            Lines: item.lineNumber,
            Details: item.error,
          };
          jsonErrorsList.push(errorObj);
        }
      });
      const csvData = [
        ["Lines", "Details"],
        ...jsonErrorsList.map(({ Lines, Details }: any) => [Lines, Details]),
      ];
      const csvResults = jsonToCSV(csvData);
      CsvDownload(csvResults, exportFileName);
    }
  };

  const resetForm = () => {
    setErrorsList([]);
    selectedFile.file = "";
    selectedFile.fileName = placeholderText;
    setSelectedFile(selectedFile);
    setUploadButtonEnabled(false);
    setIsRemoveButtonEnabled(false);
    setShowApiResponseMessage(false);
    setIsValidFileSelected(false);
    setShowWarningMessage(true);
  };

  return (
    <div className={`import-list ${sideMenuClasses}`}>
      <div className="side-menu_overlay" onClick={onOverLayClick} />
      <div
        className={`import-list-content ${sideMenuContentClasses} d-flex flex-column justify-content-between`}
      >
        <div className="container-fluid">
          <div className="row import-list-header">
            <h1 className="header">Import List</h1>
            <div className="row">
              <span
                className="close-import-list"
                id="close-import-list"
                data-testid="close-import-list"
                onClick={btnCloseImport}
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          </div>
          {showApiResponseMessage &&
          requestResponse.alertClassName &&
          requestResponse.textMessage ? (
            <div className={`row mt-3`}>
              <div
                className={`col-md-12 mb-0 ${requestResponse.alertClassName}`}
                role="alert"
              >
                <i
                  id="alert-import-error-close-btn"
                  data-testid="alert-import-error-close-btn"
                  className="alert-close"
                  aria-hidden="true"
                  onClick={closeApiResponseMsg}
                ></i>
                <div className="alert-message-container">
                  <span>{requestResponse.textMessage}</span>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="row mt-3">
            <div className="col-md-12 ml-m15px">
              <CSVReader
                aceept="text/csv"
                multiple={false}
                onUploadAccepted={handleOnFileAccepted}
                onUploadRejected={handleOnUploadRejected}
                maxSize={MAX_FILE_SIZE}
                maxFiles={1}
                onError={handleOnError}
                addRemoveButton
                config={{
                  header: true,
                }}
                onRemoveFile={handleOnRemoveFile}
              >
                {({
                  getRootProps,
                  acceptedFile,
                  ProgressBar,
                  getRemoveFileProps,
                }: any) => (
                  <>
                    <div style={styles.csvReader}>
                      <button
                        id="btnChooseFile"
                        data-testid="btnChooseFile"
                        type="button"
                        {...getRootProps()}
                        style={styles.browseFile}
                      >
                        Choose File
                      </button>
                      <div style={styles.acceptedFile}>
                        {acceptedFile && acceptedFile.name ? (
                          <>
                            <span
                              className="file-selected"
                              id="file-selected"
                              data-testid="file-selected"
                            >
                              {selectedFile.fileName}
                            </span>
                            {selectedFile.fileName !== "No file selected" &&
                            isRemoveButtonEnabled ? (
                              <button
                                className="remove-file"
                                {...getRemoveFileProps()}
                              >
                                <span
                                  id="btnRemoveFile"
                                  data-testid="btnRemoveFile"
                                  onClick={handleOnRemoveFile}
                                >
                                  <i className="fa-regular fa-times"></i>
                                </span>
                              </button>
                            ) : (
                              <></>
                            )}
                          </>
                        ) : (
                          <>
                            <span
                              id="no-file-selected"
                              data-testid="no-file-selected"
                              className="no-file-selected"
                            >
                              No file selected
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    {/* <ProgressBar style={styles.progressBarBackgroundColor} /> */}
                  </>
                )}
              </CSVReader>
              {showWarningMessage ? (
                <div
                  className="inline-message im-warning"
                  data-testid="file-size-warning-msg"
                  id="file-size-warning-msg"
                >
                  <span className="ml-1">
                    Only <strong>.csv</strong> file up to <strong> 5 MB</strong>{" "}
                    in size is allowed for upload.
                  </span>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          {errorsList?.length > 0 ? (
            <>
              <div className="row mt-2">
                <h4>Validation Errors</h4>
              </div>
              <div className="row">
                <div className="table-responsive" style={{ height: "270px" }}>
                  <table className="table table-sm table-striped dark-border-header table-hover">
                    <thead>
                      <tr>
                        <th
                          className="dark-border-header w-10"
                          style={{ backgroundColor: "#DDDDDD" }}
                        >
                          Lines
                        </th>
                        <th className="dark-border-header">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errorsList?.length === 0 ? (
                        <tr>
                          <td className="no-data" colSpan={2}>
                            <aside>No Errors Found</aside>
                          </td>
                        </tr>
                      ) : (
                        errorsList?.map((itm: any, index: any) => (
                          <tr key={`${itm.lineNumber} - ${index}`}>
                            <td>
                              <span>{itm.lineNumber}</span>
                            </td>
                            <td>
                              <span style={{ whiteSpace: "pre-wrap" }}>
                                {itm.error}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="import-footer-content">
          {errorsList?.length === 0 ? (
            <button
              id="btnValidateAndUploadFile"
              data-testid="btnValidateAndUploadFile"
              className="btn btn-primary float-left"
              disabled={!isUploadButtonEnabled}
              onClick={validateAndUploadFile}
            >
              Validate & Upload File
            </button>
          ) : (
            <></>
          )}
          <button
            id="btnClose"
            data-testid="btnClose"
            className="btn btn-cancel float-right"
            onClick={btnCloseImport}
          >
            Close
          </button>
          {errorsList?.length != 0 ? (
            <button
              id="btnExportErrors"
              data-testid="btnExportErrors"
              className="btn btn-primary float-right mr-3"
              onClick={btnExportErrorsClick}
            >
              <i className="fa-regular fa-file-export mr-1"></i>Export Errors
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};
export default ImportList;

export type Props = {
  isImportEnabled?: boolean;
  uploadFileUrl?: string;
  validateFileUrl?: string;
  setIsImportEnabled: (isImport: boolean) => void;
  onCloseImportList: (isSucceed: boolean) => void;
  onOverLayClick?: () => void;
};
