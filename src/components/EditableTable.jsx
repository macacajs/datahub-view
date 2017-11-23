'use strict';

import React from 'react';
import {
  Table,
  Input,
  Icon,
  Button,
  Popconfirm
} from 'antd';

import './EditableTable.less';

const data = [];
for (let i = 0; i < 3; i++) {
  data.push({
    key: i.toString(),
    field: '字段名',
    require: 'false',
    type: 'String',
    description: '描述',
  });
}

const EditableCell = ({
  editable,
  value,
  onChange
}) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.params
    };
    this.columns = [{
      title: '字段',
      dataIndex: 'field',
      width: '20%',
      render: (text, record) => this.renderColumns(text, record, 'field'),
    }, {
      title: '类型',
      dataIndex: 'type',
      width: '15%',
      render: (text, record) => this.renderColumns(text, record, 'type'),
    }, {
      title: '必选',
      dataIndex: 'require',
      width: '10%',
      render: (text, record) => this.renderColumns(text, record, 'require'),
    }, {
      title: '说明',
      dataIndex: 'description',
      width: '45%',
      render: (text, record) => this.renderColumns(text, record, 'description'),
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        const { editable } = record;
        return (
          <div className="editable-row-operations">
            {
              editable ?
                <span>
                  <a onClick={() => this.save(record.key)}>保存</a>
                  <Popconfirm title="确定取消?" onConfirm={() => this.cancel(record.key)}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                :
                <span>
                  <a onClick={() => this.edit(record.key)}>编辑</a>
                  <Popconfirm title="确定删除？" onConfirm={() => this.onDelete(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              }
          </div>
        );
      },
    }];
    this.cacheData = data.map(item => ({ ...item }));
  }
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }
  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  _guid() {
    return 'xxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  onDelete(key) {
    const dataSource = [...this.state.data];
    const allParams = dataSource.filter(item => item.key !== key)
    this.setState({ data: allParams });
    tihs.props.onParamsChange(allParams)
  }
  handleAdd() {
    const data = [...this.state.data];
    const newData = {
      key: this._guid(),
      editable: true,
      field: '',
      require: '',
      type: '',
      description: '',
    };
    const allParams = [...data, newData]
    this.setState({
      data: allParams,
    });
  }
  edit(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }
  save(key) {
    const allParams = [...this.state.data];
    const target = allParams.filter(item => key === item.key)[0];
    if (target) {
      delete target.editable;
      this.setState({
        data: allParams,
      });
      this.cacheData = allParams.map(item => ({ ...item }));
    }
    this.props.onParamsChange(allParams);
  }
  cancel(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
      delete target.editable;
      this.setState({
        data: newData,
      });
    }
  }
  render() {
    return (
      <div className="editabletable">
        <Table bordered dataSource={this.state.data} columns={this.columns} />
        <Button type="primary" className="editable-add-btn" onClick={this.handleAdd.bind(this)}>新增字段</Button>
      </div>
    );
  }
}
