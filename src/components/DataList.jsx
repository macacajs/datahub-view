'use strict';

import React from 'react';
import {
  Input,
  Button,
  Modal,
  Popconfirm,
  Row,
  Col
} from 'antd';
import _ from 'lodash';

import './DataList.less';

const Search = Input.Search;

export default class DataList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalTitle: '',
      modalDescription: '',
      apis: props.apis
    };
  }

  componentDidMount() {
    this.handleApiClick(0);
  }

  componentWillReceiveProps(props) {
    const apis = props.apis;
    this.setState({
      apis
    });
  }

  handleAdd() {
    this.setState({
      modalVisible: true,
      modalTitle: '',
      modalDescription: ''
    });
  }

  modalTitleChange(e) {
    this.setState({
      modalTitle: e.target.value
    });
  }

  modalDescriptionChange(e) {
    this.setState({
      modalDescription: e.target.value
    });
  }

  handleModalOk(e) {
    const index = _.findIndex(this.state.apis, o => o.pathname === this.state.modalTitle);
    if (index !== -1) {
      alert('接口名称已存在！');
      return;
    }
    if (!this.state.modalTitle || !this.state.modalDescription) {
      alert('接口名称和描述不能为空！');
      return;
    }
    const addAPI = {
      pathname: this.state.modalTitle,
      description: this.state.modalDescription
    };
    const newData = [...this.state.apis, addAPI];
    this.setState({
      modalVisible: false
    });
    this.props.handleAddApi(newData, addAPI);
  }

  handleModalCancel() {
    this.setState({
      modalVisible: false
    });
  }

  onConfirmRemoveApi(index) {
    const newData = [...this.state.apis];
    const deleteApi = newData.splice(index, 1)[0];
    console.log('deleteApi', deleteApi);
    this.props.handleDeleteApi(newData, deleteApi);
  }

  handleApiClick(index) {
    this.props.handleApiClick(index);
    const lists = document.querySelectorAll('.datalist li');
    [].slice.call(lists).forEach((item, i) => {
      item.setAttribute('class', '');
      if (i === index) {
        item.setAttribute('class', 'clicked');
      }
    });
  }

  render() {
    return (
      <div className="datalist">
        <Row>
          <Col span={16}>
            <Search
              disabled
              placeholder="Search interface"
              style={{ width: '100%' }}
              onSearch={value => console.log(value)}
            />
          </Col>
          <Col span={8} push={1}>
            <Button type="primary" onClick={this.handleAdd.bind(this)}>添加接口</Button>
          </Col>
        </Row>
        <ul>
          {
            this.state.apis && this.state.apis.map((api, index) => {
              return (
                <li key={index} onClick={this.handleApiClick.bind(this, index)}>
                  <div className="left">
                    <h3>{api.pathname}</h3>
                    <p>{api.description}</p>
                  </div>
                  <div className="right">
                    <Popconfirm title="确定删除？" onConfirm={this.onConfirmRemoveApi.bind(this, index)} okText="确定" cancelText="取消">
                      <Button type="danger">删除</Button>
                    </Popconfirm>
                  </div>
                </li>
              );
            })
          }
        </ul>
        <Modal
          title="添加接口"
          visible={this.state.modalVisible}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
        >
          <Input
            placeholder="请输入接口名"
            onChange={this.modalTitleChange.bind(this)}
            value={this.state.modalTitle} />
          <Input
            placeholder="请输入接口描述"
            style={{ marginTop: '10px' }}
            onChange={this.modalDescriptionChange.bind(this)}
            value={this.state.modalDescription} />
        </Modal>
      </div>
    );
  }
}
