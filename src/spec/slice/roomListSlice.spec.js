import roomListSlice, {
  roomListSliceActions,
} from "../../modules/slice/roomListSlice";

describe("roomListSlice 테스트", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      isLoading: false,
      roomList: [],
      error: "",
    };
  });

  afterEach(() => {
    initialState = null;
  });

  it("roomListSlice 초기 값을 테스트한다", () => {
    expect(roomListSlice.getInitialState()).toEqual(initialState);
  });

  it("roomListSlice getRooms 테스트", () => {
    expect(initialState.isLoading).toEqual(false);

    initialState = roomListSlice.reducer(
      initialState,
      roomListSliceActions.getRooms()
    );

    expect(initialState.isLoading).toEqual(true);
  });

  it("roomListSlice getRoomFailure 테스트", () => {
    initialState = roomListSlice.reducer(
      initialState,
      roomListSliceActions.getRooms()
    );

    expect(initialState.isLoading).toEqual(true);
    expect(initialState.error).toEqual("");

    const action = {
      payload: "error message",
    };

    initialState = roomListSlice.reducer(
      initialState,
      roomListSliceActions.getRoomFailure(action.payload)
    );

    expect(initialState.isLoading).toEqual(false);
    expect(initialState.error).toEqual(action.payload);
  });

  it("roomListSlice getNextRooms 테스트", () => {
    initialState.roomList = [1, 2, 3, 4, 5, 6];

    const nextRooms = [7, 8, 9, 10, 11, 12];
    const action = {
      payload: nextRooms,
    };

    expect(initialState.roomList).toEqual([1, 2, 3, 4, 5, 6]);

    initialState = roomListSlice.reducer(
      initialState,
      roomListSliceActions.getNextRooms(action.payload)
    );

    expect(initialState.roomList).toEqual(nextRooms);
  });

  it("roomListSlice clearError 테스트", () => {
    const action = {
      payload: "error message",
    };

    initialState = roomListSlice.reducer(
      initialState,
      roomListSliceActions.getRoomFailure(action.payload)
    );

    expect(initialState.isLoading).toEqual(false);
    expect(initialState.error).toEqual(action.payload);

    initialState = roomListSlice.reducer(
      initialState,
      roomListSliceActions.clearError()
    );

    expect(initialState.error).toEqual("");
  });
});
