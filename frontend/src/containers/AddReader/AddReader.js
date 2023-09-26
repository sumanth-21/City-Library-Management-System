import axios from "axios";
import { useState } from "react";
import { connect } from "react-redux";
import Modal from "../../components/UI/Modal/Modal";

const AddReader = (props) => {

    const [formState, setFormState] = useState({
        "name": "",
        "type": "",
        "password": "",
        "address": "",
        "phone": ""
    });
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
        const data = {
            "title": formState.title,
            "pdate": formState.pdate,
            "publisherID": parseInt(formState.publisherID),
            "name": formState.name,
            "type": formState.type,
            "password": formState.password,
            "address": formState.address,
            "phone": formState.phone
        }
        const headers = {
            'Content-Type': 'application/json',
            'authorization': `bearer ${props.token}`
        }
        console.log(data);
        axios.post('http://localhost:3000/admin/add/reader', data, {
            headers: headers
        }).then(resp => {
            console.log(resp);
            if (resp.status === 200) {
                setMessage(resp.data.result);
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
                        <label for="nameInput">Name</label>
                        <input name="name" type="text" value={formState.name} onChange={handleChange} className="form-control" id="nameInput" placeholder="Enter NAME" />
                    </div>
                    <div className="form-group">
                        <label for="copyInput">Type</label>
                        <input name="type" type="text" value={formState.type} onChange={handleChange} className="form-control" id="copyInput" placeholder="Enter Reader Type" />
                    </div>
                    <div className="form-group">
                        <label for="bIdInput">Password</label>
                        <input name="password" type="password" value={formState.password} onChange={handleChange} className="form-control" id="bIdInput" placeholder="Enter Password" />
                    </div>
                    <div className="form-group">
                        <label for="addressInput">Address</label>
                        <input name="address" type="text" value={formState.address} onChange={handleChange} className="form-control" id="addressInput" placeholder="Enter Address" />
                    </div>
                    <div className="form-group">
                        <label for="phoneInput">Phone</label>
                        <input name="phone" type="text" value={formState.phone} onChange={handleChange} className="form-control" id="phoneInput" placeholder="Enter Phone" />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
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
export default connect(mapStateToProps)(AddReader);