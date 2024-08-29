import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../shared/pages/Footer";

it("renders footer component", async () => {
  render(<Footer />);
  const items = await screen.findAllByText(
    /2022 MatrixCare is a registered trademark of MatrixCare. All rights reserved./
  );
  expect(items).toHaveLength(1);
});
