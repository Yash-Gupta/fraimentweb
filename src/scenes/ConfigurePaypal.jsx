import React, { Component } from 'react';
import { withRouter} from 'react-router-dom';
//import './css/ConfigurePaypal.css';
import * as firebase from 'firebase';
import axios from 'axios';

import LoginPaypal from '../components/LoginPaypal';


class ConfigurePaypal extends Component {

	componentWillMount(){
		this.props.updateHeader(true);
	}

	constructor(props){
		super(props);
		this.state = {
		}
  }

	render() {
		//TODO: add paypal integration
		return (
			<div className = "">
        <p>Please connect your PayPal business account to interact with users on Fraimont. </p>
        <LoginPaypal />
      </div>
		);
	}
}

	export default withRouter(ConfigurePaypal);
