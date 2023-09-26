import axios from "axios";
import { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Card from "../../components/Card/Card";
import Modal from "../../components/UI/Modal/Modal";

const BranchFine = (props) => {

    const [formState, setFormState] = useState({ bid: ''});
    const [message, setMessage] = useState(null);
    const [branchData, setBranchData] = useState(null);

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
        const data = {}
        if(formState.bid) {
            data.bid = Number(formState.bid)
        }
        const headers = {
            'Content-Type': 'application/json',
            'authorization': `bearer ${props.token}`
        }
        console.log(data);
        axios.post('http://localhost:3000/admin/fine', data, {
            headers: headers
        }).then(resp => {
            console.log(resp);
            if (resp.status === 200) {
                setBranchData(resp.data.result);
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
            <div className="adminForms">
                <form onSubmit={handleSubmit} >
                    <div className="form-group">
                        <label for="nameInput">Enter Branch ID</label>
                        <input name="bid" type="number" value={formState.bid} onChange={handleChange} className="form-control" id="nameInput" placeholder="Enter Branch ID" />
                    </div>
                    <button type="submit" className="btn btn-primary">Get Fines</button>
                </form>
            </div>
            {branchData && branchData?.length ?
                <div className="dataList">
                    {branchData.map((item) => (
                        <Card key={item.Publisher_ID} item={item} cardType="branchFineDetails" />
                    ))}
                </div> :
                branchData?.length === 0 && <><p>No Details Exist.</p> <p>Please comeback Later. Go to <Link to="/">Home</Link> Page</p> </>
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
export default connect(mapStateToProps)(BranchFine);