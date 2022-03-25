import videoSlice, { videoSliceActions } from "../../modules/slice/videoSlice";

describe("videoSlice 테스트", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      error: "",
      event: "",
    };
  });

  afterEach(() => {
    initialState = null;
  });

  it("videoSlice 초기 값을 테스트한다", () => {
    expect(videoSlice.getInitialState()).toEqual(initialState);
  });

  it("videoSlice saveError, clearError 테스트", () => {
    expect(initialState.error).toEqual("");

    const action = {
      payload: "error message",
    };

    initialState = videoSlice.reducer(
      initialState,
      videoSliceActions.saveError(action.payload)
    );

    expect(initialState.error).toEqual(action.payload);

    initialState = videoSlice.reducer(
      initialState,
      videoSliceActions.clearError()
    );

    expect(initialState.error).toEqual("");
  });
});
