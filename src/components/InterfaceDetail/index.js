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
import InterfaceSchema from './InterfaceSchema';
import deepMerge from 'deepmerge';

import './index.less';

import {
  sceneService,
  schemaService,
  interfaceService,
  sceneGroupService,
} from '../../service';

import {
  queryParse,
  serialize,
  jsonToSchema,
} from '../../common/helper';

const projectName = window.context && window.context.projectName;

class InterfaceDetail extends React.Component {
  state = {
    selectedScene: {},
    sceneList: [],
    schemaData: [],
  }

  componentWillMount () {
    this.fetchSceneList();
  }

  updateSceneFetch = async (scene) => {
    await interfaceService.updateInterface({
      uniqId: this.props.selectedInterface.uniqId,
      currentScene: scene,
    });
    await this.updateInterFaceAndScene();
  }

  changeSelectedScene = async (value, isDefault) => {
    if (isDefault) {
      const params = queryParse(location.hash);
      location.hash = `#/?${serialize(params)}`;

      await this.updateSceneFetch(value.sceneName);
    } else {
      const selectedSceneGroup = this.props.selectedSceneGroup;
      const index = selectedSceneGroup.interfaceList.findIndex(item => {
        return (item.interfacePathname === this.props.selectedInterface.pathname &&
          item.interfaceMethod === this.props.selectedInterface.method);
      });
      selectedSceneGroup.interfaceList[index].scene = value.sceneName;
      await sceneGroupService.updateSceneGroup({
        uniqId: this.props.selectedSceneGroup.uniqId,
        interfaceList: selectedSceneGroup.interfaceList,
      });
    }
    const selectedScene = this.state.sceneList.filter(i => i.sceneName === value.sceneName)[0];
    this.setState({
      selectedScene,
    });
  }

  fetchSceneList = async () => {
    const res = await sceneService.getSceneList({ interfaceUniqId: this.props.selectedInterface.uniqId });
    this.setState({
      sceneList: res.data || [],
      selectedScene: res.data && this.getDefaultScene(res.data),
    });
    this.fetchSchema();
  }

  getInitResSchema = (sceneData, schemaData) => {
    let resIndex = -1;
    schemaData.forEach((item, index) => {
      if (item.type === 'response') {
        resIndex = index;
      }
    });

    if (!sceneData || !sceneData.length) {
      return;
    }
    const obj = sceneData.length > 1 ? deepMerge.all(sceneData) : sceneData[0];
    const schema = jsonToSchema(obj);
    const result = {
      type: 'response',
      data: {
        enableSchemaValidate: true,
        schemaData: schema,
      },
    };

    if (resIndex === -1) {
      schemaData.push(result);
    } else {
      schemaData[resIndex] = deepMerge(result, schemaData[resIndex]);
    }
  }

  fetchSchema = async () => {
    const sceneData = this.state.sceneList.map(item => item.data);
    const res = await schemaService.getSchema({ interfaceUniqId: this.props.selectedInterface.uniqId });
    const schemaData = res.data || [];

    this.getInitResSchema(sceneData, schemaData);

    this.setState({
      schemaData,
    });
  }

  getDefaultScene = data => {
    if (!Array.isArray(data)) return {};
    const params = queryParse(location.hash);

    if (params.scene) {
      const result = data.find(item => item.sceneName === params.scene);

      if (result) {
        // 若参数与当前场景不同，需要更新场景
        if (params.scene !== this.props.selectedInterface.currentScene) {
          this.updateSceneFetch(params.scene);
        }
        return result;
      }
    }

    // 默认场景和其他项目场景取各自的currentScene
    const selectedSceneGroup = this.props.selectedSceneGroup;
    const isDefaultSceneGroup = !selectedSceneGroup.uniqId;
    return data.find(value => {
      if (isDefaultSceneGroup) {
        return value.sceneName === this.props.selectedInterface.currentScene;
      } else {
        const index = selectedSceneGroup.interfaceList.findIndex(item => {
          return (item.interfacePathname === this.props.selectedInterface.pathname &&
            item.interfaceMethod === this.props.selectedInterface.method);
        });
        return value.sceneName === selectedSceneGroup.interfaceList[index].scene;
      }
    }) || {};
  }

  deleteScene = async (value) => {
    await sceneService.deleteScene({
      uniqId: value.uniqId,
    });
    await this.updateInterFaceAndScene();
  }

  updateInterFaceAndScene = async () => {
    await this.props.updateSceneGroupList();
    await this.props.updateInterfaceList();
    await this.fetchSceneList();
  }

  toggleValidation = async (type, value) => {
    const selectedInterface = this.props.selectedInterface;
    const res = await schemaService.updateSchema({
      interfaceUniqId: selectedInterface.uniqId,
      type,
      enableSchemaValidate: value,
    });
    await this.fetchSchema();
    return res;
  }

  updateSchemaData = async ({ type, data }) => {
    const selectedInterface = this.props.selectedInterface;
    const res = await schemaService.updateSchema({
      interfaceUniqId: selectedInterface.uniqId,
      type,
      schemaData: data,
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
    const isDefault = !this.props.selectedSceneGroup.uniqId;

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
          <InterfaceSceneList
            previewLink={previewLink}
            sceneList={this.state.sceneList}
            selectedScene={this.state.selectedScene}
            interfaceData={selectedInterface}
            deleteScene={this.deleteScene}
            changeSelectedScene={this.changeSelectedScene}
            updateInterFaceAndScene={this.updateInterFaceAndScene}
            isDefaultSceneGroup={isDefault}
          />
          <InterfaceSchema
            isDefault={isDefault}
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
