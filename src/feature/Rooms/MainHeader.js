import React from "react";
import styled from "styled-components";
import Button from "../../common/components/Button";

const MainHeader = () => {
  return (
    <HeaderContainer>
      <Button text="방 만들기" size="medium" />
      <RoomInfo>
        <Button text="새로고침" size="small" />
        <h1>강남구 대치노인정</h1>
      </RoomInfo>
      <Button text="로그아웃" size="large" login={true} />
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-around;
  padding: 30px 0;
`;

const RoomInfo = styled.div`
  display: flex;

  h1 {
    margin: 0 10px;
  }
`;

export default MainHeader;
