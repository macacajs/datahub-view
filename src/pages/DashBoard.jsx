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

import 'whatwg-fetch';

import request from '../common/request';
import { projectService } from '../service';

import './DashBoard.less';

const FormItem = Form.Item;

function CreateProjectComponent (props) {
  const {
    visible,
    onCancel,
    onOk,
    form,
    loading,
  } = props;
  const {
    getFieldDecorator,
  } = form;
  const formatMessage = id => props.intl.formatMessage({ id });
  return <Modal
    visible={visible}
    title={formatMessage('dashboard.modalTile')}
    okText={formatMessage('common.confirm')}
    cancelText={formatMessage('common.cancel')}
    onCancel={() => {
      onCancel();
      props.form.resetFields();
    }}
    onOk={() => {
      form.validateFields((err, values) => {
        if (err) {
          message.warn(formatMessage('common.input.invalid'));
          return;
        }
        onOk(values, () => {
          props.form.resetFields();
        });
      });
    }}
    confirmLoading={loading}
  >
    <Form layout="vertical">
      <FormItem label={formatMessage('dashboard.modalName')}>
        {getFieldDecorator('projectName', {
          rules: [
            {
              required: true,
              message: formatMessage('dashboard.modalNameTip'),
              pattern: /^[a-z0-9_-]+$/,
            },
          ],
        })(
          <Input />
        )}
      </FormItem>
      <FormItem label={formatMessage('dashboard.modalDescription')}>
        {getFieldDecorator('description', {
          rules: [
            {
              required: true,
              message: formatMessage('dashboard.modalDescriptionTip'),
            },
          ],
        })(
          <Input />
        )}
      </FormItem>
    </Form>
  </Modal>;
}

const CreateProjectForm = Form.create()(injectIntl(CreateProjectComponent));

class DashBoard extends Component {
  state = {
    context: window.context,
    visible: false,
    loading: false,
    listData: [],
    sizeMap: {},
  };

  async componentWillMount () {
    await this.updateProjects();
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  cancelCreateProject = () => {
    this.setState({
      visible: false,
    });
  }

  createProject = async (values, callback = () => {}) => {
    this.setState({
      loading: true,
    });

    const res = await projectService.createProject({
      projectName: values.projectName,
      description: values.description,
    });

    this.setState({
      loading: false,
    });

    if (res.success) {
      this.setState({
        visible: false,
      }, () => {
        callback();
        this.updateProjects();
      });
    }
  }

  deleteProject = async (uniqId) => {
    await projectService.deleteProject({ uniqId });
    await this.updateProjects();
  }

  updateProjects = async () => {
    const res = await projectService.getProjectList();
    this.setState({
      listData: res.data || [],
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
                  return (
                    <Col span={8} key={i}>
                      <div className="content">
                        <Card
                          title={item.description}
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
                                  onConfirm={() => this.deleteProject(item.uniqId)}
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
                          onClick={this.showModal}
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
          <CreateProjectForm
            visible={this.state.visible}
            onCancel={this.cancelCreateProject}
            onOk={this.createProject}
            loading={this.state.loading}
          />
        </Row>
      </div>
    );
  }
}

export default injectIntl(DashBoard);
