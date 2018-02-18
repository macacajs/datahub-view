'use strict';

import React from 'react';
import {
  Row,
  Col,
  Button,
} from 'antd';

import {
  injectIntl,
} from 'react-intl';

import './Home.less';

const pkg = require('../../package.json');

class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {
    return (
      <Row type="flex" justify="center">
        <Col span={22} className="index-content">
          <Row type="flex" justify="center">
            <Col span={16}>
              <Row type="flex" justify="center">
                <Col span={12} className="big-image">
                  <img src="//wx4.sinaimg.cn/large/6d308bd9gy1fokqvum2gsj20s10l70vh.jpg" />
                </Col>
                <Col span={12}>
                  <p className="slogan">
                    <span>DataHub</span> - {this.props.intl.formatMessage({id: 'common.slogan'})}
                  </p>
                  <a className="go-btn" href="/dashboard">
                    <Button
                      type="primary"
                      icon="rocket"
                      size="large"
                      ghost
                    >{this.props.intl.formatMessage({id: 'home.go'})}
                    </Button>
                  </a>
                  <a
                    className="go-btn github"
                    target="_blank"
                    href={ pkg.links.homepage }
                  >
                    <Button
                      type="primary"
                      icon="github"
                      size="large"
                      ghost
                    >GITHUB
                    </Button>
                  </a>
                  <p className="versioning">
                    server: v{ window.pageConfig.version }, view: v{ pkg.version }
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={18}>
              <Row type="flex" justify="center" className="desc">
                <Col span={8}>
                  <h2>{this.props.intl.formatMessage({id: 'home.description.title-1'})}</h2>
                  <ul>
                    <li>{this.props.intl.formatMessage({id: 'home.description.content-1-1'})}</li>
                    <li>{this.props.intl.formatMessage({id: 'home.description.content-1-2'})}</li>
                    <li>{this.props.intl.formatMessage({id: 'home.description.content-1-3'})}</li>
                  </ul>
                </Col>
                <Col span={8}>
                  <h2>{this.props.intl.formatMessage({id: 'home.description.title-2'})}</h2>
                  <ul>
                    <li>{this.props.intl.formatMessage({id: 'home.description.content-2-1'})}</li>
                    <li>{this.props.intl.formatMessage({id: 'home.description.content-2-2'})}</li>
                    <li>{this.props.intl.formatMessage({id: 'home.description.content-2-3'})}</li>
                  </ul>
                </Col>
                <Col span={8}>
                  <h2>{this.props.intl.formatMessage({id: 'home.description.title-3'})}</h2>
                  <ul>
                    <li>{this.props.intl.formatMessage({id: 'home.description.content-3-1'})}</li>
                    <li>{this.props.intl.formatMessage({id: 'home.description.content-3-2'})}</li>
                    <li>{this.props.intl.formatMessage({id: 'home.description.content-3-3'})}</li>
                  </ul>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default injectIntl(Home);
