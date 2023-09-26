import React from 'react';

import './Logo.css';

const logo = (props) => (
    <div className='Logo' style={{height: props.height}}>
        <img src={`${process.env.PUBLIC_URL + '/icons8-literature-64.png'}`} alt="MyBook" />
    </div>
);

export default logo;