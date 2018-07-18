import React, {
  Component,
} from 'react';

import {
  Col,
  Row,
  Form,
  Input,
  Modal,
  Button,
  message,
} from 'antd';

import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import { sceneService } from '../../service';

const Search = Input.Search;
const FormItem = Form.Item;

function SceneFormModalComponent (props) {
  const {
    visible,
    onCancel,
    onOk,
    form,
    confirmLoading,
    stageData,
  } = props;
  const {
    getFieldDecorator,
  } = form;
  const formatMessage = id => props.intl.formatMessage({ id });
  return <Modal
    visible={visible}
    title={formatMessage(stageData ? 'sceneList.updateScene' : 'sceneList.createScene')}
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
          initialValue: stageData && stageData.pathname,
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
          initialValue: stageData && stageData.description,
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
    </Form>
  </Modal>;
}

const SceneFormModal = Form.create()(injectIntl(SceneFormModalComponent));

class SceneForm extends Component {
  state = {
    sceneFormVisible: false,
    sceneFormLoading: false,
    filterString: '',
    stageData: null,
  }

  formatMessage = id => this.props.intl.formatMessage({ id });

  showCreateForm = () => {
    this.setState({
      formType: 'create',
      stageData: null,
      sceneFormVisible: true,
    });
  }

  showUpdateForm = async value => {
    this.setState({
      formType: 'update',
      stageData: value,
      sceneFormVisible: true,
    });
  }

  hideSceneForm = () => {
    this.setState({
      sceneFormVisible: false,
    });
  }

  confirmSceneForm = async ({ sceneName, data }, callback = () => {}) => {
    this.setState({
      sceneFormLoading: true,
    });
    const apiName = this.state.stageData
      ? 'updateScene'
      : 'createScene';
    const res = await sceneService[apiName]({
      uniqId: this.state.stageData && this.state.stageData.uniqId,
      sceneName,
      data,
    });
    this.setState({
      sceneFormLoading: false,
    });
    if (res.success) {
      this.setState({
        sceneFormVisible: false,
      }, () => {
        callback();
        this.props.fetchSceneList();
      });
    }
  }

  filterScene = (e) => {
    const filter = e.target.value.toLowerCase();
    this.setState({
      filterString: filter,
    });
  }

  renderSceneList = () => {
    const formatMessage = this.formatMessage;
    const { sceneList } = this.props;
    return sceneList.filter(value =>
      value.pathname.toLowerCase().includes(this.state.filterString) ||
      value.description.toLowerCase().includes(this.state.filterString)
    ).map((value, index) => {
      return (
        <Popover
          key={index}
          placement="right"
          content={
            <div style={{ maxWidth: '400px', wordBreak: 'break-all'}}>
              <div>{value.pathname}</div><br/>
              <div>{value.description}</div>
            </div>
          }
          trigger="hover">
          <li
            onClick={() => this.setSelectedScene(value.uniqId)}
          >
            <div className="left">
              <h3>{value.pathname}</h3>
              <p>{value.description}</p>
              <p>method: {value.method}
              </p>
            </div>
            <div className="right">
              <Icon
                type="setting"
                onClick={() => this.showUpdateForm(value)}
              />
              <Popconfirm
                title={formatMessage('common.deleteTip')}
                onConfirm={() => this.deleteScene(value.uniqId)}
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
      <div>
        <Row>
          <Col span={6}>
            <Search
              placeholder={formatMessage('sceneList.searchScene')}
              onChange={this.filterScene}
            />
          </Col>
          <Col span={2}>
            <Button
              type="primary"
              onClick={this.showCreateForm}
            >
              <FormattedMessage id='sceneList.createScene' />
            </Button>
          </Col>
        </Row>

        <ul>
          { this.renderSceneList() }
        </ul>

        <SceneFormModal
          visible={this.state.sceneFormVisible}
          onCancel={this.hideSceneForm}
          onOk={this.confirmSceneForm}
          confirmLoading={this.state.sceneFormLoading}
          stageData={this.state.stageData}
        />
      </div>
    );
  }
}

export default injectIntl(SceneForm);
