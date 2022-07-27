
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from "styled-components";
import Card from "../components/Card"
import Spinner from "../components/Spinner"
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Home = ({type}) => {
  
  const location = useLocation()
  const tag = location.state && location.state.tag ? location.state.tag : null
  const query = location.state && location.state.query ? location.state.query : null;

  const [videos, setVideos] = useState()
  const [loading, setLoading] = useState(false)
 
 useEffect(() => {
  const fetchData = async () => {
     setLoading(true)
     let res;
   
     try {
      if(tag){
        res = await axios.get(`/api/videos/${type}?tags=${tag}`)
       } else if(query){
        res = await axios.get(`/api/videos/${type}?q=${query}`)
       } else {
        res = await axios.get(`/api/videos/${type}`)
      }
      setVideos(res.data)
       
     } catch (error) {
       console.log(error)
     }
     setLoading(false)
   }
   fetchData()
 }, [type, tag, query])

  return (
    <Container>
        {loading && <Spinner />}
        {videos && videos.length > 0 ? videos.map(video => (
          <Card key={video._id} video={video}/>
        )) : <h1>Il n'y a pas de vidéos qui correspondent à votre recherche</h1>}
        
    </Container>
  )
}
export default Home