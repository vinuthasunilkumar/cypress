@skip
Feature:  Custom Medication Import feature
    Background: Launching the libraries page
        Given the user should launch "https://orders-qa.matrixcare.me/"
        Then the user clicks on the "Custom Medication" navigation menu
        Then user should be redirected to the libraries page
        Given the user clicks on "Create New Library" button

@sanity @regression
    Scenario: Verify validation message when Incorrect File format is added
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Next" button
        Then the "Import List" button should be "enabled"
        When the user clicks on "Import List" button
        Then Import List page should be displayed
        Then the user clicks on "Choose File" button
        Then the user selects the "<File Name>"
        Then user should get error message as "Invalid file type. Only .csv files are allowed for import."
        Then the "Validate and Upload" button should be "disabled"
        Examples:
            | File Name           |
            | DocxImportFile.docx |
            | PDFImpotFile.pdf    |
            | XLSXImportFile.xlsx |
            | XLSImportFile.xls   |
            | PNGImportFile.png   |
            | TextImportFile.txt  |
            | PDFFileWith6MB.pdf  |
            | TextFileWith6MB.txt |

@regression
    Scenario: Verify validation message when File size is more than 5MB
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Next" button
        Then the "Import List" button should be "enabled"
        When the user clicks on "Import List" button
        Then Import List page should be displayed
        Then the user clicks on "Choose File" button
        Then the user selects the "<File>"
        Then user should get error message as "File size exceeds permissible limit of up to 5 MB size."
        Examples:
            | File                |
            | 5.1MBImportFile.csv |
            | 6.3MBImportFile.csv |

@regression
    Scenario: Verify all the controls in the Import list page and a 5MB file is uploaded
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Next" button
        Then the "Import" button should be "enabled"
        When the user clicks on "Import List" button
        Then Import List page should be displayed
        Then the "Choose File" button should be "enabled"
        Then the "Validate and Upload" button should be "disabled"
        Then "Export Errors" button is not displayed
        Then a warning message "Only .csv file up to 5MB in size is allowed for upload" should appear
        And "X" control should be displayed
        Then the "Validate and Upload" button should be "enabled"
        Then the "Close" button should be "enabled"
        Then the user clicks on "Choose File" button
        Then the user selects the "ValidImportFile.csv"
        Then the "ValidImportFile.csv" is displayed
        Then the user clicks on "Validate & Upload File" button
        Then "File has been imported successfully." message should be displayed
        Then user is navigated to Custom medication summary page

@sanity @regression
    Scenario: Verify after choosing the file, user still can remove it and select other file
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Next" button
        Then the "Import" button should be "enabled"
        When the user clicks on "Import List" button
        Then Import List page should be displayed
        Then the user clicks on "Choose File" button
        Then the user selects the "ValidImportFile.csv"
        Then the "ValidImportFile.csv" is displayed
        Then the user clicks on close icon next to selected file
        Then the "No file selected" message is displayed
        Then the user clicks on "Choose File" button
        Then the user selects the "HeaderCountError1.csv"
        Then the "HeaderCountError1.csv" is displayed

@regression
    Scenario: Verify user clicks on close after choosing the file and file is not uploaded
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Next" button
        Then the "Import" button should be "enabled"
        When the user clicks on "Import List" button
        Then Import List page should be displayed
        Then the user clicks on "Choose File" button
        Then the user selects the "<FileName>"
        Then the "<FileName>" is displayed
        Then the user clicks on "Close" button
        Then user is navigated to Custom medication summary page
        Examples:
            | FileName                   |
            | CustomMedicationErrors.csv |
            | ValidImportFile.csv        |

@regression
    Scenario: Verify the headers and titles for error table and verify user is able to choose one more file without clicking on export errors
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Next" button
        When the user clicks on "Import List" button
        Then Import List page should be displayed
        Then the user clicks on "Choose File" button
        Then the user selects the "HeaderCountError1.csv"
        Then the "HeaderCountError1.csv" is displayed
        Then the user clicks on "Validate & Upload File" button
        Then verify "Validation Errors" title is displayed
        Then the "Export Errors" button should be "enabled"
        Then "Validate & Upload File" button should disappear
        Then "Line" and "Detail" column header should be present
        Then the user clicks on close for validation message
        Then the validation error message disappears
        Then the user clicks on "Choose File" button
        Then the user selects the "DEAErrors.csv"
        Then the "DEAErrors.csv" is displayed

@regression
    Scenario: End to end flow for Import validations
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Next" button
        When the user clicks on "Import List" button
        Then the user clicks on "Choose File" button
        Then the user selects the "<FileName>"
        Then the "<FileName>" is displayed
        Then the user clicks on "Validate & Upload File" button
        Then the validation error message should "be" displayed with "<Number>" of error count
        Then user verifies the validation messages in the API response according to "<FileName>"
        Then user verifies the validation messages from API response to UI according to "<FileName>"
        Then the user clicks on "Export Errors" button
        Then a file in the CSV format is downloaded
        Then user verifies the validation messages from UI and the exported CSV file
        Examples:
            | FileName                   | Number |
            | InvalidHeaderError.csv     | 4      |
            | HeaderCountError1.csv      | 1      |
            | HeaderCountError2.csv      | 1      |
            | CustomMedicationErrors.csv | 7      |
            | DEAErrors.csv              | 11     |
            | IngredientErrors.csv       | 10     |
            | MedGroupErrors.csv         | 2      |

@sanity @regression
    Scenario: Verify the scroll bar in Validation table errors and count the number of rows
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Next" button
        When the user clicks on "Import List" button
        Then the user clicks on "Choose File" button
        Then the user selects the "CustomMedicationErrors.csv"
        Then verify "File import needs to be valid and error free." is not displayed after 3sec
        Then the "CustomMedicationErrors.csv" is displayed
        Then the user clicks on "Validate & Upload File" button
        Then the validation error message should "be" displayed with "7" of error count
        Then scroll to bottom to see last validation error
        Then verify the validation "Custom medication name must be at most 70 characters."
        Then scroll to top to see first validation error

@regression
    Scenario: Verify the file name format and headers of the exported errors file
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Next" button
        When the user clicks on "Import List" button
        Then the user clicks on "Choose File" button
        Then the user selects the "<FileName>"
        Then the "<FileName>" is displayed
        Then the user clicks on "Validate & Upload File" button
        Then the user clicks on "Export Errors" button
        Then File is downloaded in csv format
        Then user verifies the export errors file name using regex
        Then the column names of the exported error file should be correctly populated
        Examples:
            | FileName                   |
            | CustomMedicationErrors.csv |
            | HeaderCountError1.csv      |

@regression
    Scenario: Verify that duplicate Custom Medication Name should not be allowed
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Next" button
        Given the user clicks on "Create New" button
        Then user Enter "AutomationDuplicateCustomMed" in the Custom Medication Name
        Then the user clicks controlled substance "No" button
        And the user clicks on "Save" button
        Then the user clicks on "Import List" button
        Then the user clicks on "Choose File" button
        Then the user selects the "<FileName>"
        Then the "<FileName>" is displayed
        Then the user clicks on "Validate & Upload File" button
        Then user verifies the validation messages in the API response according to "<FileName>"
        Examples:
            | FileName                            | Number |
            | DuplicateCustomMedicationErrors.csv | 1      |

@regression
    Scenario: Verify user is able to import valid custom medications successfully.
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Next" button
        When the user clicks on "Import List" button
        Then the user clicks on "Choose File" button
        Then the user selects the "<FileName>"
        Then the "<FileName>" is displayed
        Then the user clicks on "Validate & Upload File" button
        Then "File has been imported successfully." message should be displayed
        Then verify the total number of records imported in the "<FileName>" in "fixtures" folder
        Then user verifies the imported data from "<FileName>" in the library in "fixtures" folder
        Examples:
            | FileName                                   |
            | CorrectData.csv                            |
            | CorrectDataWithMultipleSameIngredients.csv |
            | CorrectDataWithInvalidIngredientValue.csv  |

@sanity @regression
    Scenario: End to End scenario for export Import
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Next" button
        Then user captures the created library ID from DB through created name
        And the user clicks on "Create New" button
        When the user creates a custom medication with dynamic fields
            | custMedName | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | status | saveBtn |
            | Automation  | Yes                    | Schedule II   | 2               | 3             | Active | Save    |
            | Automation  | No                     |               | 0               | 0             | Active | Save    |
            | Automation  | Yes                    | Schedule IV   | 2               | 0             | Active | Save    |
            | Automation  | No                     |               | 0               | 5             | Active | Save    |
            | Automation  | Yes                    | Schedule V    | 15              | 15            | Active | Save    |
        Then User clicks on back button
        Then the "Export" button should be "enabled"
        When the user clicks on "Export List" button
        Then a file in the CSV format is downloaded
        Then the column names should be correctly populated
        Then the content of the file should be correctly populated
        Then the user clicks on "Back" button
        Given the user clicks on "Create New Library" button
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Next" button
        When the user clicks on "Import List" button
        Then the user clicks on "Choose File" button
        Then the user selects the Exported file
        Then the exported filename is displayed
        Then the user clicks on "Validate & Upload File" button
        Then "File has been imported successfully." message should be displayed
        Then verify the total number of records imported through the exported file in "downloads" folder
        Then user verifies the imported data from the exported file in the library in "downloads" folder

@regression
    Scenario: Verify user is able to edit and delete custom medication after importing
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Next" button
        When the user clicks on "Import List" button
        Then the user clicks on "Choose File" button
        Then the user selects the "<FileName>"
        Then the "<FileName>" is displayed
        Then the user clicks on "Validate & Upload File" button
        Then "File has been imported successfully." message should be displayed
        Then user types "<CustMedName>" in the search text field
        Then user click on Custom Medication Name on summary page
        Then user edits all the fields
            | custMedName                | controllSubstanceValue | ingredientValue | medGroupValue | status   |
            | Automation Edit Custom Med | No                     | ty              | Antianxiety   | Inactive |
        Then user able to see summary page
        And the user clicks on "Save" button
        And the user sees the message "Custom medication saved successfully."
        Then user types "<CustMedEditedName>" in the search text field
        And the new changes should be reflected on the UI
            | custMedName                | controllSubstanceValue | medGroupValue | status   |
            | Automation Edit Custom Med | Not Controlled         | Antianxiety   | Inactive |
        Then user types "<CustMedEditedName>" in the search text field
        Then user click on Custom Medication Name on summary page
        Then the user clicks on "Delete" button
        Then on pop-up message user clicks on Delete button
        Then the user sees the message "Custom medication deleted successfully."
        Then user is navigated back to Summary page
        Then user types "<CustMedEditedName>" in the search text field
        Then verify "No matches found" message is displayed in summary page
        Examples:
            | FileName        | CustMedName | CustMedEditedName          |
            | CorrectData.csv | Citalopram  | Automation Edit Custom Med |

@regression
    Scenario: Verify user is able to sort the custom medication name entire list for all pages when import the Custom Medications
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Next" button
        When the user clicks on "Import List" button
        Then the user clicks on "Choose File" button
        And user waits
        Then the user selects the "<FileName>"
        Then the "<FileName>" is displayed
        Then the user clicks on "Validate & Upload File" button
        Then "File has been imported successfully." message should be displayed
        Then the user refreshes the page
        Then the sort order of cust med names should be "asc"
        When user navigates to the page number "2"
        Then the sort order of cust med names should be "asc"
        When the user clicks on the arrow button next to Custom medication column
        Then the sort order of cust med names should be "desc"
        When user navigates to "1" page
        Then the sort order of cust med names should be "desc"
        When user navigates to the page number "2"
        Then the sort order of cust med names should be "desc"
        When the user clicks on the arrow button next to Custom medication column
        Then the sort order of cust med names should be "asc"
        When user navigates to "1" page
        Then the sort order of cust med names should be "asc"
        Examples:
            | FileName                       |
            | Morethan20recordsValidFile.csv |

@regression
    Scenario: Verify pagination exists when imported rows are more than 20
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Next" button
        When the user clicks on "Import List" button
        Then the user clicks on "Choose File" button
        Then the user selects the "<FileName>"
        Then the "<FileName>" is displayed
        Then the user clicks on "Validate & Upload File" button
        Then "File has been imported successfully." message should be displayed
        Then Pagination should "be" visible
        Examples:
            | FileName                       |
            | Morethan20recordsValidFile.csv |

@regression
    Scenario: Verify user not able to see the pagination when custom Medications are below or equl to 20 Records
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Next" button
        When the user clicks on "Import List" button
        Then the user clicks on "Choose File" button
        Then the user selects the "<FileName>"
        Then the "<FileName>" is displayed
        Then the user clicks on "Validate & Upload File" button
        Then "File has been imported successfully." message should be displayed
        Then the user refreshes the page
        And user waits
        Then Pagination should "not be" visible
        Examples:
            | FileName      |
            | 3 Records.csv |
