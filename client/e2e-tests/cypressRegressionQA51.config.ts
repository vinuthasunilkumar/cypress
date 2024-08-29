import { defineConfig } from 'cypress'
import createBundler from '@bahmutov/cypress-esbuild-preprocessor'
import { addCucumberPreprocessorPlugin  } from '@badeball/cypress-cucumber-preprocessor'
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild';
import pg from "pg";

async function setupNodeEvents(on, config) {
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    })
  );

  on("task", {
    DATABASE({ dbConfig, sql, values }) {
      const pool = new pg.Pool(dbConfig);
      try {
        return pool.query(sql, values);
      } catch (e) {}
    },
  });

  on("task", {
    log(message) {
      console.log(message);
      return null;
    },
  });



  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

module.exports = defineConfig({
  reporter: 'mocha-allure-reporter',
  
  e2e: {
    defaultCommandTimeout: 8000,
    setupNodeEvents,
    specPattern: ["cypress/e2e/features/*.feature"],
    baseUrl: "https://qa51okta.matrixcare.me",
    env:{
        "orderServiceDB": {
            "user": "OMAdmin@cusdqpgsom01",
            "host": "cusdqpgsom01.postgres.database.azure.com",
            "database": "CUSQDBO01",
            "password": "DbP@ssw0rd",
            "port": 5432,
            "ssl": true
          },

    },
    chromeWebSecurity: false,
    videoCompression: false,
    supportFile: "cypress/support/e2e.ts",
    modifyObstructiveCode: true,

    retries: {
      // Configure retry attempts for `cypress run`
      // Default is 0
      runMode: 0,
      // Configure retry attempts for `cypress open`
      // Default is 0
      openMode: 0,
    },

    
  },
});
