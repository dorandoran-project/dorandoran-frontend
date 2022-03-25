import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { expectSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";

import constants from "../../common/utils/constants";
import { watchJoinUser, watchCreateRoom } from "../../modules/saga/roomSaga";
import roomSlice, { roomSliceActions } from "../../modules/slice/roomSlice";

describe("roomSaga Test", () => {
  const mock = new MockAdapter(axios);

  it("joinUserSaga Test", () => {
    const payload = {
      currentRoom: "12344567890abcdefghijklmnopqrstuvwxyzroom",
      currentUser: "sy9876543210abcdefghijklmnopqrstuvwxyz",
    };

    const response = "200_Success";
    const uri = process.env.REACT_APP_SERVER_URI + constants.REQUEST_ROOM_JOIN;

    const apiJoinUser = mock
      .onPost(uri, {
        currentRoom: payload.currentRoom,
        currentUser: payload.currentUser,
      })
      .reply(200, response);

    return expectSaga(watchJoinUser)
      .withReducer(roomSlice.reducer)
      .dispatch(roomSliceActions.joinUser(payload))
      .provide([[matchers.call.fn(apiJoinUser), response]])
      .put(roomSliceActions.joinedUserSuccess())
      .hasFinalState({
        isComplete: false,
        isLoading: false,
        isShowModal: false,
        isReload: false,
        error: "",
        info: null,
      })
      .silentRun();
  });

  it("createRoomSaga Test", () => {
    const payload = {
      roomCreator: {
        _id: "62121ed9506b356948c3d581",
        name: "서동수",
        email: "tjehdtn1283@hanmail.net",
        profile:
          "http://k.kakaocdn.net/dn/cblKPV/btrhZNcYYoj/KYVBwxDwJKkKlHgb89JMc1/img_640x640.jpg",
        age_range: "30~39",
        gender: "male",
        current_address: "서울 강남구",
        __v: 0,
      },
      roomTitle: "서동수 님의 이야기방",
    };

    const response = {
      room_no: 3,
      title: "서동수 님의 이야기방",
      users: ["62121ed9506b356948c3d581"],
      address: "서울 강남구",
      _id: "623dc17a65ee303b94ffff2d",
    };

    const uri =
      process.env.REACT_APP_SERVER_URI + constants.REQUEST_ROOM_CREATE;

    const apiCreateRoomRequest = mock
      .onPost(uri, {
        roomData: payload,
      })
      .reply(200, response);

    return expectSaga(watchCreateRoom)
      .withReducer(roomSlice.reducer)
      .dispatch(roomSliceActions.createRoomRequest(payload))
      .provide([[matchers.call.fn(apiCreateRoomRequest), response]])
      .put(roomSliceActions.createRoomSuccess(response.data))
      .hasFinalState({
        isComplete: true,
        isLoading: false,
        isShowModal: false,
        isReload: false,
        error: "",
        info: response.data,
      })
      .silentRun();
  });
});
