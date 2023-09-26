import { useEffect, useState } from "react";
import { connect } from "react-redux";
import './HomePage.css';
import Search from "../../components/Search/Search";
import * as actions from '../../store/actions/index';
import { Link } from "react-router-dom";

const HomePage = (props) => {
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        if (props.isAuthenticated) {
            setShowSearch(prevState => !prevState)
        }
    }, [props.isAuthenticated])

    return (
        <>
            <h2>The City Library</h2>
            {showSearch && <Search />}
            {!showSearch && <p>Login to Proceed. <Link to='/auth'>Login</Link></p>}
        </>
    )
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
        onSetManger: () => dispatch(actions.setManager())
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);