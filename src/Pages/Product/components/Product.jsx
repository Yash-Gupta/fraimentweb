import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { render } from 'react-dom';
import {Router, Route} from 'react-router';
import * as firebase from 'firebase';
//import '../styles/Product.css';
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
		var rows = [];
		var cats = [];
		
		this.state.listing.map((x, i) => {

			var styles = {
				backgroundImage: "url(" + x.imageurl + ")",
				backgroundSize:'cover',
				fontWeight:'bold'
			};

			var id = "";



			if(x.id == this.state.id){
				console.log("fk yeah");
			}

			rows.push(
				<div key={i} className ="col-md-4 post" id = "post">

					<Link to={"/product/" + x.id + ""}>
						<div className = "img-holder" style={styles}>
						</div>
						<hr />
						<p className="postname">{x.name}</p>
						<p className= "postdesigner">{x.author}</p>
						<p className= "postprice">{x.price}</p>
						<p className = "postname">{x.category}</p>
					</Link>

				</div>
			);
		})
		return (
			<div>
				<div className="container">
					<div className="row home">
						<div className="col-md-3">
							<h1 className="cathead firstcat">CATEGORY</h1><hr></hr>
							
						</div>
						<div className="col-md-9 grid">
							<div className="itemsearch">
								<input id="itemfilter" className="filter" type="text" name="filter" placeholder="Search for all of your favorite brands" onkeyup="" />
								<div className="additional">
									<center>
									<p className="sortby">SORT BY</p>
									<i className="fa fa-refresh" aria-hidden="true"></i>
									</center>
								</div><br /><br /><br />
							</div>
							<hr></hr>

						
							<div id = "itemrow" className= "row">
								<script src="https://use.fontawesome.com/8130789d52.js"></script>
								<link href="https://use.fontawesome.com/8130789d52.css" media="all" rel="stylesheet"></link>
								
								 {rows}
							</div>
						</div>
					</div>
				</div>
			</div>

		);
	}
}

export default AllListings;