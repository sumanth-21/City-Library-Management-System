import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';
import './NavigationItems.css';
import Dropdown from '../../Dropdown/Dropdown';

const addOptions = [
    { name: 'Add Document', link: '/add/document' },
    { name: 'Add Document Copy', link: '/add/documentCopy' },
    { name: 'Add Reader', link: '/add/reader' },
    { name: 'Add Publisher', link: '/add/publisher' },
];
const listOptions = [
    { name: 'List Branches', link: '/list/branches' },
    { name: 'List Publishers', link: '/list/publisher' },
    { name: 'Most Borrowers', link: '/list/borrowers' },
    { name: 'Most Book Borrowers', link: '/list/bookBorrowers' },
    { name: 'Branch Fines', link: '/list/branchFine' },
];

const navigationItems = ( props ) => (
    <ul className='NavigationItems'>
        <NavigationItem link="/" exact>Home</NavigationItem>
        {props.isAuthenticated && props.manager ? <Dropdown name="Add" options={addOptions}/> : null}
        {props.isAuthenticated && props.manager ? <Dropdown name="List" options={listOptions}/> : null}
        {props.isAuthenticated ? <NavigationItem link="/reservation">Reserved</NavigationItem> : null}
        {props.isAuthenticated ? <NavigationItem link="/booked">Booked</NavigationItem> : null}
        {!props.isAuthenticated
            ? <NavigationItem link="/auth">SignIn/SignUp</NavigationItem>
            : <NavigationItem link="/logout">Logout</NavigationItem>}
    </ul>
);

export default navigationItems;