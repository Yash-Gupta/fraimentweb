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
			currentlySelected: {},
			mobileFiltersActive: false,
		}

		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
		this.defaultListingLoad = this.defaultListingLoad.bind(this);
		this.radioChange = this.radioChange.bind(this);
		this.toggleMobileFilters = this.toggleMobileFilters.bind(this);
	}

	toggleMobileFilters(event){
		event.preventDefault();
		this.setState({mobileFiltersActive: !this.state.mobileFiltersActive});
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
				temp.brand = listing.child("brand").val();
				temp.type = listing.child("type").val();
				temp.gender = listing.child("gender").val();
				temp.condition = listing.child("condition").val();
				temp.timestamp = listing.child("timestamp").val();

				var currentListings = self.state.listings;
				if(listing.child("active").val()){
					currentListings.push(temp);
					self.setState({listings: currentListings});
				}
			});
		});
	}

	radioChange(event){
		var currentlySelected = {...this.state.currentlySelected};
		if(currentlySelected[event.target.getAttribute("filter")] == event.target.value){
			currentlySelected[event.target.getAttribute("filter")] = "";
		} else{
			currentlySelected[event.target.getAttribute("filter")] = event.target.value;
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
			var filters = this.state.currentlySelected;
			if(filters.brand && l.brand != filters.brand){
				return false;
			} if(filters.gender && l.gender != filters.gender){
				return false;
			} if(filters.type && l.type != filters.type){
				return false;
			} if(filters.condition && l.condition != filters.condition){
				return false;
			} if(filters.size && l.size != filters.size){
				return false;
			}

			return true
		}

		this.state.listings.map((l) => {
			if(filteredListing(l)){
				productBoxes.push(<ProductBox key={l.id} id={l.id} image={l.imageurl} title={l.title} size={l.size} price={l.price} brand={l.brand} timestamp={l.timestamp}/>);
			}
		})

		var mobileClass = "main-filters";
		if(!this.state.mobileFiltersActive){
			mobileClass += " inactive";
		}

		return (
			<div className="main-container">
				<div className ={mobileClass}>
					<div className="blackFilters">
					<p onClick={this.toggleMobileFilters} className="closefilters"><i className="fas fa-times-circle"></i></p>
					{this.props.filters.map((l) => {
						return (
							<div className = {"filterType " + l.name} key={l.name}>
								<p className = "filterHeader filter-subheader">{l.text}</p>
								{l.items.map((z) => {
										return (
											<div key={z}>
												<label className = "filterName">
													<input key = {l.name} filter={l.name} type="radio" value={z} checked={this.state.currentlySelected[l.name] == z} onClick={this.radioChange} />
													{z}
												</label>
												<br/>
											</div>
										)
								})}
							</div>
						);
					})}
					</div>
				</div>

				{/* Search Box + Filter + Sort By */}
				<div className = "list-filter-container">
					<div className = "search-container">
						<form>
							<input className = "searchField" placeholder = "search" type="text" onChange = {this.handleSearchChange}/>
							<button className= "searchButton" id="realSearch" onClick = {this.handleSearchSubmit}><i className="fas fa-search"></i></button>
							<button className= "searchButton" onClick={this.toggleMobileFilters}><i className="fas fa-filter"></i></button>
						</form>
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
