import { Account, getAccountInfo, updateAccountInfo } from 'linode-js-sdk/lib/account';

import { ThunkActionCreator } from 'src/store/types';
import { createRequestThunk } from '../store.helpers';
import {
  profileRequest,
  profileRequestFail,
  profileRequestSuccess,
  updateAccountActions
} from './account.actions';

/**
 * Async
 */
export const requestAccount: ThunkActionCreator<
  Promise<Account>
> = () => (dispatch, getStore) => {
  dispatch(profileRequest());
  return getAccountInfo()
    .then(response => {
      dispatch(profileRequestSuccess(response));
      return response;
    })
    .catch(err => {
      dispatch(profileRequestFail(err));
      return err;
    });
};

export const updateAccount = createRequestThunk(
  updateAccountActions,
  ({ ...data }) => updateAccountInfo(data)
);
