import React, {
  Component,
} from 'react';

import {
  injectIntl,
} from 'react-intl';


class InterfaceContextConfig extends Component {
  state = {
  }

  formatMessage = id => this.props.intl.formatMessage({ id });

  render () {
    return (
      <div> context config </div>
    );
  }
}

export default injectIntl(InterfaceContextConfig);
