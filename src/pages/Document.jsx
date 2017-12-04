'use strict';

import React from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import { FormattedMessage } from 'react-intl';

import {
  Layout,
  Tabs
} from 'antd';

import {
  UnControlled as CodeMirror
} from 'react-codemirror2';

import request from '../common/fetch';
import CustomTable from '../components/CustomTable';

import './Document.less';

const {
  Sider,
  Content
} = Layout;

const codeMirrorOptions = {
  mode: 'javascript',
  theme: 'default',
  indentUnit: 2,
  tabSize: 2,
  lineNumbers: true,
  styleActiveLine: true,
  indentWithTabs: true,
  matchBrackets: true,
  smartIndent: true,
  textWrapping: false,
  lineWrapping: true,
  readOnly: true
};

const TabPane = Tabs.TabPane;

const projectId = window.pageConfig.projectId;

export default class Document extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      slectedIndex: 0
    };
  }

  componentDidMount() {
    request(`/api/data/${projectId}`, 'GET')
      .then((res) => {
        if (res.success) {
          this.handleInitData(res.data);
        }
      });
  }

  handleInitData(data) {
    this.setState({
      list: data
    });
  }

  selectApiClick(index) {
    this.setState({
      slectedIndex: index
    });
  }

  renderDocument() {
    const currentData = this.state.list[this.state.slectedIndex];

    if (!currentData) {
      return;
    }

    const {
      method,
      description,
      pathname,
      params,
      scenes
    } = currentData;
    const paramsData = JSON.parse(params);
    const scenesData = JSON.parse(scenes);
    const {
      schemaData
    } = paramsData;

    return (
      <div className="document">
        <h1><span className={`method-${method.toLowerCase()}`}>{method}</span>  /{pathname}</h1>
        <h3>{description}</h3>
        <h1><FormattedMessage id='document.schemaDes' /></h1>
        <CustomTable
          className="schema-table"
          schemaData={schemaData}
        />
        <h1><FormattedMessage id='document.sceneData' /></h1>
        <Tabs
          defaultActiveKey="tab-0"
          type="card"
          animated={false}
        >
          {this.renderScene(scenesData)}
        </Tabs>
      </div>
    );
  }

  renderScene(list) {
    return (
      list.map((item, index) => {
        return (
          <TabPane tab={item.name} key={`tab-${index}`}>

            <CodeMirror
              value={JSON.stringify(JSON.parse(item.data), null, 2)}
              options={{ ...codeMirrorOptions }}
              onChange={() => {}}
              viewportMargin={Infinity}
            />
          </TabPane>
        );
      })
    );
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
          <div className="datalist">
            <ul>
              {
                this.state.list.map((api, index) => {
                  return (
                    <li className={index === this.state.slectedIndex ? 'clicked' : ''} key={index} onClick={this.selectApiClick.bind(this, index)}>
                      <div className="left">
                        <h3>{api.pathname}</h3>
                        <p>{api.description}</p>
                      </div>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        </Sider>
        <Content>
          {this.renderDocument()}
        </Content>
      </Layout>
    );
  }
}
