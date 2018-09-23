import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Search extends Component {
	render() {
		return (

      <div>
      <h1>This is a Search</h1>

			<NavLink to="/patient/1">Patient 1</NavLink>
			<NavLink to="/patient/2">Patient 2</NavLink>
			<NavLink to="/patient/3">Patient 3</NavLink>
			<NavLink to="/patient/4">Patient 4</NavLink>
			<NavLink to="/patient/5">Patient 5</NavLink>
    </div>
		);
	}
}
