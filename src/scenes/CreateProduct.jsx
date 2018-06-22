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
			images: [""]
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
			author: "",
			name: this.state.title,
			category: this.state.category,
			size: this.state.size,
			designer: this.state.brand,
			price: this.state.price,
			description: this.state.description,
			images: {},
		};

		axios.get("http:\/\/34.216.98.242:3000/getByEmail?email="+ this.props.currentUser.email).then(res => {
			newProduct.author = res.data.uid;

			//upload file then upload all to firebase
			var productID = firebase.database().ref().child('listings').push().key;
			for(var i = 0; i < this.state.images.length; i++){
				firebase.storage().ref().child(productID + "-" + i.toString()).put(this.state.image).then(function (snapshot){
					newProduct.images[i.toString()] = snapshot.downloadURL;
				});
			}

			var uploadProduct = {};
			uploadProduct['/listings/' + productID] = newProduct;

			firebase.database().ref().update(uploadProduct);
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
			this.setState({images: event.target.files});
			break;
			default:
			break;
		}
	}

	render() {
		var imgInputs = [];
		for (var i = 0; i < this.state.images.length; i++) {
			imgInputs.push(<input onChange={this.handleChange} className="create-product-input" type="file" placeholder="file" name={"image" + i} />)
		}

		return (
			<div>
				<form onSubmit={this.createProduct}>
					<input onChange={this.handleChange} className="create-product-input" type="text" placeholder="title" name="title" />
					<input onChange={this.handleChange} className="create-product-input" type="text" placeholder="brand" name="brand" />
					<input onChange={this.handleChange} className="create-product-input" type="text" placeholder="size" name="size" />
					<input onChange={this.handleChange} className="create-product-input" type="text" placeholder="category" name="category" />
					<input onChange={this.handleChange} className="create-product-input" type="text" placeholder="shipping" name="shipping" />
					<textarea onChange={this.handleChange} className="create-product-input" type="text" placeholder="description" name="description"></textarea>
					<input onChange={this.handleChange} className="create-product-input" type="number" placeholder="price" name="price" />
					{imgInputs}
					<input onClick={this.addImage} className="create-product-input" type="button" name="addimage" value="Add picture"/>
					<input type="submit" />
				</form>
			</div>
		);
	}
}

export default withRouter(CreateProduct);
