import React from "react";

import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";
import { act } from "react-dom/test-utils";
import * as ReactRedux from "react-redux";
import { Router } from "react-router-dom";

import Error from "../../common/components/Error";
import constants from "../../common/utils/constants";

jest.mock("react-redux");

describe("<Error/>", () => {
  const history = createMemoryHistory();
  const useSelectorMock = jest.spyOn(ReactRedux, "useSelector");
  const useDispatchMock = jest.spyOn(ReactRedux, "useDispatch");

  beforeEach(() => {
    useSelectorMock.mockClear();
    useDispatchMock.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it("에러 이미지를 렌더한다.", () => {
    const { getByAltText } = render(<Error />);
    const image = getByAltText("에러를 표시하는, 물에 빠지는 로고");

    expect(image).toHaveAttribute("src", constants.ASSET_ERROR_LOGO);
  });

  it("버튼을 클릭하면 메인페이지로 이동한다.", () => {
    const dummyDispatch = jest.fn();
    const clickHandler = jest.fn(() => {
      history.push(constants.ROUTE_MAIN);
    });

    useDispatchMock.mockReturnValue(dummyDispatch);

    const { getByText } = render(
      <Router history={history}>
        <Error />
      </Router>
    );

    getByText("메인 페이지로").onclick = clickHandler;

    act(() => {
      userEvent.click(getByText("메인 페이지로"));
    });

    expect(clickHandler).toHaveBeenCalled();
    expect(history.location.pathname).toBe(constants.ROUTE_MAIN);
  });
});
