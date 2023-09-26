import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addTable = ( capacity, slot, tables) => {
    return dispatch => {
            for ( let table of tables.tables ) {
                if(table.capacity === capacity) {
                    for ( let slots of table.slots ) {
                        if(Object.keys(slots)[0] === slot) {
                            console.log(slots[slot]);
                            slots[slot]++;
                        }
                    }
                }
            }
            axios.put( '/tables.json', tables )
                .then( res => {
                    alert("Table Added Successfully")
                } );
    };
};

export const fetchAllOrdersSuccess = ( orders ) => {
    return {
        type: actionTypes.FETCH_ALL_ORDERS_SUCCESS,
        orders: orders
    };
};

export const fetchAllOrdersFail = ( error ) => {
    return {
        type: actionTypes.FETCH_ALL_ORDERS_FAIL,
        error: error
    };
};

export const fetchAllOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ALL_ORDERS_START
    };
};

export const fetchAllOrders = (token) => {
    return dispatch => {
        dispatch(fetchAllOrdersStart());
        const queryParams = '?auth=' + token;
        axios.get( '/orders.json' + queryParams)
            .then( res => {
                const fetchedOrders = [];
                for ( let key in res.data ) {
                    fetchedOrders.push( {
                        ...res.data[key],
                        id: key
                    } );
                }
                dispatch(fetchAllOrdersSuccess(fetchedOrders));
            } )
            .catch( err => {
                dispatch(fetchAllOrdersFail(err));
            } );
    };
};

export const fetchAllBookingsSuccess = ( bookings ) => {
    return {
        type: actionTypes.FETCH_ALL_BOOKING_SUCCESS,
        bookings: bookings
    };
};

export const fetchAllBookingsFail = ( error ) => {
    return {
        type: actionTypes.FETCH_ALL_BOOKING_FAIL,
        error: error
    };
};

export const fetchAllBookingsStart = () => {
    return {
        type: actionTypes.FETCH_ALL_BOOKING_START
    };
};

export const fetchAllBookings = (token) => {
    return dispatch => {
        dispatch(fetchAllBookingsStart());
        const queryParams = '?auth=' + token;
        axios.get( '/bookings.json' + queryParams)
            .then( res => {
                const fetchedBookings = [];
                for ( let key in res.data ) {
                    fetchedBookings.push( {
                        ...res.data[key],
                        id: key
                    } );
                }
                dispatch(fetchAllBookingsSuccess(fetchedBookings));
            } )
            .catch( err => {
                dispatch(fetchAllBookingsFail(err));
            } );
    };
};
