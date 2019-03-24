import React, { Component } from 'react';
import { Container, Row, Form, Navbar, FormControl, Button } from 'react-bootstrap'
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import logo from './logo.svg';
import Axios from 'axios';

const endpoint = "https://images-api.nasa.gov/search?media_type=image";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      favorites: [],
      images: {},
      filter: {}
    };

    this.search = this.search.bind(this);
    this.search("orion");
  }

  search(query) {
    Axios.get(endpoint + '&q=' + query).then(res => {
      res = res.data.collection;
      this.setState({
        images: res.items,
        results: {
          nav: res.links,
          url: res.url,
          hits: res.metadata.total_hits
        }
      });
    });
  }

  next(query) {
    Axios.get()
  }

  render() {
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
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-light">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>

      <Container>
        <Row></Row>
      </Container>
    </>
    );
  }
}

export default App;
