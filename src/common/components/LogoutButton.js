import React from "react";

import PropTypes from "prop-types";
import styled from "styled-components";

const LogoutButton = ({ onClick }) => {
  return <Logout onClick={onClick}>로그아웃</Logout>;
};

const Logout = styled.button`
  width: 95px;
  border-radius: 0;
  border-bottom: 2px solid var(--black-color);
  background: url("/assets/logout.svg") no-repeat 0% 45%;
  visibility: ${(props) => (props.onClick ? "visible" : "hidden")};
  font-size: 20px;
  text-align: right;
  font-weight: bold;

  &:hover {
    border-bottom: 2px solid var(--scarlet-color);
    background: url("/assets/scarletLogout.svg") no-repeat 0% 45%;
    color: var(--scarlet-color);
    transition: all 0.25s ease-out;
  }
`;

LogoutButton.propTypes = {
  onClick: PropTypes.func,
};

export default LogoutButton;
