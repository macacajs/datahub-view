'use strict';

import React from 'react';

import {
  FormattedMessage,
} from 'react-intl';

import {
  Layout,
  Breadcrumb,
} from 'antd';

import InterfaceList from '../components/InterfaceList';

import {
  interfaceService,
} from '../service';

const Sider = Layout.Sider;
const Content = Layout.Content;

class Document extends React.Component {
  state = {
    interfaceList: [],
    selectedInterface: {},
  }

  async componentDidMount () {
    const res = await this.fetchInterfaceList();
    this.setState({
      interfaceList: res.data || [],
      selectedInterface: (res.data && res.data[0]) || {},
    });
  }

  fetchInterfaceList = async () => {
    return await interfaceService.getInterfaceList();
  }

  setSelectedInterface = async (uniqId) => {
    this.setState({
      selectedInterface: this.state.interfaceList.find(i => i.uniqId === uniqId) || {},
    });
  }

  render () {
    return (
      <Layout>
        <Sider width={300} style={{ background: '#fff' }}>
          <InterfaceList
            selectedInterface={this.state.selectedInterface}
            setSelectedInterface={this.setSelectedInterface}
            interfaceList={this.state.interfaceList}
          />
        </Sider>
        <Layout style={{ padding: '0 20px 20px' }}>
          <Breadcrumb style={{ margin: '10px 0' }}>
            <Breadcrumb.Item>
              <a href="/dashboard"><FormattedMessage id="topNav.allProject" /></a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
            { 'schema' }
            { 'sceheList' }
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default Document;
