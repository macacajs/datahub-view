'use strict';

import 'intl';
import React from 'react';
import ReactDom from 'react-dom';

import {
  addLocaleData,
  IntlProvider
} from 'react-intl';

import zhCN from './locale/zh_CN';
import enUS from './locale/en_US';
import zh from 'react-intl/locale-data/zh';
import en from 'react-intl/locale-data/en';

import {
  Layout
} from 'antd';

import Project from './pages/Project';
import Document from './pages/Document';
import DashBoard from './pages/DashBoard';

import './app.less';

addLocaleData([
  ...en,
  ...zh
]);

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

const chooseLocale = () => {
  let result = {
    locale: 'zh-CN',
    messages: zhCN
  };
  switch (window.navigator.language.split('_')[0]) {
    case 'en-US':
      result = {
        locale: 'en-US',
        messages: enUS
      };
      break;
    case 'zh-CN':
      result = {
        locale: 'zh-CN',
        messages: zhCN
      };
      break;
  }
  return result;
};

if (window.pageConfig) {
  const lang = chooseLocale();
  ReactDom.render(
    <IntlProvider
      locale={lang.locale}
      messages={lang.messages}
    >
      <App />
    </IntlProvider>,
    document.querySelector('#app'));
} else {
  document.querySelector('#app').innerHTML = 'please set page config';
}
