import axios from "axios";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Card from "../../components/Card/Card";
import Modal from "../../components/UI/Modal/Modal";

const ListPublisher = (props) => {
    const [publisherDetails, setPublisherDetails] = useState([]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            'authorization': `bearer ${props.token}`
        }
        axios.get('http://localhost:3000/admin/publishers', {
            headers: headers
        }).then(resp => {
            if (resp.status === 200) {
                setPublisherDetails(resp.data.result);
            }
        })
    },[])

    const errorConfirmedHandler = () => {
        setMessage(null);
    }

    return (
        <>
            <h2>Publishers Details</h2>
            {publisherDetails && publisherDetails?.length ?
                <div className="dataList">
                    {publisherDetails.map((item) => (
                        <Card key={item.Publisher_ID} item={item} cardType="publisherDetails" />
                    ))}
                </div> :
                publisherDetails?.length === 0 && <><p>No Details Exist.</p> <p>Please comeback Later. Go to <Link to="/">Home</Link> Page</p> </>
            }
            <Modal
                show={message}
                modalClosed={errorConfirmedHandler}>
                {message}
            </Modal>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        userId: state.auth.userId,
        token: state.auth.token
    }
}

export default connect(mapStateToProps)(ListPublisher);