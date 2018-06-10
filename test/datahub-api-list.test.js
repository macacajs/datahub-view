'use strict';

import assert from 'assert';

import {
  driver,
  BASE_URL,
} from './helper';

describe('test/datahub-api-list.test.js', () => {
  describe('project api list render testing', () => {
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
        // delete project
        .getUrl(`${BASE_URL}/dashboard`)
        .sleep(1000)
        .elementByCss('[data-accessbilityid="dashboard-content-card-0"] .delete-icon')
        .click()
        .sleep(500)
        .elementByCss('.ant-popover-buttons .ant-btn-primary')
        .click()
        .sleep(1000)
        // quit
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
        .sleep(1500);
    });

    it('add api should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .sleep(1000)
        .elementByCss('[data-accessbilityid="project-add-api-list-btn"]')
        .click()
        .elementByCss('[data-accessbilityid="project-add-api-name-input"]')
        .click()
        .formatInput('init')
        .sleep(500)
        .elementByCss('[data-accessbilityid="project-add-api-desc-input"]')
        .click()
        .formatInput('init api')
        .sleep(500)
        .elementByCss('.ant-modal-footer .ant-btn-primary')
        .click()
        .sleep(1000)
        .elementByCss('[data-accessbilityid="project-add-api-list-0"] h3')
        .hasText('init')
        .sleep(1000)

        // add result api
        .elementByCss('[data-accessbilityid="project-add-api-list-btn"]')
        .click()
        .elementByCss('[data-accessbilityid="project-add-api-name-input"]')
        .click()
        .formatInput('result')
        .sleep(500)
        .elementByCss('[data-accessbilityid="project-add-api-desc-input"]')
        .click()
        .formatInput('result api')
        .sleep(500)
        .elementByCss('.ant-modal-footer .ant-btn-primary')
        .click()
        .sleep(1000)
        .elementByCss('[data-accessbilityid="project-add-api-list-1"] h3')
        .hasText('result')
        .sleep(1000)

        // input should be empty after add projct
        .elementByCss('[data-accessbilityid="project-add-api-list-btn"]')
        .click()
        .elementByCss('[data-accessbilityid="project-add-api-name-input"]')
        .text()
        .then(value => assert.equal(value, ''))
        .sleep(500)
        .elementByCss('[data-accessbilityid="project-add-api-desc-input"]')
        .text()
        .then(value => assert.equal(value, ''))
        .sleep(500);
    });

    // depend on add api successfully
    it('search api should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .elementByCss('[data-accessbilityid="project-search-api"]')
        .formatInput('result')
        .elementByCss('[data-accessbilityid="project-add-api-list-1"] h3')
        .hasText('result');
    });

    // depend on add api successfully
    it('delete api should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        // delete init api
        .elementByCss('[data-accessbilityid="project-add-api-list-0"] .right i')
        .click()
        .elementByCss('.ant-popover-buttons .ant-btn-primary')
        .click()
        .sleep(1000)
        .hasElementByCss('[data-accessbilityid="project-add-api-list-1"] h3')
        .then(value => assert.equal(value, false))
        .sleep(1000)
        // delete result api
        .elementByCss('[data-accessbilityid="project-add-api-list-0"] .right i')
        .click()
        .elementByCss('.ant-popover-buttons .ant-btn-primary')
        .click()
        .sleep(1000)
        .hasElementByCss('[data-accessbilityid="project-add-api-list-0"] h3')
        .then(value => assert.equal(value, false));
    });
  });
});
