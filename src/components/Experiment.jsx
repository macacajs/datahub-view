'use strict';

import React, {
  Component,
} from 'react';

import {
  Switch,
} from 'antd';

import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import {
  isOpenDownloadAndUpload,
} from '../common/helper';

class Experiment extends Component {
  formatMessage = id => this.props.intl.formatMessage({ id });

  handleSwitchChange (value) {
    localStorage.setItem('isOpenDownloadAndUpload', value);
    this.props.setDownloadAndUpload(value);
  }

  render () {
    return (
      <div>
        <label style={{ verticalAlign: 'middle' }}>
          <FormattedMessage id="expriment.downloadAndUpload" />
        </label>
        <Switch
          checkedChildren={this.formatMessage('expriment.open')}
          unCheckedChildren={this.formatMessage('expriment.close')}
          onChange={this.handleSwitchChange.bind(this)}
          defaultChecked={isOpenDownloadAndUpload}
        />

        <hr />
        <p><FormattedMessage id="expriment.description" /></p>
        <p><FormattedMessage id="expriment.tips1" /></p>
        <p><FormattedMessage id="expriment.tips2" /></p>
        <p><FormattedMessage id="expriment.tips3" />
          <a
            href="https://github.com/macacajs/macaca-datahub/issues"
            target="_blank"
          >
           issue
          </a>
        </p>
      </div>
    );
  }
}

export default injectIntl(Experiment);
