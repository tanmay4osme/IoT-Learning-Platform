
import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

import {takeEvery,delay} from 'redux-saga'
import {call, put, take} from 'redux-saga/effects'
import * as actions from '../../actions/index';
import {fetchUseCaseDataSaga, fetchUseCase} from '../useCaseFirebase';

configure({adapter: new Adapter()});


describe('Test Fetch Use Cases',()=>{
    const action = actions.fetchUseCaseData();
    const generator = fetchUseCaseDataSaga(action);
    it('>>> Must dispatch FETCH_USECASE_DATA_START action', () => {
       const testValue = generator.next().value;
       expect(testValue).toEqual(put(actions.fetchUseCaseDataStart()));
    });
    it('>>> Must call fetchUseCase', () => {
       const testValue = generator.next().value
       expect(testValue).toEqual(call(fetchUseCase))
    });
    it('>>> Must dispatch FETCH_USECASE_DATA_SUCCESS action', () => {
      const dummyUseCases = [],
      testValue = generator.next(dummyUseCases).value
      expect(testValue).toEqual(put(actions.fetchUseCaseDataSuccess(dummyUseCases)))
    }); 
    
});