import React from 'react';
import {Switch, Route, withRouter, Redirect, Link} from 'react-router-dom';
import UseCase from '../components/UseCase/UseCase';
import UseCasesList from '../containers/UseCasesList/UseCasesList';
import {connect} from 'react-redux';
import asyncComponent from '../hoc/asyncComponent/asyncComponent';
import AboutPage from '../components/About/About';
import documentation from '../components/Documentation/Documentation';

const asyncLogin = asyncComponent(() => {
    return import('../containers/Auth/Auth');
});

const asyncLogout = asyncComponent(() => {
    return import('../containers/Auth/Logout/Logout');
});

const asyncAdmin = asyncComponent(() => {
    return import('../containers/AdminArea/AdminArea');
});

const asyncUserProfile = asyncComponent(() => {
    return import('../containers/UserProfile/UserProfile');
});

const defaultMessage = <p> Please <Link to='/login'>Login</Link> or <Link to='/login'>Sign Up</Link> for an account to access the website</p>;

const AppRouter = (props) => {
    let routes = (
        <Switch>
            <Route exact path="/" render={() => defaultMessage}/>
            <Route exact path="/login" component={asyncLogin}/>
            <Route exact path="/logout" component={asyncLogout}/>
            <Route exact path="/" render={() => defaultMessage}/>
            <Redirect to="/" render={() => defaultMessage}/>
        </Switch>
    );

    if(localStorage.getItem("email") !== null){
        routes =
            <Switch>
                <Route path="/documentation" component={documentation} />
                <Route exact path="/dashboard" component={UseCasesList}/>
                <Route exact path="/profile" component={asyncUserProfile}/>
                <Route exact path="/login" component={asyncLogin}/>
                <Route exact path='/logout' component={asyncLogout} />
                <Route path="/usecases/:id" render={props => <UseCase {...props} />} />
                <Redirect to='/dashboard' component={UseCasesList}/>
            </Switch>
    }

    if(localStorage.getItem("role") === 'Trainer') {
        routes =
            <Switch>
                <Route path="/admin-area" component={asyncAdmin}/>
                <Route exact path="/dashboard" component={UseCasesList}/>
                <Route exact path="/login" component={asyncLogin}/>
                <Route exact path='/logout' component={asyncLogout}/>
                <Route path="/usecases/:id" render={props => <UseCase {...props} />}/>
                <Route exact path="/users" component={asyncAdmin}/>
                <Route exact path="/sensors" component={asyncAdmin}/>
                <Route exact path="/new-use-case" component={asyncAdmin}/>
                <Route exact path="/about" component={AboutPage} />
                <Route path="/documentation" component={documentation} />
                <Redirect to='/dashboard' component={UseCasesList}/>
            </Switch>
    }
    return (
        <React.Fragment>
            {routes}
        </React.Fragment>
)};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
};

export default withRouter(connect(mapStateToProps)(AppRouter));
