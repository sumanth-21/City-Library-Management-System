import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import axios from 'axios';
import Card from '../../components/Card/Card';
import * as actions from '../../store/actions/index';
import { Link } from 'react-router-dom';
import Modal from "../../components/UI/Modal/Modal";

import './Orders.css';

function Orders(props) {
    const { userId } = props;
    const [borrowedDocumentDetails, setBorrowedDocumentDetails] = useState([]);
    const [allDocumentDetails, setAllDocumentDetails] = useState([]);
    const [returnedDocumentDetails, setReturnedDocumentDetails] = useState([]);
    const [message, setMessage] = useState(null);

    const partition = (array, isValid) => {
        return array.reduce(([pass, fail], elem) => {
            return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
        }, [[], []]);
    }

    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            'authorization': `bearer ${props.token}`
        }
        axios.get('http://localhost:3000/reader/status/bookings/borrows', {
            headers: headers
          }).then(resp => {
            if (resp.status === 200) {
                setAllDocumentDetails(resp.data.result);
            }
        })
    }, [message, props.token]);

    useEffect(() => {
        if(allDocumentDetails?.length) {
            const [returnedDocuments, reservedDocuments] = partition(allDocumentDetails, (item) => item.RDTime !== null);
    
            setReturnedDocumentDetails(returnedDocuments);
            setBorrowedDocumentDetails(reservedDocuments);
        }
    }, [allDocumentDetails])

    const returnBook = (borrowID) => {
        console.log('working', borrowID);
        const data = {
            borrowID: borrowID
        }
        const headers = {
            'Content-Type': 'application/json',
            'authorization': `bearer ${props.token}`
        }
        axios.post('http://localhost:3000/reader/document/return', data, {
            headers: headers
        }).then(resp => {
            if (resp.status === 200) {
                console.log(resp);
                setMessage(resp.data.result)
            }
        }).catch(err => {
            console.log(err.response);
            setMessage(err.response.data.error)
        })
    }

    const errorConfirmedHandler = () => {
        setMessage(null);
    }

    return (
        <>
            <h2>User Borrowed/Returned Documents</h2>
            {/* add a button for return in reserved card */}

            {allDocumentDetails && allDocumentDetails?.length ?
                <div className='Wrapper'>
                    <div className='Reserved'>
                        <h3>Borrowed Book Details</h3>
                        <div className='card-wrapper'>
                            {borrowedDocumentDetails?.length && borrowedDocumentDetails.map((item, index) => (
                                <Card key={index} item={item} cardType="borrowedDocumentDetails" returnBook={returnBook} />
                            ))}
                        </div>
                    </div>
                    <div className='Returned'>
                        <h3>Returned Book Details</h3>
                        <div className='card-wrapper'>
                            {returnedDocumentDetails?.length && returnedDocumentDetails.map((item, index) => (
                                <Card key={index} item={item} cardType="returnedDocumentDetails" />
                            ))}
                        </div>
                    </div>
                </div> :
                allDocumentDetails?.length === 0 && <><p>User has no Reserved Documents present</p> <p>Go to <Link to="/">Home</Link> Page</p> </>
            }
            <Modal
                show={message}
                modalClosed={errorConfirmedHandler}>
                {message}
            </Modal>
        </>
    );
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        orderConfirm: state.order.orderConfirm,
        token: state.auth.token,
        userId: state.auth.userId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, userId) => dispatch( actions.fetchOrders(token, userId) ),
        onCancelOrder: (id, token) => dispatch( actions.cancelOrder(id, token) )
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( Orders );