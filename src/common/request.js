'use strict';

import 'whatwg-fetch';
import { message } from 'antd';
import { logger } from '../common/helper';

const verbs = {
  GET (url) {
    return fetch(url, {
      credentials: 'same-origin',
    });
  },

  POST (url, params) {
    return fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
  },

  PUT (url, params) {
    return fetch(url, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
  },

  DELETE (url) {
    return fetch(url, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
  },
};

export default async (url, method = 'GET', params = {}) => {
  let res = await verbs[method](url, params);
  if (!res.ok) {
    message.warn('Network Error');
    return {
      success: false,
      message: 'Network Error',
    };
  }

  res = await res.json();
  logger('%s %s %o %o', method, url, params, res);
  if (!res.success) {
    message.warn(res.message || 'Network Error');
  }
  return res;
};

