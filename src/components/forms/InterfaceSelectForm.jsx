import React, {
  Component,
} from 'react';

import {
  Form,
  Modal,
  Select,
  message,
} from 'antd';

import {
  injectIntl,
} from 'react-intl';

const Option = Select.Option;
const FormItem = Form.Item;

class InterfaceSelectFormComponent extends Component {
  render () {
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,
      interfaceList,
      actualInterfaceList,
    } = this.props;

    const {
      getFieldDecorator,
    } = form;

    const formatMessage = id => this.props.intl.formatMessage({ id });

    return <Modal
      visible={visible}
      destroyOnClose={true}
      title={formatMessage('interfaceList.addInterface')}
      okText={formatMessage('common.confirm')}
      cancelText={formatMessage('common.cancel')}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields((err, values) => {
          if (err) {
            message.warn(formatMessage('interfaceList.noInterface'));
            return;
          }
          onOk(values.interfaceList);
        });
      }}
      confirmLoading={confirmLoading}
    >
      <Form layout="vertical">
        <FormItem>
          {getFieldDecorator('interfaceList', {
            rules: [
              {
                required: true,
                message: formatMessage('interfaceList.invalidSelectInterface'),
              },
            ],
          })(
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder={formatMessage('sceneGroupList.selectInterface')}
            >
              {
                interfaceList.filter(item => !actualInterfaceList.includes(item)).map((item, index) =>
                  <Option key={item.pathname}>{item.pathname}</Option>
                )
              }
            </Select>
          )}
        </FormItem>
      </Form>
    </Modal>;
  }
}

export default Form.create()(injectIntl(InterfaceSelectFormComponent));
