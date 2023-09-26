import React from 'react';

import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';
import './Toolbar.css';

const Toolbar = ( props ) => {

    return (
        <header className='Toolbar '>
            <DrawerToggle clicked={props.drawerToggleClicked} />
            <div className='ToolBarLogo'>
                <Logo />
            </div>
            <nav className='DesktopOnly'>
                <NavigationItems isAuthenticated={props.isAuth} manager={props.manager} />
            </nav>
        </header>
    );
} 

export default Toolbar;