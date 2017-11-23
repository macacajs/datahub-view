'use strict';

import React from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Row,
} from 'antd';

import './DashBoard.less';

const request = require('../common/fetch');

const FormItem = Form.Item;

const CollectionCreateForm = Form.create()((props) => {
  const {
    visible,
    onCancel,
    onCreate,
    form,
    loading
  } = props;
  const {
    getFieldDecorator
  } = form;
  return (
    <Modal
      visible={visible}
      title="创建新的项目"
      okText="Create"
      onCancel={onCancel}
      onOk={onCreate}
      confirmLoading={loading}
    >
      <Form layout="vertical">
        <FormItem label="项目名称">
          {getFieldDecorator('identifer', {
            rules: [{ required: true, message: '请输入不为空的中文或者数字', pattern: /^[A-Za-z0-9]+$/ }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="项目描述">
          {getFieldDecorator('description', {
            rules: [{ required: true, message: '请输入不为空的中文或者数字', pattern: /^[A-Za-z0-9]+$/}],
          })(
            <Input />
          )}
        </FormItem>
      </Form>
    </Modal>
  );
});

export default class DashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      context: window.context,
      visible: false,
      loading: false,
      listData: [],
    };
  }

  showModal() {
    this.setState({
      visible: true,
    });
  }

  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  handleCreate() {
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
          console.log('res', res)
          form.resetFields();
          this.setState({
            visible: false,
            loading: false
          });

          if (res.success) {
            this.updateProjects();
          }
        });
    });
  }

  handleDelete(key) {
    request('/api/project', 'DELETE', {
      identifer: this.state.listData[key].identifer
    }).then((res) => {
      console.log(res);
      if(res.success) {
        this.updateProjects();
      }
    });
  }

  saveFormRef(form) {
    this.form = form;
  }

  updateProjects() {
    request('/api/project').then((res) => {
      res && res.forEach((item, index) => {
        item.key = index;
      });
      this.setState({
        listData: res,
      });
    })
  }

  componentWillMount() {
    this.updateProjects();
  }

  render() {
    const columns = [{
      title: '项目ID',
      dataIndex: 'identifer',
      key: 'identifer',
      render: text => <a href={`/project/${text}`}>{text}</a>,
    }, {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: '100px',
      render: (text, record, index)=> {
        return (
          <Button type="primary" className="project-delete-button" onClick={this.handleDelete.bind(this, index)}>删除</Button>
        );
      }
    }];

    return (
      <div className="dashboard">
        <Row className="dashboard-toolbar-row" type="flex" justify="end">
          <Button type="primary" className="dashboard-add-button" onClick={this.showModal.bind(this)}>添加项目</Button>
        </Row>
        <Row className="dashboard-table-row" type="flex" justify="center">
          <Table columns={columns} dataSource={this.state.listData} size="middle" className="dashboard-table"/>
        </Row>
        <CollectionCreateForm
          ref={this.saveFormRef.bind(this)}
          visible={this.state.visible}
          onCancel={this.handleCancel.bind(this)}
          onCreate={this.handleCreate.bind(this)}
          loading={this.state.loading}
        />
      </div>
    );
  }
}
