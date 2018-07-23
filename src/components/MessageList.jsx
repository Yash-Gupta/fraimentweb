import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/MessageList.css';
import * as firebase from 'firebase';

/* COMPONENTS */
import MessageThreadBox from './MessageThreadBox.jsx';

var threadIds = [];
var buyThreadIds = [];
var sellThreadIds = [];
var buyThreadHash = [];
var sellThreadHash = [];

class MessageList extends Component {

	updateThreads(uid){
		var self = this;
		buyThreadIds = [];
		sellThreadIds = [];

		buyThreadHash = [];
		sellThreadHash = [];

		firebase.database().ref('/users/' + uid + '/buy_messages').once("value").then((snapshot) => {
			snapshot.forEach(function(thread){
				if(thread.val()){
					var active = false;
					if(thread.val() === self.props.currentThread) active = true;
					firebase.database().ref("/threads/" + thread.val() + "/lastActive").once("value").then((lastActive) => {
						buyThreadHash.push({
							id: thread.val(),
							active: active,
							lastActive: lastActive.val()
						});

						self.setState({buyThreads: buyThreadHash});
					});

					firebase.database().ref("/threads/" + thread.val()).off("child_changed");
					firebase.database().ref("/threads/" + thread.val()).on("child_changed", function(dataSnapshot) {
						if(dataSnapshot.key == "lastActive"){
							firebase.database().ref("/threads/" + thread.val() + "/lastActive").once("value").then((lastActive) => {
								var buyThreadHashNew = self.state.buyThreads;

								//TODO: make this more efficient
								for(var i = 0; i < buyThreadHashNew.length; i++){
									if(buyThreadHashNew[i]["id"] == thread.val()){
										buyThreadHashNew[i]["lastActive"] = lastActive.val();
									}
								}
								self.setState({buyThreads: buyThreadHashNew});
							});
						}
					});

					buyThreadIds.push(thread.val());
					self.setState({buyThreadIds: buyThreadIds});
				}
			});
		});

		firebase.database().ref('/users/' + uid + '/sell_messages').orderByChild("lastActive").once("value").then((snapshot) => {
			snapshot.forEach(function(thread){
				if(thread.val()){
					var active = false;
					if(thread.val() === self.props.currentThread) active = true;
					firebase.database().ref("/threads/" + thread.val() + "/lastActive").once("value").then((lastActive) => {
						sellThreadHash.push({
							id: thread.val(),
							active: active,
							lastActive: lastActive.val()
						});

						self.setState({sellThreads: sellThreadHash});
					});

					firebase.database().ref("/threads/" + thread.val()).off("child_changed");
					firebase.database().ref("/threads/" + thread.val()).on("child_changed", function(dataSnapshot) {
						if(dataSnapshot.key == "lastActive"){
							firebase.database().ref("/threads/" + thread.val() + "/lastActive").once("value").then((lastActive) => {
								var sellThreadHashNew = self.state.sellThreads;

								//TODO: make this more efficient
								for(var i = 0; i < sellThreadHashNew.length; i++){
									if(sellThreadHashNew[i]["id"] == thread.val()){
										sellThreadHashNew[i]["lastActive"] = lastActive.val();
									}
								}
								self.setState({sellThreads: sellThreadHashNew});
							});
						}
					});

					sellThreadIds.push(thread.val());
					self.setState({sellThreadIds: sellThreadIds});
				}
			});
		});
	}

	componentWillReceiveProps(newProps){
		if((newProps.uid != null && newProps.uid != this.state.uid) || (newProps.currentThread != null && newProps.currentThread != this.state.threadID)){
			this.setState({uid: newProps.uid, threadID: newProps.currentThread});
			this.updateThreads(newProps.uid);
		}
	}


	constructor(props){
		super(props);
		this.state = {
			uid: null,
			threadID: null,
			buyThreads: [],
			buyThreadIds: [],
			sellThreads: [],
			sellThreadIds: [],
			curType: "buy"
		}

		this.updateThreads = this.updateThreads.bind(this);
		this.toggleType = this.toggleType.bind(this);
	}

	toggleType(event){
		if(event.currentTarget.id == "buy") var other = "sell";
		else var other = "buy";

		var disappear = document.getElementsByClassName(other + "ThreadBoxes");
		var appear = document.getElementsByClassName(event.currentTarget.id + "ThreadBoxes");

		for(var i = 0; i < disappear.length; i++){
			disappear[i].className += " displayNone";
		}

		for(var i = 0; i < appear.length; i++){
			appear[i].className = event.currentTarget.id + "ThreadBoxes";
		}

		document.getElementById(event.currentTarget.id + "Messages").className = "selected";
		document.getElementById(other + "Messages").className = "notSelected";

		this.updateThreads();
	}

	render() {
		var buyThreadBoxes = [];
		var sellThreadBoxes = [];

		this.state.buyThreads.sort(function(a, b){
			return b.lastActive - a.lastActive;
		});

		this.state.sellThreads.sort(function(a, b){
			return b.lastActive - a.lastActive;
		});

		for(var i = 0; i < this.state.buyThreads.length; i++){
			var active = this.state.buyThreads[i].active;
			if(this.state.buyThreads[i].id === this.props.currentThread) active = true;
			buyThreadBoxes.push(<MessageThreadBox currentUser={this.props.currentUser} sellerBool= {false} active={active}  onClick={this.props.clickThread} key={i} id={this.state.buyThreads[i].id} />);
		}

		for(var i = 0; i < this.state.sellThreads.length; i++){
			var active = this.state.sellThreads[i].active;
			if(this.state.sellThreads[i].id === this.props.currentThread) active = true;
			sellThreadBoxes.push(<MessageThreadBox currentUser={this.props.currentUser} sellerBool= {true} active={active}  onClick={this.props.clickThread} key={i} id={this.state.sellThreads[i].id} />);
		}


		/*for(var i = 0; i < this.state.sellThreads.length; i++){
			var active = this.state.sellThreads[i].props.active;
			if(this.state.sellThreads[i].props.id === this.props.currentThread) active = true;
			sellThreadBoxes.push(<MessageThreadBox currentUser={this.props.currentUser} sellerBool={true} active={active}  onClick={this.props.clickThread} key={i} id={this.state.sellThreads[i].props.id} />);
		}*/

		if (buyThreadBoxes.length <= 0) {
			buyThreadBoxes = (<h2 className="no-messages"> No messages here! </h2>)
  	}
		if (sellThreadBoxes.length <= 0) {
			sellThreadBoxes = (<h2 className="no-messages"> No messages here! </h2>)
		}

		return (
			<div className="message-list">

				<div className = "messageTypes">
					<a id = "buy" onClick = {this.toggleType} >
						<p id = "buyMessages"  className = "selected">Buy</p>
					</a>

					<a id = "sell" onClick = {this.toggleType} >
						<p id = "sellMessages"  className = "notSelected">Sell</p>
					</a>

				</div>

				<div className = "buyThreadBoxes">
					{buyThreadBoxes}
				</div>

				<div className = "sellThreadBoxes displayNone">
					{sellThreadBoxes}
				</div>

			</div>
		);
	}
}

export default MessageList;
