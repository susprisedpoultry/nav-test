import React, { Component } from 'react';
import styled from 'styled-components'

class RangeField extends Component {
	render() {
		return (

        <input></input>
		);
	}
}
class SimpleField extends Component {
	render() {
		return (

        <input></input>
		);
	}
}

class LabelField extends Component {
	render() {
		return (

			<span>
        {this.props.value}
			</span>
		);
	}
}

class SectionOptions extends Component {
	render() {
		return (

			<ul>
				{
					this.props.section.values ? this.props.section.values.map( (value) => <li key={value.value} > {value.label}</li>) : "	"
				}
			</ul>
		);
	}
}

const Label = styled.span`
	padding-left: 0.5em;
`

const Popup = styled.div`
	float: right:
	display: block;
	position: absolute;
`

export default class SmartSig extends Component {

	constructor(props) {
    super(props);

		this.state = { focusSection : null };

  }

	onChangeField(section, event) {

		this.props.onValueChange( section.key, event.target.value );
	}

	onBlurField(section, event) {

//		if (this.state.focusSection.key === section.key)
//				this.setState( { focusSection: null });
	}
	onFocusField(section, event) {

		this.setState( { focusSection: section });
	}

	getPattern(section) {

		var matchingValue = (section.values ?
												  section.values.find( (item) => { return (item.value === this.props.values[section.key]) } )
												: null);


		if (matchingValue && matchingValue.pattern) {

			return matchingValue.pattern;
		}

		return null;
	}

	renderSection(section) {

		let sectionOutput = [];

		switch (section.type) {

			case "option":

				sectionOutput.push(
					<input key={section.key}
								 name={section.key}
								 value={this.props.values[section.key]}
								 onBlur={ this.onBlurField.bind(this, section) }
								 onFocus={ this.onFocusField.bind(this, section) }
								 onChange={ this.onChangeField.bind(this, section) }></input>);


				break;

			case "label":
				sectionOutput.push(<Label key={section.key}>{section.label}</Label>);
				break;

			case "field":
				sectionOutput.push(<input key={section.key}
							 				type="text"
							 			 value={ this.props.values[section.key] }
										 onBlur={ this.onBlurField.bind(this, section) }
										 onFocus={ this.onFocusField.bind(this, section) }
							 	  onChange={ this.onChangeField.bind(this, section) }></input>);
				break;
			default:
				break;
		}

		const matchingPattern = this.getPattern(section);

		if (matchingPattern) {

				sectionOutput.push(this.renderPattern(matchingPattern));
		}

		return (sectionOutput);

	}

	renderPattern(pattern) {

		return pattern.map( (section) => this.renderSection(section) );
	}

	matchPattern() {

		const pattern = this.props.pattern.find( (element) => { return (element[0].value === this.props.values[element[0].field])} );

		if (pattern)
			return pattern;

		return this.props.pattern[0];
	}

	buildAutocomplete(pattern) {



	}

	buildSection(section, level) {

	}

	buildPhrase(pattern, pickerKey = null) {

		let phrase = [];

		pattern.map( (section) => {

			let phraseSection = { ... section };

			phraseSection.pickerKey = pickerKey;

			phrase.push(phraseSection);

			const matchingPattern = this.getPattern(section);

			if (matchingPattern) {

					phrase.push(this.buildPhrase(matchingPattern, matchingPattern.key));
			}

		});

		return phrase;
	}

	render() {

		let output = [];

		output.push(this.renderPattern(this.props.pattern) );

		if (this.state.focusSection) {

				const autocomplete = this.buildAutocomplete(this.props.pattern);


				output.push(<Popup key={this.state.focusSection.key + "popup"}>
											<div>{this.state.focusSection.key}</div>
											<SectionOptions section={this.state.focusSection} />

										</Popup>);
		}

		return (output);
	}
}
