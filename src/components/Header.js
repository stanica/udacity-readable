import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
const Nav = require('react-bootstrap').Nav;
const NavItem = require('react-bootstrap').NavItem;
const Navbar = require('react-bootstrap').Navbar;

class Header extends Component {

  render(){
    return (
      <div>
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link onClick={() => this.props.setCategory('')} to='/'>Udacity Readable</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            {this.props.categories.map((category) => (
              <LinkContainer eventKey={category.name} key={category.name} to={'/'+category.path}>
                <NavItem
                  onClick={() => this.props.setCategory(category.name)}>
                  {category.name}
                </NavItem>
              </LinkContainer>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      </div>
    )
  }
}

export default Header;
