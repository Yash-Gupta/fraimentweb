import React, { Component } from 'react';
import { render } from 'react-dom';
import {Router, Route} from 'react-router';
import * as firebase from 'firebase';
import '../styles/Account.css';
//import SellLayout from '../../Pages/Sell/components/SellLayout';


class MessageThreads extends Component {
	constructor(props){
		super(props);

		this.state = {
			threadids: []
			
		}
	}
	componentWillMount() {
		var initialValue = false;
		firebase.database().ref('/users/Vkv3ORi8oVXouzgEQdpgJ7Og7X52/buy_messages').once("value").then((snapshot) => {
            snapshot.forEach((data) => {
            	var mythreadids = this.state.threadids;
            	var threadid = data.key;
            	console.log("data key " + threadid);
            	console.log("mythreadids" + mythreadids);

            	mythreadids.push(threadid);
            	this.setState({threadids: threadid});
            	
            });
            initialValue = true;
        });
        console.log(this.state.threadids);

        firebase.database().ref('/threads/-KwNExbz9lTOkD85C5yB').once("value").then((snapshot) => {
            snapshot.forEach((data) => {
            	console.log(data.key + ": " + data.val());
            	
            });
            initialValue = true;
        });

        firebase.database().ref('/messages/').orderByChild('threadID').equalTo('-KwNExbz9lTOkD85C5yB').once("value").then((snapshot) => {
            snapshot.forEach((data) => {
            	console.log(data.key + ": " + data.val().message);
            	
            });
            initialValue = true;
        });
        


        {/*this.state.threadids.map((x, i) => {

			
			rows.push(
				<div key={i} className ="col-md-4 post" id = "post">

					<Link to={"/product/" + x.id + ""}>
						<div className = "img-holder" style={styles}>
						</div>
						<hr />
						<p className="postname">{x.name}</p>
						<p className= "postdesigner">{x.author}</p>
						<p className= "postprice">{x.price}</p>
						<p className = "postname">{x.category}</p>
						<p className = "postname">{x.id}</p>
					</Link>

				</div>
			);
		})*/}





	}

	render(){

		return (

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
		);
	}
}

export default MessageThreads;