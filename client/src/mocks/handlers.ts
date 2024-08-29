import { rest } from 'msw';

const medicationList = { "medicationSearchResultsDto": { "pageNumber": 1, "pageLength": 10, "totalRows": 22, "totalPages": 3, "moreResultsExist": true, "items": [{ "id": 591994, "description": "Tylenol 325 mg capsule", "ndc": "50580048720" }, { "id": 261893, "description": "0.2 Micron Filter Attachment", "ndc": "00450049660" }, { "id": 450881, "description": "Tylenol 8 Hour 650 mg tablet,extended release", "ndc": "00045029721" }, { "id": 195227, "description": "Tylenol Arthritis Pain 650 mg tablet,extended release", "ndc": "00045083821" }, { "id": 569218, "description": "Tylenol Cold and Flu Severe 5 mg-10 mg-325 mg-200 mg tablet", "ndc": "50580040226" }, { "id": 570220, "description": "Tylenol Cold and Flu Severe 5 mg-10 mg-325 mg-200 mg/15 mL oral liquid", "ndc": "00450052508" }, { "id": 580809, "description": "Tylenol Cold Head Congestion Severe 5 mg-325 mg-200 mg tablet", "ndc": "00450026125" }, { "id": 589490, "description": "Tylenol Cold Max Day 5 mg-10 mg-325 mg tablet", "ndc": "50580051501" }, { "id": 607422, "description": "Tylenol Cold-Flu Multi-Act D-N 30-15-500mg(d)/2-30-15-500 mg tablets", "ndc": "50580037401" }, { "id": 607370, "description": "Tylenol Cold-Flu Multi-Action Day 30 mg-15 mg-500 mg tablet", "ndc": "50580034401" }] }, "error": null }

const medicationGroupList = { "medicationGroupSearchResultsDto": { "pageNumber": 1, "pageLength": 10, "totalRows": 22, "totalPages": 3, "moreResultsExist": true, "items": [{ "id": 591994, "description": "Analgesics", "ndc": "50580048720" }] }, "error": null }

const saveResponse = {
  data: {
    responseMessage: "Custom Medication Saved Successfully."
  },
  status: 200
}

export const handlers = [
  rest.post('/api/medications', (req, res, ctx) => {
    return res(
      ctx.status(200),
    )
  }),
  rest.put('/api/medications', (req, res, ctx) => {
    return res(
      ctx.status(200),
    )
  }),
  rest.get('/api/medications', (req, res, ctx) => {
    return res(
      ctx.json(medicationList),
    )
  }),
  rest.get('/api/medication-groups', (req, res, ctx) => {
    return res(
      ctx.json(medicationGroupList),
    )
  }),
  rest.post('/api/custom-medications', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(saveResponse),
    )
  }),
]