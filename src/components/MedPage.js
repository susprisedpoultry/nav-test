import React, { Component } from 'react';

import SmartSig from './SmartSig';

export default class MedPage extends Component {
	render() {
		return (

      <div>
      <h1>This is a Med</h1>

			<form>
				<SmartSig />
			</form>
    </div>
		);
	}
}
