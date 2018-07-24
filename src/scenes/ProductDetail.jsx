import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as firebase from 'firebase';
import './css/ProductDetail.css';

/* COMPONENTS */


class ProductDetail extends Component {
	constructor(props){
		super(props);
		this.state = {
			listing: [],
			id: this.props.match.params.id,
			author:[],
			name: "",
			category: "",
			size: "",
			designer: "",
			price:"",
			description:"",
			imageurl:"",
			author_uid: "",
			author_username: "",
			author_loc: "",
			author_img: "",
			images: [],
			activeImageIndex: 0,
		}

		this.messageClick = this.messageClick.bind(this);
		this.changeActiveImg = this.changeActiveImg.bind(this);
	}

	messageClick(event){
		window.location = "/messages/" + this.state.author_uid;
	}

	changeActiveImg(event){
		var changeTo = event.currentTarget.id;
		console.log(event.currentTarget.id);
		this.setState({activeImageIndex: parseInt(changeTo)});
	}

	componentWillMount() {
		firebase.database().ref('/listings/' + this.state.id).once("value").then((snapshot) => {
			var x = snapshot.val();
			firebase.database().ref('/users/' + x.author).once("value").then((userSnap) => {
				this.setState({"author_img": userSnap.child("profilepic").val(), "author_uid": x.author,"author_username": userSnap.val().username, "author_loc": userSnap.val().location});
			});
			var x = snapshot.val();
			var images = [];
			var counter = 0;
			snapshot.child("images").forEach(function (image){
				images.push({url: image.val(), index: counter});
				counter++;
			});
			this.setState({name: x.name, category: x.category, size: x.size, designer: x.designer, price:x.price, description:x.description, mainImg: x.imageurl, images: images});
		});
	}


	render(){
		console.log(this.state.images[this.state.activeImageIndex]);
		console.log(this.state.activeImageIndex);
		if(this.state.images[this.state.activeImageIndex] == null) var imageUrl = "";
		else var imageUrl = this.state.images[this.state.activeImageIndex].url;
		var backgroundStyles = {
			backgroundImage: "url(" + imageUrl + ")",
			backgroundSize:'contain',
			backgroundRepeat: 'no-repeat',
			fontWeight:'bold'
		};

		return (
			<div className="productdetail-container">
				<div className = "productDetailBigImg" style={backgroundStyles}>
				</div>

				<div className = "productDetailPreview">
					{this.state.images.map((l) => {

						if(this.state.images[this.state.activeImageIndex].url == l.url){
							var background = {
								backgroundImage: "url(" + l.url + ")",
								border: "4px solid black"
							};
						} else{
							var background = {
								backgroundImage: "url(" + l.url + ")"
							};
						}

						return (
							<div onClick={this.changeActiveImg} id={l.index} key={l.index} className = "productPreviewImg" style={background}></div>
						)
					})}
				</div>

				<div className = "productDetailContent">

					<p className = "prodTitle">{this.state.name}</p>
					<p className= "product prodSize"> {this.state.size}</p>
					<p className= "product prodPrice">${this.state.price}</p>
					<p className= "product">{this.state.description}</p>

					<button onClick={this.messageClick} className = "buyBtn">MAKE OFFER</button>
					<button onClick={this.messageClick} className = "messageBtn">MESSAGE</button>

					<div className = "profileHolder">
						<div className = "profImg"><img src={this.state.author_img}></img></div>
						<div className = "profContent">
							<p className = "profUser">{this.state.author_username}</p>
							<p className = "profLoc">{this.state.author_loc}</p>

						</div>
					</div>

				</div>
			</div>

		);
	}
}

var id = -1;
export default ProductDetail;
