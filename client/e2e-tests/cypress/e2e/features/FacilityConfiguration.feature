Feature:  Setup Facility Configuration
    Background: Logging into SNF and Navigating to the search page
        Given the user is logged into the SNF Url with credentials
            | username       | password   |
            | orders_support | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"

    Scenario: Look and feel of Order Platform Configuration screen
        When the user sees the Order Platform Configuration screen highlighting the Facilty Setup tab
        And the user can view a grid with the "1" columns
            | column_header |
            | Facility      |
        And the list of facilities displayed is present in the list of facilities in the api response
        When the user clicks "Order Platform Setup" tab in the Order Platform Configuration screen
        Then the following tabs are present in the Order Platform Setup Screen
            | tabName                      |
            | Administration Schedule List |
            | Custom Medication Library    |
            | Stock Medication List        |
        And "Administration Schedule List" tab is selected in the Order Platform Setup Configuration

    Scenario: Verify user is able to search facility as per the search criteria and the list is displayed accordingly.
        When user types "gyh" in the search text field
        Then the user sees No Data Found in the table
        And user types "fa" in the search text field
        Then facility results should be displayed according to the search criteria for "fa"
        And user types "Matrix" in the search text field
        Then facility results should be displayed according to the search criteria for "Matrix"

    Scenario: Select facility and observe the UI and Save/Cancel button functionality
        When the user selects the facility "Matrixcare Orders Platform" from facility list
        And the user observes that Save button disabled as no changes made
        Then the user sees the previous selected formulary and custom library
        When the user clicks on "Cancel" button
        Then the user navigates back to facility setup page


    @skip
    Scenario: Select facility and configure the formulary
        When the user selects the facility "Matrixcare Orders Platform" from facility list
        Then the user sees the option for selecting the formulary
        When the user selects a value in the formulary dropdown
        And the user clicks on "Save" button

    Scenario: View the current selected library
        When the user selects the facility "Matrixcare Orders Platform" from facility list
        Then the user makes a note of the current medication library
        And the user clicks on the "Current Selected Library" option on the View button beside "Custom Medication Library"
        Then the user navigates to the Medication Library as noted earlier
        And the user clicks on "Back" button
        And "Facility Setup" tab is selected in the Order Platform Setup Configuration
        And the screen shows the facility configuration for the facility "Matrixcare Orders Platform"

    Scenario: When no library selected from custom library dropdown for the facility, User can only view the custom medication library list
        When user types "Wilson Manor" in the search text field
        And the user selects the facility "Wilson Manor" from facility list
        Then the user makes a note of the current medication library to be empty
        And the user clicks on View button button beside "Custom Medication Library"
        And the user can view only "Custom Medication Library List" in the View DDL

    @focus
    Scenario Outline: When No custom Medication Library is selected, Enhanced Med Search is disabled and MCSNF Drug Search is used
        When the user selects the facility "Matrixcare Orders Platform" from facility list
        And the user clears the Custom Medication Library selection
        Then the Enable Enhanced Order Search checkbox is disabled
        And the user clicks on "Save" button
        And the user sees the message "Facility configuration saved successfully."
        And the user wants to create order for the resident
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the MCSNF Drug Search Screen
        Examples:
            | exFirstName | exLastName | exName          |
            | Reversal    | 1Test      | 1Test, Reversal |

    @focus
    Scenario Outline: When custom Medication Library is selected as None, Enhanced Med Search can be enabled
        When the user selects the facility "Matrixcare Orders Platform" from facility list
        And the user clears the Custom Medication Library selection
        Then the user searches and selects "None" in the custom medication library dropdown
        Then the Enable Enhanced Order Search checkbox is enabled
        And check the Enable Enhanced Order Search option
        And the user clicks on "Save" button
        And the user sees the message "Facility configuration saved successfully."
        And the user wants to create order for the resident
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen

        Examples:
            | exFirstName | exLastName | exName          |
            | Reversal    | 1Test      | 1Test, Reversal |

    @focus
    Scenario Outline: Creating a new library, with custom meds having no ingredients, the active custom medication can be ordered
        When the user clicks "Order Platform Setup" tab in the Order Platform Configuration screen
        And the user clicks the "Custom Medication Library" left tab
        And the user clicks on "Create New Library" button
        Then user enters unique "CyAutomationLibraryName" name
        Then the user clicks on "Next" button
        And the user sees the message "Library saved successfully."
        And the user clicks on "Create New" button
        Then the user enters the custom medication name
        Then the user clicks controlled substance "Yes" button
        When click on Schedule drop-down field and select "Schedule II"
        Then the user clicks controlled substance "No" button
        And the user clicks on "Save" button
        #And the user sees the message "Custom Medication saved successfully."
        Then user is able to see the custom medication in the custom library details page
        And the user clicks on "Back" button
        And "Custom Medication Library" tab is selected in the Order Platform Setup Configuration
        When the user clicks "Facility Setup" tab in the Order Platform Configuration screen
        When the user selects the facility "Matrixcare Orders Platform" from facility list
        And the user searches and selects the newly created library in the custom medication library dropdown
        And check the Enable Enhanced Order Search option
        And the user clicks on "Save" button
        And the user sees the message "Facility configuration saved successfully."
        Then the user sees the Order Platform Configuration screen highlighting the Facilty Setup tab
        And the user wants to create order for the resident
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type the newly created custom medication name in the search bar
        Then the Alert column shows a custom icon image
        And the source column would show the library just created

        Examples:
            | exFirstName | exLastName | exName          |
            | Reversal    | 1Test      | 1Test, Reversal |

    @focus
    Scenario Outline: Creating a new library with custom meds ingredients in inacvtive status cannot be searched in the med search screen
        When the user clicks "Order Platform Setup" tab in the Order Platform Configuration screen
        And the user clicks the "Custom Medication Library" left tab
        And the user clicks on "Create New Library" button
        Then user enters unique "CyAutomationLibraryName" name
        Then the user clicks on "Next" button
        And the user sees the message "Library saved successfully."
        And the user clicks on "Create New" button
        Then the user enters the custom medication name
        Then the user clicks controlled substance "Yes" button
        When click on Schedule drop-down field and select "Schedule II"
        Then the user clicks controlled substance "No" button
        #And user selects "2" of the following in the "Ingredients" field
        #    | IngredientName         |
        #     | Tylenol 325 mg capsule |
        #    | Lasix 80 mg tablet     |
        #And user clicks on Remove icon "1" times and checks the decrease of the count for "Ingredients"
        #When user search and select from Medication Group dropdown
        #Then user selects "2" of the following in the "Medication Groups" field
        #    | MedGroupName |
        #     | Eye Drops    |
        #     | EENT         |
        # And user clicks on Remove icon "1" times and checks the decrease of the count for "Medication Groups"
        Then the user clicks on "Save" button
        #And the user sees the message "Custom Medication saved successfully."
        Then user is able to see the custom medication in the custom library details page
        Then click on Active toggle Button
        Then verify "Status set to Inactive" in validation message
        Then verify "Current custom medication will be unavailable." in validation message
        Then verify "Toggle the status to manage availability of this custom medication." in validation message
        And the user clicks on "Confirm" button
        Then verify the status is still "Inactive"
        And the user clicks on "Back" button
        When the user clicks "Facility Setup" tab in the Order Platform Configuration screen
        When the user selects the facility "Matrixcare Orders Platform" from facility list
        And the user searches and selects the newly created library in the custom medication library dropdown
        And the user clicks on "Save" button
        And the user sees the message "Facility configuration saved successfully."
        When the user wants to create order for the resident
        And the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type the newly created custom medication name in the search bar
        Then the user sees the message "No Data Found" in the table
        Examples:
            | exFirstName | exLastName | exName          |
            | Reversal    | 1Test      | 1Test, Reversal |

    @focus
    Scenario Outline: List the facilities when a custom medication Librabry is inactivated
        When the user clicks "Order Platform Setup" tab in the Order Platform Configuration screen
        And the user clicks the "Custom Medication Library" left tab
        And the user clicks on "Create New Library" button
        Then user enters unique "CyAutomationLibraryName" name
        Then the user clicks on "Next" button
        And the user sees the message "Library saved successfully."
        And the user clicks on "Back" button
        When the user clicks "Facility Setup" tab in the Order Platform Configuration screen
        When the user selects the facility "Matrixcare Orders Platform" from facility list
        And the user searches and selects the newly created library in the custom medication library dropdown
        And the user clicks on "Save" button
        When the user selects the facility "OKTA" from facility list
        And the user searches and selects the newly created library in the custom medication library dropdown
        And the user clicks on "Save" button
        When the user sees the Order Platform Configuration screen highlighting the Facilty Setup tab
        When the user clicks "Order Platform Setup" tab in the Order Platform Configuration screen
        And the user searches and selects the custom medication library that was created
        When the user clicks on the edit pencil
        And the user can inactivate or toggle the library status
        Then the user sees the warning message in the Inactivate Library modal mentioning the following facilities
            | facilityName               |
            | Matrixcare Orders Platform |
            | OKTA                       |

    Scenario Outline:  Inactive library cannot be found while saving facility setup
        When the user clicks "Order Platform Setup" tab in the Order Platform Configuration screen
        And the user clicks the "Custom Medication Library" left tab
        And the user clicks on "Create New Library" button
        Then user enters unique "CyAutomationLibraryName" name
        Then the user clicks on "Next" button
        And the user sees the message "Library saved successfully."
        When the user clicks on the edit pencil
        And the user can inactivate or toggle the library status
        Then the user clicks on "Update" button
        And the user sees the message "Library saved successfully."
        And the user clicks on "Back" button
        When the user clicks "Facility Setup" tab in the Order Platform Configuration screen
        When the user selects the facility "Matrixcare Orders Platform" from facility list
        And the user searches the newly created library in the custom medication library dropdown
        Then there is no option to be selected

    Scenario Outline: One time creation of a Stock Medication List for a facility
        When the user selects the facility "J&J" from facility list
        And the user clicks on Create New List button for "Stock Medication/Supply List"
        Then the user will see the "stock medication" list "J&J Stock Medication/Supply List" is created|existed
        And the user clicks on the "Current Selected List" option on the View button beside "Stock Medication/Supply List"
        Then the user can see "Add New" button
        When the user clicks on "Back" button
        Then the user navigates back to facility setup page
        When the user clicks "Order Platform Setup" tab in the Order Platform Configuration screen
        And the user clicks the "Stock Medication List" left tab
        And user types "J&J Stock Medication/Supply List" in the search text field in Order Platfrom Setup
        Then search results shows "J&J Stock Medication/Supply List" in Order Platfrom Setup tab
        When the user clicks on the "J&J Stock Medication/Supply List" in Order Platfrom Setup tab
        Then the user navigates to "Stock Medication/Supply Library" showing the stock medications in the list
        And the stock medication list test data created is deleted

    Scenario Outline: One time creation of a Administration Schedule Listfor a facility
        When the user selects the facility "J&J" from facility list
        And the user clicks on Create New List button for "Administration Schedule List"
        Then the user will see the "admin schedule" list "J&J Administration Schedule List" is created|existed
        And the user clicks on the "Current Selected List" option on the View button beside "Administration Schedule List"
        Then the user can see "Add New" button
        When the user clicks on "Back" button
        Then the user navigates back to facility setup page
        When the user clicks "Order Platform Setup" tab in the Order Platform Configuration screen
        And the user clicks the "Administration Schedule List" left tab
        And user types "J&J Administration Schedule List" in the search text field in Order Platfrom Setup
        Then search results shows "J&J Administration Schedule List" in Order Platfrom Setup tab
        When the user clicks on the "J&J Administration Schedule List" in Order Platfrom Setup tab
        Then the user navigates to "Administration Schedule List" showing the admin schedules in the list
        And the admin schedule list test data created is deleted

    @focus
    Scenario Outline: When custom Medication Library is selected, Enhanced Med Search can be enabled
        When the user selects the facility "Matrixcare Orders Platform" from facility list
        And the user clears the Custom Medication Library selection
        Then the user searches and selects "aaaDoNotUseMedLibrary" in the custom medication library dropdown
        Then the Enable Enhanced Order Search checkbox is enabled
        And check the Enable Enhanced Order Search option
        And the user clicks on "Save" button
        And the user sees the message "Facility configuration saved successfully."
        And the user wants to create order for the resident
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen

        Examples:
            | exFirstName | exLastName | exName          |
            | Reversal    | 1Test      | 1Test, Reversal |
