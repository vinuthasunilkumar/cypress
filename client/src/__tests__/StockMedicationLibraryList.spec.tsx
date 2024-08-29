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
import { Provider } from "react-redux";
import store from "./../redux/store";
import { setMockHostContextSetup } from "../helper/mockHostContextSetup";
import StockMedicationLibraryList from "../features/stock-medication-library/pages/StockMedicationLibraryList";
import * as getStockMedicationLibraryList from "../services/StockMedicationLibraryService";

afterEach(cleanup);

jest.mock("axios", () => {
  const mAxiosInstance = {
    get: jest.fn().mockImplementation(async () => {
      const successResponse = {
        stockMedicationLibraries: [
          {
            description:
              "Cambridge Care Center Matrixcare by Resmed Facilit Stock Medication/Supply List",
            id: 2,
            corporationId: 1,
          },
          {
            description: "Gaama, Alpha Stock Medication/Supply List",
            id: 1,
            corporationId: 1,
          },
          {
            description: "GM Facility A Stock Medication/Supply List",
            id: 9,
            corporationId: 1,
          },
          {
            description: "Hillside Care Center Stock Medication/Supply List",
            id: 3,
            corporationId: 1,
          },
          {
            description: "J&J Stock Medication/Supply List",
            id: 149,
            corporationId: 1,
          },
          {
            description:
              "location & Admin & snf +user-adm % Stock Medication/Supply List",
            id: 10,
            corporationId: 1,
          },
          {
            description: "Matrixcare #+ BB Stock Medication/Supply List",
            id: 31,
            corporationId: 1,
          },
          {
            description:
              "MatrixCare Assisted Living Stock Medication/Supply List",
            id: 8,
            corporationId: 1,
          },
          {
            description:
              "MatrixCare Center (Z-Demo) Stock Medication/Supply List",
            id: 178,
            corporationId: 1,
          },
          {
            description: "MatrixCare Center Stock Medication/Supply List",
            id: 12,
            corporationId: 1,
          },
          {
            description: "MatrixCare Manor - AL Stock Medication/Supply List",
            id: 51,
            corporationId: 1,
          },
          {
            description: "MatrixCare Manor - IL Stock Medication/Supply List",
            id: 28,
            corporationId: 1,
          },
          {
            description: "MatrixCare Manor - MC Stock Medication/Supply List",
            id: 7,
            corporationId: 1,
          },
          {
            description:
              "Matrixcare Orders Platform Stock Medication/Supply List",
            id: 11,
            corporationId: 1,
          },
          {
            description: "MCMQA14AL Stock Medication/Supply List",
            id: 5,
            corporationId: 1,
          },
          {
            description: "NewDocFacility Stock Medication/Supply List",
            id: 109,
            corporationId: 1,
          },
          {
            description: "OKTA Admin Medication/Supply List",
            id: 43,
            corporationId: 1,
          },
          {
            description: "OKTA Stock Medication/Supply List",
            id: 27,
            corporationId: 1,
          },
          {
            description: "RDL Test Facility Stock Medication/Supply List",
            id: 55,
            corporationId: 1,
          },
          {
            description: "Test Facility Stock Medication/Supply List",
            id: 129,
            corporationId: 1,
          },
          {
            description: "RDL Test Facility Stock Medication/Supply List test",
            id: 555,
            corporationId: 1,
          },
        ],
        pagination: {
          size: 10,
          totalElements: 21,
          totalPages: 3,
          number: 1,
          totalActiveElements: 10,
        },
      };
      return Promise.resolve(successResponse);
    }),
  };
  return {
    create: jest.fn(() => mAxiosInstance),
  };
});

beforeEach(() => {
  setMockHostContextSetup();
  setLibraryPageNumber();
});
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const RenderUIComponent = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <StockMedicationLibraryList currentTab=""/>
      </MemoryRouter>
    </Provider>
  );
};

describe("Stock Medication Library List Component", () => {
  it("renders without crashing", () => {
    window.scrollTo = jest.fn();
  });
  it("Checking fields are available", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const txtCustomSearch = screen.queryByTestId("txtCustomSearch");
      expect(txtCustomSearch).toBeInTheDocument();
    });
  });

  it("stock medications searching and sorting DESC", async () => {
    mockStockMedicationLibraryList();
    sessionStorage.setItem("librariesSelectedSort", "DESC");
    RenderUIComponent();
    setMockHostContextSetup("", "", false, true);
    await waitFor(
      () => {
        searchAndSort();
      },
      {
        timeout: 1000,
      }
    );
  });

  it("stock medications searching and sorting ASC", async () => {
    mockStockMedicationLibraryList();
    sessionStorage.setItem("librariesSelectedSort", "ASC");
    RenderUIComponent();
    setMockHostContextSetup("", "", false, true);
    await waitFor(
      () => {
        searchAndSort();
      },
      {
        timeout: 1000,
      }
    );
  });

  it("Click on stock medications library name & navigate to Summary Page", async () => {
    mockStockMedicationLibraryList();
    RenderUIComponent();
    await waitFor(
      () => expect(screen.getByTestId("nextPage")).toBeInTheDocument(),
      {
        timeout: 1000,
      }
    );
    await waitFor(() => {
      const libraryName = screen.getAllByTestId("libraryName");
      fireEvent.click(libraryName[0]);
    });
  });

  it("Click on stock medications library name & navigate to Summary Page Where Corporation Id is missing", async () => {
    mockStockMedicationLibraryList();
    RenderUIComponent();
    await waitFor(
      () => expect(screen.getByTestId("nextPage")).toBeInTheDocument(),
      {
        timeout: 1000,
      }
    );

    await waitFor(() => {
      const libraryName = screen.getAllByTestId("libraryName");
      fireEvent.click(libraryName[3]);
    });
  });

  it("Click on Next Page", async () => {
    mockStockMedicationLibraryList();
    RenderUIComponent();
    await waitFor(
      () => expect(screen.getByTestId("nextPage")).toBeInTheDocument(),
      {
        timeout: 1000,
      }
    );
    await waitFor(() => {
      const nextPage = screen.getByTestId("nextPage");
      fireEvent.click(nextPage);
    });
  });

  it("No Pagination & empty library list", async () => {
    RenderUIComponent();
    await waitFor(() => {
      jest
        .spyOn(getStockMedicationLibraryList, "getStockMedicationLibraryList")
        .mockImplementation(async () => {
          return {
            stockMedicationLibraries: [],
            pagination: {
              size: 10,
              totalPages: 1,
              totalElements: null,
              number: 1,
            },
          };
        });
    });
  });

  it("Empty library list & null pagination", async () => {
    RenderUIComponent();
    await waitFor(() => {
      jest
        .spyOn(getStockMedicationLibraryList, "getStockMedicationLibraryList")
        .mockImplementation(async () => {
          return {
            stockMedicationLibraries: [],
            pagination: {
              size: 10,
              totalPages: null,
              totalElements: null,
              number: 1,
            },
          };
        });
    });
  });

  it("empty library list", async () => {
    RenderUIComponent();
    await waitFor(() => {
      jest
        .spyOn(getStockMedicationLibraryList, "getStockMedicationLibraryList")
        .mockImplementation(async () => {
          return {
            stockMedicationLibraries: undefined,
            pagination: {
              size: 10,
              totalPages: 1,
              totalElements: null,
              number: 1,
            },
          };
        });
    });
  });
});

export const setLibraryPageNumber = () => {
  sessionStorage.setItem("libraryPageNumber", "1");
};

const mockStockMedicationLibraryList = () => {
  jest
    .spyOn(getStockMedicationLibraryList, "getStockMedicationLibraryList")
    .mockImplementation(async () => {
      return {
        stockMedicationLibraries: [
          {
            description:
              "Cambridge Care Center Matrixcare by Resmed Facilit Stock Medication/Supply List",
            id: 2,
            corporationId: 1,
          },
          {
            description: "Gaama, Alpha Stock Medication/Supply List",
            id: 1,
            corporationId: 1,
          },
          {
            description: "GM Facility A Stock Medication/Supply List",
            id: 9,
            corporationId: 1,
          },
          {
            description: "Hillside Care Center Stock Medication/Supply List",
            id: 3,
            corporationId: 1,
          },
          {
            description: "J&J Stock Medication/Supply List",
            id: 149,
            corporationId: 1,
          },
          {
            description:
              "location & Admin & snf +user-adm % Stock Medication/Supply List",
            id: 10,
            corporationId: 1,
          },
          {
            description: "Matrixcare #+ BB Stock Medication/Supply List",
            id: 31,
            corporationId: 1,
          },
          {
            description:
              "MatrixCare Assisted Living Stock Medication/Supply List",
            id: 8,
            corporationId: 1,
          },
          {
            description:
              "MatrixCare Center (Z-Demo) Stock Medication/Supply List",
            id: 178,
            corporationId: 1,
          },
          {
            description: "MatrixCare Center Stock Medication/Supply List",
            id: 12,
            corporationId: 1,
          },
          {
            description: "MatrixCare Manor - AL Stock Medication/Supply List",
            id: 51,
            corporationId: 1,
          },
          {
            description: "MatrixCare Manor - IL Stock Medication/Supply List",
            id: 28,
            corporationId: 1,
          },
          {
            description: "MatrixCare Manor - MC Stock Medication/Supply List",
            id: 7,
            corporationId: 1,
          },
          {
            description:
              "Matrixcare Orders Platform Stock Medication/Supply List",
            id: 11,
            corporationId: 1,
          },
          {
            description: "MCMQA14AL Stock Medication/Supply List",
            id: 5,
            corporationId: 1,
          },
          {
            description: "NewDocFacility Stock Medication/Supply List",
            id: 109,
            corporationId: 1,
          },
          {
            description: "OKTA Admin Medication/Supply List",
            id: 43,
            corporationId: 1,
          },
          {
            description: "OKTA Stock Medication/Supply List",
            id: 27,
            corporationId: 1,
          },
          {
            description: "RDL Test Facility Stock Medication/Supply List",
            id: 55,
            corporationId: 1,
          },
          {
            description: "Test Facility Stock Medication/Supply List",
            id: 129,
            corporationId: 1,
          },
          {
            description: "RDL Test Facility Stock Medication/Supply List test",
            id: 555,
            corporationId: 1,
          },
        ],
        pagination: {
          size: 20,
          totalElements: 21,
          totalPages: 2,
          number: 1,
          totalActiveElements: 21,
        },
      };
    });
};

const searchAndSort = () => {
  const sortButton = screen.queryByTestId("sort-library-name");
  expect(sortButton).toBeInTheDocument();
  fireEvent.click(sortButton!);
  const txtSearch = screen.getByTestId<HTMLInputElement>("txtCustomSearch");
  fireEvent.change(txtSearch, { target: { value: "H" } });
  expect(txtSearch.value).toBe("H");
  fireEvent.keyDown(txtSearch, { target: { value: "H" } });
  expect(txtSearch.value).toBe("H");
  fireEvent.keyPress(txtSearch, { key: "Enter", keyCode: 13 });
  fireEvent.click(sortButton!);
  fireEvent.keyDown(sortButton!);
  fireEvent.change(txtSearch, { target: { value: "Hillside" } });
  expect(txtSearch.value).toBe("Hillside");
  fireEvent.keyPress(txtSearch, { key: "Enter", keyCode: 13 });
  fireEvent.click(sortButton!);
};
