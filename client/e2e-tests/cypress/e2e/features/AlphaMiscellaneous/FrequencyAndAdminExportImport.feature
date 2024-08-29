
Feature: Frequency And Administration Export Import Functionality
    Background: Launching the App and Navigating to Frequency and Administration Tab
        Given the user should launch "https://orders-qa.matrixcare.me/"
        Then the user clicks on the "Frequency and Administration" navigation menu

    @regression
    Scenario: Verify the selected facility should not be present in the facility dropdown
        Then User deletes the created Admin schedule "1" from DB
        Then user creates multiple records for FAS through API
        And user waits
        And the user clicks on "Export" button
        Then the user clicks on "Export List" link
        And user waits
        Then user type "Matrixcare Center" in Facility field
        Then User Verify "No options" should be display

    @regression
    Scenario: Verfiy Facility Field on Export section
        Then User deletes the created Admin schedule "1" from DB
        Then user creates multiple records for FAS through API
        And user waits
        And the user clicks on "Export" button
        Then the user clicks on "Export List" link
        Then the user clicks on Export button on popup
        Then user verifies "1 Error found" header
        Then user verifies "Facility" link
        Then user selects "MC Senior Care" facility
        Then user click on clear button
        Then user verifies validation message as "Facility is required."
        Then user selects "MC Senior Care" facility
        Then user click on clear button
        Then validation should "be" displayed "Facility is required"
        Then Facility label should be highlighted with red color

    @regression
    Scenario: Verfiy Units Field on Export section
        Then User deletes the created Admin schedule "1" from DB
        Then user creates multiple records for FAS through API
        And user waits
        And the user clicks on "Export" button
        Then the user clicks on "Export List" link
        And user waits
        Then user selects "MC Senior Care" facility
        And user selects "<Unit>" "<Room>" checkbox
        Then user select "Unit 1 - Room 1, Room 2; Unit 2 - Room 2, Room 3" and it should be displayed in selected unit section
        Examples:
            | Unit           | Room                            |
            | Unit 1, Unit 2 | Room 1, Room 2 ; Room 2, Room 3 |

    @regression
    Scenario: Verify the functionality of Export selected Administration Schedule
        Then User deletes the created Admin schedule "1" from DB
        Then user deletes the Admin schedule in the "MC Senior Care" facility in DB
        Then user creates multiple records for FAS through API
        Then the user refreshes the page
        And user waits
        Then user is able to see "28" Records in "Matrixcare Center" facility
        Then user select "3" Record in the page
        And the user clicks on "Export" button
        Then the user clicks on "Export Selected" link
        Then the user verifies "Export 3 Administration Schedules" popup appears
        And user waits
        Then user selects "MC Senior Care" facility
        And user selects "<Unit>" "<Room>" checkbox
        Then user select "Unit 1 - Room 1, Room 2; Unit 2 - Room 2" and it should be displayed in selected unit section
        Then the user clicks on Export button on popup
        Then user verifies the validation message as "Administration Schedules exported successfully."
        And user is navigated to "Administration Schedule List" page
        Then the user refreshes the page
        Then user is able to see "3" Records in "MC Senior Care" facility
        Examples:
            | Unit           | Room                    |
            | Unit 1, Unit 2 | Room 1, Room 2 ; Room 2 |

    @regression
    Scenario: Verify the functionality of Export list administartion schedules
        Then User deletes the created Admin schedule "1" from DB
        Then user deletes the Admin schedule in the "MC Senior Care" facility in DB
        Then user creates multiple records for FAS through API
        Then the user refreshes the page
        And user waits
        Then user is able to see "28" Records in "Matrixcare Center" facility
        Then the user clicks on "Export" button
        Then user verify the "Export Selected" button is disabled
        Then the user clicks on "Export List" link
        Then the user verifies "Export 28 Administration Schedules" popup appears
        And user waits
        Then user selects "MC Senior Care" facility
        And user selects "<Unit>" "<Room>" checkbox
        Then the user clicks on Export button on popup
        Then user verifies the validation message as "Administration Schedules exported successfully."
        And user is navigated to "Administration Schedule List" page
        Then the user refreshes the page
        Then user is able to see "28" Records in "MC Senior Care" facility
        Examples:
            | Unit           | Room                    |
            | Unit 1, Unit 2 | Room 1, Room 2 ; Room 2 |

    @regression
    Scenario: Verify on clicking on cancel, user is redirected to list page
        Then User deletes the created Admin schedule "1" from DB
        Then user creates multiple records for FAS through API
        And user waits
        Then the user clicks on "Export" button
        Then the user clicks on "Export List" link
        And user waits
        Then user selects "MC Senior Care" facility
        Then the user clicks on "Cancel" button
        And user is navigated to "Administration Schedule List" page

    @regression
    Scenario: Verify Export administartion schedules functionality using search
        When User deletes all the stock medications from UI
        Then user creates multiple records for FAS through API
        Then user types "Antidepressants" in the search text field
        Then user select "2" Record in the page
        Then the user clicks on "Export" button
        Then user verify the "Export List" button is disabled
        Then the user clicks on "Export Selected" link
        Then the user verifies "Export 2 Administration Schedules" popup appears
        And user waits
        Then user selects "MC Senior Care" facility
        Then the user clicks on Export button on popup
        Then user verifies the validation message as "Administration Schedules exported successfully."
        And user is navigated to "Administration Schedule List" page

    @regression
    Scenario: Verify the functionality of Export administartion schedules when the records are duplicate
        When User deletes all the stock medications from UI
        Then user deletes the Admin schedule in the "MC Senior Care" facility in DB
        Then user creates multiple records for FAS through API
        And user waits
        Then the user refreshes the page
        Then user select "4" Record in the page
        Then the user clicks on "Export" button
        Then the user clicks on "Export Selected" link
        Then the user verifies "Export 4 Administration Schedules" popup appears
        And user waits
        Then user selects "MC Senior Care" facility
        Then the user clicks on Export button on popup
        Then user verifies the validation message as "Administration Schedules exported successfully."
        And user is navigated to "Administration Schedule List" page
        Then user select "10" Record in the page
        Then the user clicks on "Export" button
        Then the user clicks on "Export Selected" link
        Then the user verifies "Export 10 Administration Schedules" popup appears
        Then user selects "MC Senior Care" facility
        Then the user clicks on Export button on popup
        Then user verifies the validation message as "Exported 6 of 10 Administration Schedules. 4 duplicate Administration Schedules already exist in the library."
        And user is navigated to "Administration Schedule List" page

    @regression
    Scenario: Verify Searching and putting the item in export list should be enabled by bucketing last searched and selected
        Then User deletes the created Admin schedule "1" from DB
        Then user deletes the Admin schedule in the "MC Senior Care" facility in DB
        Then user creates multiple records for FAS through API
        Then the user refreshes the page
        And user waits
        Then user is able to see "28" Records in "Matrixcare Center" facility
        Then user select "3" Record in the page
        Then User clicks on the next page button
        Then user select "2" Record in the page
        And the user clicks on "Export" button
        Then the user clicks on "Export Selected" link
        Then the user verifies "Export 5 Administration Schedules" popup appears
        And user waits
        Then user selects "MC Senior Care" facility
        Then the user clicks on Export button on popup
        Then user verifies the validation message as "Administration Schedules exported successfully."
        And user is navigated to "Administration Schedule List" page
        Then the user refreshes the page
        Then user is able to see "5" Records in "MC Senior Care" facility
        Examples:
            | Unit           | Room                    |
            | Unit 1, Unit 2 | Room 1, Room 2 ; Room 2 |

    @regression 
    Scenario: Verify Export PopUp text
        Then User deletes the created Admin schedule "1" from DB
        Then user deletes the Admin schedule in the "MC Senior Care" facility in DB
        Then user creates multiple records for FAS through API
        Then the user refreshes the page
        And user waits
        Then user select "2" Record in the page
        And the user clicks on "Export" button
        Then the user clicks on "Export Selected" link
        Then the user verifies "Export 2 Administration Schedules" popup appears
        Then the user verifies "Export your administration schedule list to another facility, providing them with a copy of your schedules."
        Then user verifies "Override the default Administration Schedule during export."
        And user waits
        Then user selects "MC Senior Care" facility
        Then User verify "Assign Exported List"
        Then User able see "Select MC Senior Care Units/Rooms"
        Then user clicks on ClearAll Button
        And user selects "<Unit>" "<Room>" checkbox
        Then user select "Unit 1 - Room 1, Room 2; Unit 2 - Room 2, Room 3" and it should be displayed in selected unit section
        Then the user clicks on Export button on popup
        Then user verifies the validation message as "Administration Schedules exported successfully."
        And user is navigated to "Administration Schedule List" page
        Examples:
            | Unit           | Room                            |
            | Unit 1, Unit 2 | Room 1, Room 2 ; Room 2, Room 3 |




