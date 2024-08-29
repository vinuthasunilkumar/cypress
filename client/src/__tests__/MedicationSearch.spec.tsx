import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { server } from "../mocks/server";
import Order from "../features/medication-search/pages/MedicationSearch";
import * as searchMedication from "./../services/MedicationService";
import * as CustomerService from "../services/CustomerService";
import { Provider } from "react-redux";
import store from "./../redux/store";
import DrugInformation from "../features/medication-search/pages/DrugInformation";
import MedicationInfoList from "../features/medication-search/pages/MedicationInfoList";
import { setMockHostContextSetup } from "../helper/mockHostContextSetup";
import * as FormularyService from "../services/FormularyService";

jest.mock("axios", () => {
  const mAxiosInstance = {
    get: jest.fn().mockImplementation(async () => {
      const successResponse = {
        data: {
          facilityId: 1,
          customerId: 1,
          formularyId: 68,
          customMedicationLibraryId: 1,
          defaultGenericFormularyStatusText: "Excluded",
          defaultBrandFormularyStatusText: "Excluded",
          defaultOTCFormularyStatusText: "Excluded",
          drugs: [
            {
              formularyId: 68,
              medId: 262446,
              gcnSequenceNumber: 76,
              status: 10,
              message: "High cost medicine",
              id: 5942,
            },
            {
              formularyId: 68,
              medId: 434985,
              gcnSequenceNumber: 4698,
              status: 30,
              message: null,
              id: 5943,
            },
          ],
          altDrugs: [],
          versions: [
            {
              formularyId: 67,
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
          medicationSearchResultsDto: {
            pageNumber: 1,
            pageLength: 20,
            totalRows: 40,
            totalPages: 2,
            moreResultsExist: true,
            items: [
              {
                id: 434985,
                description: "Tylenol 325 mg capsule",
                genericMedication: {
                  description: "caffeine 200 mg tablet",
                  id: 154160,
                },
                drugInfo: [
                  {
                    infoType: 1,
                    lineType: 0,
                    lineText: "Indications",
                  },
                  {
                    infoType: 1,
                    lineType: 3,
                    lineText: "osteoarthritis of the knee",
                  },
                ],
                alerts: [1, 6],
                elements: {
                  typicalRoute: "oral",
                  doseForm: "tablet",
                  strengthValue: "200",
                  strengthUnits: "mg",
                  representativeNDC: "46122045773",
                  gcnSequenceNumber: 33,
                  primaryDoseCode: "mg",
                  secondaryDoseCode: "tab",
                  simpleDoseRatio: 0.005,
                  complexDoseRatio: null,
                  isGHB: null,
                  representativeRxCui: "198520",
                  availability: "Available",
                },
              },
              {
                id: 159962,
                description: "Alert 200 mg tablet",
                genericMedication: {
                  description: "caffeine 200 mg tablet",
                  id: 154160,
                },
                alerts: [2, 3],
                elements: {
                  typicalRoute: "oral",
                  doseForm: "tablet",
                  strengthValue: "200",
                  strengthUnits: "mg",
                  representativeNDC: "00122088066",
                  gcnSequenceNumber: 33,
                  primaryDoseCode: "mg",
                  secondaryDoseCode: "tab",
                  simpleDoseRatio: 0.005,
                  complexDoseRatio: null,
                  isGHB: null,
                  representativeRxCui: "198520",
                  availability: "EquivalentsAvailable",
                },
              },
              {
                id: 183640,
                description: "AlerTab 25 mg tablet",
                genericMedication: {
                  description: "diphenhydramine 25 mg tablet",
                  id: 243574,
                },
                alerts: [0, 1],
                elements: {
                  typicalRoute: "oral",
                  doseForm: "tablet",
                  strengthValue: "25",
                  strengthUnits: "mg",
                  representativeNDC: "43292055631",
                  gcnSequenceNumber: 11594,
                  primaryDoseCode: "mg",
                  secondaryDoseCode: "tab",
                  simpleDoseRatio: 0.04,
                  complexDoseRatio: null,
                  isGHB: null,
                  representativeRxCui: null,
                  availability: "EquivalentsAvailable",
                },
              },
              {
                id: 282530,
                description: "Alertness 200 mg tablet",
                genericMedication: {
                  description: "caffeine 200 mg tablet",
                  id: 154160,
                },
                alerts: [1, 2, 3, 0],
                elements: {
                  typicalRoute: "oral",
                  doseForm: "tablet",
                  strengthValue: "200",
                  strengthUnits: "mg",
                  representativeNDC: "19458979301",
                  gcnSequenceNumber: 33,
                  primaryDoseCode: "mg",
                  secondaryDoseCode: "tab",
                  simpleDoseRatio: 0.005,
                  complexDoseRatio: null,
                  isGHB: null,
                  representativeRxCui: "198520",
                  availability: "EquivalentsAvailable",
                },
              },
            ],
          },
          alerts: [
            {
              target_MedID: 558708,
              type: "Drug/Allergy",
              severity: "Contraindicated",
              summaryText: "Milk Containing Products (Dairy)",
              trigger_MedID: null,
              allergenGroupID: 900546,
              allergicTo_DrugID: null,
              drugDrugMonographID: null,
              icD10Code: null,
            },
            {
              target_MedID: 598878,
              type: "Drug/Allergy",
              severity: "Contraindicated",
              summaryText: "Milk Containing Products (Dairy)",
              trigger_MedID: null,
              allergenGroupID: 900546,
              allergicTo_DrugID: null,
              drugDrugMonographID: null,
              icD10Code: null,
            },
          ],
        },
      };
      return Promise.resolve(successResponse);
    }),
  };
  return {
    create: jest.fn(() => mAxiosInstance),
  };
});

jest.mock("../services/CustomerService", () => ({
  getFacilityConfigurationAsync: jest.fn().mockResolvedValue([
    {
      facilityId: 1,
      customerId: 1,
      customMedicationLibraryId: 1,
      ectConfigId: 10062,
      formularyId: 68,
    },
  ]),
}));

jest.mock("../services/FormularyService", () => ({
  getFormularyInfoByFormularyId: jest.fn().mockResolvedValue([
    {
      defaultGenericFormularyStatusText: "Excluded",
      defaultBrandFormularyStatusText: null,
      defaultOtcFormularyStatusText: "Excluded",
      drugs: [
        {
          id: 5942,
          formularyId: 68,
          medId: 262446,
          gcnSequenceNumber: 76,
          status: 10,
          message: "High cost medicine",
        },
        {
          id: 5943,
          formularyId: 68,
          medId: 434985,
          gcnSequenceNumber: 4698,
          status: 30,
          message: null,
        },
      ],
      id: 68,
      description: "test2",
      defaultGenericFormularyStatus: 3,
      defaultBrandFormularyStatus: 3,
      defaultOtcFormularyStatus: 3,
      cancelDate: null,
      isActive: true,
    },
  ]),
}));

beforeEach(() => {
  setMockHostContextSetup();
});

const mockedFacilityConfigService =
  CustomerService.getFacilityConfigurationAsync as jest.MockedFunction<
    typeof CustomerService.getFacilityConfigurationAsync
  >;

const mockedFormularyInfoByFormularyId =
  FormularyService.getFormularyInfoByFormularyId as jest.MockedFunction<
    typeof FormularyService.getFormularyInfoByFormularyId
  >;

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());

const drugResponse = {
  id: 604587,
  description: "Tyblume 0.1 mg-20 mcg chewable tablet",
  therapeuticClass: {
    description: "Contraceptive Oral - Monophasic",
    id: 145,
  },
  genericmedication: {
    description:
      "levonorgestrel 0.1 mg-ethinyl estradiol 20 mcg chewable tablet",
    id: 605396,
  },
  drugInfo: [
    {
      infoType: 1,
      lineType: 0,
      lineText: "Indications",
    },
    {
      infoType: 1,
      lineType: 2,
      lineText: "hypertension",
    },
    {
      infoType: 1,
      lineType: 1,
      lineText: "Less Frequent",
    },
    {
      infoType: 1,
      lineType: 3,
      lineText: "abnormal uterine bleeding (Unlabeled)",
    },
    {
      infoType: 2,
      lineType: 0,
      lineText: "Contraindications",
    },
    {
      infoType: 2,
      lineType: 1,
      lineText: "Contraindicated",
    },
    {
      infoType: 2,
      lineType: 3,
      lineText: "acute myocardial infarction",
    },

    {
      infoType: 3,
      lineType: 0,
      lineText: "Side Effects",
    },
    {
      infoType: 3,
      lineType: 1,
      lineText: "Major Effects",
    },
    {
      infoType: 3,
      lineType: 2,
      lineText: "Less Frequent",
    },

    {
      infoType: 4,
      lineType: 0,
      lineText: "Drug-Drug Interactions",
    },
    {
      infoType: 4,
      lineType: 1,
      lineText: "Contraindicated",
    },
    {
      infoType: 5,
      lineType: 0,
      lineText: "Drug-Food Interactions",
    },
    {
      infoType: 5,
      lineType: 1,
      lineText: "Less Severe Interaction",
    },
    {
      infoType: 5,
      lineType: 3,
      lineText:
        "Cause: Estrogens. Grapefruit may increase serum drug conc. Avoid grapefruit unless md instructs otherwise.",
    },
    {
      infoType: 6,
      lineType: 0,
      lineText: "Min/Max Dosing",
    },
    {
      infoType: 6,
      lineType: 1,
      lineText: "Pediatric Dosing",
    },
    {
      infoType: 6,
      lineType: 3,
      lineText: "10 years up to 18 years: 0.675 ea/day to 1 ea/day",
    },
    {
      infoType: 6,
      lineType: 1,
      lineText: "Adult Dosing",
    },
    {
      infoType: 6,
      lineType: 3,
      lineText: "0.675 ea/day to 1 ea/day",
    },
  ],
  Elements: {
    typicalRoute: "oral",
    doseForm: "tablet,chewable",
    strengthValue: "0.1 mg-",
    strengthUnits: "20 mcg",
    representativeNDC: "00642747101",
    gcnSequenceNumber: 81896,
    primaryDoseCode: "tab",
    secondaryDoseCode: null,
    simpleDoseRatio: null,
    complexDoseRatio: null,
    isGHB: null,
    representativeRxCui: "2465331",
    availability: "Available",
  },
  patientMonograph:
    "IMPORTANT: HOW TO USE THIS INFORMATION:  This is a summary and does NOT have all possible information about this product.",
  CommonSIGs: null,
};

const MedInfoComponent = () => {
  render(
    <MemoryRouter>
      <MedicationInfoList
        infoType={1}
        headerText={"Indications"}
        medicationInfo={drugResponse}
      />
    </MemoryRouter>
  );
};

const DrugUiComponent = () => {
  render(
    <MemoryRouter>
      <DrugInformation
        isMenuActive={true}
        setIsMenuActive={() => {
          return true;
        }}
        onOverLayClick={() => {
          return true;
        }}
        medicationId={226663}
      />
    </MemoryRouter>
  );
};

const RenderUIComponent = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    </Provider>
  );
};

describe("Medication", () => {
  it("renders without crashing", () => {
    window.scrollTo = jest.fn();
  });

  it("Checking fields are available", async () => {
    RenderUIComponent();
    await waitFor(() => screen.getByTestId("search"));
    expect(screen.getByTestId("search")).toBeInTheDocument();
  });

  it("Fill data to the fields", async () => {
    RenderUIComponent();
    await waitFor(() => {
      fireEvent.change(screen.getByTestId("search"), {
        target: { value: "Tylenol" },
      });
      const expectElement = screen.getByTestId<HTMLInputElement>("search");
      expect(expectElement.value).toBe("Tylenol");
    });
  });

  it("Search the fields", async () => {
    RenderUIComponent();
    localStorage.setItem("selectedFacility", JSON.stringify({ id: 1 }));
    await waitFor(
      () => {
        const searchId = screen.getByTestId("search");
        fireEvent.change(searchId, {
          target: { value: "Tylenol" },
        });
        const TylenolId = screen.getByTestId("Tylenol 325 mg capsule");
        expect(TylenolId).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it("Pagination", async () => {
    RenderUIComponent();
    await waitFor(
      () => {
        const searchId = screen.getByTestId("search");
        fireEvent.change(searchId, {
          target: { value: "Tylenol" },
        });
        const TylenolId = screen.getByTestId("Tylenol 325 mg capsule");
        expect(TylenolId).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    await waitFor(
      () => {
        const searchId = screen.getByTestId("search");
        fireEvent.change(searchId, {
          target: { value: "" },
        });
        const noDataFoundId = screen.getByTestId("NoDataFound");
        expect(noDataFoundId).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it("Next Page Click & HandleInfoClick", async () => {
    RenderUIComponent();
    await waitFor(
      () => {
        fireEvent.change(screen.getByTestId("search"), {
          target: { value: "Tylenol" },
        });
        const nextPage = screen.getByTestId("nextPage");
        expect(nextPage).toBeInTheDocument();
        const btnHandleInfo = screen.getAllByTestId("btnHandleInfo");
        fireEvent.click(btnHandleInfo[0]);
        fireEvent.click(nextPage);
      },
      { timeout: 1000 }
    );
  });

  it("Pagination data is Null ", async () => {
    RenderUIComponent();

    const mockFetchData = jest
      .spyOn(searchMedication, "searchMedication")
      .mockImplementation(async () => {
        return {
          items: [
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
            },
          ],
          moreResultsExist: true,
          pageLength: 20,
          pageNumber: null,
          totalPages: null,
          totalRows: null,
        };
      });

    await waitFor(
      () => {
        fireEvent.change(screen.getByTestId("search"), {
          target: { value: "Tylenol" },
        });
        expect(screen.getByTestId("nextPage")).toBeInTheDocument();
        const nextPage = screen.getByTestId("nextPage");
        fireEvent.click(nextPage);
      },
      { timeout: 1000 }
    );
  });

  it("No Data found", async () => {
    RenderUIComponent();

    const mockFetchData = jest
      .spyOn(searchMedication, "searchMedication")
      .mockImplementation(async () => {
        return {
          items: undefined,
          moreResultsExist: false,
          pageLength: 20,
          pageNumber: null,
          totalPages: null,
          totalRows: null,
        };
      });

    await waitFor(
      () => {
        fireEvent.change(screen.getByTestId("search"), {
          target: { value: "Tylenol" },
        });

        const noDataFoundId = screen.getByTestId("NoDataFound");
        expect(noDataFoundId).toBeInTheDocument();
      },
      {
        timeout: 1000,
      }
    );
  });

  it("Drug Information Click", async () => {
    RenderUIComponent();

    const mockFetchData = jest
      .spyOn(searchMedication, "searchMedication")
      .mockImplementation(async () => {
        return {
          items: [
            {
              description: "Tylenol 325 mg capsule",
              id: 1,
            },
          ],
        };
      });

    await waitFor(
      () => {
        const searchId = screen.getByTestId("search");
        fireEvent.change(searchId, {
          target: { value: "Tylenol" },
        });
        const iconButton = screen.getByTestId("Tylenol 325 mg capsule");
        expect(iconButton).toBeInTheDocument();
        fireEvent.click(iconButton);
      },
      { timeout: 3000 }
    );
  });

  it("Cancel Button Click", async () => {
    RenderUIComponent();
    setMockHostContextSetup("true", "true");
    await waitFor(
      () => {
        const cancelBtn = screen.getByTestId("cancelBtn");
        expect(cancelBtn).toBeInTheDocument();
        fireEvent.click(cancelBtn);
      },
      { timeout: 1000 }
    );
  });

  it("Click icon button - Open medication Popup & Cancel or Close it", async () => {
    RenderUIComponent();

    await waitFor(
      () => {
        const searchId = screen.getByTestId("search");
        fireEvent.change(searchId, {
          target: { value: "Tylenol" },
        });
        expect(
          screen.getByTestId("Tylenol 325 mg capsule")
        ).toBeInTheDocument();
        const iconButton = screen.getByTestId("btnHandleInfo");
        fireEvent.keyDown(iconButton);
        fireEvent.click(iconButton);
      },
      { timeout: 3000 }
    );
  });

  it("Triggers an alert for unavailable medication", async () => {
    RenderUIComponent();

    const mockFetchData = jest
      .spyOn(searchMedication, "searchMedication")
      .mockImplementation(async () => {
        return {
          items: [
            {
              description: "Tylenol 325 mg capsule",
              id: 2,
              elements: {
                availability: "Available",
              },
            },
            {
              description: "Alert 200 mg tablet",
              id: 2,
              elements: {
                availability: "EquivalentsAvailable",
              },
            },
          ],
        };
      });

    await waitFor(
      () => {
        fireEvent.change(screen.getByTestId("search"), {
          target: { value: "Alert" },
        });
        const alert200mgId = screen.getByTestId("Alert 200 mg tablet-anchor");
        fireEvent.click(alert200mgId);
      },
      { timeout: 3000 }
    );

    await waitFor(
      () => {
        expect(screen.getByTestId("obsolete-alert")).toBeInTheDocument();
        let obsoleteId = screen.getByTestId("obsolete-alert");
        fireEvent.click(obsoleteId);
      },
      { timeout: 1000 }
    );
  });

  it("Triggers an alert for generic medication with isCloudMedOrderWriterEnabled false", async () => {
    RenderUIComponent();
    setMockHostContextSetup("true", "true", false);
    jest
      .spyOn(searchMedication, "searchMedication")
      .mockImplementation(async () => {
        return {
          items: [
            {
              id: 434985,
              description: "Tylenol 325 mg capsule",
              genericMedication: {
                description: "Custom",
                id: 154160,
                availability: "Available",
              },
            },
          ],
        };
      });

    await waitFor(
      () => {
        fireEvent.change(screen.getByTestId("search"), {
          target: { value: "Tylenol" },
        });
        expect(
          screen.getAllByTestId("Tylenol 325 mg capsule-anchorgeneric")
        )[0]?.toBeInTheDocument();
        const genericMedication = screen.getAllByTestId(
          "Tylenol 325 mg capsule-anchorgeneric"
        );
        fireEvent.keyDown(genericMedication[0]);
        fireEvent.click(genericMedication[0]);
      },
      { timeout: 3000 }
    );
  });

  it("Triggers an alert for generic medication with isCloudMedOrderWriterEnabled true", async () => {
    RenderUIComponent();
    setMockHostContextSetup("true", "true");
    jest
      .spyOn(searchMedication, "searchMedication")
      .mockImplementation(async () => {
        return {
          items: [
            {
              id: 434985,
              description: "Tylenol 325 mg capsule",
              genericMedication: {
                description: "Custom",
                id: 154160,
                availability: "Available",
              },
            },
          ],
        };
      });

    await waitFor(
      () => {
        fireEvent.change(screen.getByTestId("search"), {
          target: { value: "Tylenol" },
        });
        expect(
          screen.getAllByTestId("Tylenol 325 mg capsule-anchorgeneric")
        )[0]?.toBeInTheDocument();
        const genericMedication = screen.getAllByTestId(
          "Tylenol 325 mg capsule-anchorgeneric"
        );
        fireEvent.keyDown(genericMedication[0]);
        fireEvent.click(genericMedication[0]);
      },
      { timeout: 3000 }
    );
  });

  it("Triggers an alert for custom medication when it is a discharge order with isCloudMedOrderWriterEnabled false", async () => {
    RenderUIComponent();
    setMockHostContextSetup("false", "false", false);

    jest
      .spyOn(searchMedication, "searchMedication")
      .mockImplementation(async () => {
        return {
          items: [
            {
              description: "Custom Med Unit Test",
              id: 2,
              elements: {
                availability: "Available",
              },
              genericMedication: {
                description: "Custom",
              },
            },
          ],
        };
      });

    await waitFor(
      () => {
        fireEvent.change(screen.getByTestId("search"), {
          target: { value: "Alert" },
        });
        const alertCustomMedDischarge = screen.getByTestId(
          "Custom Med Unit Test-anchor"
        );
        fireEvent.keyDown(alertCustomMedDischarge);
        fireEvent.click(alertCustomMedDischarge);
      },
      { timeout: 3000 }
    );
  });

  it("Triggers an alert for generic medication when it is a discharge order with isCloudMedOrderWriterEnabled false", async () => {
    RenderUIComponent();
    setMockHostContextSetup("false", "false", false);

    jest
      .spyOn(searchMedication, "searchMedication")
      .mockImplementation(async () => {
        return {
          items: [
            {
              description: "Custom Med Unit Test",
              id: 2,
              elements: {
                availability: "Available",
              },
              genericMedication: {
                description: "Generic",
              },
            },
          ],
        };
      });

    await waitFor(
      () => {
        fireEvent.change(screen.getByTestId("search"), {
          target: { value: "Alert" },
        });
        const alertCustomMedDischarge = screen.getByTestId(
          "Custom Med Unit Test-anchor"
        );
        fireEvent.keyDown(alertCustomMedDischarge);
        fireEvent.click(alertCustomMedDischarge);
      },
      { timeout: 3000 }
    );
  });

  it("Triggers an alert for custom medication when it is a discharge order with isCloudMedOrderWriterEnabled true", async () => {
    RenderUIComponent();
    setMockHostContextSetup("true", "true");

    jest
      .spyOn(searchMedication, "searchMedication")
      .mockImplementation(async () => {
        return {
          items: [
            {
              description: "Tylenol 325 mg capsule",
              id: 2,
              elements: {
                availability: "Available",
              },
            },
            {
              description: "Custom Med Unit Test",
              id: 2,
              genericMedication: {
                availability: null,
                description: "Custom",
                id: 0,
              },
              elements: {
                availability: "Available",
              },
            },
          ],
        };
      });

    await waitFor(
      () => {
        fireEvent.change(screen.getByTestId("search"), {
          target: { value: "Alert" },
        });
        const alertCustomMedDischarge = screen.getByTestId(
          "Custom Med Unit Test-anchor"
        );
        fireEvent.keyDown(alertCustomMedDischarge);
        fireEvent.click(alertCustomMedDischarge);
      },
      { timeout: 3000 }
    );

    await waitFor(
      () => {
        expect(
          screen.getByTestId("custom-med-discharge-order-alert")
        ).toBeInTheDocument();
        let dischargeOrderElementId = screen.getByTestId(
          "custom-med-discharge-order-alert"
        );
        fireEvent.click(dischargeOrderElementId);
      },
      { timeout: 1000 }
    );
  });

  it("Does not trigger an alert for available medication", async () => {
    RenderUIComponent();

    const mockFetchData = jest
      .spyOn(searchMedication, "searchMedication")
      .mockImplementation(async () => {
        return {
          items: [
            {
              description: "Tylenol 325 mg capsule",
              id: 2,
              elements: {
                availability: "Available",
              },
            },
            {
              description: "Alert 200 mg tablet",
              id: 2,
              elements: {
                availability: "EquivalentsAvailable",
              },
            },
          ],
        };
      });

    await waitFor(
      () => {
        fireEvent.change(screen.getByTestId("search"), {
          target: { value: "Tylenol" },
        });
        const tylenolId = screen.getByTestId("Tylenol 325 mg capsule");
        fireEvent.click(tylenolId);
        expect(screen.queryByTestId("obsolete-alert")).not.toBeInTheDocument();
      },
      {
        timeout: 3000,
      }
    );
  });

  it("Doest not trigger an alert for custom medication when it is NOT a discharge order", async () => {
    RenderUIComponent();

    const mockFetchData = jest
      .spyOn(searchMedication, "searchMedication")
      .mockImplementation(async () => {
        return {
          items: [
            {
              description: "Tylenol 325 mg capsule",
              id: 2,
              elements: {
                availability: "Available",
              },
            },
            {
              description: "Custom Med Unit Test",
              id: 2,
              genericMedication: {
                availability: null,
                description: "Custom",
                id: 0,
              },
              elements: {
                availability: "Available",
              },
            },
          ],
        };
      });

    await waitFor(
      () => {
        fireEvent.change(screen.getByTestId("search"), {
          target: { value: "Alert" },
        });
        const alertCustomMedDischarge = screen.getByTestId(
          "Custom Med Unit Test-anchor"
        );
        fireEvent.click(alertCustomMedDischarge);
      },
      { timeout: 3000 }
    );

    await waitFor(
      () => {
        expect(
          screen.queryByTestId("custom-med-discharge-order-alert")
        ).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it("Drug Information Operation", async () => {
    RenderUIComponent();
    DrugUiComponent();
    MedInfoComponent();

    jest
      .spyOn(searchMedication, "searchMedication")
      .mockImplementation(async () => {
        return {
          items: [
            {
              description: "Tylenol 325 mg capsule",
              id: 1,
            },
          ],
        };
      });

    jest.fn().mockImplementation(async () => {
      const successResponse = drugResponse;
      return Promise.resolve(successResponse);
    });

    await waitFor(
      () => {
        const searchId = screen.getByTestId("search");
        fireEvent.change(searchId, {
          target: { value: "Tylenol" },
        });
        const iconButton = screen.getByTestId("Tylenol 325 mg capsule");
        expect(iconButton).toBeInTheDocument();
        fireEvent.click(iconButton);
        let strBtnNames = [
          "genInfoLink",
          "indicationsLink",
          "contraindicationsLink",
          "sideEffectsLink",
          "drugDrugInteractionsLink",
          "minMaxDosingLink",
          "monographLink",
          "backBtn",
        ];
        strBtnNames.forEach((name) => {
          const btnName = screen.getByTestId(name);
          expect(btnName).toBeInTheDocument();
          fireEvent.click(btnName);
        });
      },
      { timeout: 3000 }
    );
  });

  it("should call overlay method in medication search", async () => {
    RenderUIComponent();
    DrugUiComponent();

    await waitFor(
      async () => {
        screen.getByTestId("search");
        const searchId = screen.getByTestId("search");
        fireEvent.change(searchId, {
          target: { value: "Tylenol" },
        });
        const iconButton = screen.getByTestId("Tylenol 325 mg capsule");
        expect(iconButton).toBeInTheDocument();
        fireEvent.click(iconButton);
      },
      { timeout: 3000 }
    );
    await waitFor(
      () => {
        let backBtnElement = screen.getAllByTestId("btnOverLayclick");
        fireEvent.click(backBtnElement[0]);
      },
      { timeout: 2000 }
    );
  });
});
