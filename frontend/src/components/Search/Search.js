import './Search.css';
import { useState } from 'react';
import { connect } from "react-redux";
import * as actions from '../../store/actions/index';
import axios from 'axios';
import Card from '../Card/Card';

const Search = (props) => {
    const [books, setBooks] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentFilter, setCurrentFilter] = useState('title');
    const [currentStock, setCurrentStock] = useState('all');
    const filterList = [
        {name:'Title', filterValue:'title'},
        // todo: check publisher value if it is passed correctly
        {name:'Publisher', filterValue:'publisher'},
        {name:'Document ID', filterValue:'doc_id'},
    ]
    const stock = [
        {name:'All', filterValue:'all'},
        {name:'InStock Only', filterValue:'in'},
        {name:'OutOfStock Only', filterValue:'out'},
    ]

    const getSearchParam = () => {
        if(currentFilter === 'Doc_ID') {
            return (Number(searchKeyword))
        }
        return searchKeyword;
    }

    
    console.log(props.manager);

    const submitForm = (e) => {
        e.preventDefault();
        const searchParam = getSearchParam();
        let data;

        if (props.manager && (currentStock ==='in' || currentStock === 'out')) {
            data = {
                "searchBy": currentFilter,
                "search": searchParam,
                "available": currentStock === 'in' ? true : false
            }
        } else {
            data = {
                "searchBy": currentFilter,
                "search": searchParam
            }
        }
        const headers = {
            'Content-Type': 'application/json',
            'authorization': `bearer ${localStorage.getItem('token')}`
          }
        console.log(data);
        let url = props.manager ? 'http://localhost:3000/admin/search' : 'http://localhost:3000/reader/search';
        axios.post(url, data, {
            headers: headers
          }).then(resp=>{
            console.log(resp);
            if(resp.status === 200) {
                setBooks(resp.data.result);
            }
        })
    }

    return (
        <div className="filter">
            <div className="search-outer">
                <form
                    role="search"
                    method="get"
                    id="searchform"
                    className="searchform">
                    {/* input field activates onKeyUp function on state change */}
                    <input
                        type="search"
                        onChange={(e)=>setSearchKeyword(e.target.value)}
                        name="search"
                        id="s"
                        placeholder="Search"
                        value={searchKeyword}
                    />
                    <button type="submit" id="searchsubmit" onClick={submitForm}>
                        <img src="https://img.icons8.com/ios-glyphs/30/null/search--v1.png" alt="SEARCH iCON" />
                    </button>
                </form>
                <form>
                    <div className='showFilter'>
                        <div className='radioFilter'>
                            <span>Search By:</span>
                            {filterList.map((filter, index) => (
                                <div key={index}>
                                    <input checked={filter.filterValue === currentFilter} type='radio' value={filter.filterValue} id={filter.name} name='filterResults' onChange={(event) => setCurrentFilter(event.target.value)} />
                                    <label htmlFor={filter.name}>{filter.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>
                {props.manager && 
                    <form>
                        <div className='showFilter'>
                            <div className='radioFilter'>
                                <span>Filter By:</span>
                                {stock.map((filter, index) => (
                                    <div key={index}>
                                        <input checked={filter.filterValue === currentStock} type='radio' value={filter.filterValue} id={filter.name} name='filterResults' onChange={(event) => setCurrentStock(event.target.value)} />
                                        <label htmlFor={filter.name}>{filter.name}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>
                }
            </div>
            {books && books?.length ? 
                <div className="data-list">
                    {books.map((item, index) => (
                        <Card key={index} item={item} cardType="bookDetails"/>
                    ))}
                </div> : 
                books?.length === 0 && <p>No Results Found</p> 
            }
        </div>
    );
};

const mapStateToProps = state => {
    return {
        manager: state.auth.manager
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
        onSetManger: () => dispatch(actions.setManager())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);

