import React, { Component } from 'react';
import { render } from 'react-dom';
import {Router, Route} from 'react-router';
import '../styles/Account.css';
import MessageThreads from './MessageThreads';
//import SellLayout from '../../Pages/Sell/components/SellLayout';


class Account extends Component {

	render(){
		return (
			<div className = "container">	
				<div className="row acctholder">
					<div className="col-md-3">
						<div className = "acctBtnHolder">
							<center>
								<h1 className = "accountButtons">My List</h1>
								<h1 className = "accountB uttons">Messages</h1>
								<h1 className = "accountButtons">History</h1>
								<h1 className = "accountButtons">Settings</h1>
							</center>
						</div>
					</div>
					<MessageThreads />
					
					<div className = "settings">
					</div>
				</div>
			</div>
		);
	}
}

export default Account;