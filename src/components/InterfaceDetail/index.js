'use strict';

import React from 'react';

import {
  FormattedMessage,
} from 'react-intl';

import {
  Icon,
  Button,
  Breadcrumb,
} from 'antd';

import InterfaceSceneList from './InterfaceSceneList';
import InterfaceContextConfig from './InterfaceContextConfig';
import InterfaceProxyConfig from './InterfaceProxyConfig';
import InterfaceSchema from './InterfaceSchema';

import './index.less';

const projectName = window.context.projectName;

import {
  sceneService,
  schemaService,
  interfaceService,
} from '../../service';
class InterfaceDetail extends React.Component {
  state = {
    selectedScene: {},
    sceneList: [],
    schemaData: [],
  }

  componentWillMount () {
    this.fetchSceneList();
    this.fetchSchema();
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

  fetchSchema = async () => {
    const res = await schemaService.getSchema({ interfaceUniqId: this.props.selectedInterface.uniqId });
    this.setState({
      schemaData: res.data || [],
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
    const { enabled = false } = this.props.selectedInterface.proxyConfig;
    const flag = !enabled;
    const selectedInterface = this.props.selectedInterface;
    await interfaceService.updateInterface({
      uniqId: this.props.selectedInterface.uniqId,
      proxyConfig: {
        ...selectedInterface.proxyConfig,
        enabled: flag,
      },
    });
    await this.props.updateInterfaceList();
  }

  changeProxyList = async newList => {
    const selectedInterface = this.props.selectedInterface;
    const payload = {
      uniqId: selectedInterface.uniqId,
      proxyConfig: {
        ...selectedInterface.proxyConfig,
        proxyList: newList,
      },
    };
    await interfaceService.updateInterface(payload);
    await this.props.updateInterfaceList();
  }

  deleteProxy = async index => {
    const selectedInterface = this.props.selectedInterface;
    const { proxyList = [] } = selectedInterface.proxyConfig;
    proxyList.splice(index, 1);
    await this.changeProxyList(proxyList);
  }

  addProxy = async value => {
    const selectedInterface = this.props.selectedInterface;
    const { proxyList = [] } = selectedInterface.proxyConfig;
    proxyList.push(value);
    await this.changeProxyList(proxyList);
  }

  selectProxy = async index => {
    const selectedInterface = this.props.selectedInterface;
    await interfaceService.updateInterface({
      uniqId: selectedInterface.uniqId,
      proxyConfig: {
        ...selectedInterface.proxyConfig,
        activeIndex: index,
      },
    });
    await this.props.updateInterfaceList();
  }

  updateContextConfig = async values => {
    const selectedInterface = this.props.selectedInterface;
    const res = await interfaceService.updateInterface({
      uniqId: selectedInterface.uniqId,
      contextConfig: {
        ...selectedInterface.contextConfig,
        ...values,
      },
    });
    await this.props.updateInterfaceList();
    return res;
  }

  toggleValidation = async (type, value) => {
    console.log('toggle', type, 'to', value);
  }

  updateSchemaData = async ({ type, data }) => {
    const selectedInterface = this.props.selectedInterface;
    const res = await schemaService.updateSchema({
      interfaceUniqId: selectedInterface.uniqId,
      type, data,
    });
    await this.fetchSchema();
    return res;
  }

  toDocPage = () => {
    location.href = `//${location.host}/doc/${projectName}`;
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
              {window.context && window.context.projectName}
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <FormattedMessage id="topNav.projectConfig" />
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="interface-detail-content">
          <Button
            type="primary"
            className="scene-doc-button"
            onClick={this.toDocPage}
          >
            <Icon type="book"/>
            <FormattedMessage id="topNav.documentation"/>
          </Button>
          <InterfaceContextConfig
            interfaceData={selectedInterface}
            updateContextConfig={this.updateContextConfig}
          />
          <InterfaceSceneList
            disabled={selectedInterface.proxyConfig.enabled}
            previewLink={previewLink}
            sceneList={this.state.sceneList}
            selectedScene={this.state.selectedScene}
            interfaceData={selectedInterface}
            deleteScene={this.deleteScene}
            changeSelectedScene={this.changeSelectedScene}
            updateInterFaceAndScene={this.updateInterFaceAndScene}
          />
          <InterfaceProxyConfig
            proxyConfig={this.props.selectedInterface.proxyConfig}
            selectedInterface={this.props.selectedInterface}
            toggleProxy={this.toggleProxy}
            deleteProxy={this.deleteProxy}
            addProxy={this.addProxy}
            selectProxy={this.selectProxy}
          />
          <InterfaceSchema
            toggleValidation={this.toggleValidation}
            schemaData={this.state.schemaData}
            updateSchemaData={this.updateSchemaData}
          />
        </div>
      </div>
    );
  }
}

export default InterfaceDetail;
