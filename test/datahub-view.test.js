'use strict';

import {
  driver,
  BASE_URL
} from './helper';

describe('test/datahub-view.test.js', () => {
  before(() => {
    return driver
      .initWindow({
        width: 800,
        height: 600,
        deviceScaleFactor: 2
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

  it('page render should be ok', () => {
    return driver
      .get(BASE_URL)
      .sleep(5000);
  });

});
