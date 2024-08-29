
Feature:  Custom Medications Summary
 Background: Logging into SNF and Navigating to the search page
        Given the user is logged into the SNF Url with credentials
            | url                                  | username       | password   |
            | https://qa61.matrixcare.me/Login.jsp | orders_support | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        When the user selects the facility "OKTA" from facility list
        And the user clicks on "View" button
        Then  the user selects "Custom Medication Library List" in the View DDL
        When the user clicks on "Create New Library" button
        Then user enters unique "Magic Mouthwash" name
        Then the user clicks on "Next" button
        And the user clicks on "Create New" button

  Scenario: Delete all the existing data for automation
    And user deletes the existing custom medications and libraries from DB

@sanity @regression
  Scenario: Verify results are not sorted when user types single character
    Given user creates "10" "Active" custom medicines with name starting with "Automation" through API
    Then the user refreshes the page
    Then results should be displayed on "1"st page according to the search criteria ""
    And user types "<Characters>" in the search text field
    Then results should be displayed on "1"st page according to the search criteria ""
    Examples:
      | Characters |
      | C          |
      | &          |

@sanity @regression
  Scenario: Verify search text field is displayed along with the placeholder and search icon
    Then Search text field should be displayed
    And placeholder "Search here" should be present in the search text field
    And search icon should be visible in the search text field

@regression
  Scenario: Verify user is able to search medications as per the search criteria and the list is displayed accordingly.
    Given the user clicks on "Create New" button
    When user creates a brand new custom medication
      | custMedName                                     | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | status | saveBtn | message                               | numberOfMedicinesCreated |
      | AutomationCalcium 1%  - # & @ 1 phosphate hydro | Yes                    | Schedule III  | 1,3-butane      | Antibiotics   | Active | Save    | Custom medication saved successfully. | 1                        |
    Then User clicks on back button
    When user types "<Characters>" in the search text field
    Then results should be displayed on "1"st page according to the search criteria "<Characters>"
    When user clears the search text field
    Then results should be displayed on "1"st page according to the search criteria ""
    Examples:
      | Characters                                     |
      | AutomationCalcium 1% - # & @ 1 phosphate hydro |
      | AutomationCalcium                              |
      | phos                                           |
      | # & @                                          |
      | AUTOMATIONCALCIUM                              |

@regression
  Scenario: Verify the validation when user searches with incorrect custom medicine
    Given user creates "25" "Active" custom medicines with name starting with "Automation" through API
    Then the user refreshes the page
    When user types "<Characters>" in the search text field
    Then "No matches found" validation appears
    Then Pagination should "not be" visible
    When user clears the search text field
    Then results should be displayed on "1"st page according to the search criteria ""
    Then Pagination should "be" visible
    Examples:
      | Characters                  |
      | My Name                     |
      | @%$#^%4                     |
      | ###                         |
      | dfaewrw                     |
      | %321 #$432                  |
      | Antibiotics                 |
      | phsphate                    |
      | Cleansing Towelettes 0.13 % |

@sanity @regression
  Scenario: Verify pagination is working correctly after search results are displayed.
    Given user creates "25" "Active" custom medicines with name starting with "<Characters>" through API
    When user types "<Characters>" in the search text field
    Then Pagination should "be" visible
    And in all the pages results should be displayed according to search results "<Characters>"- Verify Pagination and results
    Examples:
      | Characters                     |
      | AutomationTestCustomMedication |

@regression
  Scenario: Verify the arrow buttons in pagination
    Given user creates "65" "Active" custom medicines with name starting with "Automation" through API
    Then the user refreshes the page
    And user waits
    Given results should be displayed on "1"st page according to the search criteria ""
    Then the "previuos" navigation arrow should be "disabled"
    And the "first" navigation arrow should be "disabled"
    When user navigates to page number "3"
    Then results should be displayed on "3"st page according to the search criteria ""
    And the "previuos" navigation arrow should be "enabled"
    And the "first" navigation arrow should be "enabled"
    And the "next" navigation arrow should be "enabled"
    And the "last" navigation arrow should be "enabled"
    When the user navigates to last page
    Then the "next" navigation arrow should be "disabled"
    And the "last" navigation arrow should be "disabled"

@regression
  Scenario: Verify the search results are cleared when user refreshes the screen.
    Given user creates "25" "Active" custom medicines with name starting with "<Characters>" through API
    Then the user refreshes the page
    When user types "<Characters>" in the search text field
    And user waits
    Then results should be displayed on "1"st page according to the search criteria "<Characters>"
    Then the user reloads the browser
    Then the search text field should be blank
    Then results should be displayed on "1"st page according to the search criteria ""
    Examples:
      | Characters                     |
      | AutomationTestCustomMedication |

@regression
  Scenario: Verify user is able to sort the custom medication name column after search results appear.
    Given user creates "25" "Active" custom medicines with name starting with "<Characters>" through API
    Then the user refreshes the page
    When user types "<Characters>" in the search text field
    And user waits
    Then results should be displayed on "1"st page according to the search criteria "<Characters>"
    Then the sort order of cust med names should be "asc"
    When the user clicks on the arrow button next to Custom medication column
    Then the sort order of cust med names should be "desc"
    When the user clicks on the arrow button next to Custom medication column
    Then the sort order of cust med names should be "asc"
    Examples:
      | Characters     |
      | Automationtest |

@sanity @regression
  Scenario:Verify columns and list of medications displayed in Summary  page .Also verify 20 records is displayed in first page
    And the user can view a table id with the "4" columns
      | column_header          |
      | Status                 |
      | Custom Medication Name |
      | Controlled Substance   |
      | Medication Group       |
    Given user creates "25" "Active" custom medicines with name starting with "Automation" through API
    Then the user reloads the browser
    And user waits
    Then user is able to see 20 records in Summary page

@regression
  Scenario:Verify Controlled Substance column when No is selected
    And the user clicks on "Create New" button
    When the user enters alphanumeric character of length "20" in Custom Medication
    Then the user clicks controlled substance "No" button
    Then the user clicks on "Save" button
    Then click on Search field and enter the Custom Medication created
    Then click on Search icon
    Then verify the searched Custom Medication is displayed
    Then verify "Not Controlled" is displayed under Controlled Substance column

@regression
  Scenario:Verify Controlled Substance column when Yes is selected
    And the user clicks on "Create New" button
    When the user enters alphanumeric character of length "20" in Custom Medication
    Then the user clicks controlled substance "Yes" button
    When click on Schedule drop-down field and select "<scheduleValue>"
    Then the user clicks on "Save" button
    Then click on Search field and enter the Custom Medication created
    Then click on Search icon
    Then verify the searched Custom Medication is displayed
    Then verify "<scheduleValue>" is displayed under Controlled Substance column
    Examples:
      | scheduleValue |
      | Schedule II   |
      | Schedule III  |
      | Schedule IV   |
      | Schedule V    |

@regression
  Scenario:Verify when validation message when user changes status from Active to Inactive
    And the user clicks on "Create New" button
    When the user enters alphanumeric character of length "20" in Custom Medication
    Then the user clicks controlled substance "No" button
    Then the user clicks on "Save" button
    Then click on Search field and enter the Custom Medication created
    Then click on Search icon
    Then verify the searched Custom Medication is displayed
    Then click on Active toggle Button
    Then verify "Status set to Inactive" in validation message
    Then verify "Current custom medication will be unavailable." in validation message
    Then verify "Toggle the status to manage availability of this custom medication." in validation message
    And the user clicks on "Cancel" button
    Then verify the status is still "Active"
    Then click on Active toggle Button
    When click on close icon on validation message
    Then verify the status is still "Active"
    Then click on Active toggle Button
    And the user clicks on "Confirm" button
    Then verify the status is still "Inactive"

@regression
  Scenario:Verify when validation message when user changes status from Inactive to Active
    And the user clicks on "Create New" button
    When the user enters alphanumeric character of length "20" in Custom Medication
    Then the user clicks controlled substance "No" button
    Then user toggles to status as "Inactive"
    Then the user clicks on "Save" button
    Then click on Search field and enter the Custom Medication created
    Then click on Search icon
    Then verify the searched Custom Medication is displayed
    Then click on Inactive toggle Button
    Then verify "Status set to Active" in validation message
    Then verify "Current custom medication will be available." in validation message
    Then verify "Toggle the status to manage availability of this custom medication." in validation message
    Then verify the status is still "Inactive"
    Then click on Inactive toggle Button
    When click on close icon on validation message
    Then verify the status is still "Inactive"
    Then click on Inactive toggle Button
    And the user clicks on "Confirm" button
    Then verify the status is still "Active"

@regression
  Scenario: Medication group added is displayed in Summary page
    And the user clicks on "Create New" button
    When the user enters alphanumeric character of length "20" in Custom Medication
    Then the user clicks controlled substance "No" button
    Then user enters "Analgesics" in Med-Group and select the Med-Group "Analgesics"
    Then user enters "Antibiotics" in Med-Group and select the Med-Group "Antibiotics"
    Then user enters "Antianxiety" in Med-Group and select the Med-Group "Antianxiety"
    Then the user clicks on "Save" button
    Then click on Search field and enter the Custom Medication created
    Then click on Search icon
    Then verify the searched Custom Medication is displayed
    Then verify "Analgesics, Antianxiety, Antibiotics" is displayed under MedGroup Column

@regression
  Scenario: Verify delete button is available for existing Custom Medication and not for new Medication
    And the user clicks on "Create New" button
    Then verify "Delete" button is not present
    When the user enters alphanumeric character of length "20" in Custom Medication
    Then the user clicks controlled substance "No" button
    Then the user clicks on "Save" button
    Then click on Search field and enter the Custom Medication created
    Then click on Search icon
    Then verify the searched Custom Medication is displayed
    Then user click on Custom Medication Name on summary page
    Then verify "Delete" button is present

@regression
  Scenario:Verify delete validation message and Cancel button functionality
    And the user clicks on "Create New" button
    When the user enters alphanumeric character of length "20" in Custom Medication
    Then the user clicks controlled substance "No" button
    Then the user clicks on "Save" button
    Then click on Search field and enter the Custom Medication created
    Then click on Search icon
    Then verify the searched Custom Medication is displayed
    Then user click on Custom Medication Name on summary page
    Then the user clicks on "Delete" button
    Then verify delete validation pop-up message
    Then the user clicks on Cancel button on delete validation message
    Then the user clicks on "Delete" button
    When click on close icon on validation message
    Then User clicks on back button
    Then click on Search field and enter the Custom Medication created
    Then click on Search icon
    Then verify the searched Custom Medication is displayed

@regression
  Scenario:Verify delete functionality on clicking  Delete button(User navigating back to summary page and delete custom Medication msg)
    And the user clicks on "Create New" button
    When the user enters alphanumeric character of length "20" in Custom Medication
    Then the user clicks controlled substance "No" button
    Then the user clicks on "Save" button
    Then click on Search field and enter the Custom Medication created
    Then click on Search icon
    Then verify the searched Custom Medication is displayed
    Then user click on Custom Medication Name on summary page
    Then the user clicks on "Delete" button
    Then on pop-up message user clicks on Delete button
    Then the user sees the message "Custom medication deleted successfully."
    Then user is navigated back to Summary page
    Then click on Search field and enter the Custom Medication created
    Then click on Search icon
    Then verify "No matches found" message is displayed in summary page

@regression
  Scenario:Verify when user refreshes the page after clicking on delete
    And the user clicks on "Create New" button
    When the user enters alphanumeric character of length "20" in Custom Medication
    Then the user clicks controlled substance "No" button
    Then the user clicks on "Save" button
    Then click on Search field and enter the Custom Medication created
    Then click on Search icon
    Then verify the searched Custom Medication is displayed
    Then user click on Custom Medication Name on summary page
    Then the user clicks on "Delete" button
    Then the user refreshes the page
    Then User clicks on back button
    Then click on Search field and enter the Custom Medication created
    Then click on Search icon
    Then verify the searched Custom Medication is displayed

@regression
  Scenario: Editing Custom Medication when control substance is yes
    Given the user clicks on "Create New" button
    When user creates a brand new custom medication
      | custMedName                     | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | saveBtn | status |
      | Automation Custom MedicationCSY | Yes                    | Schedule III  | 1,3-butane      | Antibiotics   | Save    | Active |
    Then User clicks on back button
    Then user types "<CustMedName>" in the search text field
    Then user click on Custom Medication Name on summary page
    And  Verify user able to navigate set-up page
    Then The correct data should be reflected in all the fields
      | custMedName                     | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | status |
      | Automation Custom MedicationCSY | Yes                    | 3             | 1,3-butane      | Antibiotics   | Active |
    Then user edits all the fields
      | custMedName                          | controllSubstanceValue | ingredientValue | medGroupValue | status   |
      | Automation Edit Custom MedicationCSY | No                     | 1,2-pentanedi   | Antianxiety   | Inactive |
    Then user able to see summary page
    And the user clicks on "Save" button
    And the user sees the message "Custom medication saved successfully."
    Then user types "<CustMedName>" in the search text field
    Then "No matches found" validation appears
    Then user types "<CustMedEditedName>" in the search text field
    And the new changes should be reflected on the UI
      | custMedName                          | controllSubstanceValue | medGroupValue | status   |
      | Automation Edit Custom MedicationCSY | Not Controlled         | Antianxiety   | Inactive |
    Examples:
      | CustMedName                     | CustMedEditedName                    |
      | Automation Custom MedicationCSY | Automation Edit Custom MedicationCSY |

@regression
  Scenario: Editing Custom Medication when control substance is No
    Given the user clicks on "Create New" button
    When user creates a brand new custom medication
      | custMedName                     | controllSubstanceValue | ingredientValue | medGroupValue | saveBtn | status   |
      | Automation Custom MedicationCSN | No                     | 1,3-butane      | Antibiotics   | Save    | Inactive |
    Then User clicks on back button
    Then user types "<CustMedName>" in the search text field
    Then user click on Custom Medication Name on summary page
    And  Verify user able to navigate set-up page
    Then The correct data should be reflected in all the fields
      | custMedName                     | controllSubstanceValue | ingredientValue | medGroupValue | saveBtn | status   |
      | Automation Custom MedicationCSN | No                     | 1,3-butane      | Antibiotics   | Save    | Inactive |
    Then user edits all the fields
      | custMedName                          | controllSubstanceValue | scheduleValue | ingredientValue      | medGroupValue   | saveBtn | status |
      | Automation Edit Custom MedicationCSN | Yes                    | Schedule III  | 212 Hour Nasal Spray | Antidepressants | Save    | Active |
    And the user clicks on "Save" button
    Then user able to see summary page
    And the user sees the message "Custom medication saved successfully."
    Then user types "<CustMedName>" in the search text field
    Then "No matches found" validation appears
    Then user types "<CustMedEditedName>" in the search text field
    And the new changes should be reflected on the UI
      | custMedName                          | controllSubstanceValue | medGroupValue   | status |
      | Automation Edit Custom MedicationCSN | Schedule III           | Antidepressants | Active |
    Examples:
      | CustMedName                     | CustMedEditedName                    |
      | Automation Custom MedicationCSN | Automation Edit Custom MedicationCSN |

@regression
  Scenario: Editing Custom Medication with Valid Validation
    Given the user clicks on "Create New" button
    When user creates a brand new custom medication
      | custMedName                    | controllSubstanceValue | ingredientValue | medGroupValue | saveBtn | status |
      | Automation Custom MedicationVV | No                     | 1,2-pentanedi   | Antibiotics   | Save    | Active |
    Then User clicks on back button
    Then user types "<CustMedName>" in the search text field
    Then user click on Custom Medication Name on summary page
    And  Verify user able to navigate set-up page
    Then The correct data should be reflected in all the fields
      | custMedName                    | controllSubstanceValue | ingredientValue | medGroupValue | saveBtn | status |
      | Automation Custom MedicationVV | No                     | 1,2-pentanedi   | Antibiotics   | Save    | Active |
    Then user enters name as "<name>" and sees validation message as "<message>"
    Examples:
      | name                           | message                                                                                       | CustMedName                    |
      | 12 Hour Nasal Spray 0.05 %     | The medication name already exists in the Global Library. The medication name must be unique. | Automation Custom MedicationVV |
      | Ω                              |                                                                                               | Automation Custom MedicationVV |
      | Typing 30 characters to verify | 30/70                                                                                         | Automation Custom MedicationVV |

@regression
  Scenario: Verfiying all the mandatory fields while editing custom medication
    Given the user clicks on "Create New" button
    When user creates a brand new custom medication
      | custMedName                    | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | saveBtn | status |
      | Automation Custom MedicationMF | Yes                    | Schedule III  | 1,3-butane      | Antibiotics   | Save    | Active |
    Then User clicks on back button
    Then user types "<CustMedName>" in the search text field
    Then user click on Custom Medication Name on summary page
    And  Verify user able to navigate set-up page
    Then The correct data should be reflected in all the fields
      | custMedName                    | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | saveBtn | status |
      | Automation Custom MedicationMF | Yes                    | 3             | 1,3-butane      | Antibiotics   | Save    | Active |
    Then user clears all the values
    And the user clicks on "Save" button
    Then verify the error message "1 Error Found"
    Then verify "Custom Medication Name"error link
    When click on Custom Medication error link
    Then user is navigated to Custom Medication name field
    Then Custom medication field validation should "be" "Custom medication name is required."
    Then Custom medication field should "be" highlighted with red border
    Then user Enter "Unique" Custom Medication name
    Then the user clears all the mandatory values
    Then the user clicks controlled substance "Yes" button
    And the user clicks on "Save" button
    Then user Enter "Unique" Custom Medication name
    Then verify "DEA Schedule" error link and click
    Then user is navigated to Schedule dropdown field
    Then Schedule validation should "be" "DEA schedule is required."
    Then Schedule field should "be" highlighted with red border
    When click on Schedule drop-down field and select "Schedule III"
    And the user clicks on "Save" button
    And the user sees the message "Custom medication saved successfully."
    Examples:
      | CustMedName                    |
      | Automation Custom MedicationMF |

@regression
  Scenario: Canceling Edit with Confirmation Pop-Up and Retaining Previous Version
    Given the user clicks on "Create New" button
    When user creates a brand new custom medication
      | custMedName                       | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | saveBtn | status |
      | Automation Custom MedicationCERPV | Yes                    | Schedule III  | 1,3-butane      | Antibiotics   | Save    | Active |
    Then User clicks on back button
    Then user types "<CustMedName>" in the search text field
    Then user click on Custom Medication Name on summary page
    And  Verify user able to navigate set-up page
    Then The correct data should be reflected in all the fields
      | custMedName                       | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | saveBtn | status |
      | Automation Custom MedicationCERPV | Yes                    | 3             | 1,3-butane      | Antibiotics   | Save    | Active |
    Then user edits all the fields
      | custMedName                            | controllSubstanceValue | ingredientValue | medGroupValue | status   |
      | Automation Edit Custom MedicationCERPV | No                     | 1,2-pentanedi   | Antianxiety   | Inactive |
    Then the user clicks on "Cancel" button
    And user verifies the text messages on the popup
      | Heading                  | firstLine                                                     | lastLine                          | YesBtn | NoBtn |
      | Cancel Custom Medication | Are you sure you want to cancel this custom medication entry? | All unsaved changes will be lost. | Yes    | No    |
    Then the user clicks on "Yes" button
    Then The correct data should be reflected in all the fields
      | custMedName                       | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | saveBtn | status |
      | Automation Custom MedicationCERPV | Yes                    | 3             | 1,3-butane      | Antibiotics   | Save    | Active |
    Examples:
      | CustMedName                       |
      | Automation Custom MedicationCERPV |

@regression 
  Scenario: Canceling Edit with Confirmation Pop-Up and Changing the values
    Given the user clicks on "Create New" button
    When user creates a brand new custom medication
      | custMedName                      | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | saveBtn | status |
      | Automation Custom MedicationCECV | Yes                    | Schedule III  | 1,3-butane      | Antibiotics   | Save    | Active |
    Then User clicks on back button
    Then user types "<CustMedName>" in the search text field
    Then user click on Custom Medication Name on summary page
    And  Verify user able to navigate set-up page
    Then The correct data should be reflected in all the fields
      | custMedName                      | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | saveBtn | status |
      | Automation Custom MedicationCECV | Yes                    | 3             | 1,3-butane      | Antibiotics   | Save    | Active |
    Then user edits all the fields
      | custMedName                           | controllSubstanceValue | ingredientValue | medGroupValue | saveBtn | status   |
      | Automation Edit Custom MedicationCECV | No                     | 1,2-pentanedi   | Antianxiety   | Save    | Inactive |
    Then the user clicks on "Cancel" button
    And user verifies the text messages on the popup
      | Heading                  | firstLine                                                     | lastLine                          | YesBtn | NoBtn |
      | Cancel Custom Medication | Are you sure you want to cancel this custom medication entry? | All unsaved changes will be lost. | Yes    | No    |
    Then the user clicks on "No" button
    And  Verify user able to navigate set-up page
    Then The correct data should be reflected in all the fields
      | custMedName                           | controllSubstanceValue | ingredientValue | medGroupValue | saveBtn | status   |
      | Automation Edit Custom MedicationCECV | No                     | 1,2-pentanedi   | Antianxiety   | Save    | Inactive |
    And the user clicks on "Save" button
    Then user able to see summary page
    And the user sees the message "Custom medication saved successfully."
    Then user types "<CustMedEditedName>" in the search text field
    And the new changes should be reflected on the UI
      | custMedName                           | controllSubstanceValue | medGroupValue | status   |
      | Automation Edit Custom MedicationCECV | Not Controlled         | Antianxiety   | Inactive |
    Examples:
      | CustMedName                      | CustMedEditedName                     |
      | Automation Custom MedicationCECV | Automation Edit Custom MedicationCECV |

@regression
  Scenario: Canceling Edit without any changes and Retaining Previous Version
    Given the user clicks on "Create New" button
    When user creates a brand new custom medication
      | custMedName                      | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | saveBtn | status |
      | Automation Custom MedicationCEWC | Yes                    | Schedule III  | 1,3-butane      | Antibiotics   | Save    | Active |
    Then User clicks on back button
    Then user types "<CustMedName>" in the search text field
    Then user click on Custom Medication Name on summary page
    And  Verify user able to navigate set-up page
    Then The correct data should be reflected in all the fields
      | custMedName                      | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | saveBtn | status |
      | Automation Custom MedicationCEWC | Yes                    | 3             | 1,3-butane      | Antibiotics   | Save    | Active |
    Then the user clicks on "Cancel" button
    Then user able to see summary page
    Then user types "<CustMedName>" in the search text field
    And the new changes should be reflected on the UI
      | custMedName                      | controllSubstanceValue | ingredientValue | medGroupValue | saveBtn | status |
      | Automation Custom MedicationCEWC | Schedule III           | 1,3-butane      | Antibiotics   | Save    | Active |
    Examples:
      | CustMedName                      |
      | Automation Custom MedicationCEWC |

@regression
  Scenario: Canceling Edit with the same changes and Retaining Previous Version
    Given the user clicks on "Create New" button
    When user creates a brand new custom medication
      | custMedName                    | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | saveBtn | status |
      | Automation Custom MedicationSC | Yes                    | Schedule III  | 1,3-butane      | Antibiotics   | Save    | Active |
    Then User clicks on back button
    Then user types "<CustMedName>" in the search text field
    Then user click on Custom Medication Name on summary page
    And  Verify user able to navigate set-up page
    Then The correct data should be reflected in all the fields
      | custMedName                    | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | saveBtn | status |
      | Automation Custom MedicationSC | Yes                    | 3             | 1,3-butane      | Antibiotics   | Save    | Active |
    Then user edits all the fields
      | custMedName                    | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | saveBtn | status |
      | Automation Custom MedicationSC | Yes                    | Schedule III  | 1,3-butane      | Antibiotics   | Save    | Active |
    Then the user clicks on "Cancel" button
    And user verifies the text messages on the popup
      | Heading                  | firstLine                                                     | lastLine                          | YesBtn | NoBtn |
      | Cancel Custom Medication | Are you sure you want to cancel this custom medication entry? | All unsaved changes will be lost. | Yes    | No    |
    Then the user clicks on "No" button
    And  Verify user able to navigate set-up page
    Then The correct data should be reflected in all the fields
      | custMedName                    | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | saveBtn | status |
      | Automation Custom MedicationSC | Yes                    | 3             | 1,3-butane      | Antibiotics   | Save    | Active |
    And the user clicks on "Save" button
    Then user able to see summary page
    And the user sees the message "Custom medication saved successfully."
    Then user types "<CustMedEditedName>" in the search text field
    And the new changes should be reflected on the UI
      | custMedName                    | controllSubstanceValue | medGroupValue | status |
      | Automation Custom MedicationSC | Schedule III           | Antibiotics   | Active |
    Examples:
      | CustMedName                    | CustMedEditedName              |
      | Automation Custom MedicationSC | Automation Custom MedicationSC |

@regression
  Scenario: Refreshing the Set-Up Page after Edit (Last saved values(saved ones) should be shown on edit page itself)
    Given the user clicks on "Create New" button
    When user creates a brand new custom medication
      | custMedName                         | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | saveBtn | status |
      | Automation Custom MedicationRefresh | Yes                    | Schedule III  | 1,3-butane      | Antibiotics   | Save    | Active |
    Then User clicks on back button
    Then user types "<CustMedName>" in the search text field
    Then user click on Custom Medication Name on summary page
    And  Verify user able to navigate set-up page
    Then The correct data should be reflected in all the fields
      | custMedName                         | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | saveBtn | status |
      | Automation Custom MedicationRefresh | Yes                    | 3             | 1,3-butane      | Antibiotics   | Save    | Active |
    Then user edits all the fields
      | custMedName                              | controllSubstanceValue | ingredientValue | medGroupValue | saveBtn | status   |
      | Automation Edit Custom MedicationRefresh | No                     | 1,3-butane      | Antianxiety   | Save    | Inactive |
    Then the user reloads the browser
    And  Verify user able to navigate set-up page
    Then The correct data should be reflected in all the fields
      | custMedName                         | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | saveBtn | status |
      | Automation Custom MedicationRefresh | Yes                    | 3             | 1,3-butane      | Antibiotics   | Save    | Active |
    Examples:
      | CustMedName                         |
      | Automation Custom MedicationRefresh |

@regression
  Scenario: Verify user is able to navigate to set-up page on clicking on created custom medication Name
    And the user clicks on "Create New" button
    When the user enters alphanumeric character of length "20" in Custom Medication
    Then the user clicks controlled substance "Yes" button
    When click on Schedule drop-down field and select "Schedule III"
    Then the user clicks on "Save" button
    Then click on Search field and enter the Custom Medication created
    Then click on Search icon
    Then user click on Custom Medication Name on summary page
    Then Verify user able to navigate set-up page

@regression
  Scenario: Verify Obsolete keyword for discontinued Ingredients in Ingredients dropdown
    Given the user clicks on "Create New" button
    When user creates a brand new custom medication
      | custMedName           | ingredientValue | ingredientValue2 | medGroupValue | medGroupValue2 | saveBtn | status |
      | AutomationMockCustMed | 1,3-butane      | 1,2-pentanedi    | Antibiotics   | Antianxiety    | Save    | Active |
    Then User clicks on back button
    Then user types "<custMedName>" in the search text field
    Then Dynamically hit the ingredients API with mock data "<custMedName>"
    Examples:
      | custMedName           |
      | AutomationMockCustMed |

@regression
  Scenario: Verify user is able to delete Custom MEdication with Obsolete Ingredients
    Given the user clicks on "Create New" button
    When user creates a brand new custom medication
      | custMedName                 | ingredientValue | ingredientValue2 | medGroupValue | medGroupValue2 | saveBtn | status |
      | AutomationMockCustMedDelete | 1,3-butane      | 1,2-pentanedi    | Antibiotics   | Antianxiety    | Save    | Active |
    Then User clicks on back button
    Then user types "<custMedName>" in the search text field
    Then Dynamically hit the ingredients API with mock data "<custMedName>"
    Then the user clicks on "Delete" button
    Then on pop-up message user clicks on Delete button
    Then the user sees the message "Custom medication deleted successfully."
    Then user is navigated back to Summary page
    Then user types "<custMedName>" in the search text field
    Then verify "No matches found" message is displayed in summary page
    Examples:
      | custMedName                 |
      | AutomationMockCustMedDelete |

@regression
  Scenario: Verify user is able to Save Custom MEdication with Obsolete Ingredients
    Given the user clicks on "Create New" button
    When user creates a brand new custom medication
      | custMedName               | ingredientValue | ingredientValue2 | medGroupValue | medGroupValue2 | saveBtn | status |
      | AutomationMockCustMedSave | 1,3-butane      | 1,2-pentanedi    | Antibiotics   | Antianxiety    | Save    | Active |
    Then User clicks on back button
    Then user types "<custMedName>" in the search text field
    Then Dynamically hit the ingredients API with mock data "<custMedName>"
    Then the user clicks on "Save" button
    Then user types "<custMedName>" in the search text field
    And the new changes should be reflected on the UI
      | custMedName               | controllSubstanceValue | medGroupValue            | status |
      | AutomationMockCustMedSave | Not Controlled         | Antianxiety, Antibiotics | Active |
    Examples:
      | custMedName               |
      | AutomationMockCustMedSave |

@regression
  Scenario:Verify user is able to Cancel Custom MEdication with Obselete Ingredients
    Given the user clicks on "Create New" button
    When user creates a brand new custom medication
      | custMedName                 | ingredientValue | ingredientValue2 | medGroupValue | medGroupValue2 | saveBtn | status |
      | AutomationMockCustMedCancel | 1,3-butane      | 1,2-pentanedi    | Antibiotics   | Antianxiety    | Save    | Active |
    Then User clicks on back button
    Then user types "<custMedName>" in the search text field
    Then Dynamically hit the ingredients API with mock data "<custMedName>"
    Then the user clicks on "Cancel" button
    Then user types "<custMedName>" in the search text field
    And the new changes should be reflected on the UI
      | custMedName                 | controllSubstanceValue | medGroupValue | status |
      | AutomationMockCustMedCancel | Not Controlled         | Antibiotics   | Active |
    Examples:
      | custMedName                 |
      | AutomationMockCustMedCancel |

@regression
  Scenario: Verify user is able to sort the custom medication name entire list for all pages
    Given user creates "60" "Active" custom medicines with name starting with "<Characters>" through API
    Then the user refreshes the page
    And user waits
    Then the sort order of cust med names should be "asc"
    When user navigates to the page number "2"
    Then the sort order of cust med names should be "asc"
    When user navigates to the page number "3"
    Then the sort order of cust med names should be "asc"
    Given the user clicks on "Create New" button
    Then the user clicks on "Cancel" button
    And user waits
    Then the sort order of cust med names should be "asc"
    And the user clicks on "Create New" button
    When the user enters alphanumeric character of length "20" in Custom Medication
    Then the user clicks controlled substance "No" button
    Then the user clicks on "Save" button
    And user waits
    Then the sort order of cust med names should be "asc"
    When the user clicks on the arrow button next to Custom medication column
    Then the sort order of cust med names should be "desc"
    When user navigates to "1" page
    Then the sort order of cust med names should be "desc"
    When user navigates to the page number "2"
    Then the sort order of cust med names should be "desc"
    Given the user clicks on "Create New" button
    Then the user clicks on "Cancel" button
    And user waits
    Then the sort order of cust med names should be "desc"
    And the user clicks on "Create New" button
    When the user enters alphanumeric character of length "20" in Custom Medication
    Then the user clicks controlled substance "No" button
    Then the user clicks on "Save" button
    And user waits
    Then the sort order of cust med names should be "desc"
    When user navigates to the page number "3"
    Then the sort order of cust med names should be "desc"
    When the user clicks on the arrow button next to Custom medication column
    Then the sort order of cust med names should be "asc"
    When user navigates to "1" page
    Then the sort order of cust med names should be "asc"
    Examples:
      | Characters     |
      | Automationtest |

@regression
  Scenario: Custom Medication Listing page verify user is redirected to same page after page refresh
    Given user creates "60" "Active" custom medicines with name starting with "Automation" through API
    Then the user reloads the browser
    When user navigates to Custom Medication page number 3
    Then the user reloads the browser
    Then verify user is on same page

@regression
  Scenario: Custom Medication Listing page verify user is redirected to same page after clicking on Back, Cancel and Save button
    Given user creates "60" "Active" custom medicines with name starting with "Automation" through API
    Then the user reloads the browser
    When user navigates to Custom Medication page number 3
    Then user clicks on Custom Medication first record
    Then User clicks on back button
    Then verify user is on same page
    Then user clicks on Custom Medication first record
    And the user clicks on "Cancel" button
    Then verify user is on same page
    Then user clicks on Custom Medication first record
    When user edits all the fields
      | custMedName                          | controllSubstanceValue | ingredientValue | medGroupValue | status   |
      | Automation Edit Custom MedicationCSY | No                     | 1,2-pentanedi   | Antianxiety   | Inactive |
    And the user clicks on "Save" button
    Then verify user is on same page

@regression
  Scenario: Custom Medication Listing page verify user is redirected to same page while creating new Custom Medication and clicking on Back, Cancel and Save button
    Given user creates "60" "Active" custom medicines with name starting with "Automation" through API
    Given the user reloads the browser
    Given user navigates to Custom Medication page number 3
    Given the user clicks on "Create New" button
    Then User clicks on back button
    And verify user is on same page
    Given the user clicks on "Create New" button
    Then the user clicks on 'Cancel' button
    And verify user is on same page
    Given the user clicks on "Create New" button
    When user creates a new Custom Medication and Save
      | custMedName                                     | controllSubstanceValue | scheduleValue | ingredientValue | medGroupValue | status | saveBtn | message                               | numberOfMedicinesCreated |
      | AutomationCalcium 1%  - # & @ 1 phosphate hydro | Yes                    | Schedule III  | ty              | Antibiotics   | Active | Save    | Custom medication saved successfully. | 1                        |
    And verify user is on same page











