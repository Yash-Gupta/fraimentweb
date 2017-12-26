import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/Login.css';
import * as firebase from 'firebase';


/* COMPONENTS */

class Login extends Component {

	componentWillMount(){
		this.props.updateHeader(true);
	}

	constructor(props){
		super(props);
		this.state = {
			username: "",
			password: ""
		}

		this.handleChange = this.handleChange.bind(this);
		this.login = this.login.bind(this);
	}

	login(event){
		event.preventDefault();
		firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password)
			.then(function(success){
				var user = firebase.auth().currentUser;
				if (user) {
				  console.log("User is signed in.");
				  console.log(user.email);
				} else {
				  console.log("No user is signed in.");
				}
			})
			.catch(function(error) {
				console.log(error.code);
				console.log(error.message);
			});
	}

	handleChange(event){
		switch (event.target.name) {
			case 'username':
				this.setState({username: event.target.value});
				break;

			case 'password':
				this.setState({password: event.target.value});
				break;

			default:
				break;
		}
	}

	render() {
		return (
			<div className = "">
				<h1 className = "">Login to Fraiment</h1>

				<hr />

				<div>
					<form onSubmit={this.login}>
						<input className = "" type="text" placeholder="Username" name="username" onChange={this.handleChange} value={this.state.name} /> <br />			   
						<input className = "" type="password" placeholder="Password" name="password" onChange={this.handleChange} value={this.state.password} /> <br />
						<button className="submit" type="submit" value="">SIGN IN</button>
					</form>
				</div>
			</div>
		);
	}
}

export default Login;
