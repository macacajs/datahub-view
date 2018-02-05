'use strict';

import React from 'react';

import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import {
  UnControlled as CodeMirror,
} from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/selection/active-line';

import {
  Alert,
  Button,
  Select,
  Radio,
  Input,
  Modal,
  Checkbox,
  Tooltip,
  Popconfirm,
  Breadcrumb,
  InputNumber,
} from 'antd';

import _ from '../common/helper';
import CustomTable from './CustomTable';
import ProxyInputList from './ProxyInputList';

import './DataInfo.less';

const Option = Select.Option;
const RadioGroup = Radio.Group;

const codeMirrorOptions = {
  mode: 'javascript',
  theme: 'default',
  indentUnit: 2,
  tabSize: 2,
  lineNumbers: true,
  indentWithTabs: true,
  matchBrackets: true,
  smartIndent: true,
  textWrapping: false,
  lineWrapping: true,
  autofocus: true,
  autoCloseBrackets: true,
  autoCloseTags: true,
  foldGutter: true,
  styleActiveLine: true,
  gutters: [
    'CodeMirror-linenumbers',
    'CodeMirror-foldgutter',
  ],
};

class DataInfo extends React.Component {
  constructor (props) {
    super(props);
    const currentData = props.currentData;

    const { statusCode } = this.parseHeaders(currentData);

    let schemaContent = {};

    if (currentData && currentData.params) {
      schemaContent = JSON.parse(currentData.params);
    }

    this.state = {
      addingScene: '',
      modalVisible: false,
      modalInfoTitle: '',
      modalInfoData: '',
      _modalInfoData: '',
      schemaModalVisible: false,
      schemaJSONParseError: false,
      schemaNewData: '',
      schemaData: schemaContent.schemaData || [],
      enableSchemaValidate: false,
      proxyContent: currentData && currentData.proxyContent,
      scenes: currentData && currentData.scenes,
      method: currentData && currentData.method,
      delay: (currentData && currentData.delay) || 0,
      statusCode,
      pathname: currentData && currentData.pathname,
      description: currentData && currentData.description,
      currentScene: currentData && currentData.currentScene,
      cursorPos: null,
      sceneError: null,
    };
  }

  componentWillReceiveProps (props) {
    const currentData = props.currentData;

    if (!currentData) {
      return;
    }

    let schemaContent = {};

    if (currentData && currentData.params) {
      schemaContent = JSON.parse(currentData.params);
    }

    const { statusCode } = this.parseHeaders(currentData);

    this.setState({
      statusCode,
      proxyContent: currentData && currentData.proxyContent,
      scenes: currentData && currentData.scenes,
      schemaData: schemaContent.schemaData,
      enableSchemaValidate: schemaContent.enableSchemaValidate,
      method: currentData && currentData.method,
      delay: (currentData && currentData.delay) || 0,
      pathname: currentData && currentData.pathname,
      currentScene: currentData && currentData.currentScene,
      description: currentData && currentData.description,
    });
  }

  parseHeaders (currentData) {
    const statusCode = (currentData &&
      currentData.proxyContent &&
      JSON.parse(currentData.proxyContent).statusCode
    ) || 200;
    return {
      statusCode,
    };
  }

  handleAdd () {
    const index = _.findIndex(this.state.scenes,
      o => o.name === this.state.addingScene);

    if (index !== -1) {
      this.setState({
        sceneError: {
          message: this.props.intl.formatMessage({id: 'sceneMng.existError'}),
          type: 'error',
        },
      });
      return;
    }

    if (_.isChineseChar(this.state.addingScene)) {
      this.setState({
        sceneError: {
          message: this.props.intl.formatMessage({id: 'realtimeProject.chineseError'}),
          type: 'error',
        },
      });
      return;
    }

    if (!this.state.addingScene) {
      this.setState({
        sceneError: {
          message: this.props.intl.formatMessage({id: 'sceneMng.nullError'}),
          type: 'error',
        },
      });
      return;
    }

    this.setState({
      sceneError: null,
    });

    const newScene = {
      name: this.state.addingScene,
      data: {},
    };

    if (!this.state.scenes) {
      this.setState({
        scenes: [],
      });
    }
    this.state.scenes = this.state.scenes || []
    const newData = [...this.state.scenes, newScene];
    this.setState({
      scenes: newData,
      currentScene: this.state.addingScene,
      modalInfoData: '',
      _modalInfoData: '',
    });
    this.props.handleAsynSecType('scenes', newData);
    this.props.handleAsynSecType('currentScene', this.state.addingScene);
  }

  handleAddSceneChange (e) {
    this.setState({
      addingScene: e.target.value,
    });
  }

  onConfirmRemoveScene (index) {
    const newData = [...this.state.scenes];
    newData.splice(index, 1);

    if (this.state.scenes[index].name === this.state.currentScene &&
      this.state.scenes.length) {
      if (index > 0) {
        this.setState({
          scenes: newData,
          currentScene: this.state.scenes[0].name,
        });
        this.props.handleAsynSecType('currentScene', this.state.scenes[0].name);
      } else if (this.state.scenes.length > 1) {
        this.setState({
          scenes: newData,
          currentScene: this.state.scenes[1].name,
        });
        this.props.handleAsynSecType('currentScene', this.state.scenes[1].name);
      }
    } else {
      this.setState({
        scenes: newData,
      });
    }
    this.props.handleAsynSecType('scenes', newData);
  }

  showModal (index) {
    const str = JSON.stringify(this.state.scenes[index].data, null, 2);
    this.setState({
      modalVisible: true,
      modalInfoTitle: this.state.scenes[index].name,
      modalInfoData: str.trim(),
      _modalInfoData: str.trim(),
    });
  }

  handleModalOk (e) {
    try {
      JSON.parse(this.state._modalInfoData);
    } catch (e) {
      console.log('invalid json string');
      return;
    }
    const index = _.findIndex(this.state.scenes,
      o => o.name === this.state.modalInfoTitle);
    const updateScene = {
      name: this.state.modalInfoTitle,
      data: JSON.parse(this.state._modalInfoData),
    };
    console.log('updateScene', updateScene.data);
    const newData = [...this.state.scenes];
    newData.splice(index, 1, updateScene);
    this.setState({
      modalVisible: false,
      scenes: newData,
    });
    this.props.handleAsynSecType('scenes', newData);
  }

  handleModalCancel () {
    this.setState({
      modalVisible: false,
    });
  }

  modalTextAreaChange (editor, data, value) {
    this.setState({
      _modalInfoData: value,
    });
  }

  handleOptionChange (value) {
    this.setState({
      method: value,
    });
    this.props.handleAsynSecType('method', value);
  }

  handleSceneChange (e) {
    this.setState({
      currentScene: e.target.value,
    });
    this.props.handleAsynSecType('currentScene', e.target.value);
  }

  handleDescriptionChange (e) {
    this.setState({
      description: e.target.value,
    });
  }

  handleDescriptionBlur (e) {
    this.props.handleAsynSecType('description', e.target.value);
  }

  delayChange (value) {
    value = parseInt(value, 10);
    if (isNaN(value)) {
      value = 0;
    }
    this.setState({
      delay: value,
    });
    this.props.handleAsynSecType('delay', value);
  }

  statusCodeChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').substring(0, 3);
    this.setState({
      statusCode: value,
    });
    this.props.handleAsynSecType('proxyContent', JSON.stringify(
      {
        ...this.getProxyObject(),
        statusCode: value,
      }
    ));
  }

  handleProxyChange (value) {
    let newProxyObject = {};
    try {
      newProxyObject = JSON.parse(value);
    } catch (e) {
      console.log(`new proxy content '${this.state.proxyContent}' JSON parse failed ${e.message}`);
    }
    this.setState({
      proxyContent: value,
    });
    this.props.handleAsynSecType('proxyContent', JSON.stringify(
      {
        ...this.getProxyObject(),
        ...newProxyObject,
      }
    ));
  }

  getProxyObject () {
    let proxyObject = {};
    try {
      proxyObject = JSON.parse(this.state.proxyContent);
    } catch (e) {
      console.log(`proxy content '${this.state.proxyContent}' JSON parse failed ${e.message}`);
    }
    return proxyObject;
  }

  editSchema () {
    this.setState({
      schemaModalVisible: true,
      schemaJSONParseError: false,
      schemaNewData: JSON.stringify(this.state.schemaData, null, 2),
    });
  }

  schemaModalTextAreaChange (editor, data, value) {
    this.setState({
      schemaNewData: value.trim(),
      schemaJSONParseError: false,
    });
  }

  confirmSchemaModal (data) {
    try {
      const newData = JSON.parse(this.state.schemaNewData);
      this.setState({
        schemaModalVisible: false,
      });
      this.props.handleAsynSecType('params', JSON.stringify({
        enableSchemaValidate: this.state.enableSchemaValidate,
        schemaData: newData,
      }));
    } catch (e) {
      this.setState({
        schemaJSONParseError: true,
      });
    }
  }

  toggleSchemaValidate (e) {
    this.props.handleAsynSecType('params', JSON.stringify({
      enableSchemaValidate: e.target.checked,
      schemaData: this.state.schemaData,
    }));
  }

  cancelSchemaModal () {
    this.setState({
      schemaModalVisible: false,
      schemaJSONParseError: false,
      schemaNewData: '',
    });
  }

  onSetSchemaData (data) {
    this.setState({
      schemaData: data,
      schemaNewData: JSON.stringify(data, null, 2),
    });
    try {
      this.props.handleAsynSecType('params', JSON.stringify({
        enableSchemaValidate: this.state.enableSchemaValidate,
        schemaData: data,
      }));
    } catch (e) {
    }
  }

  render () {
    const projectId = window.pageConfig.projectId;
    const apiHref = `http://${location.host}/data/${projectId}/${this.state.pathname}`;
    return (
      <div className="datainfo">
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/dashboard"><FormattedMessage id="topNav.allProject" /></a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            { this.state.description ? this.state.description
              : this.state.pathname }
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <FormattedMessage id="topNav.projectConfig" />
          </Breadcrumb.Item>
        </Breadcrumb>
        <content>
          <section className="base-info">
            <h1><FormattedMessage id='apiConfig.title' /></h1>
            <a href={`/doc/${projectId}`} target="_blank">
              <Button className="right-button" type="primary"><FormattedMessage id='apiConfig.apiDoc' /></Button>
            </a>
            <div className="mock-address">
              <span><FormattedMessage id='apiConfig.name' /></span>
              <a target="_blank" href={apiHref}>
                <Tooltip placement="top" title={`${this.props.intl.formatMessage({id: 'sceneMng.sceneName'})}：${this.state.currentScene || 'default'}`}>
                  <span className="project-api">
                    {`${this.state.pathname}`} | {`${this.state.currentScene || 'default'}`}
                  </span>
                </Tooltip>
              </a>
            </div>
            <div>
              <span><FormattedMessage id='apiConfig.HTTP' /></span>
              <Select
                defaultValue={this.state.method}
                value={this.state.method}
                style={{ width: 120, marginLeft: 10 }}
                onChange={this.handleOptionChange.bind(this)}
              >
                <Option value="ALL">ALL</Option>
                <Option value="GET">GET</Option>
                <Option value="POST">POST</Option>
                <Option value="PUT">PUT</Option>
                <Option value="DELETE">DELETE</Option>
                <Option value="PATCH">PATCH</Option>
              </Select>
            </div>
            <div className="api-description">
              <span><FormattedMessage id='apiConfig.apiDescription' /></span>
              <Input className="des-content" onBlur={this.handleDescriptionBlur.bind(this)} onChange={this.handleDescriptionChange.bind(this)} value={this.state.description}></Input>
            </div>
            <div className="api-delay">
              <span><FormattedMessage id='apiConfig.apiDelay' /></span>
              <InputNumber min={0} max={5} value={parseInt(this.state.delay, 10)} onChange={this.delayChange.bind(this)} /> <FormattedMessage id='apiConfig.second' />
            </div>
            <div className="api-status-code">
              <span><FormattedMessage id='apiConfig.statusCode' /></span>
              <Input onChange={e => { this.setState({ statusCode: e.target.value}); }} onBlur={this.statusCodeChange} value={this.state.statusCode} maxLength="3"></Input>（200 ~ 501）</div>
          </section>
          <section className="data-scene">
            <h1><FormattedMessage id='sceneMng.title' /></h1>
            <div>
              <div className="add-input">
                <Input style={{ width: '200px' }} placeholder={this.props.intl.formatMessage({id: 'sceneMng.inputTip'})} onChange={this.handleAddSceneChange.bind(this)} />
                <Button style={{ marginBottom: `${this.state.sceneError ? '10px' : '0'}` }} type="primary" onClick={this.handleAdd.bind(this)}>
                  <FormattedMessage id='sceneMng.addSceneBtn' />
                </Button>
                {this.state.sceneError
                  ? <Alert
                    message={this.state.sceneError.message}
                    type={this.state.sceneError.type}
                    showIcon
                  /> : null}
              </div>
              <RadioGroup name="radiogroup" value={this.state.currentScene} onChange={this.handleSceneChange.bind(this)}>
                {
                  this.state.scenes && this.state.scenes.map((scene, index) => {
                    return (
                      <Radio value={scene.name} key={scene.name}>
                        <span>{ scene.name }</span>
                        <Button size="small" onClick={this.showModal.bind(this, index)}>
                          <FormattedMessage id='common.look' />
                        </Button>
                        <Popconfirm title={<FormattedMessage id='common.deleteTip' />} onConfirm={this.onConfirmRemoveScene.bind(this, index)} okText={<FormattedMessage id='common.confirm' />} cancelText={<FormattedMessage id='common.cancel' />}>
                          <Button type="danger" size="small" >
                            <FormattedMessage id='common.delete' />
                          </Button>
                        </Popconfirm>
                      </Radio>
                    );
                  })
                }
              </RadioGroup>
              <Modal
                className="codemirror-modal"
                width="80%"
                title={`scene: ${this.state.modalInfoTitle}`}
                visible={this.state.modalVisible}
                onOk={this.handleModalOk.bind(this)}
                cancelText={this.props.intl.formatMessage({id: 'common.cancel'})}
                okText={this.props.intl.formatMessage({id: 'common.confirm'})}
                onCancel={this.handleModalCancel.bind(this)}
              >
                <CodeMirror
                  value={this.state.modalInfoData}
                  options={{ ...codeMirrorOptions }}
                  onChange={this.modalTextAreaChange.bind(this)}
                />
              </Modal>
              <Modal
                className="codemirror-modal"
                width="80%"
                title="schema"
                visible={this.state.schemaModalVisible}
                onOk={this.confirmSchemaModal.bind(this)}
                cancelText={this.props.intl.formatMessage({id: 'common.cancel'})}
                okText={this.props.intl.formatMessage({id: 'common.confirm'})}
                onCancel={this.cancelSchemaModal.bind(this)}
              >
                <CodeMirror
                  value={JSON.stringify(this.state.schemaData, null, 2)}
                  options={{ ...codeMirrorOptions }}
                  onChange={this.schemaModalTextAreaChange.bind(this)}
                />
                {this.state.schemaJSONParseError && <Alert style={{marginTop: '20px'}} message="JSON 格式错误" type="warning" />}
              </Modal>
            </div>
          </section>
          <section className="data-proxy">
            <h1><FormattedMessage id='proxyConfig.title' /></h1>
            <ProxyInputList
              onChangeProxy={this.handleProxyChange.bind(this)}
              proxyContent={this.state.proxyContent}
            />
          </section>
          <section className="params-doc">
            <h1><FormattedMessage id='fieldDes.title' /></h1>
            <Checkbox
              checked={this.state.enableSchemaValidate}
              onChange={this.toggleSchemaValidate.bind(this)}
            >
              <FormattedMessage id='fieldDes.isUseCheck' />
            </Checkbox>
            <Button size="small" type="primary" onClick={this.editSchema.bind(this)}><FormattedMessage id='common.edit' /></Button>
            <CustomTable
              type="schema"
              className="schema-table"
              schemaData={this.state.schemaData}
              onChange={this.onSetSchemaData.bind(this)}
            />
          </section>
        </content>
      </div>
    );
  }
}

export default injectIntl(DataInfo);
