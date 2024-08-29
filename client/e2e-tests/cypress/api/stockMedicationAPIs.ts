const envPAGE = require("../env.config.json");
let stockMedication: any; 
before(function(){
    cy.fixture('stockMedications').then(function(data){
        stockMedication=data
    })
})

export function createMultipleStockMedicationRecords() { 
    let fdbMedicationId: string[] = stockMedication.fdbMedicationId.split("|")
    let fdbMedicationDescription: string[] = stockMedication.fdbMedicationDescription.split("|")

    for (let recordIndex = 0; recordIndex < fdbMedicationId.length; recordIndex++) {
            cy.request({
                method: 'POST',
                url: 'https://orders-qa.matrixcare.me/api/' + stockMedication.endPoint,
                body: {
                    "id": 0,
                    "fdbMedications": [
                      {
                        "id": fdbMedicationId[recordIndex],
                        "description": fdbMedicationDescription[recordIndex]
                      }
                    ],
                    "facilityId": "fcd9aa2b-3341-49dc-baa6-c4740732bbf6",
                    "stockMedicationLocation": [
                      {
                        "id": 0,
                        "stockMedicationId": 0,
                        "unitId": "755bb667-253e-495a-abbb-a7967088a51b"
                      }
                    ]
                  }
            }).then((response: any) => {
                expect(response.status).to.eq(200)
            })
    }
}
