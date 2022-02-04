import React from "react";
import ChatRoomList from "../Rooms/ChatRoomList";
import Header from "../../common/components/Header";
import styled from "styled-components";
import Room from "../Rooms/Room";
import Button from "../../common/components/Button";

const Rooms = () => {
  return (
    <Entry>
      <Header />
      <MainBody>
        <Button type="direction" img="prev" />
        <ChatRoomList />
        <Button type="direction" img="next" />
      </MainBody>
      <Room />
    </Entry>
  );
};

const Entry = styled.main`
  width: 100vw;
  height: 100vh;
  padding: 5% 0;
  background-color: #f6f8f9;
`;

const MainBody = styled.section`
  display: flex;
  justify-content: space-around;
  width: 100%;
  align-items: center;
`;

export default Rooms;
