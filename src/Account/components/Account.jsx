import React, { Component } from 'react';
import { render } from 'react-dom';
import {Router, Route} from 'react-router';
import '../styles/Account.css';
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
								<h1 className = "accountButtons">Messages</h1>
								<h1 className = "accountButtons">History</h1>
								<h1 className = "accountButtons">Settings</h1>
							</center>
						</div>
					</div>
					<div className = "messages">
						<div className = "col-md-9">
							<center>
							<h1 className = "acctTitle">MY MESSAGES</h1>
							</center>
							<hr></hr>

							<div className = "oneMessage">
								<div className = "itemimg">
								</div>
								<div className = "details">
									<p className= "itemname">NAME</p>
									<p className = "message">I SEE THAT PUSSY IS HAIRLESS, MWAH! I FRENCH KISS IT LIKE WE BE IN PARIS! </p>
								</div>
								<div className = "timestamp">
									<p className = "time">7 min ago</p>
									<p className = "username">hype_beast64</p>
								</div>
							</div>
							<hr />
							<div className = "oneMessage">
								<div className = "itemimg">
								</div>
								<div className = "details">
									<p className= "itemname">NAME</p>
									<p className = "message">I SAG MY PANTS UNTIL MY ASS SHOWS.</p>
								</div>
								<div className = "timestamp">
									<p className = "time">7 min ago</p>
									<p className = "username">hype_beast64</p>
								</div>
							</div>
							<hr />
						</div>
					</div>
					<div className = "settings">
					</div>
				</div>
			</div>
		);
	}
}

export default Account;