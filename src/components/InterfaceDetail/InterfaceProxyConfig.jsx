import React, {
  Component,
} from 'react';

import {
  injectIntl,
} from 'react-intl';


class InterfaceProxyConfig extends Component {
  state = {
  }

  formatMessage = id => this.props.intl.formatMessage({ id });

  render () {
    return (
      <div> proxy config </div>
    );
  }
}

export default injectIntl(InterfaceProxyConfig);
