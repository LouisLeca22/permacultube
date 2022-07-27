import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { login, register } from '../redux/apiCalls';
import { resetError, loginFailure, loginSuccess, loginStart } from '../redux/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formIn, setFormIn] = useState({
    email1: '',
    password1: '',
  });

  const [formUp, setFormUp] = useState({
    name: '',
    email2: '',
    password2: '',
  });

  const handleChangeIn = (e) => {
    setFormIn((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangeUp = (e) => {
    setFormUp((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    const { email1, password1 } = formIn;
    if (!email1 || !password1) {
      dispatch(loginFailure('Tous les champs doivent être remplis'));
      setTimeout(() => {
        dispatch(resetError());
      }, 2000);
      return;
    }
    const isEmail =
      /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email1);
    if (!isEmail) {
      dispatch(loginFailure("L'e-mail n'est pas valide"));
      setTimeout(() => {
        dispatch(resetError());
      }, 2000);
      return;
    }
    login(dispatch, { email: email1, password: password1 });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { email2, password2, name } = formUp;
    if (!email2 || !password2 || !name) {
      dispatch(loginFailure('Tous les champs doivent être remplis'));
      setTimeout(() => {
        dispatch(resetError());
      }, 2000);
      return;
    }
    const isEmail =
      /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email2);
    if (!isEmail) {
      dispatch(loginFailure("L'e-mail n'est pas valide"));
      setTimeout(() => {
        dispatch(resetError());
      }, 2000);
      return;
    }

    register(dispatch, { name, email: email2, password: password2 });
  };

  const signInWithGoogle = async () => {
    dispatch(loginStart())
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user.displayName)
        axios.post('/api/auth/google', {
          name: result.user.displayName,
          email: result.user.email,
          image: result.user.photoURL,
        }).then(res => {
          dispatch(loginSuccess(res.data))
          localStorage.setItem("user", JSON.stringify(res.data))
        })
      })
      .catch((err) => dispatch(loginFailure(err)));
  };

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  return (
    <Container>
      <Wrapper>
        <Title>Connexion</Title>
        <SubTitle>Pour continuer sur PermaCultube</SubTitle>
        {error && <p style={{ color: 'red', fontWeight: '700' }}>{error}</p>}
        <Input name='email1' placeholder='E-mail' onChange={handleChangeIn} />
        <Input
          name='password1'
          type='password'
          placeholder='Mot de passe'
          onChange={handleChangeIn}
        />
        {loading ? (
          <Button
            onClick={handleSignin}
            disabled
            style={{ cursor: 'not-allowed' }}
          >
            Chargement..
          </Button>
        ) : (
          <Button onClick={handleSignin}>Se connecter</Button>
        )}

        <Title>Ou</Title>
        <Button onClick={signInWithGoogle}> Connexion avec Google</Button>
          
        <Title>Ou</Title>
        <Input
          name='name'
          placeholder="Nom d'utilisateur"
          onChange={handleChangeUp}
        />
        <Input name='email2' placeholder='E-mail' onChange={handleChangeUp} />
        <Input
          name='password2'
          type='password'
          placeholder='Mot de passe'
          onChange={handleChangeUp}
        />
        {loading ? (
          <Button
            onClick={handleSignup}
            disabled
            style={{ cursor: 'not-allowed' }}
          >
            Chargement..
          </Button>
        ) : (
          <Button onClick={handleSignup}>S'inscrire</Button>
        )}
      </Wrapper>
    </Container>
  );
};

export default SignIn;
