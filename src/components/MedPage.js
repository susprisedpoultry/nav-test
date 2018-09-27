import React, { Component } from 'react';

import SmartSig, { Pattern, Field, Option, TYPE_NUMERIC, TYPE_STATIC } from './SmartSig';

export default class MedPage extends Component {

	constructor(props) {
    super(props);
		this.state = {};
    this.state = {
			quantity: "",
			quantity2: "",
			form: "tablet",
			frequencyType: "every",
			frequencyStart: "",
			frequencyEnd: "",
			frequencyUnit: "",
			durationType: "",
			duration : "",
			durationUnit : "",
    };

		this.handleChange = this.handleChange.bind(this);
  }

	handleChange (evt) {
    // check it out: we get the evt.target.name (which will be either "email" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({ [evt.target.name]: evt.target.value });
  }


	render() {
		return (

      <div>
      <h1>This is a Med</h1>

			<form>
				<SmartSig>
					<Pattern>
						Take <Field name="quantity" value={this.state.quantity} type={TYPE_NUMERIC} onChange={this.handleChange} />
						<Option name="frequencyType" value={this.state.frequencyType} onChange={this.handleChange}>
							<Pattern value="once">once</Pattern>
							<Pattern value="bid">twice a day</Pattern>
							<Pattern value="every">every <Field name="frequencyStart" value={this.state.frequencyStart}/> days</Pattern>
						</Option>
					</Pattern>
				</SmartSig>
			</form>
    </div>
		);
	}
}
