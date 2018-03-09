'use strict';

import React from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

import {
  FormattedMessage,
} from 'react-intl';

import {
  Layout,
  Tabs,
} from 'antd';

import {
  UnControlled as CodeMirror,
} from 'react-codemirror2';

import request from '../common/fetch';
import CustomTable from '../components/CustomTable';

import './Document.less';

const Sider = Layout.Sider;
const Content = Layout.Content;

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
  readOnly: true,
};

const TabPane = Tabs.TabPane;

const projectId = window.pageConfig.projectId;

export default class Document extends React.Component {
  constructor (props) {
    super(props);
    let slectedIndex = '';
    let hashSceneIndex = '';
    if (/scene=/.test(location.hash)) {
      slectedIndex = parseInt(location.hash.replace(/#api=(.*)scene=\w*/, '$1'), 10);
      hashSceneIndex = parseInt(location.hash.split('scene=')[1], 10);
    } else {
      slectedIndex = parseInt(location.hash.split('api=')[1], 10);
    }

    this.state = {
      list: [],
      slectedIndex: slectedIndex || 0,
      hashSceneIndex,
    };
  }

  componentDidMount () {
    request(`/api/data/${projectId}`, 'GET')
      .then((res) => {
        if (res.success) {
          this.handleInitData(res.data);
        }
      });
  }

  handleInitData (data) {
    this.setState({
      list: data,
    });
  }

  handletabClick (data) {
    const sceneIndex = data.replace('tab-', '');
    if (!/scene=/.test(location.hash)) {
      location.hash += `scene=${sceneIndex}`;
    } else {
      const nowApi = location.hash.split('scene=')[0];
      location.hash = `${nowApi}scene=${sceneIndex}`;
    }
    this.setState({
      hashSceneIndex: sceneIndex,
    });
  }

  selectApiClick (index) {
    this.setState({
      slectedIndex: index,
    });
    location.hash = `api=${index}`;
  }

  renderDocument () {
    const currentData = this.state.list[this.state.slectedIndex];

    if (!currentData) {
      return;
    }

    const {
      method,
      description,
      pathname,
      scenes,
      params,
    } = currentData;
    const scenesData = JSON.parse(scenes);
    const paramsData = JSON.parse(params);

    return (
      <div className="document">
        <h1>
          <span className={`method-${method.toLowerCase()}`}>
            {method}
          </span>  /{pathname}
        </h1>
        <h3>{description}</h3>
        <h1><FormattedMessage id='document.schemaDes' /></h1>
        <CustomTable
          type="api"
          className="schema-table"
          schemaData={scenesData}
          paramsData={paramsData}
          disabled={true}
        />
        <h1><FormattedMessage id='document.sceneData' /></h1>
        <Tabs
          defaultActiveKey={'tab-' + this.state.hashSceneIndex}
          type="card"
          animated={false}
          onTabClick={this.handletabClick.bind(this)}
        >
          {this.renderScene(scenesData)}
        </Tabs>
      </div>
    );
  }

  renderScene (list) {
    return (
      list.map((item, index) => {
        return (
          <TabPane tab={item.name} key={`tab-${index}`}>
            <CodeMirror
              value={JSON.stringify(item.data, null, 2)}
              options={{ ...codeMirrorOptions }}
              onChange={() => {}}
              viewportMargin={Infinity}
            />
          </TabPane>
        );
      })
    );
  }

  render () {
    return (
      <Layout style={{ padding: '10px 10px 0 10px'}}>
        <Sider
          width="300"
          style={{
            background: 'none',
            borderRight: '1px solid #eee',
            paddingRight: '10px',
          }}
        >
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
