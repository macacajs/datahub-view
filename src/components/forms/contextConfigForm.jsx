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

export default Form.create()(injectIntl(ContextFormComponent));

function ContextFormComponent (props) {
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
    destroyOnClose={true}
    title={formatMessage('contextConfig.modifyProperty')}
    okText={formatMessage('common.confirm')}
    cancelText={formatMessage('common.cancel')}
    onCancel={onCancel}
    onOk={() => {
      form.validateFields((err, values) => {
        if (err) {
          message.warn(formatMessage('common.input.invalid'));
          return;
        }
        onOk(values);
      });
    }}
    confirmLoading={confirmLoading}
  >
    <Form layout="vertical">
      <FormItem label={formatMessage('contextConfig.responseDelayField')}>
        {getFieldDecorator('responseDelay', {
          initialValue: stageData && stageData.responseDelay,
          rules: [
            {
              message: formatMessage('contextConfig.invalidDelay'),
              pattern: /^[1-9]\d?$/,
            },
          ],
        })(
          <Input maxLength="2"/>
        )}
      </FormItem>
      <FormItem label={`${formatMessage('contextConfig.responseStatus')} 200-50x`}>
        {getFieldDecorator('responseStatus', {
          initialValue: stageData && stageData.responseStatus,
          rules: [
            {
              pattern: /^[1-5]\d{2}$/,
              message: formatMessage('contextConfig.invalidStatus'),
            },
          ],
        })(
          <Input maxLength="3"/>
        )}
      </FormItem>
    </Form>
  </Modal>;
}
