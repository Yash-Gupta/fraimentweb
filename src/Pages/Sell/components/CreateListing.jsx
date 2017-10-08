import React, { Component } from 'react';
import * as firebase from 'firebase'

class CreateListing extends Component {

	constructor(props){
		super(props);
		this.state = {
			name: "",
			author: "",
			price: "",
			imageurl: ""
		}

		this.handleChange = this.handleChange.bind(this);
		this.createListing = this.createListing.bind(this);
	}

	createListing(){
		var name = this.state.name;
		var author = this.state.author;
		var price = this.state.price;
		var imageurl = this.state.imageurl;
		var postData = {
		    name: name,
		    author: author,
		    price: price,
		 };
	
		 // Get a key for a new Post.
		 var newPostKey = firebase.database().ref().child('listings').push().key;
	
		 // Write the new post's data simultaneously in the posts list and the user's post list.
		 var updates = {};
		 updates['/listings/' + newPostKey] = postData;

		 return firebase.database().ref().update(updates);
	}

	handleChange(event){
		switch (event.target.name) {
			case 'name':
				this.setState({name: event.target.value});
				break;

			case 'author':
				this.setState({author: event.target.value});
				break;

			case 'price':
				this.setState({price: event.target.value});
				break;
			default:
				break;
		}
	}

	render(){
		return (
			<form onSubmit={this.createListing}>
        		<label>
        		  Name:
        		  <input type="text" name="name" onChange={this.handleChange} value={this.state.name} />
        		</label>
        		<label>
        		  Author:
        		  <input type="text" name="author" onChange={this.handleChange} value={this.state.author} />
        		</label>
        		<label>
        		  Price:
        		  <input type="text" name="price" onChange={this.handleChange} value={this.state.price} />
        		</label>
        		<input type="submit" value="Submit" />
      		</form>
		);
	}
}

export default CreateListing;