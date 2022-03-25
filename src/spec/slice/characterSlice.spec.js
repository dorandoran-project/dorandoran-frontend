import characterSlice, {
  characterSliceActions,
} from "../../modules/slice/characterSlice";

describe("characterSlice 테스트", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      characters: [],
      chairPosition: [],
    };
  });

  afterEach(() => {
    initialState = null;
  });

  it("characterSlice 초기 값을 테스트한다", () => {
    expect(characterSlice.getInitialState()).toEqual(initialState);
  });

  it("characterSlice allInit 테스트", () => {
    initialState.characters = ["apc", "bar", "carrot", "division"];
    initialState.chairPosition = [1, 2, 3, 4];

    initialState = characterSlice.reducer(
      initialState,
      characterSliceActions.allInit()
    );

    expect(initialState.characters.length).toEqual(0);
    expect(initialState.chairPosition.length).toEqual(0);
  });
});
