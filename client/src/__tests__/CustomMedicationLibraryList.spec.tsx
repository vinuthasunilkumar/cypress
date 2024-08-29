import React from "react";
import {
  cleanup,
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import CustomMedicationLibraryList from "../features/custom-medication-library/pages/CustomMedicationLibraryList";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { server } from "../mocks/server";
import * as getCustomMedicationLibraryList from "../services/CustomMedicationLibraryService";
import { Provider } from "react-redux";
import store from "./../redux/store";
import { setMockHostContextSetup } from "../helper/mockHostContextSetup";

afterEach(cleanup);

jest.mock("axios", () => {
  const mAxiosInstance = {
    get: jest.fn().mockImplementation(() => {
      const successResponse = {
        data: {
          customMedicationLibraries: [
            {
              description: "Tylenol 125 mg capsule",
              id: 1,
              isAssigned: true,
              isActive: true,
              CorporationId: 1,
            },
            {
              description: "Tylenol 225 mg capsule",
              id: 2,
              isAssigned: true,
              isActive: true,
              CorporationId: 0,
            },
            {
              description: "Tylenol 325 mg capsule",
              id: 3,
              isAssigned: true,
              isActive: true,
            },
            {
              description: "Tylenol 425 mg capsule",
              id: 4,
              isAssigned: true,
              isActive: true,
            },
            {
              description: "Tylenol 525 mg capsule",
              id: 5,
              isAssigned: true,
              isActive: true,
            },
            {
              description: "Tylenol 625 mg capsule",
              id: 6,
              isAssigned: false,
              isActive: false,
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
      .mockImplementationOnce(() => {
        const successUpdateResponse = {
          data: {
            id: 432797,
            responseMessage: "saved successfully",
          },
          status: 200,
        };
        return Promise.resolve(successUpdateResponse);
      }),
    post: jest
      .fn()
      .mockImplementationOnce(() => {
        const failedSaveResponse = {
          data: {
            id: 432797,
            responseMessage: "Not saved",
            statusCode: 500,
          },
          status: 200,
        };
        return Promise.resolve(failedSaveResponse);
      })
      .mockImplementationOnce(() => {
        const successSaveResponse = {
          data: {
            id: 432797,
            responseMessage: "saved successfully",
            statusCode: 200,
          },
          status: 200,
        };
        return Promise.resolve(successSaveResponse);
      }),
  };
  return {
    create: jest.fn(() => mAxiosInstance),
  };
});

beforeEach(() => {
  setMockHostContextSetup();
  RemoveSelectedLibraryDetails();
  setLibraryPageNumber();
});
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const RenderUIComponent = (currentTab: string = "") => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CustomMedicationLibraryList currentTab={currentTab} />
      </MemoryRouter>
    </Provider>
  );
};

describe("Custom Medication Library List Component", () => {
  it("renders without crashing", () => {
    window.scrollTo = jest.fn();
  });
  it("Checking fields are available", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnAddNewLibrary = screen.queryByTestId("btnAddNewLibrary");
      expect(btnAddNewLibrary).toBeInTheDocument();
    });
  });

  it("Render custom libraries sorted ASC", async () => {
    sessionStorage.setItem("librariesSelectedSort", "ASC");
    RenderUIComponent();
    await waitFor(() => {
      const sortButton = screen.queryByTestId("sort-library-name");
      expect(sortButton).toBeInTheDocument();
      if (sortButton) {
        fireEvent.keyDown(sortButton);
        fireEvent.click(sortButton);
      }
    });
  });

  it("Render custom libraries sorted DESC", async () => {
    sessionStorage.setItem("librariesSelectedSort", "DESC");
    RenderUIComponent();
    await waitFor(() => {
      const sortButton = screen.queryByTestId("sort-library-name");
      expect(sortButton).toBeInTheDocument();
      if (sortButton) {
        fireEvent.keyDown(sortButton);
        fireEvent.click(sortButton);
      }
    });
  });

  it("Render custom library page number 2", async () => {
    sessionStorage.setItem("libraryPageNumber", "2");
    RenderUIComponent("tab1");
  });

  it("Render when tab is verticalTab", async () => {
    sessionStorage.setItem("libraryPageNumber", "2");
    RenderUIComponent("verticalTab1");
  });

  it("Search for new library", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const txtSearch = screen.queryByTestId("txtSearch");
      expect(txtSearch).toBeInTheDocument();
      fireEvent.change(txtSearch! as HTMLInputElement, { target: { value: "Tylenol" } });
      expect((txtSearch! as HTMLInputElement).value).toBe("Tylenol");
      fireEvent.keyPress(txtSearch! as HTMLInputElement, { key: "Enter", keyCode: 13 });
    });
  });

  it("Search for new library else case", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const txtSearch = screen.queryByTestId("txtSearch");
      expect(txtSearch).toBeInTheDocument();
      fireEvent.change(txtSearch!, {target:{value: 't'}});
      fireEvent.change(txtSearch!, {target:{value: 'tylenol'}})
      txtSearch!.setAttribute("name","search");
    });
  });

  it("Click on custom medications library name & navigate to Summary Page", async () => {
    RenderUIComponent();
    await waitFor(
      () => expect(screen.getByTestId("nextPage")).toBeInTheDocument(),
      {
        timeout: 500,
      }
    );
    await waitFor(() => {
      const libraryName = screen.getAllByTestId("libraryName");
      fireEvent.click(libraryName[0]);
    });
  });

  it("Click on custom medications library name & navigate to Summary Page Where Corporation Id is missing", async () => {
    RenderUIComponent();
    await waitFor(
      () => expect(screen.getByTestId("nextPage")).toBeInTheDocument(),
      {
        timeout: 500,
      }
    );

    await waitFor(() => {
      const libraryName = screen.getAllByTestId("libraryName");
      fireEvent.click(libraryName[3]);
    });
  });

  it("Click on Next Page", async () => {
    RenderUIComponent();
    await waitFor(
      () => expect(screen.getByTestId("nextPage")).toBeInTheDocument(),
      {
        timeout: 500,
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
        .spyOn(getCustomMedicationLibraryList, "getCustomMedicationLibraryList")
        .mockImplementation(async () => {
          return {
            customMedicationLibraries: [],
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
        .spyOn(getCustomMedicationLibraryList, "getCustomMedicationLibraryList")
        .mockImplementation(async () => {
          return {
            customMedicationLibraries: [],
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
        .spyOn(getCustomMedicationLibraryList, "getCustomMedicationLibraryList")
        .mockImplementation(async () => {
          return {
            customMedicationLibraries: undefined,
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

  // Test Cases for Add New Library Popup
  it("Click btnAddNewLibrary - Open Add Library Popup & Cancel or Close it", async () => {
    RenderUIComponent();

    await waitFor(() => {
      const btnAddNew = screen.getByTestId("btnAddNewLibrary");
      fireEvent.click(btnAddNew);
      const txtLibraryName = screen.queryByTestId("txtLibraryName");
      expect(txtLibraryName).toBeInTheDocument();
      const cancelButton = screen.getByTestId("cancelButton");
      fireEvent.click(cancelButton);
    });
  });

  it("Click btnAddNewLibrary - Add Library Popup Library Validations", async () => {
    RenderUIComponent();

    await waitFor(() => {
      const btnAddNew = screen.getByTestId("btnAddNewLibrary");
      fireEvent.click(btnAddNew);
      const txtLibraryName = screen.queryByTestId("txtLibraryName");
      expect(txtLibraryName).toBeInTheDocument();
      const txtLibraryNameId = screen.getByTestId("txtLibraryName");
      fireEvent.change(txtLibraryNameId, {
        target: { value: "Tylenol" },
      });
      fireEvent.change(txtLibraryNameId, {
        target: { value: "" },
      });
      fireEvent.change(txtLibraryNameId, {
        target: { value: "Test Medication" },
      });
      fireEvent.change(txtLibraryNameId, {
        target: { value: "Test ¶ Medication" },
      });
      fireEvent.change(txtLibraryNameId, {
        target: { value: "Ω" },
      });
    });
  });

  it("Check length for library name", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnAddNew = screen.getByTestId("btnAddNewLibrary");
      fireEvent.click(btnAddNew);
      const txtLibraryName = screen.queryByTestId("txtLibraryName");
      expect(txtLibraryName).toBeInTheDocument();

      fireEvent.change(screen.getByTestId("txtLibraryName"), {
        target: {
          value:
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
        },
      });
      const confirmButton = screen.getByTestId("confirmButton");
      fireEvent.click(confirmButton);
    });
  });

  it("Handle Paste Event for library name", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnAddNew = screen.getByTestId("btnAddNewLibrary");
      fireEvent.click(btnAddNew);

      const txtLibraryName = screen.queryByTestId("txtLibraryName");
      expect(txtLibraryName).toBeInTheDocument();

      const txtCustMed = screen.getByTestId<HTMLInputElement>("txtLibraryName");
      const paste = createEvent.paste(txtCustMed, {
        clipboardData: {
          getData: () =>
            "integer eget aliquet nibh praesent tristique magna sit amet purus gravida quis blandit",
        },
      });
      fireEvent(txtCustMed, paste);
    });
  });

  it("Handle Paste Event for library name length characters are less than 70 ", async () => {
    RenderUIComponent();

    await waitFor(() => {
      const btnAddNew = screen.getByTestId("btnAddNewLibrary");
      fireEvent.click(btnAddNew);
      const txtLibraryName = screen.queryByTestId("txtLibraryName");
      expect(txtLibraryName).toBeInTheDocument();
      const txtCustMed = screen.getByTestId<HTMLInputElement>("txtLibraryName");
      const paste = createEvent.paste(txtCustMed, {
        clipboardData: {
          getData: () => "integer eget aliquet nibh praesent",
        },
      });
      fireEvent(txtCustMed, paste);
    });
  });

  it("Handle Paste Event for library name & Remove all Content", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnAddNew = screen.getByTestId("btnAddNewLibrary");
      fireEvent.click(btnAddNew);
      const txtLibraryName = screen.queryByTestId("txtLibraryName");
      expect(txtLibraryName).toBeInTheDocument();
      const txtCustMed = screen.getByTestId<HTMLInputElement>("txtLibraryName");
      const paste = createEvent.paste(txtCustMed, {
        clipboardData: {
          getData: () =>
            "integer eget aliquet nibh praesent tristique magna sit amet purus gravida quis blandit",
        },
      });
      fireEvent(txtCustMed, paste);

      fireEvent.change(screen.getByTestId("txtLibraryName"), {
        target: { value: "Tylenol" },
      });
    });
  });

  it("Save Library Where Library Name is available", async () => {
    RenderUIComponent();
    await waitFor(() => {
      const btnAddNew = screen.getByTestId("btnAddNewLibrary");
      fireEvent.click(btnAddNew);
      const txtLibraryName = screen.queryByTestId("txtLibraryName");
      expect(txtLibraryName).toBeInTheDocument();
      fireEvent.change(screen.getByTestId("txtLibraryName"), {
        target: { value: "Tylenol" },
      });
      const confirmButton = screen.getByTestId("confirmButton");
      userEvent.click(confirmButton);
    });
  });

  it("Save Library Where Library Name is required", async () => {
    RenderUIComponent();

    await waitFor(() => {
      const btnAddNew = screen.getByTestId("btnAddNewLibrary");
      fireEvent.click(btnAddNew);
      const txtLibraryName = screen.queryByTestId("txtLibraryName");
      expect(txtLibraryName).toBeInTheDocument();

      fireEvent.change(screen.getByTestId("txtLibraryName"), {
        target: { value: "" },
      });

      //Initially the Status for Medication is Active
      const checkbox = screen.getByTestId<HTMLInputElement>("library-status");
      //So first toggled it to No i.e. Inactive
      fireEvent.click(checkbox);
      //and again I toggled it to Yes i.e. Active
      fireEvent.click(checkbox);

      const confirmButton = screen.getByTestId("confirmButton");
      userEvent.click(confirmButton);
    });
  });

  it("Add New Library - Toggle the status for Library Name & Save it - Failure Response", async () => {
    RenderUIComponent();

    await waitFor(() => {
      const btnAddNew = screen.getByTestId("btnAddNewLibrary");
      fireEvent.click(btnAddNew);
      const txtLibraryName = screen.queryByTestId("txtLibraryName");
      expect(txtLibraryName).toBeInTheDocument();
      fireEvent.change(screen.getByTestId("txtLibraryName"), {
        target: { value: "Tylenol" },
      });

      //Initially the Status for Library is Active
      const checkbox = screen.getByTestId<HTMLInputElement>("library-status");
      //So first toggled it to No i.e. Inactive
      fireEvent.click(checkbox);
      //and again I toggled it to Yes i.e. Active
      fireEvent.click(checkbox);
      const confirmButton = screen.getByTestId("confirmButton");
      expect(confirmButton).toBeInTheDocument();
      fireEvent.click(confirmButton);
    });

    setTimeout(async () => {
      const btnAlertErrorClose = screen.getByTestId("alert-error-close-btn");
      expect(btnAlertErrorClose).toBeInTheDocument();
      fireEvent.click(btnAlertErrorClose);
    }, 1000);
  });
});
export const RemoveSelectedLibraryDetails = () => {
  sessionStorage.removeItem("selectedLibraryDetails");
};

export const setLibraryPageNumber = () => {
  sessionStorage.setItem("libraryPageNumber", "1");
};
