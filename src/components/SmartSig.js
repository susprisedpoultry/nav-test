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
	background-color: white;

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

		return ( !(this.props.value) || (this.props.value.length === 0));
	}

	renderToText() {
		return this.isEmpty() ? "[ ]" : this.props.value;

	}

	render() {

		if (this.props.renderToText) {
			return this.renderToText();
		}

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


	}

	renderToText() {

		return React.Children.map(this.props.children, (child) => {

				if (typeof child === 'string')
					return child;

				return React.cloneElement(child, { renderToText : true })
			});

	}

	render() {

		if (this.props.renderToText) {
			return this.renderToText();
		}


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

		if (this.props.renderToText) {
			return this.renderToText();
		}

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
																											{ React.cloneElement(pattern, { renderToText : true }) }
																										</AutocompleteItem>
																								 </li>)
										}
									</ul>
								</div>
							</Popup> :
							""
						}
					</Fragment>

		    );
  }

}

/*
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
*/
export const TYPE_LABEL   = "label";
export const TYPE_NUMERIC = "numeric";
export const TYPE_OPTION  = "option";
export const TYPE_STATIC  = "static";

export const TYPE_LABEL   = "label";
export const TYPE_NUMERIC = "numeric";
export const TYPE_OPTION  = "option";
export const TYPE_STATIC  = "static";

export default class SmartSig extends Component {

	constructor(props) {
    super(props);

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

	render() {

		let pattern = findPattern(this.props.children);

		return (
			<SmartSigControl>
				{ pattern }
			</SmartSigControl>);

	}
}
