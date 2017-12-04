'use strict';

import React from 'react';
import {
  Table
} from 'antd';
import { injectIntl } from 'react-intl';

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

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };

    this.columns = [{
      title: this.props.intl.formatMessage({id: 'fieldDes_field'}),
      dataIndex: 'field',
      width: '20%',
      render: (text, record) => this.renderColumns(text, record, 'field')
    }, {
      title: this.props.intl.formatMessage({id: 'fieldDes_type'}),
      dataIndex: 'type',
      width: '15%',
      render: (text, record) => this.renderColumns(text, record, 'type')
    }, {
      title: this.props.intl.formatMessage({id: 'fieldDes_require'}),
      dataIndex: 'require',
      width: '10%',
      render: (text, record) => this.renderColumns(text, record, 'require')
    }, {
      title: this.props.intl.formatMessage({id: 'fieldDes_description'}),
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

export default injectIntl(EditableTable);
