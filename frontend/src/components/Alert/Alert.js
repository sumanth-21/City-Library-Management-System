import React from 'react';

import classes from './Alert.css';

const Alert = ( props ) => {

    return (
        <div className='Alert'>
            <p>Fine: <span>${props.fine}</span></p>
        </div>
    );
}

export default Alert;