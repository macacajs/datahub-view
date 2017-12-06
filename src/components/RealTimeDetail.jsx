'use strict';

import React from 'react';

import {
  Breadcrumb,
  Button,
  Modal,
  Input,
  Alert
} from 'antd';

import _ from '../common/helper';

import {
  injectIntl,
  FormattedMessage
} from 'react-intl';

import './realTimeDetail.less';

class RealTimeDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      addingScene: '',
      sceneError: null
    };
    this.apis = props.apis;
  }

  componentWillReceiveProps(props) {
    this.apis = props.apis;

    if (!this.currentData) {

    }
  }

  renderHeaders({ headers }) {
    // console.log('renderHeaders', headers);
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
    // console.log('renderBody', body);
    let result = null;
    if (typeof body === 'object') {
      result = JSON.stringify(body, {}, 2);
    } else {
      try {
        result = JSON.stringify(JSON.parse(body), {}, 2);
      } catch (e) {
        result = body;
      }
    }
    return (
      <pre>
        {result}
      </pre>
    );
  }

  onChangeScene(e) {
    this.setState({
      addingScene: e.target.value
    });
  }

  showModal() {
    this.setState({
      modalVisible: true,
      addingScene: '',
      sceneError: null
    });
  }

  handleModalOk() {
    const projectId = window.pageConfig.projectId;
    const pathname = this.props.data.req.path;
    const apiName = pathname && pathname.replace(`/${projectId}/`, '');
    let apiIndex = -1;

    // 确定属于哪个接口
    this.apis.forEach((api, index) => {
      if (api.identifer === projectId && api.pathname === apiName) {
        apiIndex = index;
      }
    });

    if (_.isChineseChar(this.state.addingScene)) {
      this.setState({
        sceneError: {
          message: this.props.intl.formatMessage({id: 'realtimeProject.chineseError'}),
          type: 'error'
        }
      });
      return;
    }

    if (apiIndex === -1) {
      this.setState({
        sceneError: {
          message: this.props.intl.formatMessage({id: 'realtimeProject.nullError'}),
          type: 'error'
        }
      });
      return;
    }

    const currentApiData = this.apis[apiIndex];
    const index = _.findIndex(currentApiData.scenes, o => o.name === this.state.addingScene);

    if (index !== -1) {
      this.setState({
        sceneError: {
          message: this.props.intl.formatMessage({id: 'sceneMng.existError'}),
          type: 'error'
        }
      });
      return;
    }

    if (!this.state.addingScene) {
      this.setState({
        sceneError: {
          message: this.props.intl.formatMessage({id: 'sceneMng.nullError'}),
          type: 'error'
        }
      });
      return;
    }

    const newScene = {
      name: this.state.addingScene,
      data: this.props.data.res.body
    };
    const newData = [...currentApiData.scenes, newScene];
    this.props.handleAsynSecType('scenes', newData, apiIndex);

    this.setState({
      sceneError: null,
      modalVisible: false
    });
  }

  handleModalCancel() {
    this.setState({
      modalVisible: false
    });
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
            <span style={{ fontSize: '2em', fontWeight: '500', marginRight: '10px' }}>Body</span>
            <Button type="primary" style={{ verticalAlign: 'super' }} onClick={this.showModal.bind(this)}>
              <FormattedMessage id='realtimeProject.saveToScene' />
            </Button>
            <Modal
              title={this.props.intl.formatMessage({id: 'realtimeProject.saveToScene'})}
              visible={this.state.modalVisible}
              onOk={this.handleModalOk.bind(this)}
              onCancel={this.handleModalCancel.bind(this)}
            >
              <Input
                placeholder={this.props.intl.formatMessage({id: 'realtimeProject.inputPlacehold'})}
                value={this.state.addingScene}
                onChange={this.onChangeScene.bind(this)}
                style={{ marginBottom: '10px' }}
              />
              {this.state.sceneError ? <Alert message={this.state.sceneError.message} type={this.state.sceneError.type} showIcon /> : null}
            </Modal>
            {this.renderBody({ body: res.body })}
          </div>
        </section>
      </div>
    );
  }
}

export default injectIntl(RealTimeDetail);
