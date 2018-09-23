export const PATIENT_LOAD = 'PATIENT_LOAD';
export const PATIENT_CLOSE = 'PATIENT_CLOSE';

export function requestPatient(id) {

  //alert ('requestPatient()' + id);

    return {
        type: PATIENT_LOAD,
        id
    };
}

export function closePatient(id) {

  //alert ('requestPatient()' + id);

    return {
        type: PATIENT_CLOSE,
        id
    };
}
