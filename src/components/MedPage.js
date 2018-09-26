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

const tabletLabel = {
		key : "tabletLabel",
		type : "label",
		label : "tablet"
}

const quantityWithRange = {

	key : "quantityType",
	type: "hidden",
	label: "Quantity",
	values : [
		{
			value : "simple",
			label : "simple",
			pattern : [
				{
					key : "quantity1",
					type : "field",
				}
			]
		},
		{
			value : "range",
			label : "range",
			pattern : [
				{
					key : "quantity1",
					type : "field",
				},
				{
					key : "quantityTo",
					type : "label",
					label : "to"
				},
				{
					key : "quantity2",
					type : "field",
				},
			]
		},
	]
}

const frequency = {

		key : "frequency",
		type : "option",
		label: "Frequency",
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
		label : "verb",
		type : "option",
		values : [
			{
				value: "take",
				label: "take",
				pattern: [ quantityWithRange, tabletLabel, orallyLabel, frequency	]
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
			quantityType: "simple",
			quantity1: "",
			quantity2: "",
			frequency: "daily",
			frequency1: "",
			frequency2: "",
			frequencyUnit: "",
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
