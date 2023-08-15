
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect} from 'react';
import { Container, Button, InputGroup, FormControl, Row, Card } from 'react-bootstrap';

const CLIENT_ID = "2b15424ea1af4a049d6027539121d62d";
const CLIENT_SECRET = "d192359af1484c2d94b356319a09a7ea";

const spacing = {
  marginTop: '1rem',
  width: '50%',
  justifySelf: 'center',
  border: '2px solid grey',
  borderRadius: '.75rem'
}

const cardStyling = {
  padding: '1rem',
  border: '2px solid black',
  borderRadius: '1rem',
  margin: '.5rem 0',
  background: 'linear-gradient(0deg, rgba(252,252,252,1) 0%, rgba(0,0,0,0.821187850140056) 49%)'
}
const heading = {
  justifySelf: 'center',

}

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const authParameters = {
      method: 'POST',
      headers: {
        'content-type' : 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
  
    fetch('https://accounts.spotify.com/api/token', authParameters).then(result => result.json()).then(data => setAccessToken(data.access_token))
  
  },[]);

  async function search() {
    console.log("search for " + searchInput);
      
    const searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    };
    
    const artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
    .then(response => response.json())
    .then(data =>{ return data.artists.items[0].id})

    const returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters
    ).then(response => response.json()).then(data =>{ setAlbums(data.items)});

  }

  return (
    <div className="App">
      <Container style={{display: 'grid'}}>
      <h1 style={heading}>Spotify Album Search Tool</h1>
          <InputGroup style={spacing} className="mb-3" size="lg">
            <FormControl
            placeholder="Search here for an album"
            type="input"
            onKeyUp={event =>{ 
              if(event.key === "Enter"){
              search()
              }
            }}
              onChange={event => setSearchInput(event.target.value)}
            />
            <Button onClick={search}>
              Search
            </Button>
          </InputGroup>
        </Container>
        <Container>
          <Row className="mx-2 row row-cols-4">
            {albums.map( (album, i) => {
              console.log(album);
              return (
            <Card style={cardStyling}>
              <Card.Img src={album.images[0].url} />
              <Card.Body>
                <Card.Title>{album.name}</Card.Title>
              </Card.Body>
            </Card>
              )}
            )}
          </Row>
        </Container>
    </div>
  );
}

export default App;
