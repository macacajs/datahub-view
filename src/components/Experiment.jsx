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

const isSemverLessThan = (left, right) => {
  // assuming simple semver
  if ((/^\d+\.\d+\.\d+$/).test(left) && (/^\d+\.\d+\.\d+$/).test(right)) {
    const [lMajor, lMinor, lPatch] = left.split('.');
    const [rMajor, rMinor, rPatch] = right.split('.');
    return Number(lMajor) < Number(rMajor) ||
      Number(lMinor) < Number(rMinor) ||
      Number(lPatch) < Number(rPatch);
  }
  return false;
};


class Experiment extends Component {
  state = {
    showPanel: false,
  }

  formatMessage = id => this.props.intl.formatMessage({ id });

  toggleDownloadAndUpload = value => {
    localStorage.setItem('DATAHUB_FEATURE_DOWNLOAD_AND_UPLOAD', value);
    this.props.updateExperimentConfig({
      isOpenDownloadAndUpload: value,
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
          <label style={{ verticalAlign: 'middle' }}>
            <FormattedMessage id="expriment.downloadAndUpload" />
          </label>
          <Switch
            checkedChildren={this.formatMessage('expriment.open')}
            unCheckedChildren={this.formatMessage('expriment.close')}
            onChange={this.toggleDownloadAndUpload}
            defaultChecked={this.props.experimentConfig.isOpenDownloadAndUpload}
          />
          {isSemverLessThan(window.pageConfig.version, '2.2.10') &&
            <span style={{marginLeft: '8px'}}>(Only for Datahub>=2.2.10)</span>
          }
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
        <a onClick={() => this.setState({ showPanel: true })}>
          <Icon type="experiment" />
          { 'Lab' }
        </a>
      </div>
    );
  }
}

export default injectIntl(Experiment);
