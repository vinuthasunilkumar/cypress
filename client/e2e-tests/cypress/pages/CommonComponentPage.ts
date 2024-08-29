import CustomMedicationSummary from "../pages/CustMedSummaryPage";
class CommonComponentPage {
    get searchTextField() { return cy.get("#txtSearch") }
    get displayMagnifyingGlass() { return cy.get(".search.col-3.mt-3>i") }
    get searchIcon() { return cy.get('.search.col-3.mt-3 > .fa') }

    verifySortOrder(value: string, locator: string) {
        let custMedName: string[] = [];
        let temp: string[] = [];
        CustomMedicationSummary.tableRow.each(($row, idx, array) => {
            cy.wrap($row).within(() => {
                cy.get(locator).then((ele) => {
                    custMedName.push(ele.text());
                    temp = [...custMedName];
                    validateEntries(custMedName, temp, value, idx, array);
                });
            });
        });
    }
}

const validateEntries = (custMedName, temp, value, idx, array) => {
    value == "asc" ? temp.sort((rowVal1: any, rowVal2: any) => rowVal1.toLowerCase() - rowVal2.toLowerCase()) :
        temp.sort((rowVal1: any, rowVal2: any) => rowVal2.toLowerCase() - rowVal1.toLowerCase());

    if (idx === array.length - 1) {
        for (let i = 0; i < custMedName?.length; i++) {
            expect(custMedName[i]).to.eq(temp[i]);
        }
    }
}

export default new CommonComponentPage()
