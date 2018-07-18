'use strict';

import React from 'react';

import {
  Modal,
  Form,
  Input,
  message,
} from 'antd';

import {
  injectIntl,
} from 'react-intl';

const FormItem = Form.Item;

export default Form.create()(injectIntl(ProjectFormComponent));

function ProjectFormComponent (props) {
  const {
    visible,
    onCancel,
    onOk,
    form,
    loading,
    stageData,
  } = props;
  const {
    getFieldDecorator,
  } = form;
  const formatMessage = id => props.intl.formatMessage({ id });
  return <Modal
    visible={visible}
    title={stageData ? formatMessage('project.update') : formatMessage('project.create')}
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
    confirmLoading={loading}
  >
    <Form layout="vertical">
      <FormItem label={formatMessage('project.name')}>
        {getFieldDecorator('projectName', {
          initialValue: stageData && stageData.projectName,
          rules: [
            {
              required: true,
              message: formatMessage('project.name.invalid'),
              pattern: /^[a-z0-9_-]+$/,
            },
          ],
        })(
          <Input />
        )}
      </FormItem>
      <FormItem label={formatMessage('project.description')}>
        {getFieldDecorator('description', {
          initialValue: stageData && stageData.description,
          rules: [
            {
              required: true,
              message: formatMessage('project.description.invalid'),
            },
          ],
        })(
          <Input />
        )}
      </FormItem>
    </Form>
  </Modal>;
};
