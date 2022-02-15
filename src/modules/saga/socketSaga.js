import { eventChannel } from "redux-saga";
import { take, call, put } from "redux-saga/effects";
import io from "socket.io-client";

import { characterSliceActions } from "../slice/characterSlice";

export const socketCharacter = io("http://localhost:4000/character", {
  withCredentials: true,
});

export const socketVideo = io("http://localhost:4000/video", {
  withCredentials: true,
});

const createSocketCharacterChannel = (socketCharacter) => {
  return eventChannel((emit) => {
    socketCharacter.on("setCharacters", (character) => {
      emit(characterSliceActions.charactersInRoom(character));
    });

    socketCharacter.on("setChairPosition", (chairPosition) => {
      emit(characterSliceActions.doNotComeChair(chairPosition));
    });

    socketCharacter.on("setCurrentUserPosition", (userPosition) => {
      emit(characterSliceActions.doNotComeChair(userPosition));
    });
    return () => {
      socketCharacter.off("setCharacters");
      socketCharacter.off("setChairPosition");
      socketCharacter.off("setCurrentUserPosition");
    };
  });
};

export const watchSocketCharacterSaga = function* () {
  const channel = yield call(createSocketCharacterChannel, socketCharacter);

  while (true) {
    const action = yield take(channel);

    yield put(action);
  }
};
