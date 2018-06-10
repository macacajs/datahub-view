'use strict';

import React from 'react';
import {
  Row,
  Col,
  Button,
  Icon,
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
        <Col span={22} className="content">
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
                      data-accessbilityid="go-btn-dashboard"
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
              <Row className="desc-icons">
                <Col span={4}>
                  <Icon type="cloud-o" />
                  <div className="text">{this.props.intl.formatMessage({id: 'home.icon.cloud'})}</div>
                </Col>
                <Col span={4}>
                  <Icon type="team" />
                  <div className="text">{this.props.intl.formatMessage({id: 'home.icon.team'})}</div>
                </Col>
                <Col span={4}>
                  <Icon type="camera-o" />
                  <div className="text">{this.props.intl.formatMessage({id: 'home.icon.snapshot'})}</div>
                </Col>
                <Col span={4}>
                  <Icon type="sync" />
                  <div className="text">{this.props.intl.formatMessage({id: 'home.icon.dataflow'})}</div>
                </Col>
                <Col span={4}>
                  <Icon type="rocket" />
                  <div className="text">{this.props.intl.formatMessage({id: 'home.icon.quick'})}</div>
                </Col>
                <Col span={4}>
                  <Icon type="eye-o" />
                  <div className="text">{this.props.intl.formatMessage({id: 'home.icon.scene'})}</div>
                </Col>
                <Col span={4}>
                  <Icon type="clock-circle-o" />
                  <div className="text">{this.props.intl.formatMessage({id: 'home.icon.continues'})}</div>
                </Col>
                <Col span={4}>
                  <Icon type="book" />
                  <div className="text">{this.props.intl.formatMessage({id: 'home.icon.document'})}</div>
                </Col>
                <Col span={4}>
                  <Icon type="fork" />
                  <div className="text">{this.props.intl.formatMessage({id: 'home.icon.versioning'})}</div>
                </Col>
                <Col span={4}>
                  <Icon type="tool" />
                  <div className="text">{this.props.intl.formatMessage({id: 'home.icon.setting'})}</div>
                </Col>
                <Col span={4}>
                  <Icon type="database" />
                  <div className="text">{this.props.intl.formatMessage({id: 'home.icon.database'})}</div>
                </Col>
                <Col span={4}>
                  <Icon type="save" />
                  <div className="text">{this.props.intl.formatMessage({id: 'home.icon.save'})}</div>
                </Col>
                <Col span={4}>
                  <Icon type="disconnect" />
                  <div className="text">{this.props.intl.formatMessage({id: 'home.icon.decentration'})}</div>
                </Col>
                <Col span={4}>
                  <Icon type="api" />
                  <div className="text">{this.props.intl.formatMessage({id: 'home.icon.api'})}</div>
                </Col>
                <Col span={4}>
                  <Icon type="code-o" />
                  <div className="text">{this.props.intl.formatMessage({id: 'home.icon.cli'})}</div>
                </Col>
                <Col span={4}>
                  <Icon type="global" />
                  <div className="text">{this.props.intl.formatMessage({id: 'home.icon.i18n'})}</div>
                </Col>
                <Col span={4}>
                  <Icon type="github" />
                  <div className="text">{this.props.intl.formatMessage({id: 'home.icon.github'})}</div>
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
