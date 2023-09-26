import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('isManager');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};

export const auth = (username, password, isManager) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            // todo: PASS UID IN PLACE OF 1 FOR DIIFFERENT USER, uid should be enterd by form if you want
            uid: username,
            password: password
        };
        let url = 'http://localhost:3000/login';

        axios.post(url, authData)
            .then(response => {
                const expiresIn = 3600;
                console.log(response);
                const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', username);
                if(isManager) {
                    localStorage.setItem('isManager', isManager);
                }
                // todo: PASS UID IN PLACE OF 1 FOR DIIFFERENT USER, uid shoudl come in login resppne with authtoken
                dispatch(authSuccess(response.data.token, username));
                dispatch(checkAuthTimeout(expiresIn));
            })
            .catch(err => {
                console.log(err.response);
                dispatch(authFail(err.response.data.error));
            });
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const setManager = () => {
    return {
        type: actionTypes.SET_MANAGER
    };
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                const userId = localStorage.getItem('userId');
                const isManager =  localStorage.getItem('isManager');
                dispatch(authSuccess(token, userId));
                if(isManager) {
                    dispatch(setManager());
                }
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
            }   
        }
    };
};