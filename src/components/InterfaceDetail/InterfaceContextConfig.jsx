import React from 'react';

import {
  injectIntl,
} from 'react-intl';


export default injectIntl(props => {
  const formatMessage = id => props.intl.formatMessage({ id });
  return (
    <section>
      <h1>{formatMessage('interfaceDetail.contextConfig')}</h1>
    </section>
  );
});
