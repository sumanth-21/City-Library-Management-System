import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Modal from "../../components/UI/Modal/Modal";

import axios from 'axios';
import * as actions from '../../store/actions/index';
import Card from '../../components/Card/Card';
import './Reservation.css';

function Reservation(props) {
    const [reservedDocumentDetails, setReservedDocumentDetails] = useState([]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            'authorization': `bearer ${props.token}`
        }
        axios.get('http://localhost:3000/reader/status/bookings/reserves', {
            headers: headers
        }).then(resp => {
            if (resp.status === 200) {
                setReservedDocumentDetails(resp.data.result);
            }
        })
    }, [message, props.token]);

    const borrowBook = (reserveId) => {
        console.log('working', reserveId);
        const data = {
            reserveID: Number(reserveId)
        }
        const headers = {
            'Content-Type': 'application/json',
            'authorization': `bearer ${props.token}`
        }
        axios.post('http://localhost:3000/reader/document/reserve/checkout', data, {
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
            <h2>User Reserved Documents</h2>

            {reservedDocumentDetails && reservedDocumentDetails?.length ?
                <div className='dataList'>
                    {reservedDocumentDetails?.length && reservedDocumentDetails.map((item, index) => (
                        item.RStatus!=1 ? <Card key={index} item={item} cardType="reservedDocumentDetails" borrowBook={borrowBook} /> : null
                    ))}
                </div>
                // <div className='Wrapper'>
                //     <div className='Reserved'>
                //         <h3>Resered Book Details</h3>
                //         <div className='card-wrapper'>
                //             {reservedDocumentDetails?.length && reservedDocumentDetails.map((item, index) => (
                //                 <Card key={index} item={item} cardType="reservedDocumentDetails" />
                //             ))}
                //         </div>
                //     </div>
                //     <div className='Returned'>
                //         <h3>Returned Book Details</h3>
                //         <div className='card-wrapper'>
                //             {returnedDocumentDetails?.length && returnedDocumentDetails.map((item, index) => (
                //                 <Card key={index} item={item} cardType="returnedDocumentDetails" />
                //             ))}
                //         </div>
                //     </div>
                // </div> 
                :
                reservedDocumentDetails?.length === 0 && <><p>User has no Reserved Documents present</p> <p>Go to <Link to="/">Home</Link> Page</p> </>
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
        tables: state.reservation.tables,
        capacity: state.reservation.capacity,
        slots: state.reservation.slots,
        loading: state.reservation.loading,
        purchased: state.reservation.purchased,
        userId: state.auth.userId,
        token: state.auth.token
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderTable: (orderData, token, tables) => dispatch(actions.bookTable(orderData, token, tables)),
        onOrderTableInit: () => dispatch(actions.bookTableInit()),
        onFetchTables: () => dispatch(actions.fetchTables()),
        onFetchSlots: (capacity, tables) => dispatch(actions.fetchSlots(capacity, tables))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Reservation);