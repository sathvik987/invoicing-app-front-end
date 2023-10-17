
export const setSearchField = (text) => {
    return {
        type: 'CHANGE_SEARCH_FIELD',
        payload: text
    };
};


export const requestInvoices = () => (dispatch) => {
    dispatch({ type: 'REQUEST_INVOICES_PENDING' });
    fetch('http://localhost:9000/api/invoice')
        .then(response => response.json())
        .then(data => dispatch({ type: 'REQUEST_INVOICES_SUCCESS', payload: data }))
        .catch((error) => dispatch({ type: 'REQUEST_INVOICES_FAILED', payload: error }));
};