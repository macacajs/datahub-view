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

    it('add default scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .sleep(1000)

        // add default scene
        .elementByCss('[data-accessbilityid="project-api-scene-input"]')
        .formatInput('default')
        .elementByCss('[data-accessbilityid="project-api-scene-add-btn"]')
        .click()
        .sleep(500)
        .elementByCss('[data-accessbilityid="project-api-scene-list-0"] .scene-name')
        .hasText('default')
        .sleep(1000)

        // add default scene data
        .elementByCss('[data-accessbilityid="project-api-scene-list-0"] .anticon-edit')
        .click()
        .execute(setCodeMirror(successScene))
        .elementByCss('.ant-modal-footer .ant-btn.ant-btn-primary')
        .click()
        .sleep(1000);
    });

    it('add error scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .sleep(1000)

        // add error scene
        .elementByCss('[data-accessbilityid="project-api-scene-input"]')
        .formatInput('error')
        .elementByCss('[data-accessbilityid="project-api-scene-add-btn"]')
        .click()
        .sleep(500)
        .elementByCss('[data-accessbilityid="project-api-scene-list-1"] .scene-name')
        .hasText('error')
        .sleep(1000)

        // add errro scene data
        .elementByCss('[data-accessbilityid="project-api-scene-list-1"] .anticon.anticon-edit')
        .click()
        .execute(setCodeMirror(failScene))
        .elementByCss('.ant-modal-footer .ant-btn.ant-btn-primary')
        .click()
        .sleep(1000);
    });

    it('switch default scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .elementByCss('[data-accessbilityid="project-api-scene-list-0"] input')
        .click()
        .getUrl(`${BASE_URL}/data/datahubview/init`)
        .elementByCss('body')
        /* eslint-disable */
        .hasText(JSON.stringify(successScene))
        /* eslint-enable */
        .sleep(100);
    });

    it('switch error scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .elementByCss('[data-accessbilityid="project-api-scene-list-1"] input')
        .click()
        .getUrl(`${BASE_URL}/data/datahubview/init`)
        .elementByCss('body')
        /* eslint-disable */
        .hasText(JSON.stringify(failScene))
        /* eslint-enable */
        .sleep(1000);
    });

    it('delete error scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .elementByCss('[data-accessbilityid="project-api-scene-list-1"] .anticon.anticon-delete')
        .click()
        .elementByCss('.ant-popover-buttons .ant-btn-primary')
        .click()
        .sleep(1000)
        .hasElementByCss('[data-accessbilityid="project-api-scene-list-1"] .scene-name')
        .then(value => assert.equal(value, false))
        .sleep(1000);
    });

    it('delete default scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .elementByCss('[data-accessbilityid="project-api-scene-list-0"] .anticon-delete')
        .click()
        .sleep(1000)
        .elementByCss('.ant-popover-buttons .ant-btn-primary')
        .click()
        .sleep(1000)
        .hasElementByCss('[data-accessbilityid="project-api-scene-list-0"] .anticon-delete')
        .then(value => assert.equal(value, false))
        .sleep(1000);
    });
  });
});
