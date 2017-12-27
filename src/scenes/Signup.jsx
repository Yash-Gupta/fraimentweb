import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/Signup.css';
import * as firebase from 'firebase';


/* COMPONENTS */

class Signup extends Component {

	componentWillMount(){
		this.props.updateHeader(true);
	}

	constructor(props){
		super(props);
		this.state = {
			username: "",
			conf_password: "",
			password: "",
			errors:[]
		}

		this.handleChange = this.handleChange.bind(this);
		this.signup = this.signup.bind(this);
		this.verifyDetails = this.verifyDetails.bind(this);
	}
	
	verifyDetails(email, pass, conf){
		var errors = [];
		if(conf != pass) errors.push("Passwords don't match!");
		if(!(/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email))) errors.push("Email is invalid.");
		if(pass.length < 6) errors.push("Password too short (must be > 6 characters)");
		return errors;
	}

	signup(event){
		event.preventDefault();
		var verification = this.verifyDetails(this.state.username, this.state.password, this.state.conf_password);
		if(verification.length != 0){
			this.setState({errors: verification});
			return;
		}

		firebase.auth().createUserWithEmailAndPassword(this.state.username, this.state.password)
			.then(function(success){
				return;
			})
			.catch(function(error) {
				console.log(error);
			});

		//this.props.history.push('/login');
	}

	handleChange(event){
		switch (event.target.name) {
			case 'username':
				this.setState({username: event.target.value});
				break;
			case 'password':
				this.setState({password: event.target.value});
				break;
			case 'conf_password':
				this.setState({conf_password: event.target.value});
				break;
			default:
				break;
		}
	}

	render() {
		return (
			<div className = "">
			

				<div className = "errors"> 
					{this.state.errors.map(function(errorMsg){
            			return <li>{errorMsg}</li>;
          			})}
				</div>

				<div>
					<div className = "signupPageContainer">
						<form onSubmit={this.signup}>
							<input className = "signupPageBoxes" type="text" placeholder="Username" name="username" onChange={this.handleChange} value={this.state.username} /> <br />			   
							<input className = "signupPageBoxes" type="password" placeholder="Password" name="password" onChange={this.handleChange} value={this.state.password} /> <br />
							<input className = "signupPageBoxes" type="password" placeholder="Confirm Password" name="conf_password" onChange={this.handleChange} value={this.state.conf_password} /> <br />
							<button className="signupPageSubmit" type="submit" value="">sign up</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default Signup;
