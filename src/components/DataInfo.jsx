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
  Tooltip,
  Popconfirm,
  Breadcrumb,
  InputNumber,
  Icon,
  message,
} from 'antd';

import _ from '../common/helper';
import FieldTable from './FieldTable';
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
    const currentData = props.currentData || {};


    const { statusCode } = this.parseHeaders(currentData);

    this.state = {
      modalVisible: false,
      modalInfoTitle: '',
      modalInfoData: '',
      _modalInfoData: '',
      schemaModalVisible: false,
      responseHeaderModalVisible: false,
      reqSchemaContent: currentData.reqSchemaContent,
      // adapt params field
      resSchemaContent: (currentData.resSchemaContent && currentData.resSchemaContent !== '{}') ? currentData.resSchemaContent : currentData.params,
      proxyContent: currentData && currentData.proxyContent,
      scenes: currentData && currentData.scenes,
      method: currentData && currentData.method,
      delay: (currentData && currentData.delay) || 0,
      statusCode,
      responseHeader: currentData && currentData.responseHeader || '{}',
      _responseHeader: '{}',
      pathname: currentData && currentData.pathname,
      description: currentData && currentData.description,
      currentScene: currentData && currentData.currentScene,
      addingScene: '',
      cursorPos: null,
      sceneError: null,
    };
  }

  componentWillReceiveProps (props) {
    const currentData = props.currentData || {};

    if (!currentData) {
      return;
    }

    const {
      statusCode,
    } = this.parseHeaders(currentData);

    this.setState({
      statusCode,
      proxyContent: currentData && currentData.proxyContent,
      scenes: currentData && currentData.scenes,
      responseHeader: currentData && currentData.responseHeader || '{}',
      method: currentData && currentData.method,
      delay: (currentData && currentData.delay) || 0,
      pathname: currentData && currentData.pathname,
      currentScene: currentData && currentData.currentScene,
      description: currentData && currentData.description,
      reqSchemaContent: currentData.reqSchemaContent,
      // adapt params field
      resSchemaContent: (currentData.resSchemaContent && currentData.resSchemaContent !== '{}') ? currentData.resSchemaContent : currentData.params,
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

  handleAdd (e) {
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

    if (_.isChineseChar(this.state.addingScene) || /[^-\w]+/.test(this.state.addingScene)) {
      this.setState({
        sceneError: {
          message: this.props.intl.formatMessage({id: 'realtimeProject.validError'}),
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
    this.state.scenes = this.state.scenes || [];
    const newData = [...this.state.scenes, newScene];
    this.setState({
      addingScene: '',
      scenes: newData,
      currentScene: this.state.addingScene,
      modalInfoData: '',
      _modalInfoData: '',
    });
    this.props.handleAsynSecType({
      scenes: newData,
      currentScene: this.state.addingScene,
    });
  }

  handleAddSceneChange (e) {
    this.setState({
      addingScene: e.target.value,
    });
  }

  onRemoveScene (index) {
    const newData = [...this.state.scenes];
    newData.splice(index, 1);

    if (this.state.scenes[index].name === this.state.currentScene &&
      this.state.scenes.length) {
      if (index > 0) {
        this.setState({
          scenes: newData,
          currentScene: this.state.scenes[0].name,
        });
        this.props.handleAsynSecType({
          currentScene: this.state.scenes[0].name,
        });
      } else if (this.state.scenes.length > 1) {
        this.setState({
          scenes: newData,
          currentScene: this.state.scenes[1].name,
        });
        this.props.handleAsynSecType({
          currentScene: this.state.scenes[1].name,
        });
      }
    } else {
      this.setState({
        scenes: newData,
      });
    }
    this.props.handleAsynSecType({
      scenes: newData,
    });
  }

  showModal (index) {
    const str = JSON.stringify(this.state.scenes[index].data, null, 2);
    const scene = this.state.scenes[index]
    this.clearCodeMirror(scene.data);
    this.setState({
      modalVisible: true,
      modalInfoTitle: scene.name,
      modalInfoData: str.trim(),
      _modalInfoData: str.trim(),
    });
  }

  handleModalOk (e) {
    try {
      JSON.parse(this.state._modalInfoData);
    } catch (e) {
      message.warning('invalid json string');
      return;
    }
    const index = _.findIndex(this.state.scenes,
      o => o.name === this.state.modalInfoTitle);
    const updateScene = {
      name: this.state.modalInfoTitle,
      data: JSON.parse(this.state._modalInfoData),
    };
    _.logger('updateScene', updateScene.data);
    const newData = [...this.state.scenes];
    newData.splice(index, 1, updateScene);
    this.setState({
      modalVisible: false,
      scenes: newData,
    });
    this.props.handleAsynSecType({
      scenes: newData,
    });
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
    this.props.handleAsynSecType({
      method: value,
    });
  }

  handleSceneChange (e) {
    this.setState({
      currentScene: e.target.value,
    });
    this.props.handleAsynSecType({
      currentScene: e.target.value,
    });
  }

  handleDescriptionChange (e) {
    this.setState({
      description: e.target.value,
    });
  }

  handleDescriptionBlur (e) {
    this.props.handleAsynSecType({
      description: e.target.value,
    });
  }

  handleDelayBlur (e) {
    this.props.handleAsynSecType({
      delay: e.target.value,
    });
  }

  delayChange (value) {
    value = parseInt(value, 10);
    if (isNaN(value)) {
      value = 0;
    }
    this.setState({
      delay: value,
    });
  }

  statusCodeChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').substring(0, 3);
    this.setState({
      statusCode: value,
    });
    this.props.handleAsynSecType({
      proxyContent: JSON.stringify({
        ...this.getProxyObject(),
        statusCode: value,
      }),
    });
  }

  handleProxyChange (value) {
    let newProxyObject = {};
    try {
      newProxyObject = JSON.parse(value);
    } catch (e) {
      console.error(`new proxy content '${this.state.proxyContent}' JSON parse failed ${e.message}`);
    }
    this.setState({
      proxyContent: value,
    });
    this.props.handleAsynSecType({
      proxyContent: JSON.stringify({
        ...this.getProxyObject(),
        ...newProxyObject,
      }),
    });
  }

  getProxyObject () {
    let proxyObject = {};
    try {
      proxyObject = JSON.parse(this.state.proxyContent);
    } catch (e) {
      console.error(`proxy content '${this.state.proxyContent}' JSON parse failed ${e.message}`);
    }
    return proxyObject;
  }

  handleRequestHeader () {
    const str = JSON.stringify(JSON.parse(this.state.responseHeader), null, 2);
    this.setState({
      responseHeaderModalVisible: true,
      responseHeader: str.trim(),
      _responseHeader: str.trim(),
    });
  }

  clearCodeMirror (data) {
    const CodeMirrorDom = document.querySelector('.CodeMirror');
    const noData = JSON.stringify(data) === '{}';
    if (CodeMirrorDom && CodeMirrorDom.CodeMirror && noData) {
      CodeMirrorDom.CodeMirror.setValue('{}');
    }
  }

  responseHeaderModalCancel () {
    this.setState({
      responseHeaderModalVisible: false,
    });
  }

  responseHeaderModalChange (editor, data, value) {
    this.setState({
      _responseHeader: value,
    });
  }

  responseHeaderModalOk (e) {
    try {
      JSON.parse(this.state._responseHeader);
    } catch (e) {
      console.error('invalid json string');
      return;
    }
    this.props.handleAsynSecType({
      responseHeader: this.state._responseHeader,
    });

    this.setState({
      responseHeaderModalVisible: false,
      responseHeader: this.state._responseHeader,
    });
  }

  render () {
    const projectId = window.pageConfig.projectId;
    const apiHref = `//${location.host}/data/${projectId}/${this.state.pathname}`;
    return (
      <div className="datainfo">
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/dashboard"><FormattedMessage id="topNav.allProject" /></a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {
              this.state.description
                ? this.state.description
                : this.state.pathname
            }
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <FormattedMessage id="topNav.projectConfig" />
          </Breadcrumb.Item>
        </Breadcrumb>
        <content>
          <section className="base-info">
            <h1>
              <FormattedMessage id='apiConfig.title' />
            </h1>
            <a
              href={`/doc/${projectId}${location.hash.replace('#', '#api=')}`}
              target="_blank"
            >
              <Button className="right-button" type="primary">
                <Icon type="book" />
                <FormattedMessage id='apiConfig.apiDoc' />
              </Button>
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
              <span>
                <FormattedMessage id='apiConfig.HTTP' />
              </span>
              <span data-accessbilityid="project-api-method-select">
                <Select
                  defaultValue={this.state.method || 'ALL'}
                  value={this.state.method || 'ALL'}
                  style={{
                    width: 120,
                    marginLeft: 10,
                  }}
                  onChange={this.handleOptionChange.bind(this)}
                >
                  <Option value="ALL">ALL</Option>
                  <Option value="GET">GET</Option>
                  <Option value="POST">POST</Option>
                  <Option value="PUT">PUT</Option>
                  <Option value="DELETE">DELETE</Option>
                  <Option value="PATCH">PATCH</Option>
                </Select>
              </span>
            </div>
            <div
              data-accessbilityid="project-api-description"
              className="api-description"
            >
              <span>
                <FormattedMessage id='apiConfig.apiDescription' />
              </span>
              <Input className="des-content"
                style={{
                  marginLeft: 10,
                }}
                onBlur={this.handleDescriptionBlur.bind(this)}
                onChange={this.handleDescriptionChange.bind(this)}
                value={this.state.description}
              />
            </div>
            <div
              className="api-delay"
              data-accessbilityid="project-api-delay"
            >
              <span>
                <FormattedMessage id='apiConfig.apiDelay' />
              </span>
              <InputNumber
                style={{
                  marginLeft: 10,
                }}
                min={0}
                max={30}s
                style={{ marginRight: '5px' }}
                value={parseInt(this.state.delay, 10)}
                onBlur={this.handleDelayBlur.bind(this)}
                onChange={this.delayChange.bind(this)}
              />
              <FormattedMessage id='apiConfig.second' />
            </div>
            <div
              className="api-status-code"
              data-accessbilityid="project-api-status-code"
            >
              <span>
                <FormattedMessage id='apiConfig.statusCode' />
              </span>
              <Input
                style={{
                  marginLeft: 10,
                }}
                onChange={e => {
                  this.setState({
                    statusCode: e.target.value,
                  });
                }}
                onBlur={this.statusCodeChange}
                value={this.state.statusCode}
                maxLength="3"
              />（200 ~ 501）
            </div>
            <div
              className="response-header"
              data-accessbilityid="project-api-response-header"
            >
              <span>
                <FormattedMessage id='apiConfig.responseHeader' />
              </span>
              <Button
                size="small"
                type="primary"
                onClick={this.handleRequestHeader.bind(this)}
              >
                <FormattedMessage id='apiConfig.modifyResponseHeader' />
              </Button>

            </div>
          </section>
          <section className="data-scene">
            <h1>
              <FormattedMessage id='sceneMng.title' />
            </h1>
            <div>
              <div className="add-input">
                <Input
                  style={{ width: '200px' }}
                  data-accessbilityid="project-api-scene-input"
                  placeholder={this.props.intl.formatMessage({id: 'sceneMng.inputTip'})}
                  value={this.state.addingScene}
                  onChange={this.handleAddSceneChange.bind(this)}
                />
                <Button
                  style={{
                    marginBottom: `${this.state.sceneError ? '10px' : '0'}`,
                  }}
                  data-accessbilityid="project-api-scene-add-btn"
                  type="primary"
                  onClick={this.handleAdd.bind(this)}
                >
                  <FormattedMessage id='sceneMng.addSceneBtn' />
                </Button>
                {
                  this.state.sceneError
                    ? <Alert
                      message={this.state.sceneError.message}
                      type={this.state.sceneError.type}
                      showIcon
                    /> : null
                }
              </div>
              <RadioGroup
                name="radiogroup"
                value={this.state.currentScene}
                onChange={this.handleSceneChange.bind(this)}
              >
                {
                  this.state.scenes && this.state.scenes.map((scene, index) => {
                    return (
                      <div
                        key={scene.name}
                        style={{ display: 'inline-block' }}
                        data-accessbilityid={`project-api-scene-list-${index}`}
                      >
                        <Radio
                          className="radio-container"
                          value={scene.name}
                          key={scene.name}
                        >
                          <span className="scene-name">{ scene.name }</span>
                          <Icon
                            type="edit"
                            className="view-icon"
                            onClick={this.showModal.bind(this, index)}
                          />
                          <Popconfirm
                            title={<FormattedMessage id='common.deleteTip' />}
                            onConfirm={this.onRemoveScene.bind(this, index)}
                            okText={<FormattedMessage id='common.confirm' />}
                            cancelText={<FormattedMessage id='common.cancel' />}
                          >
                            <Icon className="delete-icon" type="delete" />
                          </Popconfirm>
                        </Radio>
                      </div>
                    );
                  })
                }
              </RadioGroup>
              <Modal
                className="codemirror-modal"
                width="80%"
                title={<FormattedMessage id='apiConfig.responseHeader' />}
                visible={this.state.responseHeaderModalVisible}
                onOk={this.responseHeaderModalOk.bind(this)}
                cancelText={this.props.intl.formatMessage({id: 'common.cancel'})}
                okText={this.props.intl.formatMessage({id: 'common.confirm'})}
                onCancel={this.responseHeaderModalCancel.bind(this)}
              >
                <CodeMirror
                  value={this.state.responseHeader}
                  options={{ ...codeMirrorOptions }}
                  onChange={this.responseHeaderModalChange.bind(this)}
                />
              </Modal>

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
            </div>
          </section>
          <section className="data-proxy">
            <h1 data-accessbilityid="project-api-proxy-title">
              <FormattedMessage id='proxyConfig.title' />
            </h1>
            <ProxyInputList
              onChangeProxy={this.handleProxyChange.bind(this)}
              proxyContent={this.state.proxyContent}
            />
          </section>

          <FieldTable
            {...this.props}
            codeMirrorOption={codeMirrorOptions}
            schemaContent={this.state.reqSchemaContent}
            type='req'
          />

          <FieldTable
            {...this.props}
            codeMirrorOption={codeMirrorOptions}
            schemaContent={this.state.resSchemaContent}
            type='res'
          />
        </content>
      </div>
    );
  }
}

export default injectIntl(DataInfo);
