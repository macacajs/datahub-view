'use strict';

import React from 'react';

import {
  Layout,
} from 'antd';

const request = require('../common/fetch');

const {
  Sider,
  Content
} = Layout;

const projectId = window.pageConfig.projectId;

export default class Document extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    request(`/api/data/${projectId}`, 'GET')
      .then((res) => {
        if (res.success) {
        }
      });
  }

  render() {
    return (
      <Layout style={{ padding: '0 20px', marginTop: '10px' }}>
        <Sider width="300" style={{
          background: 'none',
          borderRight: '1px solid #eee',
          marginRight: '20px',
          paddingRight: '20px'
        }}>
        </Sider>
        <Content>
        </Content>
      </Layout>
    );
  }
}
