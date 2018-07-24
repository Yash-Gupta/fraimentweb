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
			title:"New Product",
			category: "",
			size: "XS",
			brand: "Adidas",
			gender: "Male",
			type: "Tops",
			condition: "Deadstock",
			price: "0.00",
			description: "",
			image: null,
			images: [],
			imageurls: []
		}

		this.handleChange = this.handleChange.bind(this);
		this.createProduct = this.createProduct.bind(this);
		this.addImage = this.addImage.bind(this);
		this.getFile = this.getFile.bind(this);
	}

	getFile(event){
		var id = event.currentTarget.id;
		document.getElementById("input-" + id).click();
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
			brand: this.state.brand,
			gender: this.state.gender,
			type: this.state.type,
			condition: this.state.condition,
			size: this.state.size,
			price: this.state.price,
			description: this.state.description,
			imageurl: "",
			timestamp: -(new Date()).getTime(),
			active: true,
			lowercaseName: this.state.title.toLowerCase(),
			images: {}
		};

		var productID = firebase.database().ref().child('listings').push().key;
		var self = this;
		var imageUrls = [];
		for(var i = 0; i < this.state.images.length; i++){
			firebase.storage().ref().child(productID).child("image" + i).put(this.state.images[i]).then(function (snapshot){
				console.log(snapshot.downloadURL);
				var updates = {}
				updates["/listings/" + productID + "/images/" + i] = snapshot.downloadURL;
				firebase.database().ref().update(updates);
			});
		}

		var uploadProduct = {};
		uploadProduct['/listings/' + productID] = newProduct;
		uploadProduct['/users/' + self.props.currentUser.uid + '/listings/' + productID] = true;
		firebase.database().ref().update(uploadProduct);
		window.location = "/";
	}

	handleChange(event){
		switch (event.target.name) {
			case 'title':
			this.setState({title: event.target.value});
			break;
			case 'brand':
			this.setState({brand: event.target.value});
			break;
			case 'gender':
			this.setState({gender: event.target.value});
			break;
			case 'type':
			this.setState({type: event.target.value});
			break;
			case 'condition':
			this.setState({condition: event.target.value});
			break;
			case 'size':
			this.setState({size: event.target.value});
			break;
			case 'description':
			this.setState({description: event.target.value});
			break;
			case 'price':
			this.setState({price: event.target.value});
			break;
			case 'image':
				var index = parseInt(event.target.id.split("-")[1]);
				var images = this.state.images;
				images[index] = event.target.files[0];
				this.setState({images: images});

				var reader = new FileReader();
				var url = "";
				var self = this;
				reader.onload = function (e) {
					url = e.target.result;
					var imageurls = self.state.imageurls;
					imageurls[index] = url
					self.setState({imageurls: imageurls});
				};

				reader.readAsDataURL(event.target.files[0]);
				break;
			default:
			break;
		}
	}

	render() {
		var fileInputs = [];
		for(var i = 0; i < 4; i++){
			var background = {
				backgroundImage: "url(" + this.state.imageurls[i] + ")",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				backgroundSize: "contain"
			}
			fileInputs.push(
				<div key={i} id={i} onClick={this.getFile} className="file-input-container" style={background}>
					<input onChange={this.handleChange} id={"input-" + i} className="create-product-input" accept="image/*" capture="camera" type="file" placeholder="file" name="image" />
					<div id={i}>+</div>
				</div>
			);
		}

		return (
			<div className="create-product-container">
				<form onSubmit={this.createProduct}>
					<div>
						<label>Item Name</label>
						<input onChange={this.handleChange} className="create-product-input" type="text" placeholder="title" name="title" />
					</div>
					{this.props.filters.map((l) => {
						return (
							<div key={l.name}>
								<label>{l.text2}</label>
								<select onChange={this.handleChange} className="create-product-input" type="text" placeholder={l.name} name={l.name}>
									{l.items.map((z) => {
										return (<option key={z} value={z}>{z}</option>);
									})}
								</select>
							</div>
						);
					})}
					<div>
						<label>Price (USD)</label>
						<input onChange={this.handleChange} className="create-product-input" type="number" placeholder="price" name="price" />
					</div>
					<div>
						<label>Description</label>
						<textarea onChange={this.handleChange} className="create-product-input" type="text" placeholder="description" name="description"></textarea>
					</div>
					<div className="big-files">
						<label>Add Images</label>
						{fileInputs}
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
