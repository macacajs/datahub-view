'use strict';

import React from 'react';
import io from 'socket.io-client';

import {
  Layout,
  Tabs
} from 'antd';

import DataList from '../components/DataList';
import RealTime from '../components/RealTime';
import DataInfo from '../components/DataInfo';
import RealTimeDetail from '../components/RealTimeDetail';

const request = require('../common/fetch');

const TabPane = Tabs.TabPane;
const {
  Sider,
  Content
} = Layout;

const projectId = location.pathname.replace('/project/', '');

export default class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contentViewType: 'api', // display api content by default
      data: [],
      currentIndex: 0,

      REALTIME_MAXLINE: 10,
      realTimeDataList: [],
      realTimeIndex: 0
    };
  }

  componentDidMount() {
    const projectId = location.pathname.replace('/project/', '');
    request(`/api/data/${projectId}`, 'GET').then((res) => {
      res.data.forEach(item => {
        item.params = item.params;
        item.scenes = JSON.parse(item.scenes);
      });
      if (res.success) {
        this.setState({
          data: res.data
        });
      }
    });
    this.initRealTimeDataList();
  }

  initRealTimeDataList() {
    const pageConfig = window.pageConfig;
    const host = `http://${location.hostname}:${pageConfig.socket.port}`;
    const socket = io(host);
    socket.on('push data', (data) => {
      console.log(data);
      const newData = [ ...this.state.realTimeDataList ].slice(0, this.state.REALTIME_MAXLINE - 1);
      newData.unshift(data);
      this.setState({
        realTimeDataList: newData
      });
    });
  }

  addApi(allData, newApi) {
    request(`/api/data/${projectId}`, 'POST', {
      pathname: newApi.pathname,
      description: newApi.description
    }).then((res) => {
      console.log('update', res);
      if (res.success) {
        this.setState({
          data: allData
        });
        console.log('添加／更新接口成功');
      }
    });
  }

  deleteApi(allData, newApi) {
    request(`/api/data/${projectId}/${newApi.pathname}`, 'DELETE').then((res) => {
      console.log('delete', res);
      if (res.success) {
        this.setState({
          data: allData
        });
        console.log('添加／更新接口成功');
      }
    });
  }

  asynSecType(type, data) {
    console.log('data', data);
    const apis = [...this.state.data];
    apis[this.state.currentIndex][type] = data;
    console.log('apis', apis);
    const currentPathname = this.state.data[this.state.currentIndex].pathname;
    if (data instanceof Object) {
      data = JSON.stringify(data);
    }
    request(`/api/data/${projectId}/${currentPathname}`, 'POST', {
      [type]: data
    }).then((res) => {
      console.log('update', res);
      if (res.success) {
        this.setState({
          data: apis
        });
        console.log('更新数据成功');
      }
    });
  }

  handleApiClick(index) {
    this.setState({
      contentViewType: 'api',
      currentIndex: index
    });
  }

  selectRealTimeItem(index) {
    this.setState({
      contentViewType: 'realTime',
      realTimeIndex: index
    });
  }

  render() {
    return (
      <Layout style={{ padding: '0 20px', marginTop: '10px' }}>
        <Sider width="300" style={{
          background: 'none',
          borderRight: '1px solid #eee',
          marginRight: '20px',
          paddingRight: '20px'
        }}>
          <Tabs
            defaultActiveKey="1"
            animated={false}
          >
            <TabPane tab="接口列表" key="1">
              <DataList
                apis={this.state.data}
                handleAddApi={this.addApi.bind(this)}
                handleDeleteApi={this.deleteApi.bind(this)}
                handleApiClick={this.handleApiClick.bind(this)}
              />
            </TabPane>
            <TabPane tab="实时快照" key="2">
              <RealTime
                realTimeDataList={this.state.realTimeDataList}
                onSelect={this.selectRealTimeItem.bind(this)}
              />
            </TabPane>
          </Tabs>
        </Sider>
        <Content>
          {
            this.state.contentViewType === 'api' &&
            <DataInfo
              currentData={this.state.data[this.state.currentIndex]}
              handleAsynSecType={this.asynSecType.bind(this)}
            />
          }
          {
            this.state.contentViewType === 'realTime' &&
            <RealTimeDetail
              data={this.state.realTimeDataList[this.state.realTimeIndex]}
            />
          }
          {/* {
            this.state.data.length < 1
            && <h1 style={{ margin: '50px', textAlign: 'center' }}>请添加接口</h1>
          } */}
        </Content>
      </Layout>
    );
  }
}
