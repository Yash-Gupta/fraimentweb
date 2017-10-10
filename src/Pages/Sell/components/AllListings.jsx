import React, { Component } from 'react';
import * as firebase from 'firebase'
import '../styles/AllListings.css';
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

class AllListings extends Component {

	constructor(props){
		super(props);
		
		this.state = {
			listings: [],
			categories:[],
		}
       
		//this.handleChange = this.handleChange.bind(this);
		//this.createListing = this.createListing.bind(this);
	}

	componentWillMount() {
		var initialValue = false;
		firebase.database().ref('/listings').once("value").then((snapshot) => {
            snapshot.forEach((data) => {
            	var listings = this.state.listings;
            	listings.push(data.val());
            	this.setState({listings: listings});
            });
            initialValue = true;
        });

		firebase.database().ref('/listings').on("child_added", function(snapshot) {
			if(initialValue){
				var listings = this.state.listings;
           		listings.push(snapshot.val());
           		this.setState({listings: listings});
           	}
    	}.bind(this));	

        firebase.database().ref('/categories').once("value").then( (snapshot) =>{
        	snapshot.forEach( (data)=> {
        		var categories = this.state.categories;
        		categories.push(data.val());
        		this.setState({categories: categories});
        	});


        
        });
	}
	
	render(){
		var rows = [];
		var cats = [];
		this.state.listings.map((x, i) => {

			var styles = {
				backgroundImage: "url(" + x.imageurl + ")",
				backgroundSize:'cover',
				fontWeight:'bold'
			};
			rows.push(
				<div key={i} className ="col-md-4 post" id = "post">
					<div className = "img-holder" style={styles}>
					</div>
					<hr />
					<p className="postname">{x.name}</p>
					<p className= "postdesigner">{x.author}</p>
					<img src={x.imageurl} />
					<p className= "postprice">{x.price}</p>
					<p className = "postname">{x.category}</p>
				</div>
			);
		})

		this.state.categories.map((x,i)=>{
			cats.push(
		
					
						<div id="post"  key = {i}>
					        <input className="checkboxes" type="checkbox" id={x.check}></input>
					        <label className="checklabel" htmlFor={x.check}>
					          <div><i className="fa fa-check"></i></div> {x.name}
					        </label>
					    </div>
				
		

			);

		})
		return (
			<div>
				<div className="container">
					<div className="row home">
						<div className="col-md-3">
							<h1 className="cathead firstcat">CATEGORY</h1><hr></hr>
							{cats}
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