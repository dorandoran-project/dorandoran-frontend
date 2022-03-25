import authSlice, { authSliceActions } from "../../modules/slice/authSlice";

describe("authSlice 테스트", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      isLoggedIn: false,
      error: "",
      user: null,
      character: [],
    };
  });

  afterEach(() => {
    initialState = null;
  });

  it("authSlice 초기 값을 테스트한다", () => {
    expect(authSlice.getInitialState()).toEqual(initialState);
  });

  it("authSlice clearError 테스트", () => {
    initialState.error = "error";

    expect(initialState.error).toEqual("error");

    initialState = authSlice.reducer(
      initialState,
      authSliceActions.clearError()
    );

    expect(initialState.error).toEqual("");
  });

  it("authSlice loginSuccess 테스트", () => {
    const action = {
      payload: {
        name: "김철수",
        email: "sample@sample.com",
        profile: "",
        age_range: "20~30",
        gender: "male",
        current_address: "서울 강남구",
      },
    };

    initialState = authSlice.reducer(
      initialState,
      authSliceActions.loginSuccess(action.payload)
    );

    expect(initialState.user !== null).toEqual(true);
    expect(initialState.user.name === "김철수").toEqual(true);
  });

  it("authSlice logoutSuccess 테스트", () => {
    const action = {
      payload: {
        name: "김철수",
        email: "sample@sample.com",
        profile: "",
        age_range: "20~30",
        gender: "male",
        current_address: "서울 강남구",
      },
    };

    initialState = authSlice.reducer(
      initialState,
      authSliceActions.loginSuccess(action.payload)
    );

    expect(initialState.isLoggedIn).toEqual(true);
    expect(initialState.user !== null).toEqual(true);

    initialState = authSlice.reducer(
      initialState,
      authSliceActions.logoutSuccess()
    );

    expect(initialState.isLoggedIn).toEqual(false);
    expect(initialState.user).toEqual(null);
  });
});
