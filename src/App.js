import React, { Component } from 'react';
import { Form, Navbar, Nav, NavDropdown, FormControl, Button } from 'react-bootstrap'
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import logo from './logo.svg';
import Axios from 'axios';

const endpoint = 'https://images-api.nasa.gov';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [],
      favorites: [],
      images: {},
      filter: {},
      result: {}  
    };

    this.search = this.search.bind(this);
    this.search("orion");
  }

  search(query) {
    Axios.get(endpoint + '/search?q=' + query).then(res => {
      console.log("memes");
      this.setState({result: res.data});
    });
  }

  render() {
    return (
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
    );
  }
}

export default App;
