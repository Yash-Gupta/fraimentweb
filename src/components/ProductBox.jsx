import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/ProductBox.css';

class ProductBox extends Component {
	render() {
		return (
			<Link to={"/listing/" + this.props.id}><div className="product-box" id={this.props.id}>
				<div className="product-image-box">
					<div className="product-image-container">
						<img alt={this.props.title} src={this.props.image}/>
					</div>
					
				</div>
				<p className="product-timeposted">1 min ago</p>
				<h3 className="product-title">{this.props.title}</h3>
				<p className="product-size">{this.props.size}</p>
				<p className="product-brand">{this.props.brand}</p>
				<p className="product-price">{this.props.price}</p>

			</div></Link>
		);
	}
}

export default ProductBox;
