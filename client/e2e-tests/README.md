 

- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [<u>Installation</u>](#uinstallationu)
    - [Pre-requitesites](#pre-requitesites)
    - [Setup](#setup)
- [Dependencies](#dependencies)
  - [<u>Maintaining the dependencies</u>](#umaintaining-the-dependenciesu)
- [Configuration](#configuration)
  - [<u>Installing Cucumber Extenstions</u>](#uinstalling-cucumber-extenstionsu)
  - [<u>Feature Files</u>](#ufeature-filesu)
  - [<u>Step Definitions</u>](#ustep-definitionsu)
  - [<u>Page Objects</u>](#upage-objectsu)
  - [<u>Supporting Files</u>](#usupporting-filesu)
  - [<u>Environment Configuration</u>](#uenvironment-configurationu)
  - [<u>Authorization</u>](#uauthorizationu)
- [Running the Tests](#running-the-tests)
  - [<u>Cypress Runner</u>](#ucypress-runneru)
  - [<u>Run Partial Tests</u>](#urun-partial-testsu)
  - [<u>Headless Run</u>](#uheadless-runu)

# Introduction 

The formulary service QA Automation with Cypress and JavaScript.

# Getting Started

## <u>Installation</u>

### Pre-requitesites
    
* Git client and Git bash installed. To verify if git client is installed properly, open Command Prompt on Windows, then execute this command :

        git --version
    
* NodeJS installed. The project currently uses version 18.7.0. To verify if nodejs is installed properly, open Command Prompt on Windows, then execute this command :

         node --version
 
* Visual Studio Code installed.


### Setup

1. Open git bash in the following location

         C:\Dev\

   >Note: The project uses the cucumber JSON formatter for reporting which is written in the language 'GO' and sometimes the McAfee identifies this as a vulnerability. Having the project in the C:/Dev/ folder will bypass the check.

2. Type in the following command in git bash to download the formulary repository to the local machine:

        git clone https://MatrixCare-DevOps@dev.azure.com/MatrixCare-DevOps/Orders/_git/formulary-service

3. Open Visual Studio Code

4. Open a new Terminal

5. Navigate to the E2E directory by typing in:

        cd e2e

6. Type in the following command to install Cypress:

        npm install cypress

    >Note: Cypress installation takes some time to finish, and its speed depends on the user’s internet speed. However, this happens only the first time the tester installs Cypress.

# Dependencies

All the dependencies are mentioned in various files across the project. Type in the following command in the terminal to install all the dependencies mentioned in package.json file:

        npm i

## <u>Maintaining the dependencies</u>

 package-lock.json is created for locking the dependency with the installed version. It will install the exact latest version of that package in your application and save it in package.json. Let’s say if the current version of the package is 1.3.2 then it will save the version with (^) sign. Here carot(^) means, it will support any higher version with major version 1 for eg. 1.2.2. 
 
 >Without package-lock.json, there might be some differences in installed versions in different environments. To overcome this problem, package.lock.json is created to have the same results in every environment.

 The package-lock.json is stored at the following location:

        C:\Dev\..\formulary-service\client\e2e-tests\package-lock.json


# Configuration

All the configuration varaibles are stored in the **cypressconfig.js file**. This is the path to the file:

        C:\Dev\..\formulary-service\client\e2e-tests\cypress.config.js

All the dependencies are stored in the **package.json** file.  **package.json** is a versioning file used to install multiple packages in your project. A **package.json** file contains metadata about the project and also the functional dependencies that is required by the application. This is the path to the file:

       C:\Dev\..\formulary-service\client\e2e-tests\package.json

## <u>Installing Cucumber Extenstions</u>

The cucumber extensions can be installed from the Extensions market place. Click on the Extensions nav menu on the left pane or press **Ctrl+Shift+X** to bring up the extensions menu. Search and Install the following extensions

        1. Cucumber
        2. Cucumber (Gherkin) Full Support v2.15.2
        3. cucumber-gotostep
        4. generate cucumber step definitions v0.0.5
        5. Snippets and Syntax Highlight for Gherkin (Cucumber) v0.14.0

## <u>Feature Files</u>

A Feature File is an entry point to the Cucumber tests. This is a file where you will describe your tests in Descriptive language (Like English). It is an essential part of Cucumber, as it serves as an automation test script as well as live documents. A feature file can contain a scenario or can contain many scenarios in a single feature file but it usually contains a list of scenarios. The keywords used in Feature Files are as follows,

- **Feature**: A feature would describe the current test script which has to be executed.
  
- **Scenario Outline** : Same scenario can be executed for multiple sets of data using scenario outline. The data is provided by a tabular structure separated by (I I).

- **Scenario** : Defines what feature you will be testing in the tests below

- **Given**: Tells the pre-condition of the test

- **And**: Defines additional conditions of the test

- **Then**: States the post condition. You can say that it is the expected result of the test.

>The language above is called Gherkin and it implements the principles of Behavior-driven development (BDD). Domain-specific language gives you the ability to describe your application behavior without getting into details of implementation

In the formulary Project, the feature files are stored at the following location:

          C:\Dev\..\formulary-service\client\e2e-tests\cypress\e2e\features

 ## <u>Step Definitions</u>

A Step Definition is a JavaScript file with an expression that links it to one or more Gherkin steps. Step definition maps the Test Case Steps in the feature files(introduced by Given/When/Then) to code. It which executes the steps on Application Under Test and checks the outcomes against expected results. For a step definition to be executed, it must match the given component in a feature. All the step definitions files are created with a **.js** extension.

In the Formulary Project, the step definitions are stored at the following location:

       C:\Dev\..\formulary-service\client\e2e-tests\cypress\e2e\step_definitions

## <u>Page Objects</u> 

Page Object Model is a design pattern commonly used in enterprise test automation that makes an object repository for web UI elements. It helps us to cut back duplication and improves test maintenance.Test Automation helps in achieving this with better accuracy and in a shorter period of time, keeping product release cycles shorter.

In formulary Project, we create page classes and the various elements on the page are defined as variables in the class and all possible user interactions can then be implemented as methods in the class.

The page classes are stored in the following location:

        C:\Dev\..\formulary-service\client\e2e-tests\cypress\pages

## <u>Supporting Files</u>

The supporting files that are needed for the tests such as CSV and other files are stored at the following location:

        C:\Dev\..\formulary-service\client\e2e-tests\cypress\fixtures

## <u>Environment Configuration</u>

The configuration of the environments such as Database details, application details are stored in the **'env.config.json'** file

        C:\Dev\..\formulary-service\client\e2e-tests\cypress\env.config.json

## <u>Authorization</u>

The Authorization and Authentication details such OKTA tokens, OKTA url are stored in the **'authorization.js'** file. The path to the file:

        C:\Dev\..\formulary-service\client\e2e-tests\cypress\e2e\authorizarion.js

# Running the Tests

To run the cypress tests, In the terminal, navigate to the working directory by the typing in the following:

       cd C:\Dev\..\formulary-service\client\e2e-tests>

To Initiate the test, type in the following command in the terminal:

        npm run cypress:runner

## <u>Cypress Runner</u>

1. Once the above command is executed, The Cypress Runner window will open and look like this :

    ![Cypress](/Screenshots/Cypress1.png)

2. Two types of test will be displayed

   - End to End Testing
   - Component Testing
  
3. Click on E2E Testing, then three browsers Chrome, Edge and Electron will be displayed.

    ![Browser](/Screenshots/Browser.png)

4. For Formulary project, Select Chrome and click on "Start E2E Testing in Chrome" button.

5. A new browser window will open and display the feature files, which looks like this:

   ![Feature](/Screenshots/Feature.png)

6. Click on the **'formulary_log'** feature file to start the test, Once the test starts to run, it will look like this:

   ![Tests](/Screenshots/Tests.png)

   >The results of the test are displayed at the top of the formulary_log file


## <u>Run Partial Tests</u>

If the user wanted to run only a certain part of the feature file, **@focus** tag can be used to do it.

The **@focus** tag will only execute the scenario mentioned below the tag.

## <u>Headless Run</u> 

Running web tests in headless browser mode uses a web browser to run the scripts, but skips loading the browser's UI. That means that the HTML page under test is not getting rendered during the run, so the overall execution is much faster.

In the terminal, type in the following command to run the tests in headless mode:

        npm run headless:run

The progress of the tests can be viewed in the Terminal.


---
---
**All Set! The Cypress Tests are ready to be executed now!**


















  


    








