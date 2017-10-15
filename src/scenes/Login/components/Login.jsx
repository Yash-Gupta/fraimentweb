import React, { Component } from 'react';
import { render } from 'react-dom';
import {Router, Route} from 'react-router';
import '../styles/login.css';
import * as firebase from 'firebase'

class Login extends Component {

	constructor(props){
		super(props);
		this.state = {
			uname: "",
			password: ""
		}



		this.handleChange = this.handleChange.bind(this);
		this.login = this.login.bind(this);
	}

	login(event){
		event.preventDefault();
		firebase.auth().signInWithEmailAndPassword(this.state.uname, this.state.password).catch(function(error) {
			console.log(error.code);
			console.log(error.message);
		});

		var user = firebase.auth().currentUser;

		if (user) {
		  console.log("User is signed in.");
		  console.log(user.email);
		} else {
		  console.log("No user is signed in.");
		}
	}

	handleChange(event){
		switch (event.target.name) {
			case 'username':
				this.setState({uname: event.target.value});
				break;

			case 'password':
				this.setState({password: event.target.value});
				break;

			default:
				break;
		}
	}

	render(){
		return (


			<div className = "container background">
				<div className = "row">
					<div className = "col-md-3">
					</div>
					<div className = "col-md-6">
						<div className = "loginformholder">
							<h1 className = "title">Login to Fraiment</h1>

							<hr />
							<div>
								<form onSubmit={this.login}>
								<h2 className = "welcome">Welcome Back!</h2>
				        		
				        		
				        		<input className = "loginput" type="text" placeholder="Username" name="username" onChange={this.handleChange} value={this.state.name} /> <br />			   
				        		<input className = "loginput" type="password" placeholder="Password" name="password" onChange={this.handleChange} value={this.state.author} /> <br />
				        		<button className="submit" type="submit" value="">SIGN IN</button>
				        	
				      			</form>
				      		</div>
			      		</div>
					</div>
					<div className = "col-md-3">
					</div>
				</div>
			</div>


				
	      	
		);
	}
}

export default Login;