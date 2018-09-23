import React, { Component } from 'react';
import { ConnectedRouter } from 'connected-react-router'
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

// Those should be dispatch mapped probably
import { push } from 'connected-react-router'
import { requestPatient, closePatient } from '../actions/patient';



export  class Patient extends Component {


		componentDidMount() {

			if ( (this.props.match) &&
			     (this.props.match.params) &&
					 (this.props.match.params.patientId) ) {

						 this.props.dispatch(requestPatient(this.props.match.params.patientId));

			}
		}

		componentDidUpdate(prevProps, prevState, snapshot) {

			if ( (this.props.match) &&
			     (this.props.match.params) &&
					 (this.props.match.params.patientId) ) {

						 this.props.dispatch(requestPatient(this.props.match.params.patientId));

			}
		}


	render() {
		return (

      <div>
      <h1>This is a patient chart {this.props.match.params.patientId}</h1>
      <ConnectedRouter history={this.props.history}>
        <div className="navigation">
  				<NavLink to={`${this.props.match.url}/`} exact>Summary</NavLink>
          <NavLink to={`${this.props.match.url}/drugs`}>drugs</NavLink>
  			</div>
      </ConnectedRouter>
			<button onClick={ () => {
								this.props.dispatch(closePatient(this.props.match.params.patientId));
								this.props.dispatch(push('/'))
							} }>
			  Close
			</button>
    </div>
		);
	}
}

const mapStateToProps = (state) => ({
	openedPatients: state.openedPatients
});
/*
const mapDispatchToProps = (dispatch) => ({
    requestPatient: (patientId) => dispatch(requestPatient(patientId))
});
*/
export default connect(mapStateToProps/*, mapDispatchToProps*/)(Patient);
