import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { render } from 'react-dom';
import {Router, Route} from 'react-router';
import * as firebase from 'firebase';
//import '../styles/Product.css';
import '../styles/Product.css';

import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

class AllListings extends Component {
	constructor(props){
		super(props);

		this.state = {
			listing: [],
			id:[props.match.params.id],
			name: "",
			category: "",
			size: "",
			designer: "",
			price:"",
			description:"",
			imageurl:""
		}
	}

	componentWillMount() {
		var initialValue = false;
		console.log(this.state.id);
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
				<div className="container">
					<div className="row home">
						<div className="col-md-6">
							<p>
								<div className ="col-md-12 " id = "">
									<div className = "img-holder" style={backgroundStyles}></div>
								</div>
							</p>
						</div>
						<div className="col-md-6 ">
							<p>
								<div className ="col-md-12 " id = "">
									<p className="product prodTitle">Name: {this.state.name}</p>
									<p className="product prodDesc">Description: {this.state.description}</p>
									<p className="product prodAuthor">Author: {this.state.author}</p>
									<p className= "product prodSize">Size: {this.state.size}</p>
									<p className= "product prodPrice">Price: {this.state.price}</p>
									
			
									<div className = "buyBtn">
										<p className = "buyit">BUY</p>
									</div>
			
									<hr />
			
									<p className = "useless">Category: {this.state.category}</p>
									<p className = "useless">Id: {this.state.id}</p>
								</div>
							</p>
						</div>
					</div>
				</div>
			</div>

		);
	}
}

export default AllListings;