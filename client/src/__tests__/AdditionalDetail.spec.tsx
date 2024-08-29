import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdditionalDetail from "../features/order-writer/pages/AdditionalDetail";
import { Provider } from "react-redux";
import store from "../redux/store";

describe("Additional Detail", () => {
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
    });
  });
});
