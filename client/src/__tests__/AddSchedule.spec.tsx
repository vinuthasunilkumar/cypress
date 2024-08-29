import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  createEvent,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import AddSchedule from "../features/frequency-administration/pages/AddSchedule";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import store from "./../redux/store";
import { setMockHostContextSetup } from "../helper/mockHostContextSetup";

afterEach(cleanup);

jest.mock("axios", () => {
  const mAxiosInstance = {
    get: jest.fn().mockImplementation(() => {
      const result = {
        data: [
          {
            id: "00000001-0001-0001-0000-000000000000",
            description: "Unit 1",
            rooms: [
              {
                id: "00000001-0001-0001-0001-000000000000",
                unitId: "00000000-0000-0000-0000-000000000000",
                description: "Room 1",
              },
            ],
          },
          {
            id: "00000001-0001-0002-0000-000000000000",
            description: "Unit 2",
            rooms: [
              {
                id: "00000001-0001-0002-0001-000000000000",
                unitId: "00000000-0000-0000-0000-000000000000",
                description: "Room 1",
              },
            ],
          },
        ],
        status: 200,
      };
      return Promise.resolve(result);
    }),
    delete: jest
      .fn()
      .mockImplementationOnce(() => {
        const deleteResponse = {
          data: {
            id: 5,
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

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    administrationScheduleId: null,
  }),
}));

beforeAll(() => {
  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({
      administrationScheduleId: 5,
    }),
  }));
});

afterAll(() => {
  jest.unmock("react-router-dom");
});

const RenderUIComponent = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <AddSchedule />
      </MemoryRouter>
    </Provider>
  );
};

const RenderUIComponentResult = () => {
  let result = render(
    <Provider store={store}>
      <MemoryRouter>
        <AddSchedule />
      </MemoryRouter>
    </Provider>
  );
  return result;
};

describe("Add Schedule", () => {
  it("Checking fields are available", async () => {
    RenderUIComponent();

    await waitFor(() => screen.queryByTestId("btnSave"));
    expect(screen.queryByTestId("btnSave")).toBeInTheDocument();
  });

  it("PRN Checkbox Change", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const chkPrnButton = screen.getByTestId<HTMLInputElement>("chkPRN");
      fireEvent.click(chkPrnButton);
      fireEvent.click(chkPrnButton);
      //Initially the Status for Set as Default is false
      const checkbox = screen.getByTestId<HTMLInputElement>("status");
      //So first toggled it to True from False
      fireEvent.click(checkbox);
      //and again I toggled it to False from True
      fireEvent.click(checkbox);
    });
  });

  it("Specific Time and Time Range Selection", async () => {
    let result = RenderUIComponentResult();

    let inputElement = result.getByTestId("btnSpecificTime");
    fireEvent.click(inputElement, {
      target: { status: true, clikedButtonId: "btnSpecificTime" },
    });
    fireEvent.click(inputElement, {
      target: { status: false, clikedButtonId: "btnSpecificTime" },
    });
    fireEvent.click(inputElement, {
      target: { status: false, clikedButtonId: "" },
    });
    inputElement = result.getByTestId("btnTimeRange");
    fireEvent.click(inputElement, {
      status: true,
      clikedButtonId: "btnTimeRange",
    });
    fireEvent.click(inputElement, {
      status: false,
      clikedButtonId: "btnTimeRange",
    });
    fireEvent.click(inputElement, { status: false, clikedButtonId: "" });
    inputElement = result.getByTestId("btnReset");
    fireEvent.click(inputElement);
    inputElement = result.getByTestId("btnSave");
    fireEvent.click(inputElement, {
      duration: 1,
      durationType: "Weeks",
      isDefault: false,
      isPrn: true,
      scheduleType: "Daily",
      orderType: 0,
      scheduleLocation: null,
      timeSchedules: [],
      frequencyCode: "QD",
      summary: "once daily",
      frequencyCodeDescription: "once daily",
      weeklySchedule: {
        selectedDays: "",
      },
    });
    userEvent.click(inputElement);
  });

  it("Add Schedule Mode - Save Click & Navigate to error field ", async () => {
    let result = RenderUIComponentResult();

    const btnSave = screen.getByTestId("btnSave");
    expect(btnSave).toBeInTheDocument();

    // let inputElement = result.container.getElementsByClassName(
    //   "ddlFrequency input-field-select__input"
    // )[0];
    // fireEvent.change(inputElement, { target: { value: "once daily" } });

    fireEvent.click(btnSave);
    await waitFor(
      () =>
        expect(screen.getByTestId("alert-error-close-btn")).toBeInTheDocument(),
      {
        timeout: 1000,
      }
    );
    let strBtnNames = ["btnReset", "cancelButton", "btnReset", "confirmButton"];
    strBtnNames.forEach((name) => {
      const btnName = screen.getByTestId(name);
      expect(btnName).toBeInTheDocument();
      fireEvent.click(btnName);
    });
  });

  it("open & close Assigned To Popup", async () => {
    RenderUIComponent();

    let strBtnNames = ["confirmButton", "cancelButton", "close-import-list"];
    strBtnNames.forEach((name) => {
      const btnEditAssignedTo = screen.getByTestId("btnEditAssignedTo");
      fireEvent.click(btnEditAssignedTo);
      const btnName = screen.getByTestId(name);
      fireEvent.click(btnName);
    });
  });

  it("Choose Repeart Type as Cyclical and without adding data click save", async () => {
    RenderUIComponent();

    let strBtnNames = ["btnCyclical", "btnSave"];
    strBtnNames.forEach((name) => {
      const btnName = screen.getByTestId(name);
      fireEvent.click(btnName);
    });
  });

  it("Choose Repeart Type as Cyclical and add data click save", async () => {
    let result = RenderUIComponentResult();
    let strBtnNames = ["btnCyclical"];
    strBtnNames.forEach((name) => {
      const btnName = screen.getByTestId(name);
      fireEvent.click(btnName);
    });
    const selectCycleInput = result.container.getElementsByClassName(
      "input-field-select Select Cycle__input"
    )[0];
    fireEvent.change(selectCycleInput, {
      target: { value: "Custom Days" },
    });
    await waitFor(
      () => {
        expect(screen.getByText("Custom Days")).toBeInTheDocument();
        const customDaysMenu =
          screen.getByText<HTMLDListElement>("Custom Days");
        fireEvent.click(customDaysMenu);
      },
      { timeout: 1000 }
    );
    const btnSave = screen.getByTestId("btnSave");
    fireEvent.click(btnSave);
  });

  it("Choose Repeart Type as Weekly & Choose All Days", async () => {
    RenderUIComponent();

    let btnNames = ["btnWeekly"];
    btnNames.forEach((name) => {
      const btnName = screen.getByTestId(name);
      fireEvent.click(btnName);
    });
    const btnMon = screen.getByTestId("Mon");
    fireEvent.click(btnMon);
    fireEvent.click(btnMon);
  });

  test("Toggle Every Months & Select Months in Monthly Schedule", async () => {
    RenderUIComponent();

    await waitFor(
      () => {
        const btnMonthly = screen.getByTestId("btnMonthly");
        expect(btnMonthly).toBeInTheDocument();
        fireEvent.click(btnMonthly);
        expect(btnMonthly).toHaveClass("active");
        expect(btnMonthly.className.includes("active")).toBe(true);
        let strBtnNames = [
          "everyMonthsTab",
          "everyMonthsTab",
          "btnSave",
          "1",
          "selectMonthsTab",
          "btnSave",
          "everyMonthsTab",
          "btnSave",
        ];
        strBtnNames.forEach((name) => {
          const btnName = screen.getByTestId(name);
          fireEvent.click(btnName);
        });
      },
      { timeout: 1000 }
    );
  });

  test("Every Months & toggle Days of the Months & Days of the weeks", async () => {
    RenderUIComponent();

    await waitFor(
      () => {
        const btnMonthly = screen.getByTestId("btnMonthly");
        expect(btnMonthly).toBeInTheDocument();
        fireEvent.click(btnMonthly);
        expect(btnMonthly).toHaveClass("active");
        expect(btnMonthly.className.includes("active")).toBe(true);
        let strBtnNames = [
          "everyMonthsTab",
          "btnChooseDaysOfTheMonths",
          "btnSave",
          "btnChooseDaysOfTheWeeks",
        ];
        strBtnNames.forEach((name) => {
          const btnName = screen.getByTestId(name);
          fireEvent.click(btnName);
        });
      },
      { timeout: 1000 }
    );
  });

  test("Validate Select Months tab", async () => {
    RenderUIComponent();

    await waitFor(
      () => {
        const btnMonthly = screen.getByTestId("btnMonthly");
        expect(btnMonthly).toBeInTheDocument();
        fireEvent.click(btnMonthly);
        expect(btnMonthly).toHaveClass("active");
        expect(btnMonthly.className.includes("active")).toBe(true);
        let strBtnNames = [
          "selectMonthsTab",
          "btnChooseDaysOfTheMonths",
          "btnSave",
        ];
        strBtnNames.forEach((name) => {
          const btnName = screen.getByTestId(name);
          fireEvent.click(btnName);
        });
      },
      { timeout: 1000 }
    );
  });

  it("Change event for Every month ", async () => {
    let result = RenderUIComponentResult();

    await waitFor(
      () => {
        const btnMonthly = screen.getByTestId("btnMonthly");
        expect(btnMonthly).toBeInTheDocument();
        fireEvent.click(btnMonthly);
        expect(btnMonthly).toHaveClass("active");
        expect(btnMonthly.className.includes("active")).toBe(true);
        const everyMonthsTab = screen.getByTestId("everyMonthsTab");
        expect(everyMonthsTab).toBeInTheDocument();
      },
      {
        timeout: 500,
      }
    );
    await waitFor(
      () => {
        const inputElement = result.container.getElementsByClassName(
          "input-field-select Every__input"
        )[0];
        userEvent.click(inputElement);
      },
      { timeout: 1000 }
    );
    await waitFor(
      () => {
        const inputElement3 = result.container.querySelector(
          ".input-field-select.Every__option:nth-child(3)"
        );
        if (inputElement3) userEvent.click(inputElement3);
      },
      {
        timeout: 1000,
      }
    );
  });

  // it("Delete Schedule Administration by ScheduleAdministrationId - Delete & Not Delete", async () => {
  //   RenderUIComponent();
  //   let strBtnNames = [
  //     "btnDelete",
  //     "cancelDeleteButton",
  //     "btnDelete",
  //     "confirmDeleteButton",
  //   ];
  //   strBtnNames.forEach((name) => {
  //     const btnName = screen.getByTestId(name);
  //     expect(btnName).toBeInTheDocument();
  //     fireEvent.click(btnName);
  //   });
  // });

  it("ddlFrequency Dropdown change and Combinations of Time possible Blur Event", async () => {
    let result = RenderUIComponentResult();

    let inputElement = result.container.getElementsByClassName(
      "ddlFrequency input-field-select__input"
    )[0];
    fireEvent.change(inputElement, { target: { value: "Every_minutes" } });
    expect(screen.getByText("Every_minutes")).toBeInTheDocument();
    
    fireEvent.change(inputElement, { target: { value: "every hour" } });
    expect(screen.getByText("every hour")).toBeInTheDocument();
    const everyHourMenu = screen.getByText<HTMLDListElement>("every hour");
    fireEvent.click(everyHourMenu);
    const everyTimeControls = result.container.getElementsByClassName(
      "form-control time-picker-control"
    );
    const txtEveryTimeInput = Array.from(everyTimeControls);
    let strTimeArrays = [
      "11:00 AM",
      "11:0 AM",
      "11: AM",
      "1: AM",
      "1:00 AM",
      "1:0 AM",
      "1:00 M",
      "1::00 AM",
      "1a",
      "13",
      "24",
      "25",
      "00",
      "13am",
      "13pm",
      "12",
      "6",
      "6:pm",
      "6:60pm",
      "6:0pm",
      "2400 AM",
      "2400",
      " m",
      "1:1 am",
      "01:00",
      "0000PM",
      "2400PM",
      ":1",
      "",
      "1",
    ];
    strTimeArrays.forEach((timeVal) => {
      fireEvent.blur(txtEveryTimeInput[0], { target: { value: timeVal } });
    });

    const onChangeForEveryGroup = createEvent.change(txtEveryTimeInput[0], {
      target: {
        value: "11:00 AM",
      },
    });

    fireEvent(txtEveryTimeInput[0], onChangeForEveryGroup);

    fireEvent.change(inputElement, { target: { value: "once daily" } });
    // Assert that the options are rendered
    expect(screen.getByText("once daily")).toBeInTheDocument();
    let idMenu = screen.getByText<HTMLDListElement>("once daily");
    fireEvent.click(idMenu);
    let elements = result.container.getElementsByClassName(
      "form-control time-picker-control"
    );
    let txtTimeInput = Array.from(elements) as HTMLInputElement[];

    strTimeArrays.forEach((timeVal) => {
      fireEvent.blur(txtTimeInput[0], { target: { value: timeVal } });
    });

    const onChange = createEvent.change(txtTimeInput[0], {
      target: {
        value: "11:00 AM",
      },
    });

    fireEvent(txtTimeInput[0], onChange);

    const btnTimeRange = screen.getByTestId<HTMLInputElement>("btnTimeRange");
    fireEvent.click(btnTimeRange);
    const timeRangeElements = result.container.getElementsByClassName(
      "form-control time-picker-control"
    );
    const txtTimeRangeInput = Array.from(timeRangeElements);
    let strTimeValues = ["11:00 AM", "11:0 AM", "11", "space", "11:00 AM"];
    strTimeValues.forEach((timeValue) => {
      fireEvent.keyDown(txtTimeRangeInput[0], {
        target: { value: timeValue },
      });
      fireEvent.keyDown(txtTimeRangeInput[1], {
        target: { value: timeValue },
      });
    });
    const onChangeForStartTimeRange = createEvent.change(txtTimeRangeInput[0], {
      target: {
        value: "11:00 AM",
      },
    });
    fireEvent(txtTimeRangeInput[0], onChangeForStartTimeRange);
    let btnSave = screen.getByTestId("btnSave");
    fireEvent.click(btnSave);

    inputElement = result.container.getElementsByClassName(
      "ddlFrequency input-field-select__input"
    )[0];

    fireEvent.change(inputElement, { target: { value: "every 6 hours" } });
    // Assert that the options are rendered
    expect(screen.getByText("every 6 hours")).toBeInTheDocument();
    idMenu = screen.getByText<HTMLDListElement>("every 6 hours");
    fireEvent.click(idMenu);
    elements = result.container.getElementsByClassName(
      "form-control time-picker-control"
    );
    const txtTimeInputs = Array.from(elements) as HTMLInputElement[];
    fireEvent.click(txtTimeInputs[0], { target: { value: "1:00 PM" } });
    fireEvent.click(txtTimeInputs[1], { target: { value: "2:00 PM" } });
    fireEvent.click(txtTimeInputs[2], { target: { value: "3:00 PM" } });
    fireEvent.click(txtTimeInputs[3], { target: { value: "4:00 PM" } });
    btnSave = screen.getByTestId("btnSave");
    fireEvent.click(btnSave);

    inputElement = result.container.getElementsByClassName(
      "ddlFrequency input-field-select__input"
    )[0];

    fireEvent.change(inputElement, { target: { value: "every other day" } });
    // Assert that the options are rendered
    expect(screen.getByText("every other day")).toBeInTheDocument();
    idMenu = screen.getByText<HTMLDListElement>("every other day");
    fireEvent.click(idMenu);

    await waitFor(
      () => {
        expect(screen.getByText("Every Other Day")).toBeInTheDocument();
        const customDaysMenu =
          screen.getByText<HTMLDListElement>("Every Other Day");
        fireEvent.click(customDaysMenu);
      },
      { timeout: 1000 }
    );

    fireEvent.change(inputElement, { target: { value: "every 3 days" } });
    // Assert that the options are rendered
    expect(screen.getByText("every 3 days")).toBeInTheDocument();
    idMenu = screen.getByText<HTMLDListElement>("every 3 days");
    fireEvent.click(idMenu);

    await waitFor(
      () => {
        expect(screen.getByText("Custom Days")).toBeInTheDocument();
        const customDaysMenu =
          screen.getByText<HTMLDListElement>("Custom Days");
        fireEvent.click(customDaysMenu);
      },
      { timeout: 1000 }
    );
  });

  it("Presets Tab Change", async () => {
    let result = RenderUIComponentResult();
    await waitFor(
      async () => {
        const inputElement = result.container.getElementsByClassName(
          "ddlFrequency input-field-select__input"
        )[0];
        fireEvent.change(inputElement, { target: { value: "once daily" } });
        expect(screen.getByText("once daily")).toBeInTheDocument();
        const idMenu = screen.getByText<HTMLDListElement>("once daily");
        fireEvent.click(idMenu);
        const presetsTab = screen.getByTestId("presetsTab");
        fireEvent.click(presetsTab);
      },
      { timeout: 500 }
    );
  });

  it("open & close Assigned To Popup", async () => {
    let result = RenderUIComponentResult();
    const btnEditAssignedTo = result.getByTestId("btnEditAssignedTo");
    fireEvent.click(btnEditAssignedTo);
    const chkall = result.getByTestId("chkAll");
    fireEvent.click(chkall);
    const clearAll = result.getByTestId("clearAll");
    fireEvent.click(clearAll);
    let customDaysMenu = result.findByLabelText("Unit 1");
    fireEvent.click(await customDaysMenu);
    customDaysMenu = result.findByLabelText("Unit 2");
    fireEvent.dblClick(await customDaysMenu);
    let inputElement = result.getByTestId("txtSearchQueryHere");
    fireEvent.keyUp(inputElement, { target: { value: "Unit 1" } });
    customDaysMenu = result.findByLabelText("Unit 1");
    fireEvent.click(await customDaysMenu);
    fireEvent.click(inputElement, { target: { value: "Room 1" } });
    customDaysMenu = result.findByLabelText("Room 1");
    fireEvent.click(await customDaysMenu);
    fireEvent.click(chkall);
    fireEvent.change(inputElement, { target: { value: "No rooms" } });
    let strBtnNames = ["confirmButton"];
    strBtnNames.forEach(async (name) => {
      const btnName = result.getByTestId(name);
      fireEvent.click(btnName);
    });
    fireEvent.click(btnEditAssignedTo);
    fireEvent.click(chkall);
    inputElement = result.getByTestId("txtSearchQueryHere");
    fireEvent.keyUp(inputElement, { target: { value: "No rooms" } });
    strBtnNames.forEach(async (name) => {
      const btnName = result.getByTestId(name);
      fireEvent.click(btnName);
    });
  });
});
