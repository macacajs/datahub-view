'use strict';

import React, {
  Component,
} from 'react';

import {
  Input,
  Button,
  Modal,
  Row,
  Col,
  Popconfirm,
  Popover,
  Select,
  Icon,
  Form,
  message,
} from 'antd';

import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import './InterfaceList.less';

import { interfaceService } from '../service';

const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;

function InterfaceModalComponent (props) {
  const {
    visible,
    onCancel,
    onOk,
    form,
    confirmLoading,
  } = props;
  const {
    getFieldDecorator,
  } = form;
  const formatMessage = id => props.intl.formatMessage({ id });
  return <Modal
    visible={visible}
    title={formatMessage('interfaceList.addInterface')}
    okText={formatMessage('common.confirm')}
    cancelText={formatMessage('common.cancel')}
    onCancel={() => {
      onCancel();
      props.form.resetFields();
    }}
    onOk={() => {
      form.validateFields((err, values) => {
        if (err) {
          message.warn(formatMessage('common.input.invalid'));
          return;
        }
        onOk(values, () => {
          props.form.resetFields();
        });
      });
    }}
    confirmLoading={confirmLoading}
  >
    <Form layout="vertical">
      <FormItem label={formatMessage('interfaceList.interfacePathnameInput')}>
        {getFieldDecorator('pathname', {
          rules: [
            {
              required: true,
              message: formatMessage('interfaceList.invalidPathname'),
              pattern: /^[A-Za-z0-9:_-]([.A-Za-z0-9:/_-]*[A-Za-z0-9:_-])?$/,
            },
          ],
        })(
          <Input
            placeholder="path/name or path/:type/:id"
          />
        )}
      </FormItem>
      <FormItem label={formatMessage('interfaceList.interfaceDescription')}>
        {getFieldDecorator('description', {
          rules: [
            {
              required: true,
              message: formatMessage('interfaceList.invalidDescription'),
            },
          ],
        })(
          <Input />
        )}
      </FormItem>
      <FormItem label={formatMessage('interfaceList.interfaceMethod')}>
        {getFieldDecorator('method', {
          rules: [
            {
              required: true,
              message: formatMessage('interfaceList.invalidMethod'),
            },
          ],
          initialValue: 'ALL',
        })(
          <Select>
            <Option value="ALL">ALL</Option>
            <Option value="GET">GET</Option>
            <Option value="POST">POST</Option>
            <Option value="PUT">PUT</Option>
            <Option value="DELETE">DELETE</Option>
            <Option value="PATCH">PATCH</Option>
          </Select>
        )}
      </FormItem>
    </Form>
  </Modal>;
}

const InterfaceForm = Form.create()(injectIntl(InterfaceModalComponent));

class InterfaceList extends Component {
  state = {
    createFormVisible: false,
    createInterfaceConfirmLoading: false,
    selectedInterface: '',
    filterString: '',
  }

  formatMessage = id => this.props.intl.formatMessage({ id });

  showCreateForm = () => {
    this.setState({
      createFormVisible: true,
    });
  }

  cancelCreateInterface = () => {
    this.setState({
      createFormVisible: false,
    });
  }

  createInterface = async ({ pathname, description, method }, callback = () => {}) => {
    this.setState({
      createInterfaceConfirmLoading: true,
    });
    const res = await interfaceService.createInterface({
      pathname,
      description,
      method,
    });
    this.setState({
      createInterfaceConfirmLoading: false,
    });
    if (res.success) {
      this.setState({
        createFormVisible: false,
      }, () => {
        callback();
        this.props.fetchInterfaceList();
      });
    }
  }

  selectInterface = uniqId => {
    this.setState({
      selectedInterface: uniqId,
    });
  }

  deleteInterface = async (uniqId) => {
    await interfaceService.deleteInterface({ uniqId });
    await this.props.fetchInterfaceList();
    this.setState({
      selectedInterface: '',
    });
  }

  filterInterface = (e) => {
    const filter = e.target.value.toLowerCase();
    this.setState({
      filterString: filter,
    });
  }

  getSelectedInterface = () => {
    if (this.state.selectedInterface) {
      return this.state.selectedInterface;
    }
    return this.props.interfaceList[0] && this.props.interfaceList[0].uniqId;
  }

  renderInterfaceList = () => {
    const formatMessage = this.formatMessage;
    const { interfaceList } = this.props;
    return interfaceList.filter(value =>
      value.pathname.toLowerCase().includes(this.state.filterString) ||
      value.description.toLowerCase().includes(this.state.filterString)
    ).map((value, index) => {
      const isSelected = value.uniqId === this.getSelectedInterface();
      return (
        <Popover
          key={index}
          placement="right"
          content={
            <div>
              <div>{value.pathname}</div>
              <div>{value.description}</div>
              <div>{value.method}</div>
            </div>
          }
          trigger="hover">
          <li
            className={isSelected ? 'clicked' : ''}
            data-accessbilityid={`project-add-api-list-${index}`}
            onClick={() => this.selectInterface(value.uniqId)}
          >
            <div className="left">
              <h3>{value.pathname}</h3>
              <p>{value.description}</p>
              <p>method: {value.method}
              </p>
            </div>
            <div className="right">
              <Icon type="setting" />
              <Popconfirm
                title={formatMessage('common.deleteTip')}
                onConfirm={() => this.deleteInterface(value.uniqId)}
                okText={formatMessage('common.confirm')}
                cancelText={formatMessage('common.cancel')}
              >
                <Icon className="delete-icon" type="delete" />
              </Popconfirm>
            </div>
          </li>
        </Popover>
      );
    });
  }

  render () {
    const formatMessage = this.formatMessage;
    return (
      <div className="interface-list">
        <Row className="interface-filter-row">
          <Col span={15}>
            <Search
              data-accessbilityid="project-search-api"
              placeholder={formatMessage('interfaceList.searchInterface')}
              onChange={this.filterInterface}
            />
          </Col>
          <Col span={8} offset={1}>
            <Button
              type="primary"
              data-accessbilityid="project-add-api-list-btn"
              onClick={this.showCreateForm}
            >
              <FormattedMessage id='interfaceList.addInterface' />
            </Button>
          </Col>
        </Row>

        <ul style={{ maxHeight: '500px', overflowY: 'scroll' }}>
          { this.renderInterfaceList() }
        </ul>

        <InterfaceForm
          visible={this.state.createFormVisible}
          onCancel={this.cancelCreateInterface}
          onOk={this.createInterface}
          confirmLoading={this.state.createInterfaceConfirmLoading}
        />
      </div>
    );
  }
}

export default injectIntl(InterfaceList);
