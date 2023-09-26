import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    allOrders: [],
    allBookings: [],
    loading: false,
    error: null
};

const fetchAllOrdersStart = ( state, action ) => {
    return updateObject( state, { loading: true } );
};

const fetchAllOrdersSuccess = ( state, action ) => {
    return updateObject( state, {
        allOrders: action.orders,
        loading: false
    } );
};

const fetchAllOrdersFail = ( state, action ) => {
    return updateObject( state, { loading: false } );
};

const fetchAllBookingStart = ( state, action ) => {
    return updateObject( state, { error: null, loading: true } );
};

const fetchAllBookingSuccess = (state, action) => {
    return updateObject( state, { 
        allBookings: action.bookings,
        error: null,
        loading: false
     } );
};

const fetchAllBookingFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        loading: false
    });
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.FETCH_ALL_ORDERS_START: return fetchAllOrdersStart( state, action );
        case actionTypes.FETCH_ALL_ORDERS_SUCCESS: return fetchAllOrdersSuccess( state, action );
        case actionTypes.FETCH_ALL_ORDERS_FAIL: return fetchAllOrdersFail( state, action );
        case actionTypes.FETCH_ALL_BOOKING_START: return fetchAllBookingStart( state, action );
        case actionTypes.FETCH_ALL_BOOKING_SUCCESS: return fetchAllBookingSuccess( state, action );
        case actionTypes.FETCH_ALL_BOOKING_FAIL: return fetchAllBookingFail( state, action );
        default:
            return state;
    }
};

export default reducer;