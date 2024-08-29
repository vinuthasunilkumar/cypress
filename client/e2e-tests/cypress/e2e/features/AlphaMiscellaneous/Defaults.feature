
Feature: Defaults functionality for Frequency And Administration
    Background: Launching the App and Navigating to Frequency and Administration Tab
        Given the user should launch "https://orders-qa.matrixcare.me/"
        Then the user clicks on the "Frequency and Administration" navigation menu

    @regression
    Scenario: Verify a new default is created for fresh records
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery   | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status       | CycleType   | GiveDays   | DonotGiveDays   | EveryWeek   | ChooseDays   | TabSelection   | EveryMonth   | ChooseDays   | Months   | Daysof   | ChooseWeeks   | WeeksOfMonth   |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <searchQuery> | <Unit> | <Room> | <Rec1ChooseTime> | <Rec1StartTime> | <Rec1EndTime> | <Rec1Time> | <Duration> | <DurationType> | <Rec1Status> | <CycleType> | <GiveDays> | <DonotGiveDays> | <EveryWeek> | <ChooseDays> | <TabSelection> | <EveryMonth> | <ChooseDays> | <Months> | <Daysof> | <ChooseWeeks> | <WeeksOfMonth> |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery   | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status       | CycleType   | GiveDays   | DonotGiveDays   | EveryWeek   | ChooseDays   | TabSelection   | EveryMonth   | ChooseDays   | Months   | Daysof   | ChooseWeeks   | WeeksOfMonth   |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <searchQuery> | <Unit> | <Room> | <Rec2ChooseTime> | <Rec2StartTime> | <Rec2EndTime> | <Rec2Time> | <Duration> | <DurationType> | <Rec2Status> | <CycleType> | <GiveDays> | <DonotGiveDays> | <EveryWeek> | <ChooseDays> | <TabSelection> | <EveryMonth> | <ChooseDays> | <Months> | <Daysof> | <ChooseWeeks> | <WeeksOfMonth> |
        Then "Update Default Schedules" pop up appears
        And user verifies the popup message for "<TimeOnPopUp>"
            | frequency   |
            | <frequency> |
        And user clicks on "Yes" button
        And user is redirected to Admin summary page
        Then User types "<Rec1StartTime>" character in text field
        Then verify the default icon "is not" present
        Then User types "<Rec2Time>" character in text field
        Then verify the default icon "is" present
        When User clicks the first Administration Schedule
        And User verifies the status as "<Rec1UpdatedStatus>"
        Then User clicks on back button
        And user is redirected to Admin summary page
        Then User types "<searchQuery>" character in text field
        When User clicks the second Administration Schedule
        And User verifies the status as "<Rec2Status>"
        Examples:
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | Repeats  | Rec1ChooseTime | Rec2ChooseTime | Rec1StartTime                                         | Rec1EndTime                                           | Rec1Time          | Rec2StartTime                                         | Rec2EndTime                                           | Rec2Time                            | Duration | DurationType | Rec1Status | Rec2Status | TimeOnPopUp                                                                                                                  | Rec1UpdatedStatus | CycleType   | GiveDays | DonotGiveDays | EveryWeek | ChooseDays  | TabSelection | EveryMonth | ChooseDays | Months  | Daysof           | ChooseWeeks | WeeksOfMonth |
            | QD        | true | Medication     | Drug Name           | Weydex      | Unit 1 | Room 1, Room 2 | Daily    | Specific Time  | Specific Time  |                                                       |                                                       | 09:00 AM          |                                                       |                                                       | 09:05 AM                            | 10       | Days         | true       | true       | 09:05 AM                                                                                                                     | false             |             |          |               |           |             |              |            |            |         |                  |             |              |
            | BID       |      | Medication     | Drug Name           | Wyvac       | Unit 3 | Room 2         | Cyclical | Specific Time  | Time Range     |                                                       |                                                       | 09:10 AM,09:22 AM | 09:15 AM,09:20 AM                                     | 09:25 AM,09:30 AM                                     |                                     | 10       | Days         | true       | true       | 09:15 AM - 09:25 AM, 09:20 AM - 09:30 AM                                                                                     | false             | Custom Days | 5        | 8             |           |             |              |            |            |         |                  |             |              |
            | TID       | true | Medication     | Drug Name           | Tryptomine  | Unit 3 | Room 2         | Weekly   | Time Range     | Time Range     | 09:15 AM,09:20 AM,09:30 AM                            | 09:14 AM,09:26 AM,09:21 AM                            |                   | 09:13 AM,09:23 AM,09:33 AM                            | 09:15 AM,09:25 AM,09:28 AM                            |                                     | 10       | Weeks        | true       | true       | 09:13 AM - 09:15 AM, 09:23 AM - 09:25 AM, 09:33 AM - 09:28 AM                                                                | false             |             |          |               | 2         | Sun,Mon,Tue |              |            |            |         |                  |             |              |
            | QID       |      | Medication     | Drug Name           | Nb3         | Unit 2 | Room 2         | Monthly  | Time Range     | Specific Time  | 09:15 AM,09:20 AM,09:30 AM,09:45 AM                   | 09:16 AM,09:26 AM,09:36 AM,09:46 AM                   |                   |                                                       |                                                       | 09:12 AM,09:22 AM,09:32 AM,09:42 AM | 10       | Months       | true       | true       | 09:12 AM, 09:22 AM, 09:32 AM, 09:42 AM                                                                                       | false             |             |          |               |           |             | Every Months | 2          | 3,4,8      | Jun,Apr | Days of the Week | Tue,Wed,Thu | 1st,3rd      |
            | 6XD       | true | Medication     | Medication Group    | Analgesics  | Unit 1 | Room 1, Room 2 | Daily    | Time Range     | Time Range     | 09:15 AM,09:20 AM,09:30 AM,09:45 AM,09:50 AM,09:55 AM | 09:16 AM,09:26 AM,09:36 AM,09:46 AM,09:56 AM,09:57 AM |                   | 09:12 AM,09:22 AM,09:32 AM,09:42 AM,09:52 AM,09:53 AM | 09:13 AM,09:23 AM,09:33 AM,09:43 AM,09:53 AM,09:54 AM |                                     | 10       | Days         | true       | true       | 09:12 AM - 09:13 AM, 09:22 AM - 09:23 AM, 09:32 AM - 09:33 AM, 09:42 AM - 09:43 AM, 09:52 AM - 09:53 AM, 09:53 AM - 09:54 AM | false             |             |          |               |           |             |              |            |            |         |                  |             |              |
            | QAM       |      | Medication     | Medication Group    | Antianxiety | Unit 3 | Room 2         | Cyclical | Specific Time  | Time Range     |                                                       |                                                       | 09:10 AM          | 09:15 AM                                              | 09:25 AM                                              |                                     | 10       | Days         | true       | true       | 09:15 AM - 09:25 AM                                                                                                          | false             | Custom Days | 5        | 8             |           |             |              |            |            |         |                  |             |              |
            | Q4H       | true | Medication     | Medication Group    | Antibiotics | Unit 3 | Room 2         | Weekly   | Specific Time  | Specific Time  |                                                       |                                                       | 09:13 AM          |                                                       |                                                       | 09:43 AM                            | 10       | Weeks        | true       | true       | 09:43 AM                                                                                                                     | false             |             |          |               | 2         | Sun,Mon,Tue |              |            |            |         |                  |             |              |
            | QShift    |      | Medication     | Medication Group    | Topicals    | Unit 2 | Room 2         | Monthly  | Time Range     | Specific Time  | 09:15 AM                                              | 09:16 AM                                              |                   |                                                       |                                                       | 09:12 AM                            | 10       | Months       | true       | true       | 09:12 AM                                                                                                                     | false             |             |          |               |           |             | Every Months | 2          | 3,4,8      | Jun,Apr | Days of the Week | Tue,Wed,Thu | 1st,3rd      |
            | QD        | true | Medication     | Drug Name           | Weydex      | Unit 1 | Room 1, Room 2 | Daily    | Time Range     | Time Range     | 09:15 AM                                              | 09:16 AM                                              |                   | 09:16 AM                                              | 09:15 AM                                              |                                     | 10       | Days         | true       | true       | 09:16 AM - 09:15 AM                                                                                                          | false             |             |          |               |           |             |              |            |            |         |                  |             |              |

    @regression
    Scenario: Verify overide message is not displayed when one record is default and other one is not
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery   | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <searchQuery> | <Unit> | <Room> | <Rec1ChooseTime> | <Rec1StartTime> | <Rec1EndTime> | <Rec1Time> | <Duration> | <DurationType> | <Rec1Status> |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery   | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <searchQuery> | <Unit> | <Room> | <Rec2ChooseTime> | <Rec2StartTime> | <Rec2EndTime> | <Rec2Time> | <Duration> | <DurationType> | <Rec2Status> |
        And user is redirected to Admin summary page
        Then User types "<searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User verifies the status as "<Rec1UpdatedStatus>"
        Then User clicks on back button
        And user is redirected to Admin summary page
        Then User types "<searchQuery>" character in text field
        When User clicks the second Administration Schedule
        And User verifies the status as "<Rec2Status>"
        Examples:
            | frequency | prn  | orderTypeValue | medicationTypeValue | searchQuery | Unit   | Room           | Repeats | Rec1ChooseTime | Rec2ChooseTime | Rec1StartTime | Rec1EndTime | Rec1Time | Rec2StartTime | Rec2EndTime | Rec2Time | Duration | DurationType | Rec1Status | Rec2Status | TimeOnPopUp | Rec1UpdatedStatus |
            | QD        | true | Medication     | Drug Name           | Weydex      | Unit 1 | Room 1, Room 2 | Daily   | Specific Time  | Specific Time  |               |             | 09:00 AM |               |             | 09:05 AM | 10       | Days         | false      | true       | 09:05 AM    | false             |
            | QD        | true | Medication     | Drug Name           | Weydex      | Unit 1 | Room 1, Room 2 | Daily   | Specific Time  | Specific Time  |               |             | 09:00 AM |               |             | 09:05 AM | 10       | Days         | true       | false      | 09:05 AM    | true              |

    @regression
    Scenario: Verify on clicking on No button, default is not created for new records
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery       | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <Rec1searchQuery> | <Unit> | <Room> | <Rec1ChooseTime> | <Rec1StartTime> | <Rec1EndTime> | <Rec1Time> | <Duration> | <DurationType> | <Rec1Status> |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery       | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <Rec1searchQuery> | <Unit> | <Room> | <Rec2ChooseTime> | <Rec2StartTime> | <Rec2EndTime> | <Rec2Time> | <Duration> | <DurationType> | <Rec2Status> |
        Then "Update Default Schedules" pop up appears
        And user verifies the popup message for "<TimeOnPopUp>"
            | frequency   |
            | <frequency> |
        And user clicks on "No" button
        And Schedule exists on the add schedule page
        And User verifies the status as "<Rec2UpdatedStatus>"
        Then the user clicks on "Save" button
        Then User types "<Rec1searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User verifies the status as "<Rec1Status>"
        Then User clicks on back button
        And user is redirected to Admin summary page
        Then User types "<Rec1searchQuery>" character in text field
        When User clicks the second Administration Schedule
        And User verifies the status as "<Rec2UpdatedStatus>"
        Examples:
            | frequency | prn  | orderTypeValue | medicationTypeValue | Rec1searchQuery | Unit   | Room           | Repeats | Rec1ChooseTime | Rec2ChooseTime | Rec1StartTime | Rec1EndTime | Rec1Time | Rec2StartTime | Rec2EndTime | Rec2Time | Duration | DurationType | Rec1Status | Rec2Status | TimeOnPopUp | Rec2UpdatedStatus |
            | QD        | true | Medication     | Drug Name           | Weydex          | Unit 1 | Room 1, Room 2 | Daily   | Specific Time  | Specific Time  |               |             | 09:00 AM |               |             | 09:05 AM | 10       | Days         | true       | true       | 09:05 AM    | false             |


    @regression
    Scenario: Verify a new default is created for existing records
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery       | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status       | CycleType   | GiveDays   | DonotGiveDays   | EveryWeek   | ChooseDays   | TabSelection   | EveryMonth   | ChooseDays   | Months   | Daysof   | ChooseWeeks   | WeeksOfMonth   |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <Rec1searchQuery> | <Unit> | <Room> | <Rec1ChooseTime> | <Rec1StartTime> | <Rec1EndTime> | <Rec1Time> | <Duration> | <DurationType> | <Rec1Status> | <CycleType> | <GiveDays> | <DonotGiveDays> | <EveryWeek> | <ChooseDays> | <TabSelection> | <EveryMonth> | <ChooseDays> | <Months> | <Daysof> | <ChooseWeeks> | <WeeksOfMonth> |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery       | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status       | CycleType   | GiveDays   | DonotGiveDays   | EveryWeek   | ChooseDays   | TabSelection   | EveryMonth   | ChooseDays   | Months   | Daysof   | ChooseWeeks   | WeeksOfMonth   |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <Rec2searchQuery> | <Unit> | <Room> | <Rec1ChooseTime> | <Rec1StartTime> | <Rec1EndTime> | <Rec1Time> | <Duration> | <DurationType> | <Rec1Status> | <CycleType> | <GiveDays> | <DonotGiveDays> | <EveryWeek> | <ChooseDays> | <TabSelection> | <EveryMonth> | <ChooseDays> | <Months> | <Daysof> | <ChooseWeeks> | <WeeksOfMonth> |
        And user is redirected to Admin summary page
        Then User types "<Rec2searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery       | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status | CycleType   | GiveDays   | DonotGiveDays   | EveryWeek   | ChooseDays | TabSelection   | EveryMonth   | ChooseDays | Months   | Daysof   | ChooseWeeks   | WeeksOfMonth   |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <Rec1searchQuery> | <Unit> | <Room> | <Rec2ChooseTime> | <Rec2StartTime> | <Rec2EndTime> | <Rec2Time> | <Duration> | <DurationType> |        | <CycleType> | <GiveDays> | <DonotGiveDays> | <EveryWeek> |            | <TabSelection> | <EveryMonth> |            | <Months> | <Daysof> | <ChooseWeeks> | <WeeksOfMonth> |
        Then "Update Default Schedules" pop up appears
        And user verifies the popup message for "<TimeOnPopUp>"
            | frequency   |
            | <frequency> |
        And user clicks on "Yes" button
        And user is redirected to Admin summary page
        Then User types "<Rec1searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User verifies the status as "<Rec1UpdatedStatus>"
        Then User clicks on back button
        And user is redirected to Admin summary page
        Then User types "<Rec1searchQuery>" character in text field
        When User clicks the second Administration Schedule
        And User verifies the status as "<Rec2Status>"
        Examples:
            | frequency | prn | orderTypeValue | medicationTypeValue | Rec1searchQuery | Rec2searchQuery | Unit | Room | Repeats | Rec1ChooseTime | Rec2ChooseTime | Rec1StartTime | Rec1EndTime | Rec1Time | Rec2StartTime | Rec2EndTime | Rec2Time | Duration | DurationType | Rec1Status | Rec2Status | TimeOnPopUp         | Rec1UpdatedStatus | CycleType | GiveDays | DonotGiveDays | EveryWeek | ChooseDays  | TabSelection | EveryMonth | ChooseDays | Months | Daysof | ChooseWeeks | WeeksOfMonth |
            | QD        |     | Medication     | Drug Name           | Weydex          | Tryptomine      |      |      | Daily   | Specific Time  | Specific Time  |               |             | 09:00 AM |               |             | 09:05 AM | 10       | Days         | true       | true       | 09:05 AM            | false             |           |          |               |           |             |              |            |            |        |        |             |              |
            | Q4H       |     | Medication     | Medication Group    | Antibiotics     | Antianxiety     |      |      | Weekly  | Specific Time  | Specific Time  |               |             | 7:15 AM  |               |             | 03:16 AM | 10       | Weeks        | true       | true       | 03:16 AM            | false             |           |          |               | 2         | Sun,Mon,Tue |              |            |            |        |        |             |              |
            | QD        |     | Medication     | Drug Name           | Weydex          | Tryptomine      |      |      | Daily   | Time Range     | Time Range     | 09:15 AM      | 09:16 AM    |          | 09:16 AM      | 09:15 AM    |          | 10       | Days         | true       | true       | 09:16 AM - 09:15 AM | false             |           |          |               |           |             |              |            |            |        |        |             |              |

    @regression
    Scenario: Verify on clicking on No button, default is not created for existing records
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery       | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <Rec1searchQuery> | <Unit> | <Room> | <Rec1ChooseTime> | <Rec1StartTime> | <Rec1EndTime> | <Rec1Time> | <Duration> | <DurationType> | <Rec1Status> |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery       | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <Rec2searchQuery> | <Unit> | <Room> | <Rec1ChooseTime> | <Rec1StartTime> | <Rec1EndTime> | <Rec1Time> | <Duration> | <DurationType> | <Rec2Status> |
        And user is redirected to Admin summary page
        Then User types "<Rec2searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery       | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <Rec1searchQuery> | <Unit> | <Room> | <Rec2ChooseTime> | <Rec2StartTime> | <Rec2EndTime> | <Rec2Time> | <Duration> | <DurationType> | <Rec1Status> |
        Then "Update Default Schedules" pop up appears
        And user verifies the popup message for "<TimeOnPopUp>"
            | frequency   |
            | <frequency> |
        And user clicks on "No" button
        And Schedule exists on the edit schedule page
        And User verifies the status as "<Rec2UpdatedStatus>"
        Then the user clicks on "Save" button
        Then User types "<Rec1searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User verifies the status as "<Rec1Status>"
        Then User clicks on back button
        And user is redirected to Admin summary page
        Then User types "<Rec1searchQuery>" character in text field
        When User clicks the second Administration Schedule
        And User verifies the status as "<Rec2UpdatedStatus>"
        Examples:
            | frequency | prn | orderTypeValue | medicationTypeValue | Rec1searchQuery | Rec2searchQuery | Unit | Room | Repeats | Rec1ChooseTime | Rec2ChooseTime | Rec1StartTime | Rec1EndTime | Rec1Time                                     | Rec2StartTime | Rec2EndTime | Rec2Time                                     | Duration | DurationType | Rec1Status | Rec2Status | TimeOnPopUp                                      | Rec2UpdatedStatus |
            | 5XD       |     | Medication     | Drug Name           | Weydex          | Tryptomine      |      |      | Daily   | Specific Time  | Specific Time  |               |             | 09:15 AM,09:20 AM,09:30 AM,09:45 AM,09:50 AM |               |             | 09:12 AM,09:20 AM,09:30 AM,09:45 AM,09:50 AM | 10       | Days         | true       | false      | 09:12 AM, 09:20 AM, 09:30 AM, 09:45 AM, 09:50 AM | false             |

    @regression
    Scenario: Verify popup does not appear when user edits default to false
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery       | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <Rec1searchQuery> | <Unit> | <Room> | <Rec1ChooseTime> | <Rec1StartTime> | <Rec1EndTime> | <Rec1Time> | <Duration> | <DurationType> | <Rec1Status> |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery       | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <Rec2searchQuery> | <Unit> | <Room> | <Rec2ChooseTime> | <Rec2StartTime> | <Rec2EndTime> | <Rec2Time> | <Duration> | <DurationType> | <Rec2Status> |
        And user is redirected to Admin summary page
        Then User types "<Rec2searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery       | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <Rec1searchQuery> | <Unit> | <Room> | <Rec2ChooseTime> | <Rec2StartTime> | <Rec2EndTime> | <Rec2Time> | <Duration> | <DurationType> | <Rec1Status> |
        Then User types "<Rec1searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User verifies the status as "<Rec1Status>"
        Then User clicks on back button
        And user is redirected to Admin summary page
        Then User types "<Rec1searchQuery>" character in text field
        When User clicks the second Administration Schedule
        And User verifies the status as "<Rec2UpdatedStatus>"
        Examples:
            | frequency | prn | orderTypeValue | medicationTypeValue | Rec1searchQuery | Rec2searchQuery | Unit   | Room           | Repeats | Rec1ChooseTime | Rec2ChooseTime | Rec1StartTime | Rec1EndTime | Rec1Time | Rec2StartTime | Rec2EndTime | Rec2Time | Duration | DurationType | Rec1Status | Rec2Status | TimeOnPopUp | Rec2UpdatedStatus |
            | QD        |     | Medication     | Drug Name           | Weydex          | Tryptomine      | Unit 1 | Room 1, Room 2 | Daily   | Specific Time  | Specific Time  |               |             | 09:00 AM |               |             | 09:05 AM | 10       | Days         | true       | true       | 09:05 AM    | false             |

    @regression
    Scenario: Verify popup appears when user updates default to True
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery       | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <Rec1searchQuery> | <Unit> | <Room> | <Rec1ChooseTime> | <Rec1StartTime> | <Rec1EndTime> | <Rec1Time> | <Duration> | <DurationType> | <Rec1Status> |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery       | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <Rec2searchQuery> | <Unit> | <Room> | <Rec2ChooseTime> | <Rec2StartTime> | <Rec2EndTime> | <Rec2Time> | <Duration> | <DurationType> | <Rec2Status> |
        And user is redirected to Admin summary page
        Then User types "<Rec2searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery       | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <Rec1searchQuery> | <Unit> | <Room> | <Rec2ChooseTime> | <Rec2StartTime> | <Rec2EndTime> | <Rec2Time> | <Duration> | <DurationType> | <Rec1Status> |
        Then "Update Default Schedules" pop up appears
        And user verifies the popup message for "<TimeOnPopUp>"
            | frequency   |
            | <frequency> |
        And user clicks on "Yes" button
        And user is redirected to Admin summary page
        Then User types "<Rec1searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User verifies the status as "<Rec2Status>"
        Then User clicks on back button
        And user is redirected to Admin summary page
        Then User types "<Rec1searchQuery>" character in text field
        When User clicks the second Administration Schedule
        And User verifies the status as "<Rec2UpdatedStatus>"
        Examples:
            | frequency | prn | orderTypeValue | medicationTypeValue | Rec1searchQuery | Rec2searchQuery | Unit | Room | Repeats | Rec1ChooseTime | Rec2ChooseTime | Rec1StartTime | Rec1EndTime | Rec1Time | Rec2StartTime | Rec2EndTime | Rec2Time | Duration | DurationType | Rec1Status | Rec2Status | TimeOnPopUp | Rec2UpdatedStatus |
            | QD        |     | Medication     | Drug Name           | Weydex          | Tryptomine      |      |      | Daily   | Specific Time  | Specific Time  |               |             | 09:00 AM |               |             | 09:05 AM | 10       | Days         | true       | false      | 09:05 AM    | true              |

    @regression
    Scenario: Verify a new default is created for existing records when user changes choose time option
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery       | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status       | CycleType   | GiveDays   | DonotGiveDays   | EveryWeek   | ChooseDays   | TabSelection   | EveryMonth   | ChooseDays   | Months   | Daysof   | ChooseWeeks   | WeeksOfMonth   |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <Rec1searchQuery> | <Unit> | <Room> | <Rec1ChooseTime> | <Rec1StartTime> | <Rec1EndTime> | <Rec1Time> | <Duration> | <DurationType> | <Rec1Status> | <CycleType> | <GiveDays> | <DonotGiveDays> | <EveryWeek> | <ChooseDays> | <TabSelection> | <EveryMonth> | <ChooseDays> | <Months> | <Daysof> | <ChooseWeeks> | <WeeksOfMonth> |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery       | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status       | CycleType   | GiveDays   | DonotGiveDays   | EveryWeek   | ChooseDays   | TabSelection   | EveryMonth   | ChooseDays   | Months   | Daysof   | ChooseWeeks   | WeeksOfMonth   |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <Rec2searchQuery> | <Unit> | <Room> | <Rec1ChooseTime> | <Rec1StartTime> | <Rec1EndTime> | <Rec1Time> | <Duration> | <DurationType> | <Rec1Status> | <CycleType> | <GiveDays> | <DonotGiveDays> | <EveryWeek> | <ChooseDays> | <TabSelection> | <EveryMonth> | <ChooseDays> | <Months> | <Daysof> | <ChooseWeeks> | <WeeksOfMonth> |
        And user is redirected to Admin summary page
        Then User types "<Rec2searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery       | Unit   | Room   | ChooseTime       | StartTime       | EndTime       | Time       | Duration   | DurationType   | Status       | CycleType   | GiveDays   | DonotGiveDays   | EveryWeek   | ChooseDays | TabSelection   | EveryMonth   | ChooseDays | Months   | Daysof   | ChooseWeeks | WeeksOfMonth |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <Rec1searchQuery> | <Unit> | <Room> | <Rec2ChooseTime> | <Rec2StartTime> | <Rec2EndTime> | <Rec2Time> | <Duration> | <DurationType> | <Rec1Status> | <CycleType> | <GiveDays> | <DonotGiveDays> | <EveryWeek> |            | <TabSelection> | <EveryMonth> |            | <Months> | <Daysof> |             |              |
        Then "Update Default Schedules" pop up appears
        And user verifies the popup message for "<TimeOnPopUp>"
            | frequency   |
            | <frequency> |
        And user clicks on "Yes" button
        And user is redirected to Admin summary page
        Then User types "<Rec1searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User verifies the status as "<Rec1UpdatedStatus>"
        Then User clicks on back button
        And user is redirected to Admin summary page
        Then User types "<Rec1searchQuery>" character in text field
        When User clicks the second Administration Schedule
        And User verifies the status as "<Rec2Status>"
        Examples:
            | frequency | prn | orderTypeValue | medicationTypeValue | Rec1searchQuery | Rec2searchQuery | Unit | Room | Repeats  | Rec1ChooseTime | Rec2ChooseTime | Rec1StartTime | Rec1EndTime | Rec1Time | Rec2StartTime | Rec2EndTime | Rec2Time | Duration | DurationType | Rec1Status | Rec2Status | TimeOnPopUp         | Rec1UpdatedStatus | CycleType   | GiveDays | DonotGiveDays | EveryWeek | ChooseDays | TabSelection | EveryMonth | ChooseDays | Months  | Daysof           | ChooseWeeks | WeeksOfMonth |
            | QAM       |     | Medication     | Medication Group    | Antianxiety     | Topicals        |      |      | Cyclical | Specific Time  | Time Range     |               |             | 09:10 AM | 09:15 AM      | 09:25 AM    |          | 10       | Days         | true       | true       | 09:15 AM - 09:25 AM | false             | Custom Days | 5        | 8             |           |            |              |            |            |         |                  |             |              |
            | QShift    |     | Medication     | Medication Group    | Topicals        | Antibiotics     |      |      | Monthly  | Time Range     | Specific Time  | 09:15 AM      | 09:16 AM    |          |               |             | 09:12 AM | 10       | Months       | true       | true       | 09:12 AM            | false             |             |          |               |           |            | Every Months | 2          | 3,4,8      | Jun,Apr | Days of the Week | Tue,Wed,Thu | 1st,3rd      |


    @regression
    Scenario: Verify a new default is created for fresh records in Location
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery   | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time       | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <searchQuery> | <Rec1Unit> | <Rec1Room> | <ChooseTime> | <StartTime> | <EndTime> | <Rec1Time> | <Duration> | <DurationType> | <Rec1Status> |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery   | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time       | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <searchQuery> | <Rec2Unit> | <Rec2Room> | <ChooseTime> | <StartTime> | <EndTime> | <Rec2Time> | <Duration> | <DurationType> | <Rec2Status> |
        Then "Update Default Schedules" pop up appears
        And user verifies the popup message for Location "<LocationPopUp>","<Rec2Time>"
            | frequency   |
            | <frequency> |
        And user clicks on "Yes" button
        And user is redirected to Admin summary page
        Then User types "<searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User verifies the status as "<Rec1UpdatedStatus>"
        Then User clicks on back button
        And user is redirected to Admin summary page
        Then User types "<searchQuery>" character in text field
        When User clicks the second Administration Schedule
        And User verifies the status as "<Rec2Status>"
        Examples:
            | frequency | prn  | orderTypeValue | Repeats | medicationTypeValue | searchQuery | Rec1Unit               | Rec1Room                                                                              | Rec2Unit             | Rec2Room                                                                              | ChooseTime    | StartTime | EndTime | Rec1Time                                    | Rec2Time                                         | Duration | DurationType | Rec1Status | Rec2Status | LocationPopUp                                    | Rec2UpdatedStatus | Rec1UpdatedStatus |
            | BID+AC    | true | Medication     | Daily   | Drug Name           | Tyzeka      | Unit 1                 | Room 1                                                                                | Unit 1               | Room 1, Room 2                                                                        | Specific Time |           |         | 04:00 AM, 02:30 PM                          | 05:00 AM, 03:30 PM                               | 1        | Weeks        | true       | true       | Unit 1 - Room 1, Room 2                          | true              | true              |
            | QD        | true | Medication     | Daily   | Drug Name           | Tyzeka      | Unit 1                 | Room 1, Room 2,Room 3,Room 4                                                          | Unit 1               | Room 1,Room 2,Room 3                                                                  | Specific Time |           |         | 02:30 PM                                    | 06:20 PM                                         | 1        | Weeks        | true       | true       | Unit 1 - Room 1, Room 2, Room 3                  | true              | true              |
            | 5XD       |      | Medication     | Daily   | Drug Name           | Tyzeka      | Unit 1                 | Room 1, Room 2,Room 3,Room 4                                                          | Unit 1               | Room 1                                                                                | Specific Time |           |         | 02:30 PM,3:15 PM,08:20 AM,09:12 Am,12:05 Pm | 08:20 AM, 09:12 AM, 12:05 PM, 02:30 PM, 03:15 PM | 1        | Weeks        | true       | true       | Unit 1 - Room 1                                  | true              | true              |
            | QD        |      | Medication     | Daily   | Drug Name           | Tyzeka      | Unit 1                 | Room 1, Room 2,Room 3,Room 4                                                          | Unit 1,Unit 2        | Room 1, Room 2,Room 3,Room 4;Room 1                                                   | Specific Time |           |         | 02:30 PM                                    | 02:30 PM                                         | 1        | Weeks        | true       | true       | Unit 1 - All; Unit 2 - Room 1                    | true              | true              |
            | TID       | true | Medication     | Daily   | Drug Name           | Tyzeka      | Unit 1, Unit 2, Unit 3 | Room 1, Room 2,Room 3,Room 4;Room 1,Room 2,Room 3; Room 1,Room 2,Room 3,Room 4,Room 5 | Unit 1               | Room 1, Room 2                                                                        | Specific Time |           |         | 02:30 PM,02:45 AM,04:00PM                   | 02:45 AM, 02:30 PM, 04:00 PM                     | 1        | Weeks        | true       | true       | Unit 1 - Room 1, Room 2                          | true              | true              |
            | QD+PC     |      | Medication     | Daily   | Drug Name           | Tyzeka      | Unit 1                 | Room 1, Room 2                                                                        | Unit 1,Unit 2,Unit 3 | Room 1, Room 2,Room 3,Room 4;Room 1,Room 2,Room 3; Room 1,Room 2,Room 3,Room 4,Room 5 | Specific Time |           |         | 02:30 PM                                    | 02:30 PM                                         | 1        | Weeks        | true       | true       | MatrixCare Center                                | true              | true              |
            | QD        |      | Medication     | Daily   | Drug Name           | Tyzeka      | Unit 1, Unit 2         | Room 1, Room 2 ; Room 2, Room 3                                                       | Unit 1,Unit 3        | Room 1, Room 2,Room 3; Room 2                                                         | Specific Time |           |         | 03:30 PM                                    | 06:20 PM                                         | 1        | Weeks        | true       | true       | Unit 1 - Room 1, Room 2, Room 3; Unit 3 - Room 2 | true              | true              |
            | BID       |      | Medication     | Daily   | Drug Name           | Tyzeka      | Unit 1,Unit 2,Unit 3   | Room 1, Room 2; Room 2;Room 1                                                         | Unit 1,Unit 2        | Room 1; Room 2                                                                        | Specific Time |           |         | 02:30 PM,02:45 PM                           | 02:30 PM, 02:45 PM                               | 1        | Weeks        | true       | true       | Unit 1 - Room 1; Unit 2 - Room 2                 | true              | true              |


    @regression
    Scenario: Verify Default message is not displayed when one record is default and other one is not
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery   | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <searchQuery> | <Rec1Unit> | <Rec1Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <Rec1Status> |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery   | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <searchQuery> | <Rec2Unit> | <Rec2Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <Rec2Status> |
        And user is redirected to Admin summary page
        Then User types "<searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User verifies the status as "<Rec1UpdatedStatus>"
        Then User clicks on back button
        And user is redirected to Admin summary page
        Then User types "<searchQuery>" character in text field
        When User clicks the second Administration Schedule
        And User verifies the status as "<Rec2UpdatedStatus>"
        Examples:
            | frequency | prn | orderTypeValue | Repeats | medicationTypeValue | searchQuery | Rec1Unit | Rec1Room | Rec2Unit | Rec2Room       | ChooseTime    | StartTime | EndTime | Time    | Duration | DurationType | Rec1Status | Rec2Status | LocationPopUp           | Rec1UpdatedStatus | Rec2UpdatedStatus |
            | QD        |     | Medication     | Daily   | Drug Name           | Tyzeka      | Unit 1   | Room 1   | Unit 1   | Room 1, Room 2 | Specific Time |           |         | 2:30 PM | 1        | Weeks        | true       | false      | Unit 1 - Room 1, Room 2 | true              | false             |

    @regression
    Scenario: Verify on clicking on No button, default is not created for new records for Location
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery   | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <searchQuery> | <Rec1Unit> | <Rec1Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <Rec1Status> |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery   | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <searchQuery> | <Rec2Unit> | <Rec2Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <Rec2Status> |
        Then "Update Default Schedules" pop up appears
        And user verifies the popup message for Location "<LocationPopUp>","<Time>"
            | frequency   |
            | <frequency> |
        And user clicks on "No" button
        And Schedule exists on the add schedule page
        And User verifies the status as "<Rec2UpdatedStatus>"
        Then the user clicks on "Save" button
        Then User types "<searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User verifies the status as "<Rec1Status>"
        Then User clicks on back button
        And user is redirected to Admin summary page
        Then User types "<searchQuery>" character in text field
        When User clicks the second Administration Schedule
        And User verifies the status as "<Rec2UpdatedStatus>"
        Examples:
        Examples:
            | frequency | prn | orderTypeValue | Repeats | medicationTypeValue | searchQuery | Rec1Unit | Rec1Room | Rec2Unit | Rec2Room       | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | Rec1Status | Rec2Status | LocationPopUp           | Rec2UpdatedStatus | Rec1UpdatedStatus |
            | QD        |     | Medication     | Daily   | Drug Name           | Tyzeka      | Unit 1   | Room 1   | Unit 1   | Room 1, Room 2 | Specific Time |           |         | 02:30 PM | 1        | Weeks        | true       | true       | Unit 1 - Room 1, Room 2 | false             | true              |

    @regression
    Scenario:Verify a new default is created for existing records for Location
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery       | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <Rec1searchQuery> | <Rec1Unit> | <Rec1Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <Rec1Status> |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery       | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <Rec2searchQuery> | <Rec1Unit> | <Rec1Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <Rec2Status> |
        And user is redirected to Admin summary page
        Then User types "<Rec2searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery       | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <Rec1searchQuery> | <Rec2Unit> | <Rec2Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> |        |
        Then "Update Default Schedules" pop up appears
        And user verifies the popup message for Location "<LocationPopUp>","<Time>"
            | frequency   |
            | <frequency> |
        And user clicks on "Yes" button
        And user is redirected to Admin summary page
        Then User types "<Rec1searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User verifies the status as "<Rec1UpdatedStatus>"
        Then User clicks on back button
        And user is redirected to Admin summary page
        Then User types "<Rec1searchQuery>" character in text field
        When User clicks the second Administration Schedule
        And User verifies the status as "<Rec2Status>"
        Examples:
            | frequency | prn | orderTypeValue | medicationTypeValue | Rec1searchQuery | Rec2searchQuery | Rec1Unit | Rec1Room      | Rec2Unit      | Rec2Room                | Repeats | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | Rec1Status | Rec2Status | LocationPopUp                                            | Rec1UpdatedStatus |
            | QD        |     | Medication     | Drug Name           | Weydex          | Tryptomine      | Unit 1   | Room 1        | Unit 1        | Room 2                  | Daily   | Specific Time |           |         | 02:30 PM | 10       | Days         | true       | true       | Unit 1 - Room 1, Room 2                                  | true              |
            | QD        |     | Medication     | Drug Name           | Weydex          | Tryptomine      | Unit 1   | Room 1,Room 3 | Unit 1,Unit 2 | Room 2 ; Room 1, Room 2 | Daily   | Specific Time |           |         | 02:30 PM | 10       | Days         | true       | true       | Unit 1 - Room 1, Room 2, Room 3; Unit 2 - Room 1, Room 2 | true              |

    @regression
    Scenario: Verify on clicking on No button, default is not created for existing records for Location
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery       | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <Rec1searchQuery> | <Rec1Unit> | <Rec1Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <Rec1Status> |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery       | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <Rec2searchQuery> | <Rec1Unit> | <Rec1Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <Rec2Status> |
        And user is redirected to Admin summary page
        Then User types "<Rec2searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery       | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <Rec1searchQuery> | <Rec2Unit> | <Rec2Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> |        |
        Then "Update Default Schedules" pop up appears
        And user verifies the popup message for Location "<LocationPopUp>","<Time>"
            | frequency   |
            | <frequency> |
        And user clicks on "No" button
        And Schedule exists on the edit schedule page
        And User verifies the status as "<Rec2UpdatedStatus>"
        Then the user clicks on "Save" button
        Then User types "<Rec1searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User verifies the status as "<Rec1Status>"
        Then User clicks on back button
        And user is redirected to Admin summary page
        Then User types "<Rec1searchQuery>" character in text field
        When User clicks the second Administration Schedule
        And User verifies the status as "<Rec2UpdatedStatus>"
        Examples:
            | frequency | prn | orderTypeValue | medicationTypeValue | Rec1searchQuery | Rec2searchQuery | Rec1Unit | Rec1Room | Rec2Unit | Rec2Room | Repeats | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | Rec1Status | Rec2Status | LocationPopUp           | Rec1UpdatedStatus | Rec2UpdatedStatus |
            | QD        |     | Medication     | Drug Name           | Weydex          | Tryptomine      | Unit 1   | Room 1   | Unit 1   | Room 2   | Daily   | Specific Time |           |         | 02:30 PM | 10       | Days         | true       | true       | Unit 1 - Room 1, Room 2 | true              | false             |

    @regression
    Scenario: Verify popup does not appear when user edits default to false in Location
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery       | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <Rec1searchQuery> | <Rec1Unit> | <Rec1Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <Rec1Status> |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery       | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <Rec2searchQuery> | <Rec2Unit> | <Rec2Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <Rec2Status> |
        And user is redirected to Admin summary page
        Then User types "<Rec2searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery       | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <Rec1searchQuery> | <Rec2Unit> | <Rec2Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <Rec1Status> |
        Then User types "<Rec1searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User verifies the status as "<Rec1Status>"
        Then User clicks on back button
        And user is redirected to Admin summary page
        Then User types "<Rec1searchQuery>" character in text field
        When User clicks the second Administration Schedule
        And User verifies the status as "<Rec2UpdatedStatus>"
        Examples:
            | frequency | prn | orderTypeValue | medicationTypeValue | Rec1searchQuery | Rec2searchQuery | Rec1Unit | Rec1Room | Rec2Unit | Rec2Room | Repeats | ChooseTime    | StartTime | EndTime | Time    | Duration | DurationType | Rec1Status | Rec2Status | LocationPopUp           | Rec2UpdatedStatus |
            | QD        |     | Medication     | Drug Name           | Weydex          | Tryptomine      | Unit 1   | Room 1   | Unit 1   | Room 2   | Daily   | Specific Time |           |         | 2:30 PM | 10       | Days         | true       | true       | Unit 1 - Room 1, Room 2 | false             |

    @regression
    Scenario: Verify popup appears when user updates default to True in Location
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery       | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <Rec1searchQuery> | <Rec1Unit> | <Rec1Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <Rec1Status> |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery       | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <Rec2searchQuery> | <Rec2Unit> | <Rec2Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <Rec2Status> |
        And user is redirected to Admin summary page
        Then User types "<Rec2searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery       | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <Rec1searchQuery> | <Rec1Unit> | <Rec1Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <Rec1Status> |
        Then "Update Default Schedules" pop up appears
        And user verifies the popup message for Location "<LocationPopUp>","<Time>"
            | frequency   |
            | <frequency> |
        And user clicks on "Yes" button
        And user is redirected to Admin summary page
        Then User types "<Rec1searchQuery>" character in text field
        When User clicks the first Administration Schedule
        And User verifies the status as "<Rec1UpdatedStatus>"
        Then User clicks on back button
        And user is redirected to Admin summary page
        Then User types "<Rec1searchQuery>" character in text field
        When User clicks the second Administration Schedule
        And User verifies the status as "<Rec2UpdatedStatus>"
        Examples:
            | frequency | prn | orderTypeValue | medicationTypeValue | Rec1searchQuery | Rec2searchQuery | Rec1Unit | Rec1Room  | Rec2Unit | Rec2Room | Repeats | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | Rec1Status | Rec2Status | LocationPopUp           | Rec1UpdatedStatus | Rec2UpdatedStatus |
            | QD        |     | Medication     | Drug Name           | Weydex          | Tryptomine      | Unit 1   | Room 1 ,2 | Unit 1   | Room 2,3 | Daily   | Specific Time |           |         | 04:30 PM | 10       | Days         | true       | false      | Unit 1 - Room 1, Room 3 | true              | true              |

    @regression
    Scenario: Verify Updation for the Existing Records in Location
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery   | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <searchQuery> | <Rec1Unit> | <Rec1Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <Rec1Status> |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery   | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <searchQuery> | <Rec2Unit> | <Rec2Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <Rec2Status> |
        Then "Update Default Schedules" pop up appears
        And user verifies the popup message for Location "<LocationPopUp>","<Time>"
            | frequency   |
            | <frequency> |
        And user clicks on "Yes" button
        And user is redirected to Admin summary page
        When User clicks the second Administration Schedule
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery   | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <searchQuery> | <Rec3Unit> | <Rec3Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> |        |
        When User clicks the first Administration Schedule
        And User verifies the status as "<Rec1UpdatedStatus>"
        Then User clicks on back button
        And user is redirected to Admin summary page
        When User clicks the second Administration Schedule
        And User verifies the status as "<Rec2UpdatedStatus>"
        Examples:
            | frequency | prn | orderTypeValue | medicationTypeValue | searchQuery | Rec1Unit      | Rec1Room                              | Rec2Unit | Rec2Room | Rec3Unit | Rec3Room       | Repeats | ChooseTime    | StartTime | EndTime | Time     | Duration | DurationType | Rec1Status | Rec2Status | LocationPopUp   | Rec1UpdatedStatus | Rec2UpdatedStatus |
            | QD        |     | Medication     | Drug Name           | Weydex      | Unit 1,Unit 2 | Room 1,Room 2, Room 3, Room 4; Room 1 | Unit 2   | Room 1   | Unit 2   | Room 1, Room 3 | Daily   | Specific Time |           |         | 02:30 PM | 10       | Days         | true       | true       | Unit 2 - Room 1 | true              | true              |


    @regression @sanity
    Scenario: Verify a new default icon for fresh record and location carveout
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery   | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <searchQuery> | <Rec1Unit> | <Rec1Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <Rec1Status> |
        Then User types "<Rec1Unit>" character in text field
        Then verify the default icon "is" present
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery   | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time   | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <searchQuery> | <Rec2Unit> | <Rec2Room> | <ChooseTime> | <StartTime> | <EndTime> | <Time> | <Duration> | <DurationType> | <Rec2Status> |
        Then "Update Default Schedules" pop up appears
        And user clicks on "Yes" button
        And user is redirected to Admin summary page
        Then User types "<Rec2Room>" character in text field
        Then verify the default icon "is" present
        Examples:
            | frequency | prn  | orderTypeValue | Repeats | medicationTypeValue | searchQuery | Rec1Unit | Rec1Room | Rec2Unit | Rec2Room       | ChooseTime    | StartTime | EndTime | Time            | Duration | DurationType | Rec1Status | Rec2Status | LocationPopUp           | Rec2UpdatedStatus | Rec1UpdatedStatus |
            | BID+AC    | true | Medication     | Daily   | Drug Name           | Tyzeka      | Unit 1   | Room 1   | Unit 1   | Room 1, Room 2 | Specific Time |           |         | 2:30 PM,4:00 AM | 1        | Weeks        | true       | true       | Unit 1 - Room 1, Room 2 | true              | false             |

    @regression
    Scenario: Verify default functionality when records are override in Location For(Individual to Individual, Umbrealla to individual, Umbrealla to Umbrealla)
        Then User deletes the created Admin schedule "1" from DB
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | Repeats   | medicationTypeValue   | searchQuery   | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time       | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <Repeats> | <medicationTypeValue> | <searchQuery> | <Rec1Unit> | <Rec1Room> | <ChooseTime> | <StartTime> | <EndTime> | <Rec1Time> | <Duration> | <DurationType> | <Rec1Status> |
        Then user click on "Add Schedule" button
        And User creates Admin Schedule with repeats as given "<Repeats>"
            | frequency   | prn   | orderTypeValue   | medicationTypeValue   | searchQuery   | Unit       | Room       | ChooseTime   | StartTime   | EndTime   | Time       | Duration   | DurationType   | Status       |
            | <frequency> | <prn> | <orderTypeValue> | <medicationTypeValue> | <searchQuery> | <Rec2Unit> | <Rec2Room> | <ChooseTime> | <StartTime> | <EndTime> | <Rec2Time> | <Duration> | <DurationType> | <Rec2Status> |
        Then "Update Default Schedules" pop up appears
        And user verifies the popup message for Location "<LocationPopUp>","<Rec2Time>"
            | frequency   |
            | <frequency> |
        And user clicks on "Yes" button
        And user is redirected to Admin summary page
        Then User types "<Rec1Time>" character in text field
        Then user Verify data of "<Location1>"
        When User clicks the first Administration Schedule
        And User verifies the status as "<Rec1UpdatedStatus>"
        Then User clicks on back button
        And user is redirected to Admin summary page
        Then User types "<Rec2Time>" character in text field
        Then user Verify data of "<Location2>"
        Examples:
            | frequency | prn  | orderTypeValue | Repeats | medicationTypeValue | searchQuery | Rec1Unit | Rec1Room       | Rec2Unit | Rec2Room                    | ChooseTime    | StartTime | EndTime | Rec1Time | Rec2Time | Duration | DurationType | Rec1Status | Rec2Status | LocationPopUp                   | Rec2UpdatedStatus | Rec1UpdatedStatus | Location1               | Location2                       |
            | QD        | true | Medication     | Daily   | Drug Name           | Tyzeka      | Unit 1   | Room 1, Room 4 | Unit 1   | Room 1,Room 2,Room 3        | Specific Time |           |         | 02:30 PM | 06:20 PM | 1        | Weeks        | true       | true       | Unit 1 - Room 1, Room 2, Room 3 | true              | true              | Unit 1 - Room 4         | Unit 1 - Room 1, Room 2, Room 3 |
            | QD        | true | Medication     | Daily   | Drug Name           | Tyzeka      | Unit 1   | Room 1, Room 2 | Unit 1   | Room 1,Room 2,Room 3,Room 4 | Specific Time |           |         | 02:30 PM | 06:20 PM | 1        | Weeks        | true       | true       | Unit 1 - All                    | true              | true              | Unit 1 - Room 1, Room 2 | Unit 1 - All                    |
            | QD        | true | Medication     | Daily   | Drug Name           | Tyzeka      | Unit 1   | Room 1, Room 2 | Unit 1   | Room 1,Room 4               | Specific Time |           |         | 02:30 PM | 06:20 PM | 1        | Weeks        | true       | true       | Unit 1 - Room 1, Room 4         | true              | true              | Unit 1 - Room 2         | Unit 1 - Room 1, Room 4         |



            