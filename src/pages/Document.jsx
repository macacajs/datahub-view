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
  Button,
  Icon,
} from 'antd';

import _ from 'lodash';

import {
  UnControlled as CodeMirror,
} from 'react-codemirror2';

import request from '../common/request';
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
    this.state = {
      list: [],
      slectedIndex: 0,
      slectedName: '',
      hashSceneIndex: 0,
      hashSceneName: '',
    };
  }

  componentDidMount () {
    let pathname = '';
    let scenename = '';
    if (/scene=/.test(location.hash)) {
      pathname = location.hash.replace(/#api=(.*)&scene=\w*/, '$1');
      scenename = location.hash.split('&scene=')[1];
    } else {
      pathname = location.hash.split('api=')[1];
    }

    request(`/api/data/${projectId}`, 'GET')
      .then((res) => {
        let hashSceneIndex;
        let slectedIndex;
        if (res.success) {
          res.data.forEach((item, index) => {
            if (item.pathname === pathname) {
              slectedIndex = index;
              let scenes = [];
              try {
                scenes = JSON.parse(item.scenes);
              } catch (e) {
              }
              scenes.forEach((scene, i) => {
                if (scene.name === scenename) {
                  hashSceneIndex = i;
                }
              });
            }
          });
          this.setState({
            slectedIndex: slectedIndex || 0,
            slectedName: pathname,
            hashSceneIndex: hashSceneIndex || 0,
            hashSceneName: scenename,
            list: res.data,
          });
        }
      });
  }

  handletabClick (scenesData, tabIndex) {
    const sceneIndex = tabIndex.replace('tab-', '');
    const sceneName = scenesData[sceneIndex].name;
    if (!/&scene=/.test(location.hash)) {
      location.hash += `&scene=${sceneName}`;
    } else {
      const nowApi = location.hash.split('&scene=')[0];
      location.hash = `${nowApi}&scene=${sceneName}`;
    }
    this.setState({
      hashSceneIndex: sceneIndex,
      hashSceneName: sceneName,
    });
  }

  selectApiClick (index, pathname) {
    this.setState({
      slectedIndex: index,
      slectedName: pathname,
    });
    location.hash = `api=${pathname}`;
  }

  renderDocument () {
    const currentData = this.state.list.find(i => i.pathname === this.state.slectedName);

    if (!currentData) {
      return;
    }

    const {
      method,
      description,
      pathname,
      scenes,
      resSchemaContent,
      reqSchemaContent,
    } = currentData;
    const scenesData = JSON.parse(scenes);
    const resSchemaContentObj = JSON.parse(resSchemaContent);
    const reqSchemaContentObj = JSON.parse(reqSchemaContent);

    return (
      <div className="document">
        <h1>
          <span className={`method-${method.toLowerCase()}`}>
            {method}
          </span>&nbsp;/&nbsp;{pathname}
        </h1>
        <a
          href={`/project/${projectId}#${pathname}`}
        >
          <Button className="right-button">
            <Icon type="setting" />
            <FormattedMessage id='apiConfig.project' />
          </Button>
        </a>

        <h3>{description}</h3>
        <h1>
          <FormattedMessage id='document.reqSchemaDes' />
        </h1>
        <div className="req-shcema-doc">
          <CustomTable
            type="api"
            disabeld={true}
            className="schema-table"
            schemaData={[]}
            paramsData={reqSchemaContentObj}
            disabled={true}
          />
        </div>
        <h1>
          <FormattedMessage id='document.resSchemaDes' />
        </h1>
        <div className="res-shcema-doc">
          <CustomTable
            type="api"
            className="schema-table"
            schemaData={scenesData}
            paramsData={resSchemaContentObj}
            disabled={true}
          />
        </div>
        <h1>
          <FormattedMessage id='document.sceneData' />
        </h1>
        <Tabs
          defaultActiveKey={'tab-' + this.state.hashSceneIndex}
          type="card"
          animated={false}
          onTabClick={this.handletabClick.bind(this, scenesData)}
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

  handleApiSort () {
    if (!this.state.list) {
      return [];
    }
    const res = _.sortBy(this.state.list, item => item.pathname);
    return res;
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
                this.handleApiSort().map((api, index) => {
                  return (
                    <li
                      className={api.pathname === this.state.slectedName ? 'clicked' : ''}
                      key={index}
                      onClick={this.selectApiClick.bind(this, index, api.pathname)}
                    >
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
