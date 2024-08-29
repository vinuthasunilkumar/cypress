Feature: Accessibility Testing

    This file does the accessibility testing for the Orders Microservice screen

    Background: Logging into SNF and Navigating to the search page
        Given the user is logged into the SNF Url with credentials
            | url                                  | username       | password   |
            | https://qa61.matrixcare.me/Login.jsp | Orders_Support | Password@1 |
    Scenario: Accessibility Testing
        Given the user clicks on the "Order" navigation menu
        And the user sees the med search screen
        When the user type "ty" in the search bar
        Then there is a medication list displaying "10" medications starting with first "2" characters as "Ty"
        And accesibility testing is performed