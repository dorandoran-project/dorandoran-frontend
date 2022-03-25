import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { expectSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";

import constants from "../../common/utils/constants";
import { watchLogin, watchCookieClearSaga } from "../../modules/saga/authSaga";
import authSlice, { authSliceActions } from "../../modules/slice/authSlice";

describe("authSaga Test", () => {
  const mock = new MockAdapter(axios);

  it("loginSaga Test", () => {
    const data = {
      email: "sample@sample.com",
      age_range: "20~30",
      gender: "male",
      name: "김철수",
      profile: "",
      current_address: "서울 강남구",
    };

    const response = {
      email: "sample@sample.com",
      age_range: "20~30",
      gender: "male",
      name: "김철수",
      profile: "",
      current_address: "서울 강남구",
      _id: "1234567890abcdefghijklmnopqrstuvwxyz",
    };

    const uri = process.env.REACT_APP_SERVER_URI + constants.REQUEST_AUTH_LOGIN;
    const apiLoginRequest = mock.onPost(uri, data).reply(200, response);

    return expectSaga(watchLogin)
      .withReducer(authSlice.reducer)
      .dispatch(authSliceActions.loginRequest(data))
      .provide([[matchers.call.fn(apiLoginRequest), response]])
      .put(authSliceActions.loginSuccess(response))
      .hasFinalState({
        isLoggedIn: true,
        error: "",
        user: response,
        character: [],
      })
      .silentRun();
  });

  it("cookieClearSaga", () => {
    const uri = process.env.REACT_APP_SERVER_URI + constants.REQUEST_AUTH_CLEAR;
    const apiCookieClear = mock.onGet(uri).reply(200);

    return expectSaga(watchCookieClearSaga)
      .withReducer(authSlice.reducer)
      .dispatch(authSliceActions.cookieClear())
      .provide([[matchers.call.fn(apiCookieClear)]])
      .put(authSliceActions.cookieClearSuccess())
      .hasFinalState({
        isLoggedIn: false,
        error: "",
        user: null,
        character: [],
      })
      .silentRun();
  });
});
