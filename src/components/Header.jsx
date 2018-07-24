import React, { Component } from 'react';
import { Link, withRouter} from 'react-router-dom';
import './css/Header.css';
import * as firebase from 'firebase';

/* COMPONENTS */
import AccountDropdown from './AccountDropdown.jsx';

class Header extends Component {
	constructor(props){
		super(props);

		this.logout = this.logout.bind(this);
	}

	logout(){
		console.log("logging out");
		var props = this.props;
		firebase.auth().signOut().then(function() {
			console.log("signed out");

			props.history.push('/');
			window.location.reload();

		}, function(error) {
			console.log(error.message);
		});
	}





	render() {
		var userHeader;


		if(this.props.currentUser != null){


			userHeader = (
				<AccountDropdown userid={this.props.currentUser.uid}>
					<li> <Link to = {"/profile/" + this.props.currentUser.uid} >profile </Link> </li>
					<li> <Link to="/messages"> inbox </Link> </li>
					<li onClick={this.logout}> <Link to= "#" >log out</Link> </li>
				</AccountDropdown>);
		}else{
			userHeader = (
				<div className = "header-signedout">
					<Link to="/login"> log in </Link>
					<Link to="/signup"> sign up </Link>
				</div>
			)
		}

		return (
			<div className="header">
				<div className={this.props.simple ? "container container-global container-simple" : "container container-global"}>
					<div className={!this.props.simple ? "header-global" : "header-global header-simple"}>
						<Link to="/"><img src="/images/logo.svg" alt="fraiment-logo"/> </Link>
						{!this.props.simple && (
						<div className="global-links">
							<Link to="/" className="links">shop</Link>
							<Link to="/listing/create" className="links">sell</Link>
						</div>
						)
						}
					</div>

					{!this.props.simple && userHeader}
				</div>
				{/*{!this.props.simple &&
				(<div className="container container-categories">
					<div className="header-categories">
						<a href="#">popular</a>
						<a href="#">tops</a>
						<a href="#">bottoms</a>
						<a href="#">sneakers</a>
						<a href="#">dresses</a>
						<a href="#">accessories</a>
					</div>
				</div>)
				}*/}

				<hr className="header-bar"/>
			</div>
		);
	}
}

export default withRouter(Header);
