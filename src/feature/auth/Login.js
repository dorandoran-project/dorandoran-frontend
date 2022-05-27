import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import constants from "../../common/utils/constants";
import kakaoApi from "../../modules/api/kakaoApi";
import { authSliceActions } from "../../modules/slice/authSlice";

const Login = () => {
  const [address, setAddress] = useState("");
  const [isAddress, setIsAddress] = useState(true);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const kakaoError = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();
  const history = useHistory();
  const scope = constants.KAKAO_SCOPE;

  useEffect(() => {
    kakaoApi.getUserLocation(setAddress, setIsAddress);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      history.push(constants.ROUTE_MAIN);
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    dispatch(authSliceActions.cookieClear());
    window.Kakao.Auth.login({
      scope,
      success: async (response) => {
        window.Kakao.Auth.setAccessToken(response.access_token);
        window.Kakao.API.request({
          url: "/v2/user/me",
          success: (response) => {
            dispatch(
              authSliceActions.loginRequest({
                email: response.kakao_account.email,
                age_range: response.kakao_account.age_range,
                gender: response.kakao_account.gender,
                name: response.kakao_account.profile.nickname,
                profile: response.kakao_account.profile.profile_image_url,
                current_address: address,
              })
            );
          },
        });
      },
    });
  };

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(constants.KAKAO_SDK_KEY);
  }

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <>
      <Main>
        <Section>
          <Title>
            도란
            <LogoImage>
              <img data-testid="img" src={constants.ASSET_LOGO} alt="logo" />
            </LogoImage>
            도란
          </Title>
          <SubTitle>우리동네 어르신들의 화상 채팅 방</SubTitle>
          <TitleImg>
            <img
              src={constants.ASSET_LOGIN_BACKGROUND}
              alt="할머니 할아버지가 즐겁게 달리는 이미지"
            />
          </TitleImg>
          {!isAddress && (
            <LocationErrorWrap>
              <p>
                현재 위치를 알 수 없습니다. <br /> 새로고침 해보시겠어요?
              </p>
              <RefreshButton onClick={handleReload}>새로고침</RefreshButton>
            </LocationErrorWrap>
          )}

          {!address && isAddress && <p>사용자의 위치를 불러오고 있습니다..</p>}
          {address && (
            <Button onClick={handleLogin}>
              <img src={constants.ASSET_LOGIN_BUTTON} alt="kakao login image" />
            </Button>
          )}
          {kakaoError && (
            <KakaoError>
              카카오 계정에 이메일, 성별, 연령대 정보가 등록되어 있는지 확인 후
              다시 시도 해주세요.
            </KakaoError>
          )}
        </Section>
      </Main>
    </>
  );
};

const Main = styled.main`
  position: relative;
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--scarlet-color) 0%,
    var(--orange-color) 100%
  );
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  margin: 0 auto;
  padding: 70px 50px;
  border-radius: 20px;
  background-color: #fff;
  text-align: center;
  box-shadow: 1px 1px 18px 4px #c87247;
`;

const Title = styled.h2`
  margin-bottom: 10px;
  color: var(--orange-color);
  font-size: 50px;
  font-weight: bold;
`;

const SubTitle = styled.p`
  margin-bottom: 30px;
  font-size: 20px;
`;

const LogoImage = styled.span`
  display: inline-block;
  width: 50px;

  img {
    vertical-align: top;
  }
`;

const TitleImg = styled.div`
  width: 40%;
  margin-bottom: 30px;
`;

const LocationErrorWrap = styled.div`
  width: 200px;
`;

const Button = styled.button`
  width: 200px;
`;

const RefreshButton = styled.button`
  width: 200px;
  margin-top: 20px;
  padding: 10px 15px;
  border-radius: 30px;
  background-color: var(--dark-gray-color);
  font-size: 20px;

  .refreshImage {
    display: inline-block;
    width: 15px;
    margin-right: 5px;
    overflow: hidden;
    vertical-align: sub;
  }
`;

const KakaoError = styled.p`
  margin-top: 20px;
  color: #95a5a6;
  font-size: 20px;
`;

export default Login;
