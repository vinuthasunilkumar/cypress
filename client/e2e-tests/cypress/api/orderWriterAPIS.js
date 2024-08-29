const envPAGE = require("../env.config.json");
var access_token = "";



export function GetRequest(endpointURL) {

  cy.request({
    method: "GET",
    url: endpointURL,
    
  }).then(function (response) {
    cy.log(response.body)
  });
}
