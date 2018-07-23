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
			listings: [],
			currentQuery: "",
			
		}


		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
		this.defaultListingLoad = this.defaultListingLoad.bind(this);
	}

	handleSearchChange(event) {
		this.setState({currentQuery: event.target.value});
	}

	handleSearchSubmit(event) {
		this.setState({listings: []});
		var self = this;

		if(this.state.currentQuery.length == 0) {
			this.defaultListingLoad();
			return;
		}

		firebase.database().ref("listings").orderByChild('lowercaseName').startAt(this.state.currentQuery.toLowerCase()).endAt(this.state.currentQuery.toLowerCase() + "\uf8ff").once("value").then(function(listings){
			listings.forEach(function(listing){
				var temp = {};
				temp.id = listing.key;
				temp.title = listing.child("name").val();
				temp.size = listing.child("size").val();
				temp.price = listing.child("price").val();
				temp.imageurl = listing.child("imageurl").val();
				temp.brand = listing.child("designer").val();
				temp.timestamp = listing.child("timestamp").val();

				var currentListings = self.state.listings;
				currentListings.push(temp);

				self.setState({listings: currentListings});
			});
		});

		event.preventDefault();

		console.log(this.state.listings);
	}


	defaultListingLoad() {
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
				temp.timestamp = listing.child("timestamp").val();

				var currentListings = self.state.listings;
				if(listing.child("active").val()){
					currentListings.push(temp);
					self.setState({listings: currentListings});
				}
			});
		});
	}

	componentWillMount(){
		this.props.updateHeader(false);
		

		this.defaultListingLoad();

		
	}

	render() {
		return (
			<div className="main-container">


				<div className = "search-container">
					<form>
						<input className = "searchField" placeholder = "search" type="text" onChange = {this.handleSearchChange}/>
						<button className= "searchButton" onClick = {this.handleSearchSubmit} > browse</button>
					</form>

				</div>
				{/* Search Box + Filter + Sort By */}
				<div className = "main-listings">
					<div className="products">
						{this.state.listings.map((l) => {
					
							return (<ProductBox key={l.id} id={l.id} image={l.imageurl} title={l.title} size={l.size} price={l.price} brand={l.brand} timestamp={l.timestamp}/>);
						})}
					</div>
				</div>

				






			</div>
		);
	}
}

export default Main;
