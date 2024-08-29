import React from "react";
import { Provider } from "react-redux";
import Instructions from "./../features/order-writer/pages/Instructions";
import store from "./../redux/store";
import {
  render,
  fireEvent,
  screen,
  cleanup,
  waitFor,
  within,
  createEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import CommonInstructions from "../features/order-writer/pages/CommonInstructions";
import PerSlidingScaleSidebar from "../features/order-writer/pages/PerSlidingScaleSidebar";
import CustomizeScheduleing from "../features/order-writer/pages/CustomizeScheduling";
import { setMockHostContextSetup } from "../helper/mockHostContextSetup";
import PerSlidingScaleEditTemplate from "../features/order-writer/pages/PerSlidingScaleEditTemplate";
import { Medication } from "../types";
import * as loadOrderByUsers from "./../services/OrderWriterService";
import AdditionalDetail from "../features/order-writer/pages/AdditionalDetail";
import OrderWriterAdminDateTime from "../features/order-writer/pages/OrderWriterAdminDateTime";
import { initialAdminSchedule } from "../shared/constants/InitialAdminSchedule";

jest.mock("axios", () => {
  const mAxiosInstance = {
    get: jest.fn().mockImplementation(() => {
      const successResponse = {
        data: {
          id: 570220,
          description:
            "Tylenol Cold and Flu Severe 5 mg-10 mg-325 mg-200 mg/15 mL oral liquid",
          therapeuticClass: {
            description:
              "Non-Opioid Antituss-Decongestant-Analgesic,Non-Salicylate-Expectorant",
            id: 5812,
          },
          genericmedication: {
            description:
              "phenylephrine-DM-acetaminophen-guaif 5 mg-10 mg-325 mg-200mg/15 mL liq",
            id: 546136,
          },
          drugInfo: [
            {
              infoType: 3,
              lineType: 3,
              lineText: "angioedema",
            },
            {
              infoType: 3,
              lineType: 3,
              lineText: "cardiac arrhythmia",
            },
          ],
          Elements: {
            typicalRoute: "oral",
            doseForm: "liquid",
            strengthValue: "5-10-325-200",
            strengthUnits: "mg/15 mL",
            representativeNDC: "00450052508",
            gcnSequenceNumber: 61341,
            primaryDoseCode: "mL",
            secondaryDoseCode: "mg",
            simpleDoseRatio: 0.06666666666666667,
            complexDoseRatio: [5, 10, 325, 200],
            isGHB: null,
            representativeRxCui: "1369842",
            availability: "Available",
          },
          patientMonograph: "IMPORTANT",
          CommonSIGs: null,
        },
      };
      return Promise.resolve(successResponse);
    }),
  };
  return {
    create: jest.fn(() => mAxiosInstance),
  };
});

jest.mock("../setup/api", () => ({
  ...jest.requireActual("../setup/api"),
  get: jest.fn().mockResolvedValue({ data: "some data" }),
}));

jest.mock("../services/OrderWriterService", () => {
  return {
    loadOrderByUsers: jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          lastName: "Brown",
          firstName: "Mary",
          middleName: null,
          userId: 121,
          prefix: "Dr.",
          suffix: "MD",
          name: "Brown, Mary",
          group: "Resident's Providers",
        },
        {
          lastName: "Wilderman",
          firstName: "Elody",
          middleName: "P",
          userId: 11370,
          prefix: "Dr.",
          suffix: "MD",
          name: "Wilderman, Elody",
          group: "Resident's Providers",
        },
        {
          lastName: "Benson",
          firstName: "Harvey",
          middleName: null,
          userId: 29,
          prefix: "Dr.",
          suffix: "MD",
          name: "Benson, Harvey",
          group: "Provider Groups",
        },
      ])
    ),
  };
});

const commonSigResponse = {
  id: 604587,
  description: "Tyblume 0.1 mg-20 mcg chewable tablet",
  sigInfos: [
    {
      structured: {
        dose: {
          primary: {
            value: 1,
            measureCode: "tab",
          },
          ratioBetweenPrimaryAndSecondary: null,
          secondary: null,
        },
        duration: null,
        maximumDailyDose: null,
        methodCode: "chew",
        routeCode: "oral",
        frequencyCode: "QD",
        timingCode: null,
        isPRN: false,
        isSTAT: false,
        perSlidingScale: null,
      },
      sig: "chew 1 tablet by oral route once daily",
      priority: 0,
    },
    {
      structured: {
        dose: {
          primary: {
            value: 1,
            measureCode: "tab",
          },
          ratioBetweenPrimaryAndSecondary: null,
          secondary: null,
        },
        duration: null,
        maximumDailyDose: null,
        methodCode: "give",
        routeCode: "oral",
        frequencyCode: "QD",
        timingCode: null,
        isPRN: false,
        isSTAT: false,
        perSlidingScale: null,
      },
      sig: "give 1 tablet by oral route once daily",
      priority: 1,
    },
  ] as any,
};

const RenderUIComponent = (prescriberId: number = 0) => {
  render(
    <Provider store={store}>
      <Instructions
        medicationId={1}
        isStandalone={true}
        prescriberId={prescriberId}
      />
    </Provider>
  );
};

const RenderUIComponentResult = () => {
  return render(
    <Provider store={store}>
      <Instructions medicationId={1} isStandalone={true} prescriberId={0} />
    </Provider>
  );
};

const RenderCommonInstructionComponent = () => {
  render(
    <Provider store={store}>
      <CommonInstructions
        medicationId={1}
        sigInfos={commonSigResponse.sigInfos}
      />
    </Provider>
  );
};

const RenderPerSliddingScaleComponent = () => {
  render(
    <Provider store={store}>
      <PerSlidingScaleSidebar
        medicationId={1}
        isMenuActive={true}
        isPerSclidingEditClick={false}
        setIsMenuActive={() => {
          return true;
        }}
        onOverLayClick={() => {
          return true;
        }}
        rowsData={[]}
        setRowsData={() => {
          return true;
        }}
      />
    </Provider>
  );
};

const RenderPerSliddingScaleComponentResult = (rowsData: IRowData[]) => {
  return render(
    <Provider store={store}>
      <PerSlidingScaleSidebar
        medicationId={1}
        isMenuActive={true}
        isPerSclidingEditClick={true}
        setIsMenuActive={() => {
          return true;
        }}
        onOverLayClick={() => {
          return true;
        }}
        rowsData={rowsData}
        setRowsData={() => {
          return true;
        }}
      />
    </Provider>
  );
};

const RenderPerSlidingScaleEditTemplateComponentResult = () => {
  let medication: Medication = {
    id: 0,
    description: "",
    instructions: {
      notes: "",
      formattedStartDate: "",
      formattedEndDate: "",
      isEndDateOpenEnded: true,
      selectedOrderSource: undefined,
      selectedMethod: undefined,
      selectedRoute: undefined,
      selectedMeasure: undefined,
      selectedLocation: undefined,
      selectedFrequency: undefined,
      selectedMDDMeasure: undefined,
      selectedIndication: undefined,
      selectedDurationType: undefined,
      selectedOrderBy: undefined,
      dosage: "",
      duration: "",
      maxDailyDose: "",
      instruction: "",
      icd10Instruction: "",
      orderSource: "",
      defaultStructuredSig: {
        methodCode: "",
        routeCode: "",
        frequencyCode: "",
        dose: {
          primary: {
            measureCode: "",
            value: "",
          },
          ratioBetweenPrimaryAndSecondary: "",
          secondary: {
            value: "",
            measureCode: "",
          },
        },
        duration: {
          type: {
            description: "",
            id: "",
          },
          value: "",
        },
        isPRN: undefined,
        locationCode: "",
        indicationCode: "",
        notes: "",
        perSlidingScale: {
          rowsData: [
            {
              from: "1",
              to: "10",
              give: "1",
              fromError: "",
              toError: "",
              giveError: "",
            },
            {
              from: "11",
              to: "100",
              give: "10",
              fromError: "",
              toError: "",
              giveError: "",
            },
          ],
          optionalData: [],
        },
      },
      instructionFieldRequirement: false,
      checkedPRN: undefined,
      commonOverrideReason: "",
      otherReasonText: "",
      selectedDiagnoses: undefined,
      selectedDiagnosesType: "",
      isSavedPerSlidingScale: false,
      perSlidingScale: {
        rowsData: [
          {
            from: "1",
            to: "12",
            give: "1",
            fromError: "",
            toError: "",
            giveError: "",
          },
        ],
        optionalData: [],
      },
      frequencySchedule: {
        facilityId: "",
        administrationScheduleId: 0,
        id: 0,
        summary: "",
        orderTypeSummary: "",
        assignedToSummary: "",
        timeSummary: "",
        frequencyRepeatSummary: "",
        frequencyCode: "",
        frequencyCodeDescription: "",
        durationType: "",
        scheduleType: "",
        orderType: 0,
        medicationType: null,
        fdbDrugId: 0,
        fdbMedGroupId: 0,
        duration: 0,
        isDefault: false,
        isFreqGroupedByEvery: false,
        isPrn: false,
        timeSchedules: [],
        cyclicalSchedules: null,
        weeklySchedule: null,
        monthlySchedule: null,
        scheduleLocation: null,
        existingAdministrationScheduleId: 0,
        defaultLocation: [],
      },
    },
    additionalDetails: {
      pharmacyName: "",
      dispenseAsWritten: false,
      doNotFill: false,
      ekit: false,
      ekitDoses: 0,
      pharmacyNotes: "",
    },
  };
  return render(
    <Provider store={store}>
      <PerSlidingScaleEditTemplate
        editClick={() => {
          return true;
        }}
        statusToggleButtonObj={{ isToggled: true }}
        medication={medication}
      />
    </Provider>
  );
};

const RenderOrderWriterAdminDateTime = () => {
  initialAdminSchedule.startDate = new Date();
  initialAdminSchedule.endDate = new Date();
  initialAdminSchedule.isEndDateOpenEnded = true;
  render(
    <Provider store={store}>
      <OrderWriterAdminDateTime
        medicationId={1}
        isAddSchedule={true}
        formValues={initialAdminSchedule}
        setFormValues={() => {
          return true;
        }}
      />
    </Provider>
  );
};

const RenderCustomizeScheduleingComponent = () => {
  render(
    <Provider store={store}>
      <CustomizeScheduleing
        medicationId={1}
        isCustomizeScheduleActive={true}
        onOverLayCustomizeScheduleClick={() => {
          return true;
        }}
      />
    </Provider>
  );
};

const RenderCustomizeScheduleingComponentResult = () => {
  return render(
    <Provider store={store}>
      <CustomizeScheduleing
        medicationId={1}
        isCustomizeScheduleActive={true}
        onOverLayCustomizeScheduleClick={() => {
          return true;
        }}
      />
    </Provider>
  );
};

beforeEach(() => {
  setMockHostContextSetup();
});

describe("<Instructions />", () => {
  const testDropdownValue = async (
    id: string,
    firstOption: string,
    expectedObject: any
  ) => {
    const dropdown = screen.queryByTestId(id) as HTMLSelectElement;
    expect(dropdown).toBeDefined();
    expect(dropdown).not.toBeNull();

    if (dropdown?.firstChild) {
      fireEvent.keyDown(dropdown.firstChild as Element, { key: "ArrowDown" });
      await waitFor(() => screen.getByText(firstOption));
      fireEvent.click(screen.getByText(firstOption));
      const selectedValueElement = within(dropdown).getByText(
        expectedObject.abbreviation
      );
      expect(selectedValueElement).toBeInTheDocument();
      expect(selectedValueElement.textContent).toEqual(
        expectedObject.abbreviation
      );
    }
  };

  afterEach(cleanup);

  it("should integrate with discharge order", async () => {
    RenderUIComponent(1);
  });

  it("should integrate ddlOrderBy group by dropdown", async () => {
    RenderUIComponent(121);
    await ddlOrderBydetails();
  });

  it("should integrate ddlOrderBy multi column dropdown", async () => {
    RenderUIComponent();
    jest
      .spyOn(loadOrderByUsers, "loadOrderByUsers")
      .mockImplementation(async () => {
        return {
          items: [
            {
              group: null,
              lastName: "Brown",
              firstName: "Mary",
              middleName: "K",
              userId: 121,
              prefix: "Dr.",
              suffix: "MD",
              name: "Brown, Mary",
            },
          ],
        };
      });
    await ddlOrderBydetails();
  });

  it("should integrate ddlOrderSource dropdown", async () => {
    RenderUIComponent();
    await testDropdownValue("ddlOrderSource", "Phone", {
      abbreviation: "Phone",
    });
  });

  it("should integrate ddlMethod dropdown", async () => {
    RenderUIComponent();

    await testDropdownValue("ddlMethod", "apply", {
      abbreviation: "apply",
    });
  });

  it("should integrate ddlRoute dropdown", async () => {
    RenderUIComponent();

    await testDropdownValue("ddlRoute", "base of the eyelashes", {
      abbreviation: "base of the eyelashes",
    });
  });

  it("should integrate ddlMeasure dropdown", async () => {
    RenderUIComponent();

    await testDropdownValue("ddlMeasure", "appl", {
      shortAbbreviation: "appl",
      abbreviation: "applicatorfuls",
    });
  });

  it("should integrate ddlFrequency dropdown", async () => {
    RenderUIComponent();

    await testDropdownValue("ddlFrequency", "STAT", {
      shortAbbreviation: "STAT",
      abbreviation: "immediately",
    });
  });

  it("should integrate ddlLocation dropdown", async () => {
    RenderUIComponent();

    await testDropdownValue("ddlLocation", "AD", {
      shortAbbreviation: "AD",
      abbreviation: "in right ear",
    });
  });

  it("should integrate ddlDurationType dropdown", async () => {
    RenderUIComponent();

    await testDropdownValue("ddlDurationType", "dose", {
      abbreviation: "dose",
    });
  });

  it("should integrate ddlIndication dropdown", async () => {
    RenderUIComponent();

    await testDropdownValue("ddlIndication", "for agitation", {
      abbreviation: "for agitation",
    });
  });

  it("should integrate ddlMddMeasure dropdown", async () => {
    RenderUIComponent();

    await testDropdownValue("ddlMddMeasure", "appl", {
      shortAbbreviation: "appl",
      abbreviation: "applicatorfuls",
    });
  });

  it("should integrate with common instructions", async () => {
    RenderUIComponent();
    RenderCommonInstructionComponent();
    await waitFor(() => screen.getByTestId("commonInstruction-item-0"), {
      timeout: 3000,
    });

    const btnName = screen.getByTestId("commonInstruction-item-0");
    expect(btnName).toBeInTheDocument();
    fireEvent.click(btnName);
  });

  it("should integrated start date and end date", async () => {
    RenderUIComponent();

    let startDatePickerElement = screen.getByPlaceholderText("Start Date");
    fireEvent.change(startDatePickerElement, { target: { value: new Date() } });
    await waitFor(
      () => {
        expect(startDatePickerElement).toBeEnabled();
      },
      { timeout: 1000 }
    );

    let endDatePickerElement = screen.getByPlaceholderText("End Date");
    await waitFor(
      () => {
        expect(endDatePickerElement).toBeDisabled();
      },
      { timeout: 1000 }
    );
  });

  it("should on change start date,open end and end date", async () => {
    RenderUIComponent();
    let startDatePickerElement = screen.getByPlaceholderText("Start Date");
    fireEvent.change(startDatePickerElement, { target: { value: new Date() } });
    fireEvent.change(startDatePickerElement, { target: { value: null } });
    fireEvent.change(startDatePickerElement, {
      target: { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) },
    });
    await waitFor(
      () => {
        expect(startDatePickerElement).toBeEnabled();
      },
      { timeout: 1000 }
    );

    let chkOpenEndedSelect = screen.getByTestId("openEnded-select");
    let endDatePickerElement = screen.getByPlaceholderText("End Date");
    fireEvent.change(chkOpenEndedSelect, { target: { value: true } });
    await waitFor(
      () => {
        expect(endDatePickerElement).toBeDisabled();
      },
      { timeout: 1000 }
    );
    fireEvent.change(endDatePickerElement, { target: { value: new Date() } });
    fireEvent.change(endDatePickerElement, { target: { value: null } });
    fireEvent.change(chkOpenEndedSelect, { target: { value: false } });
  });

  it("should integrate edit per sliding scale edit", async () => {
    let result = RenderPerSlidingScaleEditTemplateComponentResult();
    expect(result.getByTestId("btnEditPerSlidingScale")).toBeInTheDocument();
    let editButtonElement = result.getByTestId("btnEditPerSlidingScale");
    fireEvent.click(editButtonElement);
  });

  it("should integrate with per slidding scale", async () => {
    RenderUIComponent();
    RenderPerSliddingScaleComponent();
    await waitFor(() => screen.getByTestId("slidingScale"), {
      timeout: 3000,
    });
    let btnSlidingScale = screen.getByTestId("slidingScale");
    fireEvent.click(btnSlidingScale);
    fireEvent.click(btnSlidingScale);
  });

  it("should validate less than call per slidding scale", async () => {
    let result = RenderPerSliddingScaleComponentResult([]);
    let lessThanElement = result.getByTestId("chkLessThanCall");
    fireEvent.click(lessThanElement, {
      target: { status: true, clikedButtonId: "chkLessThanCall" },
    });
    lessThanElement = result.getByTestId("txtLessThanCall1");
    fireEvent.change(lessThanElement, {
      target: { value: "13" },
    });
    fireEvent.keyDown(lessThanElement);
    fireEvent.blur(lessThanElement);
    expect(lessThanElement).toBeInTheDocument();

    lessThanElement = result.getByTestId("ddLessThanCall");
    fireEvent.keyDown(lessThanElement);
    fireEvent.change(lessThanElement, { target: { value: "MD" } });
    fireEvent.blur(lessThanElement);
    expect(screen.getAllByText("MD")[0]).toBeInTheDocument();

    fireEvent.click(lessThanElement, {
      target: { status: false, clikedButtonId: "chkLessThanCall" },
    });
  });

  it("should validate greater than give per slidding scale", async () => {
    let result = RenderPerSliddingScaleComponentResult([]);
    let greaterThanElement = result.getByTestId("chkGreaterThanGive");
    fireEvent.click(greaterThanElement, {
      target: { status: true, clikedButtonId: "chkGreaterThanGive" },
    });

    greaterThanElement = result.getByTestId("txtGreaterThanGive1");
    fireEvent.change(greaterThanElement, {
      target: { value: "123" },
    });
    fireEvent.keyDown(greaterThanElement);
    fireEvent.blur(greaterThanElement);
    expect(greaterThanElement).toBeInTheDocument();

    greaterThanElement = result.getByTestId("txtGreaterThanGive2");
    fireEvent.change(greaterThanElement, {
      target: { value: "145" },
    });
    fireEvent.keyDown(greaterThanElement);
    fireEvent.blur(greaterThanElement);
    expect(greaterThanElement).toBeInTheDocument();

    fireEvent.click(greaterThanElement, {
      target: { status: false, clikedButtonId: "chkGreaterThanGive" },
    });
  });

  it("should validate greater than call per slidding scale", async () => {
    let result = RenderPerSliddingScaleComponentResult([]);
    let greaterThanElement = result.getByTestId("chkGreaterThanCall");
    fireEvent.click(greaterThanElement, {
      target: { status: true, clikedButtonId: "chkGreaterThanCall" },
    });

    greaterThanElement = result.getByTestId("txtGreaterThanCall1");
    fireEvent.change(greaterThanElement);
    fireEvent.keyDown(greaterThanElement);
    fireEvent.blur(greaterThanElement);
    expect(greaterThanElement).toBeInTheDocument();

    greaterThanElement = result.getByTestId("ddGreaterThanCall");
    fireEvent.keyDown(greaterThanElement);
    fireEvent.change(greaterThanElement, { target: { value: "MD" } });
    fireEvent.blur(greaterThanElement);
    expect(screen.getAllByText("MD")[0]).toBeInTheDocument();

    fireEvent.click(greaterThanElement, {
      target: { status: false, clikedButtonId: "chkGreaterThanCall" },
    });
  });

  it("should validate table row per slidding scale", async () => {
    let rowsData: IRowData[] = [
      {
        from: "1",
        to: "12",
        give: "1",
        fromError: "",
        toError: "",
        giveError: "",
      },
    ];
    let result = RenderPerSliddingScaleComponentResult(rowsData);
    let tableRowElement = result.getByTestId("from0");
    expect(tableRowElement).toBeInTheDocument();

    tableRowElement = result.getByTestId("to0");
    expect(tableRowElement).toBeInTheDocument();

    tableRowElement = result.getByTestId("give0");
    expect(tableRowElement).toBeInTheDocument();
  });

  it("should add table row per slidding scale", async () => {
    let rowsData: IRowData[] = [
      {
        from: "1",
        to: "12",
        give: "1",
        fromError: "",
        toError: "",
        giveError: "",
      },
    ];
    let result = RenderPerSliddingScaleComponentResult(rowsData);
    let tableRowElement = result.getByTestId("btnAdd");
    fireEvent.click(tableRowElement, {
      target: { status: true, clikedButtonId: "btnAdd" },
    });
  });

  it("should delete table row per slidding scale", async () => {
    let rowsData: IRowData[] = [
      {
        from: "1",
        to: "12",
        give: "1",
        fromError: "",
        toError: "",
        giveError: "",
      },
      {
        from: "13",
        to: "120",
        give: "2",
        fromError: "",
        toError: "",
        giveError: "",
      },
    ];
    let result = RenderPerSliddingScaleComponentResult(rowsData);
    let tableRowElements = result.queryAllByTestId("btnDelete");
    fireEvent.click(tableRowElements[1], {
      target: { status: true, clikedButtonId: "btnDelete" },
    });
  });

  it("should add per slidding scale", async () => {
    let rowsData: IRowData[] = [
      {
        from: "1",
        to: "12",
        give: "1",
        fromError: "",
        toError: "",
        giveError: "",
      },
      {
        from: "13",
        to: "120",
        give: "2",
        fromError: "",
        toError: "",
        giveError: "",
      },
    ];
    let result = RenderPerSliddingScaleComponentResult(rowsData);
    let tableRowElement = result.getByTestId("confirmButton");
    fireEvent.click(tableRowElement, {
      target: { status: true, clikedButtonId: "confirmButton" },
    });
  });

  it("should cancel per slidding scale", async () => {
    let rowsData: IRowData[] = [
      {
        from: "1",
        to: "",
        give: "",
        fromError: "",
        toError: "",
        giveError: "",
      },
    ];
    let result = RenderPerSliddingScaleComponentResult(rowsData);
    let tableRowElement = result.getByTestId("cancelButton");
    fireEvent.click(tableRowElement, {
      target: { status: true, clikedButtonId: "cancelButton" },
    });
    let btnCancel = result.getByTestId("cancelButton");
    fireEvent.click(btnCancel, {
      target: { status: true, clikedButtonId: "cancelButton" },
    });
    fireEvent.click(tableRowElement, {
      target: { status: true, clikedButtonId: "cancelButton" },
    });
    let btnConfirm = result.getByTestId("confirmButton");
    fireEvent.click(btnConfirm, {
      target: { status: true, clikedButtonId: "confirmButton" },
    });
  });

  it("should validate the rows field per slidding scale", async () => {
    let rowsData: IRowData[] = [
      {
        from: "",
        to: "",
        give: "",
        fromError: "Enter a whole number",
        toError: "Enter a whole number",
        giveError: "Enter a whole or decimal number",
      },
    ];
    let result = RenderPerSliddingScaleComponentResult(rowsData);
    let tableRowElement = result.getByTestId("confirmButton");
    fireEvent.click(tableRowElement, {
      target: { status: true, clikedButtonId: "confirmButton" },
    });
  });

  it("should validate the rows field with unexpected value in per slidding scale", async () => {
    let rowsData: IRowData[] = [
      {
        from: "800",
        to: "801",
        give: "201",
        fromError: "Enter a whole number less than 800",
        toError: "Enter a whole number no greater than 800",
        giveError: "Enter a whole or decimal number no greater than 200",
      },
    ];
    let result = RenderPerSliddingScaleComponentResult(rowsData);
    let tableRowElement = result.getByTestId("confirmButton");
    fireEvent.click(tableRowElement, {
      target: { status: true, clikedButtonId: "confirmButton" },
    });
  });

  test("cancel button click on blur event per slidding sacle", async () => {
    RenderUIComponent();
    RenderPerSliddingScaleComponent();
    fireEvent.blur(screen.getByTestId("cancelButton"));
    expect(screen.getByTestId("cancelButton")).toBeInTheDocument();
  });

  test("cancel button click on blur event customize scheduleing", async () => {
    RenderUIComponent();
    RenderOrderWriterAdminDateTime();
    RenderCustomizeScheduleingComponent();
    fireEvent.blur(screen.getByTestId("cancelButton"));
    expect(screen.getByTestId("cancelButton")).toBeInTheDocument();
  });

  test("start date click on blur event", async () => {
    RenderUIComponent();
    fireEvent.blur(screen.getByPlaceholderText("Start Date"));
    expect(screen.getByPlaceholderText("Start Date")).toBeInTheDocument();
  });

  test("end date click on blur event", async () => {
    RenderUIComponent();
    fireEvent.blur(screen.getByPlaceholderText("End Date"));
    expect(screen.getByPlaceholderText("End Date")).toBeInTheDocument();
  });

  test("table rows input on blur event", async () => {
    let rowsData: IRowData[] = [
      {
        from: "1",
        to: "12",
        give: "1",
        fromError: "",
        toError: "",
        giveError: "",
      },
    ];
    let result = RenderPerSliddingScaleComponentResult(rowsData);
    let tableRowElement = result.getByTestId("from0");
    fireEvent.change(tableRowElement, {
      target: { value: "12" },
    });
    fireEvent.keyDown(tableRowElement);
    fireEvent.blur(tableRowElement);
    expect(tableRowElement).toBeInTheDocument();
    tableRowElement = result.getByTestId("to0");
    fireEvent.change(tableRowElement, {
      target: { value: "120" },
    });
    fireEvent.keyDown(tableRowElement);
    fireEvent.blur(tableRowElement);
    expect(tableRowElement).toBeInTheDocument();
    tableRowElement = result.getByTestId("give0");
    fireEvent.change(tableRowElement, {
      target: { value: "12" },
    });
    fireEvent.keyDown(tableRowElement);
    fireEvent.blur(tableRowElement);
    expect(tableRowElement).toBeInTheDocument();
  });

  it("should integrate with per customize schedule", async () => {
    RenderUIComponent();
    RenderCustomizeScheduleingComponent();
    await waitFor(() => screen.getByTestId("btnCustomizeScheduling"), {
      timeout: 3000,
    });
    const btnName = screen.getByTestId("btnCustomizeScheduling");
    expect(btnName).toBeInTheDocument();
    fireEvent.click(btnName);
  });

  it("Checking fields are available", async () => {
    RenderUIComponent();
    await waitFor(() => screen.getByTestId("btnCustomizeScheduling"), {
      timeout: 3000,
    });
    const btnName = screen.getByTestId("btnCustomizeScheduling");
    expect(btnName).toBeInTheDocument();
    fireEvent.click(btnName);

    await waitFor(() => screen.queryByTestId("btnScheduleConfirm"));
    expect(screen.queryByTestId("btnScheduleConfirm")).toBeInTheDocument();
  });

  it("Specific Time and Time Range Selection", async () => {
    let result = RenderCustomizeScheduleingComponentResult();

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
    fireEvent.click(inputElement, {
      duration: 1,
      durationType: "Weeks",
      isDefault: false,
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
    let result = RenderCustomizeScheduleingComponentResult();

    const btnSave = screen.getByTestId("btnScheduleConfirm");
    expect(btnSave).toBeInTheDocument();

    let inputElement = result.container.getElementsByClassName(
      "ddlFrequency input-field-select__input"
    )[0];
    fireEvent.change(inputElement, { target: { value: "once daily" } });

    fireEvent.click(btnSave);
    await waitFor(
      () =>
        expect(screen.getByTestId("alert-error-close-btn")).toBeInTheDocument(),
      {
        timeout: 1000,
      }
    );
    let strBtnNames = ["cancelButton", "btnScheduleConfirm"];
    strBtnNames.forEach((name) => {
      const btnName = screen.getByTestId(name);
      expect(btnName).toBeInTheDocument();
      fireEvent.click(btnName);
    });
  });

  it("Choose Repeart Type as Cyclical and without adding data click save", async () => {
    RenderUIComponent();
    await waitFor(() => screen.getByTestId("btnCustomizeScheduling"), {
      timeout: 3000,
    });
    const btnName = screen.getByTestId("btnCustomizeScheduling");
    expect(btnName).toBeInTheDocument();
    fireEvent.click(btnName);

    let strBtnNames = ["btnCyclical", "btnScheduleConfirm"];
    strBtnNames.forEach((name) => {
      const btnName = screen.getByTestId(name);
      fireEvent.click(btnName);
    });
  });

  it("Choose Repeart Type as Cyclical and add data click save", async () => {
    let result = RenderCustomizeScheduleingComponentResult();
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
    const btnSave = screen.getByTestId("btnScheduleConfirm");
    fireEvent.click(btnSave);
  });

  it("Choose Repeart Type as Weekly & Choose All Days", async () => {
    RenderUIComponent();
    await waitFor(() => screen.getByTestId("btnCustomizeScheduling"), {
      timeout: 3000,
    });
    const btnName = screen.getByTestId("btnCustomizeScheduling");
    expect(btnName).toBeInTheDocument();
    fireEvent.click(btnName);

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
    await waitFor(() => screen.getByTestId("btnCustomizeScheduling"), {
      timeout: 3000,
    });
    const btnName = screen.getByTestId("btnCustomizeScheduling");
    expect(btnName).toBeInTheDocument();
    fireEvent.click(btnName);
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
          "btnScheduleConfirm",
          "1",
          "selectMonthsTab",
          "btnScheduleConfirm",
          "everyMonthsTab",
          "btnScheduleConfirm",
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
    await waitFor(() => screen.getByTestId("btnCustomizeScheduling"), {
      timeout: 3000,
    });
    const btnName = screen.getByTestId("btnCustomizeScheduling");
    expect(btnName).toBeInTheDocument();
    fireEvent.click(btnName);
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
          "btnScheduleConfirm",
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
    await waitFor(() => screen.getByTestId("btnCustomizeScheduling"), {
      timeout: 3000,
    });
    const btnName = screen.getByTestId("btnCustomizeScheduling");
    expect(btnName).toBeInTheDocument();
    fireEvent.click(btnName);
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
          "btnScheduleConfirm",
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
    let result = RenderCustomizeScheduleingComponentResult();

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

  it("ddlFrequency Dropdown change and Combinations of Time possible Blur Event", async () => {
    let result = RenderCustomizeScheduleingComponentResult();

    const inputElement = result.container.getElementsByClassName(
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
    const idMenu = screen.getByText<HTMLDListElement>("once daily");
    fireEvent.click(idMenu);
    const elements = result.container.getElementsByClassName(
      "form-control time-picker-control"
    );
    const txtTimeInput = Array.from(elements) as HTMLInputElement[];

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
    const btnSave = screen.getByTestId("btnScheduleConfirm");
    fireEvent.click(btnSave);
  });

  it("Presets Tab Change", async () => {
    let result = RenderCustomizeScheduleingComponentResult();
    await waitFor(async () => {
      const inputElement = result.container.getElementsByClassName(
        "ddlFrequency input-field-select__input"
      )[0];
      fireEvent.change(inputElement, { target: { value: "once daily" } });
      expect(screen.getByText("once daily")).toBeInTheDocument();
      const idMenu = screen.getByText<HTMLDListElement>("once daily");
      fireEvent.click(idMenu);
      const presetsTab = screen.getByTestId("presetsTab");
      fireEvent.click(presetsTab);
    });
  });

  it("notes on change event trigger", async () => {
    RenderUIComponent();
    let elementArea = screen.getByTestId("txtAreaCount");
    fireEvent.change(elementArea, {
      target: {
        value: "Test",
      },
    });
    expect(elementArea).toBeInTheDocument();
  });

  it("should on change in prn", async () => {
    let result = RenderUIComponentResult();
    let chkPRNElement = result.getByTestId("option2stacked");
    fireEvent.click(chkPRNElement, {
      target: { status: true, clikedButtonId: "option2stacked" },
    });
    expect(chkPRNElement).toBeInTheDocument();
  });

  it("should on change in duration", async () => {
    RenderUIComponent();
    let txtDurationElement = screen.getByTestId("durationInput");
    fireEvent.change(txtDurationElement, { target: { value: 10 } });
    fireEvent.change(txtDurationElement, { target: { value: 100 } });
    expect(txtDurationElement).toBeInTheDocument();
  });

  it("should on change in Instruction", async () => {
    let result = RenderUIComponentResult();
    let option3stackedElement = result.getByTestId("checkBtn");
    fireEvent.click(option3stackedElement, {
      target: { status: true, clikedButtonId: "checkBtn" },
    });
    expect(option3stackedElement).toBeInTheDocument();
  });

  it("should on change in dosage input", async () => {
    RenderUIComponent();
    let txtDurationElement = screen.getByTestId("dosageInput");
    fireEvent.change(txtDurationElement, { target: { value: 10 } });
    fireEvent.change(txtDurationElement, { target: { value: 100 } });
    expect(txtDurationElement).toBeInTheDocument();
  });

  it("should on change in maximum daily dose input", async () => {
    RenderUIComponent();
    let txtMaximumDailyDoseInputElement = screen.getByTestId(
      "maximumDailyDoseInput"
    );
    fireEvent.change(txtMaximumDailyDoseInputElement, {
      target: { value: 10 },
    });
    fireEvent.change(txtMaximumDailyDoseInputElement, {
      target: { value: 100 },
    });
    expect(txtMaximumDailyDoseInputElement).toBeInTheDocument();
  });

  it("should call overlay method with per slidding scale", async () => {
    RenderUIComponent();
    RenderPerSliddingScaleComponent();
    await waitFor(() => screen.getByTestId("slidingScale"), {
      timeout: 3000,
    });
    let btnSlidingScale = screen.getByTestId("slidingScale");
    fireEvent.click(btnSlidingScale);
    let backBtnElement = screen.getAllByTestId("btnOverLayclick");
    fireEvent.click(backBtnElement[0]);
  });

  it("should call overlay method with customize scheduling", async () => {
    RenderUIComponent();
    RenderCustomizeScheduleingComponent();
    await waitFor(() => screen.getByTestId("btnCustomizeScheduling"), {
      timeout: 3000,
    });
    let btnCustomizeScheduling = screen.getByTestId("btnCustomizeScheduling");
    fireEvent.click(btnCustomizeScheduling);
    let backBtnElement = screen.getAllByTestId("btnOverLayclick");
    fireEvent.click(backBtnElement[0]);
  });
});

it("should enable when checked", async () => {
  render(
    <Provider store={store}>
      <AdditionalDetail medicationId={0} />
    </Provider>
  );

  await waitFor(() => {
    let ekitChkBox = screen.getByTestId("ekitChkBox");
    fireEvent.change(ekitChkBox, { target: { value: false } });
    fireEvent.change(ekitChkBox, { target: { value: true } });
    fireEvent.click(ekitChkBox, { target: { value: false } });
  });
});

export const ddlOrderBydetails = async () => {
  await waitFor(
    async () => {
      const dropdown = screen.queryByTestId("ddlOrderBy") as HTMLSelectElement;
      expect(dropdown).toBeDefined();
      expect(dropdown).not.toBeNull();
      if (dropdown?.firstChild) {
        fireEvent.keyDown(dropdown.firstChild as Element, {
          key: "ArrowDown",
        });
        await waitFor(() => screen.getAllByText("Brown, Mary"));
        fireEvent.click(screen.getAllByText("Brown, Mary")[0]);
        const selectedValueElement =
          within(dropdown).getAllByText("Brown, Mary");
        expect(selectedValueElement[0]).toBeInTheDocument();
        expect(selectedValueElement[0].textContent).toEqual("Brown, Mary");
      }
    },
    { timeout: 3000 }
  );
};
