import React, { useEffect, useRef } from "react";

import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import Button from "../../common/components/Button";
import Modal from "../../common/components/modal/Modal";
import { useCharacter } from "../../common/hooks/useCharacter";
import constants from "../../common/utils/constants";
import { makeRandomRoomName } from "../../common/utils/makeRoomResource";
import { socketCharacterApi } from "../../modules/api/socketApi";
import { roomSliceActions } from "../../modules/slice/roomSlice";

const RoomCreate = ({ isShow, handleModalShowChange }) => {
  const char = useCharacter();
  const user = useSelector((state) => state.auth.user);
  const roomInfo = useSelector((state) => state.room.info);
  const isComplete = useSelector((state) => state.room.isComplete);
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const roomNameRef = useRef();

  useEffect(() => {
    if (isComplete && roomInfo) {
      history.push(`/room/${roomInfo._id}`);

      dispatch(roomSliceActions.changeIsCompleted());

      socketCharacterApi.enterRoom({
        roomId: roomInfo._id,
        x: char.x,
        y: char.y,
        type: constants.ASSET_CHARACTERS,
        side: char.side,
        isChatting: char.isChatting,
        name: currentUser.name,
        gender: currentUser.gender,
        profile: currentUser.profile,
      });
    }
  }, [isComplete]);

  const handleCreateButton = () => {
    const roomData = {
      roomCreator: user,
      roomTitle: roomNameRef.current.textContent,
    };

    dispatch(roomSliceActions.createRoomRequest(roomData));

    handleModalShowChange();
  };

  return (
    <>
      {isShow && (
        <Modal>
          <RoomCreateWrapper>
            <ImageWrapeer>
              <img src={constants.ASSET_THINK} alt="말 풍선 이미지" />
            </ImageWrapeer>
            <h1 className="title">방 만들기</h1>
            <h1 className="roomName">
              <p className="subject">방제목</p>
              <p className="userSubject" ref={roomNameRef}>
                {`${user.name}${makeRandomRoomName()}`}
              </p>
            </h1>
            <h1 className="roomDescription">최대 인원은 4명 입니다!</h1>
            <Button
              text="취소"
              size="medium"
              type="color"
              onClick={handleModalShowChange}
            />
            <Button
              text="방만들기"
              size="medium"
              onClick={handleCreateButton}
            />
          </RoomCreateWrapper>
        </Modal>
      )}
    </>
  );
};

const RoomCreateWrapper = styled.div`
  width: 100%;
  height: 70%;
  text-align: center;

  .title {
    width: 30%;
    margin: auto;
    margin-bottom: 80px;
    border-bottom: 8px solid var(--orange-color);
    border-radius: 10px;
    font-size: 45px;
    font-weight: 600;
  }

  .roomName {
    display: flex;
    justify-content: center;
    margin-bottom: 60px;

    .subject {
      width: 10%;
      margin-right: 50px;
      padding: 10px;
      border-radius: 50px;
      background: var(--orange-color);
      color: var(--white-color);
      font-size: 25px;
    }

    .userSubject {
      width: 40%;
      border-bottom: 3px solid var(--light-gray-color);
      font-weight: 400;
    }
  }

  .roomDescription {
    margin-bottom: 35px;
    color: var(--dark-gray-color);
    font-size: 25px;
  }

  button {
    width: 150px;
    height: 50px;
    margin-left: 20px;
    margin-right: 20px;
    border-radius: 40px;
    background: var(--orange-color);
    color: var(--white-color);
    font-size: 20px;
  }
`;

const ImageWrapeer = styled.div`
  width: 70px;
  height: 50px;
  margin: auto;
  margin-bottom: 30px;
`;

RoomCreate.propTypes = {
  isShow: PropTypes.bool.isRequired,
  handleModalShowChange: PropTypes.func.isRequired,
};

export default RoomCreate;
