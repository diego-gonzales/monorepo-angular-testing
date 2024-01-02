export const BTN_STATUS = {
  INIT: 'init',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type BtnStatus = (typeof BTN_STATUS)[keyof typeof BTN_STATUS];
