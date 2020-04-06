import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';
import { Link, withRouter } from "react-router-dom";
import "./style.css";
import { connect } from "react-redux";
import { authentication } from "../../actions/index.js";
import { store } from "../../store/store.js";
import axios from "axios";

class Navigation extends Component {
constructor(props) {
  super(props);

  this.state = {
    isOpen: false,
    friends: [],
    users: [],
    successful: false
  };
}
  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }
  gatherFriendRequests = () => {
    axios.post("/gather/friends/list/navbar", {
      email: this.props.authenticated
    }).then((res) => {
      console.log(res.data);
      for (let key in res.data) {
        let friends = res.data[key].friends;
        console.log(friends);
        this.setState({
          friends
        })
      }
    }).catch((err) => {
      console.log(err);
    })
  }
  gatherUser = (username) => {
    axios.post("/gather/username/profile", {
      username
    }).then((res) => {
      console.log(res.data);
      if (res.data) {
        this.props.history.push(`/profiles/individual/${username}`, { user: res.data })
      }
    }).catch((err) => {
      console.log(err);
    })
  }
  render () { 
    console.log(this.state);
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand><Link style={{ color: "purple" }} to="/">Jerk N' Squirt</Link></NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
  {/*          <NavItem>
                <Link className="nav-link" to="/">Homepage</Link>
              </NavItem>*/}
              <NavItem>
                <Link className="nav-link" to="/purchase/tokens">Purchase Tokens</Link>
              </NavItem>

      
           	{this.props.authenticated ? <NavItem>
                <Link className="nav-link" to="/streams/create">Broadcast Yourself</Link>
              </NavItem> : null}
              <NavItem className="link">
                <Link className="nav-link" to="/profiles">Profiles/Buy-Content</Link>
              </NavItem>
            </Nav>
            	{this.props.authenticated ? null : <NavItem className="link">
                <Link className="btn btn-outline-info" to="/login">Sign-in</Link>
              </NavItem>}
              
              {this.props.authenticated ? <NavItem className="link">
                <button onClick={() => {
                	this.props.authentication({});
                }} className="btn btn-outline-danger" to="/register">Sign-Out</button>
              </NavItem> : <NavItem className="link">
                <Link className="btn btn-outline-success" to="/register">Sign Up</Link>
              </NavItem>}
              {this.props.authenticated ? <NavItem className="link">
                <Link className="btn btn-outline pink_button" to="/signup/camming/one">Become A Cammer!</Link>
              </NavItem> : null}
              {this.props.authenticated ? <li style={{ listStyleType: "none" }} class="dropdown">
                  <a style={{ margin: "20px", color: "black" }} onClick={this.gatherFriendRequests} class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i style={{ color: "black" }} class="fas fa-user-friends fa-2x"></i>{this.state.friends.length > 0 ? (<b>{this.state.friends ? this.state.friends.length : null}</b>) : null}</a>
                  <ul class="dropdown-menu notify-drop">
                    <div class="notify-drop-title">
                      
                    </div>
                   
                    <div class="drop-content">
                      {this.state.friends ? this.state.friends.map((friend, index) => {
                        console.log(friend);
                        if (friend.status === "pending" && friend.sender === false) {
                          return (
                              <li>
                              
                                <div id="fb" style={{ width: "100%" }}>
                                <div id="fb-top">
                                  <p><b>Friend Requests</b><span>Find Friends &bull; Settings</span></p>
                                </div>
                                <img src={friend.image ? friend.image : require("../../images/sex-1.jpg")} height="100" width="100" alt="Image of woman" />
                                <p id="info"><b><a style={{ color: "pink" }} onClick={() => {
                                  this.gatherUser(friend.username);
                                }}>{friend.username}</a></b> <br /> <span>14 mutual friends</span></p>
                                <div id="button-block">
                                  <div id="confirm">Confirm</div>
                                  <div id="delete">Delete Request</div>
                                </div>
                              </div>
                            
                            
                            </li>
                          );
                        } else {
                          return <h3 className="text-center">You have no currently pending friend requests...</h3>
                        }
                      }) : <h3 className="text-center">You have no currently pending friend requests...</h3>}
                     
                      
                     
                    </div>
                   {/* <div class="notify-drop-footer text-center">
                      <a href=""><i class="fa fa-eye"></i> Tümünü Göster</a>
                    </div>*/}
                  </ul>
                </li> : null}
             
              {this.props.authenticated ? <NavbarText>{store.getState().auth.data.username}, You have (88) tokens</NavbarText> : null}
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
	console.log("State :", state);
	return {
		authenticated: state.auth.data.email
	}
}

export default withRouter(connect(mapStateToProps, { authentication })(Navigation));