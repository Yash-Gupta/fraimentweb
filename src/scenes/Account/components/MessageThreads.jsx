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
			threadids: [],
			threads: {},
			messages: {}
			
		}

		this.loadThreads = this.loadThreads.bind(this);
		this.getImageFromListing = this.getImageFromListing.bind(this);

	}

	loadThreads(threadID){
		var threads = this.state.threads;
        var counter = 0;
		firebase.database().ref('/threads/' + threadID).once("value").then((snapshot) => {
            
            threads[snapshot.key] = {};
            snapshot.forEach((data) => {
            	
            	threads[snapshot.key][data.key] = data.val();

            });
            counter++;
			this.setState({threads: threads});
        });

		var messages = this.state.messages;
        firebase.database().ref('/messages/').orderByChild('threadID').equalTo(threadID).once("value").then((snapshot) => {
            messages[threadID] = {};
            var counter = 0;

            snapshot.forEach((data) => {
            	messages[threadID][counter] = {"message" : data.val().message, "senderID": data.val().senderID};
            	counter++;
            });
			this.setState({messsages: messages});
        });
	}

	componentWillMount() {
		var initialValue = false;
		var user = firebase.auth().currentUser;

		firebase.database().ref('/users/Vkv3ORi8oVXouzgEQdpgJ7Og7X52/buy_messages').once("value").then((snapshot) => {
            var counter = 0;
            snapshot.forEach((data) => { //for each message thread
            	var mythreadids = this.state.threadids; //get current threadids
            	var threadid = data.key;

            	mythreadids.push(threadid);
            	this.setState({ threadids: mythreadids }, () => {
            		this.loadThreads(this.state.threadids[counter]);
				})
				
				counter++;
            });
            initialValue = true;
        });

        console.log(this.state.messages);
		console.log(this.state.threads);

	}

	getImageFromListing(listingId){
		return new Promise((resolve, reject) => {
			firebase.database().ref('/listings/' + listingId + '/imageurl').once("value").then((snapshot) => {
				return snapshot.val();    	
       		});
      	})
		
	}

	render(){

		var messageThreads = [];


		Object.keys(this.state.threads).map((x, i) => {
			var imageurl = "";
			this.getImageFromListing(this.state.threads[x].listingid).then(function (res){
				imageurl = res;
				console.log(res);
			});
			
       		var styles = {
				backgroundImage: "url(" + imageurl + ")",
				backgroundSize:'cover',
			};
       		messageThreads.push(
				<div key="{i}">
					<div className = "oneMessage">
						<div className = "itemimg" style={styles}>
						</div>
						<div className = "details">
							<p className= "itemname">{this.state.threads[x].listing_name}</p>
							<p className = "message">{this.state.threads[x].last_message_text}</p>
						</div>
						<div className = "timestamp">
							<p className = "time">7 min ago</p>
							<p className = "username">{this.state.threads[x].seller_id}</p>
						</div>
					</div>
					<hr />
				</div>
			);
		
		});

		return (

			<div className = "messages">
				<div className = "col-md-9">
					<center>
					
					<h1 className = "acctTitle">MY MESSAGES</h1>
					</center>
					{messageThreads}
				
				</div>
			</div>		
		);
	}
}

export default MessageThreads;