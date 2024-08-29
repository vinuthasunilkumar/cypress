import React from "react";
import {
  cleanup,
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import CustomMedication from "../features/custom-medication/pages/CustomMedication";
import { AsyncPaginate } from "react-select-async-paginate";
import * as loadIngredients from "./../services/CustomMedicationService";
import * as loadMedicationGroups from "./../services/CustomMedicationService";
import { server } from "../mocks/server";
import { rest } from "msw";
import { Provider } from "react-redux";
import store from "./../redux/store";
import { setMockHostContextSetup } from "../helper/mockHostContextSetup";

afterEach(cleanup);

jest.mock("axios", () => {
  const mAxiosInstance = {
    get: jest.fn().mockImplementation(() => {
      const result = {
        data: {
          customMedications: [
            {
              description: "Paracetamol Tab",
              deaClassId: 3,
              isActive: true,
              createdDateTime: "2023-07-22T05:08:38.303879+00:00",
              createdBy: null,
              modifiedDateTime: "2023-07-22T05:08:38.303879+00:00",
              modifiedBy: null,
              fdbMedGroupLists: [
                {
                  id: 2,
                  description: "Antianxiety",
                },
                {
                  id: 3,
                  description: "Antibiotics",
                },
              ],
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
          medicationGroupSearchResultsDto: {
            items: [
              {
                description: "Analgesics",
                id: 1,
              },
            ],
          },
        },
        status: 200,
      };
      return Promise.resolve(result);
    }),
    put: jest.fn().mockImplementation(() => {
      const updateResponse = {
        data: {
          id: 432797,
          responseMessage: "Custom medication saved successfully",
        },
        status: 200,
      };
      return Promise.resolve(updateResponse);
    }),
    post: jest.fn().mockImplementation(() => {
      const saveResponse = {
        data: {
          id: 432797,
          responseMessage: "Not Updated",
          statusCode: 500,
        },
        status: 200,
      };
      return Promise.resolve(saveResponse);
    }),
    delete: jest
      .fn()
      .mockImplementationOnce(() => {
        const deleteResponse = {
          data: {
            id: 432797,
            responseMessage: "This custom medication deleted successfully.",
          },
          status: 200,
        };
        return Promise.resolve(deleteResponse);
      })
      .mockImplementationOnce(() => {
        const notDeleteResponse = {
          data: {
            id: 432797,
            responseMessage: "This custom medication does not exists",
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

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    customMedicationId: 12,
  }),
}));

beforeEach(() => {
  setMockHostContextSetup();
});

const RenderUIComponent = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CustomMedication />
      </MemoryRouter>
    </Provider>
  );
};

const RenderUIComponentResult = () => {
  let result = render(
    <Provider store={store}>
      <MemoryRouter>
        <CustomMedication />
      </MemoryRouter>
    </Provider>
  );
  return result;
};

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("AddNewCustomMedication", () => {
  it("renders without crashing", () => {
    window.scrollTo = jest.fn();
  });

  it("Checking fields are available", async () => {
    RenderUIComponent();
    await waitFor(() => screen.queryByTestId("txtCustomMedicationName"));
    expect(screen.queryByTestId("txtCustomMedicationName")).toBeInTheDocument();
  });

  it("btnSave Click submitHandler to save Data 1", async () => {
    RenderUIComponent();

    fireEvent.change(screen.getByTestId("txtCustomMedicationName"), {
      target: { value: "Tylenol" },
    });
    const yesRadioButton = screen.getByTestId<HTMLInputElement>(
      "controlledSubstance"
    );
    fireEvent.click(yesRadioButton);
    await waitFor(
      () => expect(screen.getByLabelText("DEA Schedule")).toBeInTheDocument(),
      {
        timeout: 500,
      }
    );
    fireEvent.change(screen.getByLabelText("DEA Schedule"), {
      target: { value: "3" },
    });
    const saveResponse = {
      data: {
        responseMessage:
          "Custom medication with same name already exist. The medication name must be unique.",
      },
      status: 500,
    };
    server.use(
      rest.post(`/api/custom-medications`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(saveResponse));
      })
    );
    const btnSave = screen.getByTestId("btnSave");
    expect(btnSave).toBeInTheDocument();
    userEvent.click(btnSave);
  });

  it("btnSave Click submitHandler to save Data 2", async () => {
    RenderUIComponent();

    fireEvent.change(screen.getByTestId("txtCustomMedicationName"), {
      target: { value: "Tylenol" },
    });
    const yesRadioButton = screen.getByTestId<HTMLInputElement>(
      "controlledSubstance"
    );
    fireEvent.click(yesRadioButton);
    await waitFor(
      () => expect(screen.getByLabelText("DEA Schedule")).toBeInTheDocument(),
      {
        timeout: 500,
      }
    );
    fireEvent.change(screen.getByLabelText("DEA Schedule"), {
      target: { value: "3" },
    });
    const saveResponse = {
      data: {
        responseMessage:
          "Custom medication with same name already exist. The medication name must be unique.",
      },
      status: 500,
    };
    server.use(
      rest.post(`/api/custom-medications`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(saveResponse));
      })
    );
    const btnSave = screen.getByTestId("btnSave");
    expect(btnSave).toBeInTheDocument();
    userEvent.click(btnSave);
  });

  it("btnSave Click - Close Error", async () => {
    RenderUIComponent();
    const btnSave = screen.getByTestId("btnSave");
    expect(btnSave).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("txtCustomMedicationName"), {
      target: { value: "" },
    });
    const radioButton = screen.getByTestId<HTMLInputElement>(
      "notControlledSubstance"
    );
    userEvent.click(radioButton);
    const yesRadioButton = screen.getByTestId<HTMLInputElement>(
      "controlledSubstance"
    );
    fireEvent.click(yesRadioButton);
    userEvent.click(btnSave);
  });

  it("should handle paste event where characters length greater than 70 characters", async () => {
    RenderUIComponent();

    const txtCustMed = screen.getByTestId<HTMLInputElement>(
      "txtCustomMedicationName"
    );
    const paste = createEvent.paste(txtCustMed, {
      clipboardData: {
        getData: () =>
          "integer eget aliquet nibh praesent tristique magna sit amet purus gravida quis blandit",
      },
    });
    fireEvent(txtCustMed, paste);
  });

  it("should handle paste event where characters length less than 70 characters", async () => {
    RenderUIComponent();

    const txtCustMed = screen.getByTestId<HTMLInputElement>(
      "txtCustomMedicationName"
    );
    const paste = createEvent.paste(txtCustMed, {
      clipboardData: {
        getData: () => "123456",
      },
    });
    fireEvent(txtCustMed, paste);
  });

  it("btnSave Click - Click alert-error-close-btn", async () => {
    RenderUIComponent();

    const btnSave = screen.getByTestId("btnSave");
    expect(btnSave).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("txtCustomMedicationName"), {
      target: { value: "" },
    });
    userEvent.click(btnSave);
    const btnDelete = screen.getByTestId("btnDelete");
    expect(btnDelete).toBeInTheDocument();
    userEvent.click(btnDelete);
  });

  it("btnSave Click - Controlled Substance Yes and then Yes to No", async () => {
    RenderUIComponent();
    const btnSave = screen.getByTestId("btnSave");
    expect(btnSave).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("txtCustomMedicationName"), {
      target: { value: "" },
    });
    const yesRadioButton = screen.getByTestId<HTMLInputElement>(
      "controlledSubstance"
    );
    fireEvent.click(yesRadioButton);
    const notRadioButton = screen.getByTestId<HTMLInputElement>(
      "notControlledSubstance"
    );
    fireEvent.click(notRadioButton);
    fireEvent.click(btnSave);
    await waitFor(
      () =>
        expect(screen.getByTestId("alert-error-close-btn")).toBeInTheDocument(),
      {
        timeout: 500,
      }
    );
    const closeBtn = screen.getByTestId("alert-error-close-btn");
    fireEvent.click(closeBtn);
  });

  it("Cancel button with Confirmation Popup No Click", async () => {
    RenderUIComponent();

    fireEvent.change(screen.getByTestId("txtCustomMedicationName"), {
      target: { value: "Tylenol" },
    });
    const btnSave = screen.getByTestId("btnSave");
    expect(btnSave).toBeInTheDocument();
    fireEvent.click(btnSave);
    const btnReset = screen.getByTestId("btnReset");
    expect(btnReset).toBeInTheDocument();
    fireEvent.click(btnReset);
    const cancelButton = screen.getByTestId("cancelButton");
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);
  });

  it("Cancel button with Confirmation Popup Yes Click", async () => {
    RenderUIComponent();

    fireEvent.change(screen.getByTestId("txtCustomMedicationName"), {
      target: { value: "Tylenol" },
    });
    const btnSave = screen.getByTestId("btnSave");
    expect(btnSave).toBeInTheDocument();
    fireEvent.click(btnSave);
    const btnReset = screen.getByTestId("btnReset");
    expect(btnReset).toBeInTheDocument();
    fireEvent.click(btnReset);
    const confirmButton = screen.getByTestId("confirmButton");
    expect(confirmButton).toBeInTheDocument();
    fireEvent.click(confirmButton);
  });

  it("Controlled Substance Yes", async () => {
    RenderUIComponent();

    fireEvent.change(screen.getByTestId("txtCustomMedicationName"), {
      target: { value: "Tylenol" },
    });
    const yesRadioButton = screen.getByTestId<HTMLInputElement>(
      "controlledSubstance"
    );
    fireEvent.click(yesRadioButton);
    await waitFor(
      () => expect(screen.getByLabelText("DEA Schedule")).toBeInTheDocument(),
      {
        timeout: 500,
      }
    );
    fireEvent.change(screen.getByLabelText("DEA Schedule"), {
      target: { value: "3" },
    });
    const btnSave = screen.getByTestId("btnSave");
    expect(btnSave).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("btnSave")).toBeEnabled(), {
      timeout: 500,
    });
    fireEvent.click(btnSave);
  });

  it("Controlled Substance Yes And Schedule is not have value", async () => {
    RenderUIComponent();

    fireEvent.change(screen.getByTestId("txtCustomMedicationName"), {
      target: { value: "Tylenol" },
    });
    const yesRadioButton = screen.getByTestId<HTMLInputElement>(
      "controlledSubstance"
    );
    fireEvent.click(yesRadioButton);
    await waitFor(
      () => expect(screen.getByLabelText("DEA Schedule")).toBeInTheDocument(),
      {
        timeout: 500,
      }
    );
    fireEvent.change(screen.getByLabelText("DEA Schedule"), {
      target: { value: "" },
    });
    const btnSave = screen.getByTestId("btnSave");
    expect(btnSave).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("btnSave")).toBeEnabled(), {
      timeout: 500,
    });
    fireEvent.click(btnSave);
  });

  it("Controlled Substance No", async () => {
    RenderUIComponent();

    fireEvent.change(screen.getByTestId("txtCustomMedicationName"), {
      target: { value: "Tylenol" },
    });
    const radioButton = screen.getByTestId<HTMLInputElement>(
      "notControlledSubstance"
    );
    userEvent.click(radioButton);
    const btnSave = screen.getByTestId("btnSave");
    expect(btnSave).toBeInTheDocument();
  });

  it("IsActive Status Yes to No", async () => {
    RenderUIComponent();

    fireEvent.change(screen.getByTestId("txtCustomMedicationName"), {
      target: { value: "Tylenol" },
    });
    const checkbox = screen.getByTestId<HTMLInputElement>("status");
    userEvent.click(checkbox);
    const btnSave = screen.getByTestId("btnSave");
    expect(btnSave).toBeInTheDocument();
  });

  it("IsActive Status No to Yes", async () => {
    RenderUIComponent();

    fireEvent.change(screen.getByTestId("txtCustomMedicationName"), {
      target: { value: "Tylenol" },
    });
    //Initially the Status for Medication is Active
    const checkbox = screen.getByTestId<HTMLInputElement>("status");
    //So first toggled it to No i.e. Inactive
    fireEvent.click(checkbox);
    //and again I toggled it to Yes i.e. Active
    fireEvent.click(checkbox);
  });

  it("Check Validation for custom medication name", async () => {
    RenderUIComponent();

    fireEvent.change(screen.getByTestId("txtCustomMedicationName"), {
      target: { value: "Tylenol" },
    });
    fireEvent.change(screen.getByTestId("txtCustomMedicationName"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByTestId("txtCustomMedicationName"), {
      target: { value: "Test Medication" },
    });
    fireEvent.change(screen.getByTestId("txtCustomMedicationName"), {
      target: { value: "Test ¶ Medication" },
    });
  });

  it("Check length for custom medication name", async () => {
    RenderUIComponent();

    fireEvent.change(screen.getByTestId("txtCustomMedicationName"), {
      target: {
        value:
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
      },
    });
    const btnSave = screen.getByTestId("btnSave");
  });

  //Ingredient Dropdown
  it("Ingredient Dropdown - Search with Ingredient Name", async () => {
    let result = RenderUIComponentResult();
    const someElement = result.container.querySelector(
      "#txtIngredientName"
    ) as HTMLElement;
    fireEvent.change(someElement, {
      target: { value: "Tylenol" },
    });
    const idMenu = result.container.querySelector(
      "#react-select-5-option-0"
    ) as HTMLDListElement;
    userEvent.click(idMenu);
    await waitFor(
      () => expect(screen.getByText("Tylenol")).toBeInTheDocument(),
      {
        timeout: 500,
      }
    );
    userEvent.click(screen.getByText("Tylenol"));
    const ingredientName = screen.getAllByTestId("Tylenol");
    fireEvent.click(ingredientName[0]);
    await waitFor(
      () =>
        expect(
          screen.getAllByTestId("remove-ingredient")[0]
        ).toBeInTheDocument(),
      {
        timeout: 500,
      }
    );
    fireEvent.click(screen.getAllByTestId("remove-ingredient")[0]);
  });

  it("Ingredient Dropdown - Search with Ingredient Name & Close", async () => {
    let result = RenderUIComponentResult();

    const someelement = result.container.querySelector(
      "#txtIngredientName"
    ) as HTMLElement;
    fireEvent.change(someelement, {
      target: { value: "0.2 Micron Filter Attachment" },
    });
    const idMenu = result.container.querySelector(
      "#react-select-5-option-0"
    ) as HTMLDListElement;
    userEvent.click(idMenu);
    await waitFor(
      () =>
        expect(
          screen.getByText("0.2 Micron Filter Attachment")
        ).toBeInTheDocument(),
      {
        timeout: 500,
      }
    );
    userEvent.click(screen.getByText("0.2 Micron Filter Attachment"));
    const ingredientName = screen.getAllByTestId(
      "0.2 Micron Filter Attachment"
    );
    userEvent.click(ingredientName[0]);

    const btnDelete = screen.getByTestId("btnDelete");
    expect(btnDelete).toBeInTheDocument();
    fireEvent.click(btnDelete);

    const cancelDeleteButton = screen.getByTestId("cancelDeleteButton");
    expect(cancelDeleteButton).toBeInTheDocument();
    fireEvent.click(cancelDeleteButton);

    expect(btnDelete).toBeInTheDocument();
    fireEvent.click(btnDelete);

    const confirmDeleteButton = screen.getByTestId("confirmDeleteButton");
    expect(confirmDeleteButton).toBeInTheDocument();
    fireEvent.click(confirmDeleteButton);
  });

  it("Ingredient Dropdown - No Search results found", async () => {
    let result = RenderUIComponentResult();

    const mockFetchData = jest
      .spyOn(loadIngredients, "loadIngredients")
      .mockImplementation(async () => {
        return {
          items: [],
        };
      });
    const someelement = result.container.querySelector(
      "#txtIngredientName"
    ) as HTMLElement;
    fireEvent.change(someelement, {
      target: { value: "Tylenol" },
    });
    expect(someelement).toHaveValue("Tylenol");
  });

  it("Ingredient Dropdown - Search with single characters", async () => {
    let result = RenderUIComponentResult();

    const someelement = result.container.querySelector(
      "#txtIngredientName"
    ) as HTMLElement;
    fireEvent.change(someelement, {
      target: { value: "d" },
    });
    expect(someelement).toHaveValue("d");
  });

  it("Ingredient Dropdown - Search with blank characters", async () => {
    let result = RenderUIComponentResult();

    const someelement = result.container.querySelector(
      "#txtIngredientName"
    ) as HTMLElement;
    fireEvent.change(someelement, {
      target: { value: "" },
    });
  });

  it("Ingredient Dropdown - Open Dropdown ", async () => {
    let result = RenderUIComponentResult();

    const someelement = result.container.querySelector(
      "#txtIngredientName"
    ) as HTMLElement;
    userEvent.click(someelement);
  });

  it("Ingredient Dropdown - loadOptionsSpy", async () => {
    setTimeout(() => {
      const mockFetchData = jest
        .spyOn(loadIngredients, "loadIngredients")
        .mockImplementation(async () => {
          return {
            items: [],
          };
        });
      let loadOptionsSpy = jest.fn((_, callback) => callback([mockFetchData]));
      let { container } = render(
        <AsyncPaginate
          className="react-select"
          classNamePrefix="react-select"
          loadOptions={loadOptionsSpy}
        />
      );
      let input = container.querySelector(
        "input.react-select__input"
      ) as HTMLElement;
      fireEvent.input(input, {
        target: {
          value: "tyl",
        },
        bubbles: true,
        cancelable: true,
      });
      const idMenu = container.querySelector(
        "#react-select-5-option-0"
      ) as HTMLElement;
      userEvent.click(idMenu);
      expect(loadOptionsSpy).toHaveBeenCalledTimes(2);
    }, 1000);
  });

  // Medication Group
  it("Medication Group - Search with Medication Group Name", async () => {
    let result = RenderUIComponentResult();

    const someelement = result.container.querySelector(
      "#txtMedicationGroup"
    ) as HTMLElement;
    fireEvent.change(someelement, {
      target: { value: "Analgesics" },
    });
    const idMenu = result.container.querySelector(
      "#react-select-5-option-0"
    ) as HTMLDListElement;
    userEvent.click(idMenu);
    await waitFor(
      () => expect(screen.getByTestId("Analgesics")).toBeInTheDocument(),
      {
        timeout: 500,
      }
    );
    userEvent.click(screen.getAllByTestId("Analgesics")[0]);
    userEvent.click(screen.getAllByTestId("rm-medication-group")[0]);
  });

  it("Medication Group - Search with single characters", async () => {
    let result = RenderUIComponentResult();

    const someelement = result.container.querySelector(
      "#txtMedicationGroup"
    ) as HTMLElement;
    fireEvent.change(someelement, {
      target: { value: "d" },
    });
    expect(someelement).toHaveValue("d");
  });

  it("Medication Group - Search with blank characters", async () => {
    let result = RenderUIComponentResult();

    const someelement = result.container.querySelector(
      "#txtMedicationGroup"
    ) as HTMLElement;
    fireEvent.click(someelement);
  });

  it("Medication Group - Open Dropdown ", async () => {
    let result = RenderUIComponentResult();

    const someelement = result.container.querySelector(
      "#txtMedicationGroup"
    ) as HTMLElement;
    userEvent.click(someelement);
  });

  it("Medication Group - loadOptionsSpy", async () => {
    setTimeout(() => {
      const mockFetchData = jest
        .spyOn(loadMedicationGroups, "loadMedicationGroups")
        .mockImplementation(async () => {
          return {
            items: [],
          };
        });
      let loadOptionsSpy = jest.fn((_, callback) => callback([mockFetchData]));
      let { container } = render(
        <AsyncPaginate
          className="react-select"
          classNamePrefix="react-select"
          loadOptions={loadOptionsSpy}
        />
      );
      let input = container.querySelector("input.react-select__input");

      fireEvent.input(input!, {
        target: {
          value: "tyl",
        },
        bubbles: true,
        cancelable: true,
      });
      const idMenu = container.querySelector(
        "#react-select-5-option-0"
      ) as HTMLElement;
      userEvent.click(idMenu);
      expect(loadOptionsSpy).toHaveBeenCalledTimes(2);
    }, 1000);
  });

  // Delete Custom Medication - Delete & Not Delete
  it("Delete Custom Medication - Delete & Not Delete", async () => {
    RenderUIComponent();

    const btnDelete = screen.getByTestId("btnDelete");
    expect(btnDelete).toBeInTheDocument();
    fireEvent.click(btnDelete);

    const cancelDeleteButton = screen.getByTestId("cancelDeleteButton");
    expect(cancelDeleteButton).toBeInTheDocument();
    fireEvent.click(cancelDeleteButton);

    expect(btnDelete).toBeInTheDocument();
    fireEvent.click(btnDelete);

    const confirmDeleteButton = screen.getByTestId("confirmDeleteButton");
    expect(confirmDeleteButton).toBeInTheDocument();
    fireEvent.click(confirmDeleteButton);
  });

  it("Add Custom Medication Mode - Save Click & Navigate to error field ", async () => {
    RenderUIComponent();

    const btnSave = screen.getByTestId("btnSave");
    expect(btnSave).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("txtCustomMedicationName"), {
      target: { value: "Ω" },
    });
    fireEvent.click(btnSave);
    await waitFor(
      () =>
        expect(screen.getByTestId("alert-error-close-btn")).toBeInTheDocument(),
      {
        timeout: 500,
      }
    );
    const focusToField = screen.getAllByTestId("focusToField")[0];
    fireEvent.click(focusToField);
    const btnReset = screen.getByTestId("btnReset");
    expect(btnReset).toBeInTheDocument();
    fireEvent.click(btnReset);
    const confirmButton = screen.getByTestId("confirmButton");
    expect(confirmButton).toBeInTheDocument();
    userEvent.click(confirmButton);
  });

  it("Calling Load Ingredients Service", async () => {
    let result = RenderUIComponentResult();

    const btnSave = screen.getByTestId("btnSave");
    expect(btnSave).toBeInTheDocument();
    const someelement = result.container.querySelector(
      "#txtIngredientName"
    ) as HTMLElement;
    fireEvent.change(someelement, {
      target: { value: "0.2 Micron Filter Attachment" },
    });
  });
});
