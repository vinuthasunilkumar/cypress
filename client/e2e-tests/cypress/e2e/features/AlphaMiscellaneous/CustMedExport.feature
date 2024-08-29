@skip

Feature:  Custom Medication Export feature
    Background: Launching the libraries page
        Given the user should launch "https://orders-qa.matrixcare.me/"
        Then the user clicks on the "Custom Medication" navigation menu
        Then user should be redirected to the libraries page
        Given the user clicks on "Create New Library" button

    Scenario: Delete all the existing data for automation
        And user deletes the existing custom medications and libraries from DB

@sanity @regression
    Scenario: Verify on clicking on export button, custom medication file is downloaded and all the column names are available
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Active" toggle button
        Then the user clicks on "Next" button
        Then user captures the created library ID from DB through created name
        Given user creates "1" "Active" custom medicines with name starting with "Automation" through API
        Then the user refreshes the page
        Then the "Export List" button is visible
        When the user clicks on "Export List" button
        Then a file in the CSV format is downloaded
        Then the column names should be correctly populated

@regression
    Scenario: Verfiy the export button is disabled when library is empty
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Active" toggle button
        Then the user clicks on "Next" button
        Then user is navigated to Custom medication summary page
        Then the "Export" button should be "disabled"
        Then the user refreshes the page
        Then the "Export" button should be "disabled"

@sanity @regression
    Scenario: Verify export button gets disabled when user changes status from Active to Inactive
        Then user enters unique "<libraryName>" name
        Then the user clicks on "Active" toggle button
        Then the user clicks on "Next" button
        And the user clicks on "Create New" button
        When user creates a new custom medication with "<custMedName>", "<controllSubstanceValue>", "<scheduleValue>", "<ingredientValue>", "<medGroupValue>", "<status>", "<saveBtn>"
        Then the "Export" button should be "Enabled"
        Then the user refreshes the page
        Then the "Export" button should be "Enabled"
        Then click on Active toggle Button
        And the user clicks on "Confirm" button
        Then verify the status is still "Inactive"
        Then the "Export" button should be "disabled"
        Then the user refreshes the page
        Then the "Export" button should be "disabled"
        Examples:
            | libraryName        | custMedName       | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | status | saveBtn |
            | Automation Library | AutomationCustMed | No                     | Schedule III  | 0               | 0             | Active | Save    |

@regression
    Scenario: Verify export button gets enabled when user changes status from Inactive to Active
        Then user enters unique "<libraryName>" name
        Then the user clicks on "Next" button
        And the user clicks on "Create New" button
        When user creates a new custom medication with "<custMedName>", "<controllSubstanceValue>", "<scheduleValue>", "<ingredientValue>", "<medGroupValue>", "<status>", "<saveBtn>"
        Then the "Export" button should be "disabled"
        Then the user refreshes the page
        Then the "Export" button should be "disabled"
        Then click on Active toggle Button
        And the user clicks on "Confirm" button
        Then verify the status is still "Active"
        Then the "Export" button should be "Enabled"
        Then the user refreshes the page
        Then the "Export" button should be "Enabled"
        Examples:
            | libraryName        | custMedName       | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | status   | saveBtn |
            | Automation Library | AutomationCustMed | No                     | Schedule III  | 0               | 0             | Inactive | Save    |

@regression
    Scenario: Verfiy the export button is disabled when there are only inactive medications in a library with pagination
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Active" toggle button
        Then the user clicks on "Next" button
        Then user captures the created library ID from DB through created name
        Given user creates "30" "Inactive" custom medicines with name starting with "Automation" through API
        Then the user refreshes the page
        Then the "Export" button should be "disabled"
        Then user types "Automation" in the search text field
        Then the "Export" button should be "disabled"
        Then the user refreshes the page
        Then the "Export" button should be "disabled"

@regression
    Scenario: Verfiy the export button is disabled when user deletes active custom medications from library
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Active" toggle button
        Then the user clicks on "Next" button
        Then user captures the created library ID from DB through created name
        Given user creates "1" "Active" custom medicines with name starting with "Automation" through API
        Then the user refreshes the page
        Then the "Export" button should be "enabled"
        Then user click on Custom Medication Name on summary page
        Then the user clicks on "Delete" button
        Then on pop-up message user clicks on Delete button
        Then the "Export" button should be "disabled"
        Then the user refreshes the page
        Then the "Export" button should be "disabled"

@regression
    Scenario: Verify export button is disabled for different combination of schedule, ingridient and med group values
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Next" button
        And the user clicks on "Create New" button
        When the user creates a custom medication with dynamic fields
            | custMedName | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | status | saveBtn |
            | Automation  | Yes                    | Schedule II   | 2               | 3             | Active | Save    |
            | Automation  | No                     |               | 0               | 0             | Active | Save    |
        Then User clicks on back button
        Then the "Export" button should be "enabled"
        Then click on Active toggle Button
        And the user clicks on "Confirm" button
        And user waits
        Then the "Export" button should be "enabled"
        Then click on last Active toggle Button
        And the user clicks on "Confirm" button
        Then the "Export" button should be "disabled"

@sanity @regression
    Scenario: Verify export button is disabled for different combination of schedule, ingridient and med group values
        Then user enters unique "<libraryName>" name
        Then the user clicks on "Next" button
        And the user clicks on "Create New" button
        When user creates a new custom medication with "<custMedName>", "<controllSubstanceValue>", "<scheduleValue>", "<ingredientValue>", "<medGroupValue>", "<status>", "<saveBtn>"
        Then the "Export" button should be "disabled"
        Examples:
            | libraryName        | custMedName       | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | status   | saveBtn |
            | Automation Library | AutomationCustMed | No                     | Schedule III  | 0               | 0             | Inactive | Save    |
            | Automation Library | AutomationCustMed | No                     | Schedule III  | 15              | 15            | Inactive | Save    |
            | Automation Library | AutomationCustMed | No                     | Schedule III  | 5               | 0             | Inactive | Save    |
            | Automation Library | AutomationCustMed | Yes                    | Schedule III  | 0               | 0             | Inactive | Save    |
            | Automation Library | AutomationCustMed | Yes                    | Schedule III  | 15              | 15            | Inactive | Save    |
            | Automation Library | AutomationCustMed | Yes                    | Schedule III  | 0               | 5             | Inactive | Save    |

@regression
    Scenario: Verify the contents of the file for different combination of schedule, ingridient and med group values
        Then user enters unique "<libraryName>" name
        Then the user clicks on "Next" button
        Then user captures the created library ID from DB through created name
        And the user clicks on "Create New" button
        When user creates a new custom medication with "<custMedName>", "<controllSubstanceValue>", "<scheduleValue>", "<ingredientValue>", "<medGroupValue>", "<status>", "<saveBtn>"
        Then the "Export" button should be "enabled"
        When the user clicks on "Export List" button
        Then a file in the CSV format is downloaded
        Then the column names should be correctly populated
        Then the content of the file should be correctly populated
        Examples:
            | libraryName        | custMedName       | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | status | saveBtn |
            | Automation Library | AutomationCustMed | No                     | Schedule III  | 3               | 5             | Active | Save    |
            | Automation Library | AutomationCustMed | No                     | Schedule III  | 1               | 0             | Active | Save    |
            | Automation Library | AutomationCustMed | No                     | Schedule III  | 0               | 15            | Active | Save    |
            | Automation Library | AutomationCustMed | No                     | Schedule III  | 15              | 15            | Active | Save    |
            | Automation Library | AutomationCustMed | Yes                    | Schedule III  | 0               | 0             | Active | Save    |
            | Automation Library | AutomationCustMed | Yes                    | Schedule III  | 15              | 0             | Active | Save    |
            | Automation Library | AutomationCustMed | Yes                    | Schedule III  | 0               | 5             | Active | Save    |
            | Automation Library | AutomationCustMed | Yes                    | Schedule III  | 15              | 15            | Active | Save    |

@regression
    Scenario: Verify on clicking on export button, custom medication file is downloaded and all the column names are available
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Active" toggle button
        Then the user clicks on "Next" button
        Then user captures the created library ID from DB through created name
        Given user creates "1" "Active" custom medicines with name starting with "Automation" through API
        Then the user refreshes the page
        Then the "Export List" button is visible
        When the user clicks on "Export List" button
        Then a file in the CSV format is downloaded
        Then user verifies the file name using regex

@regression
    Scenario: Verify only Active Medications are Exported
        Then user enters unique "AutomationLibrary" name
        Then the user clicks on "Next" button
        Then user captures the created library ID from DB through created name
        And the user clicks on "Create New" button
        When the user creates a custom medication with dynamic fields
            | custMedName | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | status   | saveBtn |
            | Automation  | Yes                    | Schedule II   | 2               | 3             | Active   | Save    |
            | Automation  | No                     |               | 0               | 0             | Active   | Save    |
            | Automation  | Yes                    | Schedule IV   | 1               | 0             | Active   | Save    |
            | Automation  | No                     |               | 0               | 1             | Active   | Save    |
            | Automation  | Yes                    | Schedule III  | 0               | 15            | Active   | Save    |
            | Automation  | No                     |               | 15              | 0             | Active   | Save    |
            | Automation  | Yes                    | Schedule V    | 15              | 15            | Active   | Save    |
            | Automation  | No                     |               | 2               | 3             | Inactive | Save    |
            | Automation  | Yes                    | Schedule III  | 0               | 0             | Inactive | Save    |
            | Automation  | No                     |               | 1               | 0             | Inactive | Save    |
            | Automation  | Yes                    | Schedule III  | 0               | 1             | Inactive | Save    |
            | Automation  | No                     |               | 0               | 15            | Inactive | Save    |
            | Automation  | Yes                    | Schedule III  | 15              | 0             | Inactive | Save    |
            | Automation  | No                     |               | 15              | 15            | Inactive | Save    |
        Then User clicks on back button
        Then the "Export" button should be "enabled"
        When the user clicks on "Export List" button
        Then a file in the CSV format is downloaded
        Then the column names should be correctly populated
        Then the content of the file should be correctly populated