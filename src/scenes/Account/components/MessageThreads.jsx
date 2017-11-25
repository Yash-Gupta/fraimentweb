import React, { Component } from 'react';
import { render } from 'react-dom';
import {Router, Route} from 'react-router';
import * as firebase from 'firebase';
import '../styles/Account.css';
import MessageThread from '../../../components/MessageThread/components/MessageThread';
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
//import '../../../../node_modules/bootstrap/dist/js/jquery.min.js';
//import '../../../../node_modules/bootstrap/dist/js/bootstrap.min.js';


//import MessageThread from '../../';
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
            	firebase.database().ref('/listings/' + snapshot.val().listingid + '/imageurl').once("value").then((snapshot2) => {
					threads[snapshot.key]["imageurl"] = snapshot2.val();
					//console.log(imageurl);
					//return imageurl;
       			});
           		//threads[snapshot.key]["imageurl"] = this.getImageFromListing(snapshot.val().listingid);
			

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
	onThreadClick(event){
		 var popup = document.getElementById("myPopup");
    	 popup.classList.toggle("show");
	}

	getImageFromListing(listingId){
		//return new Promise((resolve, reject) => {
			firebase.database().ref('/listings/' + listingId + '/imageurl').once("value").then((snapshot) => {
				var imageurl = snapshot.val();
				console.log(imageurl);
				return imageurl;
       		});
			
      	//})
		
	}

	render(){
		var messageThreads = [];
		


		Object.keys(this.state.threads).map((x, i) => {
			var imageurl = "";
			console.log(x);

			/*this.getImageFromListing(this.state.threads[x].listingid).then((res) => {
				imageurl = res;
			});*/
			console.log(imageurl);
       		var styles = {
				backgroundImage: "url(" + this.state.threads[x].img_url + ")",
				backgroundSize:'cover',
			};
       		messageThreads.push(

				<div key = {i} >
					 <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
					<div className = "oneMessage" data-toggle="modal" data-target="#exampleModal">

				
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
					<div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
					  <div className="modal-dialog" role="document">
					    <div className="modal-content">
					      <div className="modal-header">
					        <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
					        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
					          <span aria-hidden="true">&times;</span>
					        </button>
					      </div>
					      <div className="modal-body">
					         <MessageThread 
						data = {
							{"threadid" : x}

						}

					/>
					      </div>
					      <div className="modal-footer">
					        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
					        <button type="button" className="btn btn-primary">Save changes</button>
					      </div>
					    </div>
					  </div>
					</div>

					
				
				   
						


					
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