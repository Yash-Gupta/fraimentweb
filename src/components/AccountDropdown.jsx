import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/AccountDropdown.css';
import * as firebase from 'firebase';


class AccountDropdown extends Component {

	componentWillMount(){
		firebase.database().ref('/users/' + this.props.userid + '/profilepic').once("value").then((snapshot) => {
            this.setState({pic: snapshot.val()});
        });
        firebase.database().ref('/users/' + this.props.userid + '/username').once("value").then((snapshot) => {
            this.setState({username: snapshot.val()});
        });

	}

	constructor(props){
		super(props);

		this.state = {
			pic: null,
			opened: false,
			username: ""
		};

		this.handleClick = this.handleClick.bind(this);

	}

	handleClick(){
		this.setState({opened: !this.state.opened});
	}

	render() {
		return (
			<div className = "header-signedin" > 
				<img className = "profpic" src = {this.state.pic} onClick={this.handleClick}/>

				{this.state.opened &&
				<div className = "account-dropdown">
					<ul>
						<li><b> @{this.state.username} </b></li>
						{this.props.children}
					</ul>
				</div>
				}
			</div>
		);
	}
}

export default AccountDropdown;
