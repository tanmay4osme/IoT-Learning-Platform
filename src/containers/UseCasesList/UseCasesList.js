import React, {Component} from 'react';
import UseCaseCard from "../../components/UseCaseCard/UseCaseCard";
import styles from './UseCasesList.module.scss'
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import {Row, Col, Card, Icon, notification, Drawer, Tooltip} from 'antd';
import {Link} from 'react-router-dom';
import AddNewUseCase from '../../containers/AddNewUseCase/AddNewUseCase';
import * as text from "../../assets/staticText";
const { Meta } = Card;


class UseCasesList extends Component {

    componentDidMount() {
        document.title = 'Use Cases';
        this.props.onFetchUseCaseData();
        this.props.onFetchUsers();
        this.props.onFetchSensors();
    }

    render() {
        const questionMarkStyle = {position: 'absolute', fontSize: '35px', left: '900px',top: '-5px'};

        let useCases = this.props.useCases.map((useCase, index) => {
                if(useCase.access.listedUsers !== null) {
                    if(useCase.access.listedUsers.includes(localStorage.getItem("userId")) || (useCase.access.listedUsers.includes(this.props.userId))) {
                        return <Col key={index} span={8} >
                            <Link to={"/usecases/" + (index)}>
                                <UseCaseCard isLoading={this.props.loading} {...useCase} aria-label={'Use case cards list'}/>
                            </Link>
                        </Col>
                    } else {
                        return null
                    }
                }
            }
        );

        const arrayIsEmpty = currentArray => currentArray === null;

        const printedUseCases = (useCases.every(arrayIsEmpty)) ?
            <React.Fragment>
            <p>There are currently no Use Cases linked to your account. Your Trainer will add Use Case Accounts for you.</p>
                <Tooltip title={text.noUseCases}>
                    <Icon type="question-circle" theme="filled" style={questionMarkStyle} />
                </Tooltip>
            </React.Fragment>
            : useCases;


        return (
            <div className={styles.UseCasesList} aria-label={`Select a use case`}>
                <Row gutter={16}>
                    {printedUseCases}
                    <Col span={8} key={Math.random()}>
                        <AddNewUseCase id={this.props.useCases.length} users={this.props.users} sensors={this.props.sensors}/>
                    </Col>
                </Row>
            </div>

        )
    }
}


const mapStateToProps = state => {
    return {
        useCases: state.useCaseFirebase.data,
        error: state.useCaseFirebase.error,
        loading: state.useCaseFirebase.loading,
        userId: state.auth.userId,
        users: state.users.users,
        sensors: state.sensors.sensors,
        deleted: state.useCaseFirebase.deleted,
        lastDeletedUseCase: state.useCaseFirebase.deletedUseCase
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchUseCaseData: () => dispatch(actions.fetchUseCaseData()),
        onFetchUsers: () => dispatch(actions.fetchUsersData()),
        onFetchSensors: () => dispatch(actions.fetchSensorsData())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UseCasesList);
