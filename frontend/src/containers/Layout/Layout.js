import React, { useState } from 'react';
import { connect } from 'react-redux';

import axios from 'axios';

import './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import Alert from '../../components/Alert/Alert';

const Layout = (props) => {
    const initState = {
        showSideDrawer: false
    }
    const [state, setState] = useState(initState);
    const [fine, setFine] = useState(0);

    const sideDrawerClosedHandler = () => {
        setState(initState);
    }

    const sideDrawerToggleHandler = () => {
        setState((prevState) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        });
    }

    if (props.isAuthenticated && !props.manager) {
        const headers = {
            'Content-Type': 'application/json',
            'authorization': `bearer ${props.token}`
        }
        axios.get('http://localhost:3000/reader/status/fines', {
            headers: headers
        }).then(resp => {
            if (resp.status === 200) {
                console.log(resp);
                setFine(resp.result)
            }
        }).catch(err => {
            console.log(err.response);
        })
    }

    return (
        <div>
            <Toolbar
                isAuth={props.isAuthenticated}
                manager={props.manager}
                drawerToggleClicked={sideDrawerToggleHandler} />
            <SideDrawer
                isAuth={props.isAuthenticated}
                manager={props.manager}
                open={state.showSideDrawer}
                closed={sideDrawerClosedHandler} />
            <main className='Content'>
                {props.isAuthenticated && !props.manager ? <Alert fine={fine} /> : null}
                <div className="HomeContainer" style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL + '/book-background.png'})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '50% 75%'
                }}>
                    {props.children}
                </div>
            </main>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        manager: state.auth.manager
    };
};

export default connect(mapStateToProps)(Layout);
