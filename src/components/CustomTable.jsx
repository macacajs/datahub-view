'use strict';

import React from 'react';
import {
  Table,
  Icon,
  Input,
  Button,
  Popconfirm,
  Checkbox,
  Select,
} from 'antd';

import {
  injectIntl,
} from 'react-intl';

import _ from '../common/helper';

import './CustomTable.less';

const Option = Select.Option;

const columnStyleMap = {
  type: 'capitalize',
  required: '',
};

const schemaTypes = ['object', 'string', 'array', 'boolean', 'number'];

const typeOptions = schemaTypes.map(t => {
  return (<Option key={t} value={t}>{t}</Option>);
});

class EditableAddDeleteCell extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      value: props.value,
      showEditableIcon: false,
    };
  }

  handleSelectChange (value) {
    this.setState({
      value,
    });
  }

  handleChange (e) {
    const value = e.target.value;
    this.setState({
      value,
    });
  }

  check () {
    if (this.props.onConfirm) {
      this.props.onConfirm(this.state.value);
    }
  }

  edit () {
    if (this.props.onEdit) {
      this.props.onEdit();
    }
  }

  onTrigger (value) {
    if (this.props.disabled) {
      return;
    }
    this.setState({
      showEditableIcon: !!value,
    });
  }

  render () {
    const {
      value,
      showEditableIcon,
    } = this.state;
    return (
      <div className="editable-cell">
        {
          this.props.editable
            ? <div className="editable-cell-input-wrapper">
              {
                this.props.column === 'type'
                  ? <Select defaultValue={value} onChange={this.handleSelectChange.bind(this)}>
                    {typeOptions}
                  </Select>
                  : <Input
                    value={value}
                    style={{ width: '70%' }}
                    onChange={this.handleChange.bind(this)}
                    onPressEnter={this.check.bind(this)}
                  />
              }
              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check.bind(this)}
              />
            </div>
            : <div
              className="editable-cell-text-wrapper"
              style={{ minHeight: '5px' }}
              onMouseEnter={this.onTrigger.bind(this, true)}
              onMouseLeave={this.onTrigger.bind(this, false)}
            >
              <span
                className={ columnStyleMap[this.props.column] || '' }
                style={{ marginLeft: `${this.props.level * 15}px` }}
                dangerouslySetInnerHTML={{__html: value}}>
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
  constructor (props) {
    super(props);
    this.state = {
      data: [],
      editingCell: {},
    };

    this.columns = [{
      title: this.props.intl.formatMessage({id: 'fieldDes.field'}),
      dataIndex: 'title',
      width: '20%',
      render: (text, record, index) => this.renderColumns(text, record, 'field', index),
    }, {
      title: this.props.intl.formatMessage({id: 'fieldDes.type'}),
      dataIndex: 'type',
      width: '15%',
      render: (text, record, index) => this.renderColumns(text, record, 'type', index),
    }, {
      title: this.props.intl.formatMessage({id: 'fieldDes.required'}),
      dataIndex: 'required',
      width: '5%',
      render: (text, record, index) => {
        return (
          <Checkbox
            checked={ text }
            onChange={e => this.modify(e.target.checked, index, 'required', record)}
            disabled={this.props.disabled}
          ></Checkbox>
        );
      },
    }, {
      title: this.props.intl.formatMessage({id: 'fieldDes.description'}),
      dataIndex: 'description',
      width: '40%',
      render: (text, record, index) => this.renderColumns(text, record, 'description', index),
    }, {
      title: this.props.intl.formatMessage({id: 'fieldDes.operation'}),
      dataIndex: 'operation',
      width: '10%',
      render: (text, record, index) => (
        <div>
          <Button
            size="small"
            onClick={this.plus.bind(this, index, record)}
            disabled={this.props.disabled}
          >
            <Icon
              type="plus"
              className="plus-cell-icon"
              onClick={this.plus.bind(this, index, record)}
            />
          </Button>
          <Popconfirm
            title={this.props.intl.formatMessage({id: 'common.deleteTip'})}
            onConfirm={this.minus.bind(this, index, record)}
            okText={this.props.intl.formatMessage({id: 'common.confirm'})}
            cancelText={this.props.intl.formatMessage({id: 'common.cancel'})}
          >
            <Button
              size="small"
              style={{ marginLeft: '3px' }}
              disabled={this.props.disabled}
            >
              <Icon
                type="minus"
                className="minus-cell-icon"
              />
            </Button>
          </Popconfirm>
        </div>
      ),
    }];
  }

  plus (index, record) {
    const data = this.props.schemaData || [];
    const res = _.operateSchema('add', { index, data });
    this.props.onChange(res);
  }

  minus (index, record) {
    const data = this.props.schemaData || [];
    const res = _.operateSchema('delete', { index, data });
    this.props.onChange(res);
  }

  modify (value, index, column, record) {
    const data = this.props.schemaData || [];
    const res = _.operateSchema('modify', {
      item: record,
      data,
      index,
      key: column,
      value,
    });
    this.props.onChange(res);

    this.setState({
      editingCell: {},
    });
  }

  edit (index, column) {
    this.setState({
      editingCell: {
        index: index,
        column: column,
      },
    });
  }

  renderColumns (text, record, column, index) {
    return (
      <EditableAddDeleteCell
        level={column === 'field' ? record.level : 0}
        value={text}
        column={column}
        onConfirm={value => this.modify(value, index, column, record)}
        onEdit={() => this.edit(index, column)}
        editable={ this.state.editingCell.index === index &&
          this.state.editingCell.column === column}
        disabled={this.props.disabled}
      />
    );
  }

  getDataList () {
    const paramsData = this.props.paramsData;
    const schemaData = this.props.schemaData;
    if (this.props.type === 'schema') {
      if (schemaData) {
        const res = _.genSchemaList(schemaData);
        return res;
      }
    } else if (this.props.type === 'api') {
      if (paramsData && paramsData.schemaData) {
        return _.genApiList(schemaData, paramsData);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  render () {
    const data = this.getDataList();
    return (
      <Table
        size="small"
        pagination={false}
        bordered
        dataSource={data}
        columns={this.columns}
      />
    );
  }
}

export default injectIntl(EditableTable);
