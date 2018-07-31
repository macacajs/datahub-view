'use strict';

import React from 'react';

import {
  FormattedMessage,
} from 'react-intl';

import {
  Tabs,
  Layout,
} from 'antd';

import {
  Controlled as CodeMirror,
} from '../common/codemirror';

const codeMirrorOptions = {
  theme: 'default',
  mode: 'application/json',
  foldGutter: true,
  lineNumbers: true,
  styleActiveLine: true,
  showTrailingSpace: true,
  scrollbarStyle: 'overlay',
  gutters: [
    'CodeMirror-foldgutter',
  ],
};

const TabPane = Tabs.TabPane;

import InterfaceList from '../components/InterfaceList';
import InterfaceSchema from '../components/InterfaceDetail/InterfaceSchema';

import {
  sceneService,
  schemaService,
  interfaceService,
} from '../service';

import './Document.less';

const Sider = Layout.Sider;
const Content = Layout.Content;

class Document extends React.Component {
  state = {
    interfaceList: [],
    selectedInterface: {},
    schemaData: [],
    sceneList: [],
  }

  async componentDidMount () {
    const interfaceRes = await this.initInterfaceList();
    const selectedInterface = (interfaceRes.data && interfaceRes.data[0]) || {};
    let schemaRes = {};
    let sceneRes = {};
    if (selectedInterface.uniqId) {
      schemaRes = await schemaService.getSchema({ interfaceUniqId: selectedInterface.uniqId });
      sceneRes = await sceneService.getSceneList({ interfaceUniqId: selectedInterface.uniqId });
    }
    this.setState({
      interfaceList: interfaceRes.data || [],
      selectedInterface,
      schemaData: schemaRes.data || [],
      sceneList: sceneRes.data || [],
    });
  }

  initInterfaceList = async () => {
    return await interfaceService.getInterfaceList();
  }

  fetchSchemaAndScene = async (interfaceUniqId) => {
    if (interfaceUniqId) {
      const schemaRes = await schemaService.getSchema({ interfaceUniqId });
      const sceneRes = await sceneService.getSceneList({ interfaceUniqId });
      this.setState({
        schemaData: schemaRes.data || [],
        sceneList: sceneRes.data || [],
      });
    }
  }

  setSelectedInterface = async (uniqId) => {
    const selectedInterface = this.state.interfaceList.find(i => i.uniqId === uniqId) || {};
    this.setState({
      selectedInterface,
    });
    await this.fetchSchemaAndScene(selectedInterface.uniqId);
  }

  render () {
    return (
      <Layout>
        <Sider width={300} style={{
          minHeight: '600px',
          background: '#fff',
          borderRight: '1px solid rgba(0,0,0,0.05)',
        }}>
          <InterfaceList
            unControlled={true}
            selectedInterface={this.state.selectedInterface}
            setSelectedInterface={this.setSelectedInterface}
            interfaceList={this.state.interfaceList}
          />
        </Sider>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <InterfaceSchema
            unControlled={true}
            schemaData={this.state.schemaData}
          />
          <section>
            <h1 style={{marginTop: '20px'}}><FormattedMessage id="sceneList.sceneData"/></h1>
            <Tabs
              animated={false}
            >
              {
                this.state.sceneList.map((sceneData, index) =>
                  <TabPane
                    size="small"
                    tab={sceneData.sceneName}
                    key={index}
                  >
                    <CodeMirror
                      value={JSON.stringify(sceneData.data, null, 2)}
                      options={codeMirrorOptions}
                    />
                  </TabPane>
                )
              }
            </Tabs>
          </section>
        </Content>
      </Layout>
    );
  }
}

export default Document;
