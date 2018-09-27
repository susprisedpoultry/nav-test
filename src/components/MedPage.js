import React, { Component } from 'react';

import SmartSig, { Pattern, Field, Option, TYPE_NUMERIC, TYPE_STATIC } from './SmartSig';

// verb quantity1 [to quantity2] form frequency [for duration units]

const quantity  		 = SmartSig.Field( "quantity",  TYPE_NUMERIC);
const quantity2      = SmartSig.Field( "quantity2", TYPE_NUMERIC);
const form           = SmartSig.Field( "form",      TYPE_STATIC)
const frequencyStart = SmartSig.Field( "frequencyStart",     TYPE_NUMERIC);
const frequencyEnd   = SmartSig.Field( "frequencyEnd",     TYPE_NUMERIC);
const frequencyUnit  = SmartSig.Field( "frequencyUnit", [
																								[ "hours" ],
																								[ "days" ],
																							]);
const frequency 		 = SmartSig.Field( "frequencyType", [
																							 	[ "once" ],
																								[ "daily" ],
																								[ "twice a day" ],
																								[ "three times a day" ],
																								[ "every", frequencyStart, "to", frequencyEnd, frequencyUnit ],
																							]);
const duration       = SmartSig.Field( "duration",     TYPE_NUMERIC);
const durationUnit   = SmartSig.Field( "durationUnit", [
																								[ "hours" ],
																								[ "days" ],
																							]);


const pattern = SmartSig.Pattern([ "Take", quantity, SmartSig.Optional([ "to", quantity2 ]), form, frequency, SmartSig.Optional(["for", duration, durationUnit])]);

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
