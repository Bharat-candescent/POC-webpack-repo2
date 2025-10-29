import { createStore, combineReducers } from 'redux';

/**
 * MOCK REDUX STORE SETUP
 * * This store is only used when the Credit Card MFE runs in isolation (standalone).
 * When running inside the Host App, this store is ignored, and the Host's 
 * shared store is used instead.
 */

// --- Mock Initial State (Mirrors the banking state used by the host) ---
const INITIAL_STATE = {
    cards: [
        { id: 'cc-1', name: 'Visa Platinum', balance: 500.50, limit: 5000 },
        { id: 'cc-2', name: 'Mastercard Gold', balance: 2500.00, limit: 3000 },
        { id: 'cc-3', name: 'Amex Rewards', balance: 10.99, limit: 10000 },
    ],
    selectedCardId: 'cc-1',
};

// --- Mock Reducer (Handles the state changes needed for isolated testing) ---
const bankingReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // This is the action dispatched by the CreditCardMFE when a card is clicked
        case 'SET_SELECTED_CARD':
            return {
                ...state,
                selectedCardId: action.payload,
            };
        default:
            return state;
    }
};

// The root reducer combines the mocked banking slice, matching the Host's structure.
const rootReducer = combineReducers({
    banking: bankingReducer,
});

// Create the store, including Redux DevTools support for debugging in isolation.
const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export { store };
