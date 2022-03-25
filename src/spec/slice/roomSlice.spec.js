import roomSlice, { roomSliceActions } from "../../modules/slice/roomSlice";

describe("roomSlice 테스트", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      isComplete: false,
      isLoading: false,
      isShowModal: false,
      isReload: false,
      error: "",
      info: null,
    };
  });

  afterEach(() => {
    initialState = null;
  });

  it("roomSlice 초기 값을 테스트한다", () => {
    expect(roomSlice.getInitialState()).toEqual(initialState);
  });

  it("roomSlice joinUser 테스트", () => {
    expect(initialState.isLoading).toEqual(false);

    initialState = roomSlice.reducer(initialState, roomSliceActions.joinUser());

    expect(initialState.isLoading).toEqual(true);
  });

  it("roomSlice deleteUserSuccess 테스트", () => {
    initialState = roomSlice.reducer(
      initialState,
      roomSliceActions.deleteUserSuccess()
    );

    expect(initialState.isLoading).toEqual(false);
    expect(initialState.isComplete).toEqual(true);
  });

  it("roomSlice createRoomFailure 테스트", () => {
    const action = {
      payload: "error message",
    };

    initialState = roomSlice.reducer(
      initialState,
      roomSliceActions.createRoomFailure(action.payload)
    );

    expect(initialState.error).toEqual(action.payload);
  });

  it("roomSlice saveInfo 테스트", () => {
    const action = {
      payload: {
        roomName: "123456789abcdefghi",
      },
    };

    initialState = roomSlice.reducer(
      initialState,
      roomSliceActions.saveInfo(action.payload)
    );

    expect(initialState.info).toEqual(action.payload);
  });

  it("roomSlice init 테스트", () => {
    const action = {
      payload: {
        roomName: "123456789abcdefghi",
      },
    };

    initialState = roomSlice.reducer(
      initialState,
      roomSliceActions.saveInfo(action.payload)
    );

    expect(initialState.info).toEqual(action.payload);

    initialState = roomSlice.reducer(initialState, roomSliceActions.init());

    expect(initialState.info).toEqual(null);
  });

  it("roomSlice clearError 테스트", () => {
    initialState.error = "error message";

    expect(initialState.error).toEqual("error message");

    initialState = roomSlice.reducer(
      initialState,
      roomSliceActions.clearError()
    );

    expect(initialState.error).toEqual("");
  });
});
