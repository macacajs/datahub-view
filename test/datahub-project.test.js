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
          width: 960,
          height: 720,
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
        .waitForElementByCss('#projectName')
        .click()
        .formatInput('datahubview')
        .waitForElementByCss('#description')
        .click()
        .formatInput('DataHub Mock Data')
        .waitForElementByCss('button.ant-btn.ant-btn-primary')
        .click()
        .waitForElementByCss('[data-accessbilityid="dashboard-content-card-0"] div.ant-card-head')
        .hasText('DataHub Mock Data')
        // input should be empty after add projct
        .waitForElementByCss('[data-accessbilityid="dashboard-folder-add"]')
        .click()
        .waitForElementByCss('#projectName')
        .text()
        .then(value => assert.equal(value, ''))
        .waitForElementByCss('#description')
        .text()
        .then(value => assert.equal(value, ''));
    });

    it('add another project should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/dashboard`)
        .waitForElementByCss('[data-accessbilityid="dashboard-folder-add"]')
        .click()
        .waitForElementByCss('#projectName')
        .click()
        .formatInput('datahubview2')
        .waitForElementByCss('#description')
        .click()
        .formatInput('DataHub Mock Data2')
        .waitForElementByCss('button.ant-btn.ant-btn-primary')
        .click()
        .waitForElementByCss('[data-accessbilityid="dashboard-content-card-1"] div.ant-card-head')
        .hasText('DataHub Mock Data2');
    });

    it('switch project should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/dashboard`)
        .waitForElementByCss('[data-accessbilityid="dashboard-content-card-0"] i.anticon-inbox')
        .click()
        .waitForElementByCss('[data-accessbilityid="dropdonw-list"]')
        .click()
        .waitForElementByCss('[data-accessbilityid="dropdonw-list-1"] a')
        .click()
        .sleep(1500)
        .waitForElementByCss('[data-accessbilityid="dropdonw-list"]')
        .hasText('datahubview2');
    });

    it('modify project should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/dashboard`)
        .waitForElementByCss('[data-accessbilityid="dashboard-content-card-0"] .anticon-setting')
        .click()
        .waitForElementByCss('#projectName')
        .click()
        .formatInput('new_datahubview')
        .waitForElementByCss('#description')
        .click()
        .formatInput('New DataHub Mock Data')
        .waitForElementByCss('button.ant-btn.ant-btn-primary')
        .click()
        .waitForElementByCss('[data-accessbilityid="dashboard-content-card-0"] div.ant-card-head')
        .hasText('New DataHub Mock Data');
    });

    it('open download project should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/dashboard`)
        .waitForElementByCss('[data-accessbilityid="experiment-container"] i.anticon-experiment')
        .click()
        .sleep(1500)
        .waitForElementByCss('[data-accessbilityid="experiment-donwloadupload-switch"]')
        .click();
    });

    // depend on add project successfully
    it('delete project should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/dashboard`)
        .waitForElementByCss('[data-accessbilityid="dashboard-content-card-0"] .delete-icon')
        .click()
        .waitForElementByCss('.ant-popover-buttons .ant-btn-primary')
        .click()
        .waitForElementByCss('[data-accessbilityid="dashboard-content-card-0"] .delete-icon')
        .click()
        .waitForElementByCss('.ant-popover-buttons .ant-btn-primary')
        .click()
        .elementOrNull('[data-accessbilityid="dashboard-content-card-0"] .ant-card-head')
        .then(value => assert.equal(value, null));
    });
  });
});
