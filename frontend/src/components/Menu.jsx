import React, { useEffect, useState } from "react";
import styled from "styled-components";
import YouTubeIcon from '@mui/icons-material/YouTube';
import HomeIcon from "@mui/icons-material/Home";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import { Link } from "react-router-dom";
import { useSelector, useDispatch} from 'react-redux';

import { leave } from '../redux/apiCalls';
const Container = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 100vh;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  position: sticky;
  top: 0;
  overflow: scroll;
  @media (max-width: 820px) {
    display: none;
  }
`;
const Wrapper = styled.div`
  padding: 10px 26px;
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  margin-bottom: 25px;
  font-size: 1.3rem;
  font-weight: bold;
  color: ${({ theme }) => theme.deep};
`;


const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 0px;
  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Login = styled.div``;
const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.deep}; ;
  color: ${({ theme }) => theme.deep};;
  border-radius: 3px;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Title = styled.h2`
  font-size: 14px;
  letter-spacing: .2rem;
  text-transform: uppercase;
  font-weight: 500;
  color: ${({ theme }) => theme.text};;
  margin-bottom: 20px;
`;

const Menu = ({ darkMode, setDarkMode }) => {
  
  const {currentUser} = useSelector(state => state.user)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
      if(currentUser){
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
  }, [currentUser])

  const dispatch = useDispatch()

  return (
    <Container>
      <Wrapper>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Logo>
            <YouTubeIcon style={{fontSize: 40}}/>
            PermaCultube
          </Logo>
        </Link>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <Item>
          <HomeIcon />
          Accueil
        </Item>
        </Link>
        <Link to="/trends" style={{ textDecoration: "none", color: "inherit" }}>
        <Item>
          <ExploreOutlinedIcon />
          Tendances
        </Item>
        </Link>
        <Link to="/subscriptions" style={{ textDecoration: "none", color: "inherit" }}>
        {isLoggedIn &&  <Item>
          <SubscriptionsOutlinedIcon />
          Abonnements
        </Item>}
        </Link>
        <Hr />
        <Title>Top catégories</Title>
        <Link to="/tags" state={{tag: "conseils"}} style={{ textDecoration: "none", color: "inherit" }}>
        <Item>
          <LibraryMusicOutlinedIcon />
          Conseils
        </Item>
        </Link>
        <Link to="/tags" state={{tag: "maraichage"}} style={{ textDecoration: "none", color: "inherit" }}>
        <Item>
          <SportsBasketballOutlinedIcon />
          Maraichage
        </Item>
        </Link>
        <Link to="/tags" state={{tag: "bio"}} style={{ textDecoration: "none", color: "inherit" }}>
        <Item>
          <SportsEsportsOutlinedIcon />
          Bio
        </Item>
        </Link>
        <Link to="/tags" state={{tag: "agriculture"}} style={{ textDecoration: "none", color: "inherit" }}>
        <Item>
          <MovieOutlinedIcon />
          Agriculture
        </Item>
        </Link>
        <Link to="/tags" state={{tag: "tradition"}} style={{ textDecoration: "none", color: "inherit" }}>
        <Item>
          <LiveTvOutlinedIcon />
          Tradition
        </Item>
        </Link>
        <Hr />
        {isLoggedIn ? (
            <Login>
              <Button onClick={() => leave(dispatch)}>
              <LogoutIcon /> 
                Déconnexion 
              </Button>
            </Login>
        ) : (
          <Login>
          Connectez vous pour liker et commenter des vidéos.
          <Link to="signin" style={{textDecoration:"none"}}>
            <Button>
              <AccountCircleOutlinedIcon />
              CONNEXION
            </Button>
          </Link>
        </Login>
        )} 
     
        <Hr />
        <Item onClick={() => {
          setDarkMode(!darkMode)
          if(darkMode){
          localStorage.setItem("mode", "light")
          } else {
            localStorage.setItem("mode", "dark")
          }
          }}>
          <SettingsBrightnessOutlinedIcon />
          {darkMode ? "Light" : "Dark"} Mode
        </Item>
      </Wrapper>
    </Container>
  );
};

export default Menu;