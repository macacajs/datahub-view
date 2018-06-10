'use strict';

import assert from 'assert';

import {
  driver,
  BASE_URL,
} from './helper';

describe('test/datahub-project.test.js', () => {
  describe('project page render testing', () => {
    before(() => {
      return driver
        .initWindow({
          width: 1000,
          height: 800,
          deviceScaleFactor: 2,
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36 Language/zh-CN',
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

    it('add project should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/dashboard`)
        .sleep(1000)
        .elementByCss('[data-accessbilityid="dashboard-folder-add"]')
        .click()
        .elementByCss('#identifer')
        .click()
        .formatInput('datahubview')
        .sleep(500)
        .elementByCss('#description')
        .click()
        .formatInput('DataHub Mock Data')
        .sleep(500)
        .elementByCss('button.ant-btn.ant-btn-primary')
        .click()
        .sleep(1500)
        .elementByCss('[data-accessbilityid="dashboard-content-card-0"] div.ant-card-head')
        .hasText('DataHub Mock Data')
        .sleep(1000)
        // input should be empty after add projct
        .elementByCss('[data-accessbilityid="dashboard-folder-add"]')
        .click()
        .elementByCss('#identifer')
        .text()
        .then(value => assert.equal(value, ''))
        .sleep(500)
        .elementByCss('#description')
        .text()
        .then(value => assert.equal(value, ''))
        .sleep(500);
    });

    // depend on add project successfully
    it('delete project should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/dashboard`)
        .sleep(1000)
        .elementByCss('[data-accessbilityid="dashboard-content-card-0"] .delete-icon')
        .click()
        .sleep(500)
        .elementByCss('.ant-popover-buttons .ant-btn-primary')
        .click()
        .sleep(1000)
        .hasElementByCss('[data-accessbilityid="dashboard-content-card-0"] .ant-card-head')
        .then(value => assert.equal(value, false));
    });
  });
});
