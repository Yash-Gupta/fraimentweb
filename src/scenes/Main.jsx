import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/Main.css';

/* COMPONENTS */
import ProductBox from '../components/ProductBox';

class Main extends Component {
	componentWillMount(){
		this.props.updateHeader(false);
	}

	render() {
		return (
			<div className="main-container">
				{/* Search Box + Filter + Sort By */}
				<div className="products">
					<ProductBox id="1" image="https://i.pinimg.com/736x/5b/00/cf/5b00cf9efcfa997a4ec14870cdc2c396--jeep-parts-jeep-life.jpg" title="NIKE x OFFWHITE SWEATS" size="US M/EU 49" price="$12"/>
					<ProductBox id="2" image="https://s-media-cache-ak0.pinimg.com/originals/08/a0/3c/08a03c9f77cc4cf682a41879386078f6.jpg" title="HYPEBEAST SHIRT" size="US M/EU 49" price="$45"/>
					<ProductBox id="3" image="https://cdn.shopify.com/s/files/1/0699/6735/products/Muscle_512x.jpg?v=1499182161" title="OFFWHITE BRAND HOODIE" size="US M/EU 49" price="$45"/>
					<ProductBox id="4" image="https://s-media-cache-ak0.pinimg.com/originals/b4/f2/62/b4f2625696059df120ccd3ef110395e8.jpg" title="NIKE x OFF WHITE PANTS" size="US M/EU 49" price="$45"/>
					<ProductBox id="5" image="https://s-media-cache-ak0.pinimg.com/564x/3b/ea/35/3bea355085c89ac8b86c13aa37dc8a18.jpg" title="JACK OLIVER JACKET" size="US M/EU 49" price="$45"/>
					<ProductBox id="6" image="https://i.pinimg.com/736x/57/2b/b3/572bb3b7c739f0c38793ff6b026f9e59--mens-sweaters-casual-friday.jpg" title="NIKE x YEEZYS GREY SNEAKERS" size="US M/EU 49" price="$45"/>
					<ProductBox id="7" image="https://i.pinimg.com/736x/37/a3/57/37a35799072f37fe4fcfe91e81d6bdbc--knitting-sweaters-free-knitting.jpg" title="GUCCI DRESS SHOES" size="US M/EU 49" price="$45"/>
					<ProductBox id="8" image="https://i.pinimg.com/736x/d7/21/92/d72192bf7f3a697db6fcfb224fb010a8--polo-ralph-lauren-outlet-outlet-store.jpg" title="DIAMOND SUPPLY CO SNAPBACK" size="US M/EU 49" price="$45"/>
				</div>
			</div>
		);
	}
}

export default Main;
