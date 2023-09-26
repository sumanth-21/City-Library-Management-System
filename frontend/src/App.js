import './App.css';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { useEffect } from 'react';
import { connect } from 'react-redux';

import Auth from './containers/Auth/Auth';
import Layout from './containers/Layout/Layout';
import HomePage from './containers/HomePage/HomePage';
import BookDetails from './components/BookDetails/BookDetails';

import * as actions from './store/actions/index';
import Logout from './containers/Auth/Logout/Logout';
import Reservation from './containers/Reservation/Reservation';
import Orders from './containers/Orders/Orders';
import AddDocument from './containers/AddDocument/AddDocument';
import AddDocumentCopy from './containers/AddDocumentCopy/AddDocumentCopy';
import ListBranches from './containers/ListBranches/ListBranches';
import ListPublisher from './containers/ListPublisher/ListPublisher';
import AddPublisher from './containers/AddPublisher/AddPublisher';
import AddReader from './containers/AddReader/AddReader';
import BranchFine from './containers/BranchFine/BranchFine';
import MostBorrwers from './containers/MostBorrwers/MostBorrwers';
import MostBookBorrwers from './containers/MostBookBorrwers/MostBookBorrwers';


function App(props) {

  useEffect(() => {
    props.onTryAutoSignup();
  })
  let routes = (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route path="/" exact component={HomePage} />
      <Redirect to="/" />
    </Switch>
  );
    
    
  if ( props.manager && props.isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/add/document" component={AddDocument} />
        <Route path="/add/documentCopy" component={AddDocumentCopy} />
        <Route path="/add/reader" component={AddReader} />
        <Route path="/add/publisher" component={AddPublisher} />
        <Route path="/list/branches" component={ListBranches} />
        <Route path="/list/publisher" component={ListPublisher} />
        <Route path="/list/borrowers" component={MostBorrwers} />
        <Route path="/list/bookBorrowers" component={MostBookBorrwers} />
        <Route path="/list/branchFine" component={BranchFine} />
        <Route path="/logout" component={Logout} />
        <Route path='/book/:docId' component={BookDetails}/>
        <Route path="/reservation" component={Reservation} />
        <Route path="/booked" component={Orders} />
        <Route path="/" exact component={HomePage} />
        <Redirect to="/" />
      </Switch>
    );
  }

  if ( props.isAuthenticated && props.manager === false) {
    routes = (
      <Switch>
        <Route path='/book/:docId' component={BookDetails}/>
        <Route path="/reservation" component={Reservation} />
        <Route path="/booked" component={Orders} />
        <Route path="/logout" component={Logout} />
        <Route path="/" exact component={HomePage} />
        <Redirect to="/" />
      </Switch>
    );
  }
  return (
    <div className="App">
      <Layout>
        {routes}
      </Layout>
    </div>
  );
}
const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    manager: state.auth.manager
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
