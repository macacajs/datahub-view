import React from 'react';

import {
  Form,
  Input,
  Modal,
  message,
} from 'antd';

import {
  injectIntl,
} from 'react-intl';

const FormItem = Form.Item;

export default Form.create()(injectIntl(SceneFormComponent));

function SceneFormComponent (props) {
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
