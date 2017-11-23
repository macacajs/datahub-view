'use strict';

import React from 'react';
import ReactDom from 'react-dom';

import {
  Affix,
  Layout
} from 'antd';

const {
  Header,
  Footer,
  Content,
} = Layout;

import Project from './pages/Project';
import DashBoard from './pages/DashBoard';

const pkg = require('../package.json');

import './app.less';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  pageRouter() {
    switch (this.props.pageConfig.pageId) {
      case 'dashboard':
        return <DashBoard />;
      case 'project':
        return <Project />;
    }
  }

  render() {

    return (
      <Layout>
        <Header className="header" style={{ height: '60px'}}>
          <h1>DataHub</h1>
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
  pageConfig: window.pageConfig,
};

if (window.pageConfig) {
  ReactDom.render(<App />, document.querySelector('#app'));
} else {
  document.querySelector('#app').innerHTML = 'please set page config';
}
