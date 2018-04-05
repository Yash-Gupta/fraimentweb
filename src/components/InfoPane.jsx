import React, { Component } from 'react';
import { Link, withRouter} from 'react-router-dom';
import './css/InfoPane.css';
import * as firebase from 'firebase';

/* COMPONENTS */

class InfoPane extends Component {
	constructor(props){
		super(props);


	}


	render() {
		if(!this.props.hidden){
			return (
				<div class="info-pane">
					{this.props.children}
				</div>
			);
		}
		return ();
	}
}

export default withRouter(InfoPane);