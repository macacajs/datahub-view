'use strict';

import assert from 'assert';

import {
  driver,
  BASE_URL,
  setCodeMirror,
} from './helper';

import {
  schemaData,
  apiHeader,
} from './fixture/data';

describe('test/datahub-api-operate.test.js', () => {
  describe('project api scene testing', () => {
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
        // delete project
        .getUrl(`${BASE_URL}/dashboard`)
        .waitForElementByCss('[data-accessbilityid="dashboard-content-card-0"] .delete-icon')
        .click()
        .sleep(500)
        .waitForElementByCss('.ant-popover-buttons .ant-btn-primary')
        .click()
        .sleep(500)
        // quit
        .openReporter(false)
        .quit();
    });

    it('add api should be ok', () => {
      return driver
      // add project
        .getUrl(`${BASE_URL}/dashboard`)
        .waitForElementByCss('[data-accessbilityid="dashboard-folder-add"]')
        .click()
        .elementByCss('#identifer')
        .click()
        .formatInput('datahubview')
        .sleep(500)
        .elementByCss('#description')
        .click()
        .formatInput('DataHub Mock Data')
        .sleep(500)
        .waitForElementByCss('button.ant-btn.ant-btn-primary')
        .click()
        .sleep(500)

      // add api
        .getUrl(`${BASE_URL}/project/datahubview`)
        .waitForElementByCss('[data-accessbilityid="project-add-api-list-btn"]')
        .click()
        .elementByCss('[data-accessbilityid="project-add-api-name-input"]')
        .click()
        .formatInput('init')
        .sleep(500)
        .elementByCss('[data-accessbilityid="project-add-api-desc-input"]')
        .click()
        .formatInput('init api')
        .sleep(500)
        .waitForElementByCss('.ant-modal-footer .ant-btn-primary')
        .click()
        .sleep(500)
        .waitForElementByCss('[data-accessbilityid="project-add-api-list-0"] h3')
        .hasText('init');
    });

    it('modify api config should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        // modify HTTP method: PATCH
        .waitForElementByCss('[data-accessbilityid="project-api-method-select"] .ant-select-selection')
        .click()
        .waitForElementByCss('.ant-select-dropdown-menu-item:nth-child(6)')
        .click()
        .sleep(500)
        // mofiy api description: v2.0
        .elementByCss('[data-accessbilityid="project-api-description"] input')
        .clear()
        .sendKeys('init api v2.0')
        .waitForElementByCss('[data-accessbilityid="project-api-description"] span')
        .click()
        .sleep(500)
        // modify api delay: 10
        .elementByCss('[data-accessbilityid="project-api-delay"] input')
        .clear()
        .formatInput('10')
        .waitForElementByCss('[data-accessbilityid="project-api-delay"] span')
        .click()
        .sleep(500)
        // modify api response: 500
        .elementByCss('[data-accessbilityid="project-api-status-code"] input')
        .clear()
        .sendKeys('500')
        .waitForElementByCss('[data-accessbilityid="project-api-status-code"] span')
        .click()
        // modify response header
        .waitForElementByCss('[data-accessbilityid="project-api-response-header"] button')
        .click()
        .execute(setCodeMirror(apiHeader))
        .waitForElementByCss('.ant-modal-footer .ant-btn-primary')
        .click()
        .sleep(500)

        .refresh()
        // check HTTP method
        .waitForElementByCss('[data-accessbilityid="project-api-method-select"] .ant-select-selection')
        .hasText('PATCH')
        // check api description
        .waitForElementByCss('[data-accessbilityid="project-api-description"] input')
        .getProperty('value')
        .then(input => assert.equal(input, 'init api v2.0'))
        // check api delay
        .waitForElementByCss('[data-accessbilityid="project-api-delay"] input')
        .getProperty('value')
        .then(input => assert.equal(input, '10'))
        // check server response status
        .waitForElementByCss('[data-accessbilityid="project-api-status-code"] input')
        .getProperty('value')
        .then(input => assert.equal(input, '500'))
        // check http header
        .waitForElementByCss('[data-accessbilityid="project-api-response-header"] button')
        .click()
        .sleep(500)
        .waitForElementByCss('.CodeMirror-code div:nth-child(2) pre')
        .hasText('datahub');
    });

    // rely on add api successfully
    it('modify api proxy config should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        // open proxy
        .waitForElementByCss('[data-accessbilityid="project-api-proxy-checkbox"]')
        .click()
        // add 1 proxy
        .waitForElementByCss('[data-accessbilityid="project-api-add-proxy-btn"]')
        .click()
        .sleep(500)
        .elementByCss('[data-accessbilityid="project-api-proxy-list-0"] input')
        .clear()
        .formatInput('http://datahub1.com')
        .sleep(500)
        .elementByCss('[data-accessbilityid="project-api-proxy-title"]')
        .click()
        .sleep(500)

        // add 2 proxy
        .waitForElementByCss('[data-accessbilityid="project-api-add-proxy-btn"]')
        .click()
        .sleep(500)
        .elementByCss('[data-accessbilityid="project-api-proxy-list-1"] input')
        .clear()
        .formatInput('http://datahub2.com')
        .sleep(500)
        .waitForElementByCss('[data-accessbilityid="project-api-proxy-title"]')
        .click()
        .sleep(500)

        // check 2 proxy
        .refresh()
        .waitForElementByCss('[data-accessbilityid="project-api-proxy-list-1"] button')
        .hasText('删除')

        // delete 2 proxy
        .waitForElementByCss('[data-accessbilityid="project-api-proxy-list-1"] button')
        .click()

        // check delete 2 proxy
        .refresh()
        .hasElementByCss('[data-accessbilityid="project-api-proxy-list-1"] button')
        .then(value => assert.equal(value, false))
        .sleep(500)

        // cant delete proxy after close proxy
        .waitForElementByCss('[data-accessbilityid="project-api-proxy-checkbox"]')
        .click()
        .waitForElementByCss('[data-accessbilityid="project-api-proxy-list-0"] button')
        .click()
        .hasElementByCss('[data-accessbilityid="project-api-proxy-list-0"] button')
        .then(value => assert.equal(value, true));
    });

    // rely on add api successfully
    it('modify api req schema should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        // Request Schema
        .waitForElementByCss('.api-schema-req [data-accessbilityid="project-api-schema-edit-btn"]')
        .click()
        .execute(setCodeMirror(schemaData))
        .waitForElementByCss('.ant-modal-footer .ant-btn.ant-btn-primary')
        .click()
        .sleep(500)
        .refresh()
        .waitForElementByCss('.api-schema-req table > tbody > tr:nth-child(1) > td:nth-child(1)')
        .hasText('success');
    });

    // rely on add api successfully
    it('modify api res schema should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        // Response Schema
        .waitForElementByCss('.api-schema-res [data-accessbilityid="project-api-schema-edit-btn"]')
        .click()
        .execute(setCodeMirror(schemaData))
        .waitForElementByCss('.ant-modal-footer .ant-btn.ant-btn-primary')
        .click()
        .sleep(500)
        .waitForElementByCss('.api-schema-res table > tbody > tr:nth-child(1) > td:nth-child(2)')
        .hasText('Boolean');
    });

    // rely on add schema successfully
    it('api doc should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/doc/datahubview#api=init`)
        .waitForElementByCss('.req-shcema-doc tbody > tr:nth-child(1) > td:nth-child(1)')
        .hasText('success')
        .waitForElementByCss('.res-shcema-doc tbody > tr:nth-child(6) > td:nth-child(1)')
        .hasText('address');
    });
  });
});

