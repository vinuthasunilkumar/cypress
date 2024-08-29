import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import medSearchPage from "../../pages/MedSearchPage";
import slidingPage from "../../pages/slidingPage";

let medText: string = "";

Then("the user sees the med search screen", () => {
  cy.get("#search2").should("be.visible");
});

Then("the user sees the SNF med search screen", () => {
  cy.get("h1").should("contain.text", "Drug Search");
});

Then("the user type {string} in the search bar", (searchText: string) => {
  medText = searchText;
  searchText = searchText.replace(/ /g, "%20");
  searchText = searchText.replace("/", "%2F");

  let endpoint =
    "/cloud-service/orders-pilot/api/medications?pageNumber=[0-9]&pageLength=20&SearchText=" +
    searchText +
    "*";
  cy.intercept(endpoint).as("medlist");
  medSearchPage.typeSearch(medText);
  cy.wait(2000);
});

Then("the user sees the message {string} in the table", (message: string) => {
  cy.get("tr:nth-child(1) > td:nth-child(1)").should("have.text", message);
  medSearchPage.paginationSelection.should("not.exist");
});

Then(
  "there is a medication list displaying {string} medications starting with first {string} characters as {string}",
  (count: string, textCount: number, searchText: string) => {
    cy.get(".table").find("tbody").find("tr").should("have.length", count);

    cy.get("tr td:nth-child(2) > button:nth-child(1)").each(($e1, index) => {
      //iterating through array of elements
      const StoreText = $e1.text(); //storing iterated element
      if (StoreText.includes(searchText)) {
        //If text found,iteration stops
        cy.get("tr td:nth-child(2) > button:nth-child(1)") //gets the CSS of forth column

          .eq(index) //grabs the content in index value

          .then(function (Taskcolumn) {
            expect(StoreText.startsWith(searchText)).to.be.true;
          });
      }
    });
  }
);

Then("there is pagination to navigate to further results", () => {
  medSearchPage.paginationSelection.should("be.visible");
});

When("the user navigates to page {string}", (pageNumber: string) => {
  cy.contains("a.page-link", pageNumber).click();
  cy.wait(3000);
});

When("the user clicks to {string} icon", (pageType: string) => {
  let btnName = cy.get(`[data-testid="${pageType}"]`);
  btnName.click();
  if (pageType === "firstPage") {
    cy.get(`[data-testid="${pageType}"]`)
      .parent()
      .should("have.class", "disabled");
    cy.get(`[data-testid="prevPage"]`)
      .parent()
      .should("have.class", "disabled");
  } else if (pageType === "lastPage") {
    cy.get(`[data-testid="${pageType}"]`)
      .parent()
      .should("have.class", "disabled");
    cy.get(`[data-testid="nextPage"]`)
      .parent()
      .should("have.class", "disabled");
  }
});

Then(
  "the text {string} gives information on total entries",
  (countInfo: string) => {
    cy.contains(countInfo);
  }
);

Then(
  "there are total {string} pages showing medications",
  (pageNumber: string) => {
    cy.contains("a", pageNumber).should("be.visible");
  }
);

Then(
  "the list of medications displayed is same as the order of Medication is the api response",
  () => {
    cy.get("ul li").first().click();
    interface Items {
      description: string;
    }

    let medlist: Items[] = [];
    cy.wait("@medlist").then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      medlist = response?.body.medicationSearchResultsDto.items;
    });
    cy.get("tr td:nth-child(2) > :nth-child(1)").each(($e1, index) => {
      //iterating through array of elements
      const StoreText = $e1.text(); //storing iterated element
      expect(StoreText).to.equal(medlist[index]?.description);
    });
  }
);

Then(
  "the Alert column shows an alert for {string} with an image",
  (alertList: string) => {
    cy.get(`img[data-testid^="image-"]`).first().trigger("mouseover");
    cy.contains(alertList);

    cy.wait("@alerts").then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      let alertListAPI: string = "";
      let length: number =
        response?.body.patientSafetyAlertsV1Dto.alerts.length;
      if (length != 0) {
        for (let i = 0; i < length; i++) {
          alertListAPI =
            alertListAPI +
            response?.body.patientSafetyAlertsV1Dto.alerts[i].type +
            (response?.body.patientSafetyAlertsV1Dto.alerts[i].severity
              ? " : " +
                response?.body.patientSafetyAlertsV1Dto.alerts[i].severity
              : "") +
            " - " +
            response?.body.patientSafetyAlertsV1Dto.alerts[i].summaryText;
        }
        expect(alertListAPI).to.contain(alertList);
      }
    });
  }
);

Then(
  "the Alert column shows a formulary icon for {string} with an image",
  (formularyIcon: string) => {
    cy.get(`img[data-testid^="image-${formularyIcon}"]`).should("exist");
  }
);

Then("the type column would show {string}", (type: string) => {
  cy.get("tr td:nth-child(3)")
    .first()
    .each(($e1) => {
      //iterating through array of elements
      const StoreText = $e1.text(); //storing iterated element
      expect(StoreText).to.equal(type);
    });
});

Then(
  "the user sees the generic name of the medication which is the same as the API response",
  () => {
    interface Items {
      description: string;
    }

    let medlist: Items[] = [];
    cy.wait("@medlist").then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      medlist =
        response?.body.medicationSearchResultsDto.items[0].genericMedication
          .description;
    });

    cy.get("tr td:nth-child(2) >p ").each(($e1) => {
      //iterating through array of elements
      const GenericText = $e1.text().slice(9); //storing iterated element
      expect(GenericText).to.equal(medlist);
    });
  }
);

Then(
  "the word Obsolete is displayed in the search result next to medication",
  () => {
    cy.get("tr td:nth-child(2) > span").then(($element) => {
      const discontinue = $element.text();
      expect(discontinue).equal(" (obsolete)");
    });
  }
);

When(
  /^the user clicks on the medication (brand|generic)? name$/,
  (kind: string) => {
    if (kind == "generic") {
      cy.get("tr td:nth-child(2)")
        .contains(medText)
        .then(() => {
          cy.get(".anchor-button").last().click();
        });
    } else {
      cy.get(".anchor-button").contains(medText).click();
    }
  }
);

Then("an alert {string} is displayed for the user", (alertText: string) => {
  cy.on("window:alert", () => {
    cy.get("@windowAlert").should(alertText);
  });
});

When("the user clicks on the i icon beside the medication name", () => {
  cy.get('[data-testid="btnHandleInfo"]').click({ force: true });
});

Then(
  "a sliding page shows drug information for {string} in sync with the response from medication info endpoint",
  (medName: string) => {
    cy.get(".side-menu_content").should("be.visible");
    cy.wait("@medInfo").then(({ response }) => {
      expect(response?.statusCode).to.eq(200);

      slidingPage.medicationName.should(
        "have.text",
        response?.body.description
      );
      slidingPage.medicationName.should("have.text", medName);
      slidingPage.sideMenuGeneralInfo.click();
      slidingPage.genInfoHeader.should("have.text", "General Information");
      slidingPage.classification.should(
        "have.text",
        response?.body.therapeuticClass.description
      );
      slidingPage.genericMedName.should(
        "have.text",
        response?.body.genericmedication.description
      );

      interface Info {
        infoType: string;
        lineType: string;
        lineText: string;
      }
      let drugInfo: Info[] = response?.body.drugInfo;
      let indicationText: string = "",
        contraindicationsText: string = "",
        sideEffectsText: string = "",
        drugDrugInteactionsText: string = "",
        minMaxDosingText: string = "";
      const length = drugInfo.length;
      for (let i = 0; i < length; i++) {
        if (drugInfo[i].infoType == "1" && drugInfo[i].lineType == "3")
          indicationText = indicationText + drugInfo[i].lineText;
        if (drugInfo[i].infoType == "2" && drugInfo[i].lineType != "0")
          contraindicationsText = contraindicationsText + drugInfo[i].lineText;
        if (drugInfo[i].infoType == "3" && drugInfo[i].lineType != "0")
          sideEffectsText = sideEffectsText + drugInfo[i].lineText;
        if (drugInfo[i].infoType == "4" && drugInfo[i].lineType != "0")
          drugDrugInteactionsText =
            drugDrugInteactionsText + drugInfo[i].lineText;
        if (drugInfo[i].infoType == "6" && drugInfo[i].lineType != "0")
          minMaxDosingText = minMaxDosingText + drugInfo[i].lineText;
      }
      slidingPage.sideIndications.click();
      slidingPage.indicationsHeader.should("have.text", "Indications");
      slidingPage.indicationsList.should("have.text", indicationText);

      slidingPage.sideContraindications.click();
      slidingPage.contraindicationsHeader.should(
        "have.text",
        "Contraindications"
      );
      slidingPage.contraindicationList.should(
        "have.text",
        contraindicationsText
      );

      slidingPage.sideSideEffects.click();
      slidingPage.sideEffectsHeader.should("have.text", "Side Effects");
      slidingPage.sideEffectsList.should("have.text", sideEffectsText);

      slidingPage.sideDrugDrugInteractions.click();
      slidingPage.drugDrugInteractionsHeader.should(
        "have.text",
        "Drug-Drug Interactions"
      );
      slidingPage.drugDrugInteractionsList.should(
        "have.text",
        drugDrugInteactionsText
      );

      slidingPage.sideMinMaxDosing.click();
      slidingPage.minMaxHeader.should("have.text", "Min-Max Dosing");
      slidingPage.minMaxList.should("have.text", minMaxDosingText);

      slidingPage.sideMonograph.click();
      slidingPage.monographHeader.should("have.text", "Monograph");
      slidingPage.monographPara.should(
        "have.text",
        response?.body.patientMonograph
      );
    });
  }
);

When("the user clicks {string} link", (OrderSummarylink: string) => {
  medSearchPage.orderSummary
    .contains(OrderSummarylink)
    .should("be.visible")
    .click();
});

Then("the user navigates back to Order Summary page", () => {
  cy.url().should("include", "ORDERHOME");
});

Then(
  "the Alert column shows a custom icon image",
  (customIcon: string, customIconTooltip: string) => {
    const featuresSelector = 'img[data-testid^="image-custom-"]';
    cy.get(featuresSelector).should("exist");
  }
);

Then("the source column would show {string}", (type: string) => {
  cy.get("tr td:nth-child(4)")
    .first()
    .each(($e1) => {
      const StoreText = $e1.text();
      expect(StoreText).to.equal(type);
    });
});

Then("the user clicks on the {string} tab", (tabName: string) => {
  cy.get(".tab").contains(tabName).click();
  if (tabName == "Discharge Orders") {
    cy.get("#prescriberName>a").then((text) => {
      localStorage.setItem(
        "storeDischargePhysicianName",
        text.get(0).outerHTML
      );
    });
  } 
});

Then("the med search result shows", () => {
  cy.get(".table").should("not.have.text", "No Data Found");
});

When("the user selects {string} in the Add Order DDL", (text: string) => {
  cy.get("a").contains(text).click();
});

Then(
  "the user sees the {string} in the search result",
  (medicationName: string) => {
    cy.get("tr td:nth-child(2) > button:nth-child(1)")
      .contains(medicationName)
      .should("exist");
  }
);

Then(
  "the medication search results will show the medications containing {string}",
  (medicationString: string) => {
    const medKeywords = medicationString.toLowerCase().split(" ");
    cy.get("tr td:nth-child(2) > button:nth-child(1)").each(($e1) => {
      //iterating through array of elements
      const storeText = $e1
        .text()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, ""); //storing iterated element
      for (const word of medKeywords) {
        expect(storeText).to.include(word);
      }
    });
  }
);
