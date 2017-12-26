import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/Main.css';

/* COMPONENTS */
import ProductBox from '../components/ProductBox';

class ProductDetail extends Component {
	render() {
		return (
			<div className="main-container">
				<h1> {this.props.match.params.id} </h1>
			</div>
		);
	}
}

export default ProductDetail;
