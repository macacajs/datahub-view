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

    it('add api should be ok', () => {
      return driver
      // add project
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
        .sleep(1000)

      // add api
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
        .sleep(1000);
    });

    it('modify api config should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .sleep(1000)
        // modify HTTP method: PATCH
        .elementByCss('[data-accessbilityid="project-api-method-select"] .ant-select-selection')
        .click()
        .elementByCss('.ant-select-dropdown-menu-item:nth-child(6)')
        .click()
        .sleep(1000)
        // mofiy api description: v2.0
        .elementByCss('[data-accessbilityid="project-api-description"] input')
        .clear()
        .sendKeys('init api v2.0')
        .elementByCss('[data-accessbilityid="project-api-description"] span')
        .click()
        .sleep(1000)
        // modify api delay: 10
        .elementByCss('[data-accessbilityid="project-api-delay"] input')
        .clear()
        .formatInput('10')
        .elementByCss('[data-accessbilityid="project-api-delay"] span')
        .click()
        .sleep(1000)
        // modify api response: 500
        .elementByCss('[data-accessbilityid="project-api-status-code"] input')
        .clear()
        .sendKeys('500')
        .elementByCss('[data-accessbilityid="project-api-status-code"] span')
        .click()
        // modify response header
        .elementByCss('[data-accessbilityid="project-api-response-header"] button')
        .click()
        .execute(setCodeMirror(apiHeader))
        .elementByCss('.ant-modal-footer .ant-btn-primary')
        .click()
        .sleep(1000)

        .refresh()
        // check HTTP method
        .elementByCss('[data-accessbilityid="project-api-method-select"] .ant-select-selection')
        .hasText('PATCH')
        // check api description
        .elementByCss('[data-accessbilityid="project-api-description"] input')
        .getProperty('value')
        .then(input => assert.equal(input, 'init api v2.0'))
        // check api delay
        .elementByCss('[data-accessbilityid="project-api-delay"] input')
        .getProperty('value')
        .then(input => assert.equal(input, '10'))
        // check server response status
        .elementByCss('[data-accessbilityid="project-api-status-code"] input')
        .getProperty('value')
        .then(input => assert.equal(input, '500'))
        // check http header
        .elementByCss('[data-accessbilityid="project-api-response-header"] button')
        .click()
        .sleep(2000)
        .elementByCss('.CodeMirror-code div:nth-child(2) pre')
        .hasText('datahub')
        .sleep(1000);
    });

    // rely on add api successfully
    it('modify api proxy config should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .sleep(1000)
        // open proxy
        .elementByCss('[data-accessbilityid="project-api-proxy-checkbox"]')
        .click()
        // add 1 proxy
        .elementByCss('[data-accessbilityid="project-api-add-proxy-btn"]')
        .click()
        .sleep(1000)
        .elementByCss('[data-accessbilityid="project-api-proxy-list-0"] input')
        .clear()
        .formatInput('http://datahub1.com')
        .sleep(1000)
        .elementByCss('[data-accessbilityid="project-api-proxy-title"]')
        .click()
        .sleep(1000)

        // add 2 proxy
        .elementByCss('[data-accessbilityid="project-api-add-proxy-btn"]')
        .click()
        .sleep(1000)
        .elementByCss('[data-accessbilityid="project-api-proxy-list-1"] input')
        .clear()
        .formatInput('http://datahub2.com')
        .sleep(1000)
        .elementByCss('[data-accessbilityid="project-api-proxy-title"]')
        .click()
        .sleep(1000)

        // check 2 proxy
        .refresh()
        .elementByCss('[data-accessbilityid="project-api-proxy-list-1"] button')
        .hasText('删除')

        // delete 2 proxy
        .elementByCss('[data-accessbilityid="project-api-proxy-list-1"] button')
        .click()

        // check delete 2 proxy
        .refresh()
        .hasElementByCss('[data-accessbilityid="project-api-proxy-list-1"] button')
        .then(value => assert.equal(value, false))
        .sleep(1000)

        // cant delete proxy after close proxy
        .elementByCss('[data-accessbilityid="project-api-proxy-checkbox"]')
        .click()
        .elementByCss('[data-accessbilityid="project-api-proxy-list-0"] button')
        .click()
        .hasElementByCss('[data-accessbilityid="project-api-proxy-list-0"] button')
        .then(value => assert.equal(value, true))
        .sleep(1000);
    });

    // rely on add api successfully
    it('modify api req schema should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .sleep(1000)
        // Request Schema
        .elementByCss('.api-schema-req [data-accessbilityid="project-api-schema-edit-btn"]')
        .click()
        .execute(setCodeMirror(schemaData))
        .elementByCss('.ant-modal-footer .ant-btn.ant-btn-primary')
        .click()
        .sleep(1000)
        .refresh()
        .elementByCss('.api-schema-req table > tbody > tr:nth-child(1) > td:nth-child(1)')
        .hasText('success');
    });

    // rely on add api successfully
    it('modify api res schema should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .sleep(1000)
        // Response Schema
        .elementByCss('.api-schema-res [data-accessbilityid="project-api-schema-edit-btn"]')
        .click()
        .execute(setCodeMirror(schemaData))
        .elementByCss('.ant-modal-footer .ant-btn.ant-btn-primary')
        .click()
        .sleep(1000)
        .elementByCss('.api-schema-res table > tbody > tr:nth-child(1) > td:nth-child(2)')
        .hasText('Boolean');
    });

    // rely on add schema successfully
    it('api doc should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/doc/datahubview#api=init`)
        .sleep(1000)
        .elementByCss('.req-shcema-doc tbody > tr:nth-child(1) > td:nth-child(1)')
        .hasText('success')
        .elementByCss('.res-shcema-doc tbody > tr:nth-child(6) > td:nth-child(1)')
        .hasText('address');
    });
  });
});

