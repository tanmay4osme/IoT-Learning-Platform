import * as actionTypes from '../actions/actionTypes';
import {updateObject} from "../utility";

const initialState = {
    data: [],
    loading: false,
    error: false
};

const dataFetchSuccess = (state, action) => {
    return updateObject(state, {
        data: action.data,
        loading: false,
        error: false
    })
};

const dataFetchFailed = (state, action) => {
    return updateObject(state, {
        data: action.data,
        loading: false,
        error: action.error
    })
};

const dataUpdateSuccess = (state, action) => {
    return updateObject(state, {
        data: action.data,
        loading: false,
        error: false
    })
};

const dataUpdateFailed = (state, action) => {
    return updateObject(state, {
        loading: false,
        error: action.error
    })
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case(actionTypes.FETCH_USECASE_DATA_START): return updateObject(state, {loading: true, error: false});
        case(actionTypes.FETCH_USECASE_DATA_SUCCESS): return dataFetchSuccess(state, action);
        case(actionTypes.FETCH_USECASE_DATA_FAILED): return dataFetchFailed(state, action);
        case(actionTypes.UPDATE_USECASE_START): return updateObject(state, {loading: true, error: false});
        case(actionTypes.UPDATE_USECASE_SUCCESS): return dataUpdateSuccess(state, action);
        case(actionTypes.UPDATE_USECASE_FAILED): return dataUpdateFailed(state, action);
        default: return state;
    }
};

export default reducer;
