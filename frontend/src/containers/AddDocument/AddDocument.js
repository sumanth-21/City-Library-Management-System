import axios from "axios";
import { useState } from "react";
import { connect } from "react-redux";
import Modal from "../../components/UI/Modal/Modal";

const AddDocument = (props) => {

    const [formState, setFormState] = useState({ title: '', pdate: '', publisherID: '' });
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
            "publisherID": parseInt(formState.publisherID)
        }
        const headers = {
            'Content-Type': 'application/json',
            'authorization': `bearer ${props.token}`
        }
        console.log(data);
        axios.post('http://localhost:3000/admin/add/document', data, {
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
                        <label for="nameInput">Document Title</label>
                        <input name="title" type="text" value={formState.title} onChange={handleChange} className="form-control" id="nameInput" placeholder="Enter Document Title" />
                    </div>
                    <div className="form-group">
                        <label for="copyInput">Publishing Date</label>
                        <input name="pdate" type="date" value={formState.pdate} onChange={handleChange} className="form-control" id="copyInput" placeholder="Enter Publishing Date" />
                    </div>
                    <div className="form-group">
                        <label for="bIdInput">Publisher ID</label>
                        <input name="publisherID" type="number" value={formState.publisherID} onChange={handleChange} className="form-control" id="bIdInput" placeholder="Enter Publisher ID" />
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
export default connect(mapStateToProps)(AddDocument);