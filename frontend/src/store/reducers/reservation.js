import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    tables: [],
    capacity: [{value: 'select', displayValue: 'Select Capacity'}],
    slots: [{value: 'select', displayValue: 'Select TimeSlot'}],
    bookings: [],
    loading: false,
    purchased: false,
    bookingConfirm: true,
    error: null
};

const bookTableStart = ( state, action ) => {
    return updateObject( state, { loading: false } );
};

const bookTableSuccess = ( state, action ) => {
    const newOrder = updateObject( action.orderData, { id: action.orderId } );
    return updateObject( state, {
        loading: false,
        purchased: true,
        bookings: state.bookings.concat( newOrder )
    } );
};

const bookTableFail = ( state, action ) => {
    return updateObject( state, { loading: false } );
};

const bookTableInit = ( state, action ) => {
    return updateObject( state, { purchased: false } );
};

const fetchStart = ( state, action ) => {
    return updateObject( state, { error: null, loading: true } );
};

const fetchSuccess = (state, action) => {
    return updateObject( state, { 
        tables: action.tables,
        error: null,
        loading: false
     } );
};

const fetchFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        loading: false
    });
};

const fetchCapacity = (state, action) => {
    return updateObject( state, { 
        capacity: action.capacity
     } );
};

const fetchSlots = (state, action) => {
    return updateObject( state, { 
        slots: action.slots
     } );
};

const fetchBookingStart = ( state, action ) => {
    return updateObject( state, { error: null, loading: true } );
};

const fetchBookingSuccess = (state, action) => {
    return updateObject( state, { 
        bookings: action.bookings,
        error: null,
        loading: false
     } );
};

const fetchBookingFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        loading: false
    });
};

const bookingConfirm = ( state, action ) => {
    return updateObject( state, { bookingConfirm: true } );
};

const bookingStarted = ( state, action ) => {
    return updateObject( state, { bookingConfirm: false } );
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.BOOK_TABLE_START: return bookTableStart( state, action );
        case actionTypes.BOOK_TABLE_SUCCESS: return bookTableSuccess( state, action );
        case actionTypes.BOOK_TABLE_FAIL: return bookTableFail( state, action );
        case actionTypes.BOOK_TABLE_INIT: return bookTableInit( state, action );
        case actionTypes.FETCH_TABLES_START: return fetchStart(state, action);
        case actionTypes.FETCH_TABLES_SUCCESS: return fetchSuccess(state, action);
        case actionTypes.FETCH_TABLES_FAIL: return fetchFail(state, action);
        case actionTypes.FETCH_CAPACITY: return fetchCapacity(state, action);
        case actionTypes.FETCH_SLOTS: return fetchSlots(state, action);
        case actionTypes.FETCH_BOOKING_START: return fetchBookingStart(state, action);
        case actionTypes.FETCH_BOOKING_SUCCESS: return fetchBookingSuccess(state, action);
        case actionTypes.FETCH_BOOKING_FAIL: return fetchBookingFail(state, action);
        case actionTypes.BOOKING_CONFIRM: return bookingConfirm( state, action );
        case actionTypes.BOOKING_START: return bookingStarted( state, action );
        default:
            return state;
    }
};

export default reducer;