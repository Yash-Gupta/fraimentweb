import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/ProductBox.css';

class ProductBox extends Component {
	render() {
		return (
			<Link to={"/listing/" + this.props.id}><div className="product-box" id={this.props.id}>
				<div className="product-image-box">
					<img src={this.props.image}/>
					<div className="product-image-overlay">
						<p><em>1 min ago</em></p>
					</div>
				</div>

				<h3 className="product-title">{this.props.title}</h3>
				<p className="product-size">{this.props.size}</p>
				<p className="product-price">{this.props.price}</p>

			</div></Link>
		);
	}
}

export default ProductBox;
