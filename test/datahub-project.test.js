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
        .sleep(1000)
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
        .waitForElementByCss('[data-accessbilityid="dashboard-folder-add"]')
        .click()
        .elementByCss('#projectName')
        .click()
        .formatInput('datahubview')
        .sleep(1500)
        .elementByCss('#description')
        .click()
        .formatInput('DataHub Mock Data')
        .sleep(1500)
        .waitForElementByCss('button.ant-btn.ant-btn-primary')
        .click()
        .sleep(1500)
        .waitForElementByCss('[data-accessbilityid="dashboard-content-card-0"] div.ant-card-head')
        .hasText('DataHub Mock Data')
        .sleep(1500)
        // input should be empty after add projct
        .waitForElementByCss('[data-accessbilityid="dashboard-folder-add"]')
        .click()
        .waitForElementByCss('#projectName')
        .text()
        .then(value => assert.equal(value, ''))
        .sleep(1500)
        .waitForElementByCss('#description')
        .text()
        .then(value => assert.equal(value, ''));
    });


    it('modify project should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/dashboard`)
        .waitForElementByCss('[data-accessbilityid="dashboard-content-card-0"] .anticon-setting')
        .click()
        .sleep(1500)
        .elementByCss('#projectName')
        .click()
        .formatInput('new_datahubview')
        .sleep(1500)
        .elementByCss('#description')
        .click()
        .formatInput('New DataHub Mock Data')
        .sleep(1500)
        .waitForElementByCss('button.ant-btn.ant-btn-primary')
        .click()
        .sleep(1500)
        .waitForElementByCss('[data-accessbilityid="dashboard-content-card-0"] div.ant-card-head')
        .hasText('New DataHub Mock Data')
        .sleep(1500);
    });

    // depend on add project successfully
    it('delete project should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/dashboard`)
        .waitForElementByCss('[data-accessbilityid="dashboard-content-card-0"] .delete-icon')
        .click()
        .sleep(1500)
        .waitForElementByCss('.ant-popover-buttons .ant-btn-primary')
        .click()
        .sleep(1500)
        .hasElementByCss('[data-accessbilityid="dashboard-content-card-0"] .ant-card-head')
        .then(value => assert.equal(value, false));
    });
  });
});
