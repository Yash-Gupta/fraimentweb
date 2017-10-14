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
		
		console.log("id: " + props.match.params.id);

		this.state = {
			listing: [],
			id:[props.match.params.id],
		}


       
		//this.handleChange = this.handleChange.bind(this);
		//this.createListing = this.createListing.bind(this);
	}
	componentWillMount() {
		var initialValue = false;
		firebase.database().ref('/listings').once("value").then((snapshot) => {
            snapshot.forEach((data) => {
            	var listings = this.state.listing;
            	var temp = data.val();
            	temp.id = Object.keys(snapshot.val())[0];
            	listings.push(temp);
            	this.setState({listing: listings});
            	console.log("is it working");
            });
            initialValue = true;
        });

        console.log("state: " + this.state);
		
	}
	
	
	render(){
		var images = []; //needs to contain all images for one listing
		var details = []; //has all information
		
		this.state.listing.map((x, i) => {

			var styles = {
				backgroundImage: "url(" + x.imageurl + ")",
				backgroundSize:'cover',
				fontWeight:'bold'
			};

			var id = "";



			if(x.id == this.state.id){
				console.log("fk yeah");
				console.log(x.id);
				images.push(
				<div key={i} className ="col-md-12 " id = "">

					
					<div className = "img-holder" style={styles}>
						</div>
						
						
				

				</div>
			);
			}

			
		})

		this.state.listing.map((x, i) => {

		

		



			if(x.id == this.state.id){
				console.log("fk yeah");
				console.log(x.id);
				details.push(
				<div key={i} className ="col-md-12 " id = "">

				
						
						<p className="product prodTitle">Name: {x.name}</p>
						<p className="product prodDesc">Description: {x.description}</p>
						<p className="product prodAuthor">Author: {x.author}</p>
						<p className= "product prodSize">Size: {x.size}</p>
						<p className= "product prodPrice">Price: {x.price}</p>
						

						<div className = "buyBtn">
							<p className = "buyit">BUY</p>
						</div>

						<hr />

						<p className = "useless">Category: {x.category}</p>
						<p className = "useless">Id: {x.id}</p>
				

				</div>
			);
			}

			
		})

		return (
			<div>
				<div className="container">
					<div className="row home">
						<div className="col-md-6">
							<p>{images}</p>
						</div>
						<div className="col-md-6 ">
							<p>{details}</p>
							

						
							{/*<div id = "itemrow" className= "row">
								<script src="https://use.fontawesome.com/8130789d52.js"></script>
								<link href="https://use.fontawesome.com/8130789d52.css" media="all" rel="stylesheet"></link>
								
								 {rows}
							</div>*/}
						</div>
					</div>
				</div>
			</div>

		);
	}
}

export default AllListings;