'use strict';

import React from 'react';
import {
  Table,
  Icon,
  Input,
  Button,
  Popconfirm
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

// const TableCell = ({
  // value,
  // level,
  // column
// }) => (
  // <div>
    // <span
      // className={ columnStyleMap[column] || '' }
      // dangerouslySetInnerHTML={{__html: value}}
      // style={{ marginLeft: `${level * 20}px` }}>
    // </span>
  // </div>
// );

class EditableAddDeleteCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      showEditableIcon: false
    };
  }

  handleChange(e) {
    const value = e.target.value;
    this.setState({
      value
    });
  }

  check() {
    if (this.props.onConfirm) {
      this.props.onConfirm(this.state.value);
    }
  }

  edit() {
    if (this.props.onEdit) {
      this.props.onEdit();
    }
  }

  onTrigger(value) {
    this.setState({ showEditableIcon: !!value });
  }

  render() {
    const { value, showEditableIcon } = this.state;
    return (
      <div className="editable-cell">
        {
          this.props.editable
            ? <div className="editable-cell-input-wrapper">
              <Input
                value={value}
                style={{ width: `70%` }}
                onChange={this.handleChange.bind(this)}
                onPressEnter={this.check.bind(this)}
              />
              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check.bind(this)}
              />
            </div>
            : <div className="editable-cell-text-wrapper"
                onMouseEnter={this.onTrigger.bind(this, true)}
                onMouseLeave={this.onTrigger.bind(this, false)}
              >
              <span
                className={ columnStyleMap[this.props.column] || '' }
                dangerouslySetInnerHTML={{__html: value}}
                style={{ marginLeft: `${this.props.level * 20}px` }}>
              </span>
              {
                showEditableIcon ? <Icon
                  type="edit"
                  className="editable-cell-icon"
                  onClick={this.edit.bind(this)}
                /> : ''
              }
            </div>
        }
      </div>
    );
  }
};

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      editingCell: {}
    };

    this.columns = [{
      title: this.props.intl.formatMessage({id: 'fieldDes.field'}),
      dataIndex: 'field',
      width: '20%',
      render: (text, record, index) => this.renderColumns(text, record, 'field', index)
    }, {
      title: this.props.intl.formatMessage({id: 'fieldDes.type'}),
      dataIndex: 'type',
      width: '15%',
      render: (text, record, index) => this.renderColumns(text, record, 'type', index)
    }, {
      title: this.props.intl.formatMessage({id: 'fieldDes.require'}),
      dataIndex: 'require',
      width: '10%',
      render: (text, record, index) => this.renderColumns(text, record, 'require', index)
    }, {
      title: this.props.intl.formatMessage({id: 'fieldDes.description'}),
      dataIndex: 'description',
      width: '35%',
      render: (text, record, index) => this.renderColumns(text, record, 'description', index)
    }, {
      title: this.props.intl.formatMessage({id: 'fieldDes.operation'}),
      dataIndex: 'operation',
      width: '10%',
      render: (text, record, index) => (
        <div>
          <Button
            size="small"
            onClick={this.plus.bind(this, index, record)}
          >
            <Icon
              type="plus"
              className="plus-cell-icon"
              onClick={this.plus.bind(this, index, record)}
            />
          </Button>
          <Popconfirm title={this.props.intl.formatMessage({id: 'common.deleteTip'})} onConfirm={this.minus.bind(this, index, record)} okText={this.props.intl.formatMessage({id: 'common.confirm'})} cancelText={this.props.intl.formatMessage({id: 'common.cancel'})}>
            <Button
              size="small"
              style={{ marginLeft: `3px` }}
            >
              <Icon
                type="minus"
                className="minus-cell-icon"
              />
            </Button>
          </Popconfirm>
        </div>
      )
    }];
  }

  plus(index, record) {
    let data = this.props.schemaData || [];
    const res = _.addSchema(index, data, record);
    this.props.onChange(res);
  }

  minus(index, record) {
    let data = this.props.schemaData || [];
    const res = _.deleteSchema(index, data, record);
    this.props.onChange(res);
  }

  modify(value, index, column, record) {
    let data = this.props.schemaData || [];
    const res = _.modifySchema(index, data, value, record, column);
    this.props.onChange(res);

    this.setState({
      editing: false,
      editingCell: {}
    })
  }

  edit(index, column) {
    this.setState({
      editing: true,
      editingCell: {
        index: index,
        column: column
      }
    })
  }

  renderColumns(text, record, column, index) {
    return (
      <EditableAddDeleteCell
        level={column === 'field' ? record.level : 0}
        value={text}
        column={column}
        onConfirm={value => this.modify(value, index, column, record)}
        onEdit={() => this.edit(index, column)}
        editable={ this.state.editingCell.index === index && this.state.editingCell.column === column}
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
