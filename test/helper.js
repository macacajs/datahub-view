'use strict';

import {
  webpackHelper,
} from 'macaca-wd';

const {
  driver,
} = webpackHelper;

const BASE_URL = 'http://localhost:5678';

exports.driver = driver;
exports.BASE_URL = BASE_URL;

exports.setCodeMirror = d => {
  /* eslint-disable */
  return `document.querySelector('.CodeMirror').CodeMirror.setValue(\'${JSON.stringify(d)}\')`
  /* eslint-enable */
};
