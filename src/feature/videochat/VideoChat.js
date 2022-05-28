import React, { useEffect, useRef } from "react";

import { useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import Header from "../../common/components/Header";
import useConnection from "../../common/hooks/useConnection";
import constants from "../../common/utils/constants";
import createKey from "../../common/utils/createKey";
import { makeEmoticons } from "../../common/utils/makeRoomResource";
import {
  socketVideoApi,
  socketCharacterApi,
} from "../../modules/api/socketApi";
import Video from "./Video";

const VideoChat = () => {
  const error = useSelector((state) => state.room.error);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentUser = useSelector((state) => state.auth.user);
  const roomInfo = useSelector((state) => state.room.info);
  const event = useSelector((state) => state.video.event);
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const getPositionParams = location.state.position;
  const effectRef = useRef();
  const effectWrapperRef = useRef();
  const otherEffect = useRef();
  const otherEffectWrapper = useRef();
  const emoticons = makeEmoticons();

  const { participants, peerList, myVideo } = useConnection(
    params.roomId,
    currentUser?.name
  );

  useEffect(() => {
    if (error || !currentUser) {
      history.push(constants.ROUTE_ERROR);
    }

    if (!isLoggedIn) {
      history.push(constants.ROUTE_MAIN);
    }
  }, [error, isLoggedIn, currentUser]);

  useEffect(() => {
    let index = false;

    for (let i = 0; i < peerList.length; i++) {
      if (peerList[i].id === event.sender) {
        index = i;
      }
    }

    if (index > -1 && index !== false) {
      otherEffectWrapper.current = document.getElementsByClassName(
        "other-effect-wrapeer"
      )[index];

      otherEffect.current =
        document.getElementsByClassName("other-effect")[index];

      otherEffectWrapper.current.hidden = false;

      setTimeout(() => {
        otherEffectWrapper.current.hidden = true;
      }, 3000);
    }
  }, [event]);

  const handleRoomPage = () => {
    stopStreamedVideo(myVideo.current);
    socketCharacterApi.exitChattingRoom(getPositionParams);

    history.push(`/room/${params.roomId}`);
  };

  const stopStreamedVideo = (videoEl) => {
    const stream = videoEl.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });

    videoEl.srcObject = null;
  };

  const handleEmoticonEffect = (event) => {
    effectRef.current.src = event.target.src;
    effectWrapperRef.current.hidden = false;

    setTimeout(() => {
      if (effectWrapperRef.current) {
        effectWrapperRef.current.hidden = true;
      }
    }, 3000);

    socketVideoApi.sendEvent({
      target: params.roomId,
      content: event.target.src,
    });
  };

  return (
    <>
      <VideoChatContainer>
        <Header
          leftOnClick={handleRoomPage}
          text="방 으로 가기"
          title={roomInfo ? roomInfo.title : false}
        />
        <VideoWrapper>
          <VideoBox>
            <video autoPlay playsInline muted ref={myVideo} />
            <UserName>{currentUser?.name}</UserName>
            <EffectWrapper hidden ref={effectWrapperRef}>
              <img ref={effectRef} />
            </EffectWrapper>
          </VideoBox>
          {peerList.map((connection) => {
            return (
              <VideoBox key={connection.id} data-user={connection.id}>
                <Video peerConnection={connection.peer} />
                <UserName>{participants[connection.id]}</UserName>
                <EffectWrapper className="other-effect-wrapeer" hidden>
                  <img className="other-effect" src={event.content} />
                </EffectWrapper>
              </VideoBox>
            );
          })}
        </VideoWrapper>
        <EmojiWrapper>
          {emoticons.map((emoticonObj) => {
            return (
              <EmojiButton key={createKey()} onClick={handleEmoticonEffect}>
                <img
                  src={emoticonObj.src}
                  alt={`${emoticonObj.type}`}
                  data-src={emoticonObj.src}
                />
              </EmojiButton>
            );
          })}
        </EmojiWrapper>
      </VideoChatContainer>
    </>
  );
};

const VideoChatContainer = styled.main`
  width: 100%;
  height: 100%;
  background: var(--light-gray-color);
`;

const VideoWrapper = styled.section`
  display: grid;
  justify-items: center;
  align-items: center;
  justify-content: space-evenly;
  align-content: space-evenly;
  grid-template-columns: repeat(2, minmax(500px, auto));
  grid-template-rows: repeat(2, minmax(300px, auto));
  gap: 20px;
  width: 1000px;
  height: 700px;
  margin: auto;
`;

const VideoBox = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  video {
    width: 500px;
    height: 300px;
    border: 2px solid var(--orange-color);
    border-radius: 20px;
    box-sizing: border-box;
    background: var(--white-color);
    box-shadow: 1px 1px 10px 1px var(--dark-grey-shadow-color);
    object-fit: cover;
  }
`;

const UserName = styled.span`
  position: absolute;
  bottom: 25px;
  left: 25px;
  padding: 5px 15px;
  border-radius: 15px;
  background: var(--orange-color);
  color: var(--white-color);
  font-size: 30px;
`;

const slide = keyframes`
  from {
      transform: scale(0.2) translateY(0) translateX(0);
  }
  to {
      transform: scale(1.0) translateY(-15px) translateX(-15px);
  }
`;

const EffectWrapper = styled.div`
  position: absolute;
  width: 70px;
  height: 70px;
  bottom: 15px;
  right: 15px;
  padding: 15px;
  border-radius: 15px;
  background: var(--white-color);
  box-shadow: 10px 1px 10px 1px #655e584d;
  animation-name: ${slide};
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation-fill-mode: both;
`;

const EmojiWrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1400px;
  height: 70px;
  margin: auto;
  background: var(--light-gray-color);
`;

const EmojiButton = styled.button`
  width: 70px;
  height: 70px;
  margin-left: 45px;
  margin-right: 45px;
  border-radius: 15%;
  background: var(--dark-grey-shadow-color);
  transition: all 0.2s;

  :hover {
    border: 5px solid var(--orange-color);
    background: var(--white-color);
  }
`;

export default VideoChat;
