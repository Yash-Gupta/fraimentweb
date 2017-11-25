import React, { Component } from 'react';
import { render } from 'react-dom';
import {Router, Route} from 'react-router';



import * as firebase from 'firebase';

class MessageThread extends Component {

	constructor(props){
		super();
		this.threadid = "";
		//this.useruid = "Vkv3ORi8oVXouzgEQdpgJ7Og7X52";
		var buyerid;
		var sellerid;
		var listingid;
		this.state = {
			messages: {},
			useruid: "Vkv3ORi8oVXouzgEQdpgJ7Og7X52"
		}

	}

	componentWillMount() {

		//var user = firebase.auth().currentUser;
		//var uid = user.uid;

		//console.log(user);
		console.log(this.props.data.threadid);
		this.threadid = this.props.data.threadid;
		var messages = this.state.messages;
        firebase.database().ref('/messages/').orderByChild('threadID').equalTo(this.threadid).once("value").then((snapshot) => {
            //console.log("Messages for thread ID: " + threadID);
			//console.log("-----------------------------");
            messages[this.threadID] = [];
            var counter = 0;

            snapshot.forEach((data) => {
            	messages[counter] = data.val();
            	counter++;

            	//console.log(data.key + ": " + data.val().message);
            });
			this.setState({messsages: messages});

        });
        console.log(this.state.messages);

	}


	render(){
		var messageStore = [];
		//console.log(this.state.useruid);

		Object.keys(this.state.messages).map((x, i) => {
			//console.log(this.state.messages[x].message);
			//console.log(this.state.messages[x].senderID);
			
			if(this.state.messages[x].senderID == this.state.useruid){
				//console.log(x);
				//console.log("worked??");
				//console.log(this.state.messages[x]);
				messageStore.push(
					<div key = {i}>
						<p className = "myMessage">{this.state.messages[x].message}</p><br />
					</div>
				);
			}else{
				messageStore.push(
					<div key = {i}>
						<p className = "yourMessage">{this.state.messages[x].message}</p><br />
					</div>
				);
			}

			


		});
		//console.log(messageStore);
		/*this.state.messages.map((x, i) => {
		}*/
		return (
			<div>
				{messageStore}
			</div>
		);
	}
}

export default MessageThread;