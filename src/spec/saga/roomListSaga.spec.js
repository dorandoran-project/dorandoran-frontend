import axios from "axios";
import Mockadaptor from "axios-mock-adapter";
import { expectSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";

import constants from "../../common/utils/constants";
import {
  watchInitRooms,
  watchNextRooms,
} from "../../modules/saga/roomListSaga";
import roomListSlice, {
  roomListSliceActions,
} from "../../modules/slice/roomListSlice";

describe("roomListSaga test", () => {
  const mock = new Mockadaptor(axios);

  it("roomlist getRoom 성공적으로 받아왔을 경우를 테스트한다.", () => {
    const response = [
      {
        _id: "623cb30178d5841a0f87b6e8",
        room_no: 2,
        title: "예림 님의 이야기방",
        users: [Array],
        address: "서울 강남구",
      },
      {
        _id: "623db58258dcd86513c32ffc",
        room_no: 2,
        title: "ㅅㅇ 님의 사랑방",
        users: [Array],
        address: "서울 강남구",
      },
    ];

    const uri =
      process.env.REACT_APP_SERVER_URI + constants.REQUEST_ROOMLIST_ROOM;

    const apiGetRooms = mock.onGet(uri).reply(200, response);

    return expectSaga(watchInitRooms)
      .withReducer(roomListSlice.reducer)
      .dispatch(roomListSliceActions.getRooms())
      .provide([[matchers.call.fn(apiGetRooms), response]])
      .put(roomListSliceActions.getRoomsSuccess(response.data))
      .hasFinalState({
        isLoading: false,
        roomList: response.data,
        error: "",
      })
      .silentRun();
  });

  it("getRoom message를 가지고 있을 경우 (실패) 테스트 한다", () => {
    const response = { message: "400_Bad_Request" };

    const uri =
      process.env.REACT_APP_SERVER_URI + constants.REQUEST_ROOMLIST_ROOM;

    const api = mock.onGet(uri).reply(200, response);

    return expectSaga(watchInitRooms)
      .withReducer(roomListSlice.reducer)
      .dispatch(roomListSliceActions.getRooms())
      .provide([[matchers.call.fn(api), response]])
      .put(roomListSliceActions.getRoomFailure(response.message))
      .hasFinalState({
        isLoading: false,
        roomList: [],
        error: response.message,
      })
      .silentRun();
  });

  it("getNextRoomsaga 6개 이하의 값일 때 next 버튼을 클릭했을 때를 테스트한다.", async () => {
    const roomList = [
      {
        _id: "62028363530976bb8ea8ab67",
        title: "성동구님의 방",
        users: ["620280e02b2f305b9deaa837", "62028198530976bb8ea8ab59"],
        address: "서울 강남구",
        room_no: 1,
      },
      {
        _id: "62028363530976bb8ea8ab68",
        title: "한소철 님의 방",
        users: ["62028198530976bb8ea8ab5a"],
        address: "서울 강남구",
        room_no: 2,
      },
      {
        id: "62028363530976bb8ea8ab69",
        title: "박소영님의 모임당",
        users: ["62028198530976bb8ea8ab5b"],
        address: "서울 강남구",
        room_no: 3,
      },
    ];

    const lastRoom = roomList[roomList.length - 1];
    const response = [
      {
        _id: "623cb30178d5841a0f87b6e8",
        room_no: 2,
        title: "예림 님의 이야기방",
        users: [[Object], [Object], [Object], [Object]],
        address: "서울 강남구",
      },
      {
        _id: "623db58258dcd86513c32ffc",
        room_no: 2,
        title: "ㅅㅇ 님의 사랑방",
        users: [[Object]],
        address: "서울 강남구",
      },
      {
        _id: "623dc17a65ee303b94ffff2d",
        room_no: 3,
        title: "서동수 님의 이야기방",
        users: [[Object]],
        address: "서울 강남구",
      },
    ];

    const uri =
      process.env.REACT_APP_SERVER_URI + constants.REQUEST_ROOMLIST_ROOM;
    const apiGetNextRooms = mock
      .onPost(uri, { lastRoom, direction: "next" })
      .reply(200, response);

    return expectSaga(watchNextRooms)
      .withReducer(roomListSlice.reducer)
      .dispatch(roomListSliceActions.getNextRooms(roomList))
      .provide([[matchers.call.fn(apiGetNextRooms), response]])
      .put(roomListSliceActions.getRoomsSuccess(response.data))
      .silentRun();
  });
});
