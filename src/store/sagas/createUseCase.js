import { put, call } from 'redux-saga/effects';
import * as actions from '../actions/index';
import axios from "../../shared/axios-instance";

export function createUseCaseRequest (id, data) {
    return axios.patch(`/useCases/${id}.json`, data);
}


export function* createUseCaseSaga(action) {
    yield put(actions.createUseCaseStart());
    try {
        const response = yield call(createUseCaseRequest, action.id, action.data)
        yield put(actions.createUseCaseSuccess(response.data.name, action.data))
    } catch (error) {
        yield put(actions.createUseCaseFail(error))
    }
}
