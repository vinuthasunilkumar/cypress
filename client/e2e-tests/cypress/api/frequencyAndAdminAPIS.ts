const envPAGE = require("../env.config.json");
let frequencyData: any; 
before(function(){
    cy.fixture('frequencyAndAdmin').then(function(data){
        frequencyData=data
    })
})

export function createMultipleFrequencyAndAdminRecords() { 
    let frequencyCode: string[] = frequencyData.frequencyCode.split("|")
    let fdbDrugId: string[] = frequencyData.fdbDrugMedId.split("|")
    let fdbMedGroupId: string[] = frequencyData.fdbMedGroupId.split("|")
    let medicationType: string[] = frequencyData.medicationType.split("|")
    let frequencyCodeDescription: string[] = frequencyData.frequencyCodeDescription.split("|")
    let orderTypeSummary: string[] = frequencyData.orderTypeSummary.split("|")
    for (let recordIndex = 0; recordIndex < frequencyCode.length; recordIndex++) {
            cy.request({
                method: 'POST',
                url: 'https://orders-qa.matrixcare.me/api/' + frequencyData.endPoint,
                body: {
                    "id": 0,
                    "frequencyCode": frequencyCode[recordIndex],
                    "orderTypeSummary": orderTypeSummary[recordIndex],
                    "summary": frequencyCodeDescription[recordIndex]+" at 09:00 AM for 1 Days" ,
                    "frequencyCodeDescription": frequencyCodeDescription[recordIndex],
                    "isPrn": false,
                    "orderType": 1,
                    "medicationType": medicationType[recordIndex],
                    "fdbDrugId": JSON.parse(fdbDrugId[recordIndex]),
                    "fdbMedGroupId": JSON.parse(fdbMedGroupId[recordIndex]),
                    "scheduleType": "Daily",
                    "timeSchedules": [
                        {
                            "id": 0,
                            "startTime": "09:00 AM",
                            "endTime": null
                        }
                    ],
                    "durationType": "Days",
                    "cyclicalSchedules": null,
                    "weeklySchedule": null,
                    "monthlySchedule": null,
                    "scheduleLocation": [
                        {
                            "roomId": "00000001-0001-0001-0001-000000000000",
                            "unitId": "00000001-0001-0001-0000-000000000000",
                            "facilityId": "00000001-0001-0000-0000-000000000000",
                            "isCompleteFacilitySeltected": false,
                            "isCompleteUnitSeltected": true,
                            "isDefault": false
                        },
                        {
                            "roomId": "00000001-0001-0001-0002-000000000000",
                            "unitId": "00000001-0001-0001-0000-000000000000",
                            "facilityId": "00000001-0001-0000-0000-000000000000",
                            "isCompleteFacilitySeltected": false,
                            "isCompleteUnitSeltected": true,
                            "isDefault": false
                        },
                        {
                            "roomId": "00000001-0001-0001-0003-000000000000",
                            "unitId": "00000001-0001-0001-0000-000000000000",
                            "facilityId": "00000001-0001-0000-0000-000000000000",
                            "isCompleteFacilitySeltected": false,
                            "isCompleteUnitSeltected": true,
                            "isDefault": false
                        },
                        {
                            "roomId": "00000001-0001-0001-0004-000000000000",
                            "unitId": "00000001-0001-0001-0000-000000000000",
                            "facilityId": "00000001-0001-0000-0000-000000000000",
                            "isCompleteFacilitySeltected": false,
                            "isCompleteUnitSeltected": true,
                            "isDefault": false
                        },
                        {
                            "roomId": "00000001-0001-0002-0002-000000000000",
                            "unitId": "00000001-0001-0002-0000-000000000000",
                            "facilityId": "00000001-0001-0000-0000-000000000000",
                            "isCompleteFacilitySeltected": false,
                            "isCompleteUnitSeltected": false,
                            "isDefault": false
                        },
                        {
                            "roomId": "00000001-0001-0002-0003-000000000000",
                            "unitId": "00000001-0001-0002-0000-000000000000",
                            "facilityId": "00000001-0001-0000-0000-000000000000",
                            "isCompleteFacilitySeltected": false,
                            "isCompleteUnitSeltected": false,
                            "isDefault": false
                        }
                    ],
                    "assignedToSummary": "Unit 1 - All; Unit 2 - Room 2, Room 3",
                    "duration": 1,
                    "isDefault": false,
                    "timeSummary": "09:00 AM",
                    "frequencyRepeatSummary": frequencyCodeDescription[recordIndex]+" at for 1 Days",
                    "facilityId": "00000001-0001-0000-0000-000000000000"
                }
            }).then((response: any) => {
                expect(response.status).to.eq(200)
            })
    }
}