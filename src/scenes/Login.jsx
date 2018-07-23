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
			password: "",
			errors: []
		}

		this.handleChange = this.handleChange.bind(this);
		this.login = this.login.bind(this);
	}

	login(event){
		event.preventDefault();
		var self = this;
		firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password)
			.then(function(success){
				var user = firebase.auth().currentUser;
				if (user) {
				  console.log("User is signed in.");
					window.location = "/";
				} else {
					var errors = self.state.errors;
					errors.push("Incorrect username or password.");
					self.setState({errors: errors});
				  console.log("No user is signed in.");
				}
			})
			.catch(function(error) {
				var errors = self.state.errors;
				errors.push((<b>Incorrect username or password.<br /></b> ));
				self.setState({errors: errors});
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
				<div className = "">
					<div className = "loginContainer">
						<form onSubmit={this.login}>
							<p className="loginErrors">{this.state.errors}</p>
							<input className = "loginPageBoxes" type="text" placeholder="username" name="username" onChange={this.handleChange} value={this.state.name} /> <br />
							<input className = "loginPageBoxes" type="password" placeholder="password" name="password" onChange={this.handleChange} value={this.state.password} /> <br />
							<button className="loginPageSubmit" type="submit" value="">log in</button>

							<center><p className = "noAcct">don't have an account? sign up.</p></center>
						</form>
					</div>

				</div>
			</div>
		);
	}
}

export default Login;
