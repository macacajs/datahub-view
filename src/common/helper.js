import lodash from 'lodash';
import typeDetect from 'type-detect';

const _ = lodash.merge({}, lodash);

_.genSchemaList = (data) => {
  const res = [];
  let level = -1;

  const walker = (data) => {
    level++;
    data.forEach(item => {
      const {
        field,
        type,
        require,
        description,
        children
      } = item;
      res.push({
        field,
        type,
        require,
        description,
        level,
        key: `${level}-${field}`
      });

      if (children) {
        walker(children);
        level--;
      }
    });
    return res;
  };
  return walker(data);
};

_.typeof = typeDetect;

_.genApiList = (data) => {
  const json = {};
  data.forEach(item => {
    const o = JSON.parse(item.data);
    _.mergeWith(json, o, (obj, src) => {
      if (_.isArray(obj)) {
        return obj.concat(src);
      }
    });
  });

  const res = [];
  let level = -1;

  const walker = (data) => {
    level++;

    const keys = Object.keys(data);

    keys.forEach(key => {
      const value = data[key];
      res.push({
        field: key,
        type: typeDetect(value),
        level,
        key: `${level}-${key}`
      });

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
              console.log(`data ignore`, first);
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
