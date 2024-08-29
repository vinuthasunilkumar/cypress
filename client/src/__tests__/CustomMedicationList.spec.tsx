import React from "react";
import {
  act,
  cleanup,
  createEvent,
  fireEvent,
  getByTestId,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import CustomMedicationList from "../features/custom-medication/pages/CustomMedicationList";
import * as getCustomMedicationsList from "./../services/CustomMedicationService";
import * as getAssignedFacilitiesByCmlId from "./../services/CustomMedicationLibraryService";
global.React = React;
import { Provider } from "react-redux";
import store from "./../redux/store";
import { setMockHostContextSetup } from "../helper/mockHostContextSetup";
import { mockUserFacility } from "../helper/mockUserFacility";
import * as UpdateCustomMedicationStatus from "../services/CustomMedicationService";

afterEach(cleanup);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({ state: "Custom medication saved successfully" }),
}));

jest.mock("axios", () => {
  const mAxiosInstance = {
    get: jest.fn().mockImplementation(async () => {
      const successResponse = {
        data: {
          customMedications: [
            {
              description: "Tylenol 325 mg capsule",
              id: 1,
              deaClassId: 2,
              isActive: true,
              fdbMedGroupLists: [
                {
                  id: 123,
                  description: "abc",
                },
                {
                  id: 124,
                  description: "xyz",
                },
              ],
              fdbIngredientLists: [
                {
                  id: 6,
                  description: "1,2-pentanediol (bulk) 100 % liquid",
                  representativeNDC: "38779275201",
                },
                {
                  id: 19,
                  description: "Tyblume 0.1 mg-20 mcg chewable tablet",
                  representativeNDC: "642747101",
                },
                {
                  id: 25,
                  description: "Tybost 150 mg tablet",
                  representativeNDC: "61958140101",
                },
              ],
            },
            {
              description: "Tylenol 25 mg capsule",
              id: 2,
              deaClassId: 3,
              isActive: true,
              fdbMedGroupLists: [
                {
                  id: 123,
                  description: "xyz",
                },
                {
                  id: 124,
                  description: "abc",
                },
              ],
              fdbIngredientLists: [],
            },
            {
              description: "Tylenol 425 mg capsule",
              id: 3,
              deaClassId: 4,
              isActive: true,
              fdbMedGroupLists: [],
              fdbIngredientLists: [],
            },
            {
              description: "Tylenol 425 mg capsule",
              id: 4,
              deaClassId: 5,
              isActive: false,
              fdbMedGroupLists: [],
              fdbIngredientLists: [],
            },
            {
              description: "Tylenol 425 mg capsule",
              id: 5,
              deaClassId: null,
              isActive: false,
              fdbMedGroupLists: [],
              fdbIngredientLists: [],
            },
            {
              description: "Tylenol 425 mg capsule",
              id: 6,
              deaClassId: 0,
              isActive: false,
              fdbMedGroupLists: [],
              fdbIngredientLists: [],
            },
          ],
          pagination: {
            size: 20,
            totalPages: 2,
            totalElements: 40,
            totalActiveElements: 3,
          },
        },
      };
      return Promise.resolve(successResponse);
    }),
    put: jest
      .fn()
      .mockImplementationOnce(() => {
        const failedUpdateResponse = {
          data: {
            id: 432797,
            responseMessage: "Not Updated",
            statusCode: 500,
          },
          status: 200,
        };
        return Promise.resolve(failedUpdateResponse);
      })
      .mockImplementation(() => {
        const successResponse = {
          data: {
            id: 432797,
            responseMessage: "Updated",
            totalActiveElements: 3,
          },
          status: 200,
        };
        return Promise.resolve(successResponse);
      }),
    post: jest
      .fn()
      .mockImplementationOnce(() => {
        const failedResponse = {
          data: {
            validationErrors: [
              {
                lineNumber: 2,
                error: "Custom medication name is required.",
                columnName: "Custom Medication Name",
              },
              {
                lineNumber: 3,
                error: "Invalid value in 'DEA Schedule'.",
                columnName: "DEA Schedule",
              },
              {
                lineNumber: 4,
                error: "DEA Schedule is required.",
                columnName: "DEA Schedule",
              },
              {
                lineNumber: 4,
                error:
                  "A custom medication already exists with the same name in this import file. The medication name must be unique.",
                columnName: "Custom Medication Name",
              },
              {
                lineNumber: 5,
                error:
                  "NDC is required in Ingredient2NDC if value is entered in Ingredient2.",
                columnName: "Ingredient 1 NDC",
              },
              {
                lineNumber: 6,
                error:
                  "Invalid value in 'Custom Medication Name'. Error: Only following characters are allowed. Alpha-Numeric a - z, A - Z, 0 - 9. Special Characters ! @ # $ % ^ & * ( ) _ - + = { } [ ] | \\ : \" ; ' < > , . ? /",
                columnName: "Custom Medication Name",
              },
              {
                lineNumber: 7,
                error:
                  "A custom medication already exists with the same name in this import file. The medication name must be unique.",
                columnName: "Custom Medication Name",
              },
              {
                lineNumber: 8,
                error: "Custom medication name must be at most 70 characters.",
                columnName: "Custom Medication Name",
              },
            ],
          },
          status: 200,
        };
        return Promise.resolve(failedResponse);
      })
      .mockImplementationOnce(() => {
        const successResponse = {
          data: {
            validationErrors: [],
          },
          status: 200,
        };
        return Promise.resolve(successResponse);
      }),
  };
  return {
    create: jest.fn(() => mAxiosInstance),
  };
});

const RenderUIComponentResult = () => {
  let result = render(
    <Provider store={store}>
      <MemoryRouter>
        <CustomMedicationList />
      </MemoryRouter>
    </Provider>
  );
  return result;
};

const RenderUIComponent = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CustomMedicationList />
      </MemoryRouter>
    </Provider>
  );
};

beforeEach(() => {
  setMockHostContextSetup();
  SetSelectedLibraryDetails();
  setCustomMedicationPageNumber();
});

describe("Custom Medication List", () => {
  let file: any;
  const csvData = `Custom Medication Name,DEA Schedule,Medication Groups,Ingredient 1,Ingredient 1 NDC,Ingredient 2,Ingredient 2 NDC,Ingredient 3,Ingredient 3 NDC,Ingredient 4,Ingredient 4 NDC,Ingredient 5,Ingredient 5 NDC,Ingredient 6,Ingredient 6 NDC,Ingredient 7,Ingredient 7 NDC,Ingredient 8,Ingredient 8 NDC,Ingredient 9,Ingredient 9 NDC,Ingredient 10,Ingredient 10 NDC,Ingredient 11,Ingredient 11 NDC,Ingredient 12,Ingredient 12 NDC,Ingredient 13,Ingredient 13 NDC,Ingredient 14,Ingredient 14 NDC,Ingredient 15,Ingredient 15 NDC
    BrainsUp (Essential Omega Acids),Not Controlled,Antidepressants; Antipsychotics; Bisphosphonates,"1,2-pentanediol (bulk) 100 % liquid",38779275201,(d)-limonene flavor (bulk) 100 % liquid,51927325900,,,,,,,,,,,,,,,,,,,,,,,,,,
    Carligo (ligaments health),Schedule II,EENT; Aricept/Donepezil; Chemotherapy,"1,2-pentanediol (bulk) 100 % liquid",38779275201,(d)-limonene flavor (bulk) 100 % liquid,51927325900,,,,,,,,,,,,,,,,,,,,,,,,,,
    HerbaVita (Herbal Multivitamins),Schedule V,Insulin; Fluoroquinolones; Immunization/Vaccination,"1st Tier Unifine Pentips Plus 29 gauge x 1/2","needle",08517382936,"1st Tier Unifine Pentips 32 gauge x 5/32","needle",08517354036,,,,,,,,,,,,,,,,,,,,,,,,,,
    Wow Nails (Nails health kit),Schedule III,Eye Drops; Fluoroquinolones; Immunization/Vaccination,12 Hour Nasal Spray 0.05 %,11822145760,12 Hour Nasal Relief Spray 0.05 %,59390003613,,,,,,,,,,,,,,,,,,,,,,,,,,
    `;
  file = new File([csvData], "customMedicationsData.csv");

  it("renders without crashing", () => {
    window.scrollTo = jest.fn();
  });

  it("Checking fields are available", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnAddNewId = screen.getByTestId("btnAddNew");
      expect(btnAddNewId).toBeInTheDocument();
    });
  });

  it("Navigate to add new custom medication", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnAddNew = screen.getByTestId("btnAddNew");
      expect(btnAddNew).toBeInTheDocument();
      fireEvent.click(btnAddNew);
    });
  });

  it("Click Toggle State & Click Navigate to Edit", async () => {
    RenderUIComponent();
    await waitFor(() => screen.getAllByTestId(`status-${1}`));
    const btnStatus = screen.getAllByTestId(`status-${1}`);
    fireEvent.click(btnStatus[0]);
    const navigateToEditPage = screen.getAllByTestId("customMedicationName");
    fireEvent.click(navigateToEditPage[0]);
  });

  it("Click Toggle State Inactive to Active", async () => {
    RenderUIComponent();
    await waitFor(() => screen.getAllByTestId(`status-4`));
    const btnStatus = screen.getAllByTestId(`status-4`);
    fireEvent.click(btnStatus[0]);
  });

  it("Click Toggle State & click on Confirm OK", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnStatus = screen.getAllByTestId(`status-${1}`);
      fireEvent.click(btnStatus[0]);
      const confirmButton = screen.getByTestId("confirmButton");
      fireEvent.click(confirmButton);
      fireEvent.click(btnStatus[0]);
      fireEvent.click(confirmButton);
    });
  });

  it("Click Toggle State & click on cancel button", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnStatus = screen.getAllByTestId(`status-${1}`);
      fireEvent.click(btnStatus[0]);
      const cancelButton = screen.getByTestId("cancelButton");
      fireEvent.click(cancelButton);
    });
  });

  it("Click on sort custom medications", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const sortButton = screen.getByTestId("sort-custom-medications");
      expect(sortButton).toBeInTheDocument();
      fireEvent.click(sortButton);
    });
  });

  it("Click on sort custom medications", async () => {
    RenderUIComponent();

    await waitFor(() => {
      const sortButton = screen.getByTestId("sort-custom-medications");
      expect(sortButton).toBeInTheDocument();
      fireEvent.click(sortButton);
      fireEvent.click(sortButton);
    });
  });

  it("Search the fields", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const txtSearch = screen.getByTestId<HTMLInputElement>("txtSearch");
      const keyUp = createEvent.keyUp(txtSearch, "Tylenol");
      fireEvent(txtSearch, keyUp);
    });
  });

  it("Search the fields & clear the text", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const txtSearch = screen.getByTestId<HTMLInputElement>("txtSearch");
      const keyUp = createEvent.keyUp(txtSearch, "Tylenol");
      fireEvent(txtSearch, keyUp);
    });
  });

  it("Click on Next Page", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const nextPage = screen.getByTestId("nextPage");
      expect(nextPage).toBeInTheDocument();
      fireEvent.click(nextPage);
    });
  });

  it("Export Custom Medications List", async () => {
    RenderUIComponent();
    await waitFor(
      () => {
        global.URL.createObjectURL = jest.fn();
        const btnExport = screen.getByTestId("btnExport");
        expect(btnExport).toBeInTheDocument();
        expect(btnExport).toBeEnabled();
        fireEvent.click(btnExport);
      },
      { timeout: 3000 }
    );
  });

  it("Updating session value for negative case", () => {
    sessionStorage.setItem(
      "navigatedFromFacilitySetupToCustomMedications",
      JSON.stringify(true)
    );
    sessionStorage.setItem(
      "selectedFacility",
      JSON.stringify(mockUserFacility)
    );
    sessionStorage.setItem("customMedicationsSelectedSort", "ASC");
    RenderUIComponent();
  });

  it("Render custom medication sorted ASC", async () => {
    mockCustomMedicationList();
    sessionStorage.setItem("customMedicationsSelectedSort", "ASC");
    RenderUIComponent();
    await waitFor(() => {
      const sortButton = screen.queryByTestId("sort-custom-medications");
      expect(sortButton).toBeInTheDocument();
      fireEvent.keyUp(sortButton!);
      fireEvent.click(sortButton!);
    });
  });

  it("Render custom medication sorted DESC", async () => {
    mockCustomMedicationList();
    sessionStorage.setItem("customMedicationsSelectedSort", "DESC");
    RenderUIComponent();
    await waitFor(() => {
      const sortButton = screen.queryByTestId("sort-custom-medications");
      expect(sortButton).toBeInTheDocument();
      fireEvent.keyUp(sortButton!);
      fireEvent.click(sortButton!);
    });
  });

  it("Render checkKeysAllowedRowsItem", async () => {
    mockCustomMedicationList();
    sessionStorage.setItem("customMedicationsSelectedSort", "DESC");
    RenderUIComponent();
    await waitFor(() => {
      const customMedicationNameBtn = screen.getAllByTestId("customMedicationName");
      expect(customMedicationNameBtn[0]).toBeInTheDocument();
      fireEvent.keyDown(customMedicationNameBtn[0],{ key: 'Enter', charCode: 13 });
      fireEvent.click(customMedicationNameBtn[0]);
    });
  });

  it("Search medication & load data", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const txtSearch = screen.getByTestId<HTMLInputElement>("txtSearch");
      fireEvent.change(txtSearch, {target:{value: 't'}});
      fireEvent.change(txtSearch, {target:{value: 'tylenol'}})
      txtSearch.setAttribute("name","search");
    });
  });

  it("Edit custom medication library", async () => {
    mockFacilityData();
    RenderUIComponent();
    await waitFor(() => {
      const btnEditLibrary = screen.getByTestId<HTMLInputElement>("btnEditLibrary");
      fireEvent.click(btnEditLibrary);
    });
  });

  it("Cancel update custom med library modal",async ()=>{
    RenderUIComponent();
    await waitFor(() => {
      const btnEditLibrary = screen.getByTestId<HTMLInputElement>("btnEditLibrary");
      fireEvent.click(btnEditLibrary);
      const CloseModalBtn = screen.getByTestId<HTMLInputElement>("CloseModalBtn"); 
      fireEvent.click(CloseModalBtn);
      const cancelButton = screen.getByTestId<HTMLInputElement>("cancelButton"); 
      fireEvent.click(cancelButton);
    });
  })

  it("Navigate back to previous page when no redirect url",async ()=>{
    sessionStorage.setItem("navigatedFromFacilitySetupToCustomMedications", "");
    RenderUIComponent();
    await waitFor(() => {
      const btnBack=screen.getByTestId<HTMLInputElement>("btnBack");
      fireEvent.click(btnBack);
    });
  })

  it("Navigate back to previous page when redirect url present",async ()=>{
    sessionStorage.setItem("navigatedFromFacilitySetupToCustomMedications", "cloud-orders.com");
    RenderUIComponent();
    await waitFor(() => {
      const btnBack=screen.getByTestId<HTMLInputElement>("btnBack");
      fireEvent.click(btnBack);
    });
  })

  it("Close import list on click of close",async ()=>{
    RenderUIComponent();
    await waitFor(() => {
      const btnImport=screen.getByTestId<HTMLInputElement>("btnImport");
      fireEvent.click(btnImport);
      const closeBtn=screen.getByTestId<HTMLInputElement>("close-import-list");
      fireEvent.click(closeBtn);
    });
  })

  it("Pagination with null pageNumber and null totalPages ", async () => {
    RenderUIComponent();
    const mockFetchData = jest
      .spyOn(getCustomMedicationsList, "getCustomMedicationsList")
      .mockImplementation(async () => {
        return {
          customMedications: [
            {
              description: "Tylenol 325 mg capsule",
              id: 1,
              deaClassId: 2,
              isActive: true,
            },
          ],
          pagination: {
            size: 20,
            totalPages: null,
            totalElements: null,
            totalActiveElements: 1,
          },
        };
      });
    await waitFor(() => {
      fireEvent.keyUp(screen.getByTestId("txtSearch"), {
        target: { value: "Tylenol" },
      });
    });
  });

  it("API response with null records for GetMedications ", async () => {
    RenderUIComponent();

    const mockFetchData = jest
      .spyOn(getCustomMedicationsList, "getCustomMedicationsList")
      .mockImplementation(async () => {
        return {
          customMedications: undefined,
        };
      });
    await waitFor(() => {
      fireEvent.keyUp(screen.getByTestId("txtSearch"), {
        target: { value: "Tylenol" },
      });
    });
  });

  it("Click Edit Library - Open Edit Library Popup & Simply Close it", async () => {
    RenderUIComponent();
    await act(async () => {
      setTimeout(async () => {
        const btnEditLibrary = screen.getByTestId("btnEditLibrary");
        expect(btnEditLibrary).toBeInTheDocument();
        fireEvent.click(btnEditLibrary);

        const txtLibraryName = screen.queryByTestId("txtLibraryName");
        expect(txtLibraryName).toBeInTheDocument();

        const cancelButton = screen.getByTestId("cancelButton");
        fireEvent.click(cancelButton);
      }, 1000);
    });
  });

  it("Click Edit Library - Open Edit Library Popup & Save it", async () => {
    RenderUIComponent();
    await act(async () => {
      setTimeout(async () => {
        const btnEditLibrary = screen.getByTestId("btnEditLibrary");
        expect(btnEditLibrary).toBeInTheDocument();
        fireEvent.click(btnEditLibrary);
        const txtLibraryName = screen.queryByTestId("txtLibraryName");
        expect(txtLibraryName).toBeInTheDocument();
        fireEvent.change(screen.getByTestId("txtLibraryName"), {
          target: { value: "Tylenol" },
        });
        const confirmButton = screen.getByTestId("confirmButton");
        fireEvent.click(confirmButton);
      }, 1000);
    });
  });

  it("Navigate back to custom medication libraries", async () => {
    RenderUIComponent();

    await waitFor(() => screen.getByTestId("btnBack"));
    expect(screen.getByTestId("btnBack")).toBeInTheDocument();
    const btnBack = screen.getByTestId("btnBack");
    fireEvent.click(btnBack);
  });

  it("Import List - Open Dialog", async () => {
    RenderUIComponent();
    await waitFor(() => screen.getByTestId("btnImport"));
    expect(screen.getByTestId("btnImport")).toBeInTheDocument();
    const btnImport = screen.getByTestId("btnImport");
    fireEvent.click(btnImport);
  });

  it("Import List - Open & Close Dialog", async () => {
    RenderUIComponent();
    await waitFor(() => screen.getByTestId("btnImport"));
    expect(screen.getByTestId("btnImport")).toBeInTheDocument();
    const btnImport = screen.getByTestId("btnImport");
    fireEvent.click(btnImport);
    expect(screen.getByTestId("btnClose")).toBeInTheDocument();
    const btnClose = screen.getByTestId("btnClose");
    fireEvent.click(btnClose);
  });

  it("Import List - Upload Valid File", async () => {
    let result = RenderUIComponentResult();

    await waitFor(() => screen.getByTestId("btnImport"));
    expect(screen.getByTestId("btnImport")).toBeInTheDocument();
    const btnImport = screen.getByTestId("btnImport");
    fireEvent.click(btnImport);

    const someElement = result.container.querySelector(
      `input[type="file"]`
    ) as HTMLInputElement;

    Object.defineProperty(someElement, "files", {
      value: [file],
    });
    await waitFor(
      () => {
        fireEvent.change(someElement);
      },
      {
        timeout: 500,
      }
    );
  });

  it("Import List - Upload application/vnd.ms-excel File", async () => {
    let result = RenderUIComponentResult();
    let file: any;
    const csvData = `Custom Medication Name,DEA Schedule,Medication Groups,Ingredient 1,Ingredient 1 NDC,Ingredient 2,Ingredient 2 NDC,Ingredient 3,Ingredient 3 NDC,Ingredient 4,Ingredient 4 NDC,Ingredient 5,Ingredient 5 NDC,Ingredient 6,Ingredient 6 NDC,Ingredient 7,Ingredient 7 NDC,Ingredient 8,Ingredient 8 NDC,Ingredient 9,Ingredient 9 NDC,Ingredient 10,Ingredient 10 NDC,Ingredient 11,Ingredient 11 NDC,Ingredient 12,Ingredient 12 NDC,Ingredient 13,Ingredient 13 NDC,Ingredient 14,Ingredient 14 NDC,Ingredient 15,Ingredient 15 NDC
    BrainsUp (Essential Omega Acids),Not Controlled,Antidepressants; Antipsychotics; Bisphosphonates,"1,2-pentanediol (bulk) 100 % liquid",38779275201,(d)-limonene flavor (bulk) 100 % liquid,51927325900,,,,,,,,,,,,,,,,,,,,,,,,,,
    Carligo (ligaments health),Schedule II,EENT; Aricept/Donepezil; Chemotherapy,"1,2-pentanediol (bulk) 100 % liquid",38779275201,(d)-limonene flavor (bulk) 100 % liquid,51927325900,,,,,,,,,,,,,,,,,,,,,,,,,,
    HerbaVita (Herbal Multivitamins),Schedule V,Insulin; Fluoroquinolones; Immunization/Vaccination,"1st Tier Unifine Pentips Plus 29 gauge x 1/2","needle",08517382936,"1st Tier Unifine Pentips 32 gauge x 5/32","needle",08517354036,,,,,,,,,,,,,,,,,,,,,,,,,,
    Wow Nails (Nails health kit),Schedule III,Eye Drops; Fluoroquinolones; Immunization/Vaccination,12 Hour Nasal Spray 0.05 %,11822145760,12 Hour Nasal Relief Spray 0.05 %,59390003613,,,,,,,,,,,,,,,,,,,,,,,,,,
    `;

    file = new File([csvData], "customMedicationsData.xls", {
      type: "application/vnd.ms-excel",
    });
    await waitFor(() => screen.getByTestId("btnImport"));
    expect(screen.getByTestId("btnImport")).toBeInTheDocument();
    const btnImport = screen.getByTestId("btnImport");
    fireEvent.click(btnImport);

    const someElement = result.container.querySelector(
      `input[type="file"]`
    ) as HTMLInputElement;

    Object.defineProperty(someElement, "files", {
      value: [file],
    });
    await waitFor(
      () => {
        fireEvent.change(someElement);
      },
      {
        timeout: 500,
      }
    );
  });

  it("Import List - Upload Valid File & Remove it", async () => {
    let result = RenderUIComponentResult();

    setTimeout(async () => {
      await waitFor(() => screen.getByTestId("btnImport"));
      expect(screen.getByTestId("btnImport")).toBeInTheDocument();
      const btnImport = screen.getByTestId("btnImport");
      fireEvent.click(btnImport);

      const someElement = result.container.querySelector(
        `input[type="file"]`
      ) as HTMLInputElement;

      Object.defineProperty(someElement, "files", {
        value: [file],
      });
      await waitFor(
        () => {
          fireEvent.change(someElement);
        },
        {
          timeout: 1000,
        }
      );
      await waitFor(
        () => expect(screen.getByTestId("btnRemoveFile")).toBeInTheDocument(),
        {
          timeout: 4000,
        }
      );
      const btnRemoveFile = screen.getByTestId("btnRemoveFile");
      fireEvent.click(btnRemoveFile);
    }, 1000);
  });

  it("Import List - Upload invalid File", async () => {
    let result = RenderUIComponentResult();
    let file: any;
    const csvData = `Custom Medication Name,DEA Schedule,Medication Groups,Ingredient 1,Ingredient 1 NDC,Ingredient 2,Ingredient 2 NDC,Ingredient 3,Ingredient 3 NDC,Ingredient 4,Ingredient 4 NDC,Ingredient 5,Ingredient 5 NDC,Ingredient 6,Ingredient 6 NDC,Ingredient 7,Ingredient 7 NDC,Ingredient 8,Ingredient 8 NDC,Ingredient 9,Ingredient 9 NDC,Ingredient 10,Ingredient 10 NDC,Ingredient 11,Ingredient 11 NDC,Ingredient 12,Ingredient 12 NDC,Ingredient 13,Ingredient 13 NDC,Ingredient 14,Ingredient 14 NDC,Ingredient 15,Ingredient 15 NDC
    BrainsUp (Essential Omega Acids),Not Controlled,Antidepressants; Antipsychotics; Bisphosphonates,"1,2-pentanediol (bulk) 100 % liquid",38779275201,(d)-limonene flavor (bulk) 100 % liquid,51927325900,,,,,,,,,,,,,,,,,,,,,,,,,,
    Carligo (ligaments health),Schedule II,EENT; Aricept/Donepezil; Chemotherapy,"1,2-pentanediol (bulk) 100 % liquid",38779275201,(d)-limonene flavor (bulk) 100 % liquid,51927325900,,,,,,,,,,,,,,,,,,,,,,,,,,
    HerbaVita (Herbal Multivitamins),Schedule V,Insulin; Fluoroquinolones; Immunization/Vaccination,"1st Tier Unifine Pentips Plus 29 gauge x 1/2","needle",08517382936,"1st Tier Unifine Pentips 32 gauge x 5/32","needle",08517354036,,,,,,,,,,,,,,,,,,,,,,,,,,
    Wow Nails (Nails health kit),Schedule III,Eye Drops; Fluoroquinolones; Immunization/Vaccination,12 Hour Nasal Spray 0.05 %,11822145760,12 Hour Nasal Relief Spray 0.05 %,59390003613,,,,,,,,,,,,,,,,,,,,,,,,,,
    `;

    file = new File([csvData], "customMedicationsData.pdf", {
      type: "application/pdf",
    });
    await waitFor(() => screen.getByTestId("btnImport"));
    expect(screen.getByTestId("btnImport")).toBeInTheDocument();
    const btnImport = screen.getByTestId("btnImport");
    fireEvent.click(btnImport);

    const someElement = result.container.querySelector(
      `input[type="file"]`
    ) as HTMLInputElement;

    Object.defineProperty(someElement, "files", {
      value: [file],
    });
    await waitFor(
      () => {
        fireEvent.change(someElement);
      },
      {
        timeout: 500,
      }
    );

    await waitFor(
      () =>
        expect(
          screen.getByTestId("alert-import-error-close-btn")
        ).toBeInTheDocument(),
      {
        timeout: 500,
      }
    );
    const alert = screen.getByTestId("alert-import-error-close-btn");
    expect(alert).toBeInTheDocument();
    fireEvent.click(alert);
  });

  it("Import List - Upload Valid File & click on Validate File button & Export Errors", async () => {
    let result = RenderUIComponentResult();

    setTimeout(async () => {
      const btnImport = screen.getByTestId("btnImport");
      expect(btnImport).toBeInTheDocument();
      fireEvent.click(btnImport);

      const someElement = result.container.querySelector(
        `input[type="file"]`
      ) as HTMLInputElement;

      Object.defineProperty(someElement, "files", {
        value: [file],
      });
      fireEvent.change(someElement);
      await waitFor(
        () =>
          expect(screen.getByTestId("btnValidateAndUploadFile")).toBeEnabled(),
        {
          timeout: 3500,
        }
      );
      const btnValidateAndUploadFile = screen.getByTestId(
        "btnValidateAndUploadFile"
      );
      fireEvent.click(btnValidateAndUploadFile);

      const btnExportErrors = screen.getByTestId("btnExportErrors");
      expect(btnExportErrors).toBeInTheDocument();
      fireEvent.click(btnExportErrors);
    }, 1000);
  });

  it("Import List - Upload Valid File & click on Validate File button & Close Import Dialog", async () => {
    let result = RenderUIComponentResult();

    setTimeout(async () => {
      await waitFor(() => screen.getByTestId("btnImport"));
      expect(screen.getByTestId("btnImport")).toBeInTheDocument();
      const btnImport = screen.getByTestId("btnImport");
      fireEvent.click(btnImport);

      const someElement = result.container.querySelector(
        `input[type="file"]`
      ) as HTMLInputElement;

      Object.defineProperty(someElement, "files", {
        value: [file],
      });
      await waitFor(
        () => {
          fireEvent.change(someElement);
        },
        {
          timeout: 500,
        }
      );
      await waitFor(
        () =>
          expect(screen.getByTestId("btnValidateAndUploadFile")).toBeEnabled(),
        {
          timeout: 3500,
        }
      );
      const btnValidateAndUploadFile = screen.getByTestId(
        "btnValidateAndUploadFile"
      );
      fireEvent.click(btnValidateAndUploadFile);
    }, 1000);
  });
});

export const SetSelectedLibraryDetails = () => {
  let selectedLibraryObj = {
    id: 1,
    description: "Library",
    isActive: true,
    corporationId: 0,
  };
  sessionStorage.setItem(
    "selectedLibraryDetails",
    JSON.stringify(selectedLibraryObj)
  );
};

export const setCustomMedicationPageNumber = () => {
  sessionStorage.setItem("customMedicationPageNumber", "1");
};

const mockCustomMedicationList = () => {
  jest
    .spyOn(getCustomMedicationsList, "getCustomMedicationsList")
    .mockImplementation(async () => {
      return {
          customMedications: [
            {
              description: "Tylenol 325 mg capsule",
              id: 1,
              deaClassId: 2,
              isActive: true,
              fdbMedGroupLists: [
                {
                  id: 123,
                  description: "abc",
                },
                {
                  id: 124,
                  description: "xyz",
                },
              ],
              fdbIngredientLists: [
                {
                  id: 6,
                  description: "1,2-pentanediol (bulk) 100 % liquid",
                  representativeNDC: "38779275201",
                },
                {
                  id: 19,
                  description: "Tyblume 0.1 mg-20 mcg chewable tablet",
                  representativeNDC: "642747101",
                },
                {
                  id: 25,
                  description: "Tybost 150 mg tablet",
                  representativeNDC: "61958140101",
                },
              ],
            },
            {
              description: "Tylenol 25 mg capsule",
              id: 2,
              deaClassId: 3,
              isActive: true,
              fdbMedGroupLists: [
                {
                  id: 123,
                  description: "xyz",
                },
                {
                  id: 124,
                  description: "abc",
                },
              ],
              fdbIngredientLists: [],
            },
            {
              description: "Tylenol 425 mg capsule",
              id: 3,
              deaClassId: 4,
              isActive: true,
              fdbMedGroupLists: [],
              fdbIngredientLists: [],
            },
            {
              description: "Tylenol 425 mg capsule",
              id: 4,
              deaClassId: 5,
              isActive: false,
              fdbMedGroupLists: [],
              fdbIngredientLists: [],
            },
            {
              description: "Tylenol 425 mg capsule",
              id: 5,
              deaClassId: null,
              isActive: false,
              fdbMedGroupLists: [],
              fdbIngredientLists: [],
            },
            {
              description: "Tylenol 425 mg capsule",
              id: 6,
              deaClassId: 0,
              isActive: false,
              fdbMedGroupLists: [],
              fdbIngredientLists: [],
            },
          ],
          pagination: {
            size: 20,
            totalPages: 2,
            totalElements: 40,
            totalActiveElements: 3,
          },

      };
    });
};




const mockFacilityData = () => {
  jest
    .spyOn(getAssignedFacilitiesByCmlId, "getAssignedFacilitiesByCmlId")
    .mockImplementation(async () => {
      return [
         {
          corporateId: 234,
          facilityId: 2343,
          facilityName: "test facility",
          ectConfigId: 101,
          userId: 10022,
          showFacilitySetup:true
      },
      {
        corporateId: 2342,
        facilityId: 23432,
        facilityName: "test facility2",
        ectConfigId: 1012,
        userId: 100222,
        showFacilitySetup:false
    }
      ]
    });
};

const mockUploadCustomMedications = () => {
  jest
    .spyOn(getAssignedFacilitiesByCmlId, "getAssignedFacilitiesByCmlId")
    .mockImplementation(async () => {
      return [
         {
          corporateId: 234,
          facilityId: 2343,
          facilityName: "test facility",
          ectConfigId: 101,
          userId: 10022,
          showFacilitySetup:true
      },
      {
        corporateId: 2342,
        facilityId: 23432,
        facilityName: "test facility2",
        ectConfigId: 1012,
        userId: 100222,
        showFacilitySetup:false
    }
      ]
    });
};