
Feature:  Order Platform Configuration	Security Tokens
    This feature file tests the Order Platform Configuration screen options as subjected to security tokens

    Scenario: All custom medication permissions enabled: Custom Medication Library: Edit; Custom Medication Library: Inactivate; Custom Medication: Delete; Facility Setup: Edit; View;
        Given the user is logged into the SNF Url with credentials
            | username       | password   |
            | orders_support | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        And the following security tokens are validated
            | customMedicationDelete | customMedicationLibraryEdit | customMedicationLibraryInactivate | facilitySetupEdit |
            | true                   | true                        | true                              | true              |
        When the user selects the facility "OKTA" from facility list
        And the user searches and selects "aaaDoNotUseMedLibrary" in the custom medication library dropdown
        And the "Save" button is enabled
        Then the user clicks on "View" button
        And the user selects "Current Selected Library" in the View DDL
        When user toggles the custom medication status
        And the user clicks on "Cancel" button
        When user click on Custom Medication Name on summary page
        Then verify "Delete" button is present
        And the user clicks on "Cancel" button
        When the user clicks on the edit pencil
        Then the user can update the library name
        And the user can inactivate or toggle the library status

    Scenario: All tokens disabled : Facility Setup:Edit and others Custom Medication, Stock Medication, , Frequency Adminstration Schedule List
        Given the user is logged into the SNF Url with credentials
            | username        | password   |
            | orders_support1 | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        Then the user sees the message "Your Facility is not set up to use MultiCare Platform. Please contact either your nursing home administrator or MatrixCare."

    Scenario: Order Platform Configuration is not available when Facility Setup: Edit token is disabled, and others enabled Custom Medication Library: Edit; Custom Medication Library: Inactivate; Custom Medication: Delete; stock Medication List: Edit; stock Medication List: Copy;stock Medication List: Inactivate, View;
        Given the user is logged into the SNF Url with credentials
            | url                                  | username        | password   |
            | https://qa61.matrixcare.me/Login.jsp | orders_support2 | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        Then the user sees the message "Your Facility is not set up to use MultiCare Platform. Please contact either your nursing home administrator or MatrixCare."

    Scenario: Facility Setup: Edit; View; Custom medication,  Stock Medication security tokens disabled
        Given the user is logged into the SNF Url with credentials
            | username        | password   |
            | orders_support3 | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        And the following security tokens are validated
            | customMedicationDelete | customMedicationLibraryEdit | customMedicationLibraryInactivate | facilitySetupEdit |
            | false                  | false                       | false                             | true              |
        When the user selects the facility "OKTA" from facility list
        Then the user cannot see the View button beside the Custom Medication Library DDL
        When the user searches and selects "aaaDoNotUseMedLibrary" in the custom medication library dropdown
        And the "Save" button is enabled

    Scenario: Facility Setup: Edit; View; Stock Medication security tokens disabled
        Given the user is logged into the SNF Url with credentials
            | username        | password   |
            | orders_support3 | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        And the following stock medication security tokens are validated
            | facilitySetupEdit | stockMedicationListEdit | stockMedicationListCopy | stockMedicationListInactivate |
            | true              | false                   | false                   | false                         |
        When the user selects the facility "OKTA" from facility list
        Then the user will see the "stock medication" list "OKTA Stock Medication/Supply List" is created|existed
        Then the user cannot see the View button beside the Stock Medication List

    Scenario: Custom Medication Library: Edit; Facility Setup: Edit; View;
        Given the user is logged into the SNF Url with credentials
            | username        | password   |
            | orders_support4 | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        And the following security tokens are validated
            | customMedicationDelete | customMedicationLibraryEdit | customMedicationLibraryInactivate | facilitySetupEdit |
            | false                  | true                        | false                             | true              |
        When the user selects the facility "OKTA" from facility list
        And the user searches and selects "aaaDoNotUseMedLibrary" in the custom medication library dropdown
        Then the "Save" button is enabled
        And the user clicks on "View" button
        And the user selects "Current Selected Library" in the View DDL
        When user cannot toggle the custom medication status
        When the user clicks on the edit pencil
        Then the user can update the library name
        And the user cannot inactivate or toggle the library status

    Scenario: Custom Medication Library: Edit; Custom Medication Library: Inactivate; Facility Setup: Edit; View;
        Given the user is logged into the SNF Url with credentials
            | username        | password   |
            | orders_support5 | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        And the following security tokens are validated
            | customMedicationDelete | customMedicationLibraryEdit | customMedicationLibraryInactivate | facilitySetupEdit |
            | false                  | true                        | true                              | true              |
        When the user selects the facility "OKTA" from facility list
        And the user searches and selects "aaaDoNotUseMedLibrary" in the custom medication library dropdown
        Then the "Save" button is enabled
        And the user clicks on "View" button
        And the user selects "Current Selected Library" in the View DDL
        When user toggles the custom medication status
        And the user clicks on "Cancel" button
        Then user click on Custom Medication Name on summary page
        Then verify "Delete" button is not present
        And the user clicks on "Cancel" button
        When the user clicks on the edit pencil
        Then the user can update the library name
        And the user can inactivate or toggle the library status

    Scenario: Custom Medication Library: Edit; Custom Medication: Delete; Facility Setup: Edit; View;
        Given the user is logged into the SNF Url with credentials
            | username        | password   |
            | orders_support6 | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        And the following security tokens are validated
            | customMedicationDelete | customMedicationLibraryEdit | customMedicationLibraryInactivate | facilitySetupEdit |
            | true                   | true                        | false                             | true              |
        When the user selects the facility "OKTA" from facility list
        And the user searches and selects "aaaDoNotUseMedLibrary" in the custom medication library dropdown
        Then the "Save" button is enabled
        And the user clicks on "View" button
        And the user selects "Current Selected Library" in the View DDL
        Then user click on Custom Medication Name on summary page
        Then verify "Delete" button is present
        And the user clicks on "Cancel" button
        When the user clicks on the edit pencil
        Then the user can update the library name
        And the user cannot inactivate or toggle the library status

    Scenario: Custom Medication Library: Inactivate; Custom Medication: Delete; Facility Setup: Edit; View;
        Given the user is logged into the SNF Url with credentials
            | username        | password   |
            | orders_support7 | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        And the following security tokens are validated
            | customMedicationDelete | customMedicationLibraryEdit | customMedicationLibraryInactivate | facilitySetupEdit |
            | true                   | false                       | true                              | true              |
        When the user selects the facility "OKTA" from facility list
        And the user searches and selects "aaaDoNotUseMedLibrary" in the custom medication library dropdown
        Then the "Save" button is enabled
        And the user cannot see the View button beside the Custom Medication Library DDL

    Scenario: Custom Medication Library: Inactivate; Facility Setup: Edit; View;
        Given the user is logged into the SNF Url with credentials
            | username        | password   |
            | orders_support8 | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        And the following security tokens are validated
            | customMedicationDelete | customMedicationLibraryEdit | customMedicationLibraryInactivate | facilitySetupEdit |
            | false                  | false                       | true                              | true              |
        When the user selects the facility "OKTA" from facility list
        And the user searches and selects "aaaDoNotUseMedLibrary" in the custom medication library dropdown
        Then the "Save" button is enabled
        And the user cannot see the View button beside the Custom Medication Library DDL

    Scenario: Custom Medication: Delete; Facility Setup: Edit; View;
        Given the user is logged into the SNF Url with credentials
            | username        | password   |
            | orders_support9 | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        And the following security tokens are validated
            | customMedicationDelete | customMedicationLibraryEdit | customMedicationLibraryInactivate | facilitySetupEdit |
            | true                   | false                       | false                             | true              |
        When the user selects the facility "OKTA" from facility list
        And the user searches and selects "aaaDoNotUseMedLibrary" in the custom medication library dropdown
        Then the "Save" button is enabled
        And the user cannot see the View button beside the Custom Medication Library DDL

    Scenario: All stock Medication permissions enabled: Facility Setup: Edit; stock Medication List: Edit; stock Medication List: Copy;stock Medication List: Inactivate;
        Given the user is logged into the SNF Url with credentials
            | username       | password   |
            | Orders_Support | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        And the following stock medication security tokens are validated
            | facilitySetupEdit | stockMedicationListEdit | stockMedicationListCopy | stockMedicationListInactivate |
            | true              | true                    | true                    | true                          |
        When the user selects the facility "OKTA" from facility list
        Then the user will see the "stock medication" list "OKTA Stock Medication/Supply List" is created|existed
        And the user clicks on the "Current Selected List" option on the View button beside "Stock Medication/Supply List"
        And the user will see the Import or Export button to copy data
        Then the user selects a stock medication to verify delete button get activated
        And the stock medication list test data created is deleted

    Scenario: Stock Medication List: Edit; Facility Setup: Edit; View;
        Given the user is logged into the SNF Url with credentials
            | username        | password   |
            | orders_support4 | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        And the following stock medication security tokens are validated
            | facilitySetupEdit | stockMedicationListEdit | stockMedicationListCopy | stockMedicationListInactivate |
            | true              | true                    | false                   | false                         |
        When the user selects the facility "OKTA" from facility list
        Then the user will see the "stock medication" list "OKTA Stock Medication/Supply List" is created|existed
        And the user clicks on the "Current Selected List" option on the View button beside "Stock Medication/Supply List"

    Scenario: Facility Setup: Edit; stock Medication List: Edit; stock Medication List: Copy;
        Given the user is logged into the SNF Url with credentials
            | username        | password   |
            | orders_support5 | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        And the following stock medication security tokens are validated
            | facilitySetupEdit | stockMedicationListEdit | stockMedicationListCopy | stockMedicationListInactivate |
            | true              | true                    | true                    | false                         |
        When the user selects the facility "OKTA" from facility list
        Then the user will see the "stock medication" list "OKTA Stock Medication/Supply List" is created|existed
        And the user clicks on the "Current Selected List" option on the View button beside "Stock Medication/Supply List"
        And the user will see the Import or Export button to copy data
        And the user cannot see the Delete button on the stock medication page

    Scenario: Facility Setup: Edit; stock Medication List: Edit; stock Medication List: Inactivate;
        Given the user is logged into the SNF Url with credentials
            | username        | password   |
            | orders_support6 | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        And the following stock medication security tokens are validated
            | facilitySetupEdit | stockMedicationListEdit | stockMedicationListCopy | stockMedicationListInactivate |
            | true              | true                    | false                   | true                          |
        When the user selects the facility "OKTA" from facility list
        Then the user will see the "stock medication" list "OKTA Stock Medication/Supply List" is created|existed
        And the user clicks on the "Current Selected List" option on the View button beside "Stock Medication/Supply List"
        Then the user selects a stock medication to verify delete button get activated
        And the user cannot see the Import or Export button on the stock medication page

    Scenario: Stock Medicaiton:Edit disabled. Stock Medication List: Inactivate; Facility Setup: Edit; View are enabled;
        Given the user is logged into the SNF Url with credentials
            | username        | password   |
            | orders_support7 | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        And the following stock medication security tokens are validated
            | facilitySetupEdit | stockMedicationListEdit | stockMedicationListCopy | stockMedicationListInactivate |
            | true              | false                   | false                   | true                          |
        When the user selects the facility "OKTA" from facility list
        Then the user will see the "stock medication" list "OKTA Stock Medication/Supply List" is created|existed
        Then the user cannot see the View button beside the Stock Medication List
        When the user clicks "Order Platform Setup" tab in the Order Platform Configuration screen
        And the user clicks the "Stock Medication List" left tab
        Then the user sees the message "You do not have permission(s)/security token(s) to perform this action. If you need to perform this task, please contact your Unit Supervisor or System Administrator to grant you the necessary permission(s)/security token(s)"
        When the user clicks "Facility Setup" tab in the Order Platform Configuration screen
        When the user selects the facility "MCMQA14IL" from facility list
        Then the user will not see the create Button for the Stock Medication List
        Then the user cannot see the View button beside the Stock Medication List

    Scenario: Stock Medicaiton:Edit disabled. Stock Medication List :Copy; Facility Setup: Edit; View;
        Given the user is logged into the SNF Url with credentials
            | username        | password   |
            | orders_support8 | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        And the following stock medication security tokens are validated
            | facilitySetupEdit | stockMedicationListEdit | stockMedicationListCopy | stockMedicationListInactivate |
            | true              | false                   | true                    | false                         |
        When the user selects the facility "OKTA" from facility list
        Then the user will see the "stock medication" list "OKTA Stock Medication/Supply List" is created|existed
        Then the user cannot see the View button beside the Stock Medication List
        When the user clicks "Order Platform Setup" tab in the Order Platform Configuration screen
        And the user clicks the "Stock Medication List" left tab
        Then the user sees the message "You do not have permission(s)/security token(s) to perform this action. If you need to perform this task, please contact your Unit Supervisor or System Administrator to grant you the necessary permission(s)/security token(s)"
        When the user clicks "Facility Setup" tab in the Order Platform Configuration screen
        Then the user selects the facility "MCMQA14IL" from facility list
        Then the user will not see the create Button for the Stock Medication List
        Then the user cannot see the View button beside the Stock Medication List

    Scenario: All Frequency Adminsistration Schedule List permissions enabled: Facility Setup: Edit; Frequency Adminsistration Schedule List: Edit; Frequency Adminsistration Schedule List: Copy; Frequency Adminsistration Schedule List: Inactivate;
        Given the user is logged into the SNF Url with credentials
            | username       | password   |
            | Orders_Support | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        And the following frequency administration schedule list security tokens are validated
            | facilitySetupEdit | frequencyAdministrationScheduleListEdit | frequencyAdministrationScheduleListCopy | frequencyAdministrationScheduleListInactivate |
            | true              | true                                    | true                                    | true                                          |
        When the user selects the facility "OKTA" from facility list
        Then the user will see the "admin schedule" list "OKTA Administration Schedule List" is created|existed
        And the user clicks on the "Current Selected List" option on the View button beside "Administration Schedule List"
        And the user will see the Import or Export button to copy data
        Then the user selects a schedule to verify delete button get activated
        And the admin schedule list test data created is deleted

    @focus
    Scenario: Frequency Adminsistration Schedule List: Edit; Facility Setup: Edit; View;
        Given the user is logged into the SNF Url with credentials
            | username        | password   |
            | orders_support4 | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        And the following frequency administration schedule list security tokens are validated
            | facilitySetupEdit | frequencyAdministrationScheduleListEdit | frequencyAdministrationScheduleListCopy | frequencyAdministrationScheduleListInactivate |
            | true              | true                                    | false                                   | false                                         |
        When the user selects the facility "OKTA" from facility list
        Then the user will see the "admin schedule" list "OKTA Administration Schedule List" is created|existed
        And the user clicks on the "Current Selected List" option on the View button beside "Administration Schedule List"
        Then the user can see "Add Schedule" button

    @focus
    Scenario: Facility Setup: Edit; Frequency Adminsistration Schedule List: Edit; Frequency Adminsistration Schedule List: Copy;
        Given the user is logged into the SNF Url with credentials
            | username        | password   |
            | orders_support5 | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        And the following frequency administration schedule list security tokens are validated
            | facilitySetupEdit | frequencyAdministrationScheduleListEdit | frequencyAdministrationScheduleListCopy | frequencyAdministrationScheduleListInactivate |
            | true              | true                                    | true                                    | false                                         |
        When the user selects the facility "OKTA" from facility list
        Then the user will see the "admin schedule" list "OKTA Administration Schedule List" is created|existed
        And the user clicks on the "Current Selected List" option on the View button beside "Administration Schedule List"
        And the user will see the Import or Export button to copy schedule on the Administration Schedule Page
        And the user cannot see the Delete button on the Administration Schedule List page

    @focus
    Scenario: Facility Setup: Edit; Frequency Administration Schedule List: Edit; Frequency Administration Schedule List: Inactivate;
        Given the user is logged into the SNF Url with credentials
            | username        | password   |
            | orders_support6 | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        And the following frequency administration schedule list security tokens are validated
            | facilitySetupEdit | frequencyAdministrationScheduleListEdit | frequencyAdministrationScheduleListCopy | frequencyAdministrationScheduleListInactivate |
            | true              | true                                    | false                                   | true                                          |
        When the user selects the facility "OKTA" from facility list
        Then the user will see the "admin schedule" list "OKTA Administration Schedule List" is created|existed
        And the user clicks on the "Current Selected List" option on the View button beside "Administration Schedule List"
        Then the user selects a schedule to verify delete button get activated
        And the user cannot see the Import or Export button on the administration schedule list page

    @focus
    Scenario: Frequency Administration Schedule List:Edit disabled.
        Given the user is logged into the SNF Url with credentials
            | username        | password   |
            | orders_support7 | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        And the following frequency administration schedule list security tokens are validated
            | facilitySetupEdit | frequencyAdministrationScheduleListEdit | frequencyAdministrationScheduleListCopy | frequencyAdministrationScheduleListInactivate |
            | true              | false                                   | false                                   | true                                          |
        When the user selects the facility "OKTA" from facility list
        Then the user will see the "admin schedule" list "OKTA Administration Schedule List" is created|existed
        Then the user cannot see the View button beside the Frequency Administration Schedule List
        When the user clicks "Order Platform Setup" tab in the Order Platform Configuration screen
        And the user clicks the "Administration Schedule List" left tab
        Then the user sees the message "You do not have permission(s)/security token(s) to perform this action. If you need to perform this task, please contact your Unit Supervisor or System Administrator to grant you the necessary permission(s)/security token(s)"
        When the user clicks "Facility Setup" tab in the Order Platform Configuration screen
        When the user selects the facility "MCMQA14IL" from facility list
        Then the user will not see the create Button for the Frequency Administration Schedule List
        Then the user cannot see the View button beside the Frequency Administration Schedule List
