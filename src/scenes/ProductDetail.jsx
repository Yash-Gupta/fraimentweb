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
			imageurl:""
		}
		console.log(this.state.id);
	}

	componentWillMount() {
		firebase.database().ref('/listings/' + this.state.id).once("value").then((snapshot) => {
            var x = snapshot.val();
            this.setState({name: x.name, category: x.category, size: x.size, designer: x.designer, price:x.price, description:x.description, imageurl: x.imageurl});
        });		
	}
	
	
	render(){
		var backgroundStyles = {
			backgroundImage: "url(" + this.state.imageurl + ")",
			backgroundSize:'cover',
			fontWeight:'bold'
		};
		
		return (
			<div>
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
						<button className = "messageBtn">MESSAGE</button>

						<div className = "profileHolder">
							<div className = "profImg"></div>
							<div className = "profContent">
								<p className = "profUser">AgentYash01</p>
								<p className = "profLoc">Chandigargh</p>
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
				{/*}
					<div className="row">
						<div className="col-md-8">
							<div className = "col-md-9">
								<div className = "img-holder"></div>
							</div>
							
							<div className = "col-md-3">
								<div className = "preview"></div>
								<div className = "preview"></div>
								<div className = "preview"></div>
							</div>
						</div>

						<div className="col-md-4 ">
							<p>
								<div className ="col-md-12 " id = "">
									<p className = "prodTitle">{this.state.name}</p>
									<p className= "product prodSize"><span className = "description">SIZE:</span> {this.state.size}</p>
									<p className= "product prodPrice">{this.state.price}</p>

									<button className = "buyBtn">BUY</button>
									<button className = "messageBtn">MESSAGE</button>

									<div className = "profileHolder">
										<div className = "profImg"></div>
										<div className = "profContent">
											<p className = "profUser">AgentYash01</p>
											<p className = "profLoc">Chandigargh</p>
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
							</p>
						</div>
					</div>

					<div className = " row ">
						<div className = "col-md-12 ">
							<div className = "descrip">
								<h1 className = "desname">Description</h1>
								<p className = "desPar">{this.state.description}</p>
							</div>
							
						</div>
						
					</div>
				</div>

				<hr />

				<center><h1 className = "relList">Related Listings</h1></center>*/}
			</div>

		);
	}
}

var id = -1;
export default ProductDetail;