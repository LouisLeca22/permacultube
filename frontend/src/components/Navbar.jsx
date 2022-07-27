import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from "react-router-dom";
import {leave} from '../redux/apiCalls';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import Upload from './Upload';

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 56px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 20px;
  position: relative;
  @media (max-width: 820px){
    justify-content: flex-start
    
  }
`;

const Search = styled.div`
  width: 40%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #fff;
  border-radius: 3px;
  @media (max-width: 820px){
    left: 10%;
    
  }
`;

const Input = styled.input`
  border: none;
  font-size: 1.3rem;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
  transition: padding 0.2s ease;
  padding-left: .7rem;
  ::placeholder{
    color: ${({ theme }) => theme.text};
  }


`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.deep};;
  color: ${({ theme }) => theme.deep};;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;

`;


const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
`;

const Logout = styled.span`
  display: flex;
  align-items: center;
  gap: 10%;
  margin-right: .5rem;
  cursor: pointer;
  &:hover{
  color: ${({ theme }) => theme.bg};
  }
`

const Navbar = () => {
  const {currentUser} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const navigate = useNavigate()
  const handleSearch =  () => {
    if(query.length > 3){
      navigate(`/search`, {state: {query}})
    }
  }
 
  return (
    <>

 
    <Container>
      <Wrapper>
        <Search>
          <Input placeholder="Rechercher" onChange={(e) => setQuery(e.target.value)}/>
          <SearchOutlinedIcon style={{cursor: "pointer"}} onClick={handleSearch} />
        </Search>
        {currentUser ? (
          <User>
          Bonjour {currentUser.name}
             {currentUser.image && <Avatar src={currentUser.image} />}
             <ControlPointIcon style={{cursor: "pointer"}} onClick={() => setOpen(true)} />
            <Logout onClick={() => leave(dispatch)}>
            <LogoutIcon /> 
            Déconnexion
          </Logout>
          </User>
        ): (
          <Link to="signin" style={{ textDecoration: "none" }}>
          <Button>
            <AccountCircleOutlinedIcon />
            CONNEXION
          </Button>
        </Link>
        )}
      </Wrapper>
    </Container>
    {open && <Upload setOpen={setOpen} />}
    </>   
  );
};

export default Navbar;