import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/MessageList.css';
import * as firebase from 'firebase';

/* COMPONENTS */
import MessageThreadBox from './MessageThreadBox.jsx';

const threadIds = [];
class MessageList extends Component {

	componentWillMount(){
	}

	updateThreads(uid){
		var self = this;
		firebase.database().ref('/users/' + uid + '/buy_messages').once("value").then((snapshot) => {
			snapshot.forEach(function(thread){
				if(thread.val()){
					//threadIds.push(thread.key);
					//self.setState({threads: threadIds}); 
					var active = false;
					if(thread.key === self.props.currentThread) active = true;
					threadIds.push(<MessageThreadBox sellerBool={false} active={active} onClick={self.props.clickThread} key={thread.key} id={thread.key} />);

					self.setState({threads: threadIds});
				}
			});
		});

		firebase.database().ref('/users/' + uid + '/sell_messages').once("value").then((snapshot) => {
			snapshot.forEach(function(thread){
				if(thread.val()){
					var active = false;
					if(thread.key === self.props.currentThread) active = true;
					threadIds.push(<MessageThreadBox sellerBool={true} active={active} onClick={self.props.clickThread} key={thread.key} id={thread.key} />);

					self.setState({threads: threadIds}); 
				}
			});
		});
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
			threads: []
		}
		this.updateThreads = this.updateThreads.bind(this);
	}

	render() {
		var threadBoxes = [];
		for(var i = 0; i < this.state.threads.length; i++){
			var active = this.state.threads[i].props.active;
			if(this.state.threads[i].props.id === this.props.currentThread) active = true;
			threadBoxes.push(<MessageThreadBox sellerBool={this.state.threads[i].props.sellerBool} active={active} onClick={this.props.clickThread} key={i} id={this.state.threads[i].props.id} />);
		}

		return (
			<div className="message-list">
				{threadBoxes}
			</div>
		);
	}
}

export default MessageList;
