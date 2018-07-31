'use strict';

import React from 'react';
import io from 'socket.io-client';
import debug from 'debug';

const logger = debug('datahub:socket.io');

import {
  injectIntl,
} from 'react-intl';

import {
  Alert,
  Layout,
  Tabs,
} from 'antd';

import InterfaceList from '../components/InterfaceList';
import InterfaceDetail from '../components/InterfaceDetail/index';

import RealTime from '../components/RealTime';
import RealTimeDetail from '../components/RealTimeDetail';

import {
  interfaceService,
} from '../service';

import './Project.less';

const TabPane = Tabs.TabPane;
const Sider = Layout.Sider;
const Content = Layout.Content;

const realTimeTabSymbol = 'REALTIME_TAB_KEY';
const interfaceTabSymbol = 'INTERFACE_TAB_KEY';

class Project extends React.Component {
  state = {
    interfaceList: [],
    selectedInterface: {},

    subRouter: interfaceTabSymbol,
    REALTIME_MAXLINE: 100,
    realTimeDataList: [],
    realTimeIndex: 0,
  }

  async componentDidMount () {
    this.initRealTimeDataList();
    const res = await this.fetchInterfaceList();
    this.setState({
      interfaceList: res.data || [],
      selectedInterface: (res.data && res.data[0]) || {},
    });
  }

  fetchInterfaceList = async () => {
    return await interfaceService.getInterfaceList();
  }

  updateInterfaceList = async () => {
    const res = await this.fetchInterfaceList();
    this.setState({
      interfaceList: res.data || [],
      selectedInterface: this.getSelectedInterface(res.data),
    });
  }

  getSelectedInterface = data => {
    if (!Array.isArray(data)) return {};
    return data.find(value => {
      return value.uniqId === this.state.selectedInterface.uniqId;
    }) || data[0];
  }

  setSelectedInterface = async (uniqId) => {
    this.setState({
      selectedInterface: this.state.interfaceList.find(i => i.uniqId === uniqId) || {},
    });
  }

  initRealTimeDataList () {
    const host = `http://${location.hostname}:${window.context.socket.port}`;
    const socket = io(host);
    socket.on('push data', (data) => {
      logger(data);
      const newData = [
        ...this.state.realTimeDataList,
      ].slice(0, this.state.REALTIME_MAXLINE - 1);
      newData.unshift(data);
      this.setState({
        realTimeDataList: newData,
      });
    });
  }

  tabOnChange = key => {
    this.setState({
      subRouter: key,
    });
  }

  selectRealTimeItem = index => {
    this.setState({
      subRouter: realTimeTabSymbol,
      realTimeIndex: index,
    });
  }

  render () {
    return (
      <Layout>
        <Sider
          width="300px"
          style={{
            background: 'none',
            borderRight: '2px solid #eee',
          }}
          className="project-sider"
        >
          <Tabs
            defaultActiveKey={interfaceTabSymbol}
            onChange={this.tabOnChange}
            animated={false}
          >
            <TabPane
              tab={this.props.intl.formatMessage({
                id: 'project.interfaceList',
              })}
              key={interfaceTabSymbol}
            >
              <InterfaceList
                selectedInterface={this.state.selectedInterface}
                setSelectedInterface={this.setSelectedInterface}
                interfaceList={this.state.interfaceList}
                updateInterfaceList={this.updateInterfaceList}
              />
            </TabPane>
            <TabPane
              tab={this.props.intl.formatMessage({
                id: 'project.realtimeList',
              })}
              key={realTimeTabSymbol}
            >
              <RealTime
                realTimeDataList={this.state.realTimeDataList}
                realTimeIndex={this.state.realTimeIndex || 0}
                onSelect={this.selectRealTimeItem}
              />
            </TabPane>
          </Tabs>
        </Sider>
        <Content>
          {
            this.state.interfaceList.length
              ? this.state.subRouter === interfaceTabSymbol &&
            <InterfaceDetail
              selectedInterface={this.state.selectedInterface}
              updateInterfaceList={this.updateInterfaceList}
              key={this.state.selectedInterface.uniqId}
            />
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
          {
            this.state.subRouter === realTimeTabSymbol &&
            <RealTimeDetail
              interfaceList={this.state.interfaceList}
              realTimeData={this.state.realTimeDataList[this.state.realTimeIndex]}
            />
          }
        </Content>
      </Layout>
    );
  }
}

export default injectIntl(Project);
