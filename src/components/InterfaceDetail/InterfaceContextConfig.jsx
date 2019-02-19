import React, {
  Component,
} from 'react';
import {
  Button,
} from 'antd';

import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import ContextConfigForm from '../forms/contextConfigForm';

class InterfaceProxyConfig extends Component {
  state = {
    contextConfigFormVisible: false,
    contextConfigFormLoading: false,
  }

  formatMessage = id => this.props.intl.formatMessage({ id });

  showContextConfigForm = () => {
    this.setState({
      contextConfigFormVisible: true,
    });
  }

  hideContextConfigForm = () => {
    this.setState({
      contextConfigFormVisible: false,
    });
  }

  confirmContextConfigForm = async values => {
    this.setState({
      contextConfigFormLoading: true,
    });
    await this.props.updateContextConfig(values);
    this.setState({
      contextConfigFormLoading: false,
    });
    this.setState({
      contextConfigFormVisible: false,
    });
  }

  render () {
    const {
      responseDelay = 0,
      responseStatus,
    } = this.props.contextConfigData;
    return (
      <section>
        <div className="context-config-fields">
          <div data-accessbilityid="project-api-rewrite-delay">
            <FormattedMessage
              id="contextConfig.responseDelay"
              values={{ seconds: responseDelay }}
            />
          </div>
          { responseStatus && <div data-accessbilityid="project-api-rewrite-status">
            <FormattedMessage
              id="contextConfig.responseStatus"
            /> {responseStatus}
          </div> }
          <Button
            type="primary"
            data-accessbilityid="project-api-rewrite-response"
            onClick={this.showContextConfigForm}
          > <FormattedMessage id="contextConfig.modify" />
          </Button>
        </div>
        <ContextConfigForm
          visible={this.state.contextConfigFormVisible}
          onCancel={this.hideContextConfigForm}
          onOk={this.confirmContextConfigForm}
          confirmLoading={this.state.contextConfigFormLoading}
          stageData={this.props.contextConfigData}
        />
      </section>
    );
  }
}

export default injectIntl(InterfaceProxyConfig);
