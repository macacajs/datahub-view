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
import RealTime from '../components/RealTime';
import DataInfo from '../components/DataInfo';
import RealTimeDetail from '../components/RealTimeDetail';

import _ from '../common/helper';
import { interfaceService } from '../service';

import './Project.less';

const TabPane = Tabs.TabPane;
const Sider = Layout.Sider;
const Content = Layout.Content;


class Project extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      interfaceList: [],


      contentViewType: 'api', // display api content by default
      data: [],
      currentPathname: '',
      REALTIME_MAXLINE: 10,
      realTimeDataList: [],
      realTimeIndex: 0,
    };
  }

  async componentDidMount () {
    this.initRealTimeDataList();
    await this.fetchInterfaceList();
  }

  fetchInterfaceList = async () => {
    const res = await interfaceService.getInterfaceList();
    this.setState({
      interfaceList: res.data || [],
    });
  }

  initRealTimeDataList () {
    const pageConfig = window.pageConfig;
    const host = `http://${location.hostname}:${pageConfig.socket.port}`;
    const socket = io(host);
    socket.on('push data', (data) => {
      _.logger('socket', data);
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
    if (key === 'realtimesnapshot' && this.state.realTimeDataList.length > 0) {
      _.logger('this.state.realTimeDataList', this.state.realTimeDataList);
      this.setState({
        contentViewType: 'realTime',
        realTimeIndex: 0,
      });
    } else if (key === 'apilist' && this.state.data.length) {
      this.setState({
        contentViewType: 'api',
        currentPathname: this.state.data[0].pathname,
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
                id: 'project.apiList',
              })}
              key="apilist"
            >
              <InterfaceList
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
            this.state.data.length
              ? this.state.contentViewType === 'api' &&
            <DataInfo
            />
              : <div className="datainfo">
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
            this.state.data.length
              ? this.state.contentViewType === 'realTime' &&
            <RealTimeDetail
              handleAsynSecType={this.asynSecType.bind(this)}
              apis={this.state.data}
              data={this.state.realTimeDataList[this.state.realTimeIndex]}
            /> : null
          }
        </Content>
      </Layout>
    );
  }
}

export default injectIntl(Project);
