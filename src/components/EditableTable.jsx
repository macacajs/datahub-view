'use strict';

import React from 'react';
import {
  Table,
  Input,
  Button,
  Popconfirm
} from 'antd';

import './EditableTable.less';

const data = [];

const obj = [{
  field: 'name',
  type: 'string',
  require: true,
  description: 'description1',
  children: [
    {
      field: 'name2',
      type: 'string',
      require: false,
      description: 'description2',
      children: [
        {
          field: 'name4',
          type: 'string',
          require: false,
          description: 'description4'
        },
        {
          field: 'name6',
          type: 'string',
          require: false,
          description: 'description4'
        }
      ]
    }, {
      field: 'name3',
      type: 'string',
      require: false,
      description: 'description3',
      children: [
      ]
    }
  ]
}];

const genList = (data) => {
  const res = [];
  let level = -1;

  const walker = (data) => {
    level++;
    data.forEach(item => {
      const {
        field,
        type,
        require,
        description,
        children
      } = item;
      res.push({
        field,
        type,
        require,
        description,
        level,
        key: `${level}-${field}`
      });

      if (children) {
        walker(children);
        level--;
      }
    });
    return res;
  };
  return walker(data);
};

const EditableCell = ({
  value,
  level
}) => (
  <div>
    <span
      dangerouslySetInnerHTML={{__html: value}}
      style={{ marginLeft: `${level * 20}px` }}>
    </span>
  </div>
);

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: genList(obj)
    };
    this.columns = [{
      title: '字段',
      dataIndex: 'field',
      width: '20%',
      render: (text, record) => this.renderColumns(text, record, 'field')
    }, {
      title: '类型',
      dataIndex: 'type',
      width: '15%',
      render: (text, record) => this.renderColumns(text, record, 'type')
    }, {
      title: '必须',
      dataIndex: 'require',
      width: '10%',
      render: (text, record) => this.renderColumns(text, record, 'require')
    }, {
      title: '说明',
      dataIndex: 'description',
      width: '45%',
      render: (text, record) => this.renderColumns(text, record, 'description')
    }];
    this.cacheData = data.map(item => ({ ...item }));
  }

  renderColumns(text, record, column) {
    return (
      <EditableCell
        level={column === 'field' ? record.level : 0}
        value={text}
      />
    );
  }

  _guid() {
    return 'xxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  handleAdd() {
    const data = [...this.state.data];
    const newData = {
      key: this._guid(),
      editable: true,
      field: '',
      require: '',
      type: '',
      description: ''
    };
    const allParams = [...data, newData];
    this.setState({
      data: allParams
    });
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
