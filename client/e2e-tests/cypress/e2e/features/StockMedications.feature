Feature: Create Stock Medications
    Background: Launching the App and Navigating to Stock Medications Tab
        Given the user is logged into the SNF Url with credentials
            | url                                  | username       | password   |
            | https://qa61.matrixcare.me/Login.jsp | orders_support | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        When the user clicks "Order Platform Setup" tab in the Order Platform Configuration screen
        And the user clicks the "Stock Medication List" left tab
        Then User selects "OKTA Stock Medication/Supply List" from the list

    @regression
    Scenario: Verify Labels in Add New Stock Medication screen
        Given the user clicks on "Add New" button
        Then User able to see "Add New Stock Medication/Supply" on header sections
        Then User able to see "No medications/supplies have been selected." Warning Message
        Then user verifies "Save" button is displayed
        Then user verifies "Cancel" button is displayed
        Then User able to see "Selected medication/supply will also apply to its generics"

    @regression
    Scenario: Verify validation pop-up when user clicks on Cancel button returning to Sumary screen without saving the Stock Medications
        Given the user clicks on "Add New" button
        And user waits
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Cancel" button
        Then user is able to see the Cancel popup with message "Would you like to save the changes you've made before navigating back?"
        When the user clicks on "No" button
        Then User able to see "Add New Stock Medication/Supply" on header sections
        When the user clicks on "Cancel" button
        Then user is able to see the Cancel popup with message "Would you like to save the changes you've made before navigating back?"
        Then the user clicks on "Yes" button
        Then the user navigates back to the Stock Medication List Page

    @regression
    Scenario: Verify validation message when insufficient characters are entered in Stock Medications
        Given the user clicks on "Add New" button
        And user waits
        Then click on Medication field drop-down
        When user types characters as "<Characters>"
        Then the validation should appear as "Enter at least 2 characters to search"
        Examples:
            | Characters |
            | #          |
            | a          |

    @regression
    Scenario: Verify the error links and user is able to navigate to Stock Medications name field on clicking Stock Medications error link
        Given the user clicks on "Add New" button
        And user waits
        Then the user clicks on "Save" button
        Then verify the error message "1 Error found"
        Then verify error link "Medication/Supply"
        Then User Verify error message "Medication/Supply is required."
        Then user click on x Button on Error message
        Then user close the Add New Stock Medication
        Then the user navigates back to the Stock Medication List Page

    @regression
    Scenario: Verify the Facilty section and Unit section
        Given the user clicks on "Add New" button
        And user waits
        Then User verify "Facility" ,"OKTA Stock Medication/Supply List" Label
        Then user click on Unit dropdown
        Then "Villas", "Park Vista North" user is able to see
        Then user checks "Villas","Park Vista North" checkboxes
        Then user click on ouside of the dropdown
        Then verify "Villas, Park Vista North" selected

    @regression
    Scenario: Verify the increase and decrease count and the text message by adding and removing for Stock Medications
        Given the user clicks on "Add New" button
        And user waits
        When Enter "an" in the Medication
        When user selects "5" Ingredients values
        Then verify the message for the field after selecting 15 items "You can select a maximum of 15 medications/supplies."
        Then user click on ouside of the dropdown
        Then clicks on Remove icon "5" times

    @regression
    Scenario: Verify user is able to type and Search On Stock Medications
        Given the user clicks on "Add New" button
        And user waits
        When Enter "1-Day 6.5 % vaginal ointment" in the Medication
        Then select the Ingredients "1-Day 6.5 % vaginal ointment" from the list and verify it is dispalyed

    @regression
    Scenario: User should be able to see toast message on entering all mandatory fields clicking on save
        Given the user clicks on "Add New" button
        And user waits
        When Enter "1-Day 6.5 % vaginal ointment" in the Medication
        Then select the Ingredients "1-Day 6.5 % vaginal ointment" from the list and verify it is dispalyed
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        Then the user sees the message "Stock Medication/Supply saved successfully."

    @regression
    Scenario: Verify validation message when user enter in Stock Medications field random text but no search results are found.
        Given the user clicks on "Add New" button
        And user waits
        When Enter "<Characters>" in the Medication
        Then the validation should appear as "No matches found"
        Examples:
            | Characters |
            | #^         |
            | edsffsg    |

    @regression
    Scenario: Verify user navigate to Summary page when click on Save Button
        When User deletes all the stock medications from UI
        Then user deletes the stock med in the "Gaama, Alpha Stock Medication/Supply" facility in DB
        Given the user clicks on "Add New" button
        And user waits
        When Enter "1-Day 6.5 % vaginal ointment" in the Medication
        Then select the Ingredients "1-Day 6.5 % vaginal ointment" from the list and verify it is dispalyed
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        Then the user sees the message "Stock Medication/Supply saved successfully."
        Then the user navigates back to the Stock Medication List Page
        Then Stock Medication Header should be "OKTA Stock Medication/Supply List"
        Then User clicks on back button
        Then User selects "Gaama, Alpha Stock Medication/Supply List" from the list
        Then user verifies on UI "0" stock medications are exported in the "Gaama, Alpha Stock Medication/Supply List" facility

    @regression
    Scenario: Verify user is able to see No Medications have been selected
        Given the user clicks on "Add New" button
        And user waits
        When Enter "tr" in the Medication
        When user selects "5" Ingredients values
        Then user click on ouside of the dropdown
        Then clicks on Remove icon "5" times
        Then verify the message for "No medications/supplies have been selected."

    @regression
    Scenario: Verify 45 records is created
        Given the user clicks on "Add New" button
        And user waits
        When Enter "<Medication Name>" in the Medication
        When user selects "15" Ingredients values
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        And user waits
        Examples:
            | Medication Name |
            | rt              |
            | ko              |
            | me              |

    @regression
    Scenario: Verify user is able to sort the list page
        And user waits
        Then the sort order of stock medication should be "asc"
        Then click on Medication or Supply sort
        Then the sort order of stock medication should be "desc"
        Then click on Medication or Supply sort
        Then the sort order of stock medication should be "asc"
        Then click on AssignTo sort
        Then the sort order of assigned to should be "desc"
        Then click on AssignTo sort
        Then the sort order of assigned to should be "asc"

    @regression
    Scenario: Verify No matches found when user searches with wrong Medication
        And user waits
        Then user types "automation" in the search text field
        Then verify "No matches found" message is displayed in summary page
        Then user types "meclofenamate 50 mg capsule" in the search text field
        Then verify "meclofenamate 50 mg capsule" is displayed in list page

    @regression
    Scenario: Verify pagination functionality in the list page
        And user waits
        Then the "previuos" navigation arrow should be "disabled"
        And the "first" navigation arrow should be "disabled"
        When user clicks on next page arrow
        And the "previuos" navigation arrow should be "enabled"
        And the "first" navigation arrow should be "enabled"
        And the "next" navigation arrow should be "enabled"
        And the "last" navigation arrow should be "enabled"
        When the user navigates to last page
        Then the "next" navigation arrow should be "disabled"
        And the "last" navigation arrow should be "disabled"

    @regression #FixIt
    Scenario: Verify Add New button is disable when user selects more than 2 checkboxes
        Given the user clicks on "Add New" button
        And user waits
        When Enter "tr" in the Medication
        When user selects "15" Ingredients values
        Then the user clicks on "Save" button
        And user waits
        Given the user clicks on "Add New" button
        And user waits
        When Enter "an" in the Medication
        When user selects "15" Ingredients values
        Then the user clicks on "Save" button
        And user waits
        Then check the main checkboxes and verify all the checkboxes is checked
        Then the user refreshes the page
        Then verify all the checkboxes is unchecked in the page
        Then check the main checkboxes and verify all the checkboxes is checked
        Then verify Add New button is "disabled"
        When user clicks on next page arrow
        And user waits
        Then verify all the checkboxes is unchecked in the page
        Then verify Add New button is "disabled"
        Then the user refreshes the page
        Then verify all the checkboxes is unchecked in the page

    @regression
    Scenario: Verify user is able to edit the existing record
        When User deletes all the stock medications from UI
        Given the user clicks on "Add New" button
        And user waits
        When Enter "ce" in the Medication
        When user selects "1" Ingredients values
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        Then the user sees the message "Stock Medication/Supply saved successfully."
        Then the user navigates back to the Stock Medication List Page
        Then user types "cedar leaf oil (bulk)" in the search text field
        Then user click "cedar leaf oil (bulk)" on Stock Medication summary page
        Then verify "Villas" selected
        Then user verifies Delete button is visible
        Then User able to see "Edit Stock Medication/Supply" on header sections
        Then User select "Park Vista North" on Units Dropdown
        Then the user clicks on "Save" button
        Then the user sees the message "Stock Medication/Supply saved successfully."

    @regression
    Scenario: Verify user is able to delete single record from summary page
        When User deletes all the stock medications from UI
        Then user deletes the stock med in the "Gaama, Alpha Stock Medication/Supply" facility in DB
        Then User clicks on back button
        Then User selects "Gaama, Alpha Stock Medication/Supply List" from the list
        Given the user clicks on "Add New" button
        When user select the following in the "Medication/Supply" field
            | MedicationName        |
            | Adempas 1.5 mg tablet |
        Then the user clicks on "Save" button
        Then User clicks on back button
        Then User selects "OKTA Stock Medication/Supply List" from the list
        Given the user clicks on "Add New" button
        When Enter "1-Day 6.5 % vaginal ointment" in the Medication
        Then select the Ingredients "1-Day 6.5 % vaginal ointment" from the list and verify it is dispalyed
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        Then the user navigates back to the Stock Medication List Page
        And user waits
        Then user selects the created "1" Stock Medication
        And user waits
        Then the user clicks on "Delete" button
        And user waits
        Then the popup appears as " Delete Stock Medication/Supply"
        And user verifies the message as "Are you sure you want to delete this stock medication/supply?"
        And user verifies the second message as "You cannot undo this action."
        And the user clicks on Delete button on the confirmation popup
        Then user sees the message as "Stock Medication/Supply deleted successfully."
        Then user types "1-Day 6.5 % vaginal ointment" in the search text field
        Then Stock medication "should not" exist on summary page
        Then User clicks on back button
        Then User selects "Gaama, Alpha Stock Medication/Supply List" from the list
        Then Stock medication "should" exist on summary page

    @regression
    Scenario: Verify user is able to delete multiple records from summary page
        When User deletes all the stock medications from UI
        And user waits
        Given the user clicks on "Add New" button
        When Enter "me" in the Medication
        And user waits
        When user selects "6" Ingredients values
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        Then the user navigates back to the Stock Medication List Page
        And user waits
        Then user types "me" in the search text field
        Then user selects the created "6" Stock Medication
        Then the user clicks on "Delete" button
        Then the popup appears as " Delete Stock Medication/Supply"
        And user verifies the message as "Are you sure you want to delete 6 stock medication/supply?"
        And user verifies the second message as "You cannot undo this action."
        And the user clicks on Delete button on the confirmation popup
        Then user sees the message as "Stock Medication/Supply deleted successfully."
        Then user types "me" in the search text field
        Then Stock medication "should not" exist on summary page

    @regression
    Scenario: Verify user is able delete multiple records from summary page using select all
        When User deletes all the stock medications from UI
        And user waits
        Given the user clicks on "Add New" button
        When Enter "tr" in the Medication
        When user selects "10" Ingredients values
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        Then the user navigates back to the Stock Medication List Page
        Then user types "tr" in the search text field
        Then user clicks on Select All checkbox
        Then the user clicks on "Delete" button
        Then the popup appears as " Delete Stock Medication/Supply"
        And the user clicks on Delete button on the confirmation popup
        Then user sees the message as "Stock Medication/Supply deleted successfully."
        Then user types "tr" in the search text field
        Then Stock medication "should not" exist on summary page

    @regression
    Scenario: Verify on canceling the delete items are not deleted and user remains on the same page
        When User deletes all the stock medications from UI
        And user waits
        Given the user clicks on "Add New" button
        When Enter "tr" in the Medication
        When user selects "10" Ingredients values
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        Then the user navigates back to the Stock Medication List Page
        Then user types "tr" in the search text field
        Then user clicks on Select All checkbox
        Then the user clicks on "Delete" button
        Then the popup appears as " Delete Stock Medication/Supply"
        Then the user clicks on cancel button on popup
        Then user types "tr" in the search text field
        Then Stock medication "should" exist on summary page
        Then user clicks on Select All checkbox
        Then the user clicks on "Delete" button
        Then the popup appears as " Delete Stock Medication/Supply"
        Then the user clicks on Cross button
        Then the user clicks on "Cancel" button
        Then user types "tr" in the search text field
        Then Stock medication "should" exist on summary page

    @regression
    Scenario: Verify user is able to delete the item on edit page
        When User deletes all the stock medications from UI
        And user waits
        Given the user clicks on "Add New" button
        When Enter "1-Day 6.5 % vaginal ointment" in the Medication
        Then select the Ingredients "1-Day 6.5 % vaginal ointment" from the list and verify it is dispalyed
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        Then the user navigates back to the Stock Medication List Page
        And user waits
        Then User selects the first stock medication
        Then User able to see "Edit Stock Medication/Supply" on header sections
        And the user clicks on Delete button on edit page
        Then the popup appears as " Delete Stock Medication/Supply"
        And user verifies the message as "Are you sure you want to delete this stock medication/supply?"
        And user verifies the second message as "You cannot undo this action."
        And the user clicks on Delete button on the confirmation popup
        Then user sees the message as "Stock Medication/Supply deleted successfully."
        Then user types "1-Day 6.5 % vaginal ointment" in the search text field
        Then Stock medication "should not" exist on summary page

    @regression
    Scenario: Verify stock med is not deleted when user clicks on cancel or X button
        When User deletes all the stock medications from UI
        And user waits
        Given the user clicks on "Add New" button
        When Enter "1-Day 6.5 % vaginal ointment" in the Medication
        Then select the Ingredients "1-Day 6.5 % vaginal ointment" from the list and verify it is dispalyed
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        Then the user navigates back to the Stock Medication List Page
        And user waits
        Then User selects the first stock medication
        Then User able to see "Edit Stock Medication/Supply" on header sections
        And the user clicks on Delete button on edit page
        And user waits
        Then the popup appears as " Delete Stock Medication/Supply"
        Then the user clicks on cancel button on popup
        Then the user clicks on "Cancel" button
        Then user types "1-Day 6.5 % vaginal ointment" in the search text field
        Then Stock medication "should" exist on summary page
        Then User selects the first stock medication
        Then User able to see "Edit Stock Medication/Supply" on header sections
        And the user clicks on Delete button on edit page
        And user waits
        Then the popup appears as " Delete Stock Medication/Supply"
        Then the user clicks on Cross button
        Then the user clicks on "Cancel" button
        Then user types "1-Day 6.5 % vaginal ointment" in the search text field
        Then Stock medication "should" exist on summary page

    @regression
    Scenario: Verify user is able to see duplicate message with some of records duplicate
        When User deletes all the stock medications from UI
        Given the user clicks on "Add New" button
        And user waits
        When user select the following in the "Medication/Supply" field
            | MedicationName         |
            | Tylenol 325 mg capsule |
            | Lasix 80 mg tablet     |
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        And user waits
        Then the user sees the message "Stock Medication/Supply saved successfully."
        Then the user navigates back to the Stock Medication List Page
        Given the user clicks on "Add New" button
        And user waits
        When user select the following in the "Medication/Supply" field
            | MedicationName         |
            | Tylenol 325 mg capsule |
            | Lasix 80 mg tablet     |
            | Prozac 10 mg capsule   |
            | Prozac 20 mg capsule   |
        Then the user clicks on "Save" button
        Then the user sees the message "Saved 2 of 4 medication/supplies. 2 duplicate medications/supplies already exist in the library."

    @regression
    Scenario: Verify user is able to see duplicate message with all records duplicate
        When User deletes all the stock medications from UI
        Given the user clicks on "Add New" button
        And user waits
        When user select the following in the "Medication/Supply" field
            | MedicationName        |
            | Adempas 1.5 mg tablet |
            | Adempas 1 mg tablet   |
            | Adempas 0.5 mg tablet |
            | Actonel 35 mg tablet  |
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        And user waits
        Then the user see the message "Stock Medication/Supply saved successfully."
        Then the user navigates back to the Stock Medication List Page
        Given the user clicks on "Add New" button
        And user waits
        When user select the following in the "Medication/Supply" field
            | MedicationName        |
            | Adempas 1.5 mg tablet |
            | Adempas 1 mg tablet   |
            | Adempas 0.5 mg tablet |
            | Actonel 35 mg tablet  |
        Then the user clicks on "Save" button
        Then the user sees the message "Saved 0 of 4 medication/supplies. 4 duplicate medications/supplies already exist in the library."

    @regression @sanity
    Scenario: Verify the functionality of export selected medications
        When User deletes all the stock medications from UI
        And user waits
        Then user deletes the stock med in the "GM Facility A Stock Medication/Supply" facility in DB
        Then user deletes the stock med in the "Gaama, Alpha Stock Medication/Supply" facility in DB
        Given the user clicks on "Add New" button
        When user select the following in the "Medication/Supply" field
            | MedicationName        |
            | Adempas 1.5 mg tablet |
            | Adempas 1 mg tablet   |
            | Adempas 0.5 mg tablet |
            | Actonel 35 mg tablet  |
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        And user waits
        Then user selects the created "2" Stock Medication
        Then the user clicks on "Export" button
        Then the user clicks on "Export Selected" link
        Then the user verifies "Export" "2" "Medication/Supply List" to popup appears
        Then user selects "GM Facility A Stock Medication/Supply List" facility
        Then user selects "Assisted Living" unit
        Then the user clicks on Export button on popup
        Then user verifies the validation message as "Stock Medications/Supplies exported successfully."
        Then verify user is redirected to stockMed list page
        Then Stock Medication Header should be "OKTA Stock Medication/Supply List"
        Then user verifies "2" stock medications are exported in the "GM Facility A Stock Medication/Supply" facility
        Then User clicks on back button
        Then User selects "GM Facility A Stock Medication/Supply List" from the list
        Then user verifies on UI "2" stock medications are exported in the "GM Facility A Stock Medication/Supply List" facility
        Then User clicks on back button
        Then User selects "Gaama, Alpha Stock Medication/Supply List" from the list
        Then user verifies on UI "0" stock medications are exported in the "Gaama, Alpha Stock Medication/Supply List" facility

    @regression
    Scenario: Verify the functionality of export list medications
        When User deletes all the stock medications from UI
        Then user deletes the stock med in the "GM Facility A Stock Medication/Supply" facility in DB
        Then user deletes the stock med in the "Gaama, Alpha Stock Medication/Supply" facility in DB
        Given the user clicks on "Add New" button
        And user waits
        When user select the following in the "Medication/Supply" field
            | MedicationName        |
            | Adempas 1.5 mg tablet |
            | Adempas 1 mg tablet   |
            | Adempas 0.5 mg tablet |
            | Actonel 35 mg tablet  |
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        And user waits
        Then the user clicks on "Export" button
        Then user verifies the "Export Selected" button is disabled
        Then the user clicks on "Export List" link
        Then the user verifies "Export" "4" "Medication/Supply List" to popup appears
        Then user selects "GM Facility A Stock Medication/Supply List" facility
        Then user selects "Assisted Living" unit
        Then the user clicks on Export button on popup
        Then user verifies the validation message as "Stock Medications/Supplies exported successfully."
        Then verify user is redirected to stockMed list page
        Then user verifies "4" stock medications are exported in the "GM Facility A Stock Medication/Supply" facility
        Then User clicks on back button
        Then User selects "GM Facility A Stock Medication/Supply List" from the list
        Then user verifies on UI "4" stock medications are exported in the "GM Facility A Stock Medication/Supply List" facility
        Then User clicks on back button
        Then User selects "Gaama, Alpha Stock Medication/Supply List" from the list
        Then user verifies on UI "0" stock medications are exported in the "Gaama, Alpha Stock Medication/Supply List" facility

    @regression
    Scenario: Verify on clicking on cancel, user is redirected to list page
        When User deletes all the stock medications from UI
        Then user deletes the stock med in the "GM Facility A Stock Medication/Supply" facility in DB
        Given the user clicks on "Add New" button
        And user waits
        When user select the following in the "Medication/Supply" field
            | MedicationName        |
            | Adempas 1.5 mg tablet |
            | Adempas 1 mg tablet   |
            | Adempas 0.5 mg tablet |
            | Actonel 35 mg tablet  |
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        And user waits
        Then the user clicks on "Export" button
        Then the user clicks on "Export List" link
        Then the user verifies "Export" "4" "Medication/Supply List" to popup appears
        Then user selects "GM Facility A Stock Medication/Supply List" facility
        Then user selects "Assisted Living" unit
        Then the user clicks on "Cancel" button
        Then verify user is redirected to stockMed list page
        Then user verifies "0" stock medications are exported in the "GM Facility A Stock Medication/Supply" facility
        Then User clicks on back button
        Then User selects "GM Facility A Stock Medication/Supply List" from the list
        Then user verifies on UI "0" stock medications are exported in the "GM Facility A Stock Medication/Supply List" facility

    @regression
    Scenario: Verify the functionality of Export stock medications when few duplications are there
        When User deletes all the stock medications from UI
        Then user deletes the stock med in the "GM Facility A Stock Medication/Supply" facility in DB
        And user waits
        Given the user clicks on "Add New" button
        When user select the following in the "Medication/Supply" field
            | MedicationName        |
            | Adempas 1.5 mg tablet |
            | Adempas 1 mg tablet   |
            | Adempas 0.5 mg tablet |
            | Actonel 35 mg tablet  |
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        And user waits
        Then user selects the created "2" Stock Medication
        Then the user clicks on "Export" button
        Then the user clicks on "Export Selected" link
        Then the user verifies "Export" "2" "Medication/Supply List" to popup appears
        Then user selects "GM Facility A Stock Medication/Supply List" facility
        Then user selects "Assisted Living" unit
        Then the user clicks on Export button on popup
        Then user verifies the validation message as "Stock Medications/Supplies exported successfully."
        Then verify user is redirected to stockMed list page
        Then user verifies "2" stock medications are exported in the "GM Facility A Stock Medication/Supply" facility
        Then user selects the created "4" Stock Medication
        Then the user clicks on "Export" button
        Then the user clicks on "Export Selected" link
        Then the user verifies "Export" "4" "Medication/Supply List" to popup appears
        Then user selects "GM Facility A Stock Medication/Supply" facility
        Then user selects "Assisted Living" unit
        Then the user clicks on Export button on popup
        Then user verifies the validation message as "Exported 2 of 4 Medications/Supplies. 2 duplicate Medications/Supplies already exist in the library."
        Then verify user is redirected to stockMed list page
        Then user verifies "4" stock medications are exported in the "GM Facility A Stock Medication/Supply" facility
        Then User clicks on back button
        Then User selects "GM Facility A Stock Medication/Supply List" from the list
        Then user verifies on UI "4" stock medications are exported in the "GM Facility A Stock Medication/Supply List" facility

    @regression
    Scenario: Verify the functionality of Export stock medications when all duplications are there
        When User deletes all the stock medications from UI
        Then user deletes the stock med in the "GM Facility A Stock Medication/Supply" facility in DB
        And user waits
        Given the user clicks on "Add New" button
        When user select the following in the "Medication/Supply" field
            | MedicationName        |
            | Adempas 1.5 mg tablet |
            | Adempas 1 mg tablet   |
            | Adempas 0.5 mg tablet |
            | Actonel 35 mg tablet  |
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        And user waits
        Then user selects the created "4" Stock Medication
        Then the user clicks on "Export" button
        Then the user clicks on "Export Selected" link
        Then the user verifies "Export" "4" "Medication/Supply List" to popup appears
        Then user selects "GM Facility A Stock Medication/Supply List" facility
        Then user selects "Assisted Living" unit
        Then the user clicks on Export button on popup
        Then user verifies the validation message as "Stock Medications/Supplies exported successfully."
        Then verify user is redirected to stockMed list page
        Then user verifies "4" stock medications are exported in the "GM Facility A Stock Medication/Supply" facility
        Then user selects the created "4" Stock Medication
        Then the user clicks on "Export" button
        Then the user clicks on "Export Selected" link
        Then the user verifies "Export" "4" "Medication/Supply List" to popup appears
        Then user selects "GM Facility A Stock Medication/Supply List" facility
        Then user selects "Assisted Living" unit
        Then the user clicks on Export button on popup
        Then user verifies the validation message as "Exported 0 of 4 Medications/Supplies. 4 duplicate Medications/Supplies already exist in the library."
        Then verify user is redirected to stockMed list page
        Then user verifies "4" stock medications are exported in the "GM Facility A Stock Medication/Supply" facility
        Then User clicks on back button
        Then User selects "GM Facility A Stock Medication/Supply List" from the list
        Then user verifies on UI "4" stock medications are exported in the "GM Facility A Stock Medication/Supply List" facility

    @regression
    Scenario: Verify Export stock med functionality using search
        When User deletes all the stock medications from UI
        Then user deletes the stock med in the "GM Facility A Stock Medication/Supply" facility in DB
        And user waits
        Given the user clicks on "Add New" button
        When user select the following in the "Medication/Supply" field
            | MedicationName        |
            | Adempas 1.5 mg tablet |
            | Adempas 1 mg tablet   |
            | Adempas 0.5 mg tablet |
            | Actonel 35 mg tablet  |
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        And user waits
        Then user types "Adempas" in the search text field
        Then user selects the created "3" Stock Medication
        Then the user clicks on "Export" button
        Then user verifies the "Export List" button is disabled
        Then the user clicks on "Export Selected" link
        Then the user verifies "Export" "3" "Medication/Supply List" to popup appears
        Then user selects "GM Facility A Stock Medication/Supply List" facility
        Then user selects "Assisted Living" unit
        Then the user clicks on Export button on popup
        Then user verifies the validation message as "Stock Medications/Supplies exported successfully."
        Then verify user is redirected to stockMed list page
        Then user verifies "3" stock medications are exported in the "GM Facility A Stock Medication/Supply" facility
        Then User clicks on back button
        Then User selects "GM Facility A Stock Medication/Supply List" from the list
        Then user verifies on UI "3" stock medications are exported in the "GM Facility A Stock Medication/Supply List" facility

    @regression
    Scenario: Verify validation message for Facility dropdown
        Given the user clicks on "Add New" button
        When user select the following in the "Medication/Supply" field
            | MedicationName        |
            | Adempas 1.5 mg tablet |
            | Adempas 1 mg tablet   |
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        And user waits
        Then user selects the created "2" Stock Medication
        Then the user clicks on "Export" button
        Then the user clicks on "Export Selected" link
        Then the user clicks on Export button on popup
        Then user verifies validation message as "Facility is required."
        Then user verifies "1 Error found" header
        Then user verifies "Export To" link
        Then user selects "GM Facility A Stock Medication/Supply List" facility
        Then user clicks on cross button on facility dropdown
        Then user verifies validation message as "Facility is required."

    @regression
    Scenario: Verify the selected facility should not be present in the facility dropdown
        When User deletes all the stock medications from UI
        And user waits
        Given the user clicks on "Add New" button
        When user select the following in the "Medication/Supply" field
            | MedicationName        |
            | Adempas 1.5 mg tablet |
            | Adempas 1 mg tablet   |
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        And user waits
        Then user selects the created "2" Stock Medication
        Then the user clicks on "Export" button
        Then the user clicks on "Export Selected" link
        Then user type "OKTA Stock Medication/Supply List" in Facility field
        Then User verifies "No options" is displayed

    @regression
    Scenario: Verify on clicking on hyperlink the selected checks are reset
        When User deletes all the stock medications from UI
        And user waits
        Then user verifies the "Export" button is disabled
        Given the user clicks on "Add New" button
        When user select the following in the "Medication/Supply" field
            | MedicationName        |
            | Adempas 1.5 mg tablet |
            | Adempas 1 mg tablet   |
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        And user waits
        Then user types "aut" in the search text field
        Then user verifies the "Export" button is disabled
        Then user clears the search text field
        Then user selects the created "2" Stock Medication
        Then User selects the first stock medication
        Then verify all the selected checkboxes are reset now

    @regression
    Scenario: Verify Searching and putting the item in export list should be enabled by bucketing last searched and selected
        When User deletes all the stock medications from UI
        Then user deletes the stock med in the "GM Facility A Stock Medication/Supply" facility in DB
        And user waits
        Given the user clicks on "Add New" button
        When Enter "tr" in the Medication
        When user selects "15" Ingredients values
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        And user waits
        Given the user clicks on "Add New" button
        When Enter "rt" in the Medication
        When user selects "15" Ingredients values
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        Then user selects the created "3" Stock Medication
        Then User clicks on the next page button
        Then user selects the created "2" Stock Medication
        Then the user clicks on "Export" button
        Then the user clicks on "Export Selected" link
        Then the user verifies "Export" "5" "Medication/Supply List" to popup appears
        Then user selects "GM Facility A Stock Medication/Supply List" facility
        Then user selects "Assisted Living" unit
        Then the user clicks on Export button on popup
        Then user verifies the validation message as "Stock Medications/Supplies exported successfully."
        Then verify user is redirected to stockMed list page
        Then user verifies "5" stock medications are exported in the "GM Facility A Stock Medication/Supply" facility
        Then User clicks on back button
        Then User selects "GM Facility A Stock Medication/Supply List" from the list
        Then user verifies on UI "5" stock medications are exported in the "GM Facility A Stock Medication/Supply List" facility

    @regression
    Scenario: Verify all records are getting imported successfully also verifying the number of records imported
        Then user deletes the stock med in the "GM Facility A Stock Medication/Supply" facility in DB
        Then user deletes the stock med in the "OKTA Stock Medication/Supply" facility in DB
        Then user deletes the stock med in the "Gaama, Alpha Stock Medication/Supply" facility in DB
        When user creates multiple records for Stock Medication through API
        Then the user clicks on "Import" button
        And user waits
        Then "GM Facility A Stock Medication/Supply List" facility is slected in Import pop-up
        Then the user verifies "Import" "5" "Medication/Supply List" to popup appears
        Then user selects "Villas" unit
        Then the user clicks on Import button
        Then user verifies the validation message as "Stock Medications/Supplies imported successfully."
        Then user verifies "5" stock medications are exported in the "GM Facility A Stock Medication/Supply" facility
        Then the user clicks on "Import" button
        Then "GM Facility A Stock Medication/Supply List" facility is slected in Import pop-up
        Then the user verifies "Import" "5" "Medication/Supply List" to popup appears
        Then user selects "Villas" unit
        Then the user clicks on Import button
        Then user verifies the validation message as "Imported 0 of 5 Medications/Supplies. 5 duplicate Medications/Supplies already exist in the library."
        Then user verifies "5" stock medications are exported in the "GM Facility A Stock Medication/Supply" facility
        Then User clicks on back button
        Then User selects "Gaama, Alpha Stock Medication/Supply List" from the list
        Then user verifies on UI "0" stock medications are exported in the "Gaama, Alpha Stock Medication/Supply List" facility

    @regression
    Scenario: Verify user is able to see the mandatory field validation message when no value is selected
        Then the user clicks on "Import" button
        Then the user clicks on Import button
        Then user verifies "1 Error found" header
        Then user verifies "Import From" link

    @regression
    Scenario: Verify user is able to navigate to list page if user clicks on cancel or x button on the popup
        Then the user clicks on "Import" button
        Then the user clicks on cancel button
        Then verify user is redirected to stockMed list page
        Then the user clicks on "Import" button
        Then the user clicks on Cross button
        Then verify user is redirected to stockMed list page

    @regression
    Scenario: Verify the Export Popup text
        When User deletes all the stock medications from UI
        Given the user clicks on "Add New" button
        And user waits
        When user select the following in the "Medication/Supply" field
            | MedicationName        |
            | Adempas 1.5 mg tablet |
            | Adempas 1 mg tablet   |
            | Adempas 0.5 mg tablet |
            | Actonel 35 mg tablet  |
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        And user waits
        Then the user clicks on "Export" button
        Then user verifies the "Export Selected" button is disabled
        Then the user clicks on "Export List" link
        Then the user verifies "Export" "4" "Medication/Supply List" to popup appears
        Then User able to see the text "Export your medication/supply list to another facility, providing them with a copy of your inventory."
        Then "Assign Exported List" label displayed
        Then user selects "GM Facility A Stock Medication/Supply List" facility
        Then User checks "Select GM Facility A Stock Medication/Supply List Units"
        Then the user clicks on Export button on popup
        Then verify user is redirected to stockMed list page

    @regression #FixIt
    Scenario: Verify the Import Popup text
        When User deletes all the stock medications from UI
        Given the user clicks on "Add New" button
        And user waits
        When user select the following in the "Medication/Supply" field
            | MedicationName        |
            | Adempas 1.5 mg tablet |
            | Adempas 1 mg tablet   |
            | Adempas 0.5 mg tablet |
            | Actonel 35 mg tablet  |
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        And user waits
        Then the user clicks on "Import" button
        And user waits
        Then User able to see the text "Select the facility to import your desired medication/supply list and assign it to the units in current facility."
        Then "Assign Imported List" label displayed
        Then "Import Medication/Supply List" label displayed
        Then User checks "Select OKTA Stock Medication/Supply List Units"

    @regression
    Scenario: Verify Header of Stock Medication List
        Then Stock Medication Header should be "OKTA Stock Medication/Supply List"
        Then the user refreshes the page
        Then Stock Medication Header should be "OKTA Stock Medication/Supply List"
        Then User clicks on back button
        Then User selects "J&J Stock Medication/Supply List" from the list
        Then Stock Medication Header should be "J&J Stock Medication/Supply List"

    @regression
    Scenario: Verify the Header of Stock Medication List when add the new Stock Medications
        Given the user clicks on "Add New" button
        And user waits
        When user select the following in the "Medication/Supply" field
            | MedicationName        |
            | Adempas 1.5 mg tablet |
            | Adempas 1 mg tablet   |
            | Adempas 0.5 mg tablet |
            | Actonel 35 mg tablet  |
        Then User select "Villas" on Units Dropdown
        Then the user clicks on "Save" button
        Then Stock Medication Header should be "OKTA Stock Medication/Supply List"

    @regression
    Scenario: Verify facility list count import field is same as db
        Then User clicks on back button
        Then User selects "Gaama, Alpha Stock Medication/Supply List" from the list
        Then the user clicks on "Import" button
        And user waits
        Then database count should be 1 less than UI count
        
@regression
   Scenario: Verify Brand to generic count is same as db
        When User deletes all the stock medications from UI
        Then database count should be "0"
        Given the user clicks on "Add New" button
        And user waits
        Then user Verify text "Selected medication/supply will also apply to its generics"
        When user select the following in the "Medication/Supply" field
            | MedicationName        |
            | Adempas 1.5 mg tablet |
            | Adempas 1 mg tablet   |
            | Adempas 0.5 mg tablet |
        Then the user clicks on "Save" button
        And user waits
        Then UI count should be "3"
        Then database count should be "6"
        When User deletes all the stock medications from UI
        Then database count should be "0"

      @regression
     Scenario: Verify add duplicate Medication(generic Medicine) and count is same as db
         When User deletes all the stock medications from UI
        Then database count should be "0"
         Given the user clicks on "Add New" button
        And user waits
         When user select the following in the "Medication/Supply" field
            | MedicationName       |
            |Tylenol 325 mg capsule |
        Then the user clicks on "Save" button
        Then UI count should be "1"
        Then database count should be "2"
        Given the user clicks on "Add New" button
        When user select the following in the "Medication/Supply" field
        | MedicationName           |
        |acetaminophen 325 mg capsule|
        Then the user clicks on "Save" button
        Then UI count should be "2"
        Then database count should be "3"

     @regression
        Scenario: Verify user is able to see duplicate message And Verify the database count
        When User deletes all the stock medications from UI
        Given the user clicks on "Add New" button
        And user waits
        When user select the following in the "Medication/Supply" field
            | MedicationName         |
            | Tylenol 325 mg capsule |
            | Lasix 80 mg tablet     |
        Then the user clicks on "Save" button
        And user waits
        Then the user sees the message "Stock Medication/Supply saved successfully."
        Then the user navigates back to the Stock Medication List Page
         Given the user clicks on "Add New" button
        And user waits
        When user select the following in the "Medication/Supply" field
            | MedicationName         |
            | Tylenol 325 mg capsule |
            | Lasix 80 mg tablet     |
            | Prozac 10 mg capsule   |
            | Prozac 20 mg capsule   |
        Then the user clicks on "Save" button
        Then the user sees the message "Saved 2 of 4 medication/supplies. 2 duplicate medications/supplies already exist in the library."
        Then the user refreshes the page
        Then UI count should be "4"
        Then database count should be "8"
    
    @regression 
    Scenario: Verify the stock medication icon when added in stock for particular facility and unit
        Then User clicks on back button
        Then User selects "Matrixcare Orders Platform Stock Medication/Supply List" from the list
        Given the user clicks on "Add New" button
        And user waits
        When Enter "<exMedicationName>" in the Medication
        Then select the Ingredients "<exMedicationName>" from the list and verify it is dispalyed
        Then User select "East" on Units Dropdown
        Then the user clicks on "Save" button
        And user waits
        Then click on "Resident" tab and "Orders" menu
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        And the user type "<exMedKeyword>" in the search bar
        Then the user sees the "<exMedicationName>" in the search result
        And the medication search results will show the medications containing "<exMedKeyword>"
        Then verify stock medication icon "is" present next to the medication
        Examples:
            | exFirstName | exLastName | exName          | exMedKeyword | exMedicationName            |
            | Ronald      | Clark      | Clark, Ronald O | Libervant    | Libervant 10 mg buccal film |

    @regression 
    Scenario: Verify generic medicine is displayed on the top when we search medication which is having generic
        Then User clicks on back button
        Then User selects "Matrixcare Orders Platform Stock Medication/Supply List" from the list
        Given the user clicks on "Add New" button
        And user waits
        When Enter "<exMedicationName>" in the Medication
        Then select the Ingredients "<exMedicationName>" from the list and verify it is dispalyed
        Then User select "East" on Units Dropdown
        Then the user clicks on "Save" button
        And user waits
        Then click on "Resident" tab and "Orders" menu
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        And the user type "<exMedKeyword>" in the search bar
        Then the user sees the "paroxetine 10 mg tablet" in the search result
        Then verify stock medication icon "is" present next to the medication
        Then the user sees "<exMedicationName>" in second row
        Examples:
            | exFirstName | exLastName | exName          | exMedKeyword | exMedicationName   |
            | Ronald      | Clark      | Clark, Ronald O | paxil        | Paxil 10 mg tablet |

    @regression 
    Scenario Outline: Verify Do not fill checkbox is checked for stock medication for particular facility and Unit
        Then User clicks on back button
        Then User selects "Matrixcare Orders Platform Stock Medication/Supply List" from the list
        Given the user clicks on "Add New" button
        And user waits
        When Enter "<exMedName>" in the Medication
        Then select the Ingredients "<exMedName>" from the list and verify it is dispalyed
        Then User select "East" on Units Dropdown
        Then the user clicks on "Save" button
        And user waits
        Then click on "Resident" tab and "Orders" menu
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        Then the user type "<exMedName>" in the search bar
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        When the user clicks on the Additional Datails tab
        Then verify Do not fill checkbox "is" checked
        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName                   | MedName                     | exKind |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Libervant 10 mg buccal film | Libervant 10 mg buccal film | brand  |

    @regression 
    Scenario Outline:Verify Do not fill checkbox is not checked if stock medication is for different Unit
        Then User clicks on back button
        Then User selects "Matrixcare Orders Platform Stock Medication/Supply List" from the list
        Given the user clicks on "Add New" button
        And user waits
        When Enter "<exMedName>" in the Medication
        Then select the Ingredients "<exMedName>" from the list and verify it is dispalyed
        Then User select "East" on Units Dropdown
        Then the user clicks on "Save" button
        And user waits
        Then click on "Resident" tab and "Orders" menu
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        Then the user type "<exMedName>" in the search bar
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        When the user clicks on the Additional Datails tab
        Then verify Do not fill checkbox "is not" checked
        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName            | MedName              | exKind |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Tybost 150 mg tablet | Tybost 150 mg tablet | brand  |

    @regression 
    Scenario: Verify the stock medication icon when added in stock for particular facility and unit
        Then User clicks on back button
        Then User selects "Matrixcare Orders Platform Stock Medication/Supply List" from the list
        Given the user clicks on "Add New" button
        And user waits
        When Enter "<exMedicationName>" in the Medication
        Then select the Ingredients "<exMedicationName>" from the list and verify it is dispalyed
        Then User select "East" on Units Dropdown
        Then the user clicks on "Save" button
        And user waits
        Then click on "Resident" tab and "Orders" menu
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        And the user type "<exMedKeyword>" in the search bar
        Then the user sees the "<exMedicationName>" in the search result
        And the medication search results will show the medications containing "<exMedKeyword>"
        Then verify stock medication icon "is not" present next to the medication
        Examples:
            | exFirstName | exLastName | exName                 | exMedKeyword                | exMedicationName            |
            | Jonathan    | Abbot1     | Abbot1, Jonathan Bruce | Libervant 10 mg buccal film | Libervant 10 mg buccal film |
