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
// import InterfaceProxyConfig from './InterfaceProxyConfig';
// import InterfaceSchema from './InterfaceSchema';

import './index.less';

const projectName = window.pageConfig.projectName;

import {
  sceneService,
  interfaceService,
} from '../../service';
class InterfaceDetail extends React.Component {
  state = {
    selectedScene: '',
    sceneList: [],
  }

  async componentDidMount () {
    await this.fetchSceneList();
  }

  changeSelectedScene = async (value) => {
    this.setState({
      selectedScene: value,
    });
    await interfaceService.updateInterface({
      uniqId: this.props.selectedInterface.uniqId,
      currentScene: value.uniqId,
    });
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
    await this.props.fetchOneInterface(this.props.selectedInterface.uniqId);
    await this.fetchSceneList();
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
            previewLink={previewLink}
            sceneList={this.state.sceneList}
            selectedScene={this.state.selectedScene}
            interfaceData={selectedInterface}
            deleteScene={this.deleteScene}
            changeSelectedScene={this.changeSelectedScene}
            updateInterFaceAndScene={this.updateInterFaceAndScene}
          />
          {/* <InterfaceContextConfig /> */}
          {/* <InterfaceProxyConfig /> */}
          {/* <InterfaceSchema /> */}
        </div>
      </div>
    );
  }
}

export default injectIntl(InterfaceDetail);
