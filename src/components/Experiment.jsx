'use strict';

import React, {
  Component,
} from 'react';

import {
  Icon,
  Drawer,
  Switch,
} from 'antd';

import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import { setExperimentConfig } from '../common/helper';

const compareVersion = (base, target) => {
  // assuming simple semver
  if (!((/^\d+\.\d+\.\d+$/).test(base) && (/^\d+\.\d+\.\d+$/).test(target))) {
    return;
  }
  const baseVersion = base.split('.');
  const targetVersion = target.split('.');

  for (let i = 0, n1, n2; i < baseVersion.length; i++) {
    n1 = parseInt(targetVersion[i], 10) || 0;
    n2 = parseInt(baseVersion[i], 10) || 0;

    if (n1 > n2) return -1;
    if (n1 < n2) return 1;
  }

  return 0;
};

class Experiment extends Component {
  state = {
    showPanel: false,
  }

  formatMessage = id => this.props.intl.formatMessage({ id });

  toggleDownloadAndUpload = value => {
    setExperimentConfig({
      isOpenDownloadAndUpload: value,
    });
    this.props.updateExperimentConfig({
      isOpenDownloadAndUpload: value,
    });
  }

  toggleCompactView = value => {
    setExperimentConfig({
      isOpenCompactView: value,
    });
    this.props.updateExperimentConfig({
      isOpenCompactView: value,
    });
  }

  render () {
    return (
      <div>
        <Drawer
          title="Experiment"
          placement="right"
          onClose={() => { this.setState({ showPanel: false }); }}
          visible={this.state.showPanel}
          width="30%"
        >
          <section>
            <label style={{ verticalAlign: 'middle' }}>
              <FormattedMessage id="expriment.downloadAndUpload" />
            </label>
            <Switch
              data-accessbilityid="experiment-donwloadupload-switch"
              checkedChildren={this.formatMessage('expriment.open')}
              unCheckedChildren={this.formatMessage('expriment.close')}
              onChange={this.toggleDownloadAndUpload}
              defaultChecked={this.props.experimentConfig.isOpenDownloadAndUpload}
            />
            {compareVersion(window.pageConfig.version, '2.2.10') === -1 &&
              <span style={{marginLeft: '8px'}}>(Only for Datahub>=2.2.10)</span>
            }
          </section>
          <section style={{ marginTop: '10px' }}>
            <label style={{ verticalAlign: 'middle' }}>
              <FormattedMessage id="expriment.compactView" />
            </label>
            <Switch
              data-accessbilityid="experiment-compactview-switch"
              checkedChildren={this.formatMessage('expriment.open')}
              unCheckedChildren={this.formatMessage('expriment.close')}
              onChange={this.toggleCompactView}
              defaultChecked={this.props.experimentConfig.isOpenCompactView}
            />
          </section>
          <hr />
          <p><FormattedMessage id="expriment.description" /></p>
          <p><FormattedMessage id="expriment.tips1" /></p>
          <p><FormattedMessage id="expriment.tips2" />
            <a
              href="https://github.com/macacajs/macaca-datahub/issues"
              target="_blank"
            >
            issue
            </a>
          </p>
        </Drawer>
        <a data-accessbilityid="experiment-container" onClick={() => this.setState({ showPanel: true })}>
          <Icon type="experiment" />
          { 'Lab' }
        </a>
      </div>
    );
  }
}

export default injectIntl(Experiment);
