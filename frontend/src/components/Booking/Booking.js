import React from 'react';

import classes from './Booking.css';
import Button from '../UI/Button/Button';

const booking = ( props ) => {

    return (
        <div className={classes.Booking}>
            <p>Table Capacity: {props.capacity}</p>
            <p>Time Slot: <strong>{props.timeSlot}</strong></p>
            <Button 
                btnType="Danger"
                clicked={props.cancelOrder}
                disabled={props.confirmOrder} >Cancel Booking</Button>
        </div>
    );
};

export default booking;