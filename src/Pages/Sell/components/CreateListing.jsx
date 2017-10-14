import React, { Component } from 'react';
import * as firebase from 'firebase'
import '../styles/CreateListing.css';


class CreateListing extends Component {

	constructor(props){
		super(props);
		this.state = {
			name: "",
			category: "",
			size: "",
			designer: "",
			price:"",
			description:"",
			image:"",
		}
		
		this.handleChange = this.handleChange.bind(this);
		this.createListing = this.createListing.bind(this);
	}

	createListing(event){
		event.preventDefault();
		var name = this.state.name;
		var category = this.state.category;
		var size = this.state.size;
		var designer = this.state.designer;
		var price = this.state.price;
		var description = this.state.description;
		var image = this.state.image;
		var postData = {
		    name: name,
		    category: category,
		    size: size,
		    designer: designer,
		    price: price,
		    description: description,
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
			case 'category':
				this.setState({category: event.target.value});
				break;
			case 'size':
				this.setState({size: event.target.value});
				break;
			case 'designer':
				this.setState({designer: event.target.value});
				break;
			case 'price':
				this.setState({price: event.target.value});
				break;
			case 'image':
				//update image
				var image = document.getElementById("previewPic");
				var reader = new FileReader();

        		reader.onload = function (e) {
        		   image.setAttribute('src', e.target.result);
        		}
       			reader.readAsDataURL(event.target.files[0])

				this.setState({image: event.target.files[0]});
				break;
			case 'description':
				this.setState({description: event.target.value});
			default:
				break;
		}
	}


	render(){
		return (
			<div className="container">
				<h1> Submit new listing </h1>
				<hr />

				<form onSubmit={this.createListing}>
					<div className="row">
						<div className="col-md-4">
							<img src="" id="previewPic" />
							<h2> Image Upload </h2>
							<input type="file" name="image" onChange={this.handleChange} />
						</div>
						<div className="col-md-8">
							<div className="row">
								<div className="col-md-6">
									<input className="form-control" placeholder="Item Name" type="text" name="name" onChange={this.handleChange} value={this.state.name} />
								</div>

								<div className="col-md-6">
									<input className="form-control" placeholder="Category" type="text" name="category" onChange={this.handleChange} value={this.state.category} />
								</div>
							</div>

							<div className="row">
								<div className="col-md-6">
									<input className="form-control" placeholder="Size" type="text" name="size" onChange={this.handleChange} value={this.state.size} />
								</div>

								<div className="col-md-6">
									<input className="form-control" placeholder="Designer" type="text" name="designer" onChange={this.handleChange} value={this.state.designer} />
								</div>
							</div>

							<div className="row">
								<div className="col-md-12">
									<input className="form-control" placeholder="Price" type="text" name="price" onChange={this.handleChange} value={this.state.price} />
								</div>
							</div>
							<div className="row" style={{"margin-bottom": '0px'}}>
								<div className="col-md-12">
									<textarea placeholder="Description" className="form-control" name="description" onChange={this.handleChange} value={this.state.description}></textarea>
								</div>
							</div>
						</div>
						<input  style={{"margin-top": '10px'}} type="submit" value="Submit" />

					</div>

      			</form>
      		</div>
		);
	}
}

export default CreateListing;