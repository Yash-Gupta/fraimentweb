import React, { Component } from 'react';
import * as firebase from 'firebase'

class CreateListing extends Component {

	constructor(props){
		super(props);
		this.state = {
			name: "",
			author: "",
			price: "",
			image: "",
		}



		this.handleChange = this.handleChange.bind(this);
		this.createListing = this.createListing.bind(this);
	}

	createListing(event){
		event.preventDefault();
		var name = this.state.name;
		var author = this.state.author;
		var price = this.state.price;
		var image = this.state.image;
		console.log(image);
		var postData = {
		    name: name,
		    author: author,
		    price: price,
		    imageurl: "",
		 };

		 // Get a key for a new Post.
		var newPostKey = firebase.database().ref().child('listings').push().key;
		

		firebase.storage().ref().child(newPostKey).put(image).then(function (snapshot){
			postData.imageurl = snapshot.downloadURL;
			var updates = {};
			updates['/listings/' + newPostKey] = postData;

			firebase.database().ref().update(updates);

		}, function(error){}, function(){

		});

		
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
			case 'image':
				//console.log(event.target.files[0]);
				this.setState({image: event.target.files[0]});
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

        		<label>
        		  Image:
        		  <input type="file" name="image" onChange={this.handleChange} />
        		</label>


        		<input type="submit" value="Submit" />
      		</form>
		);
	}
}

export default CreateListing;