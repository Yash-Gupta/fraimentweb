import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/ProductBox.css';

class ProductBox extends Component {
	constructor(props){
		super(props);
		this.convertMillisToTime = this.convertMillisToTime.bind(this);
	}

	convertMillisToTime(millisDifference){
		var seconds = millisDifference / 1000;
		if(seconds < 60){
			return Math.floor(seconds) + " seconds ago";
		}else if(seconds < 3600){
			return Math.floor(seconds / 60) + " minutes ago";
		}else if(seconds < (3600 * 24)){
			return Math.floor(seconds / 3600) + " hours ago";
		}else if(seconds < (3600 * 24 * 31)){
			return Math.floor(seconds / (3600 * 24)) + " days ago";
		}else if(seconds < (3600 * 24 * 31 * 12)){
			return Math.floor(seconds / (3600 * 24 * 31)) + " months ago";
		}else{
			return Math.floor(seconds / (3600 * 24 * 31 * 12)) + " years ago";
		}
	}

	render() {

		return (
			<Link to={"/listing/" + this.props.id}><div className="product-box" id={this.props.id}>
				<div className="product-image-box">
					<div className="product-image-container">
						<img alt={this.props.title} src={this.props.image}/>
					</div>

				</div>
				<p className="product-timeposted">{this.convertMillisToTime((new Date()).getTime() - this.props.timestamp)}</p>
				<h3 className="product-title">{this.props.title}</h3>
				<p className="product-size">{this.props.size}</p>
				<p className="product-brand">{this.props.brand}</p>
				<p className="product-price">${this.props.price}</p>

			</div></Link>
		);
	}
}

export default ProductBox;
