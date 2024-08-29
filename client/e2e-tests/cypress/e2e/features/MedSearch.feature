Feature: Medication Search Page when MultiCare Platform: Medication Orders Search ON and MultiCare Platform: Medication Order Writer OFF

    Feature Medication Search page will search for medications, will show alerts, additional information and allow selection in SNF.

    Background: Logging into SNF and Navigating to the search page
        Given the user is logged into the SNF Url with credentials
            | username       | password   |
            | Orders_Support | Password@1 |

    Scenario Outline: Medication Search with pagination and clearing results within SNF
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        And the user can view a grid with the "4" columns
            | column_header |
            | Alerts        |
            | Item          |
            | Type          |
            | Source        |
        And the user type "t" in the search bar
        Then the user sees the message "No Data Found" in the table
        And the user type "ty" in the search bar
        Then there is a medication list displaying "20" medications starting with first "2" characters as "Ty"
        And there is pagination to navigate to further results
        When the user navigates to page "2"
        Then there is a medication list displaying "20" medications starting with first "7" characters as "Tylenol"
        And the text "Showing 21 to 40 of 104 entries" gives information on total entries
        And there are total "6" pages showing medications
        When the user navigates to page "6"
        Then there is a medication list displaying "4" medications starting with first "6" characters as "Ty"
        When the user clicks to "prevPage" icon
        Then there is a medication list displaying "20" medications starting with first "2" characters as "Ty"
        When the user clicks to "firstPage" icon
        Then there is a medication list displaying "20" medications starting with first "2" characters as "Ty"
        When the user clicks to "nextPage" icon
        Then there is a medication list displaying "20" medications starting with first "2" characters as "Ty"
        When the user clicks to "lastPage" icon
        Then there is a medication list displaying "4" medications starting with first "2" characters as "Ty"
        Examples:
            | exFirstName | exLastName | exName          |
            | Ronald      | Clark      | Clark, Ronald O |

    Scenario Outline: Search for a medication without knowing if the medication name contains a "(" or "," in order to find the medication
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        And the user type "<exMedKeyword>" in the search bar
        Then the user sees the "<exMedicationName>" in the search result
        And the medication search results will show the medications containing "<exMedKeyword>"

        Examples:
            | exFirstName | exLastName | exName          | exMedKeyword                  | exMedicationName                                                   |
            | Ronald      | Clark      | Clark, Ronald O | calcium 1250                  | Calcium-500 500 mg (as calcium carbonate 1,250 mg) chewable tablet |
            | Ronald      | Clark      | Clark, Ronald O | cholecalciferol 50000         | cholecalciferol (vitamin D3) 1,250 mcg (50,000 unit) capsule       |
            | Ronald      | Clark      | Clark, Ronald O | Solumedrol 1000               | Solu-Medrol (PF) 1,000 mg/8 mL intravenous solution                |
            | Ronald      | Clark      | Clark, Ronald O | childrens 160                 | Children's Acetaminophen 160 mg chewable tablet                    |
            | Ronald      | Clark      | Clark, Ronald O | 12pentanediol bulk 100 liquid | 1,2-pentanediol (bulk) 100 % liquid                                |

    Scenario Outline: Medication list matches with the api response
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        When the user type "ty" in the search bar
        Then the list of medications displayed is same as the order of Medication is the api response
        When the user navigates to page "2"
        Then the list of medications displayed is same as the order of Medication is the api response
        Examples:
            | exFirstName | exLastName | exName          | exMedName      | MedName        | exKind | exIcon                    | exAlert                             |
            | Ronald      | Clark      | Clark, Ronald O | Tyblume 0.1 mg | Tyblume 0.1 mg | brand  | PriorAuthorizationRequied | Drug/Condition : Moderate - E01.0\n |

    Scenario Outline: A sliding page shows additional information when we click on the i icon for a medication
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        When the user type "<exMedName>" in the search bar
        When the user clicks on the i icon beside the medication name
        Then a sliding page shows drug information for "<exMedName>" in sync with the response from medication info endpoint
        Examples:
            | exFirstName | exLastName | exName          | exMedName                             |
            | Ronald      | Clark      | Clark, Ronald O | Tylenol Junior 160 mg chewable tablet |
            | Ronald      | Clark      | Clark, Ronald O | Tylenol 325 mg capsule                |

    Scenario Outline: Generic Medication is displayed when a Brand is searched
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        When the user type "<exMedName>" in the search bar
        Then the user sees the generic name of the medication which is the same as the API response
        Examples:
            | exFirstName | exLastName | exName          | exMedName                           |
            | Reversal    | 1Test      | 1Test, Reversal | Zovirax 200 mg/5 mL oral suspension |


    Scenario Outline: DUR Alerts are shown for the medication
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        Then the Alert column shows an alert for "<exAlert>" with an image

        Examples:
            | exFirstName | exLastName | exName                 | exMedName                              | exAlert                                                                                                                                                                      |
            | Reversal    | 1Test      | 1Test, Reversal        | aspirin (bulk) 100 % powder            | Drug/Allergy : Contraindicated - The use of aspirin (bulk) may result in a reaction based on a reported history of allergy to aspirin (both contain the ingredient aspirin). |
            | Reversal    | 1Test      | 1Test, Reversal        | Tylenol 325 mg capsule                 | Duplicate Medication - Tylenol 325 mg capsule                                                                                                                                |
            | Jonathan    | Abbot1     | Abbot1, Jonathan Bruce | Hycamtin 0.25 mg capsule               | Drug/Drug : Severe - Rheumate 1 mg-1 mg-500 mg capsule                                                                                                                       |
            | Jonathan    | Abbot1     | Abbot1, Jonathan Bruce | furosemide 10 mg/mL injection solution | Drug/Condition : Moderate - diabetes mellitus, which is related to E10.10.                                                                                                   |

    Scenario Outline: DUR Alerts are shown for the Custom medications having ingredients
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        Then the Alert column shows an alert for "<exAlert>" with an image
        And the source column would show "<exSource>"

        Examples:
            | exFirstName | exLastName | exName          | exMedName       | exAlert                                                                                       | exSource              |
            | Reversal    | 1Test      | 1Test, Reversal | Magic Mouthwash | Drug/Condition : Severe - R34Drug/Condition : Severe - E08.10Drug/Condition : Severe - E10.11 | aaaDoNotUseMedLibrary |
            | Reversal    | 1Test      | 1Test, Reversal | apple           | Duplicate Medication - Tylenol 325 mg capsule                                                 | aaaDoNotUseMedLibrary |
            | Reversal    | 1Test      | 1Test, Reversal | Magic Healer    | Medication - Custom                                                                           | aaaDoNotUseMedLibrary |

    Scenario Outline: Formulary Icons are shown for the medication
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        When the user type "<exMedName>" in the search bar
        Then the Alert column shows a formulary icon for "<exIcon>" with an image

        Examples:
            | exResidentId | exFirstName | exLastName | exName          | exMedName              | exIcon         |
            | 40792        | Reversal    | 1Test      | 1Test, Reversal | Tylenol 325 mg capsule | OnFormulary    |
            | 40792        | Reversal    | 1Test      | 1Test, Reversal | Tylenol 325 mg tablet  | NotOnFormulary |

    Scenario Outline: Obsolete medications are displayed in the search results
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        And the user type "<exMedName>" in the search bar
        Then the word Obsolete is displayed in the search result next to medication
        Examples:
            | exFirstName | exLastName | exName          | exMedName                          |
            | Reversal    | 1Test      | 1Test, Reversal | Tylenol Simply Stuffy 30 mg tablet |

    Scenario Outline: Selecting on the obsolete medication throws an alert and prevent user to navigate to create an order
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        And the user type "<exMedName>" in the search bar
        Then the word Obsolete is displayed in the search result next to medication
        When the user clicks on the medication brand name
        Then an alert "Discontinued medication is not available" is displayed for the user
        Examples:
            | exFirstName | exLastName | exName          | exMedName                          |
            | Reversal    | 1Test      | 1Test, Reversal | Tylenol Simply Stuffy 30 mg tablet |

    Scenario Outline: When MultiCare Platform: Medication Order Writer is turned off, Selecting a medication brand or generic name from the Order Search sends the information back to Prescription Order screen in SNF in case of no Alerts
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        When the user type "<exMedName>" in the search bar
        And the user clicks on the medication <exKind> name
        Then the "Prescription Order" screen shows for drug "<exDrugName>" form "<exForm>" strength "<exStrength>" and schedule "<exSchedule>"
        Examples:
            | exFirstName | exLastName | exName          | exKind  | exMedName                            | exRowNum | exDrugName                                | exForm  | exStrength | exSchedule |
            | Reversal    | 1Test      | 1Test, Reversal | brand   | Cranberry Concentrate 500 mg capsule | 1        | Cranberry Concentrate (cranberry extract) | capsule | 500 mg     |            |
            | Reversal    | 1Test      | 1Test, Reversal | generic | Cranberry Concentrate 500 mg capsule | 1        | cranberry extract                         | capsule | 500 mg     |            |

    Scenario Outline: Selecting a medication brand or generic name from the Medication Order Search sends the information back to Acknowledgement screen in SNF in case of Alerts
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        When the user type "<exMedName>" in the search bar
        # Then the Alert column shows an alert for "<exAlert>" with an image
        When the user clicks on the medication <exKind> name
        Then the "Acknowledge Safety Alerts" screen shows for "<exMedNameSNF>"
        Examples:
            | exFirstName | exLastName | exName          | exKind  | exMedName                                | exAlert                             | exMedNameSNF                                           |
            | Reversal    | 1Test      | 1Test, Reversal | brand   | Aspir-Trin 325 mg tablet,delayed release | Drug-to-Allergy Interaction Alert\n | Aspir-Trin oral tablet,delayed release (DR/EC), 325 mg |
            | Reversal    | 1Test      | 1Test, Reversal | generic | Aspir-Trin 325 mg tablet,delayed release | Drug-to-Allergy Interaction Alert\n | aspirin oral tablet,delayed release (DR/EC), 325 mg    |

    Scenario Outline: Phoenetic Search starting with numbers that would not give any result
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        And the user type "<exMedName>" in the search bar
        Then the user sees the message "No Data Found" in the table
        Examples:
            | exFirstName | exLastName | exName          | exMedName |
            | Reversal    | 1Test      | 1Test, Reversal | 1.25      |
            | Reversal    | 1Test      | 1Test, Reversal | 325       |

    Scenario Outline: Phoenetic Search starting with mispelled medication name
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        And the user type "<exMedName>" in the search bar
        Then there is a medication list displaying "4" medications starting with first "5" characters as "Lasix"
        Examples:
            | exFirstName | exLastName | exName          | exMedName    |
            | Reversal    | 1Test      | 1Test, Reversal | Lasicks      |
            | Reversal    | 1Test      | 1Test, Reversal | 1234 Lasicks |
   
    Scenario Outline: When MultiCare Platform: Medication Order Writer is turned off,Selecting a custom medication name from the Order Search navigate to SNF Order Writer Page with Schedule Value
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        When the user type "<exMedName>" in the search bar
        And the user clicks on the medication brand name
        Then the "Prescription Order" screen shows for drug "<exMedName>" form "<exForm>" strength "<exStrength>" and schedule "<exSchedule>"
        And the user clicks the "Search Again" button to navigates back to Med Search page
        Examples:
            | exFirstName | exLastName | exName          | exMedName       | exKind | exForm | exStrength | exSchedule |
            | Reversal    | 1Test      | 1Test, Reversal | Magic Mouthwash | brand  |        |            | 3          |
            | Reversal    | 1Test      | 1Test, Reversal | Magic Healer    | brand  |        |            | 0          |

    Scenario Outline:  Orders Search Feature Flag enabled : Resident > Orders > Active Orders > Select Order > Copy Order
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        When the user selects the existing order then user views the Order
        Then the user clicks "Copy Order" Button that navigates to New Order
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        Then the user sees the med search screen
        Examples:
            | exFirstName | exLastName | exName          |
            | Ronald      | Clark      | Clark, Ronald O |

    Scenario Outline:  Orders Search Feature Flag enabled : Resident > Orders > Discharge Order > Add Order
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        Then the user clicks on the "Discharge Orders" tab
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Add Order DDL
        When the user type "ty" in the search bar
        Then the med search result shows
        Examples:
            | exFirstName | exLastName | exName         |
            | Teller      | Sean       | Sean, Teller O |

    Scenario Outline:  Custom medications are not available for selection for Discharge Orders
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        Then the user clicks on the "Discharge Orders" tab
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Add Order DDL
        When the user type "<exMedName>" in the search bar
        When the user clicks on the medication  name
        Then an alert "Custom medications are not available for selection for Discharge Orders." is displayed for the user

        Examples:
            | exFirstName | exLastName | exName          | exMedName       |
            | Reversal    | 1Test      | 1Test, Reversal | Magic Mouthwash |

    Scenario Outline:  Orders Search Feature Flag enabled : Resident > Orders > Pending Order > Add Order
        When the user search for the first name "<exFirstName>" and last name "<exLastName>"
        And the user selects the resident with name "<exName>" from the search results
        Then the user clicks on the "Pending Orders" tab
        When the user clicks on "Add Order" button
        And the user selects "Prescription" in the Order Type DDL
        And the user hits next after selecting the provider "Omnicare - Appleton, WI"
        When the user type "ty" in the search bar
        Then the med search result shows
        Examples:
            | exFirstName | exLastName | exName              |
            | Pending     | Resident   | Resident, Pending O |


                
