import React, { Component, Fragment } from 'react';
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
export class Field extends Component {
	constructor(props) {
    super(props);

		// create a ref to store the textInput DOM element
    this.textInput = React.createRef();
  }

	isEmpty() {
		return false;
	}

	renderToText() {
		return this.props.value;
	}

	render() {

		// Remove the props that I am consuming
		var { forceFocus, ...other } = this.props;

		return (
		      <StyledAutosizeInput
		        type="text"
		        innerRef={this.textInput}
						inputClassName={this.isEmpty() ? "empty" : ""}
					 	{ ...other }/>
		    );
  }
}

export class Pattern extends Component {
	constructor(props) {
    super(props);

		this.renderToText = this.renderToText.bind(this);
	}

	renderToText() {

		var text = "";

		React.Children.forEach(this.props.children, (child) => {

				if (typeof child === "string")
					text += child;
				else {
					text += child.renderToText()
				}
			});

		return text;
	}

	render() {

		// wrap the labels
		var renderedChildren = React.Children.map(this.props.children, (child) => {

				if (typeof child === "string")
					return (<Label>{child}</Label>);

				return child;
			})

		// If this pattern is owned by an option, don't render the first element
		if (this.props.optionOwner) {
			renderedChildren.shift();
		}

		return (renderedChildren);
  }

}

/**
** Finds a match for a pattern within the children passed in.
** Will find a <Pattern> object with the same value as the value passed in.
** If no value is passed, the first pattern is returned.
*/
function findPattern(children, value = null) {

	var foundPattern = null;

	React.Children.forEach(children, (child) => {

		if (child.type && child.type === Pattern) {

			if (foundPattern === null) {

				if ( !(value) ||
							(child.props.value === value)) {

					foundPattern = child;
				}
			}
		}

	})

	return foundPattern;
}

function getPatterns(children, value = null) {

	var foundPatterns = [];

	React.Children.forEach(children, (child) => {

		if (child.type && child.type === Pattern) {

			foundPatterns.push(child);
		}
	});

	return foundPatterns;
}

export class Option extends Component {
	constructor(props) {
    super(props);

		// create a ref to store the textInput DOM element
    this.textInput = React.createRef();

		this.onBlurField = this.onBlurField.bind(this);
		this.onFocusField = this.onFocusField.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);

		this.state = { popupOpened: false }
	}

	componentWillMount() {
		this._ignoreBlur = false;
	}

	isEmpty() {
		return false;
	}

	onBlurField(event) {

		if (!this._ignoreBlur)
			this.setState( {  popupOpened: false });
	}
	onFocusField(event) {

		this.setState( {  popupOpened: true } );
	}

	handleKeyDown(event) {
//    if (SmartSig.keyDownHandlers[event.key])
//      SmartSig.keyDownHandlers[event.key].call(this, event)
  }

	renderToText() {
		return this.props.value;
	}

	render() {

		var patternToRender = React.cloneElement(findPattern(this.props.children, this.props.value),
																						 { optionOwner : this });

		var patternValue = patternToRender.props.value;
		const patterns = getPatterns(this.props.children);

		// Remove the props that I am consuming
		var { children, forceFocus, ...other } = this.props;

		return (

					<Fragment>
			      <StyledAutosizeInput
			        type="text"
			        innerRef={this.textInput}
							onBlur={ this.onBlurField }
							onFocus={ this.onFocusField }
							onKeyDown={ this.handleKeyDown }
							inputClassName={this.isEmpty() ? "empty" : ""}
						 	{ ...other } />
						{patternToRender}
						{
							(this.state.popupOpened) ?
							<Popup>
								<div>
									<AutocompleteSectionHeader>{this.props.name}</AutocompleteSectionHeader>
									<ul>
										{
											patterns.map( (pattern) => <li key={this.props.name + pattern.props.value}>
																										<AutocompleteItem type="button"
																											/*onClick={this.onAutocompleteClick.bind(this, section.key, option.value, returnKey)}*/>
																											{ pattern.renderToText() }
																										</AutocompleteItem>
																								 </li>)
										}
									</ul>
								</div>
							</Popup> :
							""
							}
						}
					</Fragment>

		    );
  }

}

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
		var { children, forceFocus, ...other } = this.props;

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

export const TYPE_LABEL   = "label";
export const TYPE_NUMERIC = "numeric";
export const TYPE_OPTION  = "option";
export const TYPE_STATIC  = "static";

export default class SmartSig extends Component {

	constructor(props) {
    super(props);

		this.state = { focusSection : null,
		 							 forceFocusSection: null};

  }


	static Pattern(pattern, parent = null) {

		if (Array.isArray(pattern))
			return pattern.map( (item) => SmartSig.Pattern(item));

		if (typeof pattern === 'string')
			return {
				type:  TYPE_LABEL,
				value: pattern
			}

		return pattern;
	}

	static Field(fieldName, type) {

		if (Array.isArray(type)) {
			return {
					type: TYPE_OPTION,
					fieldKey: fieldName,
					options: type.map( (item) => SmartSig.Pattern(item, fieldName))
				}
			}

		return {
				type:     type,
				fieldKey: fieldName
		}
	}
	static Optional(fieldName, pattern) {

		return {
				type: "optional",
				pattern: pattern
		}

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

	static getMatchingPattern(section, values) {

		var matchingValue = (section.values ?
												  section.values.find( (item) => { return (item.value === values[section.key]) } )
												: null);


		if (matchingValue && matchingValue.pattern) {

			return matchingValue.pattern;
		}

		return null;
	}

	renderSectionToText(section, values) {

		switch (section.type) {

			case TYPE_LABEL:
				  return section.value;

      case TYPE_NUMERIC:
      case TYPE_OPTION:
      case TYPE_STATIC:

				return ( ( (typeof values[section.fieldKey] !== 'undefined') &&
								   (values[section.fieldKey].length > 0) ) ?
				         values[section.fieldKey] :
								 "[]" );

			case "hidden":
			default:
				return "";
		}
	}

	renderPhraseToText(phrase, values) {

		return phrase.map((section) => this.renderSectionToText(section, values))
				  			 .reduce( (phraseToText, sectionText) => ( (sectionText.length > 0) ?
								 																					 ( (phraseToText.length > 0) ?
																													 	 phraseToText + " " + sectionText :
																														 sectionText) :
																													 phraseToText),
													"");
	}

	renderSection(section) {

		let sectionOutput = [];

		switch (section.type) {

			case TYPE_NUMERIC:
			case TYPE_OPTION:

				sectionOutput.push(
					<SmartSigInput key={section.fieldKey}
								 type="text"
								 forceFocus={ this.state.forceFocusSection === section.fieldKey}
								 value={this.props.values[section.fieldKey]}
								 onBlur={ this.onBlurField.bind(this, section) }
								 onFocus={ this.onFocusField.bind(this, section) }
								 onKeyDown={ this.handleKeyDown.bind(this) }
								 onChange={ this.onChangeField.bind(this, section) }></SmartSigInput>);


				break;

			case TYPE_LABEL:
				sectionOutput.push(<Label key={section.key}>{section.value}</Label>);
				break;

			case TYPE_STATIC:
				sectionOutput.push(<Label key={section.key}>{this.props.values[section.fieldKey]}</Label>);
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

	findSection(phrase, key) {

		if (key)
			return (phrase.find( (phraseSection) => { return (phraseSection.key === key) } ));

		return null;
	}

	sectionHasPatterns(section) {

		return (section.values) ?
						section.values.reduce( (hasPatterns, value) => (hasPatterns || (typeof value.pattern !== 'undefined') ),
	 												 			  false) :
						false;
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

	static buildPhrase(pattern, values, pickerKey = null) {

		function phraseReducer(accumulator, currentSection) {

			let phraseSection = { ...currentSection };

			accumulator.push(phraseSection);

/*
			const matchingPattern = SmartSig.getMatchingPattern(currentSection, values);

			if (matchingPattern) {

					accumulator = accumulator.concat(SmartSig.buildPhrase(matchingPattern, values, phraseSection.key));
			}
*/

			return accumulator;
		}

		return pattern.reduce(phraseReducer, []);
	}

	buildAutocompleteSection(section, values) {

    switch (section.type) {
      case TYPE_OPTION:
    		return ( {
    			key : section.fieldKey,
    			label : section.label,
    			options: section.options.map( (currentValue) => {

    									var   fixedValues = { ...values };
    									const newPattern  = [ section ];

    									fixedValues[section.fieldKey] = currentValue[0].value;

    									return {
    										value: currentValue.value,
    										label: this.renderPhraseToText(SmartSig.buildPhrase(newPattern, fixedValues), fixedValues),
    									}
    							})
    		});
      default:
        return {};
    }
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
					{ section.options ? section.options.map( (option) => this.renderAutocompleteOption(section, option)) : ''}
				</ul>
			</div>
		);
	}

	renderAutocomplete(phrase, values) {

		let autoComplete = []
		const pivotSection = this.getPivotSection(phrase);

		// Does the current selection have values... start with this
		autoComplete.push(this.buildAutocompleteSection(this.state.focusSection, values));

//		if (pivotSection &&
//			  (pivotSection.key !== this.state.focusSection.key) ) {
//			autoComplete.push(this.buildAutocompleteSection(pivotSection, values));
//		}

		return (
			<Popup key="autocomplete">
				{ autoComplete.map( (section) => this.renderAutocompleteSection(section))}
			</Popup>);

	}


	render() {

		//const phrase = SmartSig.buildPhrase(this.props.pattern, this.props.values);

		let pattern = findPattern(this.props.children);


		return (
			<SmartSigControl>
				{ pattern }
			</SmartSigControl>);

/*
		let output = [];

		output.push(
			<SmartSigControl>
				{ $pattern }
			</SmartSigControl>);

		// Show the popup if one of our fields has focus.

		if (this.state.focusSection) {

				output.push(<Popup key="autocompletePopup"
													 onMouseEnter={ () => this.setIgnoreBlur(true) }
													 onMouseLeave={ () => this.setIgnoreBlur(false) }>
											{ this.renderAutocomplete(phrase, this.props.values) }
										</Popup>);
		}

		return (output);
*/
	}
}
