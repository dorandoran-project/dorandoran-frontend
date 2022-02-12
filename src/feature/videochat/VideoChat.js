import React, { useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";

import Header from "../../common/components/Header";
import mapSpots from "../../common/utils/mapSpot";
import { socketVideoApi } from "../../modules/api/socketApi";
import { authSliceActions } from "../../modules/slice/authSlice";
import { roomSliceActions } from "../../modules/slice/roomSlice";
import { videoSliceActions } from "../../modules/slice/videoSlice";

const VideoChat = () => {
  const error = useSelector((state) => state.room.error);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const seatPosition = useSelector((state) => state.auth.seatPosition);
  const currentUser = useSelector((state) => state.auth.user);
  const roomInfo = useSelector((state) => state.room.info);

  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();

  const myVideoRef = useRef(null);
  const myStream = useRef(null);
  const myPeerConnectionInstance = useRef(null);

  const isEnter = useSelector((state) => state.video.isEnter);
  const isOffer = useSelector((state) => state.video.isOffer);
  const isAnswer = useSelector((state) => state.video.isAnswer);
  const isIce = useSelector((state) => state.video.isIce);
  const remoteIds = useSelector((state) => state.video.remoteIds);
  const iceCandidate = useSelector((state) => state.video.iceCandidate);

  const receiveOffer = useSelector((state) => state.video.offer);
  const receiveAnswer = useSelector((state) => state.video.answer);

  useEffect(() => {
    if (error) {
      history.push("/error");
    }

    if (!isLoggedIn) {
      history.push("/");
    }
  }, [error, isLoggedIn]);

  const handleRoomPage = () => {
    seatPosition.forEach((point) => {
      mapSpots[point[0]][point[1]] = 1;
    });

    history.push(`/room/${params.roomId}`);
  };

  const handleLogout = () => {
    seatPosition.forEach((point) => {
      mapSpots[point[0]][point[1]] = 1;
    });

    window.Kakao.API.request({
      url: "/v1/user/unlink",
      success: function () {
        dispatch(
          roomSliceActions.deleteUser({
            currentUser: currentUser._id,
            currentRoom: params.roomId,
          })
        );

        dispatch(authSliceActions.logoutRequest());
      },
    });
  };
  const handleIce = (data) => {
    console.log("ice", data.candidate);
    socketVideoApi.ice(params.roomId, data.candidate);
  };

  const handleAddTrack = (data) => {
    console.log("got an stream from my peer");
    console.log("Peer's stream", data.stream);
    console.log("My stream", myStream.current);
  };

  const makeConnection = (stream) => {
    if (!myPeerConnectionInstance.current) {
      const myPeerConnection = new RTCPeerConnection();
      myPeerConnectionInstance.current = myPeerConnection;
    }

    myPeerConnectionInstance.current.addEventListener(
      "icecandidate",
      handleIce
    );
    myPeerConnectionInstance.current.addEventListener("track", handleAddTrack);

    stream
      .getTracks()
      .forEach((track) =>
        myPeerConnectionInstance.current.addTrack(track, stream)
      );
  };

  const getMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    myVideoRef.current.srcObject = stream;
    myStream.current = stream;
    makeConnection(stream);
  };

  const makeOffer = async () => {
    if (!myPeerConnectionInstance.current) {
      const myPeerConnection = new RTCPeerConnection();
      myPeerConnectionInstance.current = myPeerConnection;
    }

    const offer = await myPeerConnectionInstance.current.createOffer();
    myPeerConnectionInstance.current.setLocalDescription(offer);

    console.log("sent the offer");
    dispatch(videoSliceActions.changeIsEnter());

    socketVideoApi.offer(params.roomId, offer);
  };

  const makeAnswer = async () => {
    if (!myPeerConnectionInstance.current) {
      const myPeerConnection = new RTCPeerConnection();
      myPeerConnectionInstance.current = myPeerConnection;
    }

    console.log("received the offer");
    myPeerConnectionInstance.current.setRemoteDescription(receiveOffer);
    const answer = await myPeerConnectionInstance.current.createAnswer();
    myPeerConnectionInstance.current.setLocalDescription(answer);
    socketVideoApi.answer(params.roomId, answer);
    dispatch(videoSliceActions.changeIsOffer());

    console.log("sent the answer");
  };

  const completeLocalAndRemoteDescription = async () => {
    if (!myPeerConnectionInstance.current) {
      const myPeerConnection = new RTCPeerConnection();
      myPeerConnectionInstance.current = myPeerConnection;
    }

    console.log("receive the answer");
    myPeerConnectionInstance.current.setRemoteDescription(receiveAnswer);
    // dispatch(videoSliceActions.changeIsAnswer());
  };

  useEffect(() => {
    getMedia();
    socketVideoApi.enterRoom(params.roomId);
  }, []);

  useEffect(() => {
    if (isEnter) {
      makeOffer();
    }
  }, [isEnter]);

  useEffect(() => {
    if (isOffer) {
      makeAnswer();
    }
  }, [isOffer]);

  useEffect(() => {
    if (isAnswer || receiveAnswer) {
      completeLocalAndRemoteDescription();
    }
  }, [isAnswer, receiveAnswer]);

  useEffect(() => {
    if (iceCandidate || isIce) {
      myPeerConnectionInstance.current.addIceCandidate(iceCandidate);
      dispatch(videoSliceActions.changeIsIce());
    }
  }, [iceCandidate, isIce]);

  return (
    <>
      <h1>{remoteIds.length === 0 ? false : remoteIds}</h1>
      <VideoChatContainer>
        <Header
          leftOnClick={handleRoomPage}
          rightOnClick={handleLogout}
          text="방 으로 가기"
          title={roomInfo ? roomInfo.title : false}
        />
        <VideoWrapper>
          <VideoBox>
            <video autoPlay playsInline ref={myVideoRef} />
            <UserName>나</UserName>
          </VideoBox>
          {/* <VideoBox>
            <video
              className="remotePeer"
              autoPlay
              playsInline
              ref={remoteVideoRef1}
            />
            <UserName>상대방- 1</UserName>
          </VideoBox>
          <VideoBox>
            <video
              className="remotePeer"
              autoPlay
              playsInline
              ref={remoteVideoRef2}
            />
            <UserName>상대방 -2</UserName>
          </VideoBox>
          <VideoBox>
            <video
              className="remotePeer"
              autoPlay
              playsInline
              ref={remoteVideoRef3}
            />
            <UserName>상대방 -3</UserName>
          </VideoBox> */}
        </VideoWrapper>
        <EmojiWrapper>
          <EmojiButton />
          <EmojiButton />
          <EmojiButton />
          <EmojiButton />
          <EmojiButton />
          <EmojiButton />
          <EmojiButton />
          <EmojiButton />
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
  grid-template-columns: repeat(2, minmax(600px, auto));
  grid-template-rows: repeat(2, minmax(400px, auto));
  gap: 20px;
  width: 1200px;
  margin: auto;
`;

const VideoBox = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  video {
    width: 600px;
    height: 400px;
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
  bottom: 30px;
  left: 30px;
  padding: 5px 15px;
  border-radius: 15px;
  background: var(--orange-color);
  color: var(--white-color);
`;

const EmojiWrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  margin: auto;
  background: var(--dark-gray-color);
`;

const EmojiButton = styled.button`
  width: 70px;
  height: 70px;
  margin-left: 45px;
  margin-right: 45px;
  border: 2px solid var(--dark-gray-color);
  border-radius: 15%;
  background: var(--dark-grey-shadow-color);
`;

export default VideoChat;
