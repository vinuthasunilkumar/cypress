import React from "react";
import {
  cleanup,
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import ScheduleList from "../features/frequency-administration/pages/ScheduleList";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import * as getAdministrationScheduleList from "../services/FrequencyAdministrationService";
import { setMockHostContextSetup } from "../helper/mockHostContextSetup";
import { Provider } from "react-redux";
import store from "./../redux/store";

afterEach(cleanup);

jest.mock("axios", () => {
  const mAxiosInstance = {
    get: jest.fn().mockImplementation(() => {
      const successResponse = {
        data: {
          administrationSchedule: [
            {
              administrationScheduleId: 1,
              frequencyCode: "BID 2 times per day",
              description: "2 times per day at 05:30 PM, 11:30 PM for 1 Days",
              orderType: "All",
              assignedTo: "Room 1",
            },
            {
              administrationScheduleId: 2,
              frequencyCode: "QAM in the morning",
              description:
                "in the morning Every Other Day at 05:30 PM for 1 Days",
              orderType: "Medication, Drug name: Lassar's",
              assignedTo: "Room 2",
            },
            {
              administrationScheduleId: 3,
              frequencyCode: "QD once daily",
              description:
                "once daily Give 1 days Hold 1 days at for 1 Days as needed",
              orderType: "Medication, Drug name: Vite Con Forte",
              assignedTo: "Room 3",
            },
          ],
          pagination: {
            size: 20,
            totalPages: 2,
            totalElements: 40,
            number: 1,
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
            id: 3,
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
            responseMessage: "This schedule does not exists",
            statusCode: 500,
          },
          status: 200,
        };
        return Promise.resolve(notDeleteResponse);
      }),
  };
  return {
    create: jest.fn(() => mAxiosInstance),
  };
});

beforeEach(() => {
  setMockHostContextSetup();
});

const RenderUIComponent = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ScheduleList />
      </MemoryRouter>
    </Provider>
  );
  setScheduleListPageNumber();
};

describe("Administration Schedule List Component ", () => {
  it("renders without crashing", () => {
    window.scrollTo = jest.fn();
  });
  it("Checking fields are available", async () => {
    RenderUIComponent();
    await waitFor(
      () => {
        let btnAddNewSchedule = screen.queryByTestId("btnAddNewSchedule");
        expect(btnAddNewSchedule).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it("Add Schedule click", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnAddSchedule = screen.queryByTestId("btnAddNewSchedule");
      expect(btnAddSchedule).toBeInTheDocument();
      if (btnAddSchedule) fireEvent.click(btnAddSchedule);
    });
  });

  it("Search Master Checkbox select All & Delete Schedule click", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const txtSearch = screen.getByTestId<HTMLInputElement>("txtSearch");
      let strSearchText = ["Tylenol", "a", "ab", "abc"];
      strSearchText.forEach((searchTxt) => {
        const keyUp = createEvent.keyUp(txtSearch, searchTxt);
        fireEvent(txtSearch, keyUp);
      });

      const btnChkMasterSelect = screen.queryByTestId("masterSelect");
      expect(btnChkMasterSelect).toBeInTheDocument();
      if (btnChkMasterSelect) fireEvent.click(btnChkMasterSelect);
      const btnSecondRecordSelect = screen.queryByTestId("2");
      if (btnSecondRecordSelect) fireEvent.click(btnSecondRecordSelect);
      const btnThirdRecordSelect = screen.queryByTestId("3");
      if (btnThirdRecordSelect) {
        fireEvent.click(btnThirdRecordSelect);
      }
      const btnDeleteSchedule = screen.queryByTestId("btnDeleteSchedule");
      expect(btnDeleteSchedule).toBeInTheDocument();
      if (btnDeleteSchedule) fireEvent.click(btnDeleteSchedule);
      const cancelDeleteButton = screen.getByTestId("cancelDeleteButton");
      expect(cancelDeleteButton).toBeInTheDocument();
      fireEvent.click(cancelDeleteButton);

      const confirmDeleteButton = screen.getByTestId("confirmDeleteButton");
      expect(confirmDeleteButton).toBeInTheDocument();
      fireEvent.click(confirmDeleteButton);
    });
  });

  it("Single Select & Delete Schedule click", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnFirstRecordSelect = screen.queryByTestId("1");
      expect(btnFirstRecordSelect).toBeInTheDocument();
      if (btnFirstRecordSelect) fireEvent.click(btnFirstRecordSelect);
      const btnSecondRecordSelect = screen.queryByTestId("2");
      expect(btnSecondRecordSelect).toBeInTheDocument();
      if (btnSecondRecordSelect) fireEvent.click(btnSecondRecordSelect);

      if (btnSecondRecordSelect) fireEvent.click(btnSecondRecordSelect);
      const btnThirdRecordSelect = screen.queryByTestId("3");
      expect(btnThirdRecordSelect).toBeInTheDocument();
      if (btnThirdRecordSelect) {
        fireEvent.click(btnThirdRecordSelect);
        fireEvent.click(btnThirdRecordSelect);
      }
      const btnSingleDeleteSchedule = screen.queryByTestId("btnDeleteSchedule");
      expect(btnSingleDeleteSchedule).toBeInTheDocument();
      if (btnSingleDeleteSchedule) fireEvent.click(btnSingleDeleteSchedule);
      const cancelDeleteButton = screen.getByTestId("cancelDeleteButton");
      expect(cancelDeleteButton).toBeInTheDocument();
      fireEvent.click(cancelDeleteButton);
      if (btnSingleDeleteSchedule) fireEvent.click(btnSingleDeleteSchedule);
      const confirmDeleteButton = screen.getByTestId("confirmDeleteButton");
      expect(confirmDeleteButton).toBeInTheDocument();
      fireEvent.click(confirmDeleteButton);
    });
  });

  it("Search the fields", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const txtSearch = screen.getByTestId<HTMLInputElement>("txtSearch");
      fireEvent.change(txtSearch, { target: { value: "Tylenol" } });
      expect(txtSearch.value).toBe("Tylenol");
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

  it("Signle Click on sort for Frequency Column", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnAddNewSchedule = screen.queryByTestId("btnAddNewSchedule");
      expect(btnAddNewSchedule).toBeInTheDocument();
      const sortButton = screen.getAllByTestId("sort-administration-schedules");
      fireEvent.click(sortButton[0]);
      fireEvent.keyPress(sortButton[0], { key: "Enter", keyCode: 13 });
    });
  });

  it("Toggle for sort Frequency Column", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnAddNewSchedule = screen.queryByTestId("btnAddNewSchedule");
      expect(btnAddNewSchedule).toBeInTheDocument();
      const sortButton = screen.getAllByTestId("sort-administration-schedules");
      fireEvent.click(sortButton[0]);
      fireEvent.click(sortButton[0]);
    });
  });

  it("Signle Click on sort administration schedule name", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnAddNewSchedule = screen.queryByTestId("btnAddNewSchedule");
      expect(btnAddNewSchedule).toBeInTheDocument();
      const sortButton = screen.getAllByTestId("sort-administration-schedules");
      fireEvent.click(sortButton[1]);
      fireEvent.keyPress(sortButton[1], { key: "Enter", keyCode: 13 });
    });
  });

  it("Toggle for sort administration schedule names", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnAddNewSchedule = screen.queryByTestId("btnAddNewSchedule");
      expect(btnAddNewSchedule).toBeInTheDocument();
      const sortButton = screen.getAllByTestId("sort-administration-schedules");
      fireEvent.click(sortButton[1]);
      fireEvent.click(sortButton[1]);
    });
  });

  it("Signle Click on sort Order Type", async () => {
    RenderUIComponent();
    await waitFor(
      async () => {
        const btnAddNewSchedule = screen.queryByTestId("btnAddNewSchedule");
        expect(btnAddNewSchedule).toBeInTheDocument();
        const sortButton = screen.getAllByTestId(
          "sort-administration-schedules"
        );
        fireEvent.click(sortButton[2]);
        fireEvent.keyPress(sortButton[2], { key: "Enter", keyCode: 13 });
      },
      { timeout: 1000 }
    );
  });

  it("Toggle for sort Order Type", async () => {
    RenderUIComponent();
    await waitFor(
      async () => {
        const btnAddNewSchedule = screen.queryByTestId("btnAddNewSchedule");
        expect(btnAddNewSchedule).toBeInTheDocument();
        const sortButton = screen.getAllByTestId(
          "sort-administration-schedules"
        );
        fireEvent.click(sortButton[2]);
        fireEvent.click(sortButton[2]);
      },
      { timeout: 1000 }
    );
  });

  it("Signle Click on sort assigned to ", async () => {
    RenderUIComponent();
    await waitFor(
      async () => {
        const btnAddNewSchedule = screen.queryByTestId("btnAddNewSchedule");
        expect(btnAddNewSchedule).toBeInTheDocument();
        const sortButton = screen.getAllByTestId(
          "sort-administration-schedules"
        );
        fireEvent.click(sortButton[3]);
        fireEvent.keyPress(sortButton[3], { key: "Enter", keyCode: 13 });
      },
      { timeout: 1000 }
    );
  });

  it("Toggle for sort assigned to ", async () => {
    RenderUIComponent();
    await waitFor(
      async () => {
        const btnAddNewSchedule = screen.queryByTestId("btnAddNewSchedule");
        expect(btnAddNewSchedule).toBeInTheDocument();
        const sortButton = screen.getAllByTestId(
          "sort-administration-schedules"
        );
        fireEvent.click(sortButton[3]);
        fireEvent.click(sortButton[3]);
      },
      { timeout: 1000 }
    );
  });

  it("Click on administration schedule name & navigate to Summary Page", async () => {
    RenderUIComponent();
    await waitFor(() => {
      expect(screen.getByTestId("nextPage")).toBeInTheDocument();
      const administrationScheduleName = screen.getAllByTestId(
        "administrationScheduleName"
      );
      fireEvent.click(administrationScheduleName[0]);
    });
  });

  it("Click on administration schedule name & navigate to Summary Page ", async () => {
    RenderUIComponent();

    await waitFor(() => {
      expect(screen.getByTestId("nextPage")).toBeInTheDocument();
      const administrationScheduleName = screen.getAllByTestId(
        "administrationScheduleName"
      );
      fireEvent.click(administrationScheduleName[2]);
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

  it("No Pagination & empty administration schedules list", async () => {
    jest
      .spyOn(getAdministrationScheduleList, "getAdministrationScheduleList")
      .mockImplementation(async () => {
        return {
          administrationSchedule: [],
          pagination: {
            size: 10,
            totalPages: 1,
            totalElements: null,
            number: 1,
          },
        };
      });
  });

  it("Empty administration schedules list & null pagination", async () => {
    jest
      .spyOn(getAdministrationScheduleList, "getAdministrationScheduleList")
      .mockImplementation(async () => {
        return {
          administrationSchedule: [],
          pagination: {
            size: 10,
            totalPages: null,
            totalElements: null,
            number: 1,
          },
        };
      });
  });

  it("empty administration schedules list", async () => {
    jest
      .spyOn(getAdministrationScheduleList, "getAdministrationScheduleList")
      .mockImplementation(async () => {
        return {
          administrationSchedule: undefined,
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
export const setScheduleListPageNumber = () => {
  sessionStorage.setItem("scheduleListPageNumber", "1");
};
