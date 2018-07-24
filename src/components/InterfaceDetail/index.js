'use strict';

import React from 'react';

import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import {
  Breadcrumb,
} from 'antd';

import InterfaceSceneList from './InterfaceSceneList';
// import InterfaceContextConfig from './InterfaceContextConfig';
import InterfaceProxyConfig from './InterfaceProxyConfig';
// import InterfaceSchema from './InterfaceSchema';

import './index.less';

const projectName = window.pageConfig.projectName;

import {
  sceneService,
  interfaceService,
} from '../../service';
class InterfaceDetail extends React.Component {
  state = {
    selectedScene: {},
    sceneList: [],
    enableProxy: false,
  }

  get uniqId () {
    return this.props.selectedInterface.uniqId;
  }

  get selectedInterface () {
    return this.props.selectedInterface;
  }

  changeSelectedScene = async (value) => {
    await interfaceService.updateInterface({
      uniqId: this.props.selectedInterface.uniqId,
      currentScene: value.uniqId,
    });
    await this.updateInterFaceAndScene();
  }

  fetchSceneList = async () => {
    const res = await sceneService.getSceneList({ interfaceUniqId: this.props.selectedInterface.uniqId });
    this.setState({
      sceneList: res.data || [],
      selectedScene: res.data && this.getDefaultScene(res.data),
    });
  }

  getDefaultScene = data => {
    if (!Array.isArray(data)) return {};
    return data.find(value => {
      return value.uniqId === this.props.selectedInterface.currentScene;
    }) || {};
  }

  deleteScene = async (value) => {
    await sceneService.deleteScene({
      uniqId: value.uniqId,
    });
    await this.updateInterFaceAndScene();
  }

  updateInterFaceAndScene = async () => {
    await this.props.updateInterfaceList();
    await this.fetchSceneList();
  }

  toggleProxy = async () => {
    const flag = !this.state.enableProxy;
    const selectedInterface = this.selectedInterface;
    console.log('old value', selectedInterface.proxyConfig);
    await interfaceService.updateInterface({
      uniqId: this.uniqId,
      proxyConfig: { enabled: flag },
    });
    await this.updateInterFaceAndScene();
    this.setState({
      enableProxy: flag,
    });
  }

  render () {
    const { selectedInterface } = this.props;
    const previewLink = `//${location.host}/data/${projectName}/${this.props.selectedInterface.pathname}`;
    return (
      <div className="interface-detail">
        <div className="interface-detail-navigation">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="/dashboard"><FormattedMessage id="topNav.allProject" /></a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="/dashboard">
                {selectedInterface.description}
              </a>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="interface-detail-content">
          <InterfaceSceneList
            disabled={this.state.enableProxy}
            previewLink={previewLink}
            sceneList={this.state.sceneList}
            selectedScene={this.state.selectedScene}
            interfaceData={selectedInterface}
            deleteScene={this.deleteScene}
            fetchSceneList={this.fetchSceneList}
            changeSelectedScene={this.changeSelectedScene}
            updateInterFaceAndScene={this.updateInterFaceAndScene}
          />
          {/* <InterfaceContextConfig /> */}
          <InterfaceProxyConfig
            enableProxy={this.state.enableProxy}
            toggleProxy={this.toggleProxy}
          />
          {/* <InterfaceSchema /> */}
        </div>
      </div>
    );
  }
}

export default injectIntl(InterfaceDetail);
