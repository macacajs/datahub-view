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
  message,
} from 'antd';

import DataList from '../components/DataList';
import RealTime from '../components/RealTime';
import DataInfo from '../components/DataInfo';
import RealTimeDetail from '../components/RealTimeDetail';

import _ from '../common/helper';
import request from '../common/fetch';

import './Project.less';

const TabPane = Tabs.TabPane;
const Sider = Layout.Sider;
const Content = Layout.Content;

const { projectId, uniqId } = window.pageConfig;

class Project extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      contentViewType: 'api', // display api content by default
      data: [],
      currentPathname: '',
      REALTIME_MAXLINE: 10,
      realTimeDataList: [],
      realTimeIndex: 0,
    };
  }

  componentDidMount () {
    request(`/api/interface?projectUniqId=${uniqId}`, 'GET')
      .then((res) => {
        _.logger(`/api/data/${uniqId} GET`, res);
        res.data.forEach(item => {
          item.params = item.params;
          item.scenes = JSON.parse(item.scenes);
        });
        if (res.success) {
          this.setState({
            data: res.data,
          });
          res.data.forEach((api, index) => {
            if (api.pathname === location.hash.replace('#', '')) {
              this.handleApiClick(api.pathname);
            }
          });
        }
      });
    this.initRealTimeDataList();
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

  addApi (allData, newApi) {
    return request(`/api/data/${projectId}`, 'POST', {
      pathname: newApi.pathname,
      description: newApi.description,
    })
      .then((res) => {
        _.logger(`/api/data/${projectId} POST`, res);
        if (res.success) {
          message.success('add api success');
          this.setState({
            data: allData,
          });
        } else {
          message.error('add api fail');
        }
        return res;
      });
  }

  deleteApi (allData, newApi) {
    request(`/api/data/${projectId}/${newApi.pathname}`, 'DELETE')
      .then((res) => {
        _.logger(`/api/data/${projectId}/${newApi.pathname} DELETE`, res);
        if (res.success) {
          message.success('delete api success');
          this.setState({
            data: allData,
          });
        } else {
          message.error('delete api fail');
        }
      });
  }

  asynSecType (obj, index) {
    const apis = [...this.state.data];
    let apiIndex = 0;
    apis.forEach((api, index) => {
      if (api.pathname === this.state.currentPathname) {
        apiIndex = index;
      }
    });

    if (typeof index === 'number') {
      apiIndex = index;
    };

    Object.keys(obj).forEach(item => {
      apis[apiIndex][item] = obj[item];
      if (obj[item] instanceof Object) {
        obj[item] = JSON.stringify(obj[item]);
      }
    });

    const currentPathname = this.state.data[apiIndex].pathname;

    _.logger('asynSecType', { index, obj });
    request(`/api/data/${projectId}/${currentPathname}`, 'POST', obj).then((res) => {
      if (res.success) {
        this.setState({
          data: apis,
        });
        message.success('update api success');
      } else {
        message.error('update api fail');
      }
    });
  }

  handleApiClick (pathname) {
    this.setState({
      contentViewType: 'api',
      currentPathname: pathname,
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
    let currentData = {};
    this.state.data.forEach((api, index) => {
      if (api.pathname === this.state.currentPathname) {
        currentData = api;
      }
    });
    return (
      <Layout style={{ padding: '10px 10px 0 10px' }}>
        <Sider
          width="300px"
          style={{
            background: 'none',
            borderRight: '1px solid #eee',
            paddingRight: '10px',
          }}
        >
          <Tabs
            defaultActiveKey="apilist"
            onChange={this.tabOnChange.bind(this)}
            animated={false}
          >
            <TabPane tab={this.props.intl.formatMessage({
              id: 'project.apiList',
            })} key="apilist">
              <DataList
                apis={this.state.data}
                handleAddApi={this.addApi.bind(this)}
                handleDeleteApi={this.deleteApi.bind(this)}
                handleApiClick={this.handleApiClick.bind(this)}
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
              currentData={ currentData }
              handleAsynSecType={this.asynSecType.bind(this)}
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
