Feature:  Create Frequency And Administration

    Background: Logging into SNF and Navigating to the search page
        Given the user is logged into the SNF Url with credentials
            | username       | password   |
            | Orders_Support | Password@1 |
        When the user search for the first name "Ronald" and last name "Clark"
        And the user selects the resident with name "Clark, Ronald O" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "Tybost 150 mg tablet" in the search bar
        Then the user clicks on the medication  name
        Then the user navigates to the Order Writer Page with title "New Order"


    Scenario: Verify the UI of customize scheduling sliding page
        When user selects Frequency "QD" from dropdown in the Order Details tab
        Then the user clicks the "customize scheduling" link that navigates to customize scheduling sliding page
        When user verifies the Customize Scheduling as title is displayed
        Then user verifies that Frequency dropdown is displayed which is mandatory field
        And the Frequency ddl is selected as "QD" in the Customize Scheduling Screen
        Then user verifies that Summary is displayed with frequency details
        Then user verifies that Administration Schedule is displayed which is mandatory field
        Then user verifies "Confirm" button is displayed
        Then user verifies "Cancel" button is displayed

    Scenario: Verify the count of clock as per the selected frequency value for Specific Time on daily section
        When the user clicks the "customize scheduling" link that navigates to customize scheduling sliding page
        Then user selects Repeats tab "Daily"
        When user selects Frequency and verifies the number of Time fields in Repeats Tab
            | frequency  | count |
            | STAT       | 1     |
            | Now        | 1     |
            | X1         | 1     |
            | QD         | 1     |
            | QD         | 1     |
            | QD+PC      | 1     |
            | QD+AC      | 1     |
            | QD + Meal  | 1     |
            | BID        | 2     |
            | BID+PC     | 2     |
            | BID+AC     | 2     |
            | BID+Meal   | 2     |
            | TID        | 3     |
            | TID+PC     | 3     |
            | TID+AC     | 3     |
            | TID+Meal   | 3     |
            | QID        | 4     |
            | QID+PC     | 4     |
            | QID+AC     | 4     |
            | QID+Meal   | 4     |
            | 5XD        | 5     |
            | 6XD        | 6     |
            | QAM        | 1     |
            | QPM        | 1     |
            | QHS        | 1     |
            | every hour | 24    |
            | Q2H        | 12    |
            | Q3H        | 8     |
            | Q4H        | 6     |
            | Q6H        | 4     |
            | Q12H       | 2     |
            | Q24H       | 1     |
        Then user validate the Time field with values
            | time     | values  |
            | 200      | invalid |
            | 11,20 PM | valid   |
            | 12:20PM  | valid   |
            | 10:20 AM | valid   |
            | 01.15pm  | valid   |
            | 2;15pm   | valid   |
            | 0315pm   | valid   |
            | 22-15 pm | valid   |
            | 211PM    | invalid |
            | 0415AM   | valid   |
            | 915      | invalid |
            | 09:15am  | valid   |
            | 9$15     | invalid |
            | 1405     | valid   |
            | 20-15 am | invalid |
            | 5;15pm   | valid   |
            | 10-20 AM | valid   |
            | 07.15pm  | valid   |
            | 10@05 AM | ivalid  |
            | 9#15pm   | invalid |
            | 0315pm   | valid   |
            | 100 am   | invalid |
            | 223 pm   | invalid |
            | 02-2PM   | invalid |
            | 03:2PM   | invalid |
            | 2018     | valid   |
            | 0222 Pm  | valid   |
            | 1822 Pm  | valid   |
            | 02-2 pM  | invalid |
            | 03:02 M  | invalid |
            | am o2:18 | invalid |
            | 01:17pm  | valid   |
            | 6 AM     | Valid   |
            | 06:33pm  | valid   |
            | 2500     | invalid |
            | 21:15 AM | invalid |
            | am 9     | invalid |
            | m 7      | invalid |
            | 2018     | valid   |
        And "Specific Time" radio button "is" selected
        Then user clicks the confirm button to save the customize scheduling details
        And user sees the selected schedule in order writer page and in the left panel

    @regression
    Scenario: Verify all the elements are displayed as per the frequency value selected for Time Range on Daily section
        When user selects Frequency "QD" from dropdown in the Order Details tab
        Then the user clicks the "customize scheduling" link that navigates to customize scheduling sliding page
        Then user selects Repeats tab "Daily"
        And user click on "Time Range" radio Button
        Then user selects Frequency and verifies the number of Time fields for "Time Range" in repeat block
            | frequency   | count |
            | STAT        | 2     |
            | Now         | 2     |
            | X1          | 2     |
            | QD          | 2     |
            | QD+PC       | 2     |
            | QD+AC       | 2     |
            | QD + Meal   | 2     |
            | BID+PC      | 4     |
            | BID+AC      | 4     |
            | BID+Meal    | 4     |
            | TID         | 6     |
            | TID+PC      | 6     |
            | TID+AC      | 6     |
            | TID+Meal    | 6     |
            | QID         | 8     |
            | QID+PC+HQ   | 8     |
            | QID+AC+HQ   | 8     |
            | QID+Meal+HQ | 8     |
            | 5XD         | 10    |
            | 6XD         | 12    |
            | QAM         | 2     |
            | QPM         | 2     |
            | QHS         | 2     |
        Then user select Hours Frequency and verify Time Range radio Button should be disable
            | HoursFrequency | RadioButtonStatus |
            | QH             | false             |
            | Q2H            | false             |
            | Q3H            | false             |
            | Q4H            | false             |
            | Q6H            | false             |
            | Q8H            | false             |
            | Q12H           | false             |
            | Q24H           | false             |

    # Scenario: Verify the frequency value selected for Time Range on Daily section and displays in left
    #     When user selects Frequency "QD" from dropdown
    #     Then user selects Repeats tab "Daily"
    #     And user click on "Time Range" radio Button
    #     Then user enters the "Start Time" and "End Time" in the start time and end time fields
    #         | Start Time | End Time |
    #         | 10:45 AM   | 10:47 AM |
    #     Then user clicks the confirm button to save the customize scheduling details
    #     And user sees the selected schedule in order writer page and in the left panel

    @regression
    Scenario:  UI - Verify all the components under Weekly block
        When the user clicks the "customize scheduling" link that navigates to customize scheduling sliding page
        Then the user clicks on "Weekly" button
        Then user verifies "Every" label "is" displayed
        Then user verifies "Weeks" label "is" displayed
        Then "Sun","Mon","Tue","Wed","Thu","Fri","Sat" checkboxes should be displayed
        Then user verifies "Duration " label "is" displayed
        Then user verifies "Duration Type " label "is" displayed

    @regression @fixed @working
    Scenario: Verify the functionality of Choose Days
        When the user clicks the "customize scheduling" link that navigates to customize scheduling sliding page
        Then the user clicks on "Weekly" button
        Then "Weekly" Button should highlighted with blue border
        Then Verify checkboxes are "unchecked" by default
            | days |
            | Mon  |
            | Tue  |
            | Wed  |
            | Thu  |
            | Fri  |
            | Sat  |
            | Sun  |
        Then Verify Randomly select any checkboxes and verify those are selected
            | days |
            | Sat  |
            | Sun  |


    Scenario: Add a Cyclical schedule with Specific Time
        When user selects Frequency "QD" from dropdown in the Order Details tab
        Then the user clicks the "customize scheduling" link that navigates to customize scheduling sliding page
        Then Summary shows "once daily"
        When  the user clicks on "Cyclical" button
        And user selects "Custom Days" from select cycle dropdown
        Then the user enters "3" Give Days and "4" Do Not Give Days
        When user click on "Specific Time" radio Button
        And the user enters "09:15 AM" in the "Time1" field
        And the user clicks on "Confirm" button
        Then the "Administration Schedule" in the left hand panel shows "once daily give 3 days, skip 4 days at 09:15 AM"

    Scenario: Add a Monthly schedule with Select Months and Time Range
        When user selects Frequency "BID" from dropdown in the Order Details tab
        Then the user clicks the "customize scheduling" link that navigates to customize scheduling sliding page
        And the Frequency ddl is selected as "BID" in the Customize Scheduling Screen
        Then Summary shows "2 times per day"
        When  the user clicks on "Monthly" button
        Then user clicks on "Select Months" tab
        Then user select "Days of the Week" radio button
        And user selects the following in the "Select Months"
            | values |
            | Jan    |
            | Feb    |
        And user selects the following in the "Days"
            | values |
            | Sun    |
            | Mon    |
        And user selects the following in the "Weeks of the Month"
            | values |
            | 1st    |
            | 2nd    |
        When user click on "Time Range" radio Button
        And the user enters "07:15 PM" in the "StartTime1" field
        And the user enters "07:30 PM" in the "EndTime1" field
        And the user enters "07:45 PM" in the "StartTime2" field
        And the user enters "08:00 PM" in the "EndTime2" field
        And the user clicks on "Confirm" button
        Then the "Administration Schedule" in the left hand panel shows "2 times per day on 1st, 2nd Sun, Mon of Jan, Feb at 07:15 PM - 07:30 PM, 07:45 PM - 08:00 PM"

    Scenario: Add a Monthly schedule with Every Months Specific Time
        When user selects Frequency "QD" from dropdown in the Order Details tab
        Then the user clicks the "customize scheduling" link that navigates to customize scheduling sliding page
        Then Summary shows "once daily"
        When  the user clicks on "Monthly" button
        Then user clicks on "Every Months" tab
        Then user select "Days of the Month" radio button
        And user selects "2" in the Every Months ddl
        And user clicks the following in the Select Dates calendar
            | values |
            | 10     |
            | 11     |
        When user click on "Specific Time" radio Button
        And the user enters "09:15 AM" in the "Time1" field
        And the user clicks on "Confirm" button
        Then the "Administration Schedule" in the left hand panel shows "once daily on 10th, 11th of every 2 months at 09:15 AM"

    Scenario: Ability to Create Custom Admin Sched: Every __ Times a Day
        When user selects Frequency "_XD_times per day" from dropdown in the Order Details tab
        Then the user clicks the "customize scheduling" link that navigates to customize scheduling sliding page
        And the Frequency ddl is selected as "_XD_times per day" in the Customize Scheduling Screen
        And the user enters "3" in the Times Per Day
        Then there is a validation message "Permissible range 7-24." displayed
        And the user enters "8" in the Times Per Day
        Then Summary shows "8 times per day"
        When  the user clicks on "Monthly" button
        Then user clicks on "Every Months" tab
        Then user select "Days of the Month" radio button
        And user selects "2" in the Every Months ddl
        And user clicks the following in the Select Dates calendar
            | values |
            | 10     |
            | 11     |
        When user click on "Specific Time" radio Button
        And the user enters "09:15 AM" in the "Time1" field
        And the user enters "09:30 AM" in the "Time2" field
        And the user enters "09:45 AM" in the "Time3" field
        And the user enters "10:00 AM" in the "Time4" field
        And the user enters "10:15 AM" in the "Time5" field
        And the user enters "10:30 AM" in the "Time6" field
        And the user enters "10:45 AM" in the "Time7" field
        And the user enters "11:00 AM" in the "Time8" field
        And the user clicks on "Confirm" button
        Then the Administration Schedule in the Order Details tab shows "8 times per day on 10th, 11th of every 2 months at 09:15 AM, 09:30 AM, 09:45 AM, 10:00 AM, 10:15 AM, 10:30 AM, 10:45 AM, 11:00 AM"
        And the "Administration Schedule" in the left hand panel shows "8 times per day on 10th, 11th of every 2 months at 09:15 AM, 09:30 AM, 09:45 AM, 10:00 AM, 10:15 AM, 10:30 AM, 10:45 AM, 11:00 AM"

    Scenario: Ability to Create Custom Admin Sched: Every _ minutes
        When user selects Frequency "Every_minutes" from dropdown in the Order Details tab
        Then the user clicks the "customize scheduling" link that navigates to customize scheduling sliding page
        And the Frequency ddl is selected as "Every_minutes" in the Customize Scheduling Screen
        And the user enters "0" in Specify Minutes
        Then there is a validation message "Permissible range 1-90." displayed
        And the user enters "8" in Specify Minutes
        Then Summary shows "Every 8 minutes"
        When  the user clicks on "Cyclical" button
        And user selects "Even Dates" from select cycle dropdown
        And the user clicks on "Confirm" button
        Then the Administration Schedule in the Order Details tab shows "Every 8 minutes on Even Dates"
        And the "Administration Schedule" in the left hand panel shows "Every 8 minutes on Even Dates"

    @focus
    Scenario: Ability to update PRN, First Admin Date & Time, Open Ended checkbox and Calculated Last Admin Date & Time from Order Details tab and Customize Scheduling
        When user selects Frequency "Every_minutes" from dropdown in the Order Details tab
        And the user clicks the "PRN" checkbox
        And the user notes the value of First Admin Date & Time and Calculated Last Admin Date & Time in the Order Details tab
        Then the user clicks the "customize scheduling" link that navigates to customize scheduling sliding page
        And the user enters "8" in Specify Minutes
        Then Summary shows "Every 8 minutes"
        When  the user clicks on "Daily" button
        And the user clicks the PRN checkbox in the Customize Scheduling Screen
        And the value of First Admin Date & Time and Calculated Last Admin Date & Time in the Customize Scheduling screen is same as Order Details tab
        When the user clicks the Open Ended checkbox in the Customize Scheduling Screen
        Then the Calculated Last Admin Date & Time is same as First Admin Date & Time in the Customize Scheduling screen
        And the user clicks on "Confirm" button
        Then the Administration Schedule in the Order Details tab shows "Every 8 minutes"
        And the "PRN" checkbox is unchecked
        And the "Open Ended" checkbox is unchecked
        And the value of First Admin Date & Time and Calculated Last Admin Date & Time in the Order Details tab is same as Customize Scheduling screen
        And the "Administration Schedule" in the left hand panel shows "Every 8 minutes"
        And the value of First Admin Date & Time and Calculated Last Admin Date & Time in the left panel is same as Order Details tab


