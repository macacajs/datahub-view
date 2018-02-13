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
} from 'antd';

import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import './DashBoard.less';

import request, {
  fetch,
} from '../common/fetch';

const FormItem = Form.Item;

class EditableCell extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      value: this.props.value,
      editable: false,
    };
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
            {getFieldDecorator('identifer', {
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

      console.log('Received values of form: ', values);

      request('/api/project', 'POST', values)
        .then((res) => {
          form.resetFields();
          this.setState({
            visible: false,
            loading: false,
          });

          if (res.success) {
            this.updateProjects();
          }
        });
    });
  }

  handleDelete (key) {
    request('/api/project', 'DELETE', {
      identifer: this.state.listData[key].identifer,
    }).then((res) => {
      console.log(res);
      if (res.success) {
        this.updateProjects();
      }
    });
  }

  saveFormRef (form) {
    this.form = form;
  }

  updateProjects () {
    request('/api/project').then((res) => {
      res && res.forEach((item, index) => {
        item.key = index;
      });
      this.setState({
        listData: res,
      });
    });
  }

  componentWillMount () {
    this.updateProjects();
  }

  onCellChange (value, projectId) {
    request('/api/project', 'POST', {
      identifer: projectId,
      description: value,
    }).then((res) => {
      console.log('res', res);
    });
  }

  fetchApiNumber (identifer) {
    if (this.state.sizeMap[identifer]) {
      return;
    }
    fetch(`/api/data/${identifer}`)
      .then(res => {
        if (res.ok) {
          const size = parseInt(res.headers.get('Content-length') || 0, 10);
          const sizeStr = size >= 1024 ? `${(size / 1024).toFixed(2)}KB` : `${size}B`;
          res.json().then(d => {
            if (d.success) {
              const obj = Object.assign({}, this.state.sizeMap);
              const json = {
                [identifer]: {
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
                  this.fetchApiNumber(item.identifer);
                  const editor = <EditableCell
                    value={item.description}
                    onChange={value => this.onCellChange(value, item.identifer)}
                  />;

                  return (
                    <Col span={8} key={i}>
                      <div className="content">
                        <Card
                          title={ editor }
                          bordered={ false }
                          style={{ color: '#000' }}
                        >
                          <Row type="flex">
                            <Col span={24} className="main-icon">
                              <a href={`/project/${item.identifer}`} target="_blank">
                                <Icon type="inbox" />
                              </a>
                            </Col>
                            <Row type="flex" className="sub-info">
                              <Col span={22} key={item.identifer}>
                                {item.identifer}
                                <span className="main-info">
                                  <Icon type="file" />
                                  {
                                    this.state.sizeMap[item.identifer]
                                      ? this.state.sizeMap[item.identifer].number
                                      : null
                                  }
                                  <Icon type="hdd" />
                                  {
                                    this.state.sizeMap[item.identifer]
                                      ? this.state.sizeMap[item.identifer].size
                                      : null
                                  }
                                </span>
                              </Col>
                              <Col span={2} style={{textAlign: 'right'}}>
                                <Popconfirm
                                  title={this.props.intl.formatMessage({id: 'common.deleteTip'})}
                                  onConfirm={this.handleDelete.bind(this, i)}
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
