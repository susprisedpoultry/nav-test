import React, { Component } from 'react';

import SmartSig, { TYPE_NUMERIC, TYPE_STATIC } from './SmartSig';

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
    this.state.sigValues = {
			quantity: "",
			quantity2: "",
			form: "tablet",
			frequencyType: "",
			frequencyStart: "",
			frequencyEnd: "",
			frequencyUnit: "",
			durationType: "",
			duration : "",
			durationUnit : "",
    };

		this.onValueChange = this.onValueChange.bind(this);
  }

	onValueChange(label, newValue) {

		var newState = {};

		newState[label] = newValue;

		this.setState((state, props) => {

					var newState = {...state};
					newState.sigValues[label] = newValue;
				  return newState;
				});
	}


	render() {
		return (

      <div>
      <h1>This is a Med</h1>

			<form>
				<SmartSig values={this.state.sigValues} pattern={pattern} onValueChange={this.onValueChange} />
			</form>
    </div>
		);
	}
}
