import React from "react";

import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { useDispatch } from "react-redux";

import NotFound from "../../common/components/NotFound";

jest.mock("react-redux");

describe("<NotFound/>", () => {
  const mockedDispatch = jest.fn();

  useDispatch.mockReturnValue(mockedDispatch);

  it("타이틀을 렌더한다.", () => {
    const { getByText } = render(<NotFound />);
    const title = getByText("404");

    expect(title).toBeInTheDocument();

    useDispatch.mockClear();
  });
});
