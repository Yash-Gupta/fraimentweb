import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as firebase from 'firebase';
import './css/ProductDetail.css';

/* COMPONENTS */
import ProductBox from '../components/ProductBox';

class ProductDetail extends Component {
	constructor(props){
		super(props);
		this.state = {
			listing: [],
			id: this.props.match.params.id,
			name: "",
			category: "",
			size: "",
			designer: "",
			price:"",
			description:"",
			imageurl:"",
			author_uid: "",
			author_username: "",
			author_loc: ""
		}

		this.messageClick = this.messageClick.bind(this);
	}

	messageClick(event){
		window.location = "/messages/" + this.state.author_uid;
	}

	componentWillMount() {
		firebase.database().ref('/listings/' + this.state.id).once("value").then((snapshot) => {
			var x = snapshot.val();
			firebase.database().ref('/users/' + x.author).once("value").then((userSnap) => {
				this.setState({"author_uid": x.author,"author_username": userSnap.val().username, "author_loc": userSnap.val().location});
			});

			this.setState({name: x.name, category: x.category, size: x.size, designer: x.designer, price: x.price, description: x.description, imageurl: x.imageurl});
		});
	}

	render(){
		var backgroundStyles = {
			backgroundImage: "url(" + this.state.imageurl + ")",
			backgroundSize:'cover',
			fontWeight:'bold'
		};

		return (
			<div className="productdetail-container">
				<div className = "productDetailBigImg" style={backgroundStyles}>
				</div>

				<div className = "productDetailPreview">
					<div className = "productPreviewImg">
					</div>

					<div className = "productPreviewImg">
					</div>

					<div className = "productPreviewImg">
					</div>
				</div>

				<div className = "productDetailContent">

					<p className = "prodTitle">{this.state.name}</p>
					<p className= "product prodSize"> {this.state.size}</p>
					<p className= "product prodPrice">{this.state.price}</p>

					<button className = "buyBtn">BUY</button>
					<button onClick={this.messageClick} className = "messageBtn">MESSAGE</button>

					<div className = "profileHolder">
						<div className = "profImg"></div>
						<div className = "profContent">
							<p className = "profUser">{this.state.author_username}</p>
							<p className = "profLoc">{this.state.author_loc}</p>
							<div className = "rating">
								<div className = "star"></div>
								<div className = "star"></div>
								<div className = "star"></div>
								<div className = "star"></div>
								<div className = "starOutline"></div>
							</div>
						</div>
					</div>

				</div>
			</div>

		);
	}
}

var id = -1;
export default ProductDetail;
