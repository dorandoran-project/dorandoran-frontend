import axios from "axios";
import { call, takeEvery, put, takeLatest } from "redux-saga/effects";

import constants from "../../common/utils/constants";
import { roomListSliceActions } from "../slice/roomListSlice";

const getRoomSaga = function* () {
  try {
    const response = yield call(() =>
      axios.get(
        process.env.REACT_APP_SERVER_URI + constants.REQUEST_ROOMLIST_ROOM,
        {
          withCredentials: true,
        }
      )
    );

    if (response.data.message) {
      yield put(roomListSliceActions.getRoomFailure(response.data.message));
      return;
    }

    yield put(roomListSliceActions.getRoomsSuccess(response.data.rooms));
  } catch (error) {
    yield put(roomListSliceActions.getRoomFailure(error));
  }
};

const getNextRoomSaga = function* ({ payload }) {
  try {
    const lastRoom = payload[payload.length - 1];
    const response = yield call(() =>
      axios.post(
        process.env.REACT_APP_SERVER_URI + constants.REQUEST_ROOMLIST_ROOM,
        {
          lastRoom,
          direction: "next",
        },
        {
          withCredentials: true,
        }
      )
    );

    if (response.data.message) {
      yield put(roomListSliceActions.getRoomFailure(response.data));
      return;
    }

    yield put(roomListSliceActions.getRoomsSuccess(response.data.rooms));
  } catch (error) {
    yield put(roomListSliceActions.getRoomFailure(error));
  }
};

const getPrevRoomSaga = function* ({ payload }) {
  try {
    const lastRoom = payload[payload.length - 1];
    const response = yield call(() =>
      axios.post(
        process.env.REACT_APP_SERVER_URI + constants.REQUEST_ROOMLIST_ROOM,
        {
          lastRoom,
          direction: "prev",
        },
        {
          withCredentials: true,
        }
      )
    );

    if (response.data.message) {
      yield put(roomListSliceActions.getRoomFailure(response));
      return;
    }

    yield put(roomListSliceActions.getRoomsSuccess(response.data.rooms));
  } catch (error) {
    yield put(roomListSliceActions.getRoomFailure(error));
  }
};

const getRefreshRoomSaga = function* ({ payload }) {
  try {
    const response = yield call(() =>
      axios.post(
        process.env.REACT_APP_SERVER_URI + constants.REQUEST_ROOMLIST_REFRESH,
        {
          roomList: payload,
        },
        {
          withCredentials: true,
        }
      )
    );

    if (response.data.message) {
      yield put(roomListSliceActions.getRoomFailure(response));
      return;
    }

    yield put(roomListSliceActions.getRoomsSuccess(response.data.rooms));
  } catch (error) {
    yield put(roomListSliceActions.getRoomFailure(error));
  }
};

export function* watchInitRooms() {
  yield takeLatest(roomListSliceActions.getRooms, getRoomSaga);
}

export function* watchNextRooms() {
  yield takeEvery(roomListSliceActions.getNextRooms, getNextRoomSaga);
}

export function* watchPrevRooms() {
  yield takeEvery(roomListSliceActions.getPrevRooms, getPrevRoomSaga);
}

export function* watchFreshRooms() {
  yield takeEvery(roomListSliceActions.getFreshRooms, getRefreshRoomSaga);
}
