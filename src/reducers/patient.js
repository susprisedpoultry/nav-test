import { PATIENT_LOAD, PATIENT_CLOSE } from '../actions/patient';

export default (state = [], action) => {

    switch (action.type) {
        case PATIENT_LOAD:

          if (state.find( (element) => { return element.id === action.id}))
            return state;

          var newState = state.concat({ id: action.id});

          return newState;

          case PATIENT_CLOSE:

            return state.filter( (value, index, arr) => { return !(value.id === action.id) } );

        default:
            return state;
    }
};
