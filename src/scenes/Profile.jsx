import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import * as firebase from 'firebase';



/* COMPONENTS */
import ProductBox from '../components/ProductBox';

const listBought = [];

class Profile extends Component {

	constructor(props){
		super(props);

		this.state = {
			bought: [],
			sold:[],
		}

		this.loadListings = this.loadListings.bind(this);
		this.loadListingInfo = this.loadListingInfo.bind(this);

	}

	componentWillMount(){
		this.props.updateHeader(false);
		this.loadListings();
		
	}

	loadListings(){
		var self = this;
		firebase.database().ref('/users/' + 'Vkv3ORi8oVXouzgEQdpgJ7Og7X52' + '/listings_bought').once("value").then((snapshot) => {
			console.log("listings_bought");
			
			snapshot.forEach(function(data){
				if(data.val()){
					console.log(data.key);
					self.loadListingInfo(data.key, self);	
				}
			});
		});

		console.log(this.state.bought);
	}

	loadListingInfo(listingID, self){

		firebase.database().ref('/listings/' + listingID).once("value").then((snapshot) => {
            var data = snapshot.val();
            //this.setState({name: x.name, category: x.category, size: x.size, designer: x.designer, price:x.price, description:x.description, imageurl: x.imageurl});
            var temp = {};
            temp.id = listingID;
            temp.title = data.name;
            temp.size = data.size;
            temp.price = data.price;
            temp.imageurl = data.imageurl;

            console.log(data);

            var boughtListings = self.state.bought;
			console.log(boughtListings);
			boughtListings.push(temp);

			//	self.state.bought = boughtListings;
			self.setState({bought: boughtListings});
			console.log(self.state.bought);
        });		

	}

	render() {
		console.log(this.state.bought);

		var boughtItems = [];
		//for(var i = 0; i < 1; i++){
		for(var i = 0; i < this.state.bought.length; i++){
			boughtItems.push(<ProductBox id={this.state.bought[i].id} image={this.state.bought[i].imageurl} title={this.state.bought[i].title} size={this.state.bought[i].size} price={this.state.bought[i].price}/>);
		}

		return (
			<div>
				<div className = "boughtItems">
					<h1>Bought Listings: </h1>
					<div className="products">
						{boughtItems}

					</div>
				</div>
				
			</div>
		);
	}
}

export default withRouter(Profile);





