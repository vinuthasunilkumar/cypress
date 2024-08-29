
Feature:  Create Frequency And Administration
    Background: Launching the App and Navigating to Frequency and Administration Tab
        Given the user is logged into the SNF Url with credentials
            | url                                  | username       | password   |
            | https://qa61.matrixcare.me/Login.jsp | orders_support | Password@1 |
        And the user clicks on "Maintenance" menu followed by "Order Platform Configuration"
        When the user clicks "Order Platform Setup" tab in the Order Platform Configuration screen
        And the user clicks the "Administration Schedule List" left tab
        Then User selects "GM Facility A Administration Schedule List" from the list
        And user waits
        Then user click on "Add Schedule" button

    @skip @sanity @regression @Working
    Scenario Outline: Verify title, buttons and dropdown are displayed
        When user verifies the Add Schedule title is displayed
        Then user verifies "Save" button is displayed
        Then user verifies "Cancel" button is displayed
        Then user verifies that Frequency dropdown is displayed which is mandatory field

    @sanity @regression
    Scenario Outline: Verify Order Type dropdown
        When user verifies that the Order Type dropdown is displayed
        Then user verifies the list of Order Type dropdown
        When user selects blank in Order Type then Medication Type and DrugName dropdown field is not displayed
        Then user selects Medication in Order Type then Medication Type and DrugName dropdown field is displayed

    @sanity @regression @Working
    Scenario Outline: Verify Medication Type dropdown
        When user selects Medication in Order Type then Medication Type and DrugName dropdown field is displayed
        Then user verifies the list of Medication Type dropdown

    @regression @Working
    Scenario Outline: Verify if Medication Type field is changed then DrugName / Medication Group / Theraupetic Class field should reset
        When user selects "Medication" from Order Type dropdown
        When user selects "Medication" from Medication Type dropdown
        Then user verifies the next dropdown label "Medication Group"
        Then user search and select from DrugName dropdown
        When user selects "Drug Name" from Medication Type dropdown
        Then user verifies the next dropdown label "Drug Name"
        Then user verifies that "Drug Name" field is reset
        Then user search and select from DrugName dropdown
        When user selects "Medication Group" from Medication Type dropdown
        Then user verifies the next dropdown label "Medication Group"
        Then user verifies that "Medication Group" field is reset
        Then user search and select from Medication Group dropdown

    @regression
    Scenario:  UI - Verify all the components under Weekly block
        Then the user clicks on "Weekly" button
        Then user verifies "Every" label "is" displayed
        Then user verifies "Weeks" label "is" displayed
        Then "Sun","Mon","Tue","Wed","Thu","Fri","Sat" checkboxes should be displayed
        Then user verifies "Duration " label "is" displayed
        Then user verifies "Duration Type " label "is" displayed

    @regression
    Scenario: Verify the functionality of Choose Days
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

    @regression @working
    Scenario: Verify the functionality of Every text box and Duration
        Then the user clicks on "Weekly" button
        Then verify "98" values in the "Every" dropdown
        Then verify user "is not" able to enter these Values in "Every" text field
            | negativeValues   |
            | <Values Exapmle> |
        Then verify user "is" able to enter these Values in "Every" text field
            | positiveValues            |
            | <Values To Enter Example> |
        Then verify user "is not" able to enter these Values in "Duration" text field
            | negativeValues   |
            | <Values Exapmle> |
        Then verify user "is" able to enter these Values in "Duration" text field
            | positiveValues            |
            | <Values To Enter Example> |
        Examples:
            | Values Exapmle | Values To Enter Example |
            | !#@            | 1                       |
            | sg             | 97                      |
            | Ω ω            | 2                       |
            | 000            | 5                       |
            | -10            | 35                      |
            | 6.8            | 26                      |

    @sanity @regression @working
    Scenario: Verify the functionality of Duration Type Dropdown during save
        Then user verifies the values in the Duration Type dropdown when "Daily" is selected
        Then the user clicks on "Cyclical" button
        Then user verifies the values in the Duration Type dropdown when "Cyclical" is selected
        Then the user clicks on "Weekly" button
        Then user verifies the values in the Duration Type dropdown when "Weekly" is selected
        Then the user clicks on "Monthly" button
        Then user verifies the values in the Duration Type dropdown when "Monthly" is selected

    @regression @fixed @working
    Scenario: Verify all the components and their default behavior under Cyclic block are displayed
        And user clicks on "Cyclical" button
        Then user verifies "Choose Time" label "is" displayed
        Then the user verifies that the radio buttons are displayed with the labels "Specific Time"
        And "Specific Time" radio button "is" selected
        Then the user verifies that the radio buttons are displayed with the labels 'Time Range'
        Then "Time Range" radio button "is not" selected
        Then user verifies "Select Cycle" label "is" displayed
        Then user verifies that Select Cycle dropdown is displayed
        Then user verifies the list of Select cycle dropdown
        Then user verifies "Duration" label "is" displayed
        Then user verifies "Duration Type" label "is" displayed

    @regression
    Scenario: Verify on selecting Select Cycle other than Custom Days give and donot give days donot appear
        And user clicks on "Cyclical" button
        When user selects "Every Other Day" from select cycle dropdown
        Then user verifies "Give" label "is not" displayed
        Then user verifies "Do Not Give" label "is not" displayed
        When user selects "Even Dates" from select cycle dropdown
        Then user verifies "Give" label "is not" displayed
        Then user verifies "Do Not Give" label "is not" displayed
        When user selects "Odd Dates" from select cycle dropdown
        Then user verifies "Give" label "is not" displayed
        Then user verifies "Do Not Give" label "is not" displayed
        When user selects "Custom Days" from select cycle dropdown
        Then user verifies "Give" label "is" displayed
        Then user verifies "Do Not Give" label "is" displayed

    @regression
    Scenario: Verify the functionality of Give, Do not Give, Duration dropdowns
        And user clicks on "Cyclical" button
        When user selects "Custom Days" from select cycle dropdown
        Then verify user "is not" able to enter these Values in "Give" text field
            | negativeValues   |
            | <Values Example> |
        Then verify user "is" able to enter these Values in "Give" text field
            | positiveValues            |
            | <Values To Enter Example> |
        Then verify user "is not" able to enter these Values in "Do Not Give" text field
            | negativeValues   |
            | <Values Example> |
        Then verify user "is" able to enter these Values in "Do Not Give" text field
            | positiveValues            |
            | <Values To Enter Example> |
        Then verify user "is not" able to enter these Values in "Duration" text field
            | negativeValues   |
            | <Values Example> |
        Then verify user "is" able to enter these Values in "Duration" text field
            | positiveValues            |
            | <Values To Enter Example> |
        Examples:
            | Values Example | Values To Enter Example |
            | !#@$!#@$       | 1                       |
            | sgdhjsa        | 365                     |
            | Ω ω            | 2                       |
            | 000            | 5                       |
            | -10            | 35                      |
            | 8767           | 135                     |
            | 396.7648       | 26                      |

    @regression
    Scenario: Verify the scroll and the last value in give, donot give, duration dropdown
        And user clicks on "Cyclical" button
        When user selects "Custom Days" from select cycle dropdown
        Then verify "364" values in the "Give" dropdown
        Then verify "364" values in the "Do Not Give" dropdown
        Then verify "998" values in the "Duration" dropdown

    @regression
    # Failing because of locator
    Scenario: Verify the count of clock as per the selected frequency value in case of daily
        When user selects Frequency "QD" from dropdown
        Then user selects Repeats tab "Daily"
        When user selects Frequency and verifies the number of Time fields in Repeats Tab
            | frequency | count |
            | QD        | 1     |
            | BID       | 2     |
            | TID+PC    | 3     |
            | QID+AC    | 4     |
            | 5XD       | 5     |
            | 6XD       | 6     |
            | Q3H       | 1     |
            | QH        | 1     |
            | Q2H       | 1     |

    @regression @working
    Scenario Outline: Verify all the elements are displayed as per the frequency value selected for Specific Time
        When user selects Frequency "QD" from dropdown
        Then user selects Repeats tab "Daily"
        Then user selects Frequency and verifies the number of Time fields in Repeats Tab
            | frequency  | count |
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

    @regression @working
    Scenario Outline: Verify Duration and Duration Type field
        When user selects Frequency "QD" from dropdown
        Then user verify Repeat block is displayed
        Then "Duration " label should be displayed
        Then "Duration Type " label should be displayed
        Then verify user "is not" able to enter these Values in "Duration" text field
            | negativeValues   |
            | <Values Example> |
        Then verify user "is" able to enter these Values in "Duration" text field
            | positiveValues            |
            | <Values To Enter Example> |
        Examples:
            | Values Example | Values To Enter Example |
            | !#@$!#@$       | 1                       |
            | sgdhjsa        | 365                     |
            | Ω ω            | 2                       |
            | 000            | 5                       |
            | -10            | 35                      |
            | 8767           | 135                     |
            | 396.7648       | 26                      |

    @regression
    Scenario Outline: Verify all the elements are displayed under Monthly schedule type for Specific Time and checkboxes are not selected by default
        When user selects Frequency "QD" from dropdown
        Then user verify Repeat block is displayed
        Then user selects Repeats tab "Monthly"
        Then user verifies "Every" label "is" displayed
        Then user verifies "Select Months" label "is" displayed
        Then user verifies "Days of the Month" label "is" displayed
        Then user verifies "Days of the Week" label "is" displayed
        Then user verifies 31 dates in the calendar
        Then user clicks on "Select Months" tab
        Then user clicks on Select Months dropdown
        Then user verify months, days of the week and days of the months checkboxes are unchecked and labels are displayed
            | Months_Days |
            | Jan         |
            | Feb         |
            | Mar         |
            | Apr         |
            | May         |
            | Jun         |
            | Jul         |
            | Aug         |
            | Sep         |
            | Oct         |
            | Nov         |
            | Dec         |
        Then user select "Days of the Week" radio button
        Then user click on Days drop down in Select Months Tab
        Then user verify months, days of the week and days of the months checkboxes are unchecked and labels are displayed
            | Months_Days |
            | Mon         |
            | Tue         |
            | Wed         |
            | Thu         |
            | Fri         |
            | Sat         |
            | Sun         |
        Then user clicks on Weeks of the Month drop down in Select Months Tab
        Then user verify months, days of the week and days of the months checkboxes are unchecked and labels are displayed
            | Months_Days |
            | 1st         |
            | 2nd         |
            | 3rd         |
            | 4th         |
            | Last        |

    @regression
    Scenario Outline: Verify Every dropdown field values and set as default toggle is inactive
        When user selects Frequency "QD" from dropdown
        Then user verify Repeat block is displayed
        Then user selects Repeats tab "Monthly"
        Then verify "98" values in the "Every" dropdown
        Then user verify that Set As Default toggle is inactive by default
        Then verify "998" values in the "Duration" dropdown

    @regression
    Scenario: Verify Daily Block Values are saved in DB
        When user selects Frequency "<Frequency>" from dropdown
        When user selects "<OrderType>" from Order Type dropdown
        Then verify user "is" able to select values in "Duration" text field
            | positiveValues |
            | <Duration>     |
        Then user selects value "<Duration Type>" from dropdown field
        Then user enters "<Time>" in Time field
        Then user toggles Set as Default field "<bool>"
        Then the user clicks on "Save" button
        Then the user sees the message "Administration Schedule saved successfully."
        Then User verifies saved values "<Frequency>","<OrderType>","<Cycle>","<Give>","<Do Not Give>","<Duration>","<Duration Type>","<bool>","<Time>" for "Daily" in database
        Examples:
            | Frequency | OrderType  | Cycle | Give | Do Not Give | Duration | Duration Type | bool | Time                                                  |
            | QD        | Medication |       |      |             | 4        | Days          | 1    | 10:45 AM                                              |
            | BID       | Medication |       |      |             | 60       | Months        | 0    | 10:20 PM,10:45 AM                                     |
            | TID       | Medication |       |      |             | 599      | Weeks         | 0    | 05:11 PM,07:47 AM,12:22 PM                            |
            | QID       | Medication |       |      |             | 899      | Weeks         | 1    | 11:11 AM,12:49 AM,01:22 PM,11:59 AM                   |
            | 5XD       | Medication |       |      |             | 1        | Weeks         | 1    | 11:11 AM,12:49 AM,01:22 PM,11:59 AM,06:06 AM          |
            | 6XD       | Medication |       |      |             | 999      | Days          | 1    | 11:11 AM,12:49 AM,01:22 PM,11:59 AM,08:59 AM,09:22 PM |

    @regression
    Scenario: Verify Cyclical Block Values for Specific Time are saved in DB
        When User deletes the created Admin schedule "1" from DB
        When user selects Frequency "<Frequency>" from dropdown
        When user selects "<OrderType>" from Order Type dropdown
        And user clicks on "Cyclical" button
        When user selects "Custom Days" from select cycle dropdown
        Then verify user "is" able to select values in "Give" text field
            | positiveValues |
            | <Give>         |
        Then verify user "is" able to select values in "Do Not Give" text field
            | positiveValues |
            | <Do Not Give>  |
        Then user enters "<Time>" in Time field
        Then verify user "is" able to select values in "Duration" text field
            | positiveValues |
            | <Duration>     |
        Then user selects value "<Duration Type>" from dropdown field
        Then user toggles Set as Default field "<bool>"
        Then the user clicks on "Save" button
        Then the user sees the message "Administration Schedule saved successfully."
        Then User verifies saved values "<Frequency>","<OrderType>","<Cycle>","<Give>","<Do Not Give>","<Duration>","<Duration Type>","<bool>","<Time>" for "Cyclical" in database
        Examples:
            | Frequency | OrderType  | Cycle          | Give | Do Not Give | Duration | Duration Type | bool | Time              |
            | QD        | Medication | Specific Cycle | 1    | 365         | 4        | Days          | 1    | 10:45 AM          |
            | BID       | Medication | Specific Cycle | 365  | 1           | 60       | Months        | 0    | 10:20 PM,10:45 AM |

    @regression
    Scenario: Verify Cyclical Block Values for Every Other Day are saved in DB
        When User deletes the created Admin schedule "1" from DB
        When user selects Frequency "<Frequency>" from dropdown
        When user selects "<OrderType>" from Order Type dropdown
        And user clicks on "Cyclical" button
        When user selects "Every Other Day" from select cycle dropdown
        Then user enters "<Time>" in Time field
        Then verify user "is" able to select values in "Duration" text field
            | positiveValues |
            | <Duration>     |
        Then user selects value "<Duration Type>" from dropdown field
        Then user toggles Set as Default field "<bool>"
        Then the user clicks on "Save" button
        Then the user sees the message "Administration Schedule saved successfully."
        Then User verifies saved values "<Frequency>","<OrderType>","<Cycle>","<Give>","<Do Not Give>","<Duration>","<Duration Type>","<bool>","<Time>" for "Cyclical" in database
        Examples:
            | Frequency | OrderType  | Cycle           | Give | Do Not Give | Duration | Duration Type | bool | Time     |
            | QD        | Medication | Every Other Day | 1    | 365         | 4        | Days          | 1    | 10:45 AM |

    @regression
    Scenario: Verify Cyclical Block Values for Even Dates are saved in DB
        When User deletes the created Admin schedule "1" from DB
        When user selects Frequency "<Frequency>" from dropdown
        When user selects "<OrderType>" from Order Type dropdown
        And user clicks on "Cyclical" button
        When user selects "Even Dates" from select cycle dropdown
        Then user enters "<Time>" in Time field
        Then verify user "is" able to select values in "Duration" text field
            | positiveValues |
            | <Duration>     |
        Then user selects value "<Duration Type>" from dropdown field
        Then user toggles Set as Default field "<bool>"
        Then the user clicks on "Save" button
        Then the user sees the message "Administration Schedule saved successfully."
        Then User verifies saved values "<Frequency>","<OrderType>","<Cycle>","<Give>","<Do Not Give>","<Duration>","<Duration Type>","<bool>","<Time>" for "Cyclical" in database
        Examples:
            | Frequency | OrderType  | Cycle      | Give | Do Not Give | Duration | Duration Type | bool | Time     |
            | QD        | Medication | Even Dates | 1    | 365         | 4        | Days          | 1    | 10:45 AM |

    @regression
    Scenario: Verify Cyclical Block Values for Odd Dates are saved in DB
        When User deletes the created Admin schedule "1" from DB
        When user selects Frequency "<Frequency>" from dropdown
        When user selects "<OrderType>" from Order Type dropdown
        And user clicks on "Cyclical" button
        When user selects "Odd Dates" from select cycle dropdown
        Then user enters "<Time>" in Time field
        Then verify user "is" able to select values in "Duration" text field
            | positiveValues |
            | <Duration>     |
        Then user selects value "<Duration Type>" from dropdown field
        Then user toggles Set as Default field "<bool>"
        Then the user clicks on "Save" button
        Then the user sees the message "Administration Schedule saved successfully."
        Then User verifies saved values "<Frequency>","<OrderType>","<Cycle>","<Give>","<Do Not Give>","<Duration>","<Duration Type>","<bool>","<Time>" for "Cyclical" in database
        Examples:
            | Frequency | OrderType  | Cycle     | Give | Do Not Give | Duration | Duration Type | bool | Time     |
            | QD        | Medication | Odd Dates | 1    | 365         | 4        | Days          | 1    | 10:45 AM |

    @regression
    Scenario Outline: Verify all the elements are displayed as per the frequency value selected for Time Range on Daily section
        When user selects Frequency "QD" from dropdown
        And user clicks on "Daily" button
        And user click on "Time Range" radio Button
        Then user selects Frequency and verifies the number of Time fields for "Time Range" in repeat block
            | frequency   | count |
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

    @regression
    Scenario Outline: Verify all the elements are displayed as per the frequency value selected for Time Range on Cyclical section
        When user selects Frequency "QD" from dropdown
        And user clicks on "Cyclical" button
        And user click on "Time Range" radio Button
        Then user selects Frequency and verifies the number of Time fields for "Time Range" in repeat block
            | frequency   |
            | QD          |
            | QD+PC       |
            | QD+AC       |
            | QD + Meal   |
            | BID+PC      |
            | BID+AC      |
            | BID+Meal    |
            | TID         |
            | TID+PC      |
            | TID+AC      |
            | TID+Meal    |
            | QID         |
            | QID+PC+HQ   |
            | QID+AC+HQ   |
            | QID+Meal+HQ |
            | 5XD         |
            | 6XD         |
            | QAM         |
            | QPM         |
            | QHS         |
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

    @regression
    Scenario Outline: Verify all the elements are displayed as per the frequency value selected for Time Range on Weekly section
        When user selects Frequency "QD" from dropdown
        And user clicks on "Weekly" button
        And user click on "Time Range" radio Button
        Then user selects Frequency and verifies the number of Time fields for "Time Range" in repeat block
            | frequency   | count |
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

    @regression
    Scenario Outline: Verify all the elements are displayed as per the frequency value selected for Time Range on Monthly section
        And user clicks on "Monthly" button
        And user click on "Time Range" radio Button
        Then user selects Frequency and verifies the number of Time fields in Daiy section
            | frequency   | count   |
            | <frequency> | <count> |
        Examples:
            | frequency   | count |
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

    @regression
    Scenario Outline: Verify when user select HoursFRequency and Time Range radio Button is disable
        And user clicks on "Monthly" button
        And user click on "Time Range" radio Button
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

    @regression
    Scenario Outline: Verify save for Weekly  specific Time
        Then User deletes the created Admin schedule "1" from DB
        When user selects Frequency "<Frequency>" from dropdown
        When user selects "<OrderType>" from Order Type dropdown
        Then the user clicks on "Weekly" button
        Then user choose "<Choose Days>" in Frequency and Administration
        Then user enters "<Time>" in Time field
        Then the user enter "<Every Week>" in Every text field
        Then verify user "is" able to select values in "Duration" text field
            | positiveValues |
            | <Duration>     |
        Then user selects value "<Duration Type>" from dropdown field
        Then the user clicks on "Save" button
        Then the user sees the message "Administration Schedule saved successfully."
        Then User verifies saved values "<Frequency>","<OrderType>","<Cycle>","<Every Week>","<Choose Days>","<Duration>","<Duration Type>","<bool>","<Time>" for "Weekly" in database
        Examples:
            | Frequency | OrderType  | Cycle         | Every Week | Choose Days  | Duration | Duration Type | bool | Time     |
            | QD        | Medication | Specific Time | 2          | Tue          | 14       | Weeks         | 0    | 10:45 AM |
            | QD        | Medication | Specific Time | 2          | Mon,Tue      | 12       | Weeks         | 0    | 10:45 AM |
            | QD        | Medication | Specific Time | 2          | Thu, Fri,Sun | 16       | Weeks         | 0    | 10:45 AM |
            | QD        | Medication | Specific Time | 2          | Sat          | 10       | Weeks         | 0    | 10:45 AM |

    @regression
    Scenario Outline: Verify save for Monthly Specific Time Days of Month
        Then User deletes the created Admin schedule "1" from DB
        And User creates Admin Schedule with repeats as given "Monthly"
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months  | Daysof            | ChooseWeeks | WeeksOfMonth |
            | QD        | true | Medication     | Drug Name           | Zyvit       | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 10:45 AM | 5        | Months       | Every Months | 2          | 3,4,8      | Jun,Apr | Days of the Month |             |              |
        Then the user clicks on "Save" button
        Then the user sees the message "Administration Schedule saved successfully."
        Then User types "once daily" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User verifies the data with repeats as Monthly
            | frequency  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months | Daysof            | ChooseWeeks | WeeksOfMonth |
            | once daily | Medication     | Drug Name           | Zyvit       | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 10:45 AM | 5        | Months       | Every Months | 2          | 3,4,8      |        | Days of the Month |             |              |


    @regression
    Scenario Outline: Verify save for Monthly Specific Time Days of Week
        Then User deletes the created Admin schedule "1" from DB
        And User creates Admin Schedule with repeats as given "Monthly"
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months | Daysof           | ChooseWeeks | WeeksOfMonth  |
            | QD        | true | Medication     | Drug Name           | Zyvit       | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 10:45 AM | 5        | Months       | Every Months | 2          |            |        | Days of the Week | Tue,Wed,Thu | 1st, 2nd, 3rd |
        Then the user clicks on "Save" button
        Then the user sees the message "Administration Schedule saved successfully."
        Then User types "once daily" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User verifies the data with repeats as Monthly
            | frequency  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months | Daysof           | ChooseWeeks | WeeksOfMonth |
            | once daily | Medication     | Drug Name           | Zyvit       | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 10:45 AM | 5        | Months       | Every Months | 2          | 3,4,8      |        | Days of the Week | Tue,Wed,Thu | 1st,2nd,3rd  |


    @regression
    Scenario Outline: Verify save for Monthly Specific Time Select Month Days of Month
        Then User deletes the created Admin schedule "1" from DB
        And User creates Admin Schedule with repeats as given "Monthly"
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | TabSelection  | EveryMonth | ChooseDays | Months      | Daysof            | ChooseWeeks | WeeksOfMonth |
            | QD        | true | Medication     | Drug Name           | Lixolin     | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 10:45 AM | 5        | Months       | Select Months | 2          | 2,4,8      | Jan,Feb,Mar | Days of the Month |             |              |
        Then the user clicks on "Save" button
        Then the user sees the message "Administration Schedule saved successfully."
        Then User types "Lixolin" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User verifies the data with repeats as Monthly
            | frequency  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months      | Daysof            | ChooseWeeks | WeeksOfMonth |
            | once daily | Medication     | Drug Name           | Lixolin     | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 10:45 AM | 5        | Months       |              | 2          | 2,4,8      | Jan,Feb,Mar | Days of the Month |             |              |

    @regression
    Scenario Outline: Verify save for Monthly Specific Time Select Months Days of Week
        Then User deletes the created Admin schedule "1" from DB
        And User creates Admin Schedule with repeats as given "Monthly"
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | TabSelection  | EveryMonth | ChooseDays | Months      | Daysof           | ChooseWeeks | WeeksOfMonth |
            | QD        | true | Medication     | Drug Name           | Mozobil     | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 10:45 AM | 5        | Months       | Select Months | 2          |            | Jan,Feb,Mar | Days of the Week | Mon,Tue,Wed | 3rd,4th      |
        Then the user clicks on "Save" button
        Then the user sees the message "Administration Schedule saved successfully."
        Then User types "Mozobil" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then User verifies the data with repeats as Monthly
            | frequency  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months      | Daysof           | ChooseWeeks | WeeksOfMonth |
            | once daily | Medication     | Drug Name           | Mozobil     | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 10:45 AM | 5        | Months       |              | 2          |            | Jan,Feb,Mar | Days of the Week | Mon,Tue,Wed | 3rd,4th      |


    @regression
    Scenario Outline: Verify all the clocks should be blank as per the frequency on Daily, Cyclical, Weekly, Monthly
        When user selects Frequency "<Frequency>" from dropdown
        Then verifies Time fields should be blank
        And user clicks on "Cyclical" button
        Then verifies Time fields should be blank
        And user clicks on "Weekly" button
        Then verifies Time fields should be blank
        And user clicks on "Monthly" button
        Then verifies Time fields should be blank
        Examples:
            | Frequency |
            | QD        |
            | BID       |
            | TID       |
            | Q12H      |

    @regression
    Scenario Outline: Verify time is getting recorded in DB as per hour frequency
        Then User deletes the created Admin schedule "1" from DB
        When user clicks on "Monthly" button
        When user selects Frequency "<Frequency>" from dropdown
        When user selects "<OrderType>" from Order Type dropdown
        Then verify user "is" able to select values in "Duration" text field
            | positiveValues |
            | <Duration>     |
        Then user selects value "<Duration Type>" from dropdown field
        Then user enters "<Time>" in Time field
        Then the user clicks on "Save" button
        Then the user sees the message "Administration Schedule saved successfully."
        Then user verifies time "<Time>" recorded in DB as per the hour "<Frequency>" selected
        Examples:
            | Frequency | OrderType  | Duration | Duration Type | Time                               |
            | Q6H       | Medication | 4        | Days          | 09:08 AM,10:45 AM,11:10 AM,01:09PM |
    # | Q8H       | Medication | 4        | Days          | 02:44 PM,11:10 AM,01:09PM             |
    # | Q12H      | Medication | 4        | Days          | 06:21 AM ,01:09PM                     |
    # | Q24H      | Medication | 4        | Days          | 08:00 AM                              |

    @regression
    Scenario Outline: Verify no data is saved for Assign To popup when user clicks on Cancel or X button
        When the user clicks on "Edit" button
        Then user verifies that Edit Assign To popup is displayed
        Then user selects "Unit 1" "Room 1, Room 2" checkbox
        Then user verifies selection is updated in the label
        Then the user clicks on Cancel button
        Then user verifies selection is not updated in Frequency and Admin page
        When the user clicks on "Edit" button
        Then user verifies that Edit Assign To popup is displayed
        Then user selects "Unit 1" "Room 1" checkbox
        Then user verifies selection is updated in the label
        Then the user clicks on Close button
        Then user verifies selection is not updated in Frequency and Admin page

    @regression
    Scenario Outline: Verify user is able to Check All and Clear All checkboxes using respective buttons
        When the user clicks on "Edit" button
        Then user verifies that Edit Assign To popup is displayed
        Then user clicks on "Check" All button
        Then user verifies that all the checkboxes is "checked"
        Then user clicks on "Clear" All button
        Then user verifies that all the checkboxes is "not checked"

    @regression
    Scenario Outline: Verify no search result is displayed if search value is invalid
        When the user clicks on "Edit" button
        Then user verifies that Edit Assign To popup is displayed
        Then user enter invalid value "Room1" in search box and verify no record is displayed

    @regression
    Scenario Outline: Verify user selects Units and Rooms and verify that the selection is displayed in the label
        When the user clicks on "Edit" button
        Then user verifies that Edit Assign To popup is displayed
        Then user selects "<Unit>" "<Room>" checkbox
        Then user verifies the selection "<Unit>" "<Room>" is updated in Assigned To label
        Then the user clicks on "Confirm" button
        Then user verifies the selection "<Unit>" "<Room>" is updated in Assigned To label
        Examples:
            | Unit           | Room                            |
            | Unit 1, Unit 2 | Room 1, Room 2 ; Room 2, Room 3 |
            | Unit 2         | Room 1, Room 3                  |
            | Unit 3         | Room 1                          |

    @regression
    Scenario: Verify all is displayed when user selects all the rooms under a unit and on unchecking, specific room names are present
        When the user clicks on "Edit" button
        Then user verifies that Edit Assign To popup is displayed
        Then user selects "<Unit>" checkbox
        Then user verifies the selection "<Unit>" "<SelectAll>" is updated in Assigned To label
        Then the user clicks on "Confirm" button
        Then user verifies the selection "<Unit>" "<SelectAll>" is updated in Assigned To label
        When the user clicks on "Edit" button
        Then user verifies that Edit Assign To popup is displayed
        Then user selects "<UnassignRoom>" checkbox
        Then user verifies the selection "<Unit>" "<AssignedRooms>" is updated in Assigned To label
        Then the user clicks on "Confirm" button
        Then user verifies the selection "<Unit>" "<AssignedRooms>" is updated in Assigned To label
        Examples:
            | Unit   | UnassignRoom | SelectAll | AssignedRooms          |
            | Unit 1 | Room 1       | All       | Room 2, Room 3, Room 4 |

    @regression 
    Scenario: Verify facility name is displayed when user selects all the units under a facility and on unchecking specific units are present
        When the user clicks on "Edit" button
        Then user verifies that Edit Assign To popup is displayed
        Then user clicks on "Check" All button
        Then user verifies that all the checkboxes is "checked"
        Then user verifies the selected name "<FacilityName>" is updated in Assigned To label
        Then the user clicks on "Confirm" button
        Then user verifies the selected name "<FacilityName>" is updated in Assigned To label
        When the user clicks on "Edit" button
        Then user verifies that Edit Assign To popup is displayed
        Then user selects "<UnassignUnit>" "<UnassignRoom>" checkbox
        Then user verifies the selected name "<AssignedRooms>" is updated in Assigned To label
        Then the user clicks on "Confirm" button
        Then user verifies the selected name "<AssignedRooms>" is updated in Assigned To label
        Examples:
            | FacilityName      | UnassignUnit | UnassignRoom | AssignedRooms                                               |
            | MatrixCare Center | Unit 1       | Room 1       | Unit 1 - Room 2, Room 3, Room 4; Unit 2 - All; Unit 3 - All |

    @sanity @regression
    Scenario Outline: Verify user is able to search with specific drug name
        When user selects Frequency "<Frequency>" from dropdown
        When user selects "<OrderType>" from Order Type dropdown
        When user selects "Drug Name" from Medication Type dropdown
        Then user search "<DrugName>" and verify only particular name is displayed
        Then verify only "<DrugName>" is displayed in the dropdown
        Examples:
            | DrugName | Frequency | OrderType  |
            | Lisco    | QD        | Medication |
            | Jinteli  | QD        | Medication |
            | Dazidox  | Q2H       | Medication |

    @sanity @regression
    Scenario Outline: Verify user is able to search with invalid drug name
        When user selects Frequency "<Frequency>" from dropdown
        When user selects "<OrderType>" from Order Type dropdown
        When user selects "Drug Name" from Medication Type dropdown
        Then user search "<DrugName>" and verify only particular name is displayed
        Then verify "No options" is displayed in the dropdown
        Examples:
            | DrugName    | Frequency | OrderType  |
            | hjggdfsedrd | QD        | Medication |

    @regression
    Scenario Outline: Verify data is saved in DB for Assign To popup
        When user selects Frequency "QD" from dropdown
        Then user enters "10:45 AM" in Time field
        When verify user "is" able to select values in "Duration" text field
            | positiveValues |
            | 1              |
        When user selects value "Days" from dropdown field
        When the user clicks on "Edit" button
        Then user verifies that Edit Assign To popup is displayed
        And user selects "<Unit>" "<Room>" checkbox
        Then user verifies the selection "<Unit>" "<Room>" is updated in Assigned To label
        And the user clicks on "Confirm" button
        Then the user clicks on "Save" button
        Then the user sees the message "Administration Schedule saved successfully."
        Then user verifies the "<Records>" of records in DB
        Examples:
            | Unit                   | Room                                                                   | Records |
            | Unit 1, Unit 2         | Room 1, Room 2 ; Room 2, Room 3                                        | 4       |
            | Unit 1, Unit 2, Unit 3 | Room 1, Room 2, Room 4; Room 1, Room 3; Room 1, Room 2, Room 3, Room 5 | 9       |

    @sanity @regression
    Scenario Outline: Verify Highlighted the mandatory fields When focuse and defocus for Medication Type, Frequency, Duration on Daily section
        When user selects "Medication" from Order Type dropdown
        Then user click on "X" Button
        Then dropdown text field should "be" highlighted with red border
        Then "Medication Type " label should "be" highlighted with red border
        Then validation should "be" displayed "Medication Type is required."
        Then the user reloads the browser
        Then validation should "not be" displayed "Medication Type is required."
        When user selects "Medication" from Order Type dropdown
        Then user search and select from DrugName dropdown
        Then user click on X Button on Drugname drop down
        Then validation should "be" displayed "Drug name is required."
        Then "Drug Name" label should "be" highlighted with red border
        Then user search and select from DrugName dropdown
        Then validation should "not be" displayed "Drug name is required."
        When user selects Frequency "QD" from dropdown
        Then user click on x Button on freqency
        Then "Frequency" label should "be" highlighted with red border
        Then validation should "be" displayed "Frequency is required."
        When user selects Frequency "QD" from dropdown
        Then validation should "not be" displayed "Frequency is required."
        Then user selects value "Days" from dropdown field
        Then user selects value "1" from Duration dropdown field
        Then user click on X Button on Duration Type field
        Then "Duration Type " label should "be" highlighted with red border
        Then validation should "be" displayed "Duration Type is required."
        Then user selects value "Days" from dropdown field
        Then user click on X Button on Duration field
        Then "Duration " label should "be" highlighted with red border
        Then validation should "be" displayed "Duration is required."

    @sanity @regression @fixedWithBug #Raise BUG Do not give is DOT not give BUG#9629
    Scenario Outline: Verify Highlighted the mandatory fields When focus and defocus for Give , Do Not Give, on Cyclical section
        Then user selects Repeats tab "Cyclical"
        When user selects "Custom Days" from select cycle dropdown
        Then the user clicks on "Save" button
        Then label "Give" and field border should be highlighted red
        Then label "Do Not Give" and field border should be highlighted red
        Then validation should "be" displayed "Give is required."
        Then validation should "be" displayed "Do Not Give is required."
        Then verify "Give" hyperlink
        Then verify "Do Not Give" hyperlink

    @regression
    Scenario: Verify user is able to save time ranges
        Then User deletes the created Admin schedule "1" from DB
        When user selects Frequency "<Frequency>" from dropdown
        And user click on "Time Range" radio Button
        Then user enters the "<Start Time>" in the start Time field
        Then user enters the "<End Time>" in the end Time field
        Then verify user "is" able to select values in "Duration" text field
            | positiveValues |
            | <Duration>     |
        Then user selects value "<Duration Type>" from dropdown field
        Then the user clicks on "Save" button
        Then the user sees the message "Administration Schedule saved successfully."
        Then User verifies saved values for "<Start Time>" and "<End Time>" for Daily in database
        Examples:
            | Frequency | Duration | Duration Type | Start Time        | End Time          |
            | QD        | 4        | Days          | 10:45 AM          | 10:47 AM          |
            | BID       | 999      | Days          | 12:49 AM,11:11 AM | 11:13 AM,12:52 AM |

    @regression
    Scenario Outline: Verify Highlighted the mandatory fields When focus and defocus for Weekly section
        Then user selects Repeats tab "Weekly"
        Then user verify by default "1" value should be display on Every text field
        Then user choose "Tue" in Frequency and Administration
        Then user choose "Tue" in Frequency and Administration
        Then validation should "be" displayed "Days is required."
        Then "Choose Days" label should "be" highlighted with red border
        Then user choose "Tue" in Frequency and Administration
        Then validation should "not be" displayed "Days is required."

    @regression
    Scenario Outline: Verify Highlighted the mandatory fields When focus and defocus for  Days of the month and days of the week Of Every section on Monthly
        Then user selects Repeats tab "Monthly"
        Then user selects dates "4" form the calendar
        Then user selects dates "4" form the calendar
        Then validation should "be" displayed "Dates is required."
        Then "selectDates" label should "be" highlighted with red color
        Then user selects dates "4" form the calendar
        Then validation should "not be" displayed "Dates is required."
        Then user selects "Days of the Week" on Repeat tab
        Then user click on Days drop down in Every Months Tab
        Then user choose "Tue" in Frequency and Administration
        Then user choose "Tue" in Frequency and Administration
        Then user click on Days drop down in Every Months Tab
        Then validation should "be" displayed "Days is required."
        Then "Days" label should "be" highlighted with red color
        Then user click on Days drop down in Every Months Tab
        Then user choose "Tue" in Frequency and Administration
        Then "Days" label should "not be" highlighted with red color
        Then validation should "not be" displayed "Days is required."
        Then user clicks on Weeks of the Month drop down in Every Months Tab
        Then user choose "1st" in Frequency and Administration
        Then user choose "1st" in Frequency and Administration
        Then user clicks on Weeks of the Month drop down in Every Months Tab
        Then validation should "be" displayed "Weeks of the Month is required."
        Then user clicks on Weeks of the Month drop down in Every Months Tab
        Then user choose "1st" in Frequency and Administration
        Then validation should "not be" displayed "Weeks of the Month is required."


    @regression
    Scenario Outline: Verify Highlighted the mandatory fields When focus and defocus for Days of the month and days of the week Of Choose section on Monthly
        Then user selects Repeats tab "Monthly"
        Then user clicks on "Select Months" tab
        Then user clicks on Select Months dropdown
        Then user choose "Mar" in Frequency and Administration
        Then user choose "Mar" in Frequency and Administration
        Then user clicks on Select Months dropdown
        Then validation should "be" displayed "Months is required."
        Then user clicks on Select Months dropdown
        Then user choose "Mar" in Frequency and Administration
        Then validation should "not be" displayed "Months is required."
        Then user selects dates "4" form the calendar
        Then user selects dates "4" form the calendar
        Then validation should "be" displayed "Dates is required."
        Then user choose "4" in Frequency and Administration
        Then validation should "not be" displayed "Dates is required."
        Then user selects "Days of the Week" on Repeat tab
        Then user click on Days drop down in Select Months Tab
        Then user choose "Tue" in Frequency and Administration
        Then user choose "Tue" in Frequency and Administration
        Then user click on Days drop down in Select Months Tab
        Then validation should "be" displayed "Days is required."
        Then user click on Days drop down in Select Months Tab
        Then user choose "Tue" in Frequency and Administration
        Then user click on Days drop down in Select Months Tab
        Then user clicks on Weeks of the Month drop down in Select Months Tab
        Then user choose "1st" in Frequency and Administration
        Then user choose "1st" in Frequency and Administration
        Then user clicks on Weeks of the Month drop down in Select Months Tab
        Then validation should "be" displayed "Weeks of the Month is required."
        Then user clicks on Weeks of the Month drop down in Select Months Tab
        Then user choose "1st" in Frequency and Administration
        Then validation should "not be" displayed "Weeks of the Month is required."

    @sanity @regression
    Scenario Outline: Verify "Frequency" hyperlink
        Then the user clicks on "Save" button
        Then verify "1 Error found" error message should "be" displayed
        Then verify "Frequency" hyperlink
        When user selects Frequency "QD" from dropdown
        Then verify "1 Error found" error message should "not be" displayed

    @sanity @regression
    Scenario Outline: Verify "Medication Type is required." hyperlink
        When user selects Frequency "QD" from dropdown
        When user selects "Medication" from Order Type dropdown
        Then remove the Medication type from dropdown
        Then the user clicks on "Save" button
        Then verify "1 Error found" error message should "be" displayed
        When user selects "Medication" from Order Type dropdown

    @regression
    Scenario Outline: Verify "Drug name is required." hyperlink
        When user selects Frequency "QD" from dropdown
        When user selects "Medication" from Order Type dropdown
        When user selects "Drug Name" from Medication Type dropdown
        Then user enter valid value in time field
        Then the user clicks on "Save" button
        Then verify "1 Error found" error message should "be" displayed
        Then verify "Drug Name" hyperlink
        Then click on "Drug Name" hyperlink
        Then validation should "be" displayed "Drug name is required."
        Then user search and select from DrugName dropdown
        Then verify "1 Error found" error message should " not be" displayed

    @regression
    Scenario Outline: Verify "Cycle" hyperlink
        When user selects Frequency "QD" from dropdown
        When user selects "Medication" from Order Type dropdown
        Then user search and select from DrugName dropdown
        And user clicks on "Cyclical" button
        Then user enters "11:15" in Time field
        Then the user clicks on "Save" button
        Then verify "1 Error found" error message should "be" displayed
        Then verify "Select Cycle" hyperlink
        Then click on "Select Cycle" hyperlink
        Then validation should "be" displayed "Cycle is required."
        When user selects "Every Other Day" from select cycle dropdown
        Then verify "1 Error found" error message should "not be" displayed

    @regression
    Scenario Outline: Verify "Choose Days" hyperlink
        When user selects Frequency "QD" from dropdown
        When user selects "Medication" from Order Type dropdown
        When user selects "Drug Name" from Medication Type dropdown
        Then user search and select from DrugName dropdown
        Then the user clicks on "Weekly" button
        Then user enters "10:00" in Time field
        Then the user clicks on "Save" button
        Then verify "1 Error found" error message should "be" displayed
        Then verify "Choose Days" hyperlink
        Then click on "Choose Days" hyperlink
        Then validation should "be" displayed "Days is required."
        Then Verify Randomly select any checkboxes and verify those are selected
            | days |
            | Sat  |
            | Sun  |
        Then the user clicks on "Save" button
        Then verify "1 Error found" error message should "not be" displayed

    @regression
    Scenario Outline: Verify "Dates is required." hyperlink
        When user selects Frequency "QD" from dropdown
        When user selects "Medication" from Order Type dropdown
        And user clicks on "Monthly" button
        Then user enters "11:15" in Time field
        Then the user clicks on "Save" button
        Then verify "1 Error found" error message should "be" displayed
        Then verify "Select Dates" hyperlink
        Then click on "Select Dates" hyperlink
        Then validation should "be" displayed "Dates is required."
        Then user selects dates "1,15,16" form the calendar
        Then the user clicks on "Save" button
        Then verify "1 Error found" error message should "not be" displayed

    @regression
    Scenario Outline: Verify "Days is required." hyperlink
        When user selects Frequency "QD" from dropdown
        When user selects "Medication" from Order Type dropdown
        And user clicks on "Monthly" button
        Then user select "Days of the Week" radio button
        Then user enters "11:15" in Time field
        Then the user clicks on "Save" button
        Then verify "2 Errors found" error message should "be" displayed
        Then verify "Weeks of the Month" hyperlink
        Then verify "Days" hyperlink
        Then user clicks on Weeks of the Month drop down in Every Months Tab
        Then user choose "1st" in Frequency and Administration
        Then verify "Days" hyperlink
        Then click on "Days" hyperlink
        Then validation should "be" displayed "Days is required."
        Then user click on Days drop down in Every Months Tab
        Then user choose "Tue" in Frequency and Administration
        Then verify "1 Error found" error message should "not be" displayed
        Then the user clicks on "Save" button

    @regression
    Scenario Outline: Verify "Select Month" and "Days of the Month"  hyperlink
        When user selects Frequency "QD" from dropdown
        When user selects "Medication" from Order Type dropdown
        And user clicks on "Monthly" button
        Then user clicks on "Select Months" tab
        Then user enters "11:15" in Time field
        Then the user clicks on "Save" button
        Then verify "2 Errors found" error message should "be" displayed
        Then verify "Select Months" hyperlink
        Then verify "Select Dates" hyperlink
        Then user clicks on Select Months dropdown
        Then user choose "Mar" in Frequency and Administration
        Then verify "1 Error found" error message should "be" displayed
        Then click on "Select Dates" hyperlink
        Then validation should "be" displayed "Dates is required."
        Then user selects dates "4" form the calendar
        Then verify "1 Error found" error message should "not be" displayed

    @regression
    Scenario Outline: Verify "Select Months","Days" and "Weeks of the Month"  hyperlink
        When user selects Frequency "QD" from dropdown
        When user selects "Medication" from Order Type dropdown
        And user clicks on "Monthly" button
        Then user clicks on "Select Months" tab
        Then user select "Days of the Week" radio button
        Then user enters "11:15" in Time field
        Then the user clicks on "Save" button
        Then verify "3 Errors found" error message should "be" displayed
        Then verify "Select Months" hyperlink
        Then verify "Weeks of the Month" hyperlink
        Then verify "Days" hyperlink
        Then user clicks on Select Months dropdown
        Then user choose "Mar" in Frequency and Administration
        Then user enters "10:15" in Time field
        Then verify "2 Errors found" error message should "be" displayed
        Then user clicks on Weeks of the Month drop down in Select Months Tab
        Then user choose "1st" in Frequency and Administration
        Then verify "1 Error found" error message should "be" displayed
        Then user click on Days drop down in Select Months Tab
        Then user choose "Tue" in Frequency and Administration
        Then verify "1 Error found" error message should "not be" displayed

    @regression
    Scenario Outline: Verify "Medication Group" hyperlink
        When user selects Frequency "QD" from dropdown
        When user selects "Medication" from Order Type dropdown
        When user selects "Medication Group" from Medication Type dropdown
        Then user enters "11:15" in Time field
        Then the user clicks on "Save" button
        Then verify "1 Error found" error message should "be" displayed
        Then verify "Medication Group" hyperlink
        Then click on "Medication Group" hyperlink
        Then validation should "be" displayed "Medication group is required."
        Then user search and select from Medication Group dropdown
        Then the user clicks on "Save" button
        Then the user sees the message "Administration Schedule saved successfully."

    @regression
    Scenario Outline: Verify "Duration Type" hyperlink
        When user selects Frequency "QD" from dropdown
        When user selects "Medication" from Order Type dropdown
        Then user search and select from DrugName dropdown
        Then verify user "is" able to select values in "Duration" text field
            | positiveValues |
            | 5              |
        Then user enters "11:15" in Time field
        Then the user clicks on "Save" button
        Then verify "1 Error found" error message should "be" displayed
        Then verify "Duration Type" hyperlink
        Then click on "Duration Type" hyperlink
        Then validation should "be" displayed "Duration Type is required."
        Then user selects value "Days" from dropdown field
        Then the user clicks on "Save" button
        Then verify "1 Error found" error message should "not be" displayed


    @regression
    Scenario Outline: Verify "Duration" hyperlink
        When user selects Frequency "QD" from dropdown
        When user selects "Medication" from Order Type dropdown
        Then user search and select from DrugName dropdown
        Then user enters "11:15" in Time field
        Then verify user "is" able to select values in "Duration" text field
            | positiveValues |
            | 5              |
        Then user selects value "Days" from dropdown field
        Then remove the added duration from the dropdown
        Then the user clicks on "Save" button
        Then verify "1 Error found" error message should "be" displayed
        Then verify "Duration" hyperlink
        Then click on "Duration" hyperlink
        Then validation should "be" displayed "Duration is required."
        Then verify user "is" able to select values in "Duration" text field
            | positiveValues |
            | 5              |
        Then the user clicks on "Save" button
        Then verify "1 Error found" error message should "not be" displayed

    @regression
    Scenario Outline: Verify Reset option for switching between two sections on Daily
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

    @regression
    Scenario Outline: Verify Reset option for switching between two sections on Cyclical
        When user selects Frequency "QD" from dropdown
        And user clicks on "Cyclical" button
        Then "Duration" Field should be blank
        Then "Duration Type" Field should be blank
        Then verifies Time fields should be blank
        And user click on "Time Range" radio Button
        Then "Duration" Field should be blank
        Then "Duration Type" Field should be blank
        Then user selects value "Months" from dropdown field
        Then user selects value "1" from Duration dropdown field
        When user selects "Every Other Day" from select cycle dropdown
        And user click on "Specific Time" radio Button
        Then "Duration" Field should be blank
        Then "Duration Type" Field should be blank
        Then user enters "10:45 AM" in Time field
        Then user selects value "Days" from dropdown field
        Then user selects value "1" from Duration dropdown field
        And user clicks on "Monthly" button
        Then "Duration" Field should be blank
        Then "Duration Type" Field should be blank
        Then user selects value "Months" from dropdown field
        Then user selects value "1" from Duration dropdown field
        Then user click on X Button on Duration Type field
        Then "Duration Type " label should "be" highlighted with red border
        Then validation should "be" displayed "Duration Type is required."
        And user clicks on "Monthly" button
        And user clicks on "Cyclical" button
        Then validation should "not be" displayed "Duration Type is required."

    @regression
    Scenario Outline: Verify Reset option for switching between two sections on Weekly
        When user selects Frequency "QD" from dropdown
        And user clicks on "Weekly" button
        Then "Duration" Field should be blank
        Then "Duration Type" Field should be blank
        Then verifies Time fields should be blank
        Then user enters "10:45 AM" in Time field
        Then user selects value "Weeks" from dropdown field
        Then user selects value "1" from Duration dropdown field
        And user clicks on "Monthly" button
        And user clicks on "Weekly" button
        Then "Duration" Field should be blank
        Then "Duration Type" Field should be blank
        Then user selects value "Weeks" from dropdown field
        Then user selects value "1" from Duration dropdown field
        Then user click on X Button on Duration Type field
        Then "Duration Type " label should "be" highlighted with red border
        Then validation should "be" displayed "Duration Type is required."
        And user clicks on "Monthly" button
        And user clicks on "Cyclical" button
        Then validation should " not be" displayed "Duration Type is required."

    @regression
    Scenario Outline: Verify Reset option for switching between two sections on Monthly
        When user selects Frequency "QD" from dropdown
        And user clicks on "Monthly" button
        Then "Duration" Field should be blank
        Then "Duration Type" Field should be blank
        Then user selects dates "14" form the calendar
        Then user selects value "Months" from dropdown field
        Then user selects value "1" from Duration dropdown field
        Then user clicks on "Select Months" tab
        Then user select "Every Months" tab in Monthly
        Then "Duration" Field should be blank
        Then "Duration Type" Field should be blank
        Then user choose "4" in Frequency and Administration
        Then user choose "4" in Frequency and Administration
        Then validation should "be" displayed "Dates is required."
        Then user clicks on "Select Months" tab
        Then user select "Every Months" tab in Monthly
        Then validation should "not be" displayed "Dates is required."
        Then user selects "Days of the Week" on Repeat tab
        Then user click on Days drop down in Every Months Tab
        Then user choose "Tue" in Frequency and Administration
        Then user selects value "Months" from dropdown field
        Then user selects value "1" from Duration dropdown field
        Then user selects "Days of the Month" on Repeat tab
        Then user selects "Days of the Week" on Repeat tab
        Then "Duration" Field should be blank
        Then "Duration Type" Field should be blank
        Then user selects "Days of the Month" on Repeat tab
        Then user selects "Days of the Week" on Repeat tab
        Then user clicks on "Select Months" tab
        Then user clicks on Select Months dropdown
        Then user choose "Jun" in Frequency and Administration
        Then user select "Every Months" tab in Monthly
        Then user clicks on "Select Months" tab
        Then user clicks on Select Months dropdown
        Then user checks "<Months>" should be not checked
        Examples:
            | Months                                          |
            | Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec |

    @regression
    Scenario Outline: Verify Time field is highlighted when focus and defocus
        When user selects Frequency "QD" from dropdown
        Then user focus and defocus on Time field
        Then user verifies the border color and label of the Time Field
        Then validation should "be" displayed "111 is an invalid time."
        Then user enter valid value in time field
        Then validation should "not be" displayed "111 is an invalid time."

    @regression
    Scenario Outline: Verify Time field errors are resolved sequentially
        When user selects Frequency "TID" from dropdown
        Then user enters same values for two time fields
        Then the user clicks on "Save" button
        Then validation should "be" displayed "Time is required."
        Then user enter valid value in 3rd time field
        Then the user clicks on "Save" button
        Then validation should "be" displayed "Time should be unique."

    @sanity @regression
    Scenario: Verify the functionality of Duration Type Dropdown during edit
        Then User deletes the created Admin schedule "1" from DB
        And User creates Admin Schedule with repeats as given "Daily"
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime | StartTime         | EndTime           | Time              | Duration | DurationType |
            | BID       |     | Medication     | Drug Name           | Zyvox       | Unit 1 | Room 1, Room 2 | Time Range | 10:45 AM,09:20 PM | 10:46 AM,09:27 PM | 10:42 AM,09:21 PM | 1        | Days         |
        Then User types "zyvox" character in text field
        When User clicks the first Administration Schedule
        Then user verifies the values in the Duration Type dropdown when "Daily" is selected
        Then the user clicks on "Cyclical" button
        Then user verifies the values in the Duration Type dropdown when "Cyclical" is selected
        Then the user clicks on "Weekly" button
        Then user verifies the values in the Duration Type dropdown when "Weekly" is selected
        Then the user clicks on "Monthly" button
        Then user verifies the values in the Duration Type dropdown when "Monthly" is selected

    @regression
    Scenario Outline: Verify time field when user enters 24 hrs
        When user selects Frequency "QD" from dropdown
        Then user validates the Time field with 24 hour format
            | time  | values  | exactTime |
            | 0000  | valid   | 12:00 AM  |
            | 0025  | valid   | 12:25 AM  |
            | 0059  | valid   | 12:59 AM  |
            | 0060  | invalid |           |
            | 0075  | invalid |           |
            | 0099  | invalid |           |
            | 0100  | valid   | 01:00 AM  |
            | 0128  | valid   | 01:28 AM  |
            | 0159  | valid   | 01:59 AM  |
            | 0160  | invalid |           |
            | 0199  | invalid |           |
            | 0200  | valid   | 02:00 AM  |
            | 0259  | valid   | 02:59 AM  |
            | 0260  | invalid |           |
            | 0299  | invalid |           |
            | 0300  | valid   | 03:00 AM  |
            | 0325  | valid   | 03:25 AM  |
            | 0359  | valid   | 03:59 AM  |
            | 0360  | invalid |           |
            | 0459  | valid   | 04:59 AM  |
            | 0489  | invalid |           |
            | 0500  | valid   | 05:00 AM  |
            | 0560  | invalid |           |
            | 0659  | valid   | 06:59 AM  |
            | 0660  | invalid |           |
            | 0701  | valid   | 07:01 AM  |
            | 0799  | invalid |           |
            | 0800  | valid   | 08:00 AM  |
            | 0860  | invalid |           |
            | 0959  | valid   | 09:59 AM  |
            | 0960  | invalid |           |
            | 1000  | valid   | 10:00 AM  |
            | 1080  | invalid |           |
            | 1101  | valid   | 11:01 AM  |
            | 1199  | invalid |           |
            | 1200  | valid   | 12:00 PM  |
            | 1201  | valid   | 12:01 PM  |
            | 1259  | valid   | 12:59 PM  |
            | 1260  | invalid |           |
            | 1300  | valid   | 01:00 PM  |
            | 1360  | invalid |           |
            | 1400  | valid   | 02:00 PM  |
            | 1460  | invalid |           |
            | 1500  | valid   | 03:00 PM  |
            | 1575  | invalid |           |
            | 1699  | invalid |           |
            | 1759  | valid   | 05:59 PM  |
            | 1760  | invalid |           |
            | 1800  | valid   | 06:00 PM  |
            | 1860  | invalid |           |
            | 1900  | valid   | 07:00 PM  |
            | 1960  | invalid |           |
            | 2000  | valid   | 08:00 PM  |
            | 2060  | invalid |           |
            | 2100  | valid   | 09:00 PM  |
            | 2160  | invalid |           |
            | 2200  | valid   | 10:00 PM  |
            | 2260  | invalid |           |
            | 2300  | valid   | 11:00 PM  |
            | 2360  | invalid |           |
            | 2400  | valid   | 12:00 AM  |
            | 2491  | invalid |           |
            | 9999  | invalid |           |
            | 2856  | invalid |           |
            | 24    | invalid |           |
            | 24p   | invalid |           |
            | 24a   | invalid |           |
            | 24 pm | invalid |           |
            | 24 am | invalid |           |
            | 24 AM | invalid |           |
            | 24 PM | invalid |           |
            | 25    | invalid |           |
            | 99    | invalid |           |

    @regression
    Scenario Outline: Verify Time field is highlighted when focus and defocus
        When user selects Frequency "Q6H" from dropdown
        Then user focus and defocus on Time field
        Then user verifies the border color and label of the Time Field
        Then validation should "be" displayed "111 is an invalid time."
        Then user enter valid value in time field
        Then validation should "not be" displayed "111 is an invalid time."

    @regression
    Scenario Outline: Verify Time field errors are resolved sequentially
        When user selects Frequency "Q3H" from dropdown
        Then user enters same values for two time fields
        Then the user clicks on "Save" button
        Then validation should "be" displayed "Time is required."
        Then user enter valid value in 3rd time field
        Then the user clicks on "Save" button
        Then validation should "be" displayed "Time should be unique."

    @regression
    Scenario:Verify(QW,BIW &TIW) other repeats is disabled and choose days is restricted repectively,also user needs to change then user has to unselect and select another
        When user selects Frequency "<Frequency>" from dropdown
        When user selects "<Order Type>" from Order Type dropdown
        Then verify "<Repeats>" repeats is enabled and other repeats is disabled
        Then the user clicks on "<Repeats>" button
        Then user check "<ChooseDays>" from ChooseDays
        Then verify "<No0fDisabled checkboxes>" checkboxes are disabled
        Then user check "<ChooseDays>" from ChooseDays
        Then verify all the checkboxes are enabled
        Then user check "<Changed ChooseDays>" from ChooseDays
        Then verify "<No0fDisabled checkboxes>" checkboxes are disabled
        Examples:
            | Frequency | Order Type | Repeats | ChooseDays  | No0fDisabled checkboxes | Changed ChooseDays |
            | QW        | Medication | Weekly  | Sun         | 6                       | Mon                |
            | BIW       | Medication | Weekly  | Sun,Mon     | 5                       | Tue,Wed            |
            | TIW       | Medication | Weekly  | Sun,Mon,Tue | 4                       | Mon,Tue,Wed        |


    @regression
    Scenario: Verify QW,BIW and TIW after saving and editing
        And User creates Admin Schedule with repeats as given "Weekly"
            | frequency   | prn | orderTypeValue | medicationTypeValue | searchQuery   | Unit   | Room           | ChooseTime    | StartTime   | EndTime  | Time     | Duration | DurationType | EveryWeek | ChooseDays   |
            | <Frequency> |     | Medication     | Drug Name           | <searchQuery> | Unit 1 | Room 1, Room 2 | Specific Time | <StartTime> | 10:48 AM | 10:46 AM | 1        | Weeks        | 2         | <ChooseDays> |
        Then User types "<searchQuery>" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then user verifies the summary description for "<Repeats>" summary fields
            | frequency   | prn | orderTypeValue | medicationTypeValue | searchQuery   | Unit   | Room           | ChooseTime    | StartTime   | EndTime  | Time     | Duration | DurationType | EveryWeek | ChooseDays   |
            | <Frequency> |     | Medication     | Drug Name           | <searchQuery> | Unit 1 | Room 1, Room 2 | Specific Time | <StartTime> | 10:48 AM | 10:46 AM | 1        | Weeks        | 2         | <ChooseDays> |
        Then verify "<Repeats>" repeats is enabled and other repeats is disabled
        Then verify "<No0fDisabled checkboxes>" checkboxes are disabled
        Then user check "<ChooseDays>" from ChooseDays
        Then verify all the checkboxes are enabled
        Then user check "<Changed ChooseDays>" from ChooseDays
        Then verify "<No0fDisabled checkboxes>" checkboxes are disabled
        Examples:
            | Frequency | Repeats | ChooseDays    | No0fDisabled checkboxes | Changed ChooseDays | searchQuery |
            | QW        | Weekly  | Sun           | 6                       | Mon                | Uzedy       |
            | BIW       | Weekly  | Sun, Mon      | 5                       | Tue, Wed           | Omvoh Pen   |
            | TIW       | Weekly  | Sun, Mon, Tue | 4                       | Mon,Tue,Wed        | Hivid       |

    @regression
    Scenario:Verify (QM-Qmonth) is defaulted to month and EveryMonth-DaysOfMonth and DaysOfWeek user should be able to select only one data
        When user selects Frequency "QM" from dropdown
        When user selects "Medication" from Order Type dropdown
        Then verify "Monthly" repeats is enabled and other repeats is disabled
        Then the user clicks on "Monthly" button
        Then user select "one" date "12" from select dates
        Then user select "two" date "13" from select dates
        Then user select "Days of the Week" radio button
        Then user clicks on Weeks of the Month drop down in Every Months Tab
        Then user choose "1st" in Frequency and Administration
        Then verify "2nd,3rd,4th,Last" checkboxes of Month are disabled
        Then user click on Days drop down in Every Months Tab
        Then user choose "Tue" in Frequency and Administration
        Then verify "Sun,Mon,Wed,Thu,Fri,Sat" checkboxes of Month are disabled

    @regression
    Scenario:Verify (QM-Qmonth) is defaulted to month and SelectMonth-DaysOfMonth and DaysOfWeek user should be able to select only one data
        When user selects Frequency "QM" from dropdown
        When user selects "Medication" from Order Type dropdown
        Then verify "Monthly" repeats is enabled and other repeats is disabled
        Then the user clicks on "Monthly" button
        Then user clicks on "Select Months" tab
        Then user select "one" date "12" from select dates
        Then user select "two" date "13" from select dates
        Then user select "Days of the Week" radio button
        Then user clicks on Weeks of the Month drop down in Select Months Tab
        Then user choose "1st" in Frequency and Administration
        Then verify "2nd,3rd,4th,Last" checkboxes of Month are disabled
        Then user click on Days drop down in Select Months Tab
        Then user choose "Tue" in Frequency and Administration
        Then verify "Sun,Mon,Wed,Thu,Fri,Sat" checkboxes of Month are disabled

    @regression
    Scenario:Verify Qmonth for Save and edit (EveryMonth)
        And User creates Admin Schedule with repeats as given "Monthly"
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months | Daysof            | ChooseWeeks | WeeksOfMonth |
            | QM        | true | Medication     | Drug Name           | Zyvit       | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 10:45 AM | 5        | Months       | Every Months | 2          | 12         |        | Days of the Month |             |              |
        Then User types "Zyvit" character in text field
        When User clicks the first Administration Schedule
        Then verify "Monthly" repeats is enabled and other repeats is disabled
        Then user select "two" date "13" from select dates
        And User creates Admin Schedule with repeats as given "Monthly"
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | TabSelection | EveryMonth | ChooseDays | Months | Daysof           | ChooseWeeks | WeeksOfMonth |
            | QM        | true | Medication     | Drug Name           | Tyzeka      | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 10:45 AM | 5        | Months       | Every Months | 2          |            |        | Days of the Week | Tue         | 1st          |
        Then User types "Tyzeka" character in text field
        When User clicks the first Administration Schedule
        Then user clicks on Weeks of the Month drop down in Every Months Tab
        Then verify "2nd,3rd,4th,Last" checkboxes of Month are disabled
        Then user click on Days drop down in Every Months Tab
        Then verify "Sun,Mon,Wed,Thu,Fri,Sat" checkboxes of Month are disabled

    @regression
    Scenario:Verify Qmonth for Save and edit (SelectMonth)
        And User creates Admin Schedule with repeats as given "Monthly"
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | TabSelection  | EveryMonth | ChooseDays | Months | Daysof            | ChooseWeeks | WeeksOfMonth |
            | QM        | true | Medication     | Drug Name           | Yutiq       | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 10:45 AM | 5        | Months       | Select Months | 2          | 12         | Jan    | Days of the Month |             |              |
        Then User types "Yutiq" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then user verifies the summary description for "Monthly" summary fields
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | TabSelection  | EveryMonth | ChooseDays | Months | Daysof            | ChooseWeeks | WeeksOfMonth |
            | QM        | true | Medication     | Drug Name           | Yutiq       | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 10:45 AM | 5        | Months       | Select Months | 2          | 12         | Jan    | Days of the Month |             |              |
        Then verify "Monthly" repeats is enabled and other repeats is disabled
        Then user select "two" date "13" from select dates
        And User creates Admin Schedule with repeats as given "Monthly"
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | TabSelection  | EveryMonth | ChooseDays | Months | Daysof           | ChooseWeeks | WeeksOfMonth |
            | QM        | true | Medication     | Drug Name           | Rezyst      | Unit 2 | Room 1, Room 2 | Specific Time |           |         | 10:45 AM | 5        | Months       | Select Months | 2          |            |        | Days of the Week | Tue         | 1st          |
        Then User types "Rezyst" character in text field
        When User clicks the first Administration Schedule
        Then user clicks on Weeks of the Month drop down in Every Months Tab
        Then verify "2nd,3rd,4th,Last" checkboxes of Month are disabled
        Then user click on Days drop down in Every Months Tab
        Then verify "Sun,Mon,Wed,Thu,Fri,Sat" checkboxes of Month are disabled

    @regression
    Scenario:Verify(QOD) and other repeats is disabled
        When user selects Frequency "<Frequency>" from dropdown
        When user selects "<Order Type>" from Order Type dropdown
        Then verify "<Repeats>" repeats is enabled and other repeats is disabled
        Then user selects Frequency and verifies the number of Time fields in Repeats Tab
            | frequency | count |
            | QOD       | 1     |
        Then user selects Frequency and verifies the number of Time fields for "Time Range" in repeat block
            | frequency | count |
            | QOD       | 2     |
        Examples:
            | Frequency | Order Type | Repeats  |
            | QOD       | Medication | Cyclical |

    @regression
    Scenario: Verify QOD after saving and editing
        When User deletes the created Admin schedule "1" from DB
        When user selects Frequency "<Frequency>" from dropdown
        When user selects "<OrderType>" from Order Type dropdown
        Then user enters "<Time>" in Time field
        Then verify "<Repeats>" repeats is enabled and other repeats is disabled
        Then verify user "is" able to select values in "Duration" text field
            | positiveValues |
            | <Duration>     |
        Then user selects value "<Duration Type>" from dropdown field
        Then the user clicks on "Save" button
        Then User types "10:45 AM" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then verify "<Repeats>" repeats is enabled and other repeats is disabled
        Then User verifies the data with repeats as Cyclical
            | frequency       | orderTypeValue | medicationTypeValue | searchQuery | Unit | Room | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | CycleType       | GiveDays | DonotGiveDays |
            | every other day | Medication     |                     |             |      |      | Specific Time |           |         | 10:45 AM | 4        | Days         | Every Other Day |          |               |
        Examples:
            | Frequency | OrderType  | Cycle           | Give | Do Not Give | Duration | Duration Type | bool | Time     | Repeats  |
            | QOD       | Medication | Every Other Day |      |             | 4        | Days          | 1    | 10:45 AM | Cyclical |

    @regression
    Scenario: Verify(4XW,5XW,6XW) other repeats is disabled
        When user selects Frequency "<Frequency>" from dropdown
        When user selects "<Order Type>" from Order Type dropdown
        Then verify "<Repeats>" repeats is enabled and other repeats is disabled
        Then the user clicks on "<Repeats>" button
        Then user check "<ChooseDays>" from ChooseDays
        # Then verify "<No0fDisabled checkboxes>" checkboxes are disabled
        Then user check "<ChooseDays>" from ChooseDays
        Then verify all the checkboxes are enabled
        # Then verify "<No0fDisabled checkboxes>" checkboxes are disabled
        Examples:
            | Frequency | Order Type | Repeats | ChooseDays              | No0fDisabled checkboxes | Changed ChooseDays      |
            | 4XW       | Medication | Weekly  | Sun,Mon,Tue,Wed         | 4                       | Wed,Thu,Fri,Sat         |
            | 5XW       | Medication | Weekly  | Sun,Mon,Wed,Fri,Sat     | 4                       | Tue,Wed,Sat,Fri,Sun     |
            | 6XW       | Medication | Weekly  | Tue,Sun,Mon,Wed,Fri,Sat | 4                       | Tue,Mon,Wed,Fri,Sat,Sun |

    @regression
    Scenario: Verify 4XW,5XW and 6XW after saving and editing
        When User deletes the created Admin schedule "1" from DB
        And User creates Admin Schedule with repeats as given "Weekly"
            | frequency   | prn | orderTypeValue | medicationTypeValue | searchQuery   | Unit   | Room           | ChooseTime    | StartTime   | EndTime  | Time     | Duration | DurationType | EveryWeek | ChooseDays   |
            | <Frequency> |     | Medication     | Drug Name           | <searchQuery> | Unit 1 | Room 1, Room 2 | Specific Time | <StartTime> | 10:48 AM | 10:46 AM | 1        | Weeks        | 2         | <ChooseDays> |
        Then User types "<searchQuery>" character in text field
        When User clicks the first Administration Schedule
        Then User cpatures the Administration Schedule ID from Url
        Then user verifies the summary description for "<Repeats>" summary fields
            | frequency   | prn | orderTypeValue | medicationTypeValue | searchQuery   | Unit   | Room           | ChooseTime    | StartTime   | EndTime  | Time     | Duration | DurationType | EveryWeek | ChooseDays   |
            | <Frequency> |     | Medication     | Drug Name           | <searchQuery> | Unit 1 | Room 1, Room 2 | Specific Time | <StartTime> | 10:48 AM | 10:46 AM | 1        | Weeks        | 2         | <ChooseDays> |
        Then verify "<Repeats>" repeats is enabled and other repeats is disabled
        # Then verify "<No0fDisabled checkboxes>" checkboxes are disabled
        Then user check "<ChooseDays>" from ChooseDays
        Then verify all the checkboxes are enabled
        Then user check "<Changed ChooseDays>" from ChooseDays
        # Then verify "<No0fDisabled checkboxes>" checkboxes are disabled
        Examples:
            | Frequency | Repeats | ChooseDays         | No0fDisabled checkboxes | Changed ChooseDays | searchQuery |
            | 4XW       | Weekly  | Sun, Mon, Tue, Wed | 4                       | Tue, Wed, Thu, Fri | Uzedy       |
            | 5XW       | Weekly  | Sun, Mon           | 5                       | Tue, Wed           | Omvoh Pen   |
            | 6XW       | Weekly  | Sun, Mon, Tue      | 4                       | Mon,Tue,Wed        | Hivid       |

    @regression
    Scenario:Verify Times per day field functionality
        When user selects Frequency "_XD" from dropdown
        Then verify "Times per Day" field is dispalyed
        Then enter value "2" in Times per Day field
        Then verify "Permissible range 7-24." and "7-24" message
        Then clear the value in Times per Day field
        Then verify "Times per Day is required." and "7-24" message
        Then enter value "7" in Times per Day field
        Then verify "7" clock instance is dispalyed

    @regression
    Scenario: Verify save and summary data for _XD frequency
        When User deletes the created Admin schedule "1" from DB
        When user selects Frequency "_XD" from dropdown
        Then enter value "7" in Times per Day field
        When the user clicks on "Edit" button
        Then user selects "Unit 1" "Room 1, Room 2" checkbox
        Then the user clicks on "Confirm" button
        Then user enters "10:45 AM,11:45 AM,12:45 AM,01:45 AM,02:45 AM,06:45 AM, 08:45 AM" in Time field
        Then the user clicks on "Save" button
        And user waits
        Then user verify data of all the columns in summary grid
            | frequency             | adminSchedule                                                                           | orderType | assignedTo              |
            | _XD _XD_times per day | 7 times per day at 12:45 AM, 01:45 AM, 02:45 AM, 06:45 AM, 08:45 AM, 10:45 AM, 11:45 AM | All       | Unit 1 - Room 1, Room 2 |

    @regression
    Scenario: Verify save and edit for _XD frequency
        When User deletes the created Admin schedule "1" from DB
        When user selects Frequency "_XD" from dropdown
        Then enter value "7" in Times per Day field
        When the user clicks on "Edit" button
        Then user selects "Unit 1" "Room 1, Room 2" checkbox
        Then the user clicks on "Confirm" button
        Then user enters "3:30 PM, 4:30 PM, 5:30 PM, 6:30 PM, 7:30 PM, 8:30 PM, 9:30 PM" in Time field
        Then verify user "is" able to select values in "Duration" text field
            | positiveValues |
            | 1              |
        Then user selects value "Days" from dropdown field
        Then the user clicks on "Save" button
        And user waits
        When User clicks the first Administration Schedule
        Then User verifies the data with repeats as Daily
            | frequency         | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | ChooseTime    | StartTime | EndTime | Time                                                           | Duration | DurationType |
            | _XD_times per day |                |                     |             | Unit 1 | Room 1, Room 2 | Specific Time |           |         | 03:30 PM,04:30 PM,05:30 PM,06:30 PM,07:30 PM,08:30 PM,09:30 PM | 1        | Days         |


    @regression
    Scenario:Verify Specify Minutes field functionality
        When user selects Frequency "Q_min" from dropdown
        Then enter value "99" in Specify Minutes field
        Then verify "Permissible range 1-90." and "1-90" text
        Then clear the value in Specify Minutes field
        Then verify "Minutes are required." and "1-90" text
        Then enter value "10" in Specify Minutes field

    @regression
    Scenario: Verify save and summary data for Q_min frequency
        When User deletes the created Admin schedule "1" from DB
        When user selects Frequency "Q_min" from dropdown
        Then enter value "11" in Specify Minutes field
        When the user clicks on "Edit" button
        Then user selects "Unit 1" "Room 1, Room 2" checkbox
        Then the user clicks on "Confirm" button
        Then the user clicks on "Save" button
        And user waits
        Then user verify data of all the columns in summary grid
            | frequency | adminSchedule    | orderType | assignedTo              |
            | Q_min     | Every 11 minutes | All       | Unit 1 - Room 1, Room 2 |

    @regression
    Scenario: Verify save and edit for Q_min frequency
        When User deletes the created Admin schedule "1" from DB
        When user selects Frequency "Q_min" from dropdown
        Then enter value "20" in Specify Minutes field
        When the user clicks on "Edit" button
        Then user selects "Unit 1" "Room 1, Room 2" checkbox
        Then the user clicks on "Confirm" button
        Then verify user "is" able to select values in "Duration" text field
            | positiveValues |
            | 1              |
        Then user selects value "Days" from dropdown field
        Then the user clicks on "Save" button
        And user waits
        When User clicks the first Administration Schedule
        Then User verifies repeats for every minute
            | frequency     | unit   | room           | Duration | DurationType |
            | Every_minutes | Unit 1 | Room 1, Room 2 | 1        | Days         |



