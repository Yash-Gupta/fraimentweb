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
			currentlySelected: {
				brand: "",
				gender:"",

			}

		}

		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
		this.defaultListingLoad = this.defaultListingLoad.bind(this);
		this.brandRadioChange = this.brandRadioChange.bind(this);
		this.genderRadioChange = this.genderRadioChange.bind(this);
	
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
	}


	defaultListingLoad() {
		var self = this;
		firebase.database().ref("listings").orderByChild("timestamp").once("value").then(function(listings){
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

	brandRadioChange(event) {
		var currentlySelected = {...this.state.currentlySelected};
		if(currentlySelected.brand == event.target.value){
			currentlySelected.brand = "";
		} else{
			currentlySelected.brand = event.target.value;
		}
		
		this.setState({currentlySelected});
	}

	genderRadioChange(event) {
		var currentlySelected = {...this.state.currentlySelected};
		if(currentlySelected.gender == event.target.value){
			currentlySelected.gender = "";
		} else{
			currentlySelected.gender = event.target.value;
		}
		
		this.setState({currentlySelected});
	}





	componentWillMount(){
		this.props.updateHeader(false);
		this.defaultListingLoad();
	}

	render() {


		var productBoxes = [];

		var filteredListing = l => {
			//brands
			var filters = this.state.currentlySelected;
			if(filters.brand && l.brand != filters.brand){
				return false;
			}
			if(filters.gender && l.gender != filters.gender){
				return false;
			}
			return true;

		}

		this.state.listings.map((l) => {
			if(filteredListing(l)){
				productBoxes.push(<ProductBox key={l.id} id={l.id} image={l.imageurl} title={l.title} size={l.size} price={l.price} brand={l.brand} timestamp={l.timestamp}/>);
			}
		})



		return (
			<div className="main-container">
				<div className = "search-container">
					<form>
						<input className = "searchField" placeholder = "search" type="text" onChange = {this.handleSearchChange}/>
						<button className= "searchButton" onClick = {this.handleSearchSubmit} > browse</button>
					</form>

				</div>
				{/* Search Box + Filter + Sort By */}
				<div className = "list-filter-container">

					<div className = "main-filters">
						<p className= "filterHeader">filters:</p>
						<div className = "filterHr"> </div>

						<div className = "filterType brands"> 
							<p className = "filterHeader filter-subheader">BRANDS</p>
							 <label className = "filterName">
					            <input
					              type="radio"
					              value="Supreme"
					              checked={this.state.currentlySelected.brand == "Supreme"}
					              onClick={this.brandRadioChange}
					            />
					            Supreme
					          </label><br />
					          <label className = "filterName">
					            <input
					              type="radio"
					              value="Gucci"
					              checked={this.state.currentlySelected.brand == "Gucci"}
					              onClick={this.brandRadioChange}
					            />
					            Gucci
					          </label><br />
					          <label className = "filterName">
					            <input
					              type="radio"
					              value="testbrand"
					              checked={this.state.currentlySelected.brand == "testbrand"}
					              onClick={this.brandRadioChange}
					            />
					            testbrand
					          </label><br />
						</div>


						<div className = "filterType gender"> 
							<p className = "filterHeader filter-subheader">GENDER</p>
							 <label className = "filterName">
					            <input
					              type="radio"
					              value="Female"
					              checked={this.state.currentlySelected.gender == "Female"}
					              onClick={this.genderRadioChange}
					            />
					            Female
					          </label><br />
					          <label className = "filterName">
					            <input
					              type="radio"
					              value="Male"
					              checked={this.state.currentlySelected.gender == "Male"}
					              onClick={this.genderRadioChange}
					            />
					            Male
					          </label><br />
					          <label className = "filterName">
					            <input
					              type="radio"
					              value="Unisex"
					              checked={this.state.currentlySelected.gender == "Unisex"}
					              onClick={this.genderRadioChange}
					            />
					            Unisex
					          </label><br />
						</div>

					</div>
					<div className = "main-listings">
						<div className="products">
							{productBoxes}
						</div>
					</div>


				</div>
				
			</div>
		);
	}
}

export default Main;
