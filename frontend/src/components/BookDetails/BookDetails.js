import { useEffect, useState } from "react";
import axios from 'axios';
import Card from "../Card/Card";
import { connect } from "react-redux";
import Modal from "../UI/Modal/Modal";
import { Link } from "react-router-dom";

const BookDetails = (props) => {
    const { match } = props;
    const [documentDetails, setDocumentDetails] = useState([]);
    const [message, setMessage] = useState(null);
    
    useEffect(() => {
        if (match.params.docId) {
            const data = {
                "doc_id": Number(match.params.docId)
            }
            const headers = {
                'Content-Type': 'application/json',
                'authorization': `bearer ${props.token}`
            }
            axios.post('http://localhost:3000/reader/document/check', data, {
                headers: headers
            }).then(resp => {
                if (resp.status === 200) {
                    setDocumentDetails(resp.data.result);
                }
            })
        }
    }, [match.params.docId, message, props.token])

    const reserveBook = (doc_uuid) => {
        const data = {
            doc_uuid: doc_uuid,
            uid: props.userId
        }
        const headers = {
            'Content-Type': 'application/json',
            'authorization': `bearer ${props.token}`
        }
        axios.post('http://localhost:3000/reader/document/reserve', data, {
            headers: headers
        }).then(resp => {
            if (resp.status === 200) {
                console.log('resp',resp);
                setMessage(resp.data.result);

            }
        }).catch(err => {
            console.log(err.response);
            setMessage(err.response.data.error)
        })
    }

    const checkoutBook = (doc_uuid) => {
        console.log('working', doc_uuid);
        const data = {
            doc_uuid: doc_uuid,
            uid: props.userId
        }
        const headers = {
            'Content-Type': 'application/json',
            'authorization': `bearer ${localStorage.getItem('token')}`
        }
        axios.post('http://localhost:3000/reader/document/checkout', data, {
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
            <h2>Books Details</h2>
            {documentDetails && documentDetails?.length ?
                <div className="dataList">
                    {documentDetails.map((item, index) => (
                        <Card key={index} item={item} cardType="documentDetails" reserveBook={reserveBook} checkoutBook={checkoutBook} />
                    ))}
                </div> :
                documentDetails?.length === 0 && <><p>All Documents are reserved or already booked</p> <p>Please comeback Later. Go to <Link to="/">Home</Link> Page</p> </>
            }
            <Modal
                show={message}
                modalClosed={errorConfirmedHandler}>
                {message}
            </Modal>
        </>
    )
};
const mapStateToProps = (state) => {
    return {
        userId: state.auth.userId,
        token: state.auth.token
    }
}
export default connect(mapStateToProps)(BookDetails);