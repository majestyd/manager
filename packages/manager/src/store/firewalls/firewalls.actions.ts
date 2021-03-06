import {
  CreateFirewallPayload,
  Firewall,
  UpdateFirewallPayload
} from 'linode-js-sdk/lib/firewalls';
import { APIError } from 'linode-js-sdk/lib/types';
import { GetAllData } from 'src/utilities/getAll';

import actionCreatorFactory from 'typescript-fsa';

export const actionCreator = actionCreatorFactory(`@@manager/firewalls`);

export const getFirewalls = actionCreator.async<
  {
    params?: any;
    filter?: any;
  },
  GetAllData<Firewall[]>,
  APIError[]
>(`get-all`);

export const createFirewallActions = actionCreator.async<
  CreateFirewallPayload,
  Firewall,
  APIError[]
>(`create`);

export type UpdateFirewallPayloadWithID = UpdateFirewallPayload & {
  firewallID: number;
};
export const updateFirewallActions = actionCreator.async<
  UpdateFirewallPayloadWithID,
  Firewall,
  APIError[]
>(`update`);

export const deleteFirewallActions = actionCreator.async<
  { firewallID: number },
  {},
  APIError[]
>(`delete`);
