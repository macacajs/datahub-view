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

import {
  projectService,
} from '../service';

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
    title={formatMessage('project.create')}
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
      <FormItem label={formatMessage('project.name')}>
        {getFieldDecorator('projectName', {
          rules: [
            {
              required: true,
              message: formatMessage('project.name.invalid'),
              pattern: /^[a-z0-9_-]+$/,
            },
          ],
        })(
          <Input />
        )}
      </FormItem>
      <FormItem label={formatMessage('project.description')}>
        {getFieldDecorator('description', {
          rules: [
            {
              required: true,
              message: formatMessage('project.description.invalid'),
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
  };

  formatMessage = id => this.props.intl.formatMessage({ id });

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

  renderProjectList () {
    const formatMessage = this.formatMessage;
    const { listData } = this.state;
    return listData.map((item, index) => {
      return <Col span={8} key={index}>
        <div className="content">
          <Card
            title={item.description}
            data-accessbilityid={`dashboard-content-card-${index}`}
            bordered={false}
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
                    <Icon type="file" />{item.capacity && item.capacity.count}
                    <Icon type="hdd" />{item.capacity && item.capacity.size}
                  </span>
                </Col>
                <Col span={2} style={{ textAlign: 'right' }}>
                  <Popconfirm
                    title={formatMessage('common.deleteTip')}
                    onConfirm={() => this.deleteProject(item.uniqId)}
                    okText={formatMessage('common.confirm')}
                    cancelText={formatMessage('common.cancel')}
                  >
                    <Icon className="delete-icon" type="delete" />
                  </Popconfirm>
                </Col>
              </Row>
            </Row>
          </Card>
        </div>
      </Col>;
    });
  }

  render () {
    return (
      <div className="dashboard">
        <Row type="flex" justify="center">
          <Col span="22">
            <Row>
              { this.renderProjectList() }
              <Col span={8}>
                <div className="content">
                  <Card
                    title={<FormattedMessage id='project.add' />}
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
