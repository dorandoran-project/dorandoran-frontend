import { all } from "redux-saga/effects";

import {
  watchLogin,
  watchLogout,
  watchCookieClearSaga,
} from "../modules/saga/authSaga";
import {
  watchInitRooms,
  watchNextRooms,
  watchPrevRooms,
  watchFreshRooms,
} from "../modules/saga/roomListSaga";
import {
  watchJoinUser,
  watchDelteUser,
  watchCreateRoom,
  watchGetCurrentRoomInfo,
} from "../modules/saga/roomSaga";
import {
  watchSocketCharacterSaga,
  watchSocketVideoSaga,
} from "../modules/saga/socketSaga";

export default function* rootSaga() {
  yield all([
    watchLogin(),
    watchLogout(),
    watchInitRooms(),
    watchNextRooms(),
    watchPrevRooms(),
    watchFreshRooms(),
    watchCreateRoom(),
    watchCookieClearSaga(),
    watchJoinUser(),
    watchDelteUser(),
    watchSocketCharacterSaga(),
    watchSocketVideoSaga(),
    watchGetCurrentRoomInfo(),
  ]);
}
