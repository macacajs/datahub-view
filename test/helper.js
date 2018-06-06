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
