@skip

Feature: Drug Search Page in MC SNF

    Drug Search Page in MC SNF when MultiCare Platform: Medication Orders Search OFF and MultiCare Platform: Medication Order Writer OFF

    Background: Logging into SNF and Navigating to the search page
        Given the user is logged into the SNF Url with credentials
            | url                                  | username       | password   |
            | https://qa61.matrixcare.me/Login.jsp | Orders_Support | Password@1 |

    Scenario Outline:  Orders Search Feature Flag disabled : Resident > Orders > Active Orders > Add Order > Prescription
        When the user clicks on "Facility" menu followed by "Search Facility"
        Then the user search for the facility name "matrix"
        And the user selects the facility "MatrixCare Center - NY" from search results
        And the user clicks on "Resident" menu followed by "Orders"
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the SNF med search screen
        Examples:
            | exFirstName | exLastName | exName          |
            | Ronald      | Clark      | Clark, Ronald O |

    Scenario Outline:  Orders Search Feature Flag disabled : Resident > Orders > Active Orders > Select Order > Copy Order
        When the user clicks on "Facility" menu followed by "Search Facility"
        Then the user search for the facility name "matrix"
        And the user selects the facility "MatrixCare Center - NY" from search results
        And the user clicks on "Resident" menu followed by "Orders"
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user selects the existing order then user views the Order
        Then the user clicks "Copy Order" Button that navigates to New Order
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the SNF med search screen
        Examples:
            | exFirstName | exLastName | exName          |
            | Ronald      | Clark      | Clark, Ronald O |

    Scenario Outline:  Orders Search Feature Flag enabled : Resident > Orders > Discharge Orders > Add Order > Prescription
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user selects the "Discharge Order" tab to sees the Discharge Order Page
        Then the user clicks on "Add Order" then "Presciption" on discharge order
        And the user sees the SNF med search screen
        Examples:
            | exFirstName | exLastName | exName          |
            | Ronald      | Clark      | Clark, Ronald O |

    Scenario Outline: Feature Flag disabled : Resident > Orders > Discharge Orders > Add Order > Prescription
        When the user clicks on "Facility" menu followed by "Search Facility"
        Then the user search for the facility name "matrix"
        And the user selects the facility "MatrixCare Center - NY" from search results
        And the user clicks on "Resident" menu followed by "Orders"
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user selects the "Discharge Order" tab to sees the Discharge Order Page
        Then the user clicks on "Add Order" then "Presciption" on discharge order
        And the user sees the SNF med search screen
        Examples:
            | exFirstName | exLastName | exName          |
            | Ronald      | Clark      | Clark, Ronald O |

    Scenario Outline: Feature Flag enabled : Resident (discharged resident or not admitted) > Orders > Pending Orders > Add Order > Prescription
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        # When the user clicks on "Add Order" button
        # And the user selects "Prescription" in the Order Type DDL
        # And the  user hits next after selecting the provider "Omnicare - Appleton, WI"
        # Then the user sees the SNF med search screen
        Examples:
            | exFirstName | exLastName | exName          |
            | Ronald      | Clark      | Clark, Ronald O |

    Scenario Outline: Feature Flag disabled : Resident > Orders > Discharge Orders > Add Order > Prescription
        When the user clicks on "Facility" menu followed by "Search Facility"
        Then the user search for the facility name "matrix"
        And the user selects the facility "MatrixCare Center - NY" from search results
        And the user clicks on "Resident" menu followed by "Orders"
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user selects the "Discharge Order" tab to sees the Discharge Order Page
        Then the user clicks on "Add Order" then "Presciption" on discharge order
        And the user sees the SNF med search screen
        Examples:
            | exFirstName | exLastName | exName          |
            | Ronald      | Clark      | Clark, Ronald O |
