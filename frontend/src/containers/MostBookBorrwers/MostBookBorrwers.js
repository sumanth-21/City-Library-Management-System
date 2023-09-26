
import { useState } from "react";
import axios from 'axios';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Card from "../../components/Card/Card";
import Modal from "../../components/UI/Modal/Modal";


const MostBorrwers = (props) => {

    const [borrowData, setBorrowData] = useState(null);
    const [formState, setFormState] = useState({ year:'', bid: '' });
    const [message, setMessage] = useState(null);


    const handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setFormState((prevState) => {
            return {
                ...prevState,
                [name]: value
            }
        })
        console.log(formState);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = { limit: 10 }
        if (formState.bid) {
            data.bid = Number(formState.bid)
        }
        if (formState.year) {
            data.year = Number(formState.year)
        }
        const headers = {
            'Content-Type': 'application/json',
            'authorization': `bearer ${props.token}`
        }
        console.log(data);
        axios.post('http://localhost:3000/admin/stats/most/borrowed/books', data, {
            headers: headers
        }).then(resp => {
            console.log(resp);
            if (resp.status === 200) {
                setBorrowData(resp.data.result);
            }
        }).catch(err => {
            setMessage(err.response.data.error)
        })
    }

    const errorConfirmedHandler = () => {
        setMessage(null);
    }
    return (
        <>
            <h2>Most Book Borrowed Details</h2>
            <div className="adminForms">
                <form>
                    <div className="form-group">
                        <label for="yearInput">Enter Year</label>
                        <input name="year" type="number" value={formState.year} onChange={handleChange} className="form-control" id="yearInput" placeholder="Enter Year" />
                    </div>
                    <div className="form-group">
                        <label for="nameInput">Enter Branch ID</label>
                        <input name="bid" type="number" value={formState.bid} onChange={handleChange} className="form-control" id="nameInput" placeholder="Enter Branch ID" />
                    </div>
                    <button type="submit" className="btn btn-primary mt-4" onClick={handleSubmit}>Get Borrowed Book Data</button>
                </form>
            </div>

            {borrowData && borrowData?.length ?
                <div className="dataList">
                    {borrowData.map((item, index) => (
                        <Card key={index} item={item} cardType="bookBorrowDetails" />
                    ))}
                </div> :
                borrowData?.length === 0 && <><p>No Details Found</p> <p>Please comeback Later. Go to <Link to="/">Home</Link> Page</p> </>
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
export default connect(mapStateToProps)(MostBorrwers);