import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './css/Profile.css';
import * as firebase from 'firebase';

/* COMPONENTS */
import ProductBox from '../components/ProductBox';

class Profile extends Component {

	constructor(props){
		super(props);

		this.state = {
			bought: [],
			sold:[],
			username: "",
			email: "",
			profPic: "",
			location: "",
			imgURL: ""
		}

		this.loadProfDetails = this.loadProfDetails.bind(this);
		this.loadListingInfo = this.loadListingInfo.bind(this);
		this.editProfile = this.editProfile.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentWillMount(){
		this.props.updateHeader(false);
		this.loadProfDetails();
	}

	loadProfDetails(){
		var self = this;
		var uid = "";

		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				uid = user.uid;

				firebase.database().ref('/users/' + uid).once("value").then((snapshot) => {
					var userData = snapshot.val();

					self.setState({username: userData.username});
					self.setState({email: userData.email});
					self.setState({profPic: userData.profilepic});
					self.setState({imgURL: userData.profilepic});
					self.setState({location: userData.location});

					snapshot.forEach(function(data){
						if(data.val()){
							if(userData.listings_bought && userData.listings_sold){
								var boughtListKeys = Object.keys(userData.listings_bought);
								for(var i = 0; i < boughtListKeys.length; i++){
									self.loadListingInfo(boughtListKeys[i], self, "bought");
								}

								var soldListKeys = Object.keys(userData.listings_sold);
								for(var i = 0; i < soldListKeys.length; i++){
									self.loadListingInfo(soldListKeys[i], self, "sold");
								}
							}
						}
					});
				});
			} else {
				console.log("someone needs to sign in!");
			}
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
			}else if(type == "sold"){
				var soldListings = self.state.sold;
				soldListings.push(temp);

				self.setState({sold: soldListings});
			}
		});
	}

	editProfile(event){
		var self = this;

		firebase.auth().onAuthStateChanged(function(user) {
			var uid = user.uid;

			if(typeof self.state.profPic === 'string' ) {
				firebase.database().ref('users/' + uid).update({
					username: self.state.username,
					email: self.state.email,
					location: self.state.location,
					profilepic: self.state.profPic
				});
			}
			else{
				firebase.storage().ref().child(uid).put(self.state.profPic).then(function (snapshot){
					var newLink  = snapshot.downloadURL;
					firebase.database().ref('users/' + uid).update({
						username: self.state.username,
						email: self.state.email,
						location: self.state.location,
						profilepic: newLink
					});
				}, function(error){console.log(error.message);}, function(){});
			}
		});
	}

	handleChange(event){
		switch (event.target.name) {
			case 'username':
			this.setState({username: event.target.value});
			break;

			case 'email':
			this.setState({email: event.target.value});
			break;

			case 'location':
			this.setState({location: event.target.value});
			break;

			case 'image':
			this.setState({profPic: event.target.files[0]});

			var reader = new FileReader();
			var url = "";
			var a = this;
			reader.onload = function (e) {
				url = e.target.result;
				a.setState({imgURL: url});
			};

			reader.readAsDataURL(event.target.files[0]);
			break;

			default:
			break;
		}
	}

	render() {
		return (
			<div className = "profilePage">
			<div className="profile-container">

			<h1>Bought Listings </h1>
			<div className="products">

			{this.state.bought.map((l) => {
				return (<ProductBox key={l.id} id={l.id} image={l.imageurl} title={l.title} size={l.size} price={l.price}/>);
			})}
			</div>


			<h1>Sold Listings </h1>
			<div className="products">

			{this.state.sold.map((l) => {
				return (<ProductBox key={l.id} id={l.id} image={l.imageurl} title={l.title} size={l.size} price={l.price}/>);
			})}
			</div>

			<h1>Edit Profile</h1>


			<input onChange={this.handleChange} className="create-product-input" type="text" placeholder="username" value = {this.state.username} name="username" />
			<input onChange={this.handleChange} className="create-product-input" type="text" placeholder="email" value = {this.state.email} name="email" />
			<input onChange={this.handleChange} className="create-product-input" type="text" placeholder="location" value = {this.state.location} name="location" />
			<img src = {this.state.imgURL} height = "100px" width = "100px"/>
			<input onChange={this.handleChange} className="create-product-input" type="file" placeholder="file" name="image" />
			<button onClick = {this.editProfile} type="submit">Submit Changes</button>
			</div>
			</div>
		);
	}
}

export default withRouter(Profile);
