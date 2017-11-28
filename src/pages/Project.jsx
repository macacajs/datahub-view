'use strict';

import React from 'react';
import io from 'socket.io-client';

const request = require('../common/fetch');
import {
  Layout,
  Tabs,
} from 'antd';
const TabPane = Tabs.TabPane;
const {
  Header,
  Footer,
  Sider,
  Content,
} = Layout;

import DataList from '../components/DataList';
import DataInfo from '../components/DataInfo';

const projectId = location.pathname.replace('/project/', '');

export default class Project extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      currentIndex: 0,
    }
  }

  componentDidMount() {
    const projectId = location.pathname.replace('/project/', '')
    request(`/api/data/${projectId}`, 'GET').then((res) => {
      res.data.forEach(item => {
        item.params = JSON.parse(item.params);
        item.scenes = JSON.parse(item.scenes);
      })
      if (res.success) {
        this.setState({
          data: res.data,
        })
      }
    });
    const pageConfig = window.pageConfig;
    const host = `http://${location.hostname}:${pageConfig.socket.port}`;
    const socket = io(host);
    socket.on('test event', (data) => {
      console.log(data);
    });
  }

  addApi(allData, newApi) {
    request(`/api/data/${projectId}`, 'POST', {
      pathname: newApi.pathname,
      description: newApi.description,
    }).then((res) => {
      console.log('update', res)
      if (res.success) {
        this.setState({
          data: allData
        })
        console.log('添加／更新接口成功');
      }
    });
  }

  deleteApi(allData, newApi) {
    request(`/api/data/${projectId}/${newApi.pathname}`, 'DELETE').then((res) => {
      console.log('delete', res);
      if (res.success) {
        this.setState({
          data: allData,
        }),
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
      data = JSON.stringify(data)
    }
    request(`/api/data/${projectId}/${currentPathname}`, 'POST', {
      [type]: data,
    }).then((res) => {
      console.log('update', res)
      if (res.success) {
        this.setState({
          data: apis,
        })
        console.log('更新数据成功');
      }
    });
  }

  handleApiClick(index) {
    this.setState({
      currentIndex: index,
    });
  }

  render() {
    return (
      <Layout style={{ padding: '0 20px', marginTop: '10px' }}>
        <Sider width="300" style={{
          background: 'none',
          borderRight: '1px solid #eee',
          marginRight: '20px',
          paddingRight: '20px',
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
              Coming soon.
            </TabPane>
          </Tabs>
        </Sider>
        <Content>
          {
            this.state.data.length > 0
            && <DataInfo
              currentData={this.state.data[this.state.currentIndex]}
              handleAsynSecType={this.asynSecType.bind(this)}
            />
          }
          {
            this.state.data.length < 1
            && <h1 style={{ margin: '50px', textAlign: 'center' }}>请添加接口</h1>
          }
        </Content>
      </Layout>
    );
  }
}
