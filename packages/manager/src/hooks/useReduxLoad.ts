import * as Bluebird from 'bluebird';
import { useEffect, useState } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { Dispatch } from 'redux';
import { REFRESH_INTERVAL } from 'src/constants';
import { ApplicationState } from 'src/store';
import { requestAccount } from 'src/store/account/account.requests';
import { requestAccountSettings } from 'src/store/accountSettings/accountSettings.requests';
import { getAllBuckets } from 'src/store/bucket/bucket.requests';
import { requestDomains } from 'src/store/domains/domains.requests';
import { getEvents } from 'src/store/events/event.request';
import { getAllFirewalls } from 'src/store/firewalls/firewalls.requests';
import { requestImages } from 'src/store/image/image.requests';
import { requestKubernetesClusters } from 'src/store/kubernetes/kubernetes.requests';
import { requestLinodes } from 'src/store/linodes/linode.requests';
import { requestTypes } from 'src/store/linodeType/linodeType.requests';
import { getAllLongviewClients } from 'src/store/longview/longview.requests';
import { requestManagedIssues } from 'src/store/managed/issues.requests';
import { requestManagedServices } from 'src/store/managed/managed.requests';
import { getAllNodeBalancers } from 'src/store/nodeBalancer/nodeBalancer.requests';
import { requestNotifications } from 'src/store/notification/notification.requests';
import { requestProfile } from 'src/store/profile/profile.requests';
import { requestRegions } from 'src/store/regions/regions.actions';
import { getAllVolumes } from 'src/store/volume/volume.requests';

interface UseReduxPreload {
  _loading: boolean;
}

export type ReduxEntity =
  | 'linodes'
  | 'volumes'
  | 'account'
  | 'accountSettings'
  | 'domains'
  | 'images'
  | 'kubernetes'
  | 'managed'
  | 'managedIssues'
  | 'nodeBalancers'
  | 'notifications'
  | 'profile'
  | 'regions'
  | 'types'
  | 'buckets'
  | 'events'
  | 'longview'
  | 'firewalls';

type RequestMap = Record<ReduxEntity, any>;
const requestMap: RequestMap = {
  linodes: requestLinodes,
  volumes: getAllVolumes,
  account: requestAccount,
  accountSettings: requestAccountSettings,
  domains: requestDomains,
  nodeBalancers: getAllNodeBalancers,
  images: requestImages,
  events: getEvents,
  buckets: getAllBuckets,
  profile: requestProfile,
  regions: requestRegions,
  types: requestTypes,
  notifications: requestNotifications,
  managed: requestManagedServices,
  managedIssues: requestManagedIssues,
  kubernetes: requestKubernetesClusters,
  longview: getAllLongviewClients,
  firewalls: getAllFirewalls
};

export const useReduxLoad = (
  deps: ReduxEntity[] = [],
  refreshInterval: number = REFRESH_INTERVAL,
  predicate: boolean = true
): UseReduxPreload => {
  const [_loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const state = useStore<ApplicationState>().getState();

  useEffect(() => {
    if (predicate) {
      requestDeps(state, dispatch, deps, refreshInterval, setLoading);
    }
  }, [predicate]);

  return { _loading };
};

export const requestDeps = (
  state: ApplicationState,
  dispatch: Dispatch<any>,
  deps: ReduxEntity[],
  refreshInterval: number = 60000,
  loadingCb: (l: boolean) => void = _ => null
) => {
  let i = 0;
  let needsToLoad = false;
  const requests = [];
  for (i; i < deps.length; i++) {
    const currentResource = state.__resources[deps[i]] || state[deps[i]];
    if (currentResource) {
      if (currentResource.lastUpdated === 0 && !currentResource.loading) {
        needsToLoad = true;
        requests.push(requestMap[deps[i]]);
      } else if (Date.now() - currentResource.lastUpdated > refreshInterval) {
        requests.push(requestMap[deps[i]]);
      }
    }
  }

  if (requests.length === 0) {
    return;
  }

  if (needsToLoad) {
    loadingCb(true);
  }

  return Bluebird.map(requests, thisRequest => {
    return dispatch(thisRequest());
  })
    .then(_ => loadingCb(false))
    .catch(_ => loadingCb(false));
};

export default useReduxLoad;
