import styled from 'styled-components'
import useFetch from '../hooks/useFetch'
import Card from './Card'

const Container = styled.div`
 flex: 2;
 @media (max-width: 820px){
    display: none;
  }
`

const Recommendation = ({tags}) => {
    const {data:videos} = useFetch(`/api/videos/tags?tags=${tags}`)

  return (
    <Container>
        {videos && videos.map(video => (
            <Card type="sm" key={video._id} video={video}/>
        ))}
    </Container>
  )
}
export default Recommendation