
Feature: Frequency And Administration Summary
    Background: Launching the App and Navigating to Frequency and Administration Tab
         Given the user is logged into the SNF Url with credentials
            | url                                  | username       | password   |
            | https://qa61.matrixcare.me/Login.jsp | orders_support | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        When the user clicks "Order Platform Setup" tab in the Order Platform Configuration screen
        And the user clicks the "Administration Schedule List" left tab
        Then User selects "GM Facility A Administration Schedule List" from the list 

    @regression @sanity
    Scenario: Verify Admin schedule data is appearing for Daily
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Daily"
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | BID       | true | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Time Range | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 10:42 AM,09:21 PM | 1        | Days         |
        Then User types "zyvox" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User verifies the data with repeats as Daily
            | frequency       | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | 2 times per day | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Time Range | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 10:42 AM,09:21 PM | 1        | Days         |
        Then User deletes the created Admin schedule "0" from DB

    @regression
    Scenario: Verify Admin schedule data is appearing for Cyclical
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                                                  | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | 6XD       |     | Medication     | Medication Group    | Statins     | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 10:45 AM,09:20 PM,09:23 PM,09:24 PM,09:26 PM,09:28 PM | 5        | Weeks        | Every Other Day | 5        | 8             |
        Then User types "Statins" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User verifies the data with repeats as Daily
            | frequency       | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                                                  | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | 6 times per day | Medication     | Medication Group    | Statins     | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 10:45 AM,09:20 PM,09:23 PM,09:24 PM,09:26 PM,09:28 PM | 5        | Weeks        | Every Other Day | 5        | 8             |
        Then User deletes the created Admin schedule "0" from DB

    @regression
    Scenario: Verify Delete button is available for existing schedule and not for new
        Then user click on "Add Schedule" button
        And verifies "Delete" button "is not" visible
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime         | EndTime           | Time              | Duration | DurationType | CycleType   | GiveDays | DonotGiveDays |
            | BID       |     | Medication     | Drug Name           | zyvox       | Unit 1 | Room 1, Room 2 | Specific Time | 10:45 AM,09:20 PM | 10:45 AM,09:20 PM | 10:45 AM,09:20 PM | 1        | Days         | Custom Days | 5        | 8             |
        Then User types "zyvox" character in text field
        And User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        And verifies "Delete" button "is" visible
        Then User deletes the created Admin schedule "0" from DB

    @sanity @regression 
    Scenario: Verify schedule is getting deleted from DB when user clicks on delete button
       Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time              | Duration | DurationType | CycleType   | GiveDays | DonotGiveDays |
            | BID       |     | Medication     | Drug Name           | zyvox       | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 10:46 AM,09:21 PM | 1        | Days         | Custom Days | 5        | 8             |
        Then User types "zyvox" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        And the user clicks on "Delete" button
        Then user verifies " Delete Schedule" is visible
        Then user verifies "Are you sure you want to delete this schedule?" is visible
        And user verifies "You cannot undo this action." is visible
        And the user will click on "Delete" button
        Then the user verifies the record "is not" visible in DB
        And user is redirected to Admin summary page
        Then User types "zyvox" character in text field
        And user verifies "No matches found" message

    @sanity @regression 
    Scenario: Verify schedule is not getting deleted when user clicks on cancel or X button
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time              | Duration | DurationType | CycleType   | GiveDays | DonotGiveDays |
            | BID       |     | Medication     | Drug Name           | zyvox       | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 10:47 AM,09:22 PM | 1        | Days         | Custom Days | 5        | 8             |
        Then User types "zyvox" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        And the user clicks on "Delete" button
        Then user verifies " Delete Schedule" is visible
        And the user will click on Cancel button
        Then the user verifies the record "is" visible in DB
        And Schedule exists on the edit schedule page
        Then User clicks on back button
        Then User types "zyvox" character in text field
        And Schedule exists on the summary page
        Then User deletes the created Admin schedule "0" from DB

    @sanity @regression
    Scenario: Verify schedule is not getting deleted when user refreshes the screen  When User clicks the first Administration Schedule
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time              | Duration | DurationType | CycleType   | GiveDays | DonotGiveDays |
            | BID       |     | Medication     | Drug Name           | zyvox       | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 10:28 AM,09:29 PM | 1        | Days         | Custom Days | 5        | 8             |
        Then User types "zyvox" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        And the user clicks on "Delete" button
        Then user verifies " Delete Schedule" is visible
        Then the user reloads the browser
        Then the user verifies the record "is" visible in DB
        And Schedule exists on the edit schedule page
        Then User clicks on back button
        Then User types "zyvox" character in text field
        And Schedule exists on the summary page
        Then User deletes the created Admin schedule "0" from DB

    @regression 
    Scenario: Verify Admin schedule data is appearing for Weekly
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Weekly"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                                         | Duration | DurationType | EveryWeek | ChooseDays  |
            | 5XD       |     | Medication     | Medication Group    | Analgesics  | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 10:45 AM,09:20 PM,09:23 PM,09:24 PM,09:26 PM | 5        | Months       | 2         | Sun,Mon,Tue |
        Then User types "Analgesics" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User verifies the data with repeats as Weekly
            | frequency       | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                                         | Duration | DurationType | EveryWeek | ChooseDays  |
            | 5 times per day | Medication     | Medication Group    | Analgesics  | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 10:45 AM,09:20 PM,09:23 PM,09:24 PM,09:26 PM | 5        | Months       | 2         | Sun,Mon,Tue |
        Then User deletes the created Admin schedule "0" from DB

    @regression 
    Scenario: Verify Admin schedule data is appearing for Monthly
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Monthly"
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime                           | EndTime                             | Time | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months  | Daysof           | ChooseWeeks | WeeksOfMonth |
            | QID       | true | Medication     | Drug Name           | Zyvit       | Unit 2 | Room 1, Room 2 | Time Range | 10:45 AM,09:20 PM,09:23 PM,09:24 PM | 10:46 AM,09:21 PM,09:24 PM,09:25 PM |      | 5        | Months       | Every Months | 2          | 3,4,8      | Jun,Apr | Days of the Week | Tue,Wed,Thu | 1st,3rd      |
        Then User types "4 times per day" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User verifies the data with repeats as Monthly
            | frequency       | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime                           | EndTime                             | Time | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months | ChooseWeeks | Daysof           | ChooseWeeks | WeeksOfMonth |
            | 4 times per day | Medication     | Drug Name           | Zyvit       | Unit 2 | Room 1, Room 2 | Time Range | 10:45 AM,09:20 PM,09:23 PM,09:24 PM | 10:46 AM,09:21 PM,09:24 PM,09:25 PM |      | 5        | Months       | Every Months | 2          | 3,4,8      |        |             | Days of the Week | Tue,Wed,Thu | 1st,3rd      |
        Then User deletes the created Admin schedule "0" from DB

    @regression 
    Scenario Outline: Verify all the requeired elements are displayed irrespective of records
        When user verifies the "GM Facility A Administration Schedule List" title is displayed
        Then user verifies "Frequency" header is displayed
        Then user verifies "Administration Schedule" header is displayed
        Then user verifies "Order Type" header is displayed
        Then user verifies "Assigned To" header is displayed
        Then user verifies "Add Schedule" button is displayed
        Then user verifies Search field is displayed

    @regression 
    Scenario: Verify Admin schedule data is appearing for Daily in the Summary Page grid
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Daily"
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | BID       | true | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Time Range | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 10:42 AM,09:21 PM | 1        | Days         |
        Then User types "zyvox" character in text field
        Then user verify data of all the columns in summary grid
            | frequency           | adminSchedule                                                                    | orderType                    | assignedTo              |
            | BID 2 times per day | 2 times per day at 10:45 AM - 10:46 AM, 09:20 PM - 09:27 PM for 1 Days as needed | Medication, Drug Name: Zyvox | Unit 1 - Room 1, Room 2 |
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User deletes the created Admin schedule "0" from DB

    @regression 
    Scenario: Verify Admin schedule data is appearing for Cyclical in the Summary Page grid
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                                                  | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | 6XD       |     | Medication     | Medication Group    | Statins     | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 10:45 AM,09:20 PM,09:23 PM,09:24 PM,09:26 PM,09:28 PM | 5        | Weeks        | Every Other Day | 5        | 8             |
        Then User types "Statins" character in text field
        Then user verify data of all the columns in summary grid
            | frequency           | adminSchedule                                                                                                | orderType                             | assignedTo              |
            | 6XD 6 times per day | 6 times per day on every other day at 10:45 AM, 09:20 PM, 09:23 PM, 09:24 PM, 09:26 PM, 09:28 PM for 5 Weeks | Medication, Medication Group: Statins | Unit 2 - Room 1, Room 2 |
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User deletes the created Admin schedule "0" from DB

    @regression 
    Scenario Outline:Verify Admin schedule data is appearing for Weekly in the Summary Page grid
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Weekly"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                       | Duration | DurationType | EveryWeek | ChooseDays |
            | TID+Meal  |     | Medication     | Medication Group    | Analgesics  | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 10:45 AM,09:20 PM,09:23 PM | 5        | Months       | 2         | Mon        |
        Then User types "Analgesics" character in text field
        Then user verify data of all the columns in summary grid
            | frequency                           | adminSchedule                                                                                | orderType                                | assignedTo              |
            | TID+Meal 3 times per day with meals | 3 times per day with meals on Mon every 2 weeks at 10:45 AM, 09:20 PM, 09:23 PM for 5 Months | Medication, Medication Group: Analgesics | Unit 2 - Room 1, Room 2 |
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User deletes the created Admin schedule "0" from DB

    @regression 
    Scenario Outline:Verify Admin schedule data is appearing for Weekly with no Order Type in the Summary Page grid
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Weekly"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit                   | Room                                                                                           | ChooseTime    | StartTime | EndTime | Time                                | Duration | DurationType | EveryWeek | ChooseDays |
            | QID+PC+HQ |     |                |                     |             | Unit 1, Unit 2, Unit 3 | Room 1, Room 2, Room 3, Room 4; Room 1, Room 2, Room 3; Room 1, Room 2, Room 3, Room 4, Room 5 | Specific Time |           |         | 10:45 AM,09:20 PM,09:23 PM,10:20 PM | 5        | Months       | 2         | Wed        |
        Then user verify data of all the columns in summary grid
            | frequency                                             | adminSchedule                                                                                                           | orderType | assignedTo        |
            | QID+PC+HQ 4 times per day before meals and at bedtime | 4 times per day before meals and at bedtime on Wed every 2 weeks at 10:45 AM, 09:20 PM, 09:23 PM, 10:20 PM for 5 Months | All       | MatrixCare Center |
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User deletes the created Admin schedule "0" from DB

    @regression 
    Scenario Outline:Verify Admin schedule data is appearing for Monthly in the Summary Page grid
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Monthly"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                                | Duration | DurationType | TabSelection  | Daysof           | EveryMonth | ChooseDays | Months      | ChooseWeeks | WeeksOfMonth |
            | QID       |     | Medication     | Drug Name           | Zyvit       | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 10:45 AM,09:20 PM,09:23 PM,09:24 PM | 5        | Months       | Select Months | Days of the Week | 2          | 3,4,8      | Feb,Mar,Apr | Tue,Wed,Fri | 1st, 3rd     |
        Then User types "Zyvit" character in text field
        Then user verify data of all the columns in summary grid
            | frequency           | adminSchedule                                                                                                      | orderType                    | assignedTo              |
            | QID 4 times per day | 4 times per day on 1st, 3rd Tue, Wed, Fri of Feb, Mar, Apr at 10:45 AM, 09:20 PM, 09:23 PM, 09:24 PM for 5 Months | Medication, Drug Name: Zyvit | Unit 2 - Room 1, Room 2 |
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User deletes the created Admin schedule "0" from DB

    @sanity @regression 
    Scenario Outline: Verify user is able to sort using Frequency coloumn
        Then User deletes the created Admin schedule "1" from DB
        Then user creates multiple records for FAS through API
        And user waits
        Then sort order of Frequency should be "asc"
        When the user clicks on the arrow button next to "Frequency" column
        And user waits
        Then sort order of Frequency should be "desc"
        When the user clicks on the arrow button next to "Frequency" column
        And user waits
        Then sort order of Frequency should be "asc"

    @sanity @regression 
    Scenario Outline: Verify user is able to sort using Administration Schedule coloumn
        Then User deletes the created Admin schedule "1" from DB
        Then user creates multiple records for FAS through API
        And user waits
        Then sort order of Administration should be "asc"
        When the user clicks on the arrow button next to "Administration Schedule" column
        And user waits
        Then sort order of Administration should be "desc"
        When the user clicks on the arrow button next to "Administration Schedule" column
        And user waits
        Then sort order of Administration should be "asc"


    @sanity @regression 
    Scenario Outline: Verify user is able to sort using Order Type coloumn
        Then User deletes the created Admin schedule "1" from DB
        Then user creates multiple records for FAS through API
        And user waits
        Then sort order of Order Type should be "asc"
        When the user clicks on the arrow button next to "Order Type" column
        And user waits
        Then sort order of Order Type should be "desc"
        When the user clicks on the arrow button next to "Order Type" column
        And user waits
        Then sort order of Order Type should be "asc"

    @sanity @regression 
    Scenario Outline: Verify user is able to sort using Assigned To coloumn
        Then User deletes the created Admin schedule "1" from DB
        Then user creates multiple records for FAS through API
        And user waits
        Then sort order of Assigned To should be "asc"
        When the user clicks on the arrow button next to "Assigned To" column
        And user waits
        Then sort order of Assigned To should be "desc"
        When the user clicks on the arrow button next to "Assigned To" column
        And user waits
        Then sort order of Assigned To should be "asc"

    @sanity @regression 
    Scenario Outline: Verify searching with valid and invalid value in the search field
        Then User deletes the created Admin schedule "1" from DB
        Then user creates multiple records for FAS through API
        Then user search for following name "Astroglide"
        Then searched result  should contain "Astroglide" in the table
        Then user search for following name "abcAstroglide"
        Then searched result should display as "No matches found"

    @sanity @regression
    Scenario Outline:Verify the search results are cleared when user refreshes the screen.
        Then User deletes the created Admin schedule "1" from DB
        Then user creates multiple records for FAS through API
        Then user search for following name "Astroglide"
        Then searched result  should contain "Astroglide" in the table
        Then the user refreshes the page
        And user waits
        Then the search text field should be blank

    @sanity @regression
    Scenario Outline:Verify the pagination functionality in the FAS page
        Then User deletes the created Admin schedule "1" from DB
        Then user creates multiple records for FAS through API
        Then the user refreshes the page
        And user waits
        Then verify "previous" navigation arrow is "disabled"
        Then verify "first" navigation arrow is "disabled"
        Then navigate to page "2" in pagination
        Then verify "previuos" navigation arrow is "enabled"
        Then verify "first" navigation arrow is "enabled"
        Then verify "next" navigation arrow is "disabled"
        Then verify "last" navigation arrow is "disabled"
        When the user clicks on the first arrow in pagination
        Then verify "previous" navigation arrow is "disabled"
        Then verify "first" navigation arrow is "disabled"

    @sanity @regression
    Scenario Outline:Verify user is able to sort the custom medication name column after search results appear.
        Then User deletes the created Admin schedule "1" from DB
        Then user creates multiple records for FAS through API
        Then user search for following name "dext"
        When the user clicks on the arrow button next to "Frequency" column
        And user waits
        Then sort order of Frequency should be "desc"
        When the user clicks on the arrow button next to "Frequency" column
        And user waits
        Then sort order of Frequency should be "asc"
        When the user clicks on the arrow button next to "Administration Schedule" column
        And user waits
        Then sort order of Administration should be "desc"
        When the user clicks on the arrow button next to "Administration Schedule" column
        And user waits
        Then sort order of Administration should be "asc"
        When the user clicks on the arrow button next to "Order Type" column
        And user waits
        Then sort order of Order Type should be "desc"
        When the user clicks on the arrow button next to "Order Type" column
        And user waits
        Then sort order of Order Type should be "asc"
        When the user clicks on the arrow button next to "Assigned To" column
        And user waits
        Then sort order of Assigned To should be "desc"
        When the user clicks on the arrow button next to "Assigned To" column
        And user waits
        Then sort order of Assigned To should be "asc"

    @sanity @regression
    Scenario Outline: Verify sorting is happening for after navigating to different page
        Then User deletes the created Admin schedule "1" from DB
        Then user creates multiple records for FAS through API
        Then user creates multiple records for FAS through API
        Then user creates multiple records for FAS through API
        Then the user refreshes the page
        And user waits
        Then navigate to page "2" in pagination
        When the user clicks on the arrow button next to "Frequency" column
        And user waits
        Then sort order of Frequency should be "desc"
        When the user clicks on the arrow button next to "Frequency" column
        And user waits
        Then sort order of Frequency should be "asc"

    @sanity @regression
    Scenario Outline: Verify user is able to search with single charcters
        Then User deletes the created Admin schedule "1" from DB
        Then user creates multiple records for FAS through API
        Then user search for following name "5"
        Then searched result  should contain "5" in frequency column
        Then remove the value entered in search field
        Then sort order of Frequency should be "asc"

    @sanity @regression
    Scenario Outline: Verify user arrow is upward direction by default and by clicking it is downward direction
        Then User deletes the created Admin schedule "1" from DB
        Then user creates multiple records for FAS through API
        And user waits
        Then verify frequency column arrow is in upwards direction
        Then sort order of Frequency should be "asc"
        When the user clicks on the arrow button next to "Frequency" column
        And user waits
        Then verify frequency column arrow is in downards direction
        Then sort order of Frequency should be "desc"

    @regression
    Scenario Outline: Verify user is able to cancel the selected  record
        Then User deletes the created Admin schedule "1" from DB
        Then user creates multiple records for FAS through API
        Then the user refreshes the page
        Then User types "Astroglide" character in text field
        Then user click on SelectAll checkbox
        Then the user clicks on "Delete" button
        Then user verifies the "Are you sure you want to delete this schedule?" messages on the popup
        Then the user clicks on "Cancel" button
        Then selected Item should be deselected
        Then user click on SelectAll checkbox
        Then the user clicks on "Delete" button
        Then user click on X Button
        Then selected Item should be deselected

    @regression
    Scenario Outline: Verify user is able to Delete the single record
        Then User deletes the created Admin schedule "1" from DB
        Then user creates multiple records for FAS through API
        Then the user refreshes the page
        Then User types "Astroglide" character in text field
        Then Delete Button should be "disabled" state
        Then user click on SelectAll checkbox
        Then Button should not be in "disabled" state
        Then the user clicks on "Delete" button
        Then user verifies the "Are you sure you want to delete this schedule?" messages on the popup
        Then the user clicks on confirmation "Delete" button
        Then the user sees the message "Administration Schedule deleted successfully."
        Then User types "Astroglide" character in text field
        Then verify "No matches found" message is displayed in summary page

    @regression 
    Scenario Outline: Verify user is able to Delete the Multiple Records
        Then User deletes the created Admin schedule "1" from DB
        Then user creates multiple records for FAS through API
        Then the user refreshes the page
        Then user able to see "28" total number of records in the grid
        Then user select "2" Record in the page
        Then the user clicks Next button on pagegrid
        And user waits
        Then user select "1" Record in the page
        Then the user clicks on "Delete" button
        Then user verifies the "Are you sure you want to delete 3 selected schedules?" messages on the popup
        Then the user clicks on confirmation "Delete" button
        Then user able to see "25" total number of records in the grid
        Then the user sees the message "Administration Schedule deleted successfully."

    @regression 
    Scenario Outline: Verify user is able to select and Delete all Records in specific page
        Then User deletes the created Admin schedule "1" from DB
        Then user creates multiple records for FAS through API
        Then the user refreshes the page
        Then user able to see "28" total number of records in the grid
        Then user click on SelectAll checkbox
        Then all checkboxes should be select
        Then the user clicks Next button on pagegrid
        And user waits
        Then Delete Button should be "disabled" state
        Then user navigate to previous page
        And user waits
        Then user click on SelectAll checkbox
        Then all checkboxes should be select
        Then the user clicks on "Delete" button
        Then user verifies the "Are you sure you want to delete 20 selected schedules?" messages on the popup
        Then the user clicks on confirmation "Delete" button
        Then the user refreshes the page
        Then user is able to see "4" records in Summary page
        Then user verifies the count "4" of records in DB
        Then the user sees the message "Administration Schedule deleted successfully."

    @regression 
    Scenario Outline: Verify selected items are deselected when refresh the apge
        Then User deletes the created Admin schedule "0" from DB
        Then user creates multiple records for FAS through API
        Then the user refreshes the page
        Then user able to see "28" total number of records in the grid
        Then user click on SelectAll checkbox
        Then all checkboxes should be select
        Then the user refreshes the page
        Then selected Item should be deselected

    @regression @sanity 
    Scenario: Verify user is able to edit and update F&A Values when Daily is selected as repeats
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        Then User creates Admin Schedule with repeats as given "Daily"
            | frequency | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | BID       |                |                     |             | Unit 1 | Room 1, Room 2 | Time Range | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 10:42 AM,09:21 PM | 1        | Days         |
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User verifies the data with repeats as Daily
            | frequency       | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | 2 times per day |                |                     |             | Unit 1 | Room 1, Room 2 | Time Range | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 10:42 AM,09:21 PM | 1        | Days         |
        Then User creates Admin Schedule with repeats as given "Daily"
            | frequency | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime | EndTime  | Time | Duration | DurationType |
            | QD        |                |                     |             | Unit 2 | Room 2, Room 3 | Time Range | 08:45 AM  | 08:46 AM |      | 5        | Weeks        |
        When User clicks the first Administration Schedule
        Then User verifies the data with repeats as Daily
            | frequency  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime | EndTime  | Time | Duration | DurationType |
            | once daily |                |                     |             | Unit 2 | Room 2, Room 3 | Time Range | 08:45 AM  | 08:46 AM |      | 5        | Weeks        |
        Then User deletes the created Admin schedule "0" from DB

    @regression @sanity 
    Scenario: Verify user is able to edit and update F&A Values when Cyclical is selected as repeats
        Then user click on "Add Schedule" button
        Then User creates Admin Schedule with repeats as given "Cyclical"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time              | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | BID       |     | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 10:46 AM,09:27 PM | 1        | Days         | Every Other Day |          |               |
        Then User types "Zyvox" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User verifies the data with repeats as Cyclical
            | frequency       | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time              | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | 2 times per day | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 10:46 AM,09:27 PM | 1        | Days         | Every Other Day |          |               |
        Then User creates Admin Schedule with repeats as given "Cyclical"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                       | Duration | DurationType | CycleType   | GiveDays | DonotGiveDays |
            | TID       |     | Medication     | Drug Name           | TYR 2       | Unit 2 | Room 2, Room 3 | Specific Time |           |         | 08:42 AM,08:21 PM,08:28 PM | 5        | Weeks        | Custom Days | 5        | 8             |
        Then User types "TYR 2" character in text field
        When User clicks the first Administration Schedule
        Then User verifies the data with repeats as Cyclical
            | frequency       | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                       | Duration | DurationType | CycleType   | GiveDays | DonotGiveDays |
            | 3 times per day | Medication     | Drug Name           | TYR 2       | Unit 2 | Room 2, Room 3 | Specific Time |           |         | 08:42 AM,08:21 PM,08:28 PM | 5        | Weeks        | Custom Days | 5        | 8             |
        Then User deletes the created Admin schedule "0" from DB

    @regression @sanity 
    Scenario: Verify user is able to edit and update F&A Values when Weekly is selected as repeats
        When User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        Then User creates Admin Schedule with repeats as given "Weekly"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime | EndTime  | Time | Duration | DurationType | EveryWeek | ChooseDays |
            | QAM       |     | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Time Range | 10:46 AM  | 10:48 AM |      | 1        | Weeks        | 2         | Mon,Tue    |
        Then User types "Zyvox" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User verifies the data with repeats as Weekly
            | frequency      | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime | EndTime  | Time | Duration | DurationType | EveryWeek | ChooseDays |
            | in the morning | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Time Range | 10:46 AM  | 10:48 AM |      | 1        | Weeks        | 2         | Mon ,Tue   |
        Then User creates Admin Schedule with repeats as given "Weekly"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | EveryWeek | ChooseDays  |
            | QShift    |     | Medication     | Drug Name           | TYR 2       | Unit 2 | Room 2, Room 3 | Specific Time |           |         | 08:42 AM | 5        | Months       | 8         | Mon,Tue,Wed |
        Then User types "TYR 2" character in text field
        When User clicks the first Administration Schedule
        Then User verifies the data with repeats as Weekly
            | frequency   | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | EveryWeek | ChooseDays   |
            | every shift | Medication     | Drug Name           | TYR 2       | Unit 2 | Room 2, Room 3 | Specific Time |           |         | 08:42 AM | 5        | Months       | 8         | Mon ,Tue,Wed |
        Then User deletes the created Admin schedule "0" from DB

    @regression @sanity 
    Scenario: Verify user is able to edit and update F&A Values when Monthly is selected as repeats
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        Then User wait for synchronization
        Then User creates Admin Schedule with repeats as given "Monthly"
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months | Daysof           | ChooseWeeks | WeeksOfMonth |
            | QHS       | true | Medication     | Drug Name           | Zyvox       | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 08:42 AM | 5        | Months       | Every Months | 5          | 3,4,8      | Aug    | Days of the Week | Tue,Wed,Thu | 1st,3rd      |
        Then User types "Zyvox" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User wait for synchronization
        Then User verifies the data with repeats as Monthly
            | frequency  | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months | Daysof           | ChooseWeeks | WeeksOfMonth |
            | at bedtime | true | Medication     | Drug Name           | Zyvox       | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 08:42 AM | 5        | Months       | Every Months | 5          | 3,4,8      | Aug    | Days of the Week | Tue,Wed,Thu | 1st,3rd      |
        Then User wait for synchronization
        Then User creates Admin Schedule with repeats as given "Monthly"
            | frequency | prn   | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime | EndTime  | Time | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months | Daysof           | ChooseWeeks | WeeksOfMonth |
            | QHS       | false | Medication     | Drug Name           | Erytro      | Unit 3 | Room 1, Room 2 | Time Range | 10:46 AM  | 10:48 AM |      | 5        | Months       | Every Months | 2          | 9,12,16,23 | Apr    | Days of the Week | Mon         | 2nd          |
        Then User wait for synchronization
        Then User types "Erytro" character in text field
        When User clicks the first Administration Schedule
        Then User verifies the data with repeats as Monthly
            | frequency  | prn   | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime | EndTime  | Time | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months | Daysof           | ChooseWeeks     | WeeksOfMonth |
            | at bedtime | false | Medication     | Drug Name           | Erytro      | Unit 3 | Room 1, Room 2 | Time Range | 10:46 AM  | 10:48 AM |      | 5        | Months       | Every Months | 2          | 9,12,16,23 | Apr    | Days of the Week | Mon,Tue,Wed,Thu | 1st,2nd,3rd  |
        Then User deletes the created Admin schedule "0" from DB

    @regression @sanity 
    Scenario: Verify user is able to edit and update F&A Values when user changes from Cyclical to Monthly is selected as repeats(Also verify the repeats data is cleared)
        When User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time              | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | BID+PC    |     | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 10:46 AM,09:27 PM | 1        | Days         | Every Other Day |          |               |
        Then User types "Zyvox" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User verifies the data with repeats as Cyclical
            | frequency                   | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time              | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | 2 times per day after meals | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 10:46 AM,09:27 PM | 1        | Days         | Every Other Day |          |               |
        Then User wait for synchronization
        And User creates Admin Schedule with repeats as given "Monthly"
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime | EndTime  | Time | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months | Daysof           | ChooseWeeks | WeeksOfMonth |
            | QHS       | true | Medication     | Drug Name           | Erytro      | Unit 3 | Room 1, Room 2 | Time Range | 10:46 AM  | 10:48 AM |      | 5        | Months       | Every Months | 2          | 9,12,16,23 | Apr    | Days of the Week | Mon         | 2nd          |
        Then User wait for synchronization
        Then User types "Erytro" character in text field
        When User clicks the first Administration Schedule
        Then User verifies the data with repeats as Monthly
            | frequency  | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime | EndTime  | Time | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months | Daysof           | ChooseWeeks | WeeksOfMonth |
            | at bedtime | true | Medication     | Drug Name           | Erytro      | Unit 3 | Room 1, Room 2 | Time Range | 10:46 AM  | 10:48 AM |      | 5        | Months       | Every Months | 2          | 9,12,16,23 | Apr    | Days of the Week | Mon         | 2nd          |
        Then User deletes the created Admin schedule "0" from DB

    @regression @sanity 
    Scenario: Verify user is able to edit and update F&A Values when user changes from Weekly to Daily is selected as repeats(Also verify the repeats data is cleared)
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Weekly"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime | EndTime  | Time | Duration | DurationType | EveryWeek | ChooseDays |
            | QD+AC     |     | Medication     | Drug Name           | Tyzeka      | Unit 1 | Room 1, Room 2 | Time Range | 10:46 AM  | 10:48 AM |      | 1        | Weeks        | 2         | Wed,Sun    |
        Then User types "Tyzeka" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User verifies the data with repeats as Weekly
            | frequency               | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime | EndTime  | Time | Duration | DurationType | EveryWeek | ChooseDays |
            | once daily before meals | Medication     | Drug Name           | Tyzeka      | Unit 1 | Room 1, Room 2 | Time Range | 10:46 AM  | 10:48 AM |      | 1        | Weeks        | 2         | Wed,Sun    |
        And User creates Admin Schedule with repeats as given "Daily"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime                           | EndTime                             | Time | Duration | DurationType |
            | QID       |     | Medication     | Drug Name           | Tyzeka      | Unit 2 | Room 2, Room 3 | Time Range | 08:45 AM,10:46 AM,09:27 PM,10:23 PM | 08:46 AM,10:47 AM,09:29 PM,10:25 PM |      | 5        | Weeks        |
        Then User types "Tyzeka" character in text field
        When User clicks the first Administration Schedule
        Then User verifies the data with repeats as Daily
            | frequency       | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime                           | EndTime                             | Time | Duration | DurationType |
            | 4 times per day | Medication     | Drug Name           | Tyzeka      | Unit 2 | Room 2, Room 3 | Time Range | 08:45 AM,10:46 AM,09:27 PM,10:23 PM | 08:46 AM,10:47 AM,09:29 PM,10:25 PM |      | 5        | Weeks        |
        Then User deletes the created Admin schedule "0" from DB

    @regression @sanity 
    Scenario: Verify changes are not updated when user clicks on cancel button
        When User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time              | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | BID+AC    |     | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 10:46 AM,09:27 PM | 1        | Days         | Every Other Day |          |               |
        Then User types "Zyvox" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User verifies the data with repeats as Cyclical
            | frequency                    | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time              | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | 2 times per day before meals |     | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 10:46 AM,09:27 PM | 1        | Days         | Every Other Day |          |               |
        Then User wait for synchronization
        And User creates Admin Schedule with repeats "Monthly" but does not save
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime | EndTime  | Time | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months | Daysof           | ChooseWeeks | WeeksOfMonth |
            | QID       | true | Medication     | Drug Name           | Erytro      | Unit 2 | Room 1, Room 2 | Time Range | 10:46 AM  | 10:48 AM |      | 5        | Months       | Every Months | 2          | 9,12,16,23 | Apr    | Days of the Week | Tue,Wed,Thu | 3rd          |
        And the user clicks on "Cancel" button
        Then the user verifies " Cancel Schedule" is visible
        Then the user verifies "Are you sure you want to cancel this schedule entry?" is visible
        And the user verifies "All unsaved changes will be lost." is visible
        And the user clicks on "Yes" button
        And user is navigated to "Administration Schedule Library" page
        Then User types "Zyvox" character in text field
        When User clicks the first Administration Schedule
        Then User verifies the data with repeats as Cyclical
            | frequency                    | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time              | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | 2 times per day before meals | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 10:46 AM,09:27 PM | 1        | Days         | Every Other Day |          |               |
        Then User deletes the created Admin schedule "0" from DB

    @regression @sanity @notfixed #this needs Monthly UI scripts need to be fixed VINUTHA
    Scenario: Verify changes are not updated when user clicks on refresh button (user has updated the form)
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                                | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | QID+AC+HQ |     | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 08:45 AM,10:46 AM,09:27 PM,10:23 PM | 1        | Days         | Every Other Day |          |               |
        Then User types "Zyvox" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User verifies the data with repeats as Cyclical
            | frequency                                  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                                | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | 4 times per day after meals and at bedtime | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 08:45 AM,10:46 AM,09:27 PM,10:23 PM | 1        | Days         | Every Other Day |          |               |
        Then User wait for synchronization
        And User creates Admin Schedule with repeats "Monthly" but does not save
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime                                             | EndTime  | Time | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months | Daysof           | ChooseWeeks | WeeksOfMonth |
            | 6XD       | true | Medication     | Drug Name           | Erytro      | Unit 2 | Room 1, Room 2 | Time Range | 10:46 AM,08:45 AM,10:47 AM,09:27 PM,10:23 PM,10:25 PM | 10:48 AM |      | 5        | Months       | Every Months | 2          | 9,12,16,23 | Apr    | Days of the Week | Tue,Wed,Thu | 3rd          |
        Then the user refreshes the page
        Then User verifies the data with repeats as Cyclical
            | frequency                                  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                                | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | 4 times per day after meals and at bedtime | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 08:45 AM,10:46 AM,09:27 PM,10:23 PM | 1        | Days         | Every Other Day |          |               |
        Then User deletes the created Admin schedule "0" from DB

    @regression @sanity
    Scenario: Verify same data appears on refresh on Update F&A screen (user has not updated the form) Then user click on "Add Schedule" button
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                                         | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | 5XD       |     | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 10:46 AM,09:27 PM,10:47 AM,09:29 PM,10:23 PM | 1        | Days         | Every Other Day |          |               |
        Then User types "Zyvox" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User verifies the data with repeats as Cyclical
            | frequency       | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                                         | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | 5 times per day | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 10:46 AM,09:27 PM,10:47 AM,09:29 PM,10:23 PM | 1        | Days         | Every Other Day |          |               |
        Then User wait for synchronization
        Then the user refreshes the page
        Then User verifies the data with repeats as Cyclical
            | frequency       | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                                         | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | 5 times per day | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 10:46 AM,09:27 PM,10:47 AM,09:29 PM,10:23 PM | 1        | Days         | Every Other Day |          |               |
        Then User deletes the created Admin schedule "0" from DB

    @regression @sanity
    Scenario: Verify the validation messages for mandatory fields
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                                         | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | 5XD       |     | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 10:46 AM,09:27 PM,10:47 AM,09:29 PM,10:23 PM | 1        | Days         | Every Other Day |          |               |
        Then User types "Zyvox" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url

        When user selects "Medication" from Order Type dropdown
        Then user search and select from DrugName dropdown
        Then user click on X Button on Drugname drop down
        Then validation should "be" displayed "Drug name is required."
        Then "Drug Name" label should "be" highlighted with red border
        Then user search and select from DrugName dropdown

        When user selects "Medication" from Order Type dropdown
        When user selects "Medication Group" from Medication Type dropdown
        Then the user clicks on "Save" button
        Then validation should "be" displayed "Medication group is required."
        Then user search and select from Medication Group dropdown

        When user selects Frequency "QD" from dropdown
        Then user click on x Button on freqency
        Then "Frequency" label should "be" highlighted with red border
        Then validation should "be" displayed "Frequency is required."
        When user selects Frequency "QD" from dropdown

        Then user selects value "Days" from dropdown field
        Then user selects value "1" from Duration dropdown field
        Then user click on X Button on Duration Type field
        Then "Duration Type " label should "be" highlighted with red border
        Then validation should "be" displayed "Duration Type is required."

        Then user selects Repeats tab "Weekly"
        Then user choose "Tue" in Frequency and Administration
        Then user choose "Tue" in Frequency and Administration
        Then validation should "be" displayed "Days is required."

        Then user selects Repeats tab "Monthly"
        Then user choose "4" in Frequency and Administration
        Then user choose "4" in Frequency and Administration
        Then validation should "be" displayed "Dates is required."

        Then user selects "Days of the Week" on Repeat tab
        Then user click on Days drop down in Every Months Tab
        Then user choose "Tue" in Frequency and Administration
        Then user choose "Tue" in Frequency and Administration
        Then user click on Days drop down in Every Months Tab
        Then validation should "be" displayed "Days is required."
        Then Days label should be highlighted with red color

        Then user selects Repeats tab "Monthly"
        Then user clicks on "Select Months" tab
        Then user clicks on Select Months dropdown
        Then user choose "Mar" in Frequency and Administration
        Then user choose "Mar" in Frequency and Administration
        Then user clicks on Select Months dropdown
        Then validation should "be" displayed "Months is required."

        When user selects Frequency "TID" from dropdown
        Then user enters same values for two time fields
        Then the user clicks on "Save" button
        Then validation should "be" displayed "Time is required."

        Then user enter valid value in 3rd time field
        Then the user clicks on "Save" button
        Then validation should "be" displayed "Time should be unique."
        Then User deletes the created Admin schedule "0" from DB

    @regression @sanity @notfixed
    Scenario Outline: Verify Reset option for switching between two sections on Daily
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                                         | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | 5XD       | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 10:46 AM,09:27 PM,10:47 AM,09:29 PM,10:23 PM | 1        | Days         | Every Other Day |          |               |
        Then User types "Zyvox" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url

        When user selects Frequency "QD" from dropdown
        Then user enters "10:45 AM" in Time field
        Then user selects value "Days" from dropdown field
        Then user selects value "1" from Duration dropdown field
        When user selects Frequency "BID" from dropdown
        Then verifies Time fields should be blank
        Then "Duration" Field should be blank
        Then "Duration Type" Field should be blank
        Then user selects value "Days" from dropdown field
        Then user selects value "1" from Duration dropdown field
        And user clicks on "Monthly" button
        And user clicks on "Daily" button
        Then "Duration" Field should be blank
        Then "Duration Type" Field should be blank
        Then user enters "10:45 AM" in Time field
        And user click on "Time Range" radio Button
        And user click on "Specific Time" radio Button
        Then verifies Time fields should be blank
        Then user selects value "Days" from dropdown field
        Then user selects value "1" from Duration dropdown field
        Then user click on X Button on Duration Type field
        Then "Duration Type " label should "be" highlighted with red border
        Then validation should "be" displayed "Duration Type is required."
        And user clicks on "Monthly" button
        And user clicks on "Daily" button
        Then validation should " not be" displayed "Duration Type is required."
        Then User deletes the created Admin schedule "0" from DB

    @regression @sanity
    Scenario Outline: Verify Reset option for switching between two sections on Cyclical
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Weekly"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime | EndTime  | Time | Duration | DurationType | EveryWeek | ChooseDays |
            | QD+AC     |     | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Time Range | 10:46 AM  | 10:48 AM |      | 1        | Weeks        | 2         | Mon,Tue    |
        Then User types "Zyvox" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url

        When user selects Frequency "QD" from dropdown
        And user clicks on "Cyclical" button
        Then "Duration" Field should be blank
        Then "Duration Type" Field should be blank
        Then verifies Time fields should be blank
        And user click on "Time Range" radio Button
        Then "Duration" Field should be blank
        Then "Duration Type" Field should be blank
        Then user selects value "Days" from dropdown field
        Then user selects value "1" from Duration dropdown field
        And user click on "Specific Cycle" radio Button
        And user click on "Specific Time" radio Button
        Then "Duration" Field should be blank
        Then "Duration Type" Field should be blank
        Then user enters "10:45 AM" in Time field
        Then user selects value "Days" from dropdown field
        Then user selects value "1" from Duration dropdown field
        And user clicks on "Monthly" button
        Then "Duration" Field should be blank
        Then "Duration Type" Field should be blank
        Then user selects value "Days" from dropdown field
        Then user selects value "1" from Duration dropdown field
        Then user click on X Button on Duration Type field
        Then "Duration Type " label should "be" highlighted with red border
        Then validation should "be" displayed "Duration Type is required."
        And user clicks on "Monthly" button
        And user clicks on "Cyclical" button
        Then validation should " not be" displayed "Duration Type is required."
        Then User deletes the created Admin schedule "0" from DB

    @regression @sanity
    Scenario Outline: Verify Reset option for switching between two sections on Weekly
        Then user click on "Add Schedule" button
        When user selects Frequency "QD" from dropdown
        And user clicks on "Weekly" button
        Then "Duration" Field should be blank
        Then "Duration Type" Field should be blank
        Then verifies Time fields should be blank
        Then user enters "10:45 AM" in Time field
        Then User selects "Sun" from Choose days
        Then user selects value "Days" from dropdown field
        Then user selects value "1" from Duration dropdown field
        And user clicks on "Monthly" button
        And user clicks on "Weekly" button
        Then "Duration" Field should be blank
        Then "Duration Type" Field should be blank
        Then user selects value "Days" from dropdown field
        Then user selects value "1" from Duration dropdown field
        Then user click on X Button on Duration Type field
        Then "Duration Type " label should "be" highlighted with red border
        Then validation should "be" displayed "Duration Type is required."
        And user clicks on "Monthly" button
        And user clicks on "Cyclical" button
        Then validation should " not be" displayed "Duration Type is required."


    @regression @sanity @notfixed
    Scenario Outline: Verify Reset option for switching between two sections on Monthly during edit
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                                         | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | 5XD       | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 10:46 AM,09:27 PM,10:47 AM,09:29 PM,10:23 PM | 1        | Days         | Every Other Day |          |               |
        Then User types "Zyvox" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        When user selects Frequency "QD" from dropdown
        And user clicks on "Monthly" button
        Then "Duration" Field should be blank
        Then "Duration Type" Field should be blank
        Then user choose "4" in Frequency and Administration
        Then user selects value "Months" from dropdown field
        Then user selects value "1" from Duration dropdown field
        Then user clicks on "Select Months" tab
        Then user select "Every Months" tab in Monthly
        Then "Duration" Field should be blank
        Then "Duration Type" Field should be blank
        Then user choose "4" in Frequency and Administration
        Then user choose "4" in Frequency and Administration
        Then validation should "be" displayed "Dates is required."
        Then "Dates is required." label should "be" highlighted with red color
        Then user clicks on "Select Months" tab
        Then user select "Every Months" tab in Monthly
        Then validation should "not be" displayed "Dates is required."
        Then user click on "Days of the Week" radio Button
        Then user click on Days drop down in Every Months Tab
        Then user choose "Tue" in Frequency and Administration
        Then user clicks on Weeks of the Month drop down in Every Months Tab
        Then user choose "1st" in Frequency and Administration
        Then user selects value "Months" from dropdown field
        Then user selects value "1" from Duration dropdown field
        Then user click on "Days of the Month" radio Button
        Then user click on "Days of the Week" radio Button
        Then "Duration" Field should be blank
        Then "Duration Type" Field should be blank
        Then user click on Days drop down in Every Months Tab
        Then user choose "Tue" in Frequency and Administration
        Then user choose "Tue" in Frequency and Administration
        Then user click on Days drop down in Every Months Tab
        Then validation should "be" displayed "Days is required."
        Then user click on "Days of the Month" radio Button
        Then user click on "Days of the Week" radio Button
        Then validation should "not be" displayed "Days is required."
        Then user clicks on "Select Months" tab
        Then user clicks on Select Months dropdown
        Then user choose "Jun" in Frequency and Administration
        Then user select "Every Months" tab in Monthly
        Then user clicks on "Select Months" tab
        Then user clicks on Select Months dropdown
        Then user checks "Jun" should be not selected
        Then User deletes the created Admin schedule "0" from DB

    @regression
    Scenario Outline: Verify data is coming correctly in the presets tab
        Then User deletes the created Admin schedule "1" from DB
        Then user creates multiple records for FAS through API
        Then user click on "Add Schedule" button
        Then user selects "<frequency>"
        Then user clicks on preset Tab
        And verifies the "created" list of records present in Administration schedule table as per the selected "<frequency>"
        Examples:
            | frequency |
            | QD        |
            | QD + Meal |
            | BID       |
            | TID+PC    |
            | QID+AC+HQ |
            | 5XD       |
            | 6XD       |
            | QPM       |

    @regression
    Scenario Outline: Verify data is displaying correctly in the presets tab when no frequency is selected
        Then user click on "Add Schedule" button
        Then user clicks on preset Tab
        Then presets tab should display "No matches found"

    @regression
    Scenario Outline: Verify data is displaying correctly in the presets tab during edit
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                                        | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | 5XD       |     | Medication     | Medication Group    | Antibiotics | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 0:46 AM,09:27 PM,10:47 AM,09:29 PM,10:23 PM | 1        | Days         | Every Other Day |          |               |
        Then User types "Antibiotics" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then user clicks on preset Tab
        And verifies the "edited" list of records present in Administration schedule table as per the selected "5XD"
        Then User deletes the created Admin schedule "0" from DB

    @regression
    Scenario Outline: Verify data is displaying correctly in the presets tab during edit with existing data
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                                        | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | 5XD       |     | Medication     | Medication Group    | Antianxiety | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 0:46 AM,09:27 PM,10:47 AM,09:29 PM,10:23 PM | 1        | Days         | Every Other Day |          |               |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                                        | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | 5XD       |     | Medication     | Medication Group    | Antibiotics | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 0:46 AM,09:27 PM,10:47 AM,09:29 PM,10:23 PM | 1        | Days         | Every Other Day |          |               |
        Then User types "Antibiotics" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then user clicks on preset Tab
        And verifies the "edited" list of records present in Administration schedule table as per the selected "5XD"
        Then User deletes the created Admin schedule "0" from DB

    @regression
    Scenario Outline: Verify Medication, All in summary page when select Blank value on Medication Type
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        When user selects Frequency "QD" from dropdown
        When user selects "Medication" from Order Type dropdown
        Then user verifies the list of Medication Type dropdown
        Then user enters "10:45 AM" in Time field
        Then user selects value "Days" from dropdown field
        Then user selects value "1" from Duration dropdown field
        Then the user clicks on "Save" button
        Then the user sees the message "Administration Schedule saved successfully."
        Then user verify data of "Medication, All" in summary grid
        Then User verifies saved value for OrdeTypeDropdown "0" in database

    @regression
    Scenario Outline: Verify user is not able to add Duplicate record for Frequency And Admin Schedule for Daily
        When User deletes the created Admin schedule "1" from DB
        When user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Daily"
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit           | Room                                   | ChooseTime    | StartTime | EndTime | Time                                                  | Duration | DurationType |
            | 6XD       | true | Medication     | Drug Name           | zyvox       | Unit 1, Unit 2 | Room 1, Room 2, Room 3; Room 1, Room 2 | Specific Time |           |         | 10:42 AM,10:53 AM,11:02 AM,11:45 AM,08:59 PM,09:21 PM | 1        | Days         |
        Then the user sees the message "Administration Schedule saved successfully."
        When user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Daily"
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit           | Room                                   | ChooseTime    | StartTime | EndTime | Time                                                  | Duration | DurationType |
            | 6XD       | true | Medication     | Drug Name           | zyvox       | Unit 1, Unit 2 | Room 1, Room 2, Room 3; Room 1, Room 2 | Specific Time |           |         | 10:42 AM,10:53 AM,11:02 AM,11:45 AM,08:59 PM,09:21 PM | 1        | Days         |
        Then user verifies the Duplicate error message "The administration schedule already exists. The schedule must be unique." is visible
        Then user updates the data and make the record unique and save
            | DurationType |
            | Weeks        |
        Then the user sees the message "Administration Schedule saved successfully."

    @regression
    Scenario Outline: Verify user is not able to add Duplicate record for Frequency And Admin Schedule for Cyclical
        When User deletes the created Admin schedule "1" from DB
        When user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency   | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime                           | EndTime                             | Time | Duration | DurationType | CycleType   | GiveDays | DonotGiveDays |
            | QID+Meal+HQ |     | Medication     | Drug Name           | zyvox       | Unit 2 | Room 1, Room 2 | Time Range | 10:00 AM,11:00 AM,12:00 PM,01:00 PM | 11:00 AM,12:00 PM,01:00 PM,02:00 PM |      | 5        | Weeks        | Custom Days | 5        | 8             |
        Then the user sees the message "Administration Schedule saved successfully."
        When user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency   | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime                           | EndTime                             | Time | Duration | DurationType | CycleType   | GiveDays | DonotGiveDays |
            | QID+Meal+HQ |     | Medication     | Drug Name           | zyvox       | Unit 2 | Room 1, Room 2 | Time Range | 10:00 AM,11:00 AM,12:00 PM,01:00 PM | 11:00 AM,12:00 PM,01:00 PM,02:00 PM |      | 5        | Weeks        | Custom Days | 5        | 8             |
        Then user verifies the Duplicate error message "The administration schedule already exists. The schedule must be unique." is visible
        Then user updates the data and make the record unique and save
            | DurationType |
            | Days         |
        Then the user sees the message "Administration Schedule saved successfully."

    @regression
    Scenario Outline: Verify user is not able to add Duplicate record for Frequency And Admin Schedule for Weekly
        When User deletes the created Admin schedule "1" from DB
        When user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Weekly"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit                   | Room                                                                  | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | EveryWeek | ChooseDays |
            | QShift    |     | Medication     | Drug Name           | Tyzeka      | Unit 1, Unit 2, Unit 3 | Room 1, Room 2, Room 3, Room 4; Room 1, Room 2, Room 3;Room 1, Room 2 | Specific Time |           |         | 12:00 PM | 1        | Days         | 2         | Mon        |
        Then the user sees the message "Administration Schedule saved successfully."
        When user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Weekly"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit                   | Room                                                                  | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | EveryWeek | ChooseDays |
            | QShift    |     | Medication     | Drug Name           | Tyzeka      | Unit 1, Unit 2, Unit 3 | Room 1, Room 2, Room 3, Room 4; Room 1, Room 2, Room 3;Room 1, Room 2 | Specific Time |           |         | 12:00 PM | 1        | Days         | 2         | Mon        |
        Then user verifies the Duplicate error message "The administration schedule already exists. The schedule must be unique." is visible
        Then user updates the data and make the record unique and save
            | DurationType |
            | Weeks        |
        Then the user sees the message "Administration Schedule saved successfully."

    @regression
    Scenario Outline: Verify user is not able to add Duplicate record for Frequency And Admin Schedule for Monthly
        When User deletes the created Admin schedule "1" from DB
        When user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Monthly"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit                   | Room                                                                  | ChooseTime | StartTime                           | EndTime                             | Time | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months  | Daysof           | ChooseWeeks | WeeksOfMonth |
            | QID       |     | Medication     | Drug Name           | Zyvit       | Unit 1, Unit 2, Unit 3 | Room 1, Room 2, Room 3, Room 4; Room 1, Room 2, Room 3;Room 1, Room 2 | Time Range | 10:45 AM,09:20 PM,09:23 PM,09:24 PM | 10:46 AM,09:21 PM,09:24 PM,09:25 PM |      | 5        | Months       | Every Months | 2          | 3,4,8      | Jun,Apr | Days of the Week | Tue,Wed,Thu | 1st          |
        Then the user sees the message "Administration Schedule saved successfully."
        When user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Monthly"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit                   | Room                                                                  | ChooseTime | StartTime                           | EndTime                             | Time | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months  | Daysof           | ChooseWeeks | WeeksOfMonth |
            | QID       |     | Medication     | Drug Name           | Zyvit       | Unit 1, Unit 2, Unit 3 | Room 1, Room 2, Room 3, Room 4; Room 1, Room 2, Room 3;Room 1, Room 2 | Time Range | 10:45 AM,09:20 PM,09:23 PM,09:24 PM | 10:46 AM,09:21 PM,09:24 PM,09:25 PM |      | 5        | Months       | Every Months | 2          | 3,4,8      | Jun,Apr | Days of the Week | Tue,Wed,Thu | 1st          |
        Then user verifies the Duplicate error message "The administration schedule already exists. The schedule must be unique." is visible
        Then user selects value "1" from Duration dropdown field
        Then the user sees the message "Administration Schedule saved successfully."

    @regression
    Scenario Outline: Verify user is not able to add Duplicate record after editing Frequency And Admin Schedule for Daily
        When User deletes the created Admin schedule "1" from DB
        When user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Weekly"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit                   | Room                                                                  | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | EveryWeek | ChooseDays  |
            | QShift    |     | Medication     | Drug Name           | Tyzeka      | Unit 1, Unit 2, Unit 3 | Room 1, Room 2, Room 3, Room 4; Room 1, Room 2, Room 3;Room 1, Room 2 | Specific Time |           |         | 12:00 PM | 1        | Weeks        | 2         | Wed,Sun,Tue |
        Then the user sees the message "Administration Schedule saved successfully."
        When user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Weekly"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit                   | Room                                                                  | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | EveryWeek | ChooseDays  |
            | QShift    |     | Medication     | Drug Name           | Tyzeka      | Unit 1, Unit 2, Unit 3 | Room 1, Room 2, Room 3, Room 4; Room 1, Room 2, Room 3;Room 1, Room 2 | Specific Time |           |         | 12:00 PM | 1        | Weeks        | 2         | Wed,Sun,Tue |
        Then user verifies the Duplicate error message "The administration schedule already exists. The schedule must be unique." is visible

    @regression
    Scenario Outline: Verify user is not able to add Duplicate record after editing Frequency And Admin Schedule for Cyclical
        When User deletes the created Admin schedule "1" from DB
        When user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency   | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime                           | EndTime                             | Time | Duration | DurationType | CycleType   | GiveDays | DonotGiveDays |
            | QID+Meal+HQ |     | Medication     | Drug Name           | zyvox       | Unit 2 | Room 1, Room 2 | Time Range | 10:00 AM,11:00 AM,12:00 PM,01:00 PM | 11:00 AM,12:00 PM,01:00 PM,02:00 PM |      | 5        | Weeks        | Custom Days | 5        | 8             |
        Then the user sees the message "Administration Schedule saved successfully."
        When user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency   | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime                           | EndTime                             | Time | Duration | DurationType | CycleType   | GiveDays | DonotGiveDays |
            | QID+Meal+HQ |     | Medication     | Drug Name           | zyvox       | Unit 2 | Room 1, Room 2 | Time Range | 10:00 AM,11:00 AM,12:00 PM,01:00 PM | 11:00 AM,12:00 PM,01:00 PM,02:00 PM |      | 5        | Days         | Custom Days | 5        | 8             |
        Then the user sees the message "Administration Schedule saved successfully."
        Then User types "zyvox" character in text field
        When User clicks the first Administration Schedule
        Then user updates the data and make the record unique and save
            | DurationType |
            | Days         |
        Then user verifies the Duplicate error message "The administration schedule already exists. The schedule must be unique." is visible

    @regression
    Scenario Outline: Verify user is able to search with one or more characters
        When User deletes the created Admin schedule "1" from DB
        When user creates multiple records for FAS through API
        Then user search for following name "A"
        Then user verifies that search didn't happen with single character
        Then user search for following name "wi"
        Then searched result should contain "wi" in the FAS table
        Then user search for following name "Astroglide"
        Then searched result should contain "Astroglide" in the FAS table

    @regression
    Scenario Outline: Verify presets tab functionalties for duplicate records
        When User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Daily"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | BID       |     | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Time Range | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 10:42 AM,09:21 PM | 1        | Days         |
        Then user click on "Add Schedule" button
        Then user selects "BID"
        Then user clicks on preset Tab
        And user waits
        Then user click on Hyperlink
        Then User select the Ordertype,Medication Type,Drug Name, Assigned To
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           |
            | BID       |     | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 |
        Then User verifies the data with repeats as Daily
            | frequency       | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | 2 times per day | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Time Range | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 10:42 AM,09:21 PM | 1        | Days         |
        Then the user clicks on "Save" button
        Then user verifies the Duplicate error message "The administration schedule already exists. The schedule must be unique." is visible

    @regression
    Scenario Outline: Verify presets tab functionalties for fresh Records
        When User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Weekly"
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType | EveryWeek | ChooseDays |
            | BID       | true | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Time Range | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 10:42 AM,09:21 PM | 1        | Weeks        | 2         | Mon        |
        Then user click on "Add Schedule" button
        Then user selects "BID"
        Then user clicks on preset Tab
        Then user click on Hyperlink
        Then User verifies the data with repeats as Weekly
            | frequency       | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit | Room | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType | EveryWeek | ChooseDays |
            | 2 times per day | true |                |                     |             |      |      | Time Range | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 10:42 AM,09:21 PM | 1        | Weeks        | 2         | Mon        |
        And User creates Admin Schedule with repeats as given "Daily"
            | frequency | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | BID       | Medication     | Drug Name           | Sayman Aloe | Unit 1 | Room 1, Room 2 | Time Range | 10:45 AM,09:25 PM | 10:48 AM,09:29 PM | 10:42 AM,09:21 PM | 1        | Months       |
        Then the user clicks on "Save" button
        Then the user sees the message "Administration Schedule saved successfully."
        Then User types "Sayman Aloe" character in text field
        When User clicks the first Administration Schedule
        Then User verifies the data with repeats as Daily
            | frequency       | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | 2 times per day | Medication     | Drug Name           | Sayman Aloe | Unit 1 | Room 1, Room 2 | Time Range | 10:45 AM,09:25 PM | 10:48 AM,09:29 PM | 10:42 AM,09:21 PM | 1        | Months       |
        And the user clicks on "Cancel" button
        Then User types "Zyvox" character in text field
        When User clicks the first Administration Schedule
        Then User verifies the data with repeats as Daily
            | frequency       | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType | EveryWeek | ChooseDays |
            | 2 times per day | true | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Time Range | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 10:42 AM,09:21 PM | 1        | Weeks        | 2         | Mon        |

    @regression
    Scenario Outline: Verify presets tab functionalties for Exist Records
        When User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Daily"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | BID       |     | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Time Range | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 10:42 AM,09:21 PM | 1        | Days         |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Daily"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | BID       |     | Medication     | Drug Name           | Sween       | Unit 2 | Room 2, Room 3 | Time Range | 10:50 AM,09:25 PM | 10:50 AM,09:28 PM | 10:45 AM,09:29 PM | 1        | Months       |
        Then User types "Sween" character in text field
        When User clicks the first Administration Schedule
        Then user clicks on preset Tab
        Then user click on Hyperlink
        Then User verifies the data with repeats as Daily
            | frequency       | prn | orderTypeValue | medicationTypeValue | searchQuery      | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | 2 times per day |     | Medication     | Drug Name           | Sween Kind Touch | Unit 2 | Room 2, Room 3 | Time Range | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 10:42 AM,09:21 PM | 1        | Days         |
        And User creates Admin Schedule with repeats as given "Daily"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room   | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | BID       |     | Medication     | Drug Name           | Qelbree     | Unit 1 | Room 2 | Time Range | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 10:42 AM,09:21 PM | 1        | Weeks        |
        Then the user clicks on "Save" button
        Then the user sees the message "Administration Schedule saved successfully."
        Then User types "Qelbree" character in text field
        When User clicks the first Administration Schedule
        Then User verifies the data with repeats as Daily
            | frequency       | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room   | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | 2 times per day | prn | Medication     | Drug Name           | Qelbree     | Unit 1 | Room 2 | Time Range | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 10:42 AM,09:21 PM | 1        | Weeks        |
        And the user clicks on "Cancel" button
        Then User types "Zyvox" character in text field
        When User clicks the first Administration Schedule
        Then User verifies the data with repeats as Daily
            | frequency       | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | 2 times per day |     | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Time Range | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 10:42 AM,09:21 PM | 1        | Days         |

    @regression
    Scenario Outline: Verify data should not reset when switch to Custom tab to Preset tab
        When User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Daily"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | BID       |     | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Time Range | 10:47 AM,09:21 PM | 10:55 AM,09:24 PM | 10:42 AM,09:21 PM | 1        | Days         |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Daily"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room   | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | BID       |     | Medication     | Drug Name           | Qelbree     | Unit 1 | Room 1 | Time Range | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 10:48 AM,09:25 PM | 1        | Days         |
        Then User types "Zyvox" character in text field
        When User clicks the first Administration Schedule
        Then user clicks on preset Tab
        Then user click on Hyperlink
        Then user selects value "Months" from dropdown field
        Then user clicks on preset Tab
        Then user click on Custom Tab
        Then User verifies the data with repeats as Daily
            | frequency       | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | 2 times per day |     | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Time Range | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 10:48 AM,09:25 PM | 1        | Months       |

    @regression
    Scenario Outline: Verify user is redirected to Administration Schedule Library list page after user confirms the Cancel operation for new record
        When User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        When user selects Frequency "QD" from dropdown
        Then verify user "is" able to select values in "Duration" text field
            | positiveValues |
            | <Duration>     |
        Then user selects value "<Duration Type>" from dropdown field
        And the user clicks on "Cancel" button
        Then the user verifies " Cancel Schedule" is visible
        Then the user verifies "Are you sure you want to cancel this schedule entry?" is visible
        And the user verifies "All unsaved changes will be lost." is visible
        And the user clicks on "Yes" button
        And user verifies that there is no record present in list page
        Examples:
            | Duration | Duration Type |
            | 4        | Days          |

    @regression
    Scenario Outline: Verify user is redirected to Administration Schedule Library list page after user confirms the Cancel operation for preset new record
        When User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Weekly"
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType | EveryWeek | ChooseDays |
            | BID       | true | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Time Range | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 10:42 AM,09:21 PM | 1        | Weeks        | 2         | Mon        |
        Then user click on "Add Schedule" button
        Then user selects "BID"
        Then user clicks on preset Tab
        Then user click on Hyperlink
        Then verify user "is" able to select values in "Duration" text field
            | positiveValues |
            | <Duration>     |
        Then user selects value "<Duration Type>" from dropdown field
        And the user clicks on "Cancel" button
        Then the user verifies " Cancel Schedule" is visible
        Then the user verifies "Are you sure you want to cancel this schedule entry?" is visible
        And the user verifies "All unsaved changes will be lost." is visible
        And the user clicks on "Yes" button
        And user is navigated to "Administration Schedule Library" page
        Then User types "83" character in text field
        And user verifies that there is no record present in list page
        Examples:
            | Duration | Duration Type |
            | 83       | Months        |

    @regression
    Scenario Outline: Verify user is redirected to Administration Schedule Library list page after user confirms the Cancel operation for preset Exist records
        When User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Daily"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | BID       |     | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Time Range | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 10:42 AM,09:21 PM | 1        | Days         |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Daily"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | BID       |     | Medication     | Drug Name           | Sween       | Unit 2 | Room 2, Room 3 | Time Range | 10:50 AM,09:25 PM | 10:50 AM,09:28 PM | 10:45 AM,09:29 PM | 1        | Months       |
        Then User types "Sween" character in text field
        When User clicks the first Administration Schedule
        Then user clicks on preset Tab
        Then user click on Hyperlink
        Then verify user "is" able to select values in "Duration" text field
            | positiveValues |
            | <Duration>     |
        Then user selects value "<Duration Type>" from dropdown field
        And the user clicks on "Cancel" button
        Then the user verifies " Cancel Schedule" is visible
        Then the user verifies "Are you sure you want to cancel this schedule entry?" is visible
        And the user verifies "All unsaved changes will be lost." is visible
        And the user clicks on "Yes" button
        And user is navigated to "Administration Schedule Library" page
        Then User types "93" character in text field
        And user verifies that there is no record present in list page
        Examples:
            | Duration | Duration Type |
            | 93       | Months        |

    @regression
    Scenario Outline: Verify user is able to see required and invalid error messages for all the time fields for Specific Time
        When user click on "Add Schedule" button
        When user selects Frequency "<frequency>" from dropdown
        Then user focus and defocus all the specific Time fields and verify "Required" error message
        Then user focus and defocus all the specific Time fields and verify "Invalid" error message
        Examples:
            | frequency |
            | BID       |
            | TID       |
            | 6XD       |

    @regression
    Scenario Outline: Verify user is able to see duplicate error messages for all the time fields for Specific Time
        When user click on "Add Schedule" button
        When user selects Frequency "<frequency>" from dropdown
        Then user focus and defocus all the specific Time fields and verify duplicate error message
        Examples:
            | frequency |
            | BID       |
            | TID       |
            | 6XD       |

    @regression
    Scenario Outline: Verify user is able to see required and invalid error messages for all the time fields for Time Range
        When user click on "Add Schedule" button
        When user selects Frequency "<frequency>" from dropdown
        When user select Time Range radio button
        Then user focus and defocus all the Time Range fields and verify "Required" error message
        Then user focus and defocus all the Time Range fields and verify "Invalid" error message
        Examples:
            | frequency |
            | BID       |
            | TID       |
            | 6XD       |

    @regression
    Scenario Outline: Verify user is able to see duplicate error messages for all the time fields for Time Range
        When user click on "Add Schedule" button
        When user selects Frequency "<frequency>" from dropdown
        When user select Time Range radio button
        Then user focus and defocus all the Time Range fields and verify duplicate error message
        Examples:
            | frequency |
            | BID       |
            | TID       |
            | 6XD       |

    @regression
    Scenario Outline: Verify Daily Summary Field
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Daily"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery   | Unit   | Room   | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <searchQuery> | <Unit> | <Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> |
        Then User types "zyvox" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then user verifies the summary description for "Daily" summary fields
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery   | Unit   | Room   | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <searchQuery> | <Unit> | <Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> |
        Then User deletes the created Admin schedule "0" from DB
        Examples:
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime         | EndTime           | Time     | Duration | DurationType |
            | QD        | true | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Specific Time | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 09:00 AM | 10       | Days         |
            | QD        |      | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Time Range    | 10:45 AM          | 10:46 AM          | 09:00 AM | 10       | Days         |

    @regression
    Scenario Outline: Verify Cyclical Summary Field
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Cyclical"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery   | Unit   | Room   | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | CycleType   | GiveDays   | DonotGiveDays   |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <searchQuery> | <Unit> | <Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <CycleType> | <GiveDays> | <DonotGiveDays> |
        Then User types "<searchQuery>" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then user verifies the summary description for "Cyclical" summary fields
            | frequency   | orderTypeValue   | medicationTypeValue   | searchQuery   | Unit   | Room   | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | CycleType   | GiveDays   | DonotGiveDays   |
            | <frequency> | <orderTypeValue> | <medicationTypeValue> | <searchQuery> | <Unit> | <Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <CycleType> | <GiveDays> | <DonotGiveDays> |
        Then User deletes the created Admin schedule "0" from DB
        Examples:
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime                                    | EndTime                                      | Time                                         | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | QID+PC+HQ |     | Medication     | Medication Group    | Statins     | Unit 2 | Room 1, Room 2 | Specific Time |                                              |                                              | 09:00 AM,12:00 PM,03:00 PM,06:00 PM          | 25       | Days         | Custom Days     | 4        | 6             |
            | 5XD       |     | Medication     | Medication Group    | Statins     | Unit 2 | Room 1, Room 2 | Specific Time |                                              |                                              | 09:00 AM,12:00 PM,03:00 PM,06:00 PM,09:00 PM | 2        | Weeks        | Every Other Day | 4        | 6             |
            | QPM       |     | Medication     | Medication Group    | Statins     | Unit 2 | Room 1, Room 2 | Specific Time |                                              |                                              | 06:00 PM                                     | 10       | Months       | Even Dates      | 4        | 6             |
            | TID+Meal  |     | Medication     | Medication Group    | Statins     | Unit 2 | Room 1, Room 2 | Specific Time |                                              |                                              | 09:00 AM,12:00 PM,03:00 PM                   | 4        | Weeks        | Odd Dates       | 4        | 6             |
            | QID+PC+HQ |     | Medication     | Medication Group    | Statins     | Unit 2 | Room 1, Room 2 | Time Range    | 09:00 AM,12:00 PM,03:00 PM,06:00 PM          | 11:00 AM,01:00 PM,05:00 PM,08:00 PM          |                                              | 25       | Days         | Custom Days     | 4        | 6             |
            | 5XD       |     | Medication     | Medication Group    | Statins     | Unit 2 | Room 1, Room 2 | Time Range    | 09:00 AM,12:00 PM,03:00 PM,06:00 PM,09:00 PM | 11:00 AM,01:00 PM,05:00 PM,08:00 PM,11:00 PM |                                              | 2        | Weeks        | Every Other Day | 4        | 6             |
            | QPM       |     | Medication     | Medication Group    | Statins     | Unit 2 | Room 1, Room 2 | Time Range    | 09:00 AM                                     | 11:00 AM                                     |                                              | 2        | Weeks        | Even Dates      | 4        | 6             |
            | TID+Meal  |     | Medication     | Medication Group    | Statins     | Unit 2 | Room 1, Room 2 | Time Range    | 09:00 AM,12:00 PM,03:00 PM                   | 11:00 AM,01:00 PM,05:00 PM                   |                                              | 4        | Weeks        | Odd Dates       | 4        | 6             |

    @regression
    Scenario Outline: Verify Weekly Summary Field
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Weekly"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery   | Unit   | Room   | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | EveryWeek   | ChooseDays   |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <searchQuery> | <Unit> | <Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <EveryWeek> | <ChooseDays> |
        Then User types "<searchQuery>" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then user verifies the summary description for "Weekly" summary fields
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery   | Unit   | Room   | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | EveryWeek   | ChooseDays   |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <searchQuery> | <Unit> | <Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <EveryWeek> | <ChooseDays> |
        Then User deletes the created Admin schedule "0" from DB
        Examples:
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime         | EndTime           | Time              | Duration | DurationType | EveryWeek | ChooseDays  |
            | BID       |     | Medication     | Medication Group    | Analgesics  | Unit 2 | Room 1, Room 2 | Specific Time |                   |                   | 09:00 AM,09:00 PM | 3        | Months       | 5         | Tue,Thu,Sat |
            | BID       |     | Medication     | Medication Group    | Analgesics  | Unit 2 | Room 1, Room 2 | Time Range    | 09:00 AM,12:00 PM | 11:00 AM,01:00 PM |                   | 3        | Months       | 5         | Tue,Thu,Sat |

    @regression
    Scenario Outline: Verify Monthly Summary Field
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Monthly"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery   | Unit   | Room   | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | TabSelection   | EveryMonth   | ChooseDays   | Months   | Daysof   | ChooseWeeks   | WeeksOfMonth   |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <searchQuery> | <Unit> | <Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <TabSelection> | <EveryMonth> | <ChooseDays> | <Months> | <Daysof> | <ChooseWeeks> | <WeeksOfMonth> |
        Then User types "<searchQuery>" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then user verifies the summary description for "Monthly" summary fields
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery   | Unit   | Room   | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | TabSelection   | EveryMonth   | ChooseDays   | Months   | Daysof   | ChooseWeeks   | WeeksOfMonth   |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <searchQuery> | <Unit> | <Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <TabSelection> | <EveryMonth> | <ChooseDays> | <Months> | <Daysof> | <ChooseWeeks> | <WeeksOfMonth> |
        Then User deletes the created Admin schedule "0" from DB
        Examples:
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime                                             | EndTime                                                  | Time                                                  | Duration | DurationType | TabSelection  | EveryMonth | ChooseDays | Months                       | Daysof            | ChooseWeeks   | WeeksOfMonth  |
            | Q3H       |     | Medication     | Drug Name           | Zyvit       | Unit 2 | Room 1, Room 2 | Specific Time |                                                       |                                                          | 09:00 AM                                              | 11       | Months       | Every Months  | 5          | 2,7        | Jun, Apr                     | Days of the Month | Tue, Wed, Thu | 1st, 3rd      |
            | QHS       |     | Medication     | Drug Name           | Zyvit       | Unit 2 | Room 1, Room 2 | Specific Time |                                                       |                                                          | 10:00 PM                                              | 11       | Months       | Every Months  | 5          | 2,7        | Jun, Apr                     | Days of the Week  | Tue, Thu      | 1st, 3rd      |
            | 6XD       |     | Medication     | Drug Name           | Zyvit       | Unit 2 | Room 1, Room 2 | Specific Time |                                                       |                                                          | 09:00 AM,11:00 AM,01:00 PM,03:00 PM,05:00 PM,07:00 PM | 30       | Months       | Select Months | 5          | 2,7        | Jan, Mar, May, Jul, Sep, Nov | Days of the Month | Tue, Thu      | 1st, 3rd      |
            | TID       |     | Medication     | Drug Name           | Zyvit       | Unit 2 | Room 1, Room 2 | Specific Time |                                                       |                                                          | 09:00 AM,11:00 AM,01:00 PM                            | 36       | Months       | Select Months | 5          | 2,14,21    | Jan, Mar, May, Jul, Sep, Nov | Days of the Week  | Tue, Thu, Sat | 1st, 3rd,Last |
            | QHS       |     | Medication     | Drug Name           | Zyvit       | Unit 2 | Room 1, Room 2 | Time Range    | 10:00 PM                                              | 11:00 PM                                                 |                                                       | 11       | Months       | Select Months | 5          | 2,7        | Apr, Jun                     | Days of the Week  | Tue, Thu      | 1st, 3rd      |
            | 6XD       |     | Medication     | Drug Name           | Zyvit       | Unit 2 | Room 1, Room 2 | Time Range    | 09:00 AM,11:00 AM,01:00 PM,03:00 PM,05:00 PM,07:00 PM | 10:00 AM,12:00 PM,02:00 PM,04:00 PM,06:00 PM,08:00 PM AM |                                                       | 30       | Months       | Select Months | 5          | 7,14,21    | Jan, Mar, May, Jul, Sep, Nov | Days of the Month | Tue, Thu      | 1st, 3rd      |
            | TID       |     | Medication     | Drug Name           | Zyvit       | Unit 2 | Room 1, Room 2 | Time Range    | 09:00 AM,11:00 AM,01:00 PM                            | 10:00 AM,12:00 PM,02:00 PM                               |                                                       | 36       | Months       | Select Months | 5          | 2,14,21    | Jan, Mar, May, Jul, Sep, Nov | Days of the Week  | Tue, Thu, Sat | 1st, 3rd,Last |

    @regression
    Scenario Outline: Verify user is not able to add Duplicate record for Frequency And Admin Schedule for Hours
        When User deletes the created Admin schedule "1" from DB
        When user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Monthly"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery   | Unit   | Room   | ChooseTime   | StartTime   | EndTime   | Time       | Duration   | DurationType   | TabSelection   | EveryMonth   | ChooseDays   | Months   | Daysof   | ChooseWeeks   | WeeksOfMonth   |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <searchQuery> | <Unit> | <Room> | <ChooseTime> | <StartTime> | <EndTime> | <Rec1Time> | <Duration> | <DurationType> | <TabSelection> | <EveryMonth> | <ChooseDays> | <Months> | <Daysof> | <ChooseWeeks> | <WeeksOfMonth> |
        Then the user sees the message "Administration Schedule saved successfully."
        When user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Monthly"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery   | Unit   | Room   | ChooseTime   | StartTime   | EndTime   | Time       | Duration   | DurationType   | TabSelection   | EveryMonth   | ChooseDays   | Months   | Daysof   | ChooseWeeks   | WeeksOfMonth   |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <searchQuery> | <Unit> | <Room> | <ChooseTime> | <StartTime> | <EndTime> | <Rec2Time> | <Duration> | <DurationType> | <TabSelection> | <EveryMonth> | <ChooseDays> | <Months> | <Daysof> | <ChooseWeeks> | <WeeksOfMonth> |
        Then user verifies the Duplicate error message "The administration schedule already exists. The schedule must be unique." is visible
        Examples:
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Rec1Time | Rec2Time | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months   | Daysof            | ChooseWeeks   | WeeksOfMonth |
            | Q6H       |     | Medication     | Drug Name           | Ddrops      | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 11:10 AM | 05:10 PM | 11       | Months       | Every Months | 5          | 2,7        | Jun, Apr | Days of the Month | Tue, Wed, Thu | 1st, 3rd     |
            | Q8H       |     | Medication     | Drug Name           | AABP        | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 1:00 AM  | 09:00 AM | 11       | Months       | Every Months | 5          | 2,7        | Jun, Apr | Days of the Month | Tue, Wed, Thu | 1st, 3rd     |
            | Q3H       |     | Medication     | Drug Name           | PruVel      | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 2:30 AM  | 05:30 AM | 11       | Months       | Every Months | 5          | 2,7        | Jun, Apr | Days of the Month | Tue, Wed, Thu | 1st, 3rd     |
            | Q4H       |     | Medication     | Drug Name           | Vraylar     | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 3:15 AM  | 07:15 AM | 11       | Months       | Every Months | 5          | 2,7        | Jun, Apr | Days of the Month | Tue, Wed, Thu | 1st, 3rd     |
            | Q2H       |     | Medication     | Drug Name           | Ddrops      | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 9:00 PM  | 11:00 PM | 11       | Months       | Every Months | 5          | 2,7        | Jun, Apr | Days of the Month | Tue, Wed, Thu | 1st, 3rd     |

    @regression
    Scenario Outline: Verify user is not able to add Duplicate record after editing Frequency And Admin Schedule for Cyclical
        When User deletes the created Admin schedule "1" from DB
        When user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Weekly"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit                   | Room                                                                  | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | EveryWeek | ChooseDays |
            | Q2H       |     | Medication     | Drug Name           | Tyzeka      | Unit 1, Unit 2, Unit 3 | Room 1, Room 2, Room 3, Room 4; Room 1, Room 2, Room 3;Room 1, Room 2 | Specific Time |           |         | 12:00 PM | 1        | Weeks        | 2         | Wed        |
        Then the user sees the message "Administration Schedule saved successfully."
        When user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Weekly"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit                   | Room                                                                  | ChooseTime    | StartTime | EndTime | Time    | Duration | DurationType | EveryWeek | ChooseDays |
            | Q2H       |     | Medication     | Drug Name           | Tyzeka      | Unit 1, Unit 2, Unit 3 | Room 1, Room 2, Room 3, Room 4; Room 1, Room 2, Room 3;Room 1, Room 2 | Specific Time |           |         | 2:30 PM | 1        | Weeks        | 2         | Wed        |
        Then the user sees the message "Administration Schedule saved successfully."
        Then User types "02:30" character in text field
        When User clicks the first Administration Schedule
        Then user enters "4:00 PM" in Start Time field
        Then the user clicks on "Save" button
        Then user verifies the Duplicate error message "The administration schedule already exists. The schedule must be unique." is visible

    @regression
    Scenario: Verify Admin schedule data is appearing for Daily in the Summary Page grid
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "Weekly"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit                   | Room                                                                  | ChooseTime    | StartTime | EndTime | Time                       | Duration | DurationType | EveryWeek | ChooseDays |
            | Q8H       |     | Medication     | Drug Name           | Tyzeka      | Unit 1, Unit 2, Unit 3 | Room 1, Room 2, Room 3, Room 4; Room 1, Room 2, Room 3;Room 1, Room 2 | Specific Time |           |         | 12:00 PM,01:00 AM,09:00 AM | 1        | Weeks        | 2         | Wed        |
        And user waits
        Then User types "Tyzeka" character in text field
        Then user verify data of all the columns in summary grid
            | frequency         | adminSchedule                                                                  | orderType                     | assignedTo                                          |
            | Q8H every 8 hours | every 8 hours on Wed every 2 weeks at 12:00 PM, 01:00 AM, 09:00 AM for 1 Weeks | Medication, Drug Name: Tyzeka | Unit 1 - All; Unit 2 - All; Unit 3 - Room 1, Room 2 |
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User deletes the created Admin schedule "0" from DB

         @regression 
    Scenario: Verify Header of Frequency Administration List
        Then Stock Medication Header should be "GM Facility A Administration Schedule List"
        Then the user refreshes the page
        Then Stock Medication Header should be "GM Facility A Administration Schedule List"
        Then User click on back Button
        And user waits
        Then User selects "Matrixcare #+ BB Administration Schedule List" from the list 
        Then Stock Medication Header should be "Matrixcare #+ BB Administration Schedule List"
