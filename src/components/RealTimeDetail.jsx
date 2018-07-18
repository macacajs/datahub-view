'use strict';

import React from 'react';

import {
  Breadcrumb,
  Button,
  Modal,
  Input,
  Alert,
  Collapse,
} from 'antd';

import _ from '../common/helper';

import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import './RealTimeDetail.less';

const Panel = Collapse.Panel;

class RealTimeDetail extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      modalVisible: false,
      addingScene: '',
      sceneError: null,
    };
    this.apis = props.apis;
  }

  componentWillReceiveProps (props) {
    this.apis = props.apis;

    if (!this.currentData) {

    }
  }

  renderHeaders ({ headers }) {
    return Object.keys(headers).map(key => {
      return (
        <div key={key}>
          <b className="header-key">{key}</b>
          {headers[key].toString()}
        </div>
      );
    });
  }

  renderBody ({ body }) {
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

  onChangeScene (e) {
    this.setState({
      addingScene: e.target.value,
    });
  }

  showModal () {
    this.setState({
      modalVisible: true,
      addingScene: '',
      sceneError: null,
    });
  }

  handleModalOk () {
    const projectId = window.pageConfig.projectId;
    const pathname = this.props.data.req.path;
    const apiName = pathname && pathname.replace(`/${projectId}/`, '');
    let apiIndex = -1;

    this.apis.forEach((api, index) => {
      if (api.identifer === projectId && api.pathname === apiName) {
        apiIndex = index;
      }
    });

    if (_.isChineseChar(this.state.addingScene) || /\W+/.test(this.state.addingScene)) {
      this.setState({
        sceneError: {
          message: this.props.intl.formatMessage({id: 'realtimeProject.validError'}),
          type: 'error',
        },
      });
      return;
    }

    if (apiIndex === -1) {
      this.setState({
        sceneError: {
          message: this.props.intl.formatMessage({id: 'realtimeProject.nullError'}),
          type: 'error',
        },
      });
      return;
    }

    const currentApiData = this.apis[apiIndex];
    const index = _.findIndex(currentApiData.scenes,
      o => o.name === this.state.addingScene);

    if (index !== -1) {
      this.setState({
        sceneError: {
          message: this.props.intl.formatMessage({id: 'sceneMng.existError'}),
          type: 'error',
        },
      });
      return;
    }

    if (!this.state.addingScene) {
      this.setState({
        sceneError: {
          message: this.props.intl.formatMessage({id: 'sceneMng.nullError'}),
          type: 'error',
        },
      });
      return;
    }

    const newScene = {
      name: this.state.addingScene,
      data: this.props.data.res.body,
    };
    const newData = [...currentApiData.scenes, newScene];
    this.props.handleAsynSecType({
      scenes: newData,
    }, apiIndex);

    this.setState({
      sceneError: null,
      modalVisible: false,
    });
  }

  handleModalCancel () {
    this.setState({
      modalVisible: false,
    });
  }

  render () {
    const {
      req,
      res,
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
        <section className="save-to">
          <Button type="primary" style={{ verticalAlign: 'super', float: 'right' }} onClick={this.showModal.bind(this)}>
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
            {this.state.sceneError
              ? <Alert
                message={this.state.sceneError.message}
                type={this.state.sceneError.type}
                showIcon /> : null}
          </Modal>
        </section>

        <h2 style={{marginTop: '10px'}}>Request</h2>
        <Collapse defaultActiveKey={['header', 'body']}>
          <Panel header="request header" key="header">
            <p className="headers-list">
              {this.renderHeaders({ headers: req.headers })}
            </p>
          </Panel>
          <Panel header="request body" key="body">
            <p className="body-content">
              {this.renderBody({ body: req.body })}
            </p>
          </Panel>
        </Collapse>
        <h2 style={{marginTop: '10px'}}>Respose</h2>
        <Collapse defaultActiveKey={['header', 'body']}>
          <Panel header="response header" key="header">
            <p className="headers-list">
              {this.renderHeaders({ headers: res.headers })}
            </p>
          </Panel>
          <Panel header="response body" key="body">
            <p className="body-content">
              {this.renderBody({ body: res.body })}
            </p>
          </Panel>
        </Collapse>
      </div>
    );
  }
}

export default injectIntl(RealTimeDetail);
