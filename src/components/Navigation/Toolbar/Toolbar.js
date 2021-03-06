import React, {Component} from 'react'
import styles from './Toolbar.module.scss';
import {Row, Col, Icon, Avatar, Drawer, Tooltip} from 'antd';
import {connect} from 'react-redux'
import {Link, withRouter} from "react-router-dom";
import UserProfile from '../../../containers/UserProfile/UserProfile'
import * as text from "../../../assets/staticText";

class Toolbar extends Component {

    state = {
        visible: false
    };

    onClose = () => {
        this.setState({
            visible: false
        });
    };

    showDrawer = () => {
        if(localStorage.getItem("email") !== null) {
            this.setState({
                visible: true
            });
        }
    };

    render() {
        const userAuthenticatedCheck = () => {
            let path;
            path = localStorage.getItem("email") !== null ? '/logout' : '/login';
            this.props.history.push(path);
        };

        const styleUsername = (email) => {
            if(email !==null) {
                const accountType = email.split('@').pop();
                const communityName = email.substr(0, email.indexOf('@'));
                const titleDisplayName = communityName.split(' ').map((letter) => {
                    return letter.replace(communityName[0], communityName[0].toUpperCase());
                });
                return (accountType === 'gov.uk') ? `${titleDisplayName} Community` : email;
            }
        };

        const styleAvatar = (email) => {
            if (email !== null) {
                const letter = email.charAt(0).toUpperCase();
                return <Avatar style={{color: '#f56a00', backgroundColor: '#fde3cf'}}>{letter}</Avatar>
            } else {
                return <Avatar size={28} icon="user" aria-label={'avatar picture'}/>
            }
        };

        const login = <Link to='/logout'>Login / Sign Up</Link>;
        const logout = <Link to='/logout'>Logout?</Link>;

        const admin = (localStorage.getItem('role') === 'Trainer' || this.props.role === 'Trainer') ?
            <li aria-label={'Link to Admin Area'}><Link
                style={{color: 'red', border: '3px dashed #ccc', padding: '10px', textAlign: 'center'}}
                to='/admin-area'>Admin Area</Link></li> : null;

        const questionMarkStyle = {position: 'absolute', fontSize: '30px', right: '30px', top: '20px'};


        return (
            <header className={styles.Header}>
                <nav className={styles.Nav}>
                    <Row type="flex" justify="start" align="middle">
                        <Col span={3}>
                            <div className={styles.Logo}>
                                <a href='/dashboard'><img alt='Logo' aria-label='Logo'
                                                                               style={{height: '45px', width: '45px'}}
                                                                               src='/images/logo.png'/></a>
                            </div>
                        </Col>

                        <Col span={8}>
                            <div className={styles.Links}>
                                <ul>
                                    <li aria-label={'Link to User Cases'}><a href='/dashboard'>Usecases</a></li>
                                    <li aria-label={'Link to Documentation'}><Link
                                        to='/documentation'>Documentation</Link></li>
                                    <li aria-label={'Link to About'}><Link to='/about'>About</Link></li>
                                    {admin}
                                </ul>
                            </div>
                        </Col>

                        <Col span={7} offset={5}>
                            <div className={styles.User}>
                                <div>
                                    <Icon style={{marginLeft: '-115px'}} type="search"/>
                                        <Icon style={{marginLeft: '20px', marginTop: '-15px'}} type="bell" aria-label={'notification icon'}/>
                                </div>
                                <div onClick={() => this.showDrawer()} style={{cursor: 'pointer'}}>
                                        <div style={{marginLeft: '-45px', marginTop: '-5px'}}>{styleAvatar(localStorage.getItem("email"))}</div>
                                </div>
                                    <div onClick={() => userAuthenticatedCheck()} style={{cursor: 'pointer'}}>
                                        <div style={{fontStyle: 'italic'}} aria-label={'username'}>{localStorage.getItem("email") ?
                                            <div style={{fontStyle: 'italic'}}> {logout}</div> : login}</div>
                                    </div>
                                    <br/>
                                </div>
                        </Col>
                    </Row>
                </nav>
                <Drawer
                    title="Account Settings"
                    width={680}
                    placement="right"
                    onClose={this.onClose}
                    closable={false}
                    visible={this.state.visible}
                    style={{
                        height: 'calc(100% - 55px)',
                        overflow: 'auto',
                        paddingBottom: 53,
                    }}>
                    <UserProfile/>
                </Drawer>
                <Tooltip title={(localStorage.getItem("email") !== null) ? text.toolbarLoggedIn : text.toolbarLoggedOut} placement="bottomLeft">
                    <Icon type="question-circle" theme="filled" style={questionMarkStyle}/>
                </Tooltip>
            </header>

        );
    };
}

const mapStateToProps = state => {
    return {
        email: state.auth.email,
        role: state.auth.role
    }
};

export default withRouter(connect(mapStateToProps)(Toolbar));
