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
					this.props.options ? this.props.options.map( (value, index) => <li key={"option" + index} > {value}</li>) : "	"
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

	renderSectionToText(section) {

		switch (section.type) {

			case "option":
			case "field":

				return (this.props.values[section.key] ? this.props.values[section.key] : "[]" );

			case "fixed":

				return (section.values[0].label);

			case "label":
				return (section.label);

			case "hidden":
			default:
				return "";
		}
	}

	renderPhraseToText(phrase) {

		var phraseToText = "";
		phrase.map((section) => {
				const sectionText = this.renderSectionToText(section);

				if (sectionText.length > 0) {

					if (phraseToText.length > 0)
						phraseToText += " ";

					phraseToText += sectionText;
				}
			});

		return phraseToText;
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
			case "hidden":
			default:
				break;
		}

		return (sectionOutput);

	}

	renderPhrase(phrase) {

		return phrase.map( (section) => this.renderSection(section) );
	}

	matchPattern() {

		const pattern = this.props.pattern.find( (element) => { return (element[0].value === this.props.values[element[0].field])} );

		if (pattern)
			return pattern;

		return this.props.pattern[0];
	}

	findInPattern(pattern, pivotSection) {

		pattern.map( (section) => {

			if (section.key === pivotSection.key)
				return section;

			const matchingPattern = this.getPattern(section);

			if (matchingPattern) {

					const found = this.findInPattern(matchingPattern, pivotSection);

					if (found)
 						return found;
			}

		});

		return null;
	}

	buildAutocomplete(pivotSection) {

		const autoComplete = [];

		if (pivotSection.values) {
			pivotSection.values.map( (value) => {

				var curSection = { ...pivotSection };
				let phrase     = [];

				curSection.values = [ value ];
				curSection.type   = curSection.type === "hidden" ? "hidden" : "fixed";

				phrase.push(curSection);

				if (value.pattern)
					phrase = phrase.concat(this.buildPhrase(value.pattern));

				autoComplete.push(this.renderPhraseToText(phrase));
			});
		}

		return autoComplete;
	}

	findSection(phrase, key) {

		if (key)
			return (phrase.find( (phraseSection) => { return (phraseSection.key === key) } ));

		return null;
	}

	sectionHasPatterns(section) {

		var hasPatterns = false;

		if (section.values) {

			section.values.map( (value) => { hasPatterns = hasPatterns || (typeof value.pattern !== 'undefined')} );
		}

		return hasPatterns;
	}

	getPivotSection(phrase) {

		if (this.state.focusSection) {

			const phraseFocusSection = this.findSection(phrase, this.state.focusSection.key);

			if (this.sectionHasPatterns(phraseFocusSection))
				return phraseFocusSection;

			if (phraseFocusSection.pickerKey)
				return (this.findSection(phrase, phraseFocusSection.pickerKey));

			return phraseFocusSection;
		}

		return null;
	}

	buildPhrase(pattern, pickerKey = null) {

		let phrase = [];

		pattern.map( (section) => {

			let phraseSection = { ... section };

			phraseSection.pickerKey = pickerKey;

			phrase.push(phraseSection);

			const matchingPattern = this.getPattern(section);

			if (matchingPattern) {

					phrase = phrase.concat(this.buildPhrase(matchingPattern, section.key));
			}

		});

		return phrase;
	}

	render() {

		const phrase = this.buildPhrase(this.props.pattern);

		let output = [];

		output.push(this.renderPhrase(phrase) );

		const pivotSection = this.getPivotSection(phrase);

		if (pivotSection) {

				const autocomplete = this.buildAutocomplete(pivotSection);

				output.push(<Popup key={pivotSection.key + "popup"}>
											<div>{pivotSection.key}</div>
											<SectionOptions options={autocomplete} />

										</Popup>);
		}

		return (output);
	}
}
