'use strict';

import assert from 'assert';

import {
  webpackHelper,
} from 'macaca-wd';

const {
  driver,
} = webpackHelper;

const BASE_URL = 'http://localhost:5678/dashboard';

describe('test/datahub-realtime.test.js', () => {
  describe('realtime page render testing', () => {
    before(() => {
      return driver
        .initWindow({
          width: 1000,
          height: 800,
          deviceScaleFactor: 2,
        });
    });

    afterEach(function () {
      return driver
        .coverage()
        .saveScreenshots(this);
    });

    after(() => {
      return driver
        .openReporter(false)
        .quit();
    });

    it('realtime should be ok', () => {
      return driver
        .getUrl(BASE_URL)
        .sleep(1000);
    });
  });
});

