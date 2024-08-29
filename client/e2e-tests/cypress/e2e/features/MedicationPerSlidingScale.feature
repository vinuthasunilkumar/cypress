Feature: Order Writer page for the selected resident

    Background: Logging into SNF and Navigating to the search page
        Given the user is logged into the SNF Url with credentials
            | username       | password   |
            | Orders_Support | Password@1 |
    
    Scenario Outline: Instructions:Sliding Scale: Medication Sliding Scale functionality on order writer page with edit template option
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        And the user observes that left panel and order status panel are sticky while scrolling the page without order details
        Then the user selects a common instructions which displays in the left panel
        When the user clicks on the sliding scale toggle button
        Then per sliding scale page shows where user fills with "valid" header, body and footer details
            | headerValue1 | from0Value1 | to0Value1 | give0Value1 | to1Value1 | give1Value1 | to2Value1 | give2Value1 | footer1Give1 | selectOpt1 | selectOpt2 |
            | 90           | 100         | 200       | 5           | 350       | 15          | 500       | 25          | 25           | MD         | NP/PA      |
        And the user clicks on confirm button to per sliding scale details on the order writer Page
        And the user sees on the left panel of the page under instructions
        When the user clicks on edit button on per sliding scale to edit values navigates to sliding scale window to "NP/PA"
        And the user enters max blood Sugar and Give value in body which not allows adding new row option
            | bloodSugar | give |
            | 800        | 200  |
        When the user clicks the delete icon button of body to delete a row
        Then the user clicks first delete button to delete rows and clears data from mandatory body field
        And user clicks "Yes" after seeing a warning message when try to exit without saving the changes
        And the user observes that left panel and order status panel are sticky while scrolling the page with order details
        Examples:
            | exFirstName | exLastName | exName                 | exMedName                                                             | exKind |
            | Jonathan    | Abbot1     | Abbot1, Jonathan Bruce | Humalog Junior KwikPen (U-100) 100 unit/mL subcutaneous half-unit pen | brand  |
    
    Scenario Outline: Instructions:Sliding Scale: Verify the warning messages in the per sliding scale
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        When the user clicks on the sliding scale toggle button
        Then per sliding scale page shows where user fills with "valid" header, body and footer details
            | headerValue1 | from0Value1 | to0Value1 | give0Value1 | to1Value1 | give1Value1 | to2Value1 | give2Value1 | footer1Give1 | selectOpt1 | selectOpt2 |
            | 200          | 20          | 45        | 2           | 70        | 20          | 100       | 22          | 25           | MD         | NP/PA      |
        And the user clicks on confirm button to per sliding scale details on the order writer Page
        When the user clicks on edit button on per sliding scale to edit values navigates to sliding scale window to "NP/PA"
        And user clicks "No" after seeing a warning message when try to exit without saving the changes
        And user clicks "Yes" after seeing a warning message when try to exit without saving the changes
        And verify the warning message when user toggles the sliding scale button and selects "No"
        And verify the warning message when user toggles the sliding scale button and selects "Yes"
        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName                                                             | exKind |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Humalog Junior KwikPen (U-100) 100 unit/mL subcutaneous half-unit pen | brand  |
    
    Scenario Outline: Instructions:Sliding Scale: Error Validation in the per sliding scale
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        When the user clicks on the sliding scale toggle button
        Then per sliding scale page shows where user fills with "invalid" header, body and footer details
            | headerValue1 | headerValue2 | from0Value1 | from0Value2 | to0Value1 | to0Value2 | give0Value1 | give0Value2 | footer1Give1 | footer1Give2 | selectOpt1 | selectOpt2 |
            | 900          | 400          | 850         | 40          | 30        | 60        | 300         | 35          | 300          | 40           | MD         | NP/PA      |
        And the user clicks on confirm button to per sliding scale details on the order writer Page

        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName                                                             | exKind |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Humalog Junior KwikPen (U-100) 100 unit/mL subcutaneous half-unit pen | brand  |
