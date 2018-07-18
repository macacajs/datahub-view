import React, {
  Component,
} from 'react';

import {
  injectIntl,
} from 'react-intl';


class InterfaceSchema extends Component {
  state = {
  }

  formatMessage = id => this.props.intl.formatMessage({ id });

  render () {
    return (
      <div> schema data </div>
    );
  }
}

export default injectIntl(InterfaceSchema);
