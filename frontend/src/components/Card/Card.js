import { Link } from 'react-router-dom';
import Button from '../UI/Button/Button';
import './Card.css';

const Card = (props) => {
    const { item, cardType } = props;
    const docId = item.Doc_ID
    return (
        <div className="Card">
            {cardType === 'bookDetails' && <Link to={`/book/${docId}`}>
                <img src={`${process.env.PUBLIC_URL + '/icons8-literature-64.png'}`} alt={item.Title} />
                <div className="card-body">
                    <h3>{item.Title}</h3>
                    <p className="cardDes">Publishing Date: {new Date(item.PDate).toDateString()}</p>
                    <h5>Publisher ID: {item.Publisher_ID}</h5>
                </div>
            </Link>}
            {cardType === 'documentDetails' &&
                <>
                    <img src={`${process.env.PUBLIC_URL + '/icons8-literature-64.png'}`} alt={item.Title} />
                    <div className="card-body">
                        <h3><span>Library:</span> {item.Name}, {item.Location} </h3>
                        <p className="cardDes">Available: {item.Available}</p>
                        <h5><span>Copy Number:</span> {item.Copy_No}</h5>
                        <div className='btn-container'>
                            <Button type="button" btnType="reserve" clicked={() => props.reserveBook(item.UUID)}>Reserve</Button>
                            <Button type="button" btnType="borrow" clicked={() => props.checkoutBook(item.UUID)}>Checkout</Button>
                        </div>
                    </div>
                </>
            }
            {cardType === 'returnedDocumentDetails' &&
                <>
                    <img src={`${process.env.PUBLIC_URL + '/icons8-literature-64.png'}`} alt={item.Title} />
                    <div className="card-body">
                        <h3><span>Title:</span> {item.Title}
                        </h3>
                        <h3><span>Library:</span> {item.Name}, {item.Location} </h3>
                        <p className="cardDetail"><span>Booked Date:</span> {new Date(item.BDTime).toUTCString()}</p>
                        <p className="cardDetail"><span>Returned Date:</span> {new Date(item.RDTime).toUTCString()}</p>
                        <h5 className="cardDetail"><span>Fine:</span> ${item.Fine}</h5>
                    </div>
                </>
            }
            {cardType === 'reservedDocumentDetails' &&
                <>
                    <img src={`${process.env.PUBLIC_URL + '/icons8-literature-64.png'}`} alt={item.Title} />
                    <div className="card-body">
                        <h3><span>Title:</span> {item.Title}</h3>
                        <h3><span>Library:</span> {item.Name}, {item.Location} </h3>
                        <p className="cardDetail"><span>Reserved Date:</span> {new Date(item.RDTime).toUTCString()}</p>
                        <div className='btn-container'>
                            <Button type="button" btnType="borrow" clicked={() => props.borrowBook(item.Reserve_ID)} disabled={item.RStatus==0 ? true : false}>{item.RStatus==0 ? 'Cancelled' : 'Borrow'}</Button>
                        </div>
                    </div>
                </>
            }
            {cardType === 'borrowedDocumentDetails' &&
                <>
                    <img src={`${process.env.PUBLIC_URL + '/icons8-literature-64.png'}`} alt={item.Title} />
                    <div className="card-body">
                        <h3> <span>Title:</span> {item.Title}
                        </h3>
                        <h3> <span>Library:</span> {item.Name}, {item.Location} </h3>
                        <p className="cardDetail"><span>Borrowed Date:</span> {new Date(item.BDTime).toUTCString()}</p>
                        <p className="cardDetail"><span>Fine:</span> ${item.Fine}</p>
                        <div className='btn-container'>
                            <Button type="button" btnType="borrow" clicked={() => props.returnBook(item.Borrow_ID)}>Return</Button>
                        </div>
                    </div>
                </>
            }
            {cardType === 'libraryBranchDetails' && <>
                <img src={`${process.env.PUBLIC_URL + '/icons8-literature-64.png'}`} alt={item.Title} />
                <div className="card-body">
                    <h3>{item.Name}</h3>
                    <p className="cardDes">Location: {item.Location}</p>
                </div>
            </>}
            {cardType === 'publisherDetails' && <>
                <img src={`${process.env.PUBLIC_URL + '/icons8-literature-64.png'}`} alt={item.Title} />
                <div className="card-body">
                    <h3>{item.Publisher_Name}</h3>
                    <p className="cardDes">Address: {item.Address}</p>
                </div>
            </>}
            {cardType === 'branchFineDetails' && <>
                <div className="card-body">
                    <h3>{item.Name}</h3>
                    <p className="cardDes">Address: {item.Location}</p>
                    <p className="cardDes">FINES: {item.FINES}</p>
                </div>
            </>}
            {cardType === 'borrowDetails' && <>
                <div className="card-body">
                    <h3>{item.Name}</h3>
                    <p className="cardDes">Phone Number: {item.Phone_NO}</p>
                    <p className="cardDes">BORROWS: {item.BORROWS}</p>
                </div>
            </>}
            {cardType === 'bookBorrowDetails' && <>
                <div className="card-body">
                    <h3>{item.Title}</h3>
                    <p className="cardDes"><span>No Of Borrows:</span> {item.NO_OF_BORROWS}</p>
                </div>
            </>}
        </div>
    )
}

export default Card;