import React, { Component } from 'react';
import styled from 'styled-components'

import AutosizeInput from 'react-input-autosize';


const Label = styled.span`
	padding-left: 0.5em;
	font-size: 12px;
`
const SmartSigControl = styled.div`
	background: white;
	padding: 0.25em;
`
const StyledAutosizeInput = styled(AutosizeInput)`
	padding-left: 0.25em;

	input {
		background-color: white;
		min-width: 1em;
		border: none;
		font-size: 12px;
	}

	input.empty {
		/*background-color: #eee;*/
		border-bottom: 1px dotted red;
	}

	input:focus {
		border-bottom: 1px solid blue;
		outline: none;
	}
`

const Popup = styled.div`
	float: right:
	display: block;
	position: absolute;
	width: 500px
	background-color: white;
	border: 1px solid lightgray;
	box-shadow: 1px black;
`

const AutocompleteSectionHeader = styled.div`
	font-size: 10px;
	color: #222;
	padding: 0.5em;
`

const AutocompleteItem = styled.button`

	border: none;
	font-size: 12px;
	padding: 1em;

	:hover {
		background-color: blue;
		color: white;
	}
`

class SmartSigInput extends Component {
	constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.textInput = React.createRef();
    this.focus = this.focus.bind(this);
  }

  focus() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.textInput.current.focus();
  }

	componentDidUpdate(prevProps, prevState, snapshot) {

		if (this.props.forceFocus) {
			this.focus();
		}

	}
  render() {

		// Remove the props that I am consuming
		var { forceFocus, ...other } = this.props;

    // tell React that we want to associate the <input> ref
    // with the `textInput` that we created in the constructor
    return (
      <StyledAutosizeInput
        type="text"
        innerRef={this.textInput}
				inputClassName={this.props.value.length === 0 ? "empty" : ""}
			 	{ ...other }/>
    );
  }
}

export default class SmartSig extends Component {

	constructor(props) {
    super(props);

		this.state = { focusSection : null,
		 							 forceFocusSection: null};

  }

	setIgnoreBlur(ignore) {
		this._ignoreBlur = ignore
	}

	componentWillMount() {
		this._ignoreBlur = false;
	}

	componentDidUpdate(prevProps, prevState, snapshot) {

		if (this.state.forceFocusSection) {
			this.setState({ forceFocusSection: null });
		}
	}

	onAutocompleteClick(key, value, returnKey) {

		this.setState( { forceFocusSection: returnKey });

		this.props.onValueChange( key, value );
	}

	onChangeField(section, event) {

		this.props.onValueChange( section.key, event.target.value );
	}

	onBlurField(section, event) {
		console.log("onBlurField", section, event);

		if ( (!this._ignoreBlur) &&
		     (this.state.focusSection.key === section.key) )
				this.setState( { focusSection: null });
	}
	onFocusField(section, event) {

		this.setState( { focusSection: section });
	}

	handleKeyDown(event) {
    if (SmartSig.keyDownHandlers[event.key])
      SmartSig.keyDownHandlers[event.key].call(this, event)

  }

  static keyDownHandlers = {
    ArrowDown(event) {

    },

    ArrowUp(event) {

    },

    Enter(event) {

    },

    Escape() {

    },

    Tab() {
      // In case the user is currently hovering over the menu
      this.setIgnoreBlur(false)
    },
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

		return phrase.map((section) => this.renderSectionToText(section))
				  			 .reduce( (phraseToText, sectionText) => (
									 																			   (sectionText.length > 0 && (phraseToText.length > 0) ) ?
								 																				   phraseToText + " " + sectionText :
																													 phraseToText));
	}

	renderSection(section) {

		let sectionOutput = [];

		switch (section.type) {

			case "option":

				sectionOutput.push(
					<SmartSigInput key={section.key}
								 type="text"
								 forceFocus={ this.state.forceFocusSection === section.key}
								 value={this.props.values[section.key]}
								 onBlur={ this.onBlurField.bind(this, section) }
								 onFocus={ this.onFocusField.bind(this, section) }
								 onKeyDown={ this.handleKeyDown.bind(this) }
								 onChange={ this.onChangeField.bind(this, section) }></SmartSigInput>);


				break;

			case "label":
				sectionOutput.push(<Label key={section.key}>{section.label}</Label>);
				break;

			case "field":
				sectionOutput.push(<SmartSigInput key={section.key}
							 				type="text"
											forceFocus={ this.state.forceFocusSection === section.key}
							 			 value={ this.props.values[section.key] }
										 onBlur={ this.onBlurField.bind(this, section) }
										 onFocus={ this.onFocusField.bind(this, section) }
										 onKeyDown={ this.handleKeyDown.bind(this) }
							 	  onChange={ this.onChangeField.bind(this, section) }></SmartSigInput>);
				break;
			case "hidden":
			default:
				break;
		}

		return (sectionOutput);

	}


	/**
	*
	*/
	renderPhrase(phrase) {

		return phrase.map( (section) => this.renderSection(section) );
	}

/*
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
*/

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

			if (phraseFocusSection) {

				if (this.sectionHasPatterns(phraseFocusSection))
					return phraseFocusSection;

				if (phraseFocusSection.pickerKey)
					return (this.findSection(phrase, phraseFocusSection.pickerKey));

				return phraseFocusSection;
			}
		}

		return null;
	}

	buildPhrase(pattern, pickerKey = null) {

		let phrase = [];

		pattern.map( (section) => {

			let phraseSection = { ...section };

			phraseSection.pickerKey = pickerKey;

			phrase.push(phraseSection);

			const matchingPattern = this.getPattern(section);

			if (matchingPattern) {

					phrase = phrase.concat(this.buildPhrase(matchingPattern, section.key));
			}

		});

		return phrase;
	}

	buildAutocompleteSection(section) {
		var autoCompleteSection = { key : section.key, label : section.label, options: [] };

		section.values.map( (value) => {

			var curOption = { value: value.value };
			var curSection = { ...section };
			let phrase     = [];

			curSection.values = [ value ];
			curSection.type   = curSection.type === "hidden" ? "hidden" : "fixed";

			phrase.push(curSection);

			if (value.pattern)
				phrase = phrase.concat(this.buildPhrase(value.pattern));

			curOption.label = this.renderPhraseToText(phrase);

			autoCompleteSection.options.push(curOption);
		});

		return autoCompleteSection;
	}

	renderAutocompleteOption(section, option) {

		const returnKey = this.state.focusSection ? this.state.focusSection.key : section.key;

		return (
			<li key={section.key + option.value}>
				<AutocompleteItem type="button"
					onClick={this.onAutocompleteClick.bind(this, section.key, option.value, returnKey)}>
					{option.label}
				</AutocompleteItem>
			</li>
		)
	}

	renderAutocompleteSection(section) {
		return (
			<div key={section.key}>
				<AutocompleteSectionHeader>{section.label}</AutocompleteSectionHeader>
				<ul>
					{ section.options.map( (option) => this.renderAutocompleteOption(section, option))}
				</ul>
			</div>
		);
	}

	renderAutocomplete(phrase) {

		let autoComplete = []
		const pivotSection = this.getPivotSection(phrase);

		// Does the current selection have values... start with this
		if (this.state.focusSection.values)
		{
			autoComplete.push(this.buildAutocompleteSection(this.state.focusSection));
		}

		if (pivotSection &&
			  (pivotSection.key !== this.state.focusSection.key) ) {
			autoComplete.push(this.buildAutocompleteSection(pivotSection));
		}

		return (
			<Popup key="autocomplete">
				{ autoComplete.map( (section) => this.renderAutocompleteSection(section))}
			</Popup>);

	}

	render() {

		const phrase = this.buildPhrase(this.props.pattern);

		let output = [];

		output.push(
			<SmartSigControl>
				{ this.renderPhrase(phrase) }
			</SmartSigControl>);

		if (this.state.focusSection) {

				output.push(<Popup key="autocompletePopup"
													 onMouseEnter={ () => this.setIgnoreBlur(true) }
													 onMouseLeave={ () => this.setIgnoreBlur(false) }>
											{ this.renderAutocomplete(phrase) }
										</Popup>);
		}

		return (output);
	}
}
