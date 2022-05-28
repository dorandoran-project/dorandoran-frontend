import React from "react";

import PropTypes from "prop-types";
import styled from "styled-components";

import constants from "../utils/constants";
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
      <Button
        data-testid={constants.SIZE_M}
        text={text ? text : null}
        size={constants.SIZE_M}
        onClick={leftOnClick}
      />
      <RoomInfo>
        <Button
          type={type}
          text="새로고침"
          size={size}
          onClick={centerOnClick}
        />
        <Title>{title ? title : false}</Title>
      </RoomInfo>
      <LogoutButton onClick={rightOnClick} />
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 115px;
`;

const Title = styled.h1`
  padding: 0 5px;
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

Header.propTypes = {
  leftOnClick: PropTypes.func.isRequired,
  centerOnClick: PropTypes.func,
  rightOnClick: PropTypes.func,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  size: PropTypes.string,
  type: PropTypes.string,
};

export default Header;
