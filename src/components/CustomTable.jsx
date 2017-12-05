'use strict';

import React from 'react';
import {
  Table
} from 'antd';

import {
  injectIntl
} from 'react-intl';

import _ from '../common/helper';

import './CustomTable.less';

const columnStyleMap = {
  type: 'capitalize',
  require: ''
};

const TableCell = ({
  value,
  level,
  column
}) => (
  <div>
    <span
      className={ columnStyleMap[column] || '' }
      dangerouslySetInnerHTML={{__html: value}}
      style={{ marginLeft: `${level * 20}px` }}>
    </span>
  </div>
);

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };

    this.columns = [{
      title: this.props.intl.formatMessage({id: 'fieldDes.field'}),
      dataIndex: 'field',
      width: '20%',
      render: (text, record) => this.renderColumns(text, record, 'field')
    }, {
      title: this.props.intl.formatMessage({id: 'fieldDes.type'}),
      dataIndex: 'type',
      width: '15%',
      render: (text, record) => this.renderColumns(text, record, 'type')
    }, {
      title: this.props.intl.formatMessage({id: 'fieldDes.require'}),
      dataIndex: 'require',
      width: '10%',
      render: (text, record) => this.renderColumns(text, record, 'require')
    }, {
      title: this.props.intl.formatMessage({id: 'fieldDes.description'}),
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
        column={column}
      />
    );
  }

  getDataList() {
    if (this.props.type === 'schema') {
      return _.genSchemaList(this.props.schemaData || []);
    } else if (this.props.type === 'api') {
      return _.genApiList(this.props.schemaData || [], this.props.paramsData || []);
    } else {
      return [];
    }
  }

  render() {
    let data = this.getDataList();
    return (
      <Table size="small" pagination={false} bordered dataSource={data} columns={this.columns} />
    );
  }
}

export default injectIntl(EditableTable);
