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

export default Form.create()(injectIntl(SceneGroupFormComponent));

function SceneGroupFormComponent (props) {
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
    title={formatMessage(stageData ? 'sceneGroupList.updateSceneGroup' : 'sceneGroupList.addSceneGroup')}
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
      <FormItem label={formatMessage('sceneGroupList.sceneGroupNameInput')}>
        {getFieldDecorator('sceneGroupName', {
          initialValue: stageData && stageData.sceneGroupName,
          rules: [
            {
              required: true,
              message: formatMessage('sceneGroupList.invalidSceneGroupName'),
              pattern: /^[\u4e00-\u9fa5-_a-zA-Z0-9]+$/,
            },
            { max: 128 },
          ],
        })(
          <Input />
        )}
      </FormItem>
      <FormItem label={formatMessage('sceneGroupList.sceneGroupDescription')}>
        {getFieldDecorator('description', {
          initialValue: stageData && stageData.description,
          rules: [
            {
              pattern: /^[^\s].*$/,
              message: formatMessage('sceneGroupList.invalidDescription'),
            },
            { max: 128 },
          ],
        })(
          <Input />
        )}
      </FormItem>
    </Form>
  </Modal>;
}
