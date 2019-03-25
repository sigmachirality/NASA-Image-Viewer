import React, { Component } from 'react';
import { 
  Button, 
  Navbar, 
  FormControl, 
  Modal, 
  Card, 
  Spinner, 
  Image } from 'react-bootstrap'
import InfiniteScroll from 'react-infinite-scroller'
import Masonry from 'react-masonry-component'
import {
  FacebookShareButton,
  TwitterShareButton,
  PinterestShareButton,
  RedditShareButton,
  TumblrShareButton,
  EmailShareButton,
  LineShareButton,
  FacebookIcon,
  TwitterIcon,
  PinterestIcon,
  RedditIcon,
  TumblrIcon,
  EmailIcon,
  LineIcon
} from 'react-share';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import logo from './logo.svg';
import Axios from 'axios';

const endpoint = "https://images-api.nasa.gov/search?media_type=image";
const masonryOptions = {
  transitionDuration: 1000
};
const imagesLoadedOptions = { background: '.my-bg-image-el' }

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      query: "",
      favorites: [],
      next: 1,
      showModal: false,
      modalImage: {},
      page: 1,
      width: 0
    };
    this.updateWindowWidth = this.updateWindowWidth.bind(this);
  }

  componentDidMount() {
    this.updateWindowWidth();
    window.addEventListener('resize', this.updateWindowWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowWidth);
  }

  updateWindowWidth() {
    this.setState({ width: window.innerWidth});
  }

  applyFilter(event) {
    this.setState({query: event.target.value});  
  }

  scrobbleSearch(event) {
    this.setState({
      query: event.target.value,
      images: [],
      page: 1,
      next: 1
    });
  }

  showModal(image) {
    this.setState({showModal: true, modalImage: image});
  }

  hideModal() {
    this.setState({showModal: false, modalImage: {}});
  }

  //TODO: Implement favorites
  getFavorites() {
    var favs = localStorage.getItem('favorites');
    this.setState({favorites: favs});
  }

  setFavorites() {
    localStorage.setItem('favorites', this.state.favorites);
  }

  loadItems() {
    var currentQuery = this.state.query;
    Axios.get(endpoint + '&page=' + this.state.page + (currentQuery ? ("&q=" + currentQuery) : ""))
      .then(res => {
        if (this.state.query !== currentQuery) return;
        res = res.data.collection;
        var images = this.state.images;
        images = images.concat(res.items);
        this.setState({
          images: images,
          results: {
            url: res.url,
            hits: res.metadata.total_hits
          },
          test: res,
          next: res.metadata.total_hits - images.length,
          page: this.state.page + 1
        });
      });
  }

  render() {
    const spinner = <h3>
        <Spinner animation="border" variant="secondary" styles={{margin: "auto"}} />
        Loading...
      </h3>
    var items = [];
    let cardWidth = "";
    if (this.state.width >= 1280) {
      cardWidth = "21.5vw";
    } else if (this.state.width >= 890) {
      cardWidth = "28vw";
    } else if (this.state.width >= 675) {
      cardWidth = "42vw";
    } else {
      cardWidth = "80vw";
    }
    this.state.images.map((image, i) => {
      items.push(
        <Button 
              size= "lg" 
              variant="link" 
              onClick={this.showModal.bind(this, image)}
            >
          <Card style={{ width: cardWidth }} bg="dark" text="white" key={i.toString()}>
            <Card.Img variant="top" src={image.links[0].href} href={image.links[0].href}/>
            <Card.Body>
              <Card.Title>
                {image.data[0].title}
              </Card.Title>
            </Card.Body>
          </Card>
        </Button>
      );
    });

    return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">
          <img
          alt = ""
          src = {logo}
          width = "30"
          height = "30"
          className = "d-inline-block align-top"
          />
          NASA Image Archive
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <FormControl 
            onChange={this.scrobbleSearch.bind(this)}
            type="text" 
            size="lg"
            placeholder="Search by description, center, keyword, photographer, or year!" 
          />
        </Navbar.Collapse>
      </Navbar>
      <br />
      <InfiniteScroll
          pageStart={0}
          loadMore={this.loadItems.bind(this)}
          hasMore={this.state.next > 0}
          loader={spinner}
          threshold={250}
        >
          <Masonry
              className={'my-gallery-class'} // default ''
              elementType={'ul'} // default 'div'
              options={masonryOptions} // default {}
              disableImagesLoaded={false} // default false
              updateOnEachImageLoad={true} // default false and works only if disableImagesLoaded is false
              imagesLoadedOptions={imagesLoadedOptions} // default {}
          >
            {this.state.next > 0 ? items : <h3>No Results.</h3>}
          </Masonry>
      </InfiniteScroll>
      
      {this.state.showModal && 
      <Modal 
        show={this.state.showModal} 
        centered
        size="lg"
        >
        <Modal.Header>
          <Modal.Title>{this.state.modalImage.data[0].title}</Modal.Title>
          <Button variant="secondary" onClick={this.hideModal.bind(this)}>
            Close Info
          </Button>
        </Modal.Header>
        <Image src={this.state.modalImage.links[0].href} fluid/>
        <Modal.Body>                 
          <hr />
          <p><b>Date Created:</b> {this.state.modalImage.data[0].date_created ? (new Date(this.state.modalImage.data[0].date_created)).toLocaleDateString("en-US") : "n/a"}</p>
          <p><b>Center:</b> {this.state.modalImage.data[0].center ? this.state.modalImage.data[0].center : "n/a"}</p>
          <p><b>Keywords:</b> {this.state.modalImage.data[0].keywords ? this.state.modalImage.data[0].keywords.join(", ") : "n/a"}</p>
          <hr />
          <p>{this.state.modalImage.data[0].description}</p>
        </Modal.Body>
        <Modal.Footer>
          <FacebookShareButton 
              url={this.state.modalImage.links[0].href}
              title={this.state.modalImage.data[0].title}
              style={{width: "32px"}}
            >
            <FacebookIcon
                size={32}
                round />  
            </FacebookShareButton>
          <TwitterShareButton 
              url={this.state.modalImage.links[0].href}
              title={this.state.modalImage.data[0].title}
              style={{width: "32px"}}
            >
            <TwitterIcon
                size={32}
                round />  
          </TwitterShareButton>
          <PinterestShareButton 
              url={this.state.modalImage.links[0].href}
              title={this.state.modalImage.data[0].title}
              style={{width: "32px"}}
            >
            <PinterestIcon
                size={32}
                round />  
          </PinterestShareButton>
          <RedditShareButton 
              url={this.state.modalImage.links[0].href}
              title={this.state.modalImage.data[0].title}
              style={{width: "32px"}}
            >
            <RedditIcon
                size={32}
                round />  
          </RedditShareButton>
          <TumblrShareButton 
              url={this.state.modalImage.links[0].href}
              title={this.state.modalImage.data[0].title}
              style={{width: "32px"}}
            >
            <TumblrIcon
                size={32}
                round />  
          </TumblrShareButton>
          <LineShareButton 
              url={this.state.modalImage.links[0].href}
              title={this.state.modalImage.data[0].title}
              style={{width: "32px"}}
            >
            <LineIcon
                size={32}
                round />  
          </LineShareButton>
          <EmailShareButton 
              url={this.state.modalImage.links[0].href}
              title={this.state.modalImage.data[0].title}
              style={{width: "32px"}}
            >
            <EmailIcon
                size={32}
                round />  
          </EmailShareButton>
          <Button variant="secondary" onClick={this.hideModal.bind(this)}>
            Close Info
          </Button>
        </Modal.Footer>
      </Modal>}
    </>
    );
  }
}

export default App;
