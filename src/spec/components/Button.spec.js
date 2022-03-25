import React from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import "@testing-library/jest-dom";
import Button from "../../common/components/Button";

describe("<Button/>", () => {
  let text;
  let onClick;

  beforeEach(() => {
    text = "안녕하세요";
    onClick = jest.fn();
  });

  afterEach(() => {
    text = "";
    onClick = null;
  });

  it("Button small component를 렌더한다.", () => {
    const { getByTestId } = render(<Button size="small" text={text} />);
    const smallEl = getByTestId("small");

    expect(smallEl).toBeInTheDocument();
  });

  it("Button medium component를 렌더한다.", () => {
    const { getByTestId } = render(<Button size="medium" text={text} />);
    const mediumEl = getByTestId("medium");

    expect(mediumEl).toBeInTheDocument();
  });

  it("Button large component를 렌더한다.", () => {
    const { getByTestId } = render(<Button size="large" text={text} />);
    const largeEl = getByTestId("large");

    expect(largeEl).toBeInTheDocument();
  });

  it("small 버튼을 클릭할 때 onClick 함수를 호출해야 한다.", () => {
    render(<Button onClick={onClick} text={text} size="small" />);
    userEvent.click(screen.getByText(text));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("medium 버튼을 클릭할 때 onClick 함수를 호출해야 한다.", () => {
    render(<Button onClick={onClick} text={text} size="medium" />);
    userEvent.click(screen.getByText(text));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("large 버튼을 클릭할 때 onClick 함수를 호출해야 한다.", () => {
    render(<Button onClick={onClick} text={text} size="large" />);
    userEvent.click(screen.getByText(text));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
