import React from 'react';

import {
  Switch,
} from 'antd';

import {
  injectIntl,
} from 'react-intl';

export default injectIntl(props => {
  const formatMessage = id => props.intl.formatMessage({ id });
  return (
    <section style={{marginTop: '20px'}}>
      <h1> {formatMessage('interfaceDetail.proxyConfig')} </h1>
      <Switch
        onChange={props.toggleProxy}
      />
      <span style={{marginLeft: '10px', verticalAlign: 'middle'}}>
        {formatMessage(`proxyConfig.enable.${props.enableProxy}`)}
      </span>
    </section>
  );
});
