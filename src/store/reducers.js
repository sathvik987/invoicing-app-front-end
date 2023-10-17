
const initialStateSearch = {
    searchField: ""
};

export const searchInvoices = (state = initialStateSearch, action = {}) => {
    switch (action.type) {
        case 'CHANGE_SEARCH_FIELD':
            return Object.assign({}, state, { searchField: action.payload });
        default:
            return state;
    }
};

const initialStateInvoices = {
    isPending: false,
    invoices: [],
    error: ''
};

export const requestInvoices = (state = initialStateInvoices, action = {}) => {
    switch (action.type) {
        case 'REQUEST_INVOICES_PENDING':
            return Object.assign({}, state, { isPending: true });
        case 'REQUEST_INVOICES_SUCCESS':
            return Object.assign({}, state, { isPending: false, invoices: action.payload });
        case 'REQUEST_INVOICES_FAILED':
            return Object.assign({}, state, { isPending: false, error: action.payload });
        default:
            return state;
    }
};