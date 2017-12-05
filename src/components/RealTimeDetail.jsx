'use strict';

import React from 'react';

import {
  Breadcrumb
} from 'antd';

import {
  FormattedMessage
} from 'react-intl';

import './realTimeDetail.less';

export default class RealTimeDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  renderHeaders({ headers }) {
    console.log('renderHeaders', headers);
    return Object.keys(headers).map(key => {
      return (
        <div key={key}>
          <b className="header-key">{key}</b>
          {headers[key].toString()}
        </div>
      );
    });
  }

  renderBody({ body }) {
    console.log('renderBody', body);
    return (
      <pre>
        {JSON.stringify(body, {}, 2)}
      </pre>
    );
  }

  render() {
    const {
      req,
      res
    } = this.props.data;
    return (
      <div className="real-time-detail">
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/dashboard"><FormattedMessage id='realtimeProject.myProject' /></a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <FormattedMessage id='realtimeProject.detailPhoto' />
          </Breadcrumb.Item>
        </Breadcrumb>
        <section className="request">
          <div className="request-headers">
            <h1>Headers</h1>
            {this.renderHeaders({ headers: req.headers })}
          </div>
        </section>
        <section className="response">
          <div className="response-body">
            <h1>Body</h1>
            {this.renderBody({ body: res.body })}
          </div>
        </section>
      </div>
    );
  }
}
