'use strict';

import React from 'react';
import {
  Table
} from 'antd';

import _ from '../common/helper';

import './CustomTable.less';

const TableCell = ({
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
      data: []
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
  }

  renderColumns(text, record, column) {
    return (
      <TableCell
        level={column === 'field' ? record.level : 0}
        value={text}
      />
    );
  }

  render() {
    const data = _.genList(this.props.schemaData || []);
    return (
      <Table size="small" pagination={false} bordered dataSource={data} columns={this.columns} />
    );
  }
}
