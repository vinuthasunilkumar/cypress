import React from "react";
import * as FormularyService from "../services/FormularyService";
import * as CustomerService from "../services/CustomerService";
import * as ModuleActivationService from "../services/ModuleActivationService";
import {
  render,
  waitFor,
  screen,
  cleanup,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { server } from "../mocks/server";
import FacilitySetup from "../features/facility/pages/FacilitySetup";
import { Provider } from "react-redux";
import store from "./../redux/store";
import { setMockHostContextSetup } from "../helper/mockHostContextSetup";
import { mockUserFacility } from "../helper/mockUserFacility";

afterEach(cleanup);

jest.mock("axios", () => {
  const mAxiosInstance = {
    get: jest.fn().mockImplementation(async () => {
      const successResponse = {
        data: [
          {
            id: 68,
            description: "test2",
            defaultGenericFormularyStatus: 3,
            defaultBrandFormularyStatus: 3,
            defaultOTCFormularyStatus: 3,
            cancelDate: null,
            isActive: true,
          },
        ],
        defaultGenericFormularyStatusText: "Excluded",
        defaultBrandFormularyStatusText: "Excluded",
        defaultOTCFormularyStatusText: "Excluded",
        drugs: [],
        altDrugs: [],
        versions: [
          {
            formularyId: 68,
            version: 1,
            createdOn: "11/23/2022 21:41:35",
            id: 73,
          },
        ],
        id: 67,
        description: "test5",
        defaultGenericFormularyStatus: 3,
        defaultBrandFormularyStatus: 3,
        defaultOTCFormularyStatus: 3,
        cancelDate: null,
        isActive: true,
      };
      return Promise.resolve(successResponse);
    }),
    post: jest
      .fn()
      .mockImplementation(() => {
        const failedResponse = {
          data: "",
          status: 500,
          statusText: "",
        };
        return Promise.resolve(failedResponse);
      })
      .mockImplementation(() => {
        const saveResponse = {
          data: {},
          status: 200,
        };
        return Promise.resolve(saveResponse);
      }),
  };
  return {
    create: jest.fn(() => mAxiosInstance),
  };
});

jest.mock("../services/FormularyService", () => {
  return {
    getFormularyList: jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: 68,
          description: "test2",
          defaultGenericFormularyStatus: 3,
          defaultBrandFormularyStatus: 3,
          defaultOTCFormularyStatus: 3,
          cancelDate: null,
          isActive: true,
        },
      ])
    ),
  };
});

jest.mock("../services/CustomerService", () => ({
  getFacilityConfigurationAsync: jest.fn().mockResolvedValue([
    {
      facilityId: 1,
      customerId: 1,
      formularyId: 68,
      customMedicationLibraryId: 1,
      ectConfigId: 1,
    },
  ]),
  getCustomMedicationLibraryList: jest.fn().mockResolvedValue([
    { id: 1, name: "Library 1" },
    { id: 2, name: "Library 2" },
  ]),
  saveFacilityLibrariesAsync: jest
    .fn()
    .mockImplementation(() => Promise.resolve()),
}));

jest.mock("../services/AdministrationScheduleListService", () => {
  return {
    AddNewAdministrationScheduleList: jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          description:
            "location & Admin & snf +user-adm % Administration Schedule List",
          id: 6,
          status: false,
          responseMessage: "Library saved successfully.",
          statusCode: 200,
          isAdministrationScheduleListCreated: true,
        },
      ])
    ),
  };
});

jest.mock("../services/StockMedicationLibraryService", () => {
  return {
    AddNewStockMedicationLibrary: jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          description: "dummy Stock Medication/Supply List",
          id: 72,
          responseMessage: "Library saved successfully.",
          isStockLibraryCreated: true,
        },
      ])
    ),
  };
});

jest.mock("../services/ModuleActivationService", () => {
  return {
    getModuleActivationStatus: jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          isModuleActive: true,
          facilityId: 9,
          moduleCode: "MULTICARE_ORDER_SRCH",
        },
      ])
    ),
  };
});

beforeEach(() => {
  setMockHostContextSetup();
});

const RenderUIComponent = () => {
  mockUserFacility.facilityId = 1;
  render(
    <Provider store={store}>
      <MemoryRouter>
        <FacilitySetup userFacilityData={mockUserFacility} />
      </MemoryRouter>
    </Provider>
  );
};

const RenderUIComponentResult = () => {
  let result = render(
    <Provider store={store}>
      <MemoryRouter>
        <FacilitySetup userFacilityData={mockUserFacility} />
      </MemoryRouter>
    </Provider>
  );
  return result;
};
const mockedFormularyService =
  FormularyService.getFormularyList as jest.MockedFunction<
    typeof FormularyService.getFormularyList
  >;
const mockedCustomMedService =
  CustomerService.getCustomMedicationLibraryList as jest.MockedFunction<
    typeof CustomerService.getCustomMedicationLibraryList
  >;
const mockedFacilityConfigService =
  CustomerService.getFacilityConfigurationAsync as jest.MockedFunction<
    typeof CustomerService.getFacilityConfigurationAsync
  >;

const mockedModuleActivationService =
  ModuleActivationService.getModuleActivationStatus as jest.MockedFunction<
    typeof ModuleActivationService.getModuleActivationStatus
  >;

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Save Facility Setup", () => {
  it("renders without crashing", () => {
    window.scrollTo = jest.fn();
  });

  it("Initializes formulary data", async () => {
    const basePath = "/cloud-orders";
    let selectedFacility: IUserFacility = {
      corporateId: 3,
      facilityId: 1,
      facilityName: "test",
      ectConfigId: 10062,
      userId: 47171,
      showFacilitySetup: false,
    };
    mockUserFacility.facilityId = selectedFacility.facilityId;
    await waitFor(() => {
      render(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[
              {
                state: {
                  basePath: basePath,
                  selectedFacility: selectedFacility,
                },
              },
            ]}
          >
            <FacilitySetup userFacilityData={mockUserFacility} />
          </MemoryRouter>
        </Provider>
      );
    });

    await waitFor(() => {
      expect(mockedFormularyService).toHaveBeenCalled();
      expect(mockedModuleActivationService).toHaveBeenCalled();
      expect(mockedCustomMedService).toHaveBeenCalled();
      expect(mockedFacilityConfigService).toHaveBeenCalled();
    });
  });

  it("Select the Formulary dropdown and save the library", async () => {
    const result = RenderUIComponentResult();
    const mockAlert = jest.spyOn(window, "alert").mockImplementation(() => {});

    await waitFor(
      async () => {
        const formularyDropdown = result.container.getElementsByClassName(
          "input-field-select Formulary Library__input"
        )[0];
        fireEvent.change(formularyDropdown, {
          target: { value: "None" },
        });
      },
      { timeout: 2000 }
    );
    await waitFor(
      () => {
        expect(screen.getByText("None")).toBeInTheDocument();
        const NoneMenu = screen.getByText<HTMLDListElement>("None");
        fireEvent.click(NoneMenu);
      },
      { timeout: 1000 }
    );
    await waitFor(
      async () => {
        const saveButton = screen.getByTestId("saveBtn");
        expect(saveButton).toBeInTheDocument();
        userEvent.click(saveButton);
      },
      { timeout: 2000 }
    );

    expect(
      screen.queryByTestId("alert-api-resposne-msg")
    ).not.toBeInTheDocument();
    mockAlert.mockRestore();
  });

  it("Select the Custom Medication Library dropdown and save the library", async () => {
    const result = RenderUIComponentResult();
    const mockAlert = jest.spyOn(window, "alert").mockImplementation(() => {});

    await waitFor(
      async () => {
        const customMedicationLibraryDropdown =
          result.container.getElementsByClassName(
            "input-field-select Custom Medication Library__input"
          )[0];
        fireEvent.change(customMedicationLibraryDropdown, {
          target: { value: "None" },
        });
      },
      { timeout: 2000 }
    );
    await waitFor(
      () => {
        expect(screen.getByText("None")).toBeInTheDocument();
        const NoneMenu = screen.getByText<HTMLDListElement>("None");
        fireEvent.click(NoneMenu);
      },
      { timeout: 1000 }
    );

    await waitFor(
      async () => {
        const saveButton = screen.getByTestId("saveBtn");
        expect(saveButton).toBeInTheDocument();
        userEvent.click(saveButton);
      },
      { timeout: 2000 }
    );

    expect(
      screen.queryByTestId("alert-api-resposne-msg")
    ).not.toBeInTheDocument();
    mockAlert.mockRestore();
  });

  it("Enhanced Order Search Toggle Change", async () => {
    RenderUIComponent();

    await waitFor(
      async () => {
        let enhancedOrderSearchToggle = screen.getByTestId<HTMLInputElement>(
          "enhancedOrderSearchToggle"
        );
        expect(enhancedOrderSearchToggle).toBeInTheDocument();
        fireEvent.change(enhancedOrderSearchToggle, { target: false });
        fireEvent.click(enhancedOrderSearchToggle);
      },
      { timeout: 3000 }
    );

    await waitFor(
      async () => {
        const saveButton = screen.getByTestId("saveBtn");
        expect(saveButton).toBeEnabled();
        fireEvent.click(saveButton);
      },
      { timeout: 5000 }
    );
  });

  it("Cancel Button Click", async () => {
    RenderUIComponent();
    await waitFor(
      async () => {
        const cancelButton = screen.getByTestId("cancelBtn");
        expect(cancelButton).toBeInTheDocument();
        fireEvent.click(cancelButton);
      },
      { timeout: 2000 }
    );
  });

  it("Create New Schedule List button click", async () => {
    RenderUIComponent();
    await waitFor(
      () => {
        let btnAddNewScheduleList = screen.getByTestId("btnAddNewScheduleList");
        expect(btnAddNewScheduleList).toBeInTheDocument();
        fireEvent.click(btnAddNewScheduleList);
      },
      { timeout: 2000 }
    );
 
  });

  it("Create New Stock Medication button click", async () => {
    RenderUIComponent();
    await waitFor(
      async () => {
        let btnAddNewList = screen.getByTestId("btnAddNewList");
        expect(btnAddNewList).toBeInTheDocument();
        fireEvent.click(btnAddNewList);
      },
      { timeout: 2000 }
    );
  });
//todo
  // it("Current Admin Selected List", async () => {
  //   RenderUIComponent();

  //   await waitFor(
  //     async () => {
  //       let btnAddNewScheduleList = screen.getByTestId("btnAddNewScheduleList");
  //       expect(btnAddNewScheduleList).toBeInTheDocument();
  //       fireEvent.click(btnAddNewScheduleList);
  //     },
  //     { timeout: 2000 }
  //   );
  //   await waitFor(
  //     async () => {
  //       let dropdownMenuButtonAdmin = screen.queryByTestId(
  //         "dropdownMenuButtonAdmin"
  //       );
  //       expect(dropdownMenuButtonAdmin).toBeInTheDocument();
  //       userEvent.click(dropdownMenuButtonAdmin!);

  //       let btnCurrentAdminSelectedList = screen.queryByTestId(
  //         "btnCurrentAdminSelectedList"
  //       );
  //       expect(btnCurrentAdminSelectedList).toBeInTheDocument();
  //       // fireEvent.keyDown(btnCurrentAdminSelectedList!);
  //       userEvent.click(btnCurrentAdminSelectedList!);
  //     },
  //     { timeout: 2500 }
  //   );
  // });
});
