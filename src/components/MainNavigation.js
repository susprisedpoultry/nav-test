import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components'

import { NavLink } from 'react-router-dom';

const NavBar = styled.div`
	width: 40px;
	height: 100%;
	display: flex;
	background-color: black;
	justify-content: flex-start;
	flex-wrap: nowrap;
	flex-direction: column;
`
const StyledNavLink = styled(NavLink)`
	display: flex;
	margin: 0 10px 10px 0;
`

function NavTab (props) {
	return (
 			<StyledNavLink {...props} activeStyle={{
		    	fontWeight: 'bold',
		    	color: 'red'
				}}>{props.children}</StyledNavLink>
		);
}

export class Navigation extends Component {

	render() {
		return (
        <NavBar>
  				<NavTab to="/" exact>Home</NavTab>
          <NavTab to="/search">Search</NavTab>

					{
						this.props.openedPatients ? this.props.openedPatients.map( (patient) =>
							<NavTab key={patient.id} to={'/patient/' + patient.id}>Patient {patient.id}</NavTab>

						) : ''
					}
  			</NavBar>
		);
	}
};

const mapStateToProps = (state) => ({
	openedPatients: state.patient
});


export default connect(mapStateToProps)(Navigation);
