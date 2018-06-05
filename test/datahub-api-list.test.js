'use strict';

import assert from 'assert';

import {
  webpackHelper,
} from 'macaca-wd';

const {
  driver,
} = webpackHelper;

const BASE_URL = 'http://localhost:5678';

describe('test/datahub-api-list.test.js', () => {
  const addProject = () => {
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
      .sleep(1500);
  };

  describe('project api list render testing', () => {
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

    it('add api should be ok', () => {
      return addProject()
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
        .sleep(1000)

        // add result api
        .elementByCss('div.ant-layout-sider.ant-layout-sider-dark div.ant-tabs-content.ant-tabs-content-no-animated > div.ant-tabs-tabpane.ant-tabs-tabpane-active div.ant-col-8 > button')
        .click()
        .elementByCss('body > div:nth-child(2) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-body > input:nth-child(1)')
        .click()
        .formatInput('result')
        .sleep(500)
        .elementByCss('body > div:nth-child(2) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-body > input:nth-child(2)')
        .click()
        .formatInput('result api')
        .sleep(500)
        .elementByCss('body > div:nth-child(2) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-footer > div > button.ant-btn.ant-btn-primary')
        .click()
        .sleep(1000)
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-sider.ant-layout-sider-dark > div > div > div.ant-tabs-content.ant-tabs-content-no-animated > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div > ul > li.clicked > div.left > h3')
        .hasText('result')
        .sleep(1000)

        // input should be empty after add projct
        .elementByCss('div.ant-layout-sider.ant-layout-sider-dark div.ant-tabs-content.ant-tabs-content-no-animated > div.ant-tabs-tabpane.ant-tabs-tabpane-active div.ant-col-8 > button')
        .click()
        .elementByCss('body > div:nth-child(2) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-body > input:nth-child(1)')
        .text()
        .then(value => assert.equal(value, ''))
        .sleep(500)
        .elementByCss('body > div:nth-child(2) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-body > input:nth-child(2)')
        .text()
        .then(value => assert.equal(value, ''))
        .sleep(500);
    });

    // depend on add api successfully
    it('search api should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-sider.ant-layout-sider-dark > div > div > div.ant-tabs-content.ant-tabs-content-no-animated > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div > div > div.ant-col-16 > span > input')
        .formatInput('result')
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-sider.ant-layout-sider-dark > div > div > div.ant-tabs-content.ant-tabs-content-no-animated > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div > ul > li > div.left > h3')
        .hasText('result');
    });

    // depend on add api successfully
    it('delete api should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        // delete init api
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-sider.ant-layout-sider-dark > div > div > div.ant-tabs-content.ant-tabs-content-no-animated > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div > ul > li:nth-child(2) > div.right > i')
        .click()
        .elementByCss('body > div:nth-child(2) > div > div > div > div.ant-popover-inner > div > div > div.ant-popover-buttons > button.ant-btn.ant-btn-primary.ant-btn-sm')
        .click()
        .sleep(1000)
        .hasElementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-sider.ant-layout-sider-dark > div > div > div.ant-tabs-content.ant-tabs-content-no-animated > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div > ul > li:nth-child(2) > div.left > h3')
        .then(value => assert.equal(value, false))
        .sleep(1000)
        // delete result api
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-sider.ant-layout-sider-dark > div > div > div.ant-tabs-content.ant-tabs-content-no-animated > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div > ul > li > div.right > i')
        .click()
        .elementByCss('body > div:nth-child(2) > div > div > div > div.ant-popover-inner > div > div > div.ant-popover-buttons > button.ant-btn.ant-btn-primary.ant-btn-sm')
        .click()
        .sleep(1000)
        .hasElementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-sider.ant-layout-sider-dark > div > div > div.ant-tabs-content.ant-tabs-content-no-animated > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div > ul > li > div.left > h3')
        .then(value => assert.equal(value, false));
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
