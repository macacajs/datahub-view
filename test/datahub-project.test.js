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
        .elementByCss('div.ant-card-body  div.ant-col-24.main-icon > i.anticon-folder-add')
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
        .elementByCss('div.ant-layout-content div:nth-child(1) div.ant-card-head')
        .hasText('DataHub Mock Data')
        .sleep(1000)
        // input should be empty after add projct
        .elementByCss('div.ant-card-body  div.ant-col-24.main-icon > i.anticon-folder-add')
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
        .elementByCss('#app > div > div.ant-layout-content > div > div > div > div > div:nth-child(1) > div > div > div.ant-card-body > div > div.ant-row-flex.sub-info > div.ant-col-2 > i')
        .click()
        .sleep(500)
        .elementByCss('body > div:nth-child(2) > div > div > div > div.ant-popover-inner > div > div > div.ant-popover-buttons > button.ant-btn.ant-btn-primary.ant-btn-sm')
        .click()
        .sleep(1000)
        .hasElementByCss('div.ant-layout-content div:nth-child(2) div.ant-card-head')
        .then(value => assert.equal(value, false));
    });
  });
});
