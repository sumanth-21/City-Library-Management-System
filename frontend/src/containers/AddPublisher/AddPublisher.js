import axios from "axios";
import { useState } from "react";
import { connect } from "react-redux";
import Modal from "../../components/UI/Modal/Modal";

const AddDocumentCopy = (props) => {
    const [formState, setFormState] = useState({ name: '', address: '' });
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
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            name: formState.name,
            address: formState.address
        }
        const headers = {
            'Content-Type': 'application/json',
            'authorization': `bearer ${props.token}`
        }
        axios.post('http://localhost:3000/admin/add/publisher', data, {
            headers: headers
        }).then(resp => {
            console.log(resp);
            if (resp.status === 200) {
                setMessage(resp.data.result);
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
            <div className="adminForms">
                <form onSubmit={handleSubmit} >
                    <div className="form-group">
                        <label for="nameInput">Name</label>
                        <input name="name" type="text" value={formState.name} onChange={handleChange} className="form-control" id="nameInput" placeholder="Enter Name" />
                    </div>
                    <div className="form-group">
                        <label for="addressImput">Address</label>
                        <input name="address" type="text" value={formState.address} onChange={handleChange} className="form-control" id="addressImput" placeholder="Enter Address" />
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
export default connect(mapStateToProps)(AddDocumentCopy);

