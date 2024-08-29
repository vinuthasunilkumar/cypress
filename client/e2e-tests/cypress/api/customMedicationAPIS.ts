const envPAGE = require("../env.config.json");

export function saveCustomMedication(custMedName: string, endpointURL: any, libraryId: any, setStatus: any) {
  return cy.request({
    method: 'POST',
    url: 'https://orders-qa.matrixcare.me/api/' + endpointURL,
    body: {
      "Id": 0,
      "Description": custMedName,
      "DeaClassId": 3,
      "customMedicationLibraryId": libraryId,
      "fdbMedications": [
        {
          "id": 615235,
          "description": "Cleansing Towelettes 0.13 %"
        },
      ],
      "fdbMedGroups": [
        {
          "id": 2,
          "description": "Antianxiety"
        },
      ],
      "IsActive": setStatus
    }
  }).then((response: any) => {
    return response;
  })
}

export function deleteCustomMedication(endpointURL: any, allcustMedId: any) {
  return cy.request({
    method: 'DELETE',
    url: 'https://orders-qa.matrixcare.me/api/' + endpointURL + allcustMedId,
  }).then((response: any) => {
    return response;
  })
}

export function searchCustomMedication(endpointURL: any, character: any, pageNumber: number, libraryId: any, exportValue: string) {
  return cy.request({
    method: 'GET',
    url: 'https://orders-qa.matrixcare.me/api/' + endpointURL,
    qs: {
      "Search": character,
      "PageSize": "20",
      "PageNumber": pageNumber,
      "CustomMedicationLibraryId": libraryId,
      "IsCustomMedicationListExport": exportValue,
      "IsDescending": false
    }
  }).then((response: any) => {
    return response;
  })
}

export function importCustomMedicationAPI(endpointURL: any, custLibraryId: number, fileName: any) {
  return cy.fixture(fileName, 'base64').then((fileContent) => {
    let b64 = window.btoa(unescape(encodeURIComponent(fileContent)))
    const blob = Cypress.Blob.base64StringToBlob(b64, 'text/csv');
    let formData = new FormData();
    formData.append("csvFile", blob, fileName);
    return cy.request({
      method: 'POST',
      url: 'https://orders-qa.matrixcare.me/api/' + endpointURL + custLibraryId,
      body: formData,
      headers: { 'content-type': 'multipart/form-data' },
    }).then((response: any) => {
      expect(response.status).to.eq(200);
      const bodyString = Cypress.Blob.arrayBufferToBinaryString(response.body);
      const body = JSON.parse(bodyString);
      return body;
    })
  })
}


