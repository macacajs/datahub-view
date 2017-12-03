import React, { Component } from 'react';
import {
  Form,
  Input,
  Icon,
  Radio,
  Alert,
  Button,
  Checkbox
} from 'antd';

import './ProxyInputList.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
let uuid = 0;

class DynamicFieldSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      useProxy: false,
      currentProxyIndex: 1,
      proxies: [],
      originKeys: [],
      isErrorInput: {},
      proxyUrlError: null,
    };
  }

  componentWillReceiveProps(props) {
    if (props.proxyContent) {
      const origin = JSON.parse(props.proxyContent);
      const lastKey = origin.originKeys[origin.originKeys.length - 1];
      if (lastKey) {
        uuid += lastKey;
      }
      this.setState(origin);
    } else {
      this.setState({
        useProxy: false,
        currentProxyIndex: 1,
        proxies: [],
        originKeys: []
      });
    }
  }

  remove(k) {
    const newKeys = this.state.originKeys.filter(key => key !== k);
    const index = this.state.originKeys.indexOf(k);
    const newPorxies = [].concat(this.state.proxies);
    newPorxies.splice(index, 1);
    if (k === this.state.currentProxyIndex) {
      this.setState({
        originKeys: newKeys,
        proxies: newPorxies,
        currentProxyIndex: newKeys[0]
      });
    } else {
      this.setState({
        originKeys: newKeys,
        proxies: newPorxies
      });
    }
  }

  add() {
    uuid++;
    const newKeys = this.state.originKeys.concat(uuid);
    const newProxies = this.state.proxies.concat('');
    if (this.state.originKeys.length) {
      this.setState({
        originKeys: newKeys,
        proxies: newProxies
      });
    } else {
      this.setState({
        originKeys: newKeys,
        proxies: newProxies,
        currentProxyIndex: newKeys[0]
      });
    }
  }

  onCheckboxChange(e) {
    this.setState({
      useProxy: e.target.checked
    });
    const result = {
      proxies: this.state.proxies,
      useProxy: e.target.checked,
      originKeys: this.state.originKeys,
      currentProxyIndex: this.state.currentProxyIndex
    };
    this.props.onChangeProxy(JSON.stringify(result));
  }

  onRadioChange(e) {
    this.setState({
      currentProxyIndex: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const urlReg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
    for (var i = 0; i < this.state.proxies.length; i++) {
      const proxy = this.state.proxies[i];
      this.setState({
        [this.state.isErrorInput[i]]: 'ok'
      });
      const isErrorInput = JSON.parse(JSON.stringify(this.state.isErrorInput));
      if (!urlReg.test(proxy)) {
        isErrorInput[i] = 'error';
        this.setState({
          isErrorInput
        });
        this.setState({
          proxyUrlError: {
            message: `proxy url: ${proxy} is invalid`,
            type: 'error'
          }
        })
        return;
      } else {
        isErrorInput[i] = 'ok';
        this.setState({
          isErrorInput
        });
      }
    }
    this.setState({
      proxyUrlError: null
    })
    const result = {
      proxies: this.state.proxies,
      useProxy: this.state.useProxy,
      originKeys: this.state.originKeys,
      currentProxyIndex: this.state.currentProxyIndex
    };
    this.props.onChangeProxy(JSON.stringify(result));
  }

  proxyInputChange(e, index) {
    const originProxies = [].concat(this.state.proxies);
    originProxies[index] = e.target.value;
    this.setState({
      proxies: originProxies
    });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 4
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 20
        }
      }
    };
    const formItems = this.state.originKeys.map((k, index) => {
      return (
        <Radio value={k} key={k} disabled={!this.state.useProxy}>
          <FormItem
            required={true}
          >
            <div>
              <Input
                className={this.state.isErrorInput[index] === 'error' ? 'error-input' : ''}
                value={this.state.proxies[index]}
                onChange={(e) => {
                  this.proxyInputChange(e, index);
                }}
                disabled={!this.state.useProxy}
                placeholder="请填写代理地址"
                style={{ width: '355px', marginRight: 8 }}
              />
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
      <Form onSubmit={this.handleSubmit.bind(this)} className="proxyInputList">
        <FormItem {...formItemLayout}>
          <Checkbox checked={this.state.useProxy} onChange={this.onCheckboxChange.bind(this)}>是否使用代理</Checkbox>
          <Button size="small" type="dashed" onClick={this.add.bind(this)} style={{ width: '80px', marginLeft: '200px' }}>
            <Icon type="plus" />添加代理
          </Button>
          <Button size="small" type="primary" htmlType="submit" style={{ width: '45px' }}>提交</Button>
        </FormItem>

        <RadioGroup onChange={this.onRadioChange.bind(this)} value={this.state.currentProxyIndex}>
          {formItems}
        </RadioGroup>
        {this.state.proxyUrlError ? <Alert message={this.state.proxyUrlError.message} type={this.state.proxyUrlError.type} showIcon /> : null}
      </Form>
    );
  }
}

const ProxyInputList = Form.create()(DynamicFieldSet);
export default ProxyInputList;
