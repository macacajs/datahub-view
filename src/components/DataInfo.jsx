'use strict';

import './DataInfo.less';

import React from 'react';

import {
  UnControlled as CodeMirror
} from 'react-codemirror2';

import {
  Alert,
  Button,
  Select,
  Radio,
  Input,
  Modal,
  Popconfirm,
  Breadcrumb,
  InputNumber,
  Checkbox,
  Tooltip
} from 'antd';

import _ from '../common/helper';
import CustomTable from './CustomTable';
import ProxyInputList from './ProxyInputList';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

const Option = Select.Option;
const RadioGroup = Radio.Group;

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
  autofocus: true
};

export default class DataInfo extends React.Component {
  constructor(props) {
    super(props);
    const currentData = props.currentData;

    this.state = {
      addingScene: '',
      modalVisible: false,
      modalInfoTitle: '',
      modalInfoData: '',
      _modalInfoData: '',
      schemaModalVisible: false,
      schemaJSONParseError: false,
      schemaNewData: '',
      schemaData: [],
      enableSchemaValidate: false,
      proxyContent: currentData && currentData.proxyContent,
      scenes: currentData && currentData.scenes,
      method: currentData && currentData.method,
      delay: currentData && currentData.delay,
      pathname: currentData && currentData.pathname,
      description: currentData && currentData.description,
      currentScene: currentData && currentData.currentScene,
      cursorPos: null
    };
  }

  componentWillReceiveProps(props) {
    const currentData = props.currentData;

    if (!currentData) {
      return;
    }

    let schemaContent = {};

    if (currentData && currentData.params) {
      schemaContent = JSON.parse(currentData.params);
    }

    this.setState({
      proxyContent: currentData && currentData.proxyContent,
      scenes: currentData && currentData.scenes,
      schemaData: schemaContent.schemaData,
      enableSchemaValidate: schemaContent.enableSchemaValidate,
      method: currentData && currentData.method,
      delay: currentData && currentData.delay,
      pathname: currentData && currentData.pathname,
      currentScene: currentData && currentData.currentScene,
      description: currentData && currentData.description
    });
  }

  handleAdd() {
    const index = _.findIndex(this.state.scenes, o => o.name === this.state.addingScene);

    if (index !== -1) {
      alert('场景名称已存在！');
      return;
    }

    if (!this.state.addingScene) {
      alert('场景名不能为空！');
      return;
    }
    const newScene = {
      name: this.state.addingScene,
      data: '{}'
    };

    if (!this.state.scenes) {
      this.setState({
        scenes: []
      });
    }
    const newData = [...this.state.scenes, newScene];
    this.setState({
      scenes: newData,
      currentScene: this.state.addingScene,
      modalInfoData: '',
      _modalInfoData: ''
    });
    this.props.handleAsynSecType('scenes', newData);
    this.props.handleAsynSecType('currentScene', this.state.addingScene);
  }

  handleAddSceneChange(e) {
    this.setState({
      addingScene: e.target.value
    });
  }

  onConfirmRemoveScene(index) {
    const newData = [...this.state.scenes];
    newData.splice(index, 1);

    if (this.state.scenes[index].name === this.state.currentScene && this.state.scenes.length) {
      if (index > 0) {
        this.setState({
          scenes: newData,
          currentScene: this.state.scenes[0].name
        });
        this.props.handleAsynSecType('currentScene', this.state.scenes[0].name);
      } else if (this.state.scenes.length > 1) {
        this.setState({
          scenes: newData,
          currentScene: this.state.scenes[1].name
        });
        this.props.handleAsynSecType('currentScene', this.state.scenes[1].name);
      }
    } else {
      this.setState({
        scenes: newData
      });
    }
    this.props.handleAsynSecType('scenes', newData);
  }

  showModal(index) {
    const str = JSON.stringify(JSON.parse(this.state.scenes[index].data), null, 2);
    this.setState({
      modalVisible: true,
      modalInfoTitle: this.state.scenes[index].name,
      modalInfoData: str.trim(),
      _modalInfoData: str.trim()
    });
  }

  handleModalOk(e) {
    try {
      JSON.parse(this.state._modalInfoData);
    } catch (e) {
      console.log('invalid json string');
      return;
    }
    const index = _.findIndex(this.state.scenes, o => o.name === this.state.modalInfoTitle);
    const updateScene = {
      name: this.state.modalInfoTitle,
      data: this.state._modalInfoData
    };
    const newData = [...this.state.scenes];
    newData.splice(index, 1, updateScene);
    this.setState({
      modalVisible: false,
      scenes: newData
    });
    this.props.handleAsynSecType('scenes', newData);
  }

  handleModalCancel() {
    this.setState({
      modalVisible: false
    });
  }

  modalTextAreaChange(editor, data, value) {
    this.setState({
      _modalInfoData: value
    });
  }

  handleOptionChange(value) {
    this.setState({
      method: value
    });
    this.props.handleAsynSecType('method', value);
  }

  handleSceneChange(e) {
    this.setState({
      currentScene: e.target.value
    });
    this.props.handleAsynSecType('currentScene', e.target.value);
  }

  handleDescriptionChange(e) {
    this.setState({
      description: e.target.value
    });
  }

  handleDescriptionBlur(e) {
    this.props.handleAsynSecType('description', e.target.value);
  }

  delayChange(value) {
    value = parseInt(value, 10);
    this.setState({
      delay: value
    });
    this.props.handleAsynSecType('delay', value);
  }

  handleProxyChange(value) {
    this.setState({
      proxyContent: value
    });
    this.props.handleAsynSecType('proxyContent', value);
  }

  editSchema() {
    this.setState({
      schemaModalVisible: true,
      schemaJSONParseError: false,
      schemaNewData: JSON.stringify(this.state.schemaData, null, 2)
    });
  }

  schemaModalTextAreaChange(editor, data, value) {
    this.setState({
      schemaNewData: value.trim(),
      schemaJSONParseError: false
    });
  }

  confirmSchameModal() {
    try {
      const newData = JSON.parse(this.state.schemaNewData);
      this.setState({
        schemaModalVisible: false
      });
      this.props.handleAsynSecType('params', JSON.stringify({
        enableSchemaValidate: this.state.enableSchemaValidate,
        schemaData: newData
      }));
    } catch (e) {
      this.setState({
        schemaJSONParseError: true
      });
    }
  }

  toggleSchemaValidate(e) {
    this.props.handleAsynSecType('params', JSON.stringify({
      enableSchemaValidate: e.target.checked,
      schemaData: this.state.schemaData
    }));
  }

  cancelSchameModal() {
    this.setState({
      schemaModalVisible: false,
      schemaJSONParseError: false,
      schemaNewData: ''
    });
  }

  render() {
    const projectId = window.pageConfig.projectId;
    const apiHref = `http://${location.host}/data/${projectId}/${this.state.pathname}`;

    return (
      <div className="datainfo">
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/dashboard">所有项目</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            { this.state.description ? this.state.description : this.state.pathname }
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            项目配置
          </Breadcrumb.Item>
        </Breadcrumb>
        <content>
          <section className="base-info">
            <h1>接口配置</h1>
            <a href={`/doc/${projectId}`} target="_blank">
              <Button className="right-button" type="primary">接口文档</Button>
            </a>
            <div className="mock-address">
              <span>接口名：</span>
              <a target="_blank" href={apiHref}>
                <Tooltip placement="top" title={`场景：${this.state.currentScene || 'default'}`}>
                  <span className="project-api">
                    {`${this.state.pathname}`} | {`${this.state.currentScene || 'default'}`}
                  </span>
                </Tooltip>
              </a>
            </div>
            <div>
              <span>HTTP Method:</span>
              <Select defaultValue={this.state.method} value={this.state.method} style={{ width: 120, marginLeft: 10 }} onChange={this.handleOptionChange.bind(this)}>
                <Option value="ALL">ALL</Option>
                <Option value="GET">GET</Option>
                <Option value="POST">POST</Option>
                <Option value="PUT">PUT</Option>
                <Option value="DELETE">DELETE</Option>
                <Option value="PATCH">PATCH</Option>
              </Select>
            </div>
            <div className="api-description">
              <span>接口说明：</span>
              <Input className="des-content" onBlur={this.handleDescriptionBlur.bind(this)} onChange={this.handleDescriptionChange.bind(this)} value={this.state.description}></Input>
            </div>
            <div className="api-delay">
              <span>接口延迟：</span>
              <InputNumber min={0} max={5} defaultValue={0} onChange={this.delayChange} /> 秒
            </div>
          </section>
          <section className="data-scene">
            <h1>场景管理</h1>
            <div>
              <div className="add-input">
                <Input style={{ width: '200px' }} placeholder="输入场景名" onChange={this.handleAddSceneChange.bind(this)} />
                <Button type="primary" onClick={this.handleAdd.bind(this)}>新增场景</Button>
              </div>
              <RadioGroup name="radiogroup" value={this.state.currentScene} onChange={this.handleSceneChange.bind(this)}>
                {
                  this.state.scenes && this.state.scenes.map((scene, index) => {
                    return (
                      <Radio value={scene.name} key={scene.name}>
                        <span>{ scene.name }</span>
                        <Button size="small" onClick={this.showModal.bind(this, index)}>查看</Button>
                        <Popconfirm title="确定删除？" onConfirm={this.onConfirmRemoveScene.bind(this, index)} okText="确定" cancelText="取消">
                          <Button type="danger" size="small" >删除</Button>
                        </Popconfirm>
                      </Radio>
                    );
                  })
                }
              </RadioGroup>
              <Modal
                width="80%"
                title={`scene: ${this.state.modalInfoTitle}`}
                visible={this.state.modalVisible}
                onOk={this.handleModalOk.bind(this)}
                onCancel={this.handleModalCancel.bind(this)}
              >
                <CodeMirror
                  value={this.state.modalInfoData}
                  options={{ ...codeMirrorOptions }}
                  onChange={this.modalTextAreaChange.bind(this)}
                />
              </Modal>
              <Modal
                width="80%"
                title="schame"
                visible={this.state.schemaModalVisible}
                onOk={this.confirmSchameModal.bind(this)}
                onCancel={this.cancelSchameModal.bind(this)}
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
            <h1>代理配置</h1>
            <ProxyInputList
              onChangeProxy={this.handleProxyChange.bind(this)}
              proxyContent={this.state.proxyContent}
            />
          </section>
          <section className="params-doc">
            <h1>字段描述</h1>
            <Checkbox
              checked={this.state.enableSchemaValidate}
              onChange={this.toggleSchemaValidate.bind(this)}
            >
              是否开启校验
            </Checkbox>
            <Button size="small" type="primary" onClick={this.editSchema.bind(this)}>编辑</Button>
            <CustomTable
              className="schema-table"
              schemaData={this.state.schemaData}
            />
          </section>
        </content>
      </div>
    );
  }
}
