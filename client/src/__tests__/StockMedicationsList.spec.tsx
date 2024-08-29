import React from "react";
import {
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import store from "./../redux/store";
import StockMedicationsList from "../features/stock-medications/pages/StockMedicationsList";
import "@testing-library/jest-dom";
import { setMockHostContextSetup } from "../helper/mockHostContextSetup";
import { MemoryRouter } from "react-router-dom";
import * as loadUnitsByFacilityId from "../services/CustomerService";
import userEvent from "@testing-library/user-event";

jest.mock("axios", () => {
  const mAxiosInstance = {
    get: jest.fn().mockImplementation(() => {
      const successResponse = {
        data: {
          id: "00000001-0001-0001-0000-000000000000",
          description: "Unit 1",
          stockMedication: [
            {
              stockMedicationListId: 93,
              fdbDescription: "Col-Rite 100 mg capsule",
              assignedTo: "MatrixCare CenterUnit 1, Unit 2, Unit 3",
            },
            {
              stockMedicationListId: 94,
              fdbDescription:
                "24 Hour Allergy Relief 50 mcg/actuation nasal spray,suspension",
              assignedTo: "MatrixCare CenterUnit 1, Unit 2, Unit 3",
            },
            {
              stockMedicationListId: 95,
              fdbDescription: "Lasix 20 mg tablet",
              assignedTo: "MatrixCare Center",
            },
          ],
          medicationSearchResultsDto: {
            items: [
              {
                description: "Tylenol",
                id: 1,
              },
              {
                description: "0.2 Micron Filter Attachment",
                id: 2,
              },
            ],
          },
          pagination: {
            size: 20,
            totalElements: 3,
            totalPages: 2,
            number: 1,
            totalActiveElements: 3,
          },
        },
      };
      return Promise.resolve(successResponse);
    }),
    delete: jest
      .fn()
      .mockImplementationOnce(() => {
        const deleteResponse = {
          data: {
            id: 93,
            responseMessage: "This deleted successfully.",
          },
          status: 200,
        };
        return Promise.resolve(deleteResponse);
      })
      .mockImplementationOnce(() => {
        const notDeleteResponse = {
          data: {
            id: 51,
            responseMessage: "This stock medication does not exists",
          },
          status: 500,
        };
        return Promise.resolve(notDeleteResponse);
      }),
    post: jest.fn().mockImplementation(() => {
      const saveResponse = {
        data: {
          responseMessage: "Saved",
        },
        status: 200,
      };
      return Promise.resolve(saveResponse);
    }),
  };
  return {
    create: jest.fn(() => mAxiosInstance),
  };
});

const mockedUnitsInfo = [
  {
    "id": "00000001-0001-0001-0000-000000000000",
    "unitName": "Unit 1",
    "rooms": [
      {
        "id": "00000001-0001-0001-0001-000000000000",
        "unitId": "00000000-0000-0000-0000-000000000000",
        "description": "Room 1"
      },
      {
        "id": "00000001-0001-0001-0002-000000000000",
        "unitId": "00000000-0000-0000-0000-000000000000",
        "description": "Room 2"
      },
      {
        "id": "00000001-0001-0001-0003-000000000000",
        "unitId": "00000000-0000-0000-0000-000000000000",
        "description": "Room 3"
      },
      {
        "id": "00000001-0001-0001-0004-000000000000",
        "unitId": "00000000-0000-0000-0000-000000000000",
        "description": "Room 4"
      }
    ]
  },
  {
    "id": "00000001-0001-0002-0000-000000000000",
    "unitName": "Unit 2",
    "rooms": [
      {
        "id": "00000001-0001-0002-0001-000000000000",
        "unitId": "00000000-0000-0000-0000-000000000000",
        "description": "Room 1"
      },
      {
        "id": "00000001-0001-0002-0002-000000000000",
        "unitId": "00000000-0000-0000-0000-000000000000",
        "description": "Room 2"
      },
      {
        "id": "00000001-0001-0002-0003-000000000000",
        "unitId": "00000000-0000-0000-0000-000000000000",
        "description": "Room 3"
      }
    ]
  },
  {
    "id": "00000001-0001-0003-0000-000000000000",
    "unitName": "Unit 3",
    "rooms": [
      {
        "id": "00000001-0001-0003-0001-000000000000",
        "unitId": "00000000-0000-0000-0000-000000000000",
        "description": "Room 1"
      },
      {
        "id": "00000001-0001-0003-0002-000000000000",
        "unitId": "00000000-0000-0000-0000-000000000000",
        "description": "Room 2"
      },
      {
        "id": "00000001-0001-0003-0003-000000000000",
        "unitId": "00000000-0000-0000-0000-000000000000",
        "description": "Room 3"
      },
      {
        "id": "00000001-0001-0003-0004-000000000000",
        "unitId": "00000000-0000-0000-0000-000000000000",
        "description": "Room 4"
      },
      {
        "id": "00000001-0001-0003-0005-000000000000",
        "unitId": "00000000-0000-0000-0000-000000000000",
        "description": "Room 5"
      }
    ]
  }
]

beforeEach(() => {
  setSMLibraryDetails();
  setMockHostContextSetup();
});

const RenderUIComponent = () => {
  jest.useFakeTimers();
  render(
    <Provider store={store}>
      <MemoryRouter>
        <StockMedicationsList />
      </MemoryRouter>
    </Provider>
  );
  setScheduleListPageNumber();
  jest.advanceTimersByTime(1000);
};

const RenderUIResultComponent = () => {
  jest.useFakeTimers();
  let result = render(
    <Provider store={store}>
      <MemoryRouter>
        <StockMedicationsList />
      </MemoryRouter>
    </Provider>
  );
  setScheduleListPageNumber();
  jest.advanceTimersByTime(1000);
  return result;
};

describe("Stock Medications / Supply List Component ", () => {
  it("renders without crashing", () => {
    window.scrollTo = jest.fn();
  });

  it("Checking fields are available", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnAddNewStockMedications = screen.queryByTestId(
        "btnAddNewStockMedications"
      );
      expect(btnAddNewStockMedications).toBeInTheDocument();
    });
  });

  it("Search Master Checkbox select All & Delete click", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const txtSearch = screen.getByTestId<HTMLInputElement>("txtSearch");
      let strSearchText = ["Lasix", "a", "ab", "abc"];
      strSearchText.forEach((searchTxt) => {
        const keyUp = createEvent.keyUp(txtSearch, searchTxt);
        fireEvent(txtSearch, keyUp);
      });

      const btnChkMasterSelect = screen.queryByTestId("masterSelect");
      expect(btnChkMasterSelect).toBeInTheDocument();
      if (btnChkMasterSelect) fireEvent.click(btnChkMasterSelect);
      const btnSecondRecordSelect = screen.queryByTestId("94");
      if (btnSecondRecordSelect) fireEvent.click(btnSecondRecordSelect);
      const btnThirdRecordSelect = screen.queryByTestId("95");
      if (btnThirdRecordSelect) {
        fireEvent.click(btnThirdRecordSelect);
      }
      const btnDeleteStockMedications = screen.queryByTestId(
        "btnDeleteStockMedications"
      );
      expect(btnDeleteStockMedications).toBeInTheDocument();
      if (btnDeleteStockMedications) fireEvent.click(btnDeleteStockMedications);
      const cancelDeleteButton = screen.getByTestId("cancelDeleteButton");
      expect(cancelDeleteButton).toBeInTheDocument();
      fireEvent.click(cancelDeleteButton);
      const confirmDeleteButton = screen.getByTestId("confirmDeleteButton");
      expect(confirmDeleteButton).toBeInTheDocument();
      fireEvent.click(confirmDeleteButton);
    });
  });

  it("toggle master select", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnChkMasterSelect = screen.queryByTestId("masterSelect");
      expect(btnChkMasterSelect).toBeInTheDocument();
      if (btnChkMasterSelect) fireEvent.click(btnChkMasterSelect);
      if (btnChkMasterSelect) fireEvent.click(btnChkMasterSelect);

      const toggleMasterSelect = screen.queryByTestId("toggleMasterSelect");
      expect(toggleMasterSelect).toBeInTheDocument();
      if (toggleMasterSelect) fireEvent.click(toggleMasterSelect);
      if (toggleMasterSelect) fireEvent.click(toggleMasterSelect);
    })
  })

  it("Single Select & Delete Schedule click", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnFirstRecordSelect = screen.queryByTestId("93");
      expect(btnFirstRecordSelect).toBeInTheDocument();
      if (btnFirstRecordSelect) fireEvent.click(btnFirstRecordSelect);
      const btnSecondRecordSelect = screen.queryByTestId("94");
      expect(btnSecondRecordSelect).toBeInTheDocument();
      if (btnSecondRecordSelect) fireEvent.click(btnSecondRecordSelect);

      if (btnSecondRecordSelect) fireEvent.click(btnSecondRecordSelect);
      const btnThirdRecordSelect = screen.queryByTestId("95");
      expect(btnThirdRecordSelect).toBeInTheDocument();
      if (btnThirdRecordSelect) {
        fireEvent.click(btnThirdRecordSelect);
        fireEvent.click(btnThirdRecordSelect);
      }
      const btnSingleDeleteSchedule = screen.queryByTestId(
        "btnDeleteStockMedications"
      );
      expect(btnSingleDeleteSchedule).toBeInTheDocument();
      if (btnSingleDeleteSchedule) fireEvent.click(btnSingleDeleteSchedule);
      const cancelDeleteButton = screen.getByTestId("cancelDeleteButton");
      expect(cancelDeleteButton).toBeInTheDocument();
      fireEvent.click(cancelDeleteButton);
      if (btnSingleDeleteSchedule) fireEvent.click(btnSingleDeleteSchedule);
      // Will uncomment this code once API is ready
      const confirmDeleteButton = screen.getByTestId("confirmDeleteButton");
      expect(confirmDeleteButton).toBeInTheDocument();
      fireEvent.click(confirmDeleteButton);
    });
  });

  it("Search the fields", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const txtSearch = screen.getByTestId<HTMLInputElement>("txtSearch");
      fireEvent.change(txtSearch, { target: { value: "Lasix" } });
      expect(txtSearch.value).toBe("Lasix");
      fireEvent.keyPress(txtSearch, { key: "Enter", keyCode: 13 });
    });
  });

  it("Search the fields & clears the text", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const txtSearch = screen.getByTestId<HTMLInputElement>("txtSearch");
      fireEvent.change(txtSearch, { target: { value: "" } });
      expect(txtSearch.value).toBe("");
      fireEvent.keyPress(txtSearch, { key: "Enter", keyCode: 13 });
    });
  });

  it("Signle Click on sort for Medication/Supply Column", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnAddNewStockMedications = screen.queryByTestId(
        "btnAddNewStockMedications"
      );
      expect(btnAddNewStockMedications).toBeInTheDocument();
      const sortButton = screen.getByTestId(
        "sort-stock-medications-stockmedication"
      );
      fireEvent.click(sortButton);
      fireEvent.keyPress(sortButton, { key: "Enter", keyCode: 13 });
    });
  });

  it("Toggle for sort Medication/Supply Column", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnAddNewStockMedications = screen.queryByTestId(
        "btnAddNewStockMedications"
      );
      expect(btnAddNewStockMedications).toBeInTheDocument();
      const sortButton = screen.getByTestId(
        "sort-stock-medications-stockmedication"
      );
      fireEvent.click(sortButton);
      fireEvent.click(sortButton);
    });
  });

  it("Signle Click on sort assigned to column", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnAddNewStockMedications = screen.queryByTestId(
        "btnAddNewStockMedications"
      );
      expect(btnAddNewStockMedications).toBeInTheDocument();
      const sortButton = screen.getByTestId(
        "sort-stock-medications-assignedto"
      );
      fireEvent.click(sortButton);
      fireEvent.keyPress(sortButton, { key: "Enter", keyCode: 13 });
    });
  });

  it("Toggle for sort assigned to column", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnAddNewStockMedications = screen.queryByTestId(
        "btnAddNewStockMedications"
      );
      expect(btnAddNewStockMedications).toBeInTheDocument();
      const sortButton = screen.getByTestId(
        "sort-stock-medications-assignedto"
      );
      fireEvent.click(sortButton);
      fireEvent.click(sortButton);
    });
  });

  it("Click on Next Page", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnChkMasterSelect = screen.queryByTestId("masterSelect");
      if (btnChkMasterSelect) fireEvent.click(btnChkMasterSelect);
      const nextPage = screen.getByTestId("nextPage");
      expect(nextPage).toBeInTheDocument();
      fireEvent.click(nextPage);
    });
  });

  it("Click on Next Page When Master Checkbox is checked", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnChkMasterSelect = screen.queryByTestId("masterSelect");
      if (btnChkMasterSelect) fireEvent.click(btnChkMasterSelect);
      const nextPage = screen.getByTestId("nextPage");
      expect(nextPage).toBeInTheDocument();
      fireEvent.click(nextPage);

      if (btnChkMasterSelect) fireEvent.click(btnChkMasterSelect);
      const prevPage = screen.getByTestId("prevPage");
      expect(prevPage).toBeInTheDocument();
      fireEvent.click(prevPage);
    });
  });

  it("Open Edit Stock Medication & Click on Cancel", async () => {
    RenderUIComponent();
    await waitFor(() => {
      jest
        .spyOn(loadUnitsByFacilityId, "loadUnitsByFacilityId")
        .mockImplementation(async () => {
          const success = mockedUnitsInfo;
          return Promise.resolve(success);
        });
      const stockMedSupplyName = screen.queryAllByTestId("stockMedSupplyName");
      if (stockMedSupplyName) fireEvent.click(stockMedSupplyName[0]);
    });
  });  

  it("Open Edit Stock Medication & Click on Delete", async () => {
    RenderUIComponent();
    await waitFor(() => {
      jest
        .spyOn(loadUnitsByFacilityId, "loadUnitsByFacilityId")
        .mockImplementation(async () => {
          const success = mockedUnitsInfo;
          return Promise.resolve(success);
        });
      const stockMedSupplyName = screen.queryAllByTestId("stockMedSupplyName");
      if (stockMedSupplyName) fireEvent.click(stockMedSupplyName[0]);
    });
  });

  it("Export => Expost List", async () => {
    RenderUIComponent();
    await waitFor(() => {
      jest
        .spyOn(loadUnitsByFacilityId, "loadUnitsByFacilityId")
        .mockImplementation(async () => {
          const success = mockedUnitsInfo;
          return Promise.resolve(success);
        });
      const txtSearch = screen.getByTestId<HTMLInputElement>("txtSearch");
      let strSearchText = ["Lasix", "a", "ab", "abc", ""];
      strSearchText.forEach((searchTxt) => {
        const keyUp = createEvent.keyUp(txtSearch, searchTxt);
        fireEvent(txtSearch, keyUp);
      });
      const btnExportStockMedications = screen.queryByTestId("btnExportStockMedications");
      if (btnExportStockMedications) fireEvent.click(btnExportStockMedications);
      const btnExportList = screen.queryByTestId("btnExportList");
      if (btnExportList) fireEvent.click(btnExportList);
      const confirmButton = screen.queryByTestId("confirmButton");
      if (confirmButton) fireEvent.click(confirmButton);
      // Mock scrollIntoView function
      const mockScrollIntoView = jest.fn();
      // Create a mock HTMLElement
      const mockElement = {
        scrollIntoView: mockScrollIntoView.bind(mockScrollIntoView)
      } as HTMLElement; // <-- Cast to HTMLElement or a more specific type
      // Replace document.getElementById with a mock that returns our mock element
      jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);
      const focusToField = screen.queryAllByTestId("focusToField");
      if (focusToField) fireEvent.click(focusToField[0]);
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
      const btnAlertErrorClose = screen.queryByTestId("alert-error-close-btn");
      if (btnAlertErrorClose) fireEvent.click(btnAlertErrorClose);
      const cancelButton = screen.queryByTestId("cancelButton");
      if (cancelButton) fireEvent.click(cancelButton);
    });
  });

  it("Export => Expost Selected", async () => {
    RenderUIComponent();
    await waitFor(() => {
      jest
        .spyOn(loadUnitsByFacilityId, "loadUnitsByFacilityId")
        .mockImplementation(async () => {
          const success = mockedUnitsInfo;
          return Promise.resolve(success);
        });
      const txtSearch = screen.getByTestId<HTMLInputElement>("txtSearch");
      let strSearchText = ["Lasix"];
      strSearchText.forEach((searchTxt) => {
        const keyUp = createEvent.keyUp(txtSearch, searchTxt);
        fireEvent(txtSearch, keyUp);
      });
      const btnThirdRecordSelect = screen.queryByTestId("95");
      if (btnThirdRecordSelect) fireEvent.click(btnThirdRecordSelect);
      const btnExportStockMedications = screen.queryByTestId("btnExportStockMedications");
      if (btnExportStockMedications) fireEvent.click(btnExportStockMedications);
      const btnExportSelected = screen.queryByTestId("btnExportSelected");
      if (btnExportSelected) fireEvent.click(btnExportSelected);
    });
  });
  it("Import Stock Medications", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnImportSMSupply = screen.queryByTestId("btnImportSMSupply");
      if (btnImportSMSupply) userEvent.click(btnImportSMSupply);
    });
  });
});

export const setScheduleListPageNumber = () => {
  sessionStorage.setItem("stockMedicationsListPageNumber", "1");
};

export const setSMLibraryDetails = () => {
  const selectedLibraryObj = {
    id: 1,
    description: "Gaama, Alpha Stock Medication/Supply List",
    corporationId: "",
    globalFacilityId: "f2f1140b-6494-4003-a0f1-be4dc1055839",
    totalCount: 20
  }
  sessionStorage.setItem(
    "selectedSMSupplyLibraryDetails",
    JSON.stringify(selectedLibraryObj)
  );
}