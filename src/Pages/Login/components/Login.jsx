import React, { Component } from 'react';
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
			<form onSubmit={this.login}>
        		<label>
        		  Name:
        		  <input type="text" name="username" onChange={this.handleChange} value={this.state.name} />
        		</label>
        		<label>
        		  Author:
        		  <input type="password" name="password" onChange={this.handleChange} value={this.state.author} />
        		</label>


        		<input type="submit" value="Submit" />
      		</form>
		);
	}
}

export default Login;