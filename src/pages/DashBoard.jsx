'use strict';

import React, {
  Component,
} from 'react';

import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  Row,
  Col,
  Icon,
} from 'antd';

import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import './DashBoard.less';

import request from '../common/fetch';

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
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }

  edit () {
    this.setState({ editable: true });
  }

  render () {
    const { value, editable } = this.state;
    return (
      <div className="editable-cell">
        {
          editable
            ? <div className="editable-cell-input-wrapper">
              <Input
                value={value}
                style={{ width: '200px' }}
                onChange={this.handleChange.bind(this)}
                onPressEnter={this.check.bind(this)}
              />
              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check.bind(this)}
              />
            </div>
            : <div className="editable-cell-text-wrapper">
              {value || ' '}
              <Icon
                type="edit"
                className="editable-cell-icon"
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

  render () {
    const columns = [{
      title: this.props.intl.formatMessage({id: 'dashboard.tableId'}),
      dataIndex: 'identifer',
      width: '20%',
      key: 'identifer',
      render: text => <a href={`/project/${text}`}>{text}</a>,
    }, {
      title: this.props.intl.formatMessage({id: 'dashboard.tableDescription'}),
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => (
        <EditableCell
          value={text}
          onChange={value => this.onCellChange(value, record.identifer)}
        />
      ),
    }, {
      title: this.props.intl.formatMessage({id: 'dashboard.tableOperation'}),
      dataIndex: 'operation',
      key: 'operation',
      width: '100px',
      render: (text, record, index) => {
        return (
          <Popconfirm title={this.props.intl.formatMessage({id: 'common.deleteTip'})} onConfirm={this.handleDelete.bind(this, index)} okText={this.props.intl.formatMessage({id: 'common.confirm'})} cancelText={this.props.intl.formatMessage({id: 'common.cancel'})}>
            <Button
              className="project-delete-button"
              type="danger"
              ghost
            ><FormattedMessage id='common.delete' /></Button>
          </Popconfirm>
        );
      },
    }];

    return (
      <div className="dashboard">
        <Row type="flex" justify="center">
          <Col span="20">
            <Button
              type="primary"
              className="dashboard-add-button"
              onClick={this.showModal.bind(this)}
            >
              <FormattedMessage id='dashboard.tableAdd' />
            </Button>
          </Col>
          <Col span="20">
            <Table columns={columns} dataSource={this.state.listData} size="middle" className="dashboard-table"/>
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
