/**
 * Created by zhiyuan.huang@ddder.net on 17/7/6.
 */

'use strict';

const BACK = 'Navigation/BACK';
const BACK_TO = 'Navigation/BACK_TO';
const INIT = 'Navigation/INIT';
const NAVIGATE = 'Navigation/NAVIGATE';
const RESET = 'Navigation/RESET';
const SET_PARAMS = 'Navigation/SET_PARAMS';
const URI = 'Navigation/URI';

const createAction = type => (payload = {}) => ({
  type,
  ...payload
});

const back = createAction(BACK);
const backTo = createAction(BACK_TO);
const init = createAction(INIT);
const navigate = createAction(NAVIGATE);
const reset = createAction(RESET);
const setParams = createAction(SET_PARAMS);
const uri = createAction(URI);

export default {
  // Action constants
  BACK,
  BACK_TO,
  INIT,
  NAVIGATE,
  RESET,
  SET_PARAMS,
  // URI,

  // Action creators
  back,
  backTo,
  init,
  navigate,
  reset,
  setParams,
  uri
}