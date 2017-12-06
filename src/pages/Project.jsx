'use strict';

import React from 'react';
import io from 'socket.io-client';

import {
  injectIntl
} from 'react-intl';

import {
  Layout,
  Tabs
} from 'antd';

import DataList from '../components/DataList';
import RealTime from '../components/RealTime';
import DataInfo from '../components/DataInfo';
import RealTimeDetail from '../components/RealTimeDetail';

import request from '../common/fetch';

const TabPane = Tabs.TabPane;
const {
  Sider,
  Content
} = Layout;

const projectId = window.pageConfig.projectId;

class Project extends React.Component {
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
    request(`/api/data/${projectId}`, 'GET').then((res) => {
      console.log('res', res);
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
      console.log('socket', data);
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
        console.log('update api success');
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
        console.log('delete api success');
      }
    });
  }

  asynSecType(type, data, index) {
    const apis = [...this.state.data];
    let apiIndex = this.state.currentIndex;
    if (typeof index === 'number') {
      apiIndex = index;
    }
    apis[apiIndex][type] = data;
    const currentPathname = this.state.data[apiIndex].pathname;
    if (data instanceof Object) {
      data = JSON.stringify(data);
    }
    console.log('type', type);
    console.log('data', data);
    request(`/api/data/${projectId}/${currentPathname}`, 'POST', {
      [type]: data
    }).then((res) => {
      if (res.success) {
        this.setState({
          data: apis
        });
        console.log('update api success');
      }
    });
  }

  handleApiClick(index) {
    this.setState({
      contentViewType: 'api',
      currentIndex: index
    });
  }

  tabOnChange(key) {
    if (key === 'realtimesnapshot' && this.state.realTimeDataList.length > 0) {
      console.log('this.state.realTimeDataList', this.state.realTimeDataList);
      this.setState({
        contentViewType: 'realTime',
        realTimeIndex: 0
      });
    } else if (key === 'apilist' && this.state.data.length > 0) {
      this.setState({
        contentViewType: 'api',
        currentIndex: 0
      });
    }
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
            defaultActiveKey="apilist"
            onChange={this.tabOnChange.bind(this)}
            animated={false}
          >
            <TabPane tab={this.props.intl.formatMessage({id: 'project.apiList'})} key="apilist">
              <DataList
                apis={this.state.data}
                handleAddApi={this.addApi.bind(this)}
                handleDeleteApi={this.deleteApi.bind(this)}
                handleApiClick={this.handleApiClick.bind(this)}
              />
            </TabPane>
            <TabPane tab={this.props.intl.formatMessage({id: 'project.realtimeList'})} key="realtimesnapshot">
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
            this.state.contentViewType === 'api' &&
            <DataInfo
              currentData={this.state.data[this.state.currentIndex]}
              handleAsynSecType={this.asynSecType.bind(this)}
            />
          }
          {
            this.state.contentViewType === 'realTime' &&
            <RealTimeDetail
              handleAsynSecType={this.asynSecType.bind(this)}
              apis={this.state.data}
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

export default injectIntl(Project);
