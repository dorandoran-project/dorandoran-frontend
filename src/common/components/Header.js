import React from "react";

import styled from "styled-components";

import Button from "./Button";
import LogoutButton from "./LogoutButton";

const Header = ({
  leftOnClick,
  centerOnClick,
  rightOnClick,
  title,
  text,
  size,
  type,
}) => {
  return (
    <HeaderContainer>
      <Button text={text ? text : null} size="medium" onClick={leftOnClick} />
      <RoomInfo>
        <Button
          type={type}
          text="새로고침"
          size={size}
          onClick={centerOnClick}
        />
        <Title>{title ? title : null}</Title>
      </RoomInfo>
      <LogoutButton text="로그아웃" onClick={rightOnClick} />
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  height: 10%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Title = styled.h1`
  padding: 0 6px;
  border-bottom: 3px solid var(--scarlet-color);
`;

const RoomInfo = styled.div`
  position: relative;

  h1 {
    margin-right: 20px;
  }

  button {
    position: absolute;
    left: -90px;
    top: 10px;
  }
`;

export default Header;
