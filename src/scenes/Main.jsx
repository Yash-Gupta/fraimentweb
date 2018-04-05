import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/Main.css';
import * as firebase from 'firebase';

/* COMPONENTS */
import ProductBox from '../components/ProductBox';

class Main extends Component {
	constructor(props){
		super(props);
		this.state = {
			listings: []
		}
	}

	componentWillMount(){
		this.props.updateHeader(false);

		var self = this;
		firebase.database().ref("listings").once("value").then(function(listings){
			listings.forEach(function(listing){
				var temp = {};
				temp.id = listing.key;
				temp.title = listing.child("name").val();
				temp.size = listing.child("size").val();
				temp.price = listing.child("price").val();
				temp.imageurl = listing.child("imageurl").val();
				temp.brand = listing.child("designer").val();
 
				var currentListings = self.state.listings;
				currentListings.push(temp);

				self.setState({listings: currentListings});
			});
		});
	}

	render() {
		console.log(this.state.listings);
		return (
			<div className="main-container">
				{/* Search Box + Filter + Sort By */}
				<div className="products">
					{this.state.listings.map((l) => {
						return (<ProductBox id={l.id} image={l.imageurl} title={l.title} size={l.size} price={l.price} brand={l.brand}/>);
					})}
				</div>
			</div>
		);
	}
}

export default Main;
