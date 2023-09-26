import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import './Auth.css';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

const Auth = (props) => {
    const defaultState = {
        controls: {
            username: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'User Id'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        isSignup: false
    }
    const [state, setState] = useState(defaultState);

    // componentDidMount() {
    //     if (!props.buildingBurger && props.authRedirectPath !== '/') {
    //         props.onSetAuthRedirectPath('/');
    //     }
    // }

    useEffect(()=>{
        // if (!props.buildingBurger && props.authRedirectPath !== '/') {
        if (props.authRedirectPath !== '/') {
            props.onSetAuthRedirectPath('/');
        }
    })

    const checkValidity = ( value, rules ) => {
        let isValid = true;
        if ( !rules ) {
            return true;
        }

        if ( rules.required ) {
            isValid = value.trim() !== '' && isValid;
        }

        if ( rules.minLength ) {
            isValid = value.length >= rules.minLength && isValid
        }

        if ( rules.maxLength ) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if ( rules.isEmail ) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test( value ) && isValid
        }

        if ( rules.isNumeric ) {
            const pattern = /^\d+$/;
            isValid = pattern.test( value ) && isValid
        }

        return isValid;
    }

    const inputChangedHandler = ( event, controlName ) => {
        const updatedControls = {
            ...state.controls,
            [controlName]: {
                ...state.controls[controlName],
                value: event.target.value,
                valid: checkValidity( event.target.value, state.controls[controlName].validation ),
                touched: true
            }
        };
        setState( { controls: updatedControls } );
    }

    const submitHandler = ( event ) => {
        event.preventDefault();
        let isManager = false;
        if(state.controls.username.value === '1' && state.controls.password.value === 'password') {
            props.onSetAuthRedirectPath('/');
            props.onSetManger();
            isManager = true;
        }
        props.onAuth( state.controls.username.value, state.controls.password.value, isManager );
    }

    // const switchAuthModeHandler = () => {
    //     setState(prevState => {
    //         return {isSignup: !prevState.isSignup};
    //     });
    // }

    const formElementsArray = [];
    for ( let key in state.controls ) {
        formElementsArray.push( {
            id: key,
            config: state.controls[key]
        } );
    }

    let form = formElementsArray.map( formElement => (
        <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={( event ) => inputChangedHandler( event, formElement.id )} />
    ) );

    if (props.loading) {
        form = <Spinner />
    }

    let errorMessage = null;

    if (props.error) {
        errorMessage = (
            <p>{props.error}</p>
        );
    }

    let authRedirect = null;
    if (props.isAuthenticated) {
        authRedirect = <Redirect to={props.authRedirectPath}/>
    }

    return (
        <div className='Auth'>
            <h2>Please Login</h2>
            {authRedirect}
            {errorMessage}
            <form onSubmit={submitHandler}>
                {form}
                <Button type="submit" btnType="Success">SUBMIT</Button>
            </form>
            {/* <Button 
                clicked={switchAuthModeHandler}
                btnType="Danger">SWITCH TO {state.isSignup ? 'SIGNIN' : 'SIGNUP'}</Button> */}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: ( username, password, isSignup ) => dispatch( actions.auth( username, password, isSignup ) ),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
        onSetManger: () => dispatch(actions.setManager())
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( Auth );