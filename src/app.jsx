'use strict';

import 'intl';
import React from 'react';
import ReactDom from 'react-dom';

import {
  Row,
  Col,
  Layout,
  Tooltip,
} from 'antd';

import {
  addLocaleData,
  IntlProvider,
  FormattedMessage,
} from 'react-intl';

import zhCN from './locale/zh_CN';
import enUS from './locale/en_US';
import zh from 'react-intl/locale-data/zh';
import en from 'react-intl/locale-data/en';

import Home from './pages/Home';
import Project from './pages/Project';
import Document from './pages/Document';
import DashBoard from './pages/DashBoard';

import './app.less';

addLocaleData([
  ...en,
  ...zh,
]);

const Header = Layout.Header;
const Footer = Layout.Footer;
const Content = Layout.Content;

const pkg = require('../package.json');

class App extends React.Component {
  pageRouter () {
    switch (this.props.pageConfig.pageId) {
      case 'dashboard':
        return <DashBoard />;
      case 'project':
        return <Project />;
      case 'doc':
        return <Document />;
      default:
        return <Home />;
    }
  }

  render () {
    return (
      <Layout className={`page-${this.props.pageConfig.pageId}`}>
        <Header className="header">
          <Row type="flex" justify="center">
            <Col span={22}>
              <a href="/">
                <h1 className="title">DataHub</h1>
              </a>
              <ul className="nav">
                <li className="portrait">
                  <Tooltip placement="bottom" title={'hi Macaca!'}>
                    <a className="mask">
                      <img src="//npmcdn.com/macaca-logo@latest/svg/monkey.svg" />
                    </a>
                  </Tooltip>
                </li>
                <li>
                  <a href={ pkg.links.issue } target="_blank">
                    <h3><FormattedMessage id="common.issue" /></h3>
                  </a>
                </li>
                <li>
                  <a href={ pkg.links.document } target="_blank">
                    <h3><FormattedMessage id="common.guide" /></h3>
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
        </Header>
        <Content>
          { this.pageRouter() }
        </Content>
        <Footer>
          &copy;&nbsp;<a target="_blank" href={ pkg.links.homepage }>
            Macaca Team
          </a> 2015-{ new Date().getFullYear() }
        </Footer>
      </Layout>
    );
  }
}

App.defaultProps = {
  context: window.context,
  pageConfig: window.pageConfig,
};

const chooseLocale = () => {
  switch (window.navigator.language.split('_')[0]) {
    case 'en-US':
      return {
        locale: 'en-US',
        messages: enUS,
      };
    case 'zh-CN':
      return {
        locale: 'zh-CN',
        messages: zhCN,
      };
  }
  return {
    locale: 'zh-CN',
    messages: zhCN,
  };
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
