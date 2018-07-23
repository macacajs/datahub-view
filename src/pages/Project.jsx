'use strict';

import React from 'react';
import io from 'socket.io-client';

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


class Project extends React.Component {
  state = {
    interfaceList: [],
    selectedInterface: {},

    contentViewType: 'api', // display api content by default
    REALTIME_MAXLINE: 10,
    realTimeDataList: [],
    realTimeIndex: 0,
  }

  async componentDidMount () {
    this.initRealTimeDataList();
    await this.fetchInterfaceList();
  }

  fetchInterfaceList = async () => {
    const res = await interfaceService.getInterfaceList();
    this.setState({
      interfaceList: res.data || [],
      selectedInterface: (res.data && res.data[0]) || {},
    });
  }

  setSelectedInterface = async (uniqId) => {
    this.setState({
      selectedInterface: this.state.interfaceList.find(i => i.uniqId === uniqId) || {},
    });
  }

  initRealTimeDataList () {
    const pageConfig = window.pageConfig;
    const host = `http://${location.hostname}:${pageConfig.socket.port}`;
    const socket = io(host);
    socket.on('push data', (data) => {
      const newData = [
        ...this.state.realTimeDataList,
      ].slice(0, this.state.REALTIME_MAXLINE - 1);
      newData.unshift(data);
      this.setState({
        realTimeDataList: newData,
      });
    });
  }

  tabOnChange (key) {
    if (key === 'realtimesnapshot') {
      this.setState({
        contentViewType: 'realTime',
      });
    } else if (key === 'apilist') {
      this.setState({
        contentViewType: 'api',
      });
    }
  }

  selectRealTimeItem (index) {
    this.setState({
      contentViewType: 'realTime',
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
            defaultActiveKey="apilist"
            onChange={this.tabOnChange.bind(this)}
            animated={false}
          >
            <TabPane
              tab={this.props.intl.formatMessage({
                id: 'project.interfaceList',
              })}
              key="apilist"
            >
              <InterfaceList
                selectedInterface={this.state.selectedInterface}
                setSelectedInterface={this.setSelectedInterface}
                interfaceList={this.state.interfaceList}
                fetchInterfaceList={this.fetchInterfaceList}
              />
            </TabPane>
            <TabPane tab={this.props.intl.formatMessage({
              id: 'project.realtimeList',
            })} key="realtimesnapshot">
              <RealTime
                realTimeDataList={this.state.realTimeDataList}
                realTimeIndex={this.state.realTimeIndex || 0}
                onSelect={this.selectRealTimeItem.bind(this)}
              />
            </TabPane>
          </Tabs>
        </Sider>
        <Content>
          {
            this.state.interfaceList.length
              ? this.state.contentViewType === 'api' &&
            <InterfaceDetail
              selectedInterface={this.state.selectedInterface}
              fetchInterfaceList={this.fetchInterfaceList}
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
            this.state.contentViewType === 'realTime' &&
            <RealTimeDetail
              handleAsynSecType={this.asynSecType.bind(this)}
              apis={this.state.data}
              data={this.state.realTimeDataList[this.state.realTimeIndex]}
            />
          }
        </Content>
      </Layout>
    );
  }
}

export default injectIntl(Project);
