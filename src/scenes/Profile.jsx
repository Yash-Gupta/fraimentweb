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
		firebase.database().ref('/users/' + 'Vkv3ORi8oVXouzgEQdpgJ7Og7X52').once("value").then((snapshot) => {
			
			console.log("listings_bought");


			
			snapshot.forEach(function(data){
				var userData = snapshot.val();

				if(data.val()){


					var boughtListKeys = Object.keys(userData.listings_bought);

					for(var i = 0; i < boughtListKeys.length; i++){
						self.loadListingInfo(boughtListKeys[i], self, "bought");
					}


					var soldListKeys = Object.keys(userData.listings_sold);

					for(var i = 0; i < soldListKeys.length; i++){
						self.loadListingInfo(soldListKeys[i], self, "sold");
					}


					
					

				}
			});
		});

		

		console.log(this.state.bought);
	}

	loadListingInfo(listingID, self, type){

		firebase.database().ref('/listings/' + listingID).once("value").then((snapshot) => {
            var data = snapshot.val();
           
            var temp = {};
            temp.id = listingID;
            temp.title = data.name;
            temp.size = data.size;
            temp.price = data.price;
            temp.imageurl = data.imageurl;

            console.log(data);

            if(type == "bought"){
            	var boughtListings = self.state.bought;
				console.log(boughtListings);
				boughtListings.push(temp);

				self.setState({bought: boughtListings});
				console.log(self.state.bought);
            }else if(type == "sold"){
            	var soldListings = self.state.sold;
				console.log(soldListings);
				soldListings.push(temp);

				self.setState({sold: soldListings});
				console.log(self.state.sold);
            }

           

        });		

	}

	render() {
	
		
		


		return (
			<div>
				<div className = "boughtItems">
					<h1>Bought Listings: </h1>
					<div className="products">
						
						{this.state.bought.map((l) => {
							return (<ProductBox id={l.id} image={l.imageurl} title={l.title} size={l.size} price={l.price}/>);
						})}
					</div>


					<h1>Sold Listings: </h1>
					<div className="products">
						
						{this.state.sold.map((l) => {
							return (<ProductBox id={l.id} image={l.imageurl} title={l.title} size={l.size} price={l.price}/>);
						})}
					</div>
				</div>
				
			</div>
		);
	}
}

export default withRouter(Profile);





