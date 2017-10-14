import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { render } from 'react-dom';
import {Router, Route} from 'react-router';
import '../styles/Header.css';

class Header extends Component {

	render(){
		return (
			<div className ="navbarpage">
				<div className = "navbarmob">
					<ul>
						<li><Link to='/account'>ACCOUNT</Link></li>
						<li><a href = "signup.html">SIGN UP</a></li>
						<li><Link to='/login'>LOGIN</Link></li>
						<li><a href = "#">APP</a></li>
						<li><a href = "about.html">ABOUT</a></li>
						
					</ul>
				</div>
			</div>
		);
	}
}

export default Header;