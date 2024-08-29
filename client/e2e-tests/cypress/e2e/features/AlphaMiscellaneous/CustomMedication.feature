
Feature:  Create Custom Medications

    Background: Launching the custom medication

Feature:  Setup Facility Configuration
    Background: Logging into SNF and Navigating to the search page
        Given the user is logged into the SNF Url with credentials
            | url                                  | username       | password   |
            | https://qa61.matrixcare.me/Login.jsp | orders_support | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        When the user selects the facility "OKTA" from facility list
        And the user clicks on "View" button
        Then  the user selects "Custom Medication Library List" in the View DDL
        When the user clicks on "Create New Library" button
        Then user enters unique "CyAutomationLibraryName" name
        Then the user clicks on "Next" button
        And the user clicks on "Create New" button

    @sanity @regression 
    Scenario Outline: User should be able to enter alphanumeric characters in custom medication and save it
        When the user enters alphanumeric character of length "<CharacterLength>"
       Then the user clicks controlled substance "Yes" button
        When click on Schedule drop-down field and select "Schedule V"
        Then user selects "1" of the following in the "Ingredients" field
            | IngredientName      |
            | <ex_IngredientName> |
        Then user selects "1" of the following in the "Medication Groups" field
            | MedGroupName  |
            | <ex_MedGroup> |
        Then the user clicks on "Save" button
        Then user able to see summary page
        Examples:
            | CharacterLength | ex_IngredientName      | ex_MedGroup |
            | 70              | Tylenol 325 mg capsule | Eye Drops   |
            | 10              | Tylenol 325 mg capsule | Eye Drops   |
            | 50              | Tylenol 325 mg capsule | Eye Drops   |

    @regression 
    Scenario: Verify validation pop-up when user clicks on Cancel button returning to Sumary screen without saving the custom med
        Then Enter "AutomationTestCustomMedication" in the Custom Medication Name
        Then the user clicks on "Cancel" button
        Then the user sees the Cancel popup with message "Are you sure you want to cancel this custom medication entry?All unsaved changes will be lost." with "Yes" and "No" button
        When the user clicks on "No" button
        Then check custom medication field text "AutomationTestCustomMedication" should be visible
        When the user clicks on "Cancel" button
        Then the user sees the Cancel popup with message "Are you sure you want to cancel this custom medication entry?All unsaved changes will be lost." with "Yes" and "No" button
        Then the user clicks on "Yes" button
        Then the user navigates back to the Custom Medication Page
        And the custom medication "AutomationTestCustomMedication" is not present


    @sanity @regression
    Scenario: Verifying the schedule drop down value is reset when user select yes for controlled substance with schedule value and the make it no and again making it yes
        Then Enter "AutomationTestCustomMedication" in the Custom Medication Name
        Then the user clicks controlled substance "Yes" button
        When click on Schedule drop-down field and select "Schedule II"
        Then the user clicks controlled substance "No" button
        Then the user clicks controlled substance "Yes" button
        Then check schedule field should be empty

    @regression @focus
    Scenario: Verify the increase and decrease count and the text message by adding and removing for ingredients
        When Enter "AutomationTestCustomMedication" in the Custom Medication Name
        And user selects "15" of the following in the "Ingredients" field
            | IngredientName                |
            | Tylenol 325 mg capsule        |
            | Lasix 80 mg tablet            |
            | Lasix 40 mg tablet            |
            | Lasix 20 mg tablet            |
            | Prozac 10 mg capsule          |
            | Prozac 20 mg capsule          |
            | Prozac 40 mg capsule          |
            | Allegra Hives 180 mg tablet   |
            | Allegra Allergy 60 mg tablet  |
            | Allegra Allergy 180 mg tablet |
            | POCKET CHAMBER spacer         |
            | Tylenol 325 mg tablet         |
            | Tykerb 250 mg tablet          |
            | Tybost 150 mg tablet          |
            | Acetadryl 25 mg-500 mg tablet |
        Then verify all "15" "Ingredients" are displayed
        And verify the message for the "Ingredients" field after selecting 15 items "You can select a maximum of 15 ingredients"
        And user clicks on Remove icon "15" times and checks the decrease of the count for "Ingredients"
        And verify the message for "Ingredients" field "No ingredients have been selected."

    @regression 
    Scenario: Verify the increase and decrease count and the text message by adding and removing for medgroup
        Then Enter "AutomationTestCustomMedication" in the Custom Medication Name
        Then user selects "15" of the following in the "Medication Groups" field
            | MedGroupName       |
            | Eye Drops          |
            | EENT               |
            | Diuretics          |
            | Coumadin/Warfarin  |
            | Chemotherapy       |
            | Bisphosphonates    |
            | Aricept/Donepezil  |
            | Antipsychotics     |
            | Antidepressants    |
            | Anticonvulsants    |
            | Anticoagulants     |
            | Antibiotics        |
            | Antianxiety        |
            | Analgesics         |
            | Injections |
        Then verify the message for the "Medication Groups" field after selecting 15 items "You can select a maximum of 15 medication groups"
        Then user clicks on Remove icon and checks the decrease of the count for "Medication Groups"
        And verify the message for "Medication Groups" field "No medication groups have been selected."

    @regression
    Scenario: User should be able to see toast message on entering all mandatory fields including yes as controlled substance and clicking on save
        When user Enter "Automation" Custom Medication name
        Then the user clicks controlled substance "Yes" button
        When click on Schedule drop-down field and select "Schedule III"
        Then the user clicks on "Save" button
        Then the user sees the message "Custom medication saved successfully."

    @sanity @regression
    Scenario: User should be able to see toast message on entering all mandatory fields including no as controlled substance and clicking on save
        When user Enter "Automation" Custom Medication name
        Then the user clicks controlled substance "No" button
        Then the user clicks on "Save" button
        Then the user sees the message "Custom medication saved successfully."

    @regression
    Scenario: Highlighted mandatory fields should get faded when user selects yes as controlled substance and enters data
        Then the user clicks controlled substance "Yes" button
        Then the user clicks on "Save" button
        Then Custom medication field should "be" highlighted with red border
        Then Custom medication field validation should "be" "Custom medication name is required."
        Then Schedule field should "be" highlighted with red border
        Then Schedule validation should "be" "DEA schedule is required."
        Then Enter "Automation Test Custom medication" in the Custom Medication Name
        Then Custom medication field should "not be" highlighted with red border
        Then Custom medication field validation should "not be" "Custom medication name is required."
        When click on Schedule drop-down field and select "Schedule III"
        Then Schedule field should "not be" highlighted with red border
        Then Schedule validation should "not be" "Schedule is required."

    @regression
    Scenario: Highlighted mandatory fields should get faded when user selects no as controlled substance and enters data
        Then the user clicks on "Save" button
        Then Custom medication field should "be" highlighted with red border
        Then Custom medication field validation should "be" "Custom medication name is required."
        Then Controlled Substance radio buttons should "be" highlighted with red
        Then Controlled Substance validation should "be" "Controlled substance is required."
        Then Enter "Automation Test Custom medication" in the Custom Medication Name
        Then Custom medication field should "not be" highlighted with red border
        Then Custom medication field validation should "not be" "Custom medication name is required."
        Then the user clicks controlled substance "No" button
        Then Controlled Substance radio buttons should "not be" highlighted with red
        Then Controlled Substance validation should "not be" "Controlled substance is required."

    @regression
    Scenario: Verify schedule dropdown appears/hides when user toggles through the control substance button
        Then the user clicks controlled substance "No" button
        Then Schedule drop-down is not displayed
        Then the user clicks controlled substance "Yes" button
        Then Schedule drop-down is displayed
        When click on Schedule drop-down field
        Then Schedule II,Schedule III and Schedule IV ,Schedule V data is displayed on Schedule drop-down

    @regression
    Scenario: Verify user is able to type and Search Ingredients and Med-group fields
        When click on Ingredients field drop-down
        Then select the Ingredients "1-Day 6.5 % vaginal ointment" from the list and verify it is dispalyed
        Then select the Ingredients "1-Day 6.5 % vaginal ointment" from the list and verify it is dispalyed
        When click on Med-group field drop-down
        Then user enters "Analgesics" in Med-Group search field
        Then select the Med-Group "Analgesics" from the list and verify it is dispalyed

    @regression
    Scenario:Custom medication name field max 70 character limit and verify 70/70 msg and check for more then 70 character.---need to modify the existing scenario
        Then the user sees the label "0/70"
        When the user enters alphanumeric character of length "60"
        Then the user sees the label "70/70"
        When the user enters alphanumeric character of length "0"
        Then the user sees the label "10/70"
        When the user enters alphanumeric character of length "61"
        Then the user checks for maximum characters for custom medication field

    @regression
    Scenario:Verify error message for non printable characters.
        Then Enter "AutomationTestCustomMedication¿πΩ±µ" in the Custom Medication Name
        Then Verify the validation message for non-printable characters

    @sanity @regression
    Scenario: Verify all the results are displayed when user searches without search criteria in Med-group field
        Given click on Med-group field drop-down
        Then the results should be displayed according to search characters ""

    @regression
    Scenario: Verify validation message when user enter in Med-group field random text but no search results are found.
        Given click on Med-group field drop-down
        When the user types characters as "<Characters>"
        Then the validation should appear as "No matches found"
        Examples:
            | Characters |
            | #^         |
            | zx         |
            | edsffsg    |

    @sanity @regression
    Scenario: Verify validation message when insufficient characters are entered in Med-group field
        Given click on Med-group field drop-down
        When the user types characters as "<Characters>"
        Then the validation should appear as "Enter at least 2 characters to search"
        Examples:
            | Characters |
            | #          |
            | a          |

    @regression
    Scenario: Verify user is able to close the dropdown on clicking outside the med group field
        Given click on Med-group field drop-down
        Then the dropdown should "be" visible
        When user selects "2" med-group values
        When the user clicks outside the dropdown
        Then the dropdown should "not be" visible
        And the selected "2" med-group values appear

    @regression
    Scenario: Verify user is able to open and close the dropdown on clicking on the MedGroup dropdown field
        Given click on Med-group field drop-down
        Then the dropdown should "be" visible
        When user selects "2" med-group values
        When the user clicks on the dropdown field
        Then the dropdown should "not be" visible
        When the user clicks on the dropdown field
        Then the dropdown should "be" visible
        And the selected "2" med-group values appear

    @sanity @regression
    Scenario: Verify search results start appearing when user enters 2 characters in Ingredients field
        Given click on Ingredients field drop-down
        When the user enters characters as "us"
        Then the results is displayed according to search characters "us"

    @regression
    Scenario: Verify validation message ""No matches found" "when user enter random text but no search results are found
        Given click on Ingredients field drop-down
        When the user enters characters as "<Characters>"
        Then the validation should appear as "No matches found"
        Examples:
            | Characters |
            | **         |
            | #^         |
            | edsffsg    |

    @regression
    Scenario: Verify validation message when insufficient characters is entered in Ingredients field
        Given click on Ingredients field drop-down
        When the user enters characters as "a"
        Then the validation should appear as "Enter at least 2 characters to search"



    @regression
    Scenario:Verify validation “You have reached the end of results. Refine the search criteria.” when we scroll to end
        Given click on Ingredients field drop-down
        Then user enter "tr" on Ingredients text field
        Then scroll till end to see message "You have reached the end of results. Refine the search criteria."

    @regression
    Scenario: Verify the Ingredients checkboxes selection and deselection and verify the message accordingly
        Given click on Ingredients field drop-down
        Then user enter "ba" on Ingredients text field
        Then the ingredients dropdown should "be" visible
        When user selects "2" Ingredients values
        Then the user clicks controlled substance "No" button
        Then the ingredients dropdown should "not be" visible
        Then the selected "2" Ingredients values appear
        Given click on Ingredients field drop-down
        Then user enter "ba" on Ingredients text field
        When user selects "2" Ingredients values
        Then the user clicks controlled substance "No" button
        Then the selected "2" Ingredients values unselected

    @regression
    Scenario:Verify user is able to click out of the dropdown box or to the drop down direction button to see the selection list.
        When click on Med-group field drop-down
        When user selects "5" med-group values
        Then user click on outside the dropdown
        And the selected "5" med-group values appear
        When user clicks on the arrow button in med-group text field
        And the selected "5" med-group values appear

    @regression
    Scenario: Verify user is able to remove Medication group selected list by using checkbox and remove icon
        When click on Med-group field drop-down
        When user selects "15" med-group values
        When the user clicks outside the dropdown
        Then user clicks on Remove icon and checks the decrease of the count for Medgroup
        When click on Med-group field drop-down
        When user selects "15" med-group values
        When user unselect the one medgroup value
        And the selected "14" med-group values appear

    @regression
    Scenario: Verify the recently selected med-group values display at the top in the list
        Given click on Med-group field drop-down
        Then The user selects "10" values and verifies if selected values are coming in correct order in the list

    @regression
    Scenario: Verify the recently selected Ingredient values display at the top in the list
        Given click on Ingredients field drop-down
        Then user enter "ba" on Ingredients text field
        Then The user selects "10" values and verifies if selected values are coming in correct order in the Ingridents list

    @regression
    Scenario: Verify search results when user enters multipe characters
        Given click on Med-group field drop-down
        When the user types characters as "<Characters>"
        Then the results should be displayed according to search characters "<Characters>"
        Examples:
            | Characters               |
            | an                       |
            | Analgesics               |
            | Eye drops                |
            | Aricept/Donepezil        |
            | Topicals (All Routes)    |
            | Oral anti-hyperglycemics |
            | Sedative-Hypnotic        |

    @regression
    Scenario: Verify search results disappear as soon as user starts typing 1 char
        Given click on Med-group field drop-down
        Then the results should be displayed according to search characters ""
        When the user types characters as "<Characters>"
        Then the validation should appear as "Enter at least 2 characters to search"
        Examples:
            | Characters |
            | a          |
            | $          |



    @regression
    Scenario: Verify all the error links and user is able to navigate to Custom Medication name field on clicking Custom Medication error link and Controlled substance field on clicking controlled substance error link
        Then the user clicks on "Save" button
        Then verify the error message "2 Errors Found"
        Then verify "Custom Medication Name"error link
        Then verify "Controlled Substance"error link in warning
        Then verify error reason next to Custom Medication field
        Then verify error reason next to Controlled substance field
        When click on Custom Medication error link
        Then user is navigated to Custom Medication name field
        When click on Controlled Substance error link
        Then user is navigated to Controlled Substance No

    @regression
    Scenario:Verify Schedule error link and it disappaers after selecting schedule value from dropdown
        When the user enters alphanumeric character of length "20"
        Then the user clicks controlled substance "Yes" button
        Then the user clicks on "Save" button
        Then verify "DEA Schedule" error link and click
        Then user is navigated to Schedule dropdown field
        When click on Schedule drop-down field and select "Schedule III"
        Then the user clicks on "Save" button
        Then verify Schedule error link is not displayed

    @regression
    Scenario: Verify errors disappears when user enters all the mandatory fields on clicking save
        When the user enters alphanumeric character of length "20"
        Then the user clicks controlled substance "No" button
        Then the user clicks on "Save" button
        Then verify Custom medication error link is not displayed
        Then verify Controlled Substance error link is not displayed

    @regression
    Scenario: Verify user is able to close all the error link by clicking on close (X) icon and by clicking on cancel
        Then the user clicks on "Save" button
        Then verify the error message "2 Errors Found"
        Then verify close icon for warning message and click on it
        Then verify 2 Errors found warning message is not displayed
        Then the user clicks on "Save" button
        Then the user clicks on "Cancel" button
        Then User wait for synchronization
        Then the user clicks on "Yes" button
        Then verify 2 Errors found warning message is not displayed
        When the user enters alphanumeric character of length "20"
        Then the user clicks on "Save" button
        Then verify the error message "1 Error Found"

    @regression
    Scenario:Verify the user should not use the same medication name which is there in FDB.
        Then Enter "<Characters>" in the Custom Medication Name
        Then the user clicks controlled substance "No" button
        Then the user clicks on "Save" button
        Then User wait for synchronization
        And the user clicks on "Create New" button
        Then Enter "<Characters>" in the Custom Medication Name
        Then the user clicks controlled substance "No" button
        Then the user clicks on "Save" button
        Then the user sees the message "A custom medication already exists with the same name. The medication name must be unique."
        Examples:
            | Characters                           |
            | AutomationTestCustomMedicationTest15 |

    @regression
    Scenario: Verify user navigate to Summary page when click on Save Button
        When user Enter "<Characters>" Custom Medication name
        Then the user clicks controlled substance "No" button
        When click on Ingredients field drop-down
        Then user enter "ba" on Ingredients text field
        When user selects "1" Ingredients values
        When the user clicks outside the dropdown
        When click on Med-group field drop-down
        When user selects "1" med-group values
        Then the user clicks on "Save" button
        Then user able to see summary page
        Then User verifies Custom Medication Name "<Characters>" from database
        Examples:
            | Characters                         |
            | Automation Custom medication Test1 |

    @regression
    Scenario:Verify the user should not use the same medication name which is there in FDB.
        Then Enter "24Hour Allergy 10 mg tablet" in the Custom Medication Name
        Then the user clicks controlled substance "No" button
        Then the user clicks on "Save" button
        Then User wait for synchronization
        Then the user sees the message "The medication name already exists in the Global Library. The medication name must be unique."

    @regression
    Scenario: Verify user should not be able to see EquivalentAvailable Ingredients in UI
        Then user check the api response for search text  "fi" and verify UI as per the equivalentAvailable flag value