'use strict';

import lodash from 'lodash';
import typeDetect from 'type-detect';

const _ = lodash.merge({}, lodash);

_.guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};

const genSchemaList = (data) => {
  const res = [];
  let level = -1;

  const walker = (data) => {
    if (!data.properties) {
      return [];
    }
    const requiredList = data.required || [];
    level++;
    Object.keys(data.properties).forEach(title => {
      const schema = data.properties[title];
      const {
        type,
        description,
        properties,
      } = schema;
      res.push({
        title,
        type,
        description,
        level,
        key: `${_.guid()}`,
        required: !!~requiredList.indexOf(title),
      });

      if (properties) {
        walker(schema);
        level--;
      }
    });
    return res;
  };
  /**
   pass the root schema
   {
    "type": "object",
    "properties": {
      "success": {
        "type": "boolean",
        "description": "",
        "properties": {
        }
      }
    }
   */
  return walker(data);
};

_.genSchemaList = genSchemaList;

_.typeof = typeDetect;

_.isChineseChar = str => {
  const reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
  return reg.test(str);
};

_.genApiList = (schemaData, paramsData) => {
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

_.operateSchema = (type, { item, data, index, key, value }) => {
  const res = data;
  let count = -1;

  const walker = data => {
    Object.keys(data.properties).forEach((_current, currentIndex) => {
      const current = data.properties[_current];
      count++;
      if (index === count) {
        switch (type) {
          case 'add': {
            current.properties[new Date().getTime()] = {
              type: 'string',
              description: '',
              properties: {},
            };
            break;
          }
          case 'delete': {
            delete data.properties[_current];
            break;
          }
          case 'modify': {
            if (key === 'required') {
              if (value) {
                data.required.push(item.title);
              } else {
                data.required.splice(data.required.indexOf(item.title), 1);
              }
            } else if (key === 'field') { // 修改 key
              data.properties[value] = data.properties[item.title];
              delete data.properties[item.title];
            } else { // 修改属性
              current[key] = value;
            }
            break;
          }
        }
      }
      if (current.properties) {
        walker(current);
      }
    });
  };
  walker(res);
  return res;
};

module.exports = _;
