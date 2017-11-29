import _ from 'lodash';
import React, { Component } from 'react';
import {
  Form,
  Input,
  Icon,
  Radio,
  Button,
  Checkbox
} from 'antd';
import './ProxyInputList.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

let uuid = 0;
let isServerData = false;

class DynamicFieldSet extends Component {

  constructor(props) {
    super(props);
    this.state = {
      useProxy: false, // 是否使用代理
      currentProxyIndex: 1, // 当前选中的代理地址
      proxies: [], // 当前备选代理地址
      originKeys: [],
    };
  }

  componentWillReceiveProps = (props) => { // TODO input onchange will fire componentWillReceiveProps，hack by flag
    if (props.proxyUrl && !isServerData) {
      isServerData = true;
      const origin = JSON.parse(props.proxyUrl);
      uuid += origin.originKeys[origin.originKeys.length - 1]
      this.setState(origin);
    }
  }

  remove = (k) => {
    const { form } = this.props;
    const newKeys = this.state.originKeys.filter(key => key !== k);
    if (k == this.state.currentProxyIndex) {
      this.setState({
        originKeys: newKeys,
        currentProxyIndex: newKeys[0],
      });
    } else {
      this.setState({
        originKeys: newKeys,
      });
    }
  }

  add = () => {
    uuid++;
    const { form } = this.props;
    const newKeys = this.state.originKeys.concat(uuid);
    this.setState({
      originKeys: newKeys,
    })
  }

  onCheckboxChange = e => {
    this.setState({
      useProxy: e.target.checked,
    })
  }

  onRadioChange = e => {
    this.setState({
      currentProxyIndex: e.target.value,
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    var proxies = [];
    this.props.form.validateFields((err, values) => {
      this.state.originKeys.forEach(key => {
        var proxy = values[`proxy-${key}`];
        proxies.push(proxy)
      });
      if (!err) {
        const result = {
          proxies,
          useProxy: this.state.useProxy,
          originKeys: this.state.originKeys,
          currentProxyIndex: this.state.currentProxyIndex,
        }
        this.props.onChangeProxy(JSON.stringify(result))
      }
    });
  }

  render() {
    const {
      getFieldDecorator,
      getFieldValue
    } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItems = this.state.originKeys.map((k, index) => {
      return (
        <Radio value={k} key={k} disabled={!this.state.useProxy}>
          <FormItem
            required={true}
          >
          <div>
            {getFieldDecorator(`proxy-${k}`, {
              initialValue: this.state.proxies[index],
              rules: [{
                required: true,
                pattern: /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i,
                message: '请填写 URL 格式的代理地址',
              }],
            })(
              <Input disabled={!this.state.useProxy} placeholder="请填写代理地址" style={{ width: '355px', marginRight: 8 }} />
            )}
            <Button
              size="small"
              className="dynamic-delete-button"
              type="danger"
              disabled={!this.state.useProxy}
              onClick={() => this.remove(k)}>
              删除
            </Button>
            </div>
        </FormItem>
      </Radio>
      );
    });
    return (
      <Form onSubmit={this.handleSubmit} className="proxyInputList">
      <FormItem {...formItemLayout}>
        <Checkbox checked={this.state.useProxy} onChange={this.onCheckboxChange}>是否使用代理</Checkbox>
        <Button type="dashed" onClick={this.add} style={{ width: '160px' }}>
          <Icon type="plus" />添加代理
        </Button>
        <Button type="primary" htmlType="submit" style={{ width: '160px' }}>提交</Button>
      </FormItem>

      <RadioGroup onChange={this.onRadioChange} value={this.state.currentProxyIndex}>
        {formItems}
      </RadioGroup>
      </Form>
    );
  }
}

const ProxyInputList = Form.create()(DynamicFieldSet);
export default ProxyInputList;
