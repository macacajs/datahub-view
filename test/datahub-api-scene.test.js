'use strict';

import assert from 'assert';

import {
  driver,
  BASE_URL,
  setCodeMirror,
} from './helper';

import {
  successScene,
  failScene,
} from './fixture/data';

describe('test/datahub-api-scene.test.js', () => {
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

    it('add default scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .sleep(500)

        // add default scene
        .elementByCss('[data-accessbilityid="project-api-scene-input"]')
        .formatInput('default')
        .waitForElementByCss('[data-accessbilityid="project-api-scene-add-btn"]')
        .click()
        .sleep(500)
        .waitForElementByCss('[data-accessbilityid="project-api-scene-list-0"] .scene-name')
        .hasText('default')
        .sleep(500)

        // add default scene data
        .waitForElementByCss('[data-accessbilityid="project-api-scene-list-0"] .anticon-edit')
        .click()
        .execute(setCodeMirror(successScene))
        .waitForElementByCss('.ant-modal-footer .ant-btn.ant-btn-primary')
        .click();
    });

    it('add error scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)

        // add error scene
        .elementByCss('[data-accessbilityid="project-api-scene-input"]')
        .formatInput('error')
        .waitForElementByCss('[data-accessbilityid="project-api-scene-add-btn"]')
        .click()
        .sleep(500)
        .waitForElementByCss('[data-accessbilityid="project-api-scene-list-1"] .scene-name')
        .hasText('error')
        .sleep(500)

        // add errro scene data
        .waitForElementByCss('[data-accessbilityid="project-api-scene-list-1"] .anticon.anticon-edit')
        .click()
        .execute(setCodeMirror(failScene))
        .elementByCss('.ant-modal-footer .ant-btn.ant-btn-primary')
        .click();
    });

    it('switch default scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .waitForElementByCss('[data-accessbilityid="project-api-scene-list-0"] input')
        .click()
        .getUrl(`${BASE_URL}/data/datahubview/init`)
        .waitForElementByCss('body')
        /* eslint-disable */
        .hasText(JSON.stringify(successScene));
        /* eslint-enable */
    });

    it('switch error scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .waitForElementByCss('[data-accessbilityid="project-api-scene-list-1"] input')
        .click()
        .getUrl(`${BASE_URL}/data/datahubview/init`)
        .waitForElementByCss('body')
        /* eslint-disable */
        .hasText(JSON.stringify(failScene));
        /* eslint-enable */
    });

    it('delete error scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .waitForElementByCss('[data-accessbilityid="project-api-scene-list-1"] .anticon.anticon-delete')
        .click()
        .waitForElementByCss('.ant-popover-buttons .ant-btn-primary')
        .click()
        .sleep(500)
        .hasElementByCss('[data-accessbilityid="project-api-scene-list-1"] .scene-name')
        .then(value => assert.equal(value, false));
    });

    it('delete default scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .waitForElementByCss('[data-accessbilityid="project-api-scene-list-0"] .anticon-delete')
        .click()
        .sleep(500)
        .waitForElementByCss('.ant-popover-buttons .ant-btn-primary')
        .click()
        .sleep(500)
        .hasElementByCss('[data-accessbilityid="project-api-scene-list-0"] .anticon-delete')
        .then(value => assert.equal(value, false));
    });
  });
});
