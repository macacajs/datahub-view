'use strict';

import React from 'react';
import ReactDom from 'react-dom';

import {
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
localStorage.debug = ('datahub*');

class App extends React.Component {
  pageRouter () {
    switch (this.props.pageConfig.pageId) {
      case 'dashboard':
        return <DashBoard />;
      case 'project':
        return <Project />;
      case 'document':
        return <Document />;
      default:
        return <Home />;
    }
  }

  renderInfo () {
    const link = location.href;
    return (
      <div className="info">
        <p>please visit the page in desktop browser.</p>
        <p className="link">
          <a href={link} target="_blank">
            {link}
          </a>
        </p>
      </div>
    );
  }

  render () {
    return (
      <Layout className={`page-${this.props.pageConfig.pageId}`}>
        <Header className="header">
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
              <a href={ `${pkg.links.issue}?utf8=%E2%9C%93&q=` } target="_blank">
                <h3><FormattedMessage id="common.issue" /></h3>
              </a>
            </li>
            <li>
              <a href={ pkg.links.document } target="_blank">
                <h3><FormattedMessage id="common.guide" /></h3>
              </a>
            </li>
          </ul>
        </Header>
        <Content className="main-content">
          { this.pageRouter() }
        </Content>
        <Content className="main-content-mobile">
          { this.renderInfo() }
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
  const zh = {
    locale: 'zh-CN',
    messages: zhCN,
  };
  const en = {
    locale: 'en-US',
    messages: enUS,
  };
  const ua = window.navigator.userAgent;
  if (ua.indexOf('en-US') !== -1) return en;
  if (ua.indexOf('zh-CN') !== -1) return zh;

  switch (window.navigator.language) {
    case 'zh-CN':
    case 'zh-HK':
    case 'zh-TW':
    case 'zh':
      return zh;
    default:
      return en;
  }
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
