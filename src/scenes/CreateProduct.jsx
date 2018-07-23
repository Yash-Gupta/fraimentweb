import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './css/CreateProduct.css';
import * as firebase from 'firebase';
import axios from 'axios';


/* COMPONENTS */

class CreateProduct extends Component {

	componentWillMount(){
		this.props.updateHeader(false);
	}

	constructor(props){
		super(props);

		this.state = {
			title:"",
			category: "",
			size: "",
			brand: "",
			price: "",
			description: "",
			image: null
		}

		this.handleChange = this.handleChange.bind(this);
		this.createProduct = this.createProduct.bind(this);
		this.addImage = this.addImage.bind(this);
	}

	addImage(event){
		var currentImages = this.state.images;
		currentImages.push("");
		this.setState({images: currentImages});
	}

	createProduct(event){
		event.preventDefault();
		// take from state and get firebase structure and post
		var newProduct = {
			author: this.props.currentUser.uid,
			name: this.state.title,
			category: this.state.category,
			size: this.state.size,
			designer: this.state.brand,
			price: this.state.price,
			description: this.state.description,
			imageurl: "",
			timestamp: (new Date()).getTime(),
			active: true,
			lowercaseName: this.state.title.toLowerCase(),

		};

		var productID = firebase.database().ref().child('listings').push().key;
		var self = this;
		firebase.storage().ref().child(productID).put(this.state.image).then(function (snapshot){
			newProduct.imageurl = snapshot.downloadURL;
			var uploadProduct = {};
			uploadProduct['/listings/' + productID] = newProduct;
			uploadProduct['/users/' + self.props.currentUser.uid + '/listings/' + productID] = true;
			firebase.database().ref().update(uploadProduct);
			window.location = "/";
		}, function(error){console.log(error.message);}, function(){

		});
	}

	handleChange(event){
		switch (event.target.name) {
			case 'title':
			this.setState({title: event.target.value});
			break;
			case 'brand':
			this.setState({brand: event.target.value});
			break;
			case 'size':
			this.setState({size: event.target.value});
			break;
			case 'category':
			this.setState({category: event.target.value});
			break;
			case 'shipping':
			this.setState({shipping: event.target.value});
			break;
			case 'description':
			this.setState({description: event.target.value});
			break;
			case 'price':
			this.setState({price: event.target.value});
			break;
			case 'image':
			this.setState({image: event.target.files[0]});
			break;
			default:
			break;
		}
	}

	render() {
		return (
			<div className="create-product-container">
				<form onSubmit={this.createProduct}>
					<div>
						<label>Item Name</label>
						<input onChange={this.handleChange} className="create-product-input" type="text" placeholder="title" name="title" />
					</div>
					<div>
						<label>Brand</label>
						<input onChange={this.handleChange} className="create-product-input" type="text" placeholder="brand" name="brand" />
					</div>
					{/*<div>
						<label>Type</label>
						<input onChange={this.handleChange} className="create-product-input" type="text" placeholder="category" name="category" />
					</div>*/}
					<div>
						<label>Size</label>
						<select onChange={this.handleChange} className="create-product-input" type="text" placeholder="size" name="size">
							<option value="XS">XS</option>
							<option value="S">S</option>
							<option value="M">M</option>
							<option value="L">L</option>
							<option value="XL">XL</option>
						</select>
					</div>
					<div>
						<label>Price (USD)</label>
						<input onChange={this.handleChange} className="create-product-input" type="number" placeholder="price" name="price" />
					</div>
					<div>
						<label>Description</label>
						<textarea onChange={this.handleChange} className="create-product-input" type="text" placeholder="description" name="description"></textarea>
					</div>
					<div>
						<label>Add Image</label>
						<input onChange={this.handleChange} className="create-product-input" accept="image/*" capture="camera" type="file" placeholder="file" name="image" />
					</div>
					<div className="submitDiv">
						<input type="submit" className="create-product-submit" value="Create Listing" />
					</div>
				</form>
			</div>
		);
	}
}

export default withRouter(CreateProduct);
