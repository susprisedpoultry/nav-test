import React, { Component } from 'react';

import SmartSig from './SmartSig';

const duration = {
		key : "duration",
		type : "label",
		label : "duration"
}

const orallyLabel = {
		key : "orallyLabel",
		type : "label",
		label : "orally"
}

const quantityWithRange = {

	key : "quantity1",
	type : "field",
	values : [
		{
			value: "once",
			label: "once",
		},
		{
			value: "daily",
			label: "daily",
		}
	]
}

const frequency = {

		key : "frequency",
		type : "option",
		values : [
			{
				value: "once",
				label: "once",
			},
			{
				value: "daily",
				label: "daily",
			},
			{
				value: "every",
				label: "every",
				pattern: [
					{
						key: "frequency1",
						type: "field"
					},
					{
						key: "frequencyto",
						type: "label",
						label: "to"
					},
					{
						key: "frequency2",
						type: "field"
					},
					{
						key: "frequencyUnit",
						type: "option",
						values : [
							{
								value: "days",
								label: "days",
							},
							{
								value: "hours",
								label: "hours",
							}
						]
					},
				]
			}
		]
}

const pattern = [

	{
		key : "verb",
		type : "option",
		values : [
			{
				value: "take",
				label: "take",
				pattern: [ quantityWithRange, frequency, orallyLabel, duration]
			}
		]
	}
]


export default class MedPage extends Component {

	constructor(props) {
    super(props);
		this.state = {};
    this.state.values = {
      verb: "take",
      quantity1: "",
			frequency: "once",
    };

		this.onValueChange = this.onValueChange.bind(this);
  }

	onValueChange(label, newValue) {

		var newState = {};

		newState[label] = newValue;

		this.setState((state, props) => {

					var newState = {...state};
					newState.values[label] = newValue;
				  return newState;
				});
	}


	render() {
		return (

      <div>
      <h1>This is a Med</h1>

			<form>
				<SmartSig values={this.state.values} pattern={pattern} onValueChange={this.onValueChange} />
			</form>
    </div>
		);
	}
}
