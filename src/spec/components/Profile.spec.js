import React from "react";

import { render } from "@testing-library/react";

import "@testing-library/jest-dom";
import Profile from "../../common/components/Profile";

describe("<Profile/>", () => {
  let text;
  let type;
  let left;
  let top;

  beforeEach(() => {
    text = "한소영";
    left = 60;
    top = 120;
    type =
      "http://k.kakaocdn.net/dn/cblKPV/btrhZNcYYoj/KYVBwxDwJKkKlHgb89JMc1/img_640x640.jpg";
  });

  it("프로필에 left와 top을 넣으면 프로필 component를 렌더한다.", () => {
    const { getByTestId } = render(
      <Profile left={left} top={top} type={type} text={text} />
    );
    const profileEl = getByTestId("profile");

    expect(profileEl).toBeInTheDocument();
  });

  it("프로필 이미지를 렌더한다", () => {
    const { getByAltText } = render(
      <Profile left={left} top={top} type={type} text={text} />
    );
    const image = getByAltText("카카오톡 프로필 이미지");

    expect(image).toHaveAttribute("src", type);
  });
});
