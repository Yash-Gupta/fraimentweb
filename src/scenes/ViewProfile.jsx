import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as firebase from 'firebase';

/* COMPONENTS */
import ProductBox from '../components/ProductBox';

class ViewProfile extends Component{
	constructor(props){
		super(props);
		this.state = {
			id: this.props.match.params.id,
			bought:[],
			sold:[],
			username: "",
			email: "",
			profPic: "",
			location: "", 
			imgURL: ""
		}

		this.loadProfDetails = this.loadProfDetails.bind(this);
		this.loadListingInfo = this.loadListingInfo.bind(this);

	}

	componentWillMount() {
		this.props.updateHeader(false);
		this.loadProfDetails();	
	}


	loadProfDetails(){
		var uid = this.state.id;
		var self = this;


		firebase.database().ref('/users/' + uid).once("value").then((snapshot) => {
			var userData = snapshot.val();


			self.setState({username: userData.username});
			self.setState({email: userData.email});
			self.setState({profPic: userData.profilepic});
			self.setState({imgURL: userData.profilepic});
			self.setState({location: userData.location});
			
			snapshot.forEach(function(data){
				if(data.val()){
					var boughtListKeys = Object.keys(userData.listings_bought);
					for(var i = 0; i < boughtListKeys.length; i++){
						self.loadListingInfo(boughtListKeys[i], self, "bought");
						console.log(self.state.bought);
					}

					var soldListKeys = Object.keys(userData.listings_sold);
					for(var i = 0; i < soldListKeys.length; i++){
						self.loadListingInfo(soldListKeys[i], self, "sold");
					}
				}
			});
		});
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

            if(type == "bought"){
            	var boughtListings = self.state.bought;
				boughtListings.push(temp);

				self.setState({bought: boughtListings});
				console.log(self.state.bought);
            }else if(type == "sold"){
            	var soldListings = self.state.sold;
				soldListings.push(temp);

				self.setState({sold: soldListings});
            }
        });
	}

	render() {
		return (
			<div className = "profilePage">
				<div className="profile-container">

					<h1>Bought Listings: </h1>
					<div className="products">
						
						{this.state.bought.map((l) => {
							return (<ProductBox key={l.id} id={l.id} image={l.imageurl} title={l.title} size={l.size} price={l.price}/>);
						})}
					</div>


					<h1>Sold Listings: </h1>
					<div className="products">
						
						{this.state.sold.map((l) => {
							return (<ProductBox key={l.id} id={l.id} image={l.imageurl} title={l.title} size={l.size} price={l.price}/>);
						})}
					</div>

					<h1>Profile Details: </h1>

					<p>username: {this.state.username}</p>
					<p>location: {this.state.location}</p>
					<img src = {this.state.imgURL} width = "50" height = "50" />

					
				</div>
			</div>
		);
	}

}

export default ViewProfile;

