import React, { Component } from 'react';
import AllListings from './AllListings';

class SellLayout extends Component {

	constructor(props){
		super(props);
	}

	render(){
		return (
			<div>
				<AllListings />
			</div>
		);
	}
}

export default SellLayout;