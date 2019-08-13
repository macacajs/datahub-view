'use strict';

import lodash from 'lodash';
import semver from 'semver';
import typeDetect from 'type-detect';
import deepMerge from './deepmerge';

const _ = lodash.merge({}, lodash);

const compareServerVersion = () => {
  return new Promise((resolve, reject) => {
    const serverPkg = 'https://unpkg.com/macaca-datahub@latest/package.json';
    fetch(serverPkg).then(res => res.json()).then(res => {
      const latestVesion = res.version;
      const currentVersion = window.pageConfig.version;
      resolve({
        shouldUpdate: semver.gt(latestVesion, currentVersion),
        latestVesion,
      });
    });
  });
};

const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};

const getSchemaChildren = (properties, requiredList = []) => {
  if (!properties) return null;

  const res = [];

  Object.keys(properties).forEach(item => {
    const itemData = properties[item];
    const isArray = itemData.type === 'array' && itemData.items;
    const isArrayObj = isArray && itemData.items.type === 'object';
    const type = isArray ? `${itemData.type}<{${itemData.items.type || 'String'}}>` : itemData.type;

    const children = isArrayObj
      ? getSchemaChildren(itemData.items.properties, itemData.items.required)
      : getSchemaChildren(itemData.properties, itemData.required);

    res.push({
      key: guid(),
      field: item,
      type,
      description: itemData.description,
      required: !!~requiredList.indexOf(item),
      children,
    });
  });
  return res;
};

const genSchemaList = (data) => {
  if (data.type === 'object') { // Object
    return getSchemaChildren(data.properties, data.required);
  } else if (data.type === 'array') { // Array
    const isArrayObj = data.items.type === 'object';

    return [{
      key: guid(),
      field: 'root(virtual)',
      type: `Array<{${data.items.type || 'String'}}>`,
      description: 'Array',
      required: false,
      children: isArrayObj
        ? getSchemaChildren(data.items.properties, data.items.required)
        : null,
    }];
  } else {
    return [];
  }
};

const queryParse = url => {
  const qs = {};
  if (!url) {
    return qs;
  }
  url.replace(/([^?=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => {
    if ($3 === undefined) {
      return;
    }
    qs[$1] = decodeURIComponent($3);
  });
  return qs;
};

const serialize = obj => {
  const s = [];

  for (const item in obj) {
    const k = encodeURIComponent(item);
    const v = encodeURIComponent(obj[item] == null ? '' : obj[item]);
    s.push(`${k}=${v}`);
  }

  return s.join('&');
};

// 转换 JSON 为 Schema
const jsonToSchema = jsonData => {
  let contextSchema = {};
  const itemType = typeof (jsonData);
  switch (itemType) {
    case 'string':
    case 'boolean':
    case 'number': {
      contextSchema = {
        type: itemType,
        description: '',
      };
      break;
    }
    case 'object': {
      if (Array.isArray(jsonData)) {
        let data = jsonData[0];

        if (typeof jsonData[0] === 'object') {
          data = jsonData.length > 1 ? deepMerge(jsonData) : jsonData[0];
        }
        contextSchema = {
          type: 'array',
          description: '',
          items: jsonToSchema(data),
        };
      } else {
        contextSchema = {
          type: 'object',
          description: '',
          properties: {},
          required: [],
        };

        for (const key in jsonData) {
          if (!jsonData.hasOwnProperty(key)) {
            continue;
          }
          contextSchema.properties[key] = jsonToSchema(jsonData[key]);
        }
        break;
      }
    }
  }
  return contextSchema;
};

const genApiList = (schemaData, paramsData) => {
  if (!paramsData.schemaData || !schemaData.length) {
    return [];
  }
  const paramsMap = _.groupBy(genSchemaList(paramsData.schemaData), 'level');
  const json = {};
  schemaData.forEach(item => {
    try {
      const o = item.data;
      _.mergeWith(json, o, (obj, src) => {
        if (_.isArray(obj)) {
          return obj.concat(src);
        }
      });
    } catch (e) {
      console.log(e.message);
    }
  });

  const res = [];
  let level = -1;

  const walker = (data) => {
    level++;

    const keys = Object.keys(data);

    keys.forEach(key => {
      const value = data[key];
      const map = {
        title: key,
        type: typeDetect(value),
        level,
        key: `${_.guid()}`,
      };

      const paramsList = paramsMap[level];

      if (paramsList && paramsList.length) {
        paramsList.forEach(item => {
          if (item.title === map.title) {
            map.description = item.description;
            map.required = item.required;
          }
        });
      }

      res.push(map);

      if (_.isPlainObject(value)) {
        const keys = Object.keys(value);
        if (keys.length) {
          walker(value);
          level--;
        }
      } else if (_.isArray(value)) {
        if (!value.length) {
          return;
        }

        const first = value[0];

        if (_.isObject(first)) {
          const json = {};
          value.forEach(item => {
            if (!_.isObject(first)) {
              console.log('data ignore', first);
              return;
            }
            _.mergeWith(json, item, (obj, src) => {
              if (_.isArray(obj)) {
                return obj.concat(src);
              }
            });
          });
          res[res.length - 1].type = `${res[res.length - 1].type}<{${typeDetect(first)}}>`;
          walker(json);
          level--;
        } else {
          res[res.length - 1].type = `${res[res.length - 1].type}<{${typeDetect(first)}}>`;
        }
      }
    });
    return res;
  };
  return walker(json);
};

const getExperimentConfig = () => {
  let experimentConfig = {};
  const config = localStorage.getItem('DATAHUB_EXPERIMENT_CONFIG');

  if (!config) return experimentConfig;

  try {
    experimentConfig = JSON.parse(config);
  } catch (e) {
    console.error('It is error to parse JSON with experimentConfig');
  }
  return experimentConfig;
};

const setExperimentConfig = option => {
  const experimentConfig = getExperimentConfig();
  const result = Object.assign(experimentConfig, option);
  localStorage.setItem('DATAHUB_EXPERIMENT_CONFIG', JSON.stringify(result));
};

const throttle = (action, delay) => {
  let timer = null;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      action.apply(this, arguments);
    }, delay);
  };
};

_.guid = guid;
_.genSchemaList = genSchemaList;
_.queryParse = queryParse;
_.serialize = serialize;
_.jsonToSchema = jsonToSchema;
_.genApiList = genApiList;
_.throttle = throttle;
_.compareServerVersion = compareServerVersion;

export {
  guid,
  genSchemaList,
  queryParse,
  serialize,
  jsonToSchema,
  genApiList,
  getExperimentConfig,
  setExperimentConfig,
  throttle,
  compareServerVersion,
};

export default _;
