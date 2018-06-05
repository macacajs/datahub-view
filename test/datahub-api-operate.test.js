'use strict';

import assert from 'assert';

import {
  webpackHelper,
} from 'macaca-wd';

const {
  driver,
} = webpackHelper;

const BASE_URL = 'http://localhost:5678';

describe('test/datahub-api-operate.test.js', () => {
  const addProjectAndApi = () => {
    return driver
      // add project
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
      .sleep(1000)

      // add api
      .getUrl(`${BASE_URL}/project/datahubview`)
      .sleep(1000)
      .elementByCss('div.ant-layout-sider.ant-layout-sider-dark div.ant-tabs-content.ant-tabs-content-no-animated > div.ant-tabs-tabpane.ant-tabs-tabpane-active div.ant-col-8 > button')
      .click()
      .elementByCss('body > div:nth-child(2) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-body > input:nth-child(1)')
      .click()
      .formatInput('init')
      .sleep(500)
      .elementByCss('body > div:nth-child(2) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-body > input:nth-child(2)')
      .click()
      .formatInput('init api')
      .sleep(500)
      .elementByCss('body > div:nth-child(2) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-footer > div > button.ant-btn.ant-btn-primary')
      .click()
      .sleep(1000)
      .elementByCss('div.ant-layout-sider.ant-layout-sider-dark div.ant-tabs-content.ant-tabs-content-no-animated > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div > ul > li > div.left > h3')
      .hasText('init')
      .sleep(1000);
  };

  describe('project api scene testing', () => {
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

    it('modify api config should be ok', () => {
      // return driver
      return addProjectAndApi()
        .getUrl(`${BASE_URL}/project/datahubview`)
        .sleep(1000)
        // modify HTTP method: PATCH
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.base-info > div:nth-child(4) > div > div > div')
        .click()
        .elementByCss('body > div:nth-child(2) > div > div > div > ul > li:nth-child(6)')
        .click()
        .sleep(1000)
        // mofiy api description: v2.0
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.base-info > div.api-description > input')
        .clear()
        .sendKeys('init api v2.0')
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.base-info > div.api-description > span > span')
        .click()
        .sleep(1000)
        // modify api delay: 10
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.base-info > div.api-delay > div > div.ant-input-number-input-wrap > input')
        .formatInput('10')
        .sleep(1000)
        // modify api response: 500
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.base-info > div.api-status-code > input')
        .clear()
        .sendKeys('500')
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.base-info > div.api-status-code > span > span')
        .click()
        // modify response header
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.base-info > div.response-header > button')
        .click()
        .execute("document.querySelector('.CodeMirror').CodeMirror.setValue('{\"name\": \"datahub\"}')")
        .elementByCss('body > div:nth-child(3) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-footer > div > button.ant-btn.ant-btn-primary')
        .click()
        .sleep(1000)

        .refresh()
        // check HTTP method
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.base-info > div:nth-child(4) > div > div > div > div')
        .hasText('PATCH')
        // check api description
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.base-info > div.api-description > input')
        .getProperty('value')
        .then(input => assert.equal(input, 'init api v2.0'))
        // check api delay
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.base-info > div.api-delay > div > div.ant-input-number-input-wrap > input')
        .getProperty('value')
        .then(input => assert.equal(input, '10'))
        // check server response status
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.base-info > div.api-status-code > input')
        .getProperty('value')
        .then(input => assert.equal(input, '500'))
        // check http header
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.base-info > div.response-header > button')
        .click()
        .sleep(2000)
        .elementByCss('body > div:nth-child(2) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-body > div > div > div.CodeMirror-scroll > div.CodeMirror-sizer > div > div > div > div.CodeMirror-code > div:nth-child(2) > pre > span > span:nth-child(2)')
        .hasText('datahub')
        .sleep(1000);
    });

    // rely on add api successfully
    it('modify api config should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .sleep(1000)
        // open proxy
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-proxy > form > div.ant-row.ant-form-item > div > div > span > label > span.ant-checkbox > input')
        .click()
        // add 1 proxy
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-proxy > form > div.ant-row.ant-form-item > div > div > span > button')
        .click()
        .sleep(1000)
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-proxy > form > div.ant-radio-group > label > span:nth-child(2) > div > div > div > span > div > input')
        .clear()
        .formatInput('http://datahub1.com')
        .sleep(1000)
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-proxy > h1 > span')
        .click()
        .sleep(1000)

        // add 2 proxy
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-proxy > form > div.ant-row.ant-form-item > div > div > span > button')
        .click()
        .sleep(1000)
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-proxy > form > div.ant-radio-group > label:nth-child(2) > span:nth-child(2) > div > div > div > span > div > input')
        .clear()
        .formatInput('http://datahub2.com')
        .sleep(1000)
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-proxy > h1 > span')
        .click()
        .sleep(1000)

        // check 2 proxy
        .refresh()
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-proxy > form > div.ant-radio-group > label:nth-child(2) > span:nth-child(2) > div > div > div > span > div > button')
        .hasText('删除')

        // delete 2 proxy
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-proxy > form > div.ant-radio-group > label:nth-child(2) > span:nth-child(2) > div > div > div > span > div > button')
        .click()

        // check delete 2 proxy
        .refresh()
        .hasElementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-proxy > form > div.ant-radio-group > label:nth-child(2) > span:nth-child(2) > div > div > div > span > div > button')
        .then(value => assert.equal(value, false))
        .sleep(1000)

        // cant delete proxy after close proxy
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-proxy > form > div.ant-row.ant-form-item > div > div > span > label > span.ant-checkbox > input')
        .click()
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-proxy > form > div.ant-radio-group > label > span:nth-child(2) > div > div > div > span > div > button')
        .click()
        .hasElementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-proxy > form > div.ant-radio-group > label > span:nth-child(2) > div > div > div > span > div > button')
        .then(value => assert.equal(value, true))
        .sleep(1000);
    });

    // rely on add api successfully
    it('modify api schema should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .sleep(1000)
        // Request Schema
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > div:nth-child(4) > section > button')
        .click()
        /* eslint-disable */
        .execute("document.querySelector('.CodeMirror').CodeMirror.setValue('{\"type\":\"object\",\"required\":[\"success\"],\"properties\":{\"success\":{\"type\":\"boolean\",\"description\":\"server side success\"},\"data\":{\"type\":\"array\",\"description\":\"data field\",\"required\":[\"age\",\"key\",\"name\",\"address\"],\"items\":[{\"type\":\"object\",\"required\":[\"name\"],\"properties\":{\"key\":{\"type\":\"string\",\"description\":\"key description\"},\"name\":{\"type\":\"string\",\"description\":\"name description\"},\"age\":{\"type\":\"number\",\"description\":\"age description\"},\"address\":{\"type\":\"string\",\"description\":\"address description\"}}}]},\"errorMessage\":{\"type\":\"string\",\"description\":\"error message description\"}}}')")
        /* eslint-enable */
        .elementByCss('body > div:nth-child(2) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-footer > div > button.ant-btn.ant-btn-primary')
        .click()
        .sleep(1000)
        .refresh()
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > div:nth-child(4) > section > div > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(1) > div > div > span')
        .hasText('success');
    });

    // rely on add api successfully
    it('modify api schema should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .sleep(1000)
        // Response Schema
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > div:nth-child(5) > section > button')
        .click()
        /* eslint-disable */
        .execute("document.querySelector('.CodeMirror').CodeMirror.setValue('{\"type\":\"object\",\"required\":[\"success\"],\"properties\":{\"success\":{\"type\":\"boolean\",\"description\":\"server side success\"},\"data\":{\"type\":\"array\",\"description\":\"data field\",\"required\":[\"age\",\"key\",\"name\",\"address\"],\"items\":[{\"type\":\"object\",\"required\":[\"name\"],\"properties\":{\"key\":{\"type\":\"string\",\"description\":\"key description\"},\"name\":{\"type\":\"string\",\"description\":\"name description\"},\"age\":{\"type\":\"number\",\"description\":\"age description\"},\"address\":{\"type\":\"string\",\"description\":\"address description\"}}}]},\"errorMessage\":{\"type\":\"string\",\"description\":\"error message description\"}}}')")
        /* eslint-enable */
        .elementByCss('body > div:nth-child(2) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-footer > div > button.ant-btn.ant-btn-primary')
        .click()
        .sleep(1000)
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > div:nth-child(5) > section > div > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > span')
        .hasText('Boolean');
    });

    // rely on add schema successfully
    it('modify api schema should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/doc/datahubview#api=init`)
        .sleep(1000)
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > div:nth-child(5) > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(1) > div > div > span')
        .hasText('success')
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > div:nth-child(7) > div > div > div > div > div > table > tbody > tr:nth-child(6) > td:nth-child(1) > div > div > span')
        .hasText('address');
    });

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

