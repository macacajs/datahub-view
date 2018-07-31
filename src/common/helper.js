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
  let tableIndex = 0;

  const schemaWalker = (schema, field, requiredList) => {
    const {
      type,
      description,
      properties,
      items,
    } = schema;
    res.push({
      field,
      type: items && items.type ? `${type}<{${items.type}}>` : type,
      description,
      level,
      key: tableIndex++,
      required: !!~requiredList.indexOf(field),
    });

    if (items || properties) {
      walker(schema);
      level--;
    }
  };

  const walker = (data) => {
    if (data.properties) {
      const requiredList = data.required || [];
      level++;
      Object.keys(data.properties).forEach(field => {
        const schema = data.properties[field];
        schemaWalker(schema, field, requiredList);
      });
    } else if (data.items) {
      const distObj = data.items.length ? data.items[0] : data.items;
      walker(distObj);
    } else {
      return [];
    }
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

module.exports = _;
