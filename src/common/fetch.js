'use strict';

import 'whatwg-fetch';

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

export default (url, method = 'GET', params = {}) => {
  return verbs[method](url, params)
    .then(res => {
      if (res.ok) {
        return res;
      } else {
        throw new Error('Network Errror');
      }
    })
    .then(res => res.json());
};

