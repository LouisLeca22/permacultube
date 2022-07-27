import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Comments from "../components/Comments";
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import {format, register} from "timeago.js"
import locale from "timeago.js/lib/lang/fr"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideo } from '../redux/apiCalls';
import { dislike, like } from '../redux/videoSlice';
import { subscription } from '../redux/userSlice';
import Recommendation from '../components/Recommendation';
register("fr", locale);

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div`
display: flex;
justify-content: center;
height: 50%;

`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;


const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: ${({ theme }) => theme.bgLighter}; ;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
 height: 100%;
 width: 100%;
 object-fit: cover;
`

const Video = () => {
  const {id} = useParams()
  const {currentUser} = useSelector(state => state.user)
  const {currentVideo, loading} = useSelector(state => state.video)
  const [channel, setChannel] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    
    const fetchData = async () => {
      fetchVideo(dispatch, id)
    }
    fetchData()
  }, [dispatch, id])

  useEffect(() => {
    const increaseView = async () => {
      await axios.put(`/api/videos/view/${id}`)
    }
    increaseView()
  }, [id])

useEffect(() => {
  const fetchData = async () => {
    if(currentVideo){

      const resChannel= await axios.get(`/api/users/find/${currentVideo.userId}`)
      setChannel(resChannel.data)
    }
  }

  fetchData()
}, [currentVideo, dispatch])



  const handleLike = async () => {
    dispatch(like(currentUser._id))
    await axios.put(`/api/users/like/${currentVideo._id}`)
  }

  const handleDislike = async () => {
    dispatch(dislike(currentUser._id))
    await axios.put(`/api/users/dislike/${currentVideo._id}`)
  }

  const handleSubscribe = async () => {
    currentUser.subscribedUsers.includes(channel._id)
      ? await axios.put(`/api/users/unsub/${channel._id}`)
      : await axios.put(`/api/users/sub/${channel._id}`);
    dispatch(subscription(channel._id));
  };


  if(loading){
    return <Spinner />
  }
 
  if (currentVideo && channel){
  return (
    <Container>
      <Content>
        <VideoWrapper>
          {/* <iframe
            width="70%"
            height="100%"
            src={currentVideo.videoUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe> */}
          <VideoFrame src={currentVideo.videoUrl} controls/>
        </VideoWrapper>
        <Title>{currentVideo.title}</Title>
        <Details>
          <Info>{currentVideo.views} vues • postée {format(currentVideo.createdAt, "fr")}</Info>
          {currentUser && 
            <Buttons>
            <Button onClick={handleLike}>
              {currentVideo.likes?.includes(currentUser._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}
              {currentVideo.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
            {currentVideo.dislikes?.includes(currentUser._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon /> 

              )}
              {currentVideo.likes?.length}
              Je n'aime plus
            </Button>
          </Buttons>
          }
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel.image}/>
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.subscribers} abonnés</ChannelCounter>
              <Description>
                {currentVideo.description}
              </Description>
            </ChannelDetail>
          </ChannelInfo>
          {currentUser &&  <Subscribe onClick={handleSubscribe}>
            {currentUser.subscribedUsers.includes(channel._id) ? "Se désabonner": "S'abonner"}
          </Subscribe> }
        </Channel>
        <Hr />
        {currentVideo && <Comments videoId={currentVideo._id}/>
        }
      </Content>
      <Recommendation tags={currentVideo.tags}/>
    </Container>
  );
};
}

export default Video;