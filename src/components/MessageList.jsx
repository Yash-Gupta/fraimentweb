import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/MessageList.css';
import * as firebase from 'firebase';

/* COMPONENTS */
import MessageThreadBox from './MessageThreadBox.jsx';

const threadIds = [];
const buyThreadIds = [];
const sellThreadIds = [];
class MessageList extends Component {

	componentWillMount(){
	}

	updateThreads(uid){
		var self = this;
		console.log(this.state.curType);


		firebase.database().ref('/users/' + uid + '/buy_messages').once("value").then((snapshot) => {
			console.log("a");
			snapshot.forEach(function(thread){
				if(thread.val()){
					//threadIds.push(thread.key);
					//self.setState({threads: threadIds}); 
					var active = false;
					if(thread.key === self.props.currentThread) active = true;
					{/*threadIds.push(<MessageThreadBox sellerBool={false} active={active} onClick={self.props.clickThread} key={thread.key} id={thread.key} />);*/}
					buyThreadIds.push(<MessageThreadBox sellerBool={false} active={active} onClick={self.props.clickThread} key={thread.key} id={thread.key} />);
					{/*self.setState({threads: threadIds});*/}
					self.setState({buyThreads: buyThreadIds});
				}
			});

		});



		

		firebase.database().ref('/users/' + uid + '/sell_messages').once("value").then((snapshot) => {
			console.log("a");
			snapshot.forEach(function(thread){
				if(thread.val()){
					//threadIds.push(thread.key);
					//self.setState({threads: threadIds}); 
					var active = false;
					if(thread.key === self.props.currentThread) active = true;
					{/*threadIds.push(<MessageThreadBox sellerBool={false} active={active} onClick={self.props.clickThread} key={thread.key} id={thread.key} />);*/}
					sellThreadIds.push(<MessageThreadBox sellerBool={false} active={active} onClick={self.props.clickThread} key={thread.key} id={thread.key} />);
					{/*self.setState({threads: threadIds});*/}
					self.setState({sellThreads: sellThreadIds});
				}
			});

		});

		
		

		{/*firebase.database().ref('/users/' + uid + '/sell_messages').once("value").then((snapshot) => {

			snapshot.forEach(function(thread){
				console.log("a");
				if(thread.val()){
					var active = false;
					if(thread.key === self.props.currentThread) active = true;
					threadIds.push(<MessageThreadBox sellerBool={true} active={active} onClick={self.props.clickThread} key={thread.key} id={thread.key} />);

					self.setState({threads: threadIds}); 
				}
			});

		});*/}
	}
	




	componentWillReceiveProps(newProps){
		if(newProps.uid != null && newProps.uid != this.state.uid){
			this.setState({uid: newProps.uid});
			this.updateThreads(newProps.uid);
		}
	}

	constructor(props){
		super(props);
		this.state = {
			uid: null,
			buyThreads: [],
			sellThreads: [],
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
		console.log(this.state.buyThreads);
		for(var i = 0; i < this.state.buyThreads.length; i++){
			var active = this.state.buyThreads[i].props.active;
			if(this.state.buyThreads[i].props.id === this.props.currentThread) active = true;
			buyThreadBoxes.push(<MessageThreadBox sellerBool= {this.state.buyThreads[i].props.sellerBool} active={active}  onClick={this.props.clickThread} key={i} id={this.state.buyThreads[i].props.id} />);
		}


		console.log(this.state.sellThreads);
		for(var i = 0; i < this.state.sellThreads.length; i++){
			var active = this.state.sellThreads[i].props.active;
			if(this.state.sellThreads[i].props.id === this.props.currentThread) active = true;
			sellThreadBoxes.push(<MessageThreadBox sellerBool={this.state.sellThreads[i].props.sellerBool} active={active}  onClick={this.props.clickThread} key={i} id={this.state.sellThreads[i].props.id} />);
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






