'use strict';

import React from 'react';
import ReactDom from 'react-dom';

import {
  Layout
} from 'antd';

import Project from './pages/Project';
import Document from './pages/Document';
import DashBoard from './pages/DashBoard';

import './app.less';

const {
  Header,
  Footer,
  Content
} = Layout;

const pkg = require('../package.json');

class App extends React.Component {
  pageRouter() {
    switch (this.props.pageConfig.pageId) {
      case 'dashboard':
        return <DashBoard />;
      case 'project':
        return <Project />;
      case 'doc':
        return <Document />;
      default:
        return (
          <div style={{textAlign: 'center'}}>
            <h2>macaca-datahub version: { window.pageConfig.version }</h2>

            <h2>datahub-view version: { pkg.version }</h2>
            <a href="/dashboard">
              <button>Go Now</button>
            </a>
          </div>
        );
    }
  }

  render() {
    return (
      <Layout>
        <Header className="header" style={{height: '60px'}}>
          <a href="/">
            <h1>DataHub</h1>
          </a>
        </Header>
        <Content>
          { this.pageRouter() }
        </Content>
        <Footer>
          &copy;&nbsp;<a target="_blank" href={ pkg.homepage }>Macaca Team</a> { new Date().getFullYear() }
        </Footer>
      </Layout>
    );
  }
}

App.defaultProps = {
  context: window.context,
  pageConfig: window.pageConfig
};

if (window.pageConfig) {
  ReactDom.render(<App />, document.querySelector('#app'));
} else {
  document.querySelector('#app').innerHTML = 'please set page config';
}
