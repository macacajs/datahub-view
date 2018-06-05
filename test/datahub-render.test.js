'use strict';

import {
  webpackHelper,
} from 'macaca-wd';

const {
  driver,
} = webpackHelper;

const BASE_URL = 'http://localhost:5678';

describe('test/datahub-render.test.js', () => {
  describe('home page render testing', () => {
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

    it('home page render should be ok', () => {
      return driver
        .getUrl(BASE_URL)
        .sleep(1000)
        .elementByCss('.go-btn button')
        .hasText('立即开始');
    });

    it('home page render should be ok', () => {
      return driver
        .getUrl(BASE_URL)
        .sleep(1000)
        .elementByCss('.go-btn button')
        .click()
        .elementByCss('h1.title')
        .hasText('DataHub');
    });
  });
});
