import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";

import Header from "../../common/components/Header";
import { useCharacter } from "../../common/hooks/useCharacter";
import constants from "../../common/utils/constants";
import createKey from "../../common/utils/createKey";
import { socketCharacterApi } from "../../modules/api/socketApi";
import { roomListSliceActions } from "../../modules/slice/roomListSlice";
import { roomSliceActions } from "../../modules/slice/roomSlice";
import Character from "./Character";
import mapSpots from "./resource/mapSpot";

const Room = () => {
  const char = useCharacter();
  const [moveCount, setMoveCount] = useState(0);
  const roomInfo = useSelector((state) => state.room.info);
  const characters = useSelector((state) => state.character.characters);
  const error = useSelector((state) => state.room.error);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentUser = useSelector((state) => state.auth.user);
  const chairPosition = useSelector((state) => state.character.chairPosition);
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [moveCount]);

  useEffect(() => {
    if (error) {
      history.push(constants.ROUTE_ERROR);
    }

    if (!isLoggedIn) {
      history.push(constants.ROUTE_MAIN);
    }

    if (char.isChatting) {
      socketCharacterApi.enterChattingRoom(
        char.chairZone,
        char.x,
        char.y,
        params.roomId
      );

      history.push({
        pathname: `/video/${params.roomId}`,
        state: { position: char.chairZone },
      });
    }
  }, [error, isLoggedIn, char.isChatting]);

  useEffect(() => {
    if (chairPosition) {
      chairPosition.forEach((position) => {
        if (position.inToRoom) {
          mapSpots[position.y - 1][position.x] = 0;
          mapSpots[position.y][position.x - 1] = 0;
          mapSpots[position.y][position.x + 1] = 0;
          mapSpots[position.y + 1][position.x] = 0;
        } else {
          mapSpots[position.y - 1][position.x] = 1;
          mapSpots[position.y][position.x - 1] = 1;
          mapSpots[position.y][position.x + 1] = 1;
          mapSpots[position.y + 1][position.x] = 1;
        }
      });
    }
  }, [chairPosition]);

  useEffect(() => {
    socketCharacterApi.changeCurrentCharacter(
      char.x,
      char.y,
      char.side,
      moveCount,
      char.isChatting
    );
  }, [moveCount, char.side, char.x, char.y, char.isChatting]);

  const handleRoomsPage = () => {
    dispatch(
      roomSliceActions.deleteUser({
        currentUser: currentUser._id,
        currentRoom: params.roomId,
      })
    );

    dispatch(roomSliceActions.init());
    dispatch(roomListSliceActions.getRooms());
    socketCharacterApi.exitUser();

    history.push("/");
  };

  const handleKeyDown = (e) => {
    switch (e.code) {
      case "KeyA":
      case "ArrowLeft":
        setMoveCount(moveCount + 1);
        if (moveCount === 2) {
          setMoveCount(0);
        }
        char.moveLeft();

        break;
      case "KeyW":
      case "ArrowUp":
        setMoveCount(moveCount + 1);
        if (moveCount === 2) {
          setMoveCount(0);
        }
        char.moveUp();

        break;
      case "KeyD":
      case "ArrowRight":
        setMoveCount(moveCount + 1);
        if (moveCount === 2) {
          setMoveCount(0);
        }
        char.moveRight();

        break;
      case "KeyS":
      case "ArrowDown":
        setMoveCount(moveCount + 1);
        if (moveCount === 2) {
          setMoveCount(0);
        }
        char.moveDown();

        break;
    }
  };

  return (
    <>
      <Main>
        <Header
          title={roomInfo ? roomInfo.title : false}
          text="방 리스트로 가기"
          leftOnClick={handleRoomsPage}
        />
        <MapWrapper>
          <Map>
            {characters.map((character) => {
              return (
                <Character
                  key={createKey()}
                  count={character.moveCount}
                  isChatting={character.isChatting}
                  x={character.x}
                  y={character.y}
                  side={character.side}
                  name={character.name}
                  type={character.type}
                  profile={character.profile}
                />
              );
            })}
          </Map>
        </MapWrapper>
      </Main>
    </>
  );
};

const Main = styled.main`
  position: relative;
  height: 100%;
  background: var(--light-gray-color);
`;

const MapWrapper = styled.section`
  position: relative;
  height: 800px;
`;

const Map = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1350px;
  height: 480px;
  margin: 0 auto;
  padding: 70px 50px;
  border-radius: 20px;
  background: url(/assets/pixelArt-bg.png) no-repeat center/cover;
  text-align: center;
  box-shadow: 1px 1px 10px 1px #756f6f;
`;

export default Room;
