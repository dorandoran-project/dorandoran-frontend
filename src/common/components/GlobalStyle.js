import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    --scarlet-color: #FD8C61;
    --orange-color: #FDA560;
    --white-color: #FFFFFF;
    --black-color: #1A1A1A;
    --dark-gray-color: #ECEDF2;
    --gray-color: #F6F8F9;
    --dark-grey-shadow-color: #BCBCBC;
    --light-grey-shadow-color: #0000001a;
    --dark-orange-color: #FC903D;
  }

  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');

  * {
    margin: 0;
    padding: 0;
    background: none;
    border: none;
    color: #3c4043;
    font-family: 'Noto Sans', sans-serif;
  }

  html, body {
    width: 100%;
    height: 100%;
  }

  h1,
  h2 {
    font-weight: 500;
  }

  button {
    cursor: pointer;
  }

  li {
    list-style: none;
  }

  a {
    color: #000;
    text-decoration: none;
  }

  img {
    width: 100%;
    border: 0;
    vertical-align: middle;
  }
`;
export default GlobalStyle;
