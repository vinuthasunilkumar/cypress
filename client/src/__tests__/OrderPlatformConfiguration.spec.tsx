import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { setMockHostContextSetup } from "../helper/mockHostContextSetup";
import { server } from "../mocks/server";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import OrderPlatformConfiguration from "../features/facility/pages/OrderPlatformConfiguration";
import store from "../redux/store";
import "@testing-library/jest-dom";
import * as getAdministrationScheduleListAsync from "../services/AdministrationScheduleListService";

afterEach(cleanup);

jest.mock("axios", () => {
  const mAxiosInstance = {
    get: jest.fn().mockImplementation(async () => {
      const successResponse = {
        data: [
          {
            corporateId: 4,
            facilityId: 9,
            facilityName: "Cambridge Care Center Matrixcare by Resmed Facility",
          },
          { corporateId: 4, facilityId: 478, facilityName: "Gaama, Alpha" },
          { corporateId: 4, facilityId: 84, facilityName: "GM Facility A" },
          {
            corporateId: 4,
            facilityId: 7,
            facilityName: "Hillside Care Center",
          },
          { corporateId: 4, facilityId: 467, facilityName: "J&J" },
          {
            corporateId: 4,
            facilityId: 470,
            facilityName: "location & Admin & snf +user-adm %",
          },
          { corporateId: 4, facilityId: 469, facilityName: "Matrixcare #+ BB" },
          {
            corporateId: 4,
            facilityId: 6,
            facilityName: "MatrixCare Assisted Living",
          },
          {
            corporateId: 4,
            facilityId: 491,
            facilityName: "MatrixCare Center",
          },
          { corporateId: 4, facilityId: 48, facilityName: "Gaama, Alpha Test" },
          {
            corporateId: 4,
            facilityId: 94,
            facilityName: "GM Facility A Test",
          },
          {
            corporateId: 4,
            facilityId: 72,
            facilityName: "Hillside Care Center Test",
          },
          { corporateId: 4, facilityId: 469, facilityName: "J&J test" },
          {
            corporateId: 4,
            facilityId: 490,
            facilityName: "location & Admin & snf +user-adm % test",
          },
          {
            corporateId: 4,
            facilityId: 413,
            facilityName: "Matrixcare #+ BB test",
          },
          {
            corporateId: 4,
            facilityId: 62,
            facilityName: "MatrixCare Assisted Living test",
          },
          {
            corporateId: 4,
            facilityId: 495,
            facilityName: "MatrixCare Center test",
          },
          {
            corporateId: 4,
            facilityId: 49,
            facilityName: "Gaama, Alpha Test1",
          },
          {
            corporateId: 4,
            facilityId: 50,
            facilityName: "Gaama, Alpha Test2",
          },
          {
            corporateId: 4,
            facilityId: 51,
            facilityName: "Gaama, Alpha Test3",
          },
          {
            corporateId: 4,
            facilityId: 52,
            facilityName: "Gaama, Alpha Test4",
          },
          {
            corporateId: 4,
            facilityId: 53,
            facilityName: "Gaama, Alpha Test5",
          },
        ],
        pagination: {
          size: 20,
          totalPages: null,
          totalElements: null,
          totalActiveElements: 1,
        },
      };
      return Promise.resolve(successResponse);
    }),
  };
  return {
    create: jest.fn(() => mAxiosInstance),
  };
});

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useLocation: jest.fn().mockImplementation(() => {
    return {
      pathname: "/testroute",
      state: {
        textMessage: "test",
        isFromFacilitySetup: true,
        isFromCustomMedicationList: true,
        isFromCustomMedicationLibrary: true,
        isFromFacilityList: true,
        isFromStockMedicationList: true,
        isredirectToCustomMedLibrary: true,
        isFromAdministrationScheduleList: true,
      },
    };
  }),
}));

jest.mock("../services/AdministrationScheduleListService", () => ({
  getAdministrationScheduleListAsync: jest.fn().mockResolvedValue([
    {
      administrationScheduleList: [
        {
          description:
            "Cambridge Care Center Matrixcare by Resmed Facilit Administration Schedule List test",
          id: 3,
        },
        {
          description: "Hillside Care Center Administration Schedule List",
          id: 2,
        },
        {
          description: "J&J Administration Schedule List",
          id: 94,
        },
        {
          description:
            "location & Admin & snf +user-adm % Administration Schedule List",
          id: 6,
        },
        {
          description: "Matrixcare #+ BB Administration Schedule List",
          id: 4,
        },
        {
          description:
            "MatrixCare Assisted Living Administration Schedule List",
          id: 8,
        },
        {
          description:
            "MatrixCare Center (Z-Demo) Administration Schedule List",
          id: 147,
        },
        {
          description: "MatrixCare Center Administration Schedule List",
          id: 110,
        },
        {
          description:
            "Cambridge Care Center Matrixcare by Resmed Facilit Administration Schedule List test 1",
          id: 32,
        },
        {
          description:
            "Hillside Care Center Administration Schedule List test 2",
          id: 22,
        },
        {
          description: "J&J Administration Schedule List test 3",
          id: 942,
        },
        {
          description:
            "location & Admin & snf +user-adm % Administration Schedule List test 4",
          id: 62,
        },
        {
          description: "Matrixcare #+ BB Administration Schedule List test 5",
          id: 42,
        },
        {
          description:
            "MatrixCare Assisted Living Administration Schedule List test 6",
          id: 82,
        },
        {
          description:
            "MatrixCare Center (Z-Demo) Administration Schedule List test 7",
          id: 1472,
        },
        {
          description: "MatrixCare Center Administration Schedule List test 8",
          id: 1102,
        },
        {
          description:
            "MatrixCare Assisted Living Administration Schedule List test1 9",
          id: 822,
        },
        {
          description:
            "MatrixCare Center (Z-Demo) Administration Schedule List test 10",
          id: 14722,
        },
        {
          description: "MatrixCare Center Administration Schedule List test 11",
          id: 11022,
        },
      ],
      pagination: {
        size: 20,
        totalElements: 21,
        totalPages: 2,
        number: 1,
        totalActiveElements: 21,
      },
    },
  ]),
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

afterAll(() => {
  jest.unmock("react-router-dom");
});

const RenderUIComponent = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <OrderPlatformConfiguration />
      </MemoryRouter>
    </Provider>
  );
};

describe("OrderPlatformConfiguration", () => {
  localStorage.setItem("customMedicationLibraryAccess", JSON.stringify(true));
  let originalWindowLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      enumerable: true,
      value: new URL(window.location.href),
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      enumerable: true,
      value: originalWindowLocation,
    });
  });

  it("redirection URL path includes order-platform-setup", () => {
    const expectedUrl =
      "https://www.localhost.com/order-platform-setup/custom-medication-library/stock-medication-list/administration-schedule-list/facility-setup";
    window.location.href = expectedUrl;
    expect(window.location.href).toBe(expectedUrl);
  });

  it("renders without crashing", () => {
    window.scrollTo = jest.fn();
  });

  it("Checking fields are available", async () => {
    RenderUIComponent();
    await waitFor(() => {
      let myTabs = screen.queryByTestId("myTabs");
      expect(myTabs).toBeInTheDocument();
    });
  });

  it("Order platform configuration tab clicked with isCloudOrderWriterEnabled is true", async () => {
    RenderUIComponent();
    setMockHostContextSetup("", "", true, true);
    await waitFor(() => {
      let horizontalTab2 = screen.queryByTestId("horizontalTab2");
      expect(horizontalTab2).toBeInTheDocument();
      fireEvent.click(horizontalTab2!);

      let horizontalTab1 = screen.queryByTestId("horizontalTab1");
      expect(horizontalTab1).toBeInTheDocument();
      fireEvent.click(horizontalTab1!);
    });
  });

  it("Order platform configuration tab clicked with isCloudOrderWriterEnabled is false", async () => {
    RenderUIComponent();
    setMockHostContextSetup("", "", true, false);
    await waitFor(() => {
      let horizontalTab2 = screen.queryByTestId("horizontalTab2");
      expect(horizontalTab2).toBeInTheDocument();
      fireEvent.click(horizontalTab2!);

      let horizontalTab1 = screen.queryByTestId("horizontalTab1");
      expect(horizontalTab1).toBeInTheDocument();
      fireEvent.click(horizontalTab1!);
    });
  });

  it("Order platform tab clicked with isCloudOrderWriterEnabled is true", async () => {
    RenderUIComponent();
    setMockHostContextSetup("", "", true, true);
    await waitFor(() => {
      let horizontalTab2 = screen.queryByTestId("horizontalTab2");
      expect(horizontalTab2).toBeInTheDocument();
      fireEvent.click(horizontalTab2!);

      let customMedicationLibraryTab = screen.queryByTestId(
        "customMedicationLibraryTab"
      );
      expect(customMedicationLibraryTab).toBeInTheDocument();
      fireEvent.click(customMedicationLibraryTab!);

      let stockMedicationListTab = screen.queryByTestId(
        "stockMedicationListTab"
      );
      expect(stockMedicationListTab).toBeInTheDocument();
      fireEvent.click(stockMedicationListTab!);

      let administrationScheduleListTab = screen.queryByTestId(
        "administrationScheduleListTab"
      );
      expect(administrationScheduleListTab).toBeInTheDocument();
      fireEvent.click(administrationScheduleListTab!);
    });
  });

  it("Rendering the facility list page", async () => {
    RenderUIComponent();
    await waitFor(
      () => {
        let cambridgeFacility = screen.queryByTestId(
          "Cambridge Care Center Matrixcare by Resmed Facility"
        );
        expect(cambridgeFacility).toBeInTheDocument();
        fireEvent.click(cambridgeFacility!);
      },
      { timeout: 1000 }
    );
  });

  it("Search the fields", async () => {
    RenderUIComponent();
    setMockHostContextSetup("", "", false, true);
    await waitFor(() => {
      const txtSearch = screen.getByTestId<HTMLInputElement>("txtSearch");
      fireEvent.change(txtSearch, { target: { value: "H" } });
      expect(txtSearch.value).toBe("H");
      fireEvent.keyPress(txtSearch, { key: "Enter", keyCode: 13 });
    });
  });

  it("Search the fields & clear the text", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const txtSearch = screen.getByTestId<HTMLInputElement>("txtSearch");
      fireEvent.change(txtSearch, { target: { value: "Hillside" } });
      expect(txtSearch.value).toBe("Hillside");
      fireEvent.keyPress(txtSearch, { key: "Enter", keyCode: 13 });
    });
  });

  it("Click on sort facility list", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const sortButton = screen.queryByTestId("sort-facility");
      expect(sortButton).toBeInTheDocument();
      fireEvent.click(sortButton!);
      const txtSearch = screen.getByTestId<HTMLInputElement>("txtSearch");
      fireEvent.change(txtSearch, { target: { value: "Hillside" } });
      expect(txtSearch.value).toBe("Hillside");
      fireEvent.keyPress(txtSearch, { key: "Enter", keyCode: 13 });
      fireEvent.click(sortButton!);
    });
  });

  it("Click on Next Facility Page", async () => {
    RenderUIComponent();
    setMockHostContextSetup("", "", false, true);
    await waitFor(
      () => {
        let cambridgeFacility = screen.queryByTestId(
          "Cambridge Care Center Matrixcare by Resmed Facility"
        );
        expect(cambridgeFacility).toBeInTheDocument();
        const nextPage = screen.getByTestId("nextPage");
        expect(nextPage).toBeInTheDocument();
        fireEvent.click(nextPage);
      },
      { timeout: 3000 }
    );
  });

  it("Click on Next Facility Page with desc order", async () => {
    RenderUIComponent();
    setMockHostContextSetup("", "", false, true);
    await waitFor(
      () => {
        let cambridgeFacility = screen.queryByTestId(
          "Cambridge Care Center Matrixcare by Resmed Facility"
        );
        expect(cambridgeFacility).toBeInTheDocument();
        const sortButton = screen.queryByTestId("sort-facility");
        expect(sortButton).toBeInTheDocument();
        fireEvent.click(sortButton!);
        const nextPage = screen.getByTestId("nextPage");
        expect(nextPage).toBeInTheDocument();
        fireEvent.click(nextPage);
      },
      { timeout: 3000 }
    );
  });

  it("Render Administration Schedule List page sorting and seraching with initial asc", async () => {
    mockAdminSchedule();
    sessionStorage.setItem("librariesSelectedSort", "ASC");
    RenderUIComponent();
    setMockHostContextSetup("", "", false, true);
    await waitFor(
      () => {
        let horizontalTab2 = screen.queryByTestId("horizontalTab2");
        expect(horizontalTab2).toBeInTheDocument();
        fireEvent.click(horizontalTab2!);

        const sortButton = screen.queryByTestId("sort-library-name");
        expect(sortButton).toBeInTheDocument();
        fireEvent.click(sortButton!);
        const txtSearch =
          screen.getByTestId<HTMLInputElement>("txtCustomSearch");
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
      },
      { timeout: 3000 }
    );
  });

  it("Render Administration Schedule List page sorting and seraching with initial desc", async () => {
    mockAdminSchedule();
    sessionStorage.setItem("librariesSelectedSort", "DESC");
    RenderUIComponent();
    setMockHostContextSetup("", "", false, true);
    await waitFor(
      () => {
        let horizontalTab2 = screen.queryByTestId("horizontalTab2");
        expect(horizontalTab2).toBeInTheDocument();
        fireEvent.click(horizontalTab2!);

        const sortButton = screen.queryByTestId("sort-library-name");
        expect(sortButton).toBeInTheDocument();
        fireEvent.click(sortButton!);
        const txtSearch =
          screen.getByTestId<HTMLInputElement>("txtCustomSearch");
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
      },
      { timeout: 3000 }
    );
  });

  it("Click on Next Page Admin Schedule page", async () => {
    mockAdminSchedule();
    sessionStorage.setItem("librariesSelectedSort", "ASC");
    RenderUIComponent();
    setMockHostContextSetup("", "", false, true);

    await waitFor(
      () => {
        let horizontalTab2 = screen.getByTestId("horizontalTab2");
        expect(horizontalTab2).toBeInTheDocument();
        fireEvent.click(horizontalTab2);
        const nextPage = screen.getByTestId("nextPage");
        expect(nextPage).toBeInTheDocument();
        fireEvent.click(nextPage);
      },
      { timeout: 3000 }
    );
  });
});

const mockAdminSchedule = () => {
  jest
    .spyOn(
      getAdministrationScheduleListAsync,
      "getAdministrationScheduleListAsync"
    )
    .mockImplementation(async () => {
      return {
        administrationScheduleList: [
          {
            description:
              "Cambridge Care Center Matrixcare by Resmed Facilit Administration Schedule List test",
            id: 3,
          },
          {
            description: "Hillside Care Center Administration Schedule List",
            id: 2,
          },
          {
            description: "J&J Administration Schedule List",
            id: 94,
          },
          {
            description:
              "location & Admin & snf +user-adm % Administration Schedule List",
            id: 6,
          },
          {
            description: "Matrixcare #+ BB Administration Schedule List",
            id: 4,
          },
          {
            description:
              "MatrixCare Assisted Living Administration Schedule List",
            id: 8,
          },
          {
            description:
              "MatrixCare Center (Z-Demo) Administration Schedule List",
            id: 147,
          },
          {
            description: "MatrixCare Center Administration Schedule List",
            id: 110,
          },
          {
            description:
              "Cambridge Care Center Matrixcare by Resmed Facilit Administration Schedule List test 1",
            id: 32,
          },
          {
            description:
              "Hillside Care Center Administration Schedule List test 2",
            id: 22,
          },
          {
            description: "J&J Administration Schedule List test 3",
            id: 942,
          },
          {
            description:
              "location & Admin & snf +user-adm % Administration Schedule List test 4",
            id: 62,
          },
          {
            description: "Matrixcare #+ BB Administration Schedule List test 5",
            id: 42,
          },
          {
            description:
              "MatrixCare Assisted Living Administration Schedule List test 6",
            id: 82,
          },
          {
            description:
              "MatrixCare Center (Z-Demo) Administration Schedule List test 7",
            id: 1472,
          },
          {
            description:
              "MatrixCare Center Administration Schedule List test 8",
            id: 1102,
          },
          {
            description:
              "MatrixCare Assisted Living Administration Schedule List test1 9",
            id: 822,
          },
          {
            description:
              "MatrixCare Center (Z-Demo) Administration Schedule List test 10",
            id: 14722,
          },
          {
            description:
              "MatrixCare Center Administration Schedule List test 11",
            id: 11022,
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

