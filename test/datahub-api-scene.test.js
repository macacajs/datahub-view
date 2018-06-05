'use strict';

import assert from 'assert';

import {
  webpackHelper,
} from 'macaca-wd';

const {
  driver,
} = webpackHelper;

const BASE_URL = 'http://localhost:5678';

describe('test/datahub-api-scene.test.js', () => {
  const addProjectAndApi = () => {
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
      .sleep(1000)
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

    it('add default scene should be ok', () => {
      // return driver
      return addProjectAndApi()
        .getUrl(`${BASE_URL}/project/datahubview`)
        .sleep(1000)

        // add default scene
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-scene > div > div.add-input > input')
        .formatInput('default')
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-scene > div > div.add-input > button')
        .click()
        .sleep(500)
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-scene > div > div.ant-radio-group > label > span:nth-child(2) > span')
        .hasText('default')
        .sleep(1000)

        // add default scene data
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-scene > div > div.ant-radio-group > label.radio-container.ant-radio-wrapper.ant-radio-wrapper-checked > span:nth-child(2) > i.anticon.anticon-edit.view-icon')
        .click()
        .execute("document.querySelector('.CodeMirror').CodeMirror.setValue('{\"success\": true, \"name\": \"datahub\"}')")
        .elementByCss('body > div:nth-child(2) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-footer > div > button.ant-btn.ant-btn-primary')
        .click()
        .sleep(1000);
    });

    it('add error scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .sleep(1000)

        // add error scene
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-scene > div > div.add-input > input')
        .formatInput('error')
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-scene > div > div.add-input > button')
        .click()
        .sleep(500)
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-scene > div > div.ant-radio-group > label.radio-container.ant-radio-wrapper.ant-radio-wrapper-checked > span:nth-child(2) > span')
        .hasText('error')
        .sleep(1000)

        // add errro scene data
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-scene > div > div.ant-radio-group > label.radio-container.ant-radio-wrapper.ant-radio-wrapper-checked > span:nth-child(2) > i.anticon.anticon-edit.view-icon')
        .click()
        .execute("document.querySelector('.CodeMirror').CodeMirror.setValue('{\"success\": false, \"name\": \"datahub\"}')")
        .elementByCss('body > div:nth-child(2) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-footer > div > button.ant-btn.ant-btn-primary')
        .click()
        .sleep(1000);
    });

    it('switch default scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-scene > div > div.ant-radio-group > label:nth-child(1) > span.ant-radio > input')
        .click()
        .getUrl(`${BASE_URL}/data/datahubview/init`)
        .elementByCss('body')
        /* eslint-disable */
        .hasText('{\"success\":true,\"name\":\"datahub\"}')
        /* eslint-enable */
        .sleep(100);
    });

    it('switch error scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-scene > div > div.ant-radio-group > label:nth-child(2) > span.ant-radio > input')
        .click()
        .getUrl(`${BASE_URL}/data/datahubview/init`)
        .elementByCss('body')
        /* eslint-disable */
        .hasText('{\"success\":false,\"name\":\"datahub\"}')
        /* eslint-enable */
        .sleep(1000);
    });

    it('delete error scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-scene > div > div.ant-radio-group > label.radio-container.ant-radio-wrapper.ant-radio-wrapper-checked > span:nth-child(2) > i.anticon.anticon-delete.delete-icon')
        .click()
        .elementByCss('body > div:nth-child(2) > div > div > div > div.ant-popover-inner > div > div > div.ant-popover-buttons > button.ant-btn.ant-btn-primary.ant-btn-sm.ant-btn-two-chinese-chars')
        .click()
        .sleep(1000)
        .hasElementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-scene > div > div.ant-radio-group > label.radio-container.ant-radio-wrapper.ant-radio-wrapper-checked:nth-child(2)')
        .then(value => assert.equal(value, false))
        .sleep(1000);
    });

    it('delete default scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .elementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-scene > div > div.ant-radio-group > label:nth-child(1) > span:nth-child(2) > i.anticon.anticon-delete.delete-icon')
        .click()
        .sleep(1000)
        .elementByCss('body > div:nth-child(2) > div > div > div > div.ant-popover-inner > div > div > div.ant-popover-buttons > button.ant-btn.ant-btn-primary.ant-btn-sm.ant-btn-two-chinese-chars')
        .click()
        .sleep(1000)
        .hasElementByCss('#app > div > div.ant-layout-content > div > div.ant-layout-content > div > content > section.data-scene > div > div.ant-radio-group > label > span:nth-child(2) > i.anticon.anticon-delete.delete-icon')
        .then(value => assert.equal(value, false))
        .sleep(1000);
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
