@skip
Feature:  Create Libraries
    Background: Launching the library page
        Given the user is logged into the SNF Url with credentials
            | username       | password   |
            | Orders_Support | Password@1 |
        Then User clicks on "Maintenance" hyperlink
        Then User clicks on "Order Platform Configuration" hyperlink
        Then User clicks on "MatrixCare Assisted Living" hyperlink
        Then user open view tab
        Then User clicks on "Custom Medication Library List" hyperlink

    Scenario: Delete all the existing data for automation
        And user deletes the existing custom medications and libraries from DB

    @sanity @regression
    Scenario: Verify user is able to create and edit a library
        Given the user clicks on "Create New Library" button
        When the "New Custom Medication Library" wizard opens
        Then a text box with a label "Library Name" should be displayed
        Then user enters unique "<libraryName>" name
        And message and "Status" is displayed
        Then the default status should be set to "Active"
        Then the user clicks on "Active" toggle button
        Then the user clicks on "Next" button
        Then user is navigated to Custom medication summary page
        And the user sees the message "Library saved successfully."
        Then the created "<libraryName>" should "be" visible on the Custom medication summary page
        Then user clicks on the pen icon to edit
        When the "Edit Custom Medication Library" wizard opens
        Then a text box with a label "Library Name" should be displayed
        Then "<libraryName>" should be present in the library text field
        Then user enters unique "<updatedLibraryName>" name
        And message and "Status" is displayed
        Then the user clicks on "Inactive" toggle button
        Then the user clicks on "Update" button
        Then user is navigated to Custom medication summary page
        And the user sees the message "Library saved successfully."
        Then the created "<libraryName>" should "not be" visible on the Custom medication summary page
        Then the created "<updatedLibraryName>" should "be" visible on the Custom medication summary page
        Examples:
            | libraryName                                  | updatedLibraryName                           |
            | Automation Library                           | Automation Updated                           |
            | Automation Library 70 characters 70 characte | Automation Updated 70 characters 70 characte |
            | Automation Library #$%^&*!:><                | Automation Updated #$%^&*!:><                |

    @regression
    Scenario: Verify on reloading the browser, the editted library name appears
        Given the user clicks on "Create New Library" button
        Then user enters unique "<libraryName>" name
        Then the user clicks on "Active" toggle button
        Then the user clicks on "Next" button
        Then user is navigated to Custom medication summary page
        And the user sees the message "Library saved successfully."
        Then the created "<libraryName>" should "be" visible on the Custom medication summary page
        Then user clicks on the pen icon to edit
        Then user enters unique "<updatedLibraryName>" name
        Then the user clicks on "Update" button
        Then user is navigated to Custom medication summary page
        And the user sees the message "Library saved successfully."
        Then the created "<updatedLibraryName>" should "be" visible on the Custom medication summary page
        Then the user reloads the browser
        Then the created "<updatedLibraryName>" should "be" visible on the Custom medication summary page
        Examples:
            | libraryName        | updatedLibraryName |
            | Automation Library | Automation Updated |

    @regression
    Scenario: Verify on clicking on Cancel button on the New Custom Medication library popup, user is redirected to Libraries page
        Given the user clicks on "Create New Library" button
        Then user enters unique "<libraryName>" name
        Then the user clicks on "Inactive" toggle button
        Then the user clicks on "Cancel" button
        Then user should be redirected to the libraries page
        Then the created "<libraryName>" should "not be" visible on the Libraries page

        Given the user clicks on "Create New Library" button
        Then the user clicks on "Cancel" button
        Then user should be redirected to the libraries page

        Given the user clicks on "Create New Library" button
        Then user enters unique "<libraryName>" name
        Then the user reloads the browser
        Then user should be redirected to the libraries page
        Then the created "<libraryName>" should "not be" visible on the Libraries page

        Given the user clicks on "Create New Library" button
        Then the user reloads the browser
        Then user should be redirected to the libraries page

        Given the user clicks on "Create New Library" button
        Then the user clicks on Cross sign
        Then user should be redirected to the libraries page

        Given the user clicks on "Create New Library" button
        Then user enters unique "<libraryName>" name
        Then the user clicks on Cross sign
        Then user should be redirected to the libraries page
        Then the created "<libraryName>" should "not be" visible on the Libraries page
        Examples:
            | libraryName        |
            | Automation Library |

    @regression
    Scenario: Verify on clicking on Cancel button on the Edit Custom Medication library popup, user is redirected to Custom medication summary page
        Given the user clicks on "Create New Library" button
        Then user enters unique "<libraryName>" name
        Then the user clicks on "Active" toggle button
        Then the user clicks on "Next" button
        Then user is navigated to Custom medication summary page
        And the user sees the message "Library saved successfully."
        Then the created "<libraryName>" should "be" visible on the Custom medication summary page

        Then user clicks on the pen icon to edit
        Then user enters unique "<updatedLibraryName>" name
        Then the user clicks on "Cancel" button
        Then user is navigated to Custom medication summary page
        Then the created "<libraryName>" should "be" visible on the Custom medication summary page
        Then the created "<updatedLibraryName>" should "not be" visible on the Custom medication summary page

        Then user clicks on the pen icon to edit
        Then the user clicks on "Cancel" button
        Then user is navigated to Custom medication summary page
        Then the created "<libraryName>" should "be" visible on the Custom medication summary page

        Then user clicks on the pen icon to edit
        Then user enters unique "<updatedLibraryName>" name
        Then the user reloads the browser
        Then user is navigated to Custom medication summary page
        Then the created "<libraryName>" should "be" visible on the Custom medication summary page
        Then the created "<updatedLibraryName>" should "not be" visible on the Custom medication summary page

        Then user clicks on the pen icon to edit
        Then the user reloads the browser
        Then user is navigated to Custom medication summary page
        Then the created "<libraryName>" should "be" visible on the Custom medication summary page

        Then user clicks on the pen icon to edit
        Then the user clicks on Cross sign
        Then user is navigated to Custom medication summary page
        Then the created "<libraryName>" should "be" visible on the Custom medication summary page

        Then user clicks on the pen icon to edit
        Then user enters unique "<updatedLibraryName>" name
        Then the user clicks on Cross sign
        Then user is navigated to Custom medication summary page
        Then the created "<libraryName>" should "be" visible on the Custom medication summary page
        Then the created "<updatedLibraryName>" should "not be" visible on the Custom medication summary page
        Examples:
            | libraryName        | updatedLibraryName |
            | Automation Library | Automation Updated |

    @regression
    Scenario: User attempts to create a new custom medication library with invalid inputs
        Given the user clicks on "Create New Library" button
        When the "New Custom Medication Library" wizard opens
        Then a text box with a label "Library Name" should be displayed

        Then the user sees the label "0/70"

        When the user enters alphanumeric character of length "60"
        Then the user sees the label "70/70"

        When the user enters alphanumeric character of length "0"
        Then the user sees the label "10/70"

        When the user enters alphanumeric character of length "61"
        Then the user checks for maximum characters

        Then enter "AutomationTestCustomMedication¿πΩ±µ" name
        Then Verify the validation message for non-printable characters

    @regression
    Scenario: User attempts to edit a custom medication library with invalid inputs
        Given the user clicks on "Create New Library" button
        When the "New Custom Medication Library" wizard opens
        Then user enters unique "<libraryName>" name
        Then the user clicks on "Next" button
        And the user sees the message "Library saved successfully."
        Then the created "<libraryName>" should "be" visible on the Custom medication summary page

        Then user clicks on the pen icon to edit
        Then the user clears the library field

        Then the user sees the label "0/70"

        When the user enters alphanumeric character of length "60"
        Then the user sees the label "70/70"

        When the user enters alphanumeric character of length "0"
        Then the user sees the label "10/70"

        When the user enters alphanumeric character of length "61"
        Then the user checks for maximum characters

        Then enter "AutomationTestCustomMedication¿πΩ±µ" name
        Then Verify the validation message for non-printable characters

    @regression
    Scenario: Verify user is not able to create a duplicate library during save and edit
        Given the user clicks on "Create New Library" button
        Then enter "<libraryName>" name
        Then the user clicks on "Next" button
        And the user sees the message "Library saved successfully."
        Then the created "<libraryName>" should "be" visible on the Custom medication summary page

        Then User clicks on back button

        Given the user clicks on "Create New Library" button
        Then enter "<libraryName>" name
        Then the user clicks on "Next" button
        Then user sees the validation alert as '<message>'
        Then enter "<libraryNameUpdated>" name
        Then the user clicks on "Next" button
        Then the created "<libraryNameUpdated>" should "be" visible on the Custom medication summary page

        Then user clicks on the pen icon to edit
        Then enter "<libraryName>" name
        Then the user clicks on "Update" button
        Then user sees the validation alert as '<message>'
        Examples:
            | libraryName                  | libraryNameUpdated | message                                                                       |
            | Automation Library Duplicate | Automation Updated | A library already exists with the same name. The library name must be unique. |

    @regression
    Scenario: Verify user is not able to create a blank library during save and edit
        Given the user clicks on "Create New Library" button
        Then user enters unique "<libraryNameToCreate>" name
        Then the user clicks on "Next" button
        And the user sees the message "Library saved successfully."
        Then the created "<libraryNameToCreate>" should "be" visible on the Custom medication summary page

        Then user clicks on the pen icon to edit
        Then the user clears the library field
        Then the user clicks on "Update" button
        Then user sees the validation message as '<message>'
        Then the user clicks on "Cancel" button

        Then User clicks on back button

        Given the user clicks on "Create New Library" button
        Then the user clicks on "Next" button
        Then user sees the validation message as '<message>'
        Examples:
            | message                       | libraryNameToCreate      |
            | 0/70Library name is required. | Automation Library Blank |

    @regression
    Scenario: Verify the library text field with Trailing, Leading, Blank Spaces during save and edit
        Given the user clicks on "Create New Library" button
        When the "New Custom Medication Library" wizard opens
        Then enter "<libraryName>" name with spaces
        Then the user clicks on "Next" button
        And the user sees the message "Library saved successfully."
        Then the created "<expectedLibraryName>" should "be" visible on the Custom medication summary page
        Then user clicks on the pen icon to edit
        Then user enters unique "<libraryName>" name
        Then the user clicks on "Update" button
        And the user sees the message "Library saved successfully."
        Then the created "<expectedLibraryName>" should "be" visible on the Custom medication summary page
        Examples:
            | libraryName                     | expectedLibraryName             |
            | Automation Leading              | Automation Leading              |
            | Automation Trailing             | Automation Trailing             |
            | Automation Trailing and Leading | Automation Trailing and Leading |

    @sanity @regression
    Scenario: Verify the library text field with blank spaces
        Given the user clicks on "Create New Library" button
        When the "New Custom Medication Library" wizard opens
        Then enter "<libraryName>" name with spaces
        Then the user clicks on "Next" button
        Then the "New Custom Medication Library" wizard opens
        Examples:
            | libraryName |
            | spaces      |

    @regression
    Scenario: Verify on clicking on back button, user is navigated to libraries page
        Given the user clicks on "Create New Library" button
        When the "New Custom Medication Library" wizard opens
        Then a text box with a label "Library Name" should be displayed
        Then user enters unique "<libraryName>" name
        Then the user clicks on "Active" toggle button
        Then the user clicks on "Next" button
        Then user is navigated to Custom medication summary page
        And the user sees the message "Library saved successfully."
        Then the created "<libraryName>" should "be" visible on the Custom medication summary page
        Then the user clicks on "Back" button
        Then user should be redirected to the libraries page
        Examples:
            | libraryName        |
            | Automation Library |

    @regression
    Scenario: Verify the name and status in the library list page
        Given the user clicks on "Create New Library" button
        When the "New Custom Medication Library" wizard opens
        Then user enters unique "<libraryName>" name
        Then the user clicks on "<status>" toggle button
        Then the user clicks on "Next" button
        Then user is navigated to Custom medication summary page
        Then the user clicks on "Back" button
        Then user should be redirected to the libraries page
        Then the created "<libraryName>" should "be" visible on the Libraries page
        And Verify the name "<libraryName>" and status "<status>" are correct
        Examples:
            | libraryName                 | status   |
            | Automation Library Inactive | Inactive |
            | Automation Library Active   | Active   |

    @sanity @regression
    Scenario: Verify Text on Custom Medication Library List page
        Then user is able to see "Custom Medication Library List" on list page
        And the user can view a table id with the "2" columns
            | column_header |
            | Status        |
            | Library Name  |
        Then user is able to see "Import List" and "Export List" Button
        Then "Create New Library" button should be displayed on list page

    @sanity @regression
    Scenario: Verify pagination for above 10 Records
        Given user creates "15" custom medication Library with name starting with "Automation" through API
        Then Pagination should "be" visible
        Then user is able to see 10 records in Library page

    @regression
    Scenario: Verify Library Name will be sortable ascending and descending
        Given user creates "10" custom medication Library with name starting with "Automation" through API
        Then verify up arrow icon
        Then the sort order of cust med Library should be "asc"
        When the user clicks on the arrow button next to Library Name
        Then verify down arrow icon
        Then the sort order of cust med Library should be "desc"
        When the user clicks on the arrow button next to Library Name
        Then the sort order of cust med Library should be "asc"

    @regression
    Scenario: Verify the arrow buttons in pagination
        Given user creates "30" custom medication Library with name starting with "Automation" through API
        Then the "previuos" navigation arrow should be "disabled"
        And the "first" navigation arrow should be "disabled"
        When user navigates to page number "3"
        And the "previuos" navigation arrow should be "enabled"
        And the "first" navigation arrow should be "enabled"
        And the "next" navigation arrow should be "enabled"
        And the "last" navigation arrow should be "enabled"
        When the user navigates to last page
        Then the "next" navigation arrow should be "disabled"
        And the "last" navigation arrow should be "disabled"

    @regression
    Scenario: Verify duplicate Custom Medication can be added in different library
        Given the user clicks on "Create New Library" button
        Then user enters unique "<libraryName>" name
        Then the user clicks on "Next" button
        Then user is navigated to Custom medication summary page
        And the user clicks on "Create New" button
        When user Enter "<Characters>" in Custom Medication name under library
        Then the user clicks controlled substance "No" button
        Then the user clicks on "Save" button
        Then the user clicks on the "Custom Medication" navigation menu
        Given the user clicks on "Create New Library" button
        Then user enters unique "<libraryName>" name
        Then the user clicks on "Next" button
        Then user is navigated to Custom medication summary page
        Then user types "<Characters>" in the search text field
        Then "No matches found" validation appears
        And the user clicks on "Create New" button
        When user Enter "<Characters>" in Custom Medication name under library
        Then the user clicks controlled substance "No" button
        Then the user clicks on "Save" button
        Then the user sees the message "Custom medication saved successfully."
        Examples:
            | Characters                          |
            | AutomationDuplicateCustomMedication |

    @regression
    Scenario: Verify duplicate Custom Medication can be added in different library
        Given the user clicks on "Create New Library" button
        When the "New Custom Medication Library" wizard opens
        Then user enters unique "<libraryName>" name
        Then the user clicks on "Next" button
        Then user is navigated to Custom medication summary page
        And the user clicks on "Create New" button
        When user Enter "<Characters>" in Custom Medication name under library
        Then the user clicks controlled substance "No" button
        Then the user clicks on "Save" button
        Then the user clicks on the "Custom Medication" navigation menu
        Given the user clicks on "Create New Library" button
        Then user enters unique "<libraryName>" name
        Then the user clicks on "Next" button
        Then user is navigated to Custom medication summary page
        And the user clicks on "Create New" button
        When user Enter "AutomationCustomMedication" in Custom Medication name under library
        Then the user clicks controlled substance "No" button
        Then the user clicks on "Save" button
        Then user click on Custom Medication Name on summary page
        When user Enter "<Characters>" in Custom Medication name under library
        Then the user clicks on "Save" button
        Then the user sees the message "Custom medication saved successfully."
        Examples:
            | Characters                          |
            | AutomationDuplicateCustomMedication |

    @regression
    Scenario: Verify user is able to sort the Library name entire list for all pages
        Given user creates "30" custom medication Library with name starting with "Automation" through API
        Then the sort order of cust med Library should be "asc"
        When user navigates to the page number "2"
        Then the sort order of cust med Library should be "asc"
        When user navigates to the page number "3"
        Then the sort order of cust med Library should be "asc"
        Given the user clicks on "Create New Library" button
        Then the user clicks on "Cancel" button
        Then the sort order of cust med Library should be "asc"
        When the user clicks on the arrow button next to Library Name
        Then the sort order of cust med Library should be "desc"
        When user navigates to "1" page
        Then the sort order of cust med Library should be "desc"
        When user navigates to the page number "2"
        Then the sort order of cust med Library should be "desc"
        Given the user clicks on "Create New Library" button
        Then the user clicks on "Cancel" button
        Then the sort order of cust med Library should be "desc"
        Given the user clicks on "Create New Library" button
        Then user enters unique "<libraryName>" name
        Then the user clicks on "Next" button
        Then user is navigated to Custom medication summary page
        Then the user clicks on "Back" button
        Then the sort order of cust med Library should be "desc"
        When user navigates to the page number "3"
        Then the sort order of cust med Library should be "desc"
        When the user clicks on the arrow button next to Library Name
        Then the sort order of cust med Library should be "asc"
        When user navigates to "1" page
        Then the sort order of cust med Library should be "asc"

    @regression
    Scenario: Custom Medication Library verify User is navigated to the same page after page refresh and after clicking on Cancel button on Create New Library popup
        Given user creates "30" custom medication Library with name starting with "Automation" through API
        When user navigates to page number 3
        Then the user reloads the browser
        When user navigates to page number 3
        Given the user clicks on "Create New Library" button
        Then the user clicks on "Cancel" button
        When user navigates to page number 3

    @sanity @regression
    Scenario: Custom Medication Library verify User is navigated to the same page after user navigates on Custom Medication Library
        Given user creates "30" custom medication Library with name starting with "Automation" through API
        When user navigates to page number 3
        Then user clicks on Custom Medication Library first record
        Then User clicks on back button
        When user navigates to page number 3

    @regression
    Scenario: Verify user is able to see 1st page every time when open the library page
        Given user creates "30" custom medication Library with name starting with "Automation" through API
        Then the user reloads the browser
        When user navigates to the page number "2"
        Then close the application
        Given the user should launch "https://orders-qa.matrixcare.me/"
        Then the user clicks on the "Custom Medication" navigation menu
        Then first page should display

    @regression
    Scenario: Verfify user is able to search with full name
        Given the user clicks on "Create New Library" button
        Then user enters unique "<libraryName>" name
        Then the user clicks on "Next" button
        Then user waits
        Then User clicks on back button
        And user types "<libraryName>" in the search text field
        Then searched result should contain "<libraryName>" in the table
        Examples:
            | libraryName |
            | Cypress     |

    @sanity @regression
    Scenario: Verify user is able to search with 2 characters
        Given the user clicks on "Create New Library" button
        Then user enters unique "<libraryName>" name
        Then the user clicks on "Next" button
        Then user waits
        Then User clicks on back button
        And user types "te" in the search text field
        Then user waits
        Then searched result should contain "te" in the table
        Examples:
            | libraryName |
            | test        |

    @regression
    Scenario: Verify user is able to search using incorrect search criteria
        Given the user clicks on "Create New Library" button
        Then user enters unique "<libraryName>" name
        Then the user clicks on "Next" button
        Then user waits
        Then User clicks on back button
        And user types "Incorrect results" in the search text field
        Then "No matches found" validation appears
        Examples:
            | libraryName |
            | Auto        |

