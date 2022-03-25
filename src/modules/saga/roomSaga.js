import axios from "axios";
import { call, takeEvery, put } from "redux-saga/effects";

import constants from "../../common/utils/constants";
import history from "../../common/utils/history";
import { roomSliceActions } from "../slice/roomSlice";

const joinUserSaga = function* ({ payload }) {
  try {
    const { currentRoom, currentUser } = payload;

    const response = yield call(() =>
      axios.post(
        process.env.REACT_APP_SERVER_URI + constants.REQUEST_ROOM_JOIN,
        {
          currentRoom,
          currentUser,
        },
        {
          withCredentials: true,
        }
      )
    );

    if (response.data.message) {
      yield put(roomSliceActions.joinedUserFailure(response));
      return;
    }

    yield put(roomSliceActions.joinedUserSuccess());
  } catch (error) {
    yield put(roomSliceActions.joinedUserFailure(error));
  }
};

const deleteUserSaga = function* ({ payload }) {
  try {
    const { currentRoom, currentUser } = payload;

    const response = yield call(() =>
      axios.post(
        process.env.REACT_APP_SERVER_URI + constants.REQUEST_ROOM_LEAVE,
        {
          currentRoom,
          currentUser,
        },
        {
          withCredentials: true,
        }
      )
    );

    if (response.data.message) {
      yield put(roomSliceActions.deleteUserFailure(response.data.message));
      return;
    }

    yield put(roomSliceActions.deleteUserSuccess(response.data.success));
  } catch (error) {
    yield put(roomSliceActions.deleteUserFailure(error));
  }
};

const createRoomSaga = function* ({ payload }) {
  try {
    let response;
    yield call(async () => {
      response = await axios.post(
        process.env.REACT_APP_SERVER_URI + constants.REQUEST_ROOM_CREATE,
        {
          roomData: payload,
        },
        {
          withCredentials: true,
        }
      );
    });

    yield put(roomSliceActions.createRoomSuccess(response.data.newRoom));
  } catch (error) {
    yield put(roomSliceActions.createRoomFailure(error));
  }
};

const getCurrentRoomInfoSaga = function* ({ payload }) {
  try {
    const response = yield call(() =>
      axios.post(
        process.env.REACT_APP_SERVER_URI + constants.REQUEST_ROOM_DETAIL,
        {
          roomId: payload._id,
        },
        {
          withCredentials: true,
        }
      )
    );

    if (response.data.message) {
      yield put(
        roomSliceActions.getCurrentRoomInfoFailure(response.data.message)
      );
      return;
    }

    if (response.data.room.users.length < 4) {
      yield put(roomSliceActions.getCurrentRoomInfoSuccess());
      yield put(
        roomSliceActions.joinUser({
          currentUser: payload.currentUser,
          currentRoom: payload._id,
        })
      );
      yield put(
        roomSliceActions.saveInfo({
          title: response.data.room.title,
          users: response.data.room.users,
          room_no: response.data.room.room_no,
          _id: response.data.room._id,
        })
      );
      history.push(`/room/${response.data.room._id}`);
    } else {
      yield put(roomSliceActions.changeIsShowModal());
    }
  } catch (error) {
    yield put(roomSliceActions.getCurrentRoomInfoFailure(error));
  }
};

export function* watchJoinUser() {
  yield takeEvery(roomSliceActions.joinUser, joinUserSaga);
}

export function* watchDelteUser() {
  yield takeEvery(roomSliceActions.deleteUser, deleteUserSaga);
}

export function* watchCreateRoom() {
  yield takeEvery(roomSliceActions.createRoomRequest, createRoomSaga);
}

export function* watchGetCurrentRoomInfo() {
  yield takeEvery(roomSliceActions.getCurrentRoomInfo, getCurrentRoomInfoSaga);
}
