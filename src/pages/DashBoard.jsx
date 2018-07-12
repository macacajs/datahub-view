'use strict';

import React, {
  Component,
} from 'react';

import {
  Modal,
  Form,
  Input,
  Popconfirm,
  Row,
  Col,
  Icon,
  Card,
  message,
} from 'antd';

import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import './DashBoard.less';

import 'whatwg-fetch';
import request from '../common/fetch';
import _ from '../common/helper';

const FormItem = Form.Item;

class EditableCell extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      value: this.props.value,
      editable: false,
    };
  }

  componentWillReceiveProps (props) {
    this.setState({
      value: props.value,
    });
  }

  handleChange (e) {
    const value = e.target.value;
    this.setState({
      value,
    });
  }

  check () {
    this.setState({
      editable: false,
    });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }

  edit () {
    this.setState({
      editable: true,
    });
  }

  render () {
    const {
      value,
      editable,
    } = this.state;
    return (
      <div className="editable-cell">
        {
          editable
            ? <div className="input-wrapper">
              <Input
                value={value}
                style={{
                  width: '80%',
                }}
                onChange={this.handleChange.bind(this)}
                onPressEnter={this.check.bind(this)}
              />
              <Icon
                type="check"
                className="icon-check"
                onClick={this.check.bind(this)}
              />
            </div>
            : <div className="text-wrapper">
              {value || ' '}
              <Icon
                type="edit"
                className="icon"
                onClick={this.edit.bind(this)}
              />
            </div>
        }
      </div>
    );
  }
}

class CollectionForm extends Component {
  render () {
    const {
      visible,
      onCancel,
      onCreate,
      form,
      loading,
    } = this.props;
    const {
      getFieldDecorator,
    } = form;
    const formatMessage = this.props.intl.formatMessage;
    return (
      <Modal
        visible={visible}
        title={this.props.intl.formatMessage({id: 'dashboard.modalTile'})}
        okText="Create"
        onCancel={onCancel}
        onOk={onCreate}
        cancelText={this.props.intl.formatMessage({id: 'common.cancel'})}
        confirmLoading={loading}
      >
        <Form layout="vertical">
          <FormItem label={formatMessage({id: 'dashboard.modalName'})}>
            {getFieldDecorator('projectName', {
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'dashboard.modalNameTip',
                  }),
                  pattern: /^[A-Za-z0-9]+$/,
                },
              ],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label={formatMessage({
            id: 'dashboard.modalDescription',
          })}>
            {getFieldDecorator('description', {
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'dashboard.modalDescriptionTip',
                  }),
                },
              ],
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const CollectionCreateForm = Form.create()(injectIntl(CollectionForm));

class DashBoard extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      context: window.context,
      visible: false,
      loading: false,
      listData: [],
      sizeMap: {},
    };
  }

  showModal () {
    this.setState({
      visible: true,
    });
  }

  handleCancel () {
    this.setState({
      visible: false,
    });
  }

  handleCreate () {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.setState({
        loading: true,
      });

      _.logger('Received values of form: ', values);

      request('/api/project', 'POST', values)
        .then((res) => {
          form.resetFields();
          this.setState({
            visible: false,
            loading: false,
          });

          if (res.success) {
            message.success('create project success');
            this.updateProjects();
          } else {
            message.error('create project fail');
          }
        });
    });
  }

  handleDelete (uniqId) {
    request(`/api/project/${uniqId}`, 'DELETE')
      .then((res) => {
        _.logger('/api/project DELETE', res);
        if (res.success) {
          message.success('delete project success');
          this.updateProjects();
        } else {
          message.error('delete project fail');
        }
      });
  }

  saveFormRef (form) {
    this.form = form;
  }

  updateProjects () {
    request('/api/project').then((res) => {
      if (res) {
        res.forEach((item, index) => {
          item.key = index;
        });
        this.setState({
          listData: res,
        });
        _.logger('/api/project GET', res);
      } else {
        message.error('update project success');
      }
    });
  }

  componentWillMount () {
    this.updateProjects();
  }

  onCellChange (payload, uniqId) {
    request(`/api/project/${uniqId}`, 'PUT', {
      projectName: payload.projectName,
      description: payload.description,
    }).then((res) => {
      _.logger('/api/project PUT', res);
      if (res.success) {
        message.success('update project success');
      } else {
        message.error('update project fail');
      }
    });
  }

  fetchApiNumber (uniqId) {
    if (this.state.sizeMap[uniqId]) {
      return;
    }
    fetch(`/api/interface?projectUniqId=${uniqId}`)
      .then(res => {
        if (res.ok) {
          const size = parseInt(res.headers.get('Content-length') || 0, 10);
          const sizeStr = size >= 1024 ? `${(size / 1024).toFixed(2)}KB` : `${size}B`;
          res.json().then(d => {
            if (d.success) {
              const obj = Object.assign({}, this.state.sizeMap);
              const json = {
                [uniqId]: {
                  size: sizeStr,
                  number: d.data.length || 0,
                },
              };
              this.setState({
                sizeMap: Object.assign(obj, json),
              });
            }
          });
          return res;
        } else {
          throw new Error('Network Errror');
        }
      });
  }

  render () {
    return (
      <div className="dashboard">
        <Row type="flex" justify="center">
          <Col span="22">
            <Row>
              {
                this.state.listData.map((item, i) => {
                  this.fetchApiNumber(item.uniqId);
                  const editor = <EditableCell
                    value={item.description}
                    onChange={value => this.onCellChange({ description: value }, item.uniqId)}
                  />;

                  return (
                    <Col span={8} key={i}>
                      <div className="content">
                        <Card
                          title={ editor }
                          data-accessbilityid={`dashboard-content-card-${i}`}
                          bordered={ false }
                          style={{ color: '#000' }}
                        >
                          <Row type="flex">
                            <Col span={24} className="main-icon">
                              <a href={`/project/${item.projectName}`} target="_blank">
                                <Icon type="inbox" />
                              </a>
                            </Col>
                            <Row type="flex" className="sub-info">
                              <Col span={22} key={item.projectName}>
                                {item.projectName}
                                <span className="main-info">
                                  <Icon type="file" />
                                  {
                                    this.state.sizeMap[item.uniqId]
                                      ? this.state.sizeMap[item.uniqId].number
                                      : null
                                  }
                                  <Icon type="hdd" />
                                  {
                                    this.state.sizeMap[item.uniqId]
                                      ? this.state.sizeMap[item.uniqId].size
                                      : null
                                  }
                                </span>
                              </Col>
                              <Col span={2} style={{textAlign: 'right'}}>
                                <Popconfirm
                                  title={this.props.intl.formatMessage({id: 'common.deleteTip'})}
                                  onConfirm={this.handleDelete.bind(this, item.uniqId)}
                                  okText={this.props.intl.formatMessage({id: 'common.confirm'})}
                                  cancelText={this.props.intl.formatMessage({id: 'common.cancel'})}
                                >
                                  <Icon className="delete-icon" type="delete" />
                                </Popconfirm>
                              </Col>
                            </Row>
                          </Row>
                        </Card>
                      </div>
                    </Col>
                  );
                })
              }
              <Col span={8}>
                <div className="content">
                  <Card
                    title={<FormattedMessage id='dashboard.tableAdd' />}
                    bordered={ false }
                    style={{ color: '#000' }}
                  >
                    <Row type="flex">
                      <Col span={24} className="main-icon">
                        <Icon
                          data-accessbilityid="dashboard-folder-add"
                          onClick={this.showModal.bind(this)}
                          type="folder-add"
                        />
                      </Col>
                      <Row type="flex" className="sub-info blank">
                      </Row>
                    </Row>
                  </Card>
                </div>
              </Col>
            </Row>
          </Col>
          <CollectionCreateForm
            ref={this.saveFormRef.bind(this)}
            visible={this.state.visible}
            onCancel={this.handleCancel.bind(this)}
            onCreate={this.handleCreate.bind(this)}
            loading={this.state.loading}
          />
        </Row>
      </div>
    );
  }
}

export default injectIntl(DashBoard);
