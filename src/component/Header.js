import React, { Component } from 'react';
import {NavLink} from 'react-router-dom'
import './header.css';
import logo from '../logo.svg';

class Header extends Component {
	render() {
		return (
			<div>
				<NavLink to="/"  className="component-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="caption">React Music</h1>
				</NavLink>
			</div>
			)
	}
}

export default Header;