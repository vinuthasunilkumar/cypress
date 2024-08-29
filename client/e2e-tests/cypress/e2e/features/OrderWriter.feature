
Feature: Order Writer page for the selected resident

Rule: Rule 1 Non-Physician User - Support User, Admin User

    Background: Logging into SNF as Non- Physician user and navigating to the search page
        Given the user is logged into the SNF Url with credentials
            | username       | password   |
            | Orders_Support | Password@1 |
    
    Scenario Outline: When MultiCare Platform: Medication Order Writer is turned ON, Selecting a medication brand or generic name from the Order Search sends the information to Order Writer Page
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        When the user type "<exMedName>" in the search bar
        And the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        And the user observes that left panel and order status panel are sticky while scrolling the page without order details
        Examples:
            | exFirstName | exLastName | exName          | exKind  | exMedName            |
            | Reversal    | 1Test      | 1Test, Reversal | brand   | Prozac 20 mg capsule |
            | Reversal    | 1Test      | 1Test, Reversal | generic | Prozac 20 mg capsule |
    
    Scenario Outline: TC:8075 - Left panel of the Order Writer Page after selecting brand Medication
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        Then the list of medications displayed is same as the order of Medication is the api response
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        And Order details in the left panel with "<MedName>" medication name
        # And the user sees the DUR icon for "<exAlert>" with an image
        And the Alert column shows a formulary icon for "<exIcon>" with an image
        When the user clicks on the i icon beside the medication name
        Then a sliding page shows drug information for "<exMedName>" in sync with the response from medication info endpoint
        Then the Alert column shows an alert for "<exAlert>" with an image
        
        Examples:
            | exFirstName | exLastName | exName          | exMedName          | MedName            | exKind | exIcon         | exAlert                                  |
            | Ronald      | Clark      | Clark, Ronald O | Lasix 20 mg tablet | Lasix 20 mg tablet | brand  | NotOnFormulary | Drug/Allergy : Contraindicated - Lasix\n |
    
    Scenario Outline: Left panel of the Order Writer Page after selecting Custom Medication with DUR alerts/no ingredients
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        Then the list of medications displayed is same as the order of Medication is the api response
        When the user clicks on the medication  name
        Then the user navigates to the Order Writer Page with title "New Order"
        And Order details in the left panel with "<exMedName>" medication name
        Then the Alert column shows an alert for "<exAlert>" with an image
        Examples:
            | exFirstName | exLastName | exName          | exMedName       | exAlert                                                                                       | exSource              |
            | Reversal    | 1Test      | 1Test, Reversal | Magic Mouthwash | Drug/Condition : Severe - R34Drug/Condition : Severe - E08.10Drug/Condition : Severe - E10.11 | aaaDoNotUseMedLibrary |
            | Ronald      | Clark      | Clark, Ronald O | Magic Healer    | Medication - Custom |
    
    Scenario Outline: TC:8076 - Left panel of the Order Writer Page after selecting generic Medication
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        Then the list of medications displayed is same as the order of Medication is the api response
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        And Order details in the left panel with "<MedName>" medication name
        # And the user sees the DUR icon for "<exAlert>" with an image
        When the user clicks on the i icon beside the medication name
        Then a sliding page shows drug information for "<MedName>" in sync with the response from medication info endpoint

        Examples:
            | exFirstName | exLastName | exName          | exMedName          | MedName                 | exKind  | exAlert                                  |
            | Ronald      | Clark      | Clark, Ronald O | Lasix 20 mg tablet | furosemide 20 mg tablet | generic | Drug/Allergy : Contraindicated - Lasix\n |

    Scenario Outline: TC:8087 - Instructions:  All required Instructions fields available on the page
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        Then the list of medications displayed is same as the order of Medication is the api response
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        Then the user sees the Instructions section with all fields

        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName          | MedName            | exKind |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Lasix 20 mg tablet | Lasix 20 mg tablet | brand  |
            
    Scenario Outline: Instructions: Verify First Admin Date & Time and Calculated Last Admin Date functionality with Start Date as current Date by default
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        Then the list of medications displayed is same as the order of Medication is the api response
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        When the user observes the First Admin Date & Time shows current date by default
        Then Open Ended checkbox is by default enabled then Calculated Last Admin Date & Time is disabled
        And the user unchecked the Open Ended checkbox then Calculated Last Admin Date & Time is enabled and same as First Admin Date & Time
        Then the user chose the First Admin Date & Time and the Calculated Last Admin Date & Time and verify that Calculated Last Admin Date & Time is equal or greater than Start Date

        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName          | MedName            | exKind |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Lasix 20 mg tablet | Lasix 20 mg tablet | brand  |
    
    Scenario Outline: TC:8092 - Order Writer: Instructions: Additional Instructions character validity
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        Then the list of medications displayed is same as the order of Medication is the api response
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        And the user enters the alphanumeric in the Additional Instruction field
        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName          | MedName            | exKind |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Lasix 20 mg tablet | Lasix 20 mg tablet | brand  |
    @skip
    Scenario Outline: TC:8093 - Instructions: User able to select values from dropdown field successfully
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        Then the list of medications displayed is same as the order of Medication is the api response
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        # And the user enters the value "now" from the dropdown field
        # Then the user selects the value "now" from the dropdown field

        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName          | MedName            | exKind |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Lasix 20 mg tablet | Lasix 20 mg tablet | brand  |

    Scenario: TC:8322 - Order Details : Common Instructions : Verify re-selecting preopulated instructions fills fields according to selection and clears out other field
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        Then the list of medications displayed is same as the order of Medication is the api response
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        When the user clicks on the first common instruction under the 'Common Instructions' section
        Then the 'Instructions' field in the left panel is populated with the selected common instruction text
        When the user selects a different option from the "Method" dropdown
        Then the 'Instructions' field in the left panel is updated according to the "Method" selection
        When the user selects a different option from the "Route" dropdown
        Then the 'Instructions' field in the left panel is updated according to the "Route" selection
        When the user selects a different option from the "Measure" dropdown
        Then the 'Instructions' field in the left panel is updated according to the "Measure" selection
        When the user selects a different option from the "Frequency" dropdown
        Then the 'Instructions' field in the left panel is updated according to the "Frequency" selection
        When the user clicks on the first common instruction under the 'Common Instructions' section
        Then the 'Instructions' field in the left panel is populated with the selected common instruction text
        And the text in the "Method" dropdown matches the 'Instructions' field in the left panel
        And the text in the "Route" dropdown matches the 'Instructions' field in the left panel
        And the text in the "Frequency" dropdown matches the 'Instructions' field in the left panel

        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName          | MedName            | exKind |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Lasix 20 mg tablet | Lasix 20 mg tablet | brand  |

    Scenario Outline: TC:8172 - DUR Acknowledgement : DUR Acknowlegment section available for selected Brand/Generic medication if DUR icon present
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        Then the list of medications displayed is same as the order of Medication is the api response
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        When the user observes that DUR acknowlegement section available if DUR icon "<DUR_Severity>" present
        Then DUR section will show the severity alerts with count for the medication
        When severity alert count is greater than 0 then shows the Alert Type and Alert Description
        And the user chooses the single Common Override Reason from dropdown

        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName                             | MedName                                                        | exKind  | DUR_Severity    |
            | 47170        | James       | Smith      | Smith, James O  | Lasix 20 mg tablet                    | Lasix 20 mg tablet                                             | brand   | Contraindicated |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Tyblume 0.1 mg-20 mcg chewable tablet | levonorgestrel 0.1 mg-ethinyl estradiol 20 mcg chewable tablet | generic | Moderate        |

    Scenario Outline: TC:8173 - DUR Acknowledgement : DUR Acknowlegment not available if DUR icons not presents for selected custom/brand/generic medication
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        Then the list of medications displayed is same as the order of Medication is the api response
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        And the user observes that there is no DUR acknowlegement section if DUR icon "Contraindicated" not present

        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName                   | MedName                           | exKind  |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Tybost 150 mg tablet        | Tybost 150 mg tablet              | brand   |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Mag Glycinate 100 mg tablet | magnesium glycinate 100 mg tablet | generic |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Reverse-O (Antioxidant)     | Reverse-O (Antioxidant)           | brand   |

    Scenario Outline: TC:8239 - Instructions : If Instruction fields requirement not applicable checkbox disabled then mandatory icon present for required fields
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        Then the list of medications displayed is same as the order of Medication is the api response
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        And checkbox for instructions required field is disabled to show mandatory fields with mandatory icons

        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName            | MedName              | exKind |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Tybost 150 mg tablet | Tybost 150 mg tablet | brand  |

    Scenario Outline: TC:8094 - Instructions : If Instruction fields requirement not applicable checkbox enabled then mandatory icon not present for required fields
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        Then the list of medications displayed is same as the order of Medication is the api response
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        And checkbox for instructions required field is enabled to not to show mandatory icon of field
        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName            | MedName              | exKind |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Tybost 150 mg tablet | Tybost 150 mg tablet | brand  |

    Scenario Outline: Verify that values added to Order Source field and the left getting updated with selected value for the non-Physician user
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        Then the list of medications displayed is same as the order of Medication is the api response
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        When the user sees that the Order Source field is a mandatory field
        Then the user verifies that the Order Source dropdown is displayed with values and able to select a value from dropdown for non-Physician User
        Then the user observes that left panel get updated with the selected value
        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName          | MedName            | exKind |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Lasix 20 mg tablet | Lasix 20 mg tablet | brand  |

    Scenario Outline: TC8247: Diagnosis: Verify the UI of ICD-10 Diagnosis section in Order Writer Page
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        Then the list of medications displayed is same as the order of Medication is the api response
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        When the user clicks Next button to navigate to next section of the Order Writer Page
        Then the user verifies the UI of the Diagnosis section on the page
        And the user observes the Active for Resident dropdown selected by default with another dropdown
        Then the user selects the Search All dropdown then shows all search dropdown
        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName            | MedName              | exKind |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Tybost 150 mg tablet | Tybost 150 mg tablet | brand  |

    Scenario Outline: TC8248, TC8250, TC8251, TC8263, TC8397: Diagnosis: Verify user able to select a diagnosis from an existing list of active diagnosis for the field
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        Then the list of medications displayed is same as the order of Medication is the api response
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        And the user clicks Next button to navigate to next section of the Order Writer Page
        When the user sees the option for selecting the active existing diagnosis of the Resident
        Then user enter "<diagnosisByCodeOrDesc>" on the right dropdown of active for resident to select existing diagnosis
        And the left panel get updated with the selected Diagnosis with ICD10 code
        And the user able to delete the selected diagnosis by delete button icon
        # Example includes to test entered text are not case-sensitive and gives same search result
        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName            | MedName              | exKind | diagnosisByCodeOrDesc     |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Tybost 150 mg tablet | Tybost 150 mg tablet | brand  | d5                        |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Tybost 150 mg tablet | Tybost 150 mg tablet | brand  | Hb-SS disease with crisis |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Tybost 150 mg tablet | Tybost 150 mg tablet | brand  | D5                        |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Tybost 150 mg tablet | Tybost 150 mg tablet | brand  | HB-SS DISEASE with crisis |

    Scenario Outline: TC8398, TC8399: Diagnosis: Verify user able to search from all Diagnosis and then select the diagnosis
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        Then the list of medications displayed is same as the order of Medication is the api response
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        And the user clicks Next button to navigate to next section of the Order Writer Page
        When the user selects the Search All dropdown then shows all search dropdown
        Then the user enter "<diagnosisByCodeOrDesc>" on the right dropdown to search and select a diagnosis
        Then the user sees the Selected Diagnosis under Selected ICD10 section with delete button
        And the left panel get updated with the selected Diagnosis with ICD10 code
        And the user able to delete the selected diagnosis by delete button icon
        # Example includes to test entered text are not case-sensitive and gives same search result
        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName            | MedName              | exKind | diagnosisByCodeOrDesc |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Tybost 150 mg tablet | Tybost 150 mg tablet | brand  | gh                    |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Tybost 150 mg tablet | Tybost 150 mg tablet | brand  | A57                   |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Tybost 150 mg tablet | Tybost 150 mg tablet | brand  | GH                    |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Tybost 150 mg tablet | Tybost 150 mg tablet | brand  | a57                   |

    #Test Scenario's to Test Path Navigation When the feature flag is enabled(both), it navigate to New medication search page and then to New Order Writer Page only for prescription type

    Scenario Outline: Medication Order Writer Feature Flag enabled : Resident > Orders > Active Orders > Add Order > Prescription
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        Then the list of medications displayed is same as the order of Medication is the api response
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName            | MedName              | exKind |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Tybost 150 mg tablet | Tybost 150 mg tablet | brand  |

    #Test Scenario's to Test Path Navigation regardless of the feature flag is enabled/disabled, it navigate to SNF General Order Page

    Scenario Outline: Medication Order Writer Feature Flag enabled : Resident > Orders > Active Orders > Add Order > General Order
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "General" in the Order Type DDL
        Then the user clicks next button on the page
        Then the user navigates to the SNF General Order Page with title "General Order"
        Examples:
            | exResidentId | exFirstName | exLastName | exName          |
            | 47171        | Ronald      | Clark      | Clark, Ronald O |

    Scenario Outline: Medication Order Writer Feature Flag disabled : Resident > Orders > Active Orders > Add Order > General Order
        When the user clicks on "Facility" menu followed by "Search Facility"
        Then the user search for the facility name "matrix"
        And the user selects the facility "MatrixCare Center - NY" from search results
        And the user clicks on "Resident" menu followed by "Orders"
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "General" in the Order Type DDL
        Then the user clicks next button on the page
        Then the user navigates to the SNF General Order Page with title "General Order"
        Examples:
            | exResidentId | exFirstName | exLastName | exName          |
            | 45959        | Jack        | Holder     | Holder, Jack SS |

    Scenario Outline: Medication Order Writer Feature Flag disabled : Resident > Orders > Active Orders > Add Order > Diagnostic Order
        When the user clicks on "Facility" menu followed by "Search Facility"
        Then the user search for the facility name "matrix"
        And the user selects the facility "MatrixCare Center - NY" from search results
        And the user clicks on "Resident" menu followed by "Orders"
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Diagnostic Order" in the Order Type DDL
        And the user selects the Order Source By "Verbal"
        Then the user clicks next button on the page
        And the user navigates to the SNF Diagnostic Order Page with title "Diagnostic Order"
        Examples:
            | exResidentId | exFirstName | exLastName | exName          |
            | 40792        | Reversal    | 1Test      | 1Test, Reversal |

    Scenario Outline: Medication Order Writer Feature Flag disabled : Resident > Orders > Active Orders > Add Order > Dietary Order
        When the user clicks on "Facility" menu followed by "Search Facility"
        Then the user search for the facility name "matrix"
        And the user selects the facility "MatrixCare Center - NY" from search results
        And the user clicks on "Resident" menu followed by "Orders"
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Dietary Order" in the Order Type DDL
        Then the user clicks next button on the page
        And the user navigates to the SNF Dietary Page with title "Dietary Order"
        Examples:
            | exResidentId | exFirstName | exLastName | exName          |
            | 45959        | Jack        | Holder     | Holder, Jack SS |

    Scenario Outline: Medication Order Writer Feature Flag enabled : Resident > Orders > Active Orders > Add Order > Radiology
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Radiology" in the Order Type DDL
        Then the user selects the provider "Crabbers - Pleasantville"
        And the user clicks next button on the page
        Then the user navigates to the SNF Radiology Page with title "Radiology Order"
        Examples:
            | exResidentId | exFirstName | exLastName | exName          |
            | 47171        | Ronald      | Clark      | Clark, Ronald O |

    Scenario Outline: Medication Order Writer Feature Flag disabled : Resident > Orders > Active Orders > Add Order > Radiology
        When the user clicks on "Facility" menu followed by "Search Facility"
        Then the user search for the facility name "matrix"
        And the user selects the facility "MatrixCare Center - NY" from search results
        And the user clicks on "Resident" menu followed by "Orders"
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Radiology" in the Order Type DDL
        Then the user selects the provider "Accurate Imaging, Inc. - Oshkosh"
        And the user clicks next button on the page
        Then the user navigates to the SNF Radiology Page with title "Radiology Order"
        Examples:
            | exResidentId | exFirstName | exLastName | exName          |
            | 45959        | Jack        | Holder     | Holder, Jack SS |

    Scenario Outline: Medication Order Writer Feature Flag enabled : Resident > Medication Reconciliation > Edit > Add Order
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        And the user clicks on "Resident" menu followed by "Medication Reconciliation"
        When the user clicks on "Edit" link opens Medication Reconciliation Page
        Then the user clicks on "Add Order" button
        Then the user sees the pop window to add Order details with title "Add Order"
        Examples:
            | exResidentId | exFirstName | exLastName | exName          |
            | 47171        | Ronald      | Clark      | Clark, Ronald O |

    Scenario Outline: Medication Order Writer Feature Flag disabled : Resident > Medication Reconciliation > Edit > Add Order
        When the user clicks on "Facility" menu followed by "Search Facility"
        Then the user search for the facility name "matrix"
        And the user selects the facility "MatrixCare Center - NY" from search results
        And the user clicks on "Resident" menu followed by "Medication Reconciliation"
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Edit" link opens Medication Reconciliation Page
        Then the user clicks on "Add Order" button
        Then the user sees the pop window to add Order details with title "Add Order"
        Examples:
            | exResidentId | exFirstName | exLastName | exName          |
            | 40792        | Reversal    | 1Test      | 1Test, Reversal |


    Scenario Outline:  Medication Order Writer Feature Flag disabled : Resident > Orders > Active Orders > Select Order > Edit
        When the user clicks on "Facility" menu followed by "Search Facility"
        Then the user search for the facility name "matrix"
        And the user selects the facility "MatrixCare Center - NY" from search results
        And the user clicks on "Resident" menu followed by "Orders"
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user selects the existing order then user views the Order
        When the user clicks "Edit" Button
        Then the user sees the order page in edit mode
        Examples:
            | exResidentId | exFirstName | exLastName | exName          |
            | 45959        | Jack        | Holder     | Holder, Jack SS |

    Scenario Outline:  Medication Order Writer Feature Flag enabled : Resident > Orders > Active Orders > Select Order > Edit
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user selects the existing order then user views the Order
        Then the user clicks "Edit" Button
        Then the user sees the order page in edit mode
        Examples:
            | exResidentId | exFirstName | exLastName | exName          |
            | 47171        | Ronald      | Clark      | Clark, Ronald O |

    #Test Scenario's to Test Path Navigation When the feature flag is disabled, it navigate to SNF Order Search Page then to SNF Order Writer Page

    Scenario Outline:  Medication Order Writer Feature Flag disabled : Resident > Orders > Active Orders > Add Order > Prescription
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
            | exResidentId | exFirstName | exLastName | exName          |
            | 45959        | Jack        | Holder     | Holder, Jack SS |

    Scenario Outline: Instructions:  Ordered By field shows the Provider and Provider Group in the dropdown list associated with the resident
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        Then the user type "<exMedName>" in the search bar
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        Then the user sees for  Order that the Primary Physician name in the Ordered by field for non-Physician user        

        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName          | MedName            | exKind |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Lasix 20 mg tablet | Lasix 20 mg tablet | brand  |

    Scenario Outline:  Instructions: Ordered By field shows the Provider and Provider Group in the dropdown list associated with the  Resident for Discharge Order
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        Then the user clicks on the "Discharge Orders" tab
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Add Order DDL
        Then the user type "<exMedName>" in the search bar
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        Then the user sees for <type> Order that the Primary Physician name in the Ordered by field for non-Physician user
        Examples:
            | exFirstName | exLastName | exName         | exMedName          | MedName            | exKind | type      |
            | Teller      | Sean       | Sean, Teller O | Lasix 20 mg tablet | Lasix 20 mg tablet | brand  | discharge |
    
    Scenario Outline:  Instructions: Ordered By field shows the Provider and Provider Group in the dropdown list associated with the  Resident for Pending Orders
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        Then the user clicks on the "Pending Orders" tab
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user type "<exMedName>" in the search bar
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        Then the user sees for  Order that the Primary Physician name in the Ordered by field for non-Physician user
        Examples:
            | exFirstName | exLastName | exName              | exMedName          | MedName            | exKind |
            | Pending     | Resident   | Resident, Pending O | Lasix 20 mg tablet | Lasix 20 mg tablet | brand  |

     Rule: Rule 2 Physician User

        Background: Logging into SNF as Physician User and Navigating to the search page
            Given the user is logged into the SNF Url with credentials
                | username       | password   |
                | Physician11401 | Password@1 |
        @focus
        Scenario Outline: Verify that values added to Order Source field and the left getting updated with selected value for the Physician user
            When the user clicks on "Resident" menu followed by "Search Resident"
            Then the user search for the facility name "matrix"
            And the user selects the facility "Matrixcare Orders Platform - MN" from search results
            When the user search for the first name "<exFirstName>" and last name "<exLastName>"
            Then the user selects the "Matrixcare Orders Platform" facility from dropdown
            And the user selects the resident with name "<exName>" from the search results
            When the user clicks on "Resident" menu and then "Orders"
            Then the user clicks on "Add Order" button
            And the user selects "Prescription" in the Order Type DDL
            And the user hits next after selecting the provider "Omnicare - Appleton, WI"
            Then the user sees the med search screen
            When the user type "<exMedName>" in the search bar
            Then the list of medications displayed is same as the order of Medication is the api response
            When the user clicks on the medication <exKind> name
            Then the user navigates to the Order Writer Page with title "New Order"            
            And the user sees for  Order that the Physician name in the Ordered by field for Physician user  
            When the user sees that the Order Source field is a mandatory field          
            And the user verifies that the Order Source dropdown has default value as "Prescriber Entered" and able to select any value from dropdown for Physician user
            Then the user observes that left panel get updated with the selected value
            Examples:
                | exResidentId | exFirstName | exLastName | exName                 | exMedName          | MedName            | exKind |
                | 47171        | Jonathan    | Abbot1     | Abbot1, Jonathan Bruce | Lasix 20 mg tablet | Lasix 20 mg tablet | brand  |


    Scenario Outline: Add Additional notes in the order
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        Then the user type "<exMedName>" in the search bar
        When the user clicks on the medication <exKind> name
        Then the user navigates to the Order Writer Page with title "New Order"
        When the user clicks on the Additional Datails tab       
        Then the Pharmacy shows as "Omnicare"
        And the user checks the "Dispense As Written?" checkbox
        And the user checks the "Do Not Fill" checkbox
        And the user checks the "e-Kit" checkbox
        And the user enters "6.7" for the eKit value
        Then the ekit value accepts "6"
        And the user adds "Test Automation Notes" in the Pharmacy Notes text area
        Then the "Additional Details" in the left hand panel shows "Pharmacy - Omnicare, Dispense As Written, Do not fill, 6 doses taken from ekit."


        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName          | MedName            | exKind |
            | 47171        | Ronald      | Clark      | Clark, Ronald O | Lasix 20 mg tablet | Lasix 20 mg tablet | brand  |

                