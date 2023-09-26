import axios from "axios";
import { useState } from "react";
import { connect } from "react-redux";
import Modal from "../../components/UI/Modal/Modal";

const AddDocumentCopy = (props) => {
    const [formState, setFormState] = useState({ documentID: '', copyNumber: '', bID: '' });
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
            "doc_id": parseInt(formState.documentID),
            "copy_no": parseInt(formState.copyNumber),
            "bid": parseInt(formState.bID),
        }
        const headers = {
            'Content-Type': 'application/json',
            'authorization': `bearer ${props.token}`
        }
        console.log(data);
        axios.post('http://localhost:3000/admin/add/copy', data, {
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
    console.log(formState);
    return (
        <>
            <div className="adminForms">
                <form onSubmit={handleSubmit} >
                    <div className="form-group">
                        <label for="nameInput">Document ID</label>
                        <input name="documentID" type="number" value={formState.documentID} onChange={handleChange} className="form-control" id="nameInput" placeholder="Enter Document ID" />
                    </div>
                    <div className="form-group">
                        <label for="copyInput">Copy Number</label>
                        <input name="copyNumber" type="number" value={formState.copyNumber} onChange={handleChange} className="form-control" id="copyInput" placeholder="Enter Copy Number" />
                    </div>
                    <div className="form-group">
                        <label for="bIdInput">B ID</label>
                        <input name="bID" type="number" value={formState.bID} onChange={handleChange} className="form-control" id="bIdInput" placeholder="Enter B ID" />
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