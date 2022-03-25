import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import Modal from "../../common/components/modal/Modal";

describe("<Modal/>", () => {
  const size = "small";

  it("모달의 사이즈를 입력하면 사이즈에 맞게 호출해야 한다", () => {
    const { getByTestId } = render(<Modal size={size} />);

    expect(getByTestId(size)).toBeInTheDocument();
  });
});
