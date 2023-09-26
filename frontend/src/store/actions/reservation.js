import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const bookTableSuccess = ( id, orderData ) => {
    return {
        type: actionTypes.BOOK_TABLE_SUCCESS,
        orderId: id,
        orderData: orderData
    };
};

export const bookTableFail = ( error ) => {
    return {
        type: actionTypes.BOOK_TABLE_FAIL,
        error: error
    };
}

export const bookTableStart = () => {
    return {
        type: actionTypes.BOOK_TABLE_START
    };
};

export const bookTableInit = () => {
    return {
        type: actionTypes.BOOK_TABLE_INIT
    };
};

export const bookTable = ( orderData, token, tables) => {
    return dispatch => {
        dispatch( bookTableStart() );
        axios.post( '/bookings.json?auth=' + token, orderData )
            .then( response => {
                for ( let table of tables.tables ) {
                    if(table.capacity === orderData.orderData.tableCapacity) {
                        for ( let slots of table.slots ) {
                            if(Object.keys(slots)[0] === orderData.orderData.timeSlot) {
                                slots[orderData.orderData.timeSlot]--;
                            }
                        }
                    }
                }
                axios.put( '/tables.json', tables );
                dispatch( bookTableSuccess( response.data.name, orderData ) );
                dispatch(checkBookingTimeout(10));
            } )
            .catch( error => {
                dispatch( bookTableFail( error ) );
            } );
    };
};

// export const purchaseInit = () => {
//     return {
//         type: actionTypes.PURCHASE_INIT
//     };
// };

export const fetchTablesSuccess = ( tables ) => {
    return {
        type: actionTypes.FETCH_TABLES_SUCCESS,
        tables: tables
    };
};

export const fetchTablesFail = ( error ) => {
    return {
        type: actionTypes.FETCH_TABLES_FAIL,
        error: error
    };
};

export const fetchTablesStart = () => {
    return {
        type: actionTypes.FETCH_TABLES_START
    };
};

export const fetchCapacity = ( capacity ) => {
    return {
        type: actionTypes.FETCH_CAPACITY,
        capacity: capacity
    };
};

export const fetchSlots = ( capacity, tables ) => {
    let currentTable = tables.tables.filter(tab => (tab.capacity === capacity && tab.slots.filter(el => el.morning === 1 ||el.afternoon === 1 ||el.evening === 1).length !== 0));
    const fetchedSlots = [{value: 'select', displayValue: 'Select TimeSlot'}];
    for ( let table of currentTable[0].slots ) {
        if(table.morning > 0) {
            fetchedSlots.push( {
                value: Object.keys(table)[0], 
                displayValue: Object.keys(table)[0]
            } );
        }
        else if(table.afternoon > 0) {
            fetchedSlots.push( {
                value: Object.keys(table)[0], 
                displayValue: Object.keys(table)[0]
            } );
        }
        else if(table.evening > 0) {
            fetchedSlots.push( {
                value: Object.keys(table)[0], 
                displayValue: Object.keys(table)[0]
            } );
        }
    }
    return {
        type: actionTypes.FETCH_SLOTS,
        slots: fetchedSlots
    };
};

export const fetchTables = () => {
    return dispatch => {
        dispatch(fetchTablesStart());
        axios.get( '/tables.json')
            .then( res => {
                dispatch(fetchTablesSuccess(res.data));
                let availableTables = res.data.tables.filter(tab => (tab.slots.filter(el => el.morning === 1 ||el.afternoon === 1 ||el.evening === 1).length !== 0));
                const fetchedCapacity = [{value: 'select', displayValue: 'Select Capacity'}];
                for ( let table of availableTables ) {
                    fetchedCapacity.push( {
                        value: table.capacity, 
                        displayValue: table.capacity
                    } );
                }
                dispatch(fetchCapacity(fetchedCapacity));
            } )
            .catch( err => {
                dispatch(fetchTablesFail(err));
            } );
    };
};

export const fetchBookingsSuccess = ( bookings ) => {
    return {
        type: actionTypes.FETCH_BOOKING_SUCCESS,
        bookings: bookings
    };
};

export const fetchBookingsFail = ( error ) => {
    return {
        type: actionTypes.FETCH_BOOKING_FAIL,
        error: error
    };
};

export const fetchBookingsStart = () => {
    return {
        type: actionTypes.FETCH_BOOKING_START
    };
};

export const fetchBookings = (token, userId) => {
    return dispatch => {
        dispatch(fetchBookingsStart());
        const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';
        axios.get( '/bookings.json' + queryParams)
            .then( res => {
                const fetchedBookings = [];
                for ( let key in res.data ) {
                    fetchedBookings.push( {
                        ...res.data[key],
                        id: key
                    } );
                }
                dispatch(fetchBookingsSuccess(fetchedBookings));
            } )
            .catch( err => {
                dispatch(fetchBookingsFail(err));
            } );
    };
};

// export const addTable = ( capacity, slot, tables) => {
//     return dispatch => {
//                 for ( let table of tables.tables ) {
//                     if(table.capacity == capacity) {
//                         for ( let slots of table.slots ) {
//                             if(Object.keys(slots)[0] == slot) {
//                                 console.log(slots[slot]);
//                                 slots[slot]++;
//                             }
//                         }
//                     }
//                 }
//                 axios.put( '/tables.json', tables );
//     };
// };


export const checkBookingTimeout = (expirationTime) => {
    return dispatch => {
        dispatch(bookingStart());
        setTimeout(() => {
            dispatch(bookingConfirm());
        }, expirationTime * 1000);
    };
};

export const bookingStart = () => {
    return {
        type: actionTypes.BOOKING_START
    };
};

export const bookingConfirm = () => {
    return {
        type: actionTypes.BOOKING_CONFIRM
    };
};

export const cancelBooking = (id, token) => {
    return dispatch => {
        const queryParams = '?auth=' + token;
        axios.delete( `/bookings/${id}.json${queryParams}`)
            .then( res => {
                console.log(res);
                const queryParam = '?auth=' + token + '&orderBy="userId"';
                axios.get( '/bookings.json' + queryParam)
                    .then( res => {
                        const fetchedOrders = [];
                        for ( let key in res.data ) {
                            fetchedOrders.push( {
                                ...res.data[key],
                                id: key
                            } );
                        }
                        dispatch(fetchBookingsSuccess(fetchedOrders));
                        dispatch(bookingConfirm());
                    } );
            } );
        
    };
};
