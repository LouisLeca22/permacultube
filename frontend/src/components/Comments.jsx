import styled from "styled-components";
import Comment from "./Comment";
import {useDispatch, useSelector} from "react-redux"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchComments } from '../redux/apiCalls';
import { addComment } from '../redux/commentsSlice';

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Form = styled.form`
  width: 100%;
`

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  font-size: 1.1rem;
  background-color: transparent;
  outline: none;
  padding: 5px 10px;
  width: 100%;
  ::placeholder{
    font-weight: bold;
  };
&:focus{
  padding-left: 20px;
  border: 1px solid #fff;
  box-shadow: 0 0 10px #719ECE;
}

`;

const Comments = ({videoId}) => {

  const dispatch = useDispatch()
  const {currentUser} = useSelector(state => state.user)

  const {comments} = useSelector(state => state.comments)
  console.log(comments)
  useEffect(() => {
    fetchComments(dispatch, videoId)
  },[dispatch, videoId])
  
  const [input, setInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(input.length > 0){
      const res = await axios.post("/api/comments", {desc: input, videoId})
      setInput("")
      dispatch(addComment(res.data))
    }
  }

  return (
    <Container>
    {currentUser &&     <NewComment>
        <Avatar src={currentUser.image} />
        <Form onSubmit={handleSubmit}>
        <Input placeholder="Ajouter un commentaire..." onChange={(e) => setInput(e.target.value)} value={input} />
        </Form>
      </NewComment>}
  
      {comments && comments.map(comment => (
        <Comment comment={comment} key={comment._id}/>
      ))}
    </Container>
  );
};

export default Comments;