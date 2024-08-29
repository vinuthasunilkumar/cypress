const envPAGE = require("../env.config.json");
export function saveCustomMedicationLibrary(custLibrary: string, endpointURL: any) {
    return cy.request({
        method: 'POST',
        url: 'https://orders-qa.matrixcare.me/api/' + endpointURL,
        body: {
            "Id": 0,
            "Description": custLibrary,
            "CorporationId": null,
            "IsActive": true,
        }
    }).then((response: any) => {
        return response;
    })
}