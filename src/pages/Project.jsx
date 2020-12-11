'use strict';

import React from 'react';

import {
  injectIntl,
} from 'react-intl';

import {
  Spin,
  Affix,
  Alert,
  Layout,
} from 'antd';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

import {
  interfaceService,
  sceneGroupService,
} from '../service';

import {
  queryParse,
} from '../common/helper';

import SceneGroupList from '../components/SceneGroupList';
import InterfaceList from '../components/InterfaceList';
import InterfaceDetail from '../components/InterfaceDetail/index';

import './Project.less';

const Sider = Layout.Sider;
const Content = Layout.Content;

class Project extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      sceneGroupList: [],
      interfaceList: [],
      selectedSceneGroup: {},
      selectedInterface: {},
      actualInterfaceList: [],

      loading: true,
      collapsed: true,
    };
  }

  getSceneGroupIndexByHash (res) {
    const params = queryParse(location.hash);

    if (!res.success) return -1;

    for (let i = 0; i < res.data.length; i++) {
      const item = res.data[i];

      if (item.sceneGroupName === decodeURI(params.sceneGroupName)) {
        return i;
      }
    }

    return -1;
  }

  getInterfaceIndexByHash (interfaceList) {
    const params = queryParse(location.hash);

    for (let i = 0; i < interfaceList.length; i++) {
      const item = interfaceList[i];

      if (item.method === params.method &&
        item.pathname === decodeURI(params.pathname)) {
        return i;
      }
    }

    return 0;
  }

  async componentDidMount () {
    const sceneGroupRes = await this.fetchSceneGroupList();
    const sceneGroupIndex = this.getSceneGroupIndexByHash(sceneGroupRes);
    const selectedSceneGroup = (sceneGroupRes.data && sceneGroupRes.data[sceneGroupIndex]) || {};
    const interfaceRes = await this.fetchInterfaceList();
    const actualInterfaceList = await this.fetchActualInterfaceList(selectedSceneGroup, interfaceRes.data);
    const interfaceIndex = this.getInterfaceIndexByHash(actualInterfaceList);

    this.setState({
      loading: false,
      sceneGroupList: sceneGroupRes.data || [],
      interfaceList: interfaceRes.data || [],
      selectedSceneGroup: selectedSceneGroup,
      selectedInterface: (actualInterfaceList && actualInterfaceList[interfaceIndex]) || {},
      actualInterfaceList: actualInterfaceList,
      collapsed: !(sceneGroupRes.data && sceneGroupRes.data.length > 0),
    });
  }

  fetchSceneGroupList = async () => {
    return await sceneGroupService.getSceneGroupList();
  }

  fetchInterfaceList = async () => {
    return await interfaceService.getInterfaceList();
  }

  fetchActualInterfaceList = async (selectedSceneGroup, interfaceList) => {
    let actualInterfaceList = [];
    if (selectedSceneGroup.uniqId) {
      const interfaceUniqIdList = selectedSceneGroup.interfaceList.map(item => {
        for (let i = 0; i < interfaceList.length; i++) {
          const ele = interfaceList[i];

          if (ele.method === item.interfaceMethod &&
            ele.pathname === decodeURI(item.interfacePathname)) {
            return interfaceList[i].uniqId;
          }
        }
      });
      actualInterfaceList = interfaceList.filter(item =>
        interfaceUniqIdList.includes(item.uniqId)
      );
    } else {
      actualInterfaceList = interfaceList;
    }
    return actualInterfaceList;
  }

  updateSceneGroupList = async () => {
    const sceneGroupRes = await this.fetchSceneGroupList();
    this.setState({
      sceneGroupList: sceneGroupRes.data || [],
      selectedSceneGroup: this.getSelectedSceneGroup(sceneGroupRes.data),
    });
  }

  updateInterfaceList = async () => {
    const selectedSceneGroup = this.state.selectedSceneGroup;
    const interfaceRes = await this.fetchInterfaceList();
    const actualInterfaceList = await this.fetchActualInterfaceList(selectedSceneGroup, interfaceRes.data);

    this.setState({
      interfaceList: interfaceRes.data || [],
      actualInterfaceList: actualInterfaceList,
      selectedInterface: this.getSelectedInterface(actualInterfaceList),
    });
  }

  getSelectedSceneGroup = data => {
    if (!Array.isArray(data)) return {};

    let result = null;

    if (this.state.selectedSceneGroup && this.state.selectedSceneGroup.uniqId) {
      result = data.find(value => {
        return value.uniqId === this.state.selectedSceneGroup.uniqId;
      });
    }
    return result || {};
  }

  getSelectedInterface = data => {
    if (!Array.isArray(data)) return {};

    let result = null;

    if (this.state.selectedInterface && this.state.selectedInterface.uniqId) {
      result = data.find(value => {
        return value.uniqId === this.state.selectedInterface.uniqId;
      });
    }
    return result || data[0];
  }

  setSelectedInterface = async (uniqId) => {
    const selectedSceneGroup = this.state.selectedSceneGroup;
    const selectedInterface = this.state.interfaceList.find(i => i.uniqId === uniqId) || {};

    this.setState({
      selectedInterface,
    });

    const hashInfo = `${selectedSceneGroup.uniqId ? `sceneGroupName=${encodeURI(selectedSceneGroup.sceneGroupName)}&` : ''}pathname=${encodeURI(selectedInterface.pathname)}&method=${selectedInterface.method}`;

    location.hash = `#/?${hashInfo}`;
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }


  viewSceneGroup = async (uniqId) => {
    const selectedSceneGroup = this.state.sceneGroupList.find(i => i.uniqId === uniqId) || {};
    const actualInterfaceList = await this.fetchActualInterfaceList(selectedSceneGroup, this.state.interfaceList);

    if (selectedSceneGroup.uniqId) {
      const hashInfo = `sceneGroupName=${encodeURI(selectedSceneGroup.sceneGroupName)}`;
      location.hash = `#/?${hashInfo}`;
    } else {
      location.hash = '';
    }
    // 查看场景时接口列表的active重置为第一个
    this.setState({
      selectedSceneGroup,
      actualInterfaceList: actualInterfaceList,
      selectedInterface: actualInterfaceList[0] || {},
    });
  }

  render () {
    const globalProxyEnabled = this.state.interfaceList.every(item => item.proxyConfig.enabled);

    return (
      <Layout className="project-content">
        <Sider
          width="232px"
          style={{
            background: 'none',
            borderRight: '1px solid rgba(0,0,0,0.05)',
          }}
          className="scene-group-slider"
          collapsible
          collapsed={this.state.collapsed}
          trigger={null}
          collapsedWidth={0}
        >
          <Affix>
            <div className="scene-group-list-container">
              <div className={['scene-group-list-title', this.state.collapsed ? 'scene-group-collapsed' : ''].join(' ')}>
                {
                  this.props.intl.formatMessage({
                    id: 'project.sceneGroup',
                  })
                }
              </div>
              <SceneGroupList
                selectedSceneGroup={this.state.selectedSceneGroup}
                sceneGroupList={this.state.sceneGroupList}
                setProjectSecne={this.setProjectSecne}
                viewSceneGroup={this.viewSceneGroup}
                updateInterfaceList={this.updateInterfaceList}
                updateSceneGroupList={this.updateSceneGroupList}
                collapsed={this.state.collapsed}
              />
            </div>
          </Affix>
        </Sider>
        <Content>
          <Layout>
            <Sider
              width="300px"
              style={{
                background: 'none',
                borderRight: '1px solid rgba(0,0,0,0.05)',
              }}
              className="interface-slider"
            >
              <Affix>
                <div className="interface-list-title">
                  <div
                    onClick={this.toggle}
                    className="toggle-trigger"
                  >
                    {
                      this.state.collapsed
                        ? <MenuUnfoldOutlined />
                        : <MenuFoldOutlined />
                    }
                  </div>
                  <div className="interface-list-txt">
                    {
                      this.props.intl.formatMessage({
                        id: 'project.interfaceList',
                      })
                    }
                  </div>
                </div>
                <InterfaceList
                  selectedSceneGroup={this.state.selectedSceneGroup}
                  selectedInterface={this.state.selectedInterface}
                  setSelectedInterface={this.setSelectedInterface}
                  experimentConfig={this.props.experimentConfig}
                  interfaceList={this.state.interfaceList}
                  actualInterfaceList={this.state.actualInterfaceList}
                  updateInterfaceList={this.updateInterfaceList}
                  updateSceneGroupList={this.updateSceneGroupList}
                />
              </Affix>
            </Sider>
            <Content>
              {
                this.state.actualInterfaceList.length
                  ? <InterfaceDetail
                    selectedSceneGroup={this.state.selectedSceneGroup}
                    selectedInterface={this.state.selectedInterface}
                    updateSceneGroupList={this.updateSceneGroupList}
                    updateInterfaceList={this.updateInterfaceList}
                    globalProxyEnabled={globalProxyEnabled}
                    key={(this.state.selectedSceneGroup.uniqId || '') + (this.state.selectedInterface.uniqId || '')}
                  />
                  : this.state.loading
                    ? <div className="interface-spin">
                      <Spin size="large" />
                    </div>
                    : <div className="interface-detail">
                      <Alert
                        className="add-api-hint"
                        message={this.props.intl.formatMessage({
                          id: 'project.createApi',
                        })}
                        type="info"
                        showIcon
                      />
                    </div>
              }
            </Content>
          </Layout>
        </Content>
      </Layout>
    );
  }
}

export default injectIntl(Project);
