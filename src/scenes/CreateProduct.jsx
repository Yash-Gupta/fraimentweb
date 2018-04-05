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
		    imageurl: "",
		};

		axios.get("http:\/\/34.216.98.242:3000/getByEmail?email="+ this.props.currentUser.email).then(res => {
        	newProduct.author = res.data.uid;

			//upload file then upload all to firebase
        	var productID = firebase.database().ref().child('listings').push().key;

			firebase.storage().ref().child(productID).put(this.state.image).then(function (snapshot){
				newProduct.imageurl = snapshot.downloadURL;
				var uploadProduct = {};
				uploadProduct['/listings/' + productID] = newProduct;
	
				firebase.database().ref().update(uploadProduct);
	
			}, function(error){console.log(error.message);}, function(){
				
			});
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
				//update image
				/*var image = document.getElementById("previewPic");
				var reader = new FileReader();

        		reader.onload = function (e) {
        		   image.setAttribute('src', e.target.result);
        		}
       			reader.readAsDataURL(event.target.files[0])
				*/
				this.setState({image: event.target.files[0]});
				break;

			default:
				break;
		}
	}

	render() {
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
					<input onChange={this.handleChange} className="create-product-input" type="file" placeholder="file" name="image" />

					<input type="submit" />
				</form>
			</div>
		);
	}
}

export default withRouter(CreateProduct);
