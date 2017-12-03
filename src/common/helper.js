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

// TODO support ArrayObject
_.genApiList = (data) => {
  const json = JSON.parse(data[0].data);
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
      } else if (_.isArray(value) && value.length) {
        const json = value[0];

        if (_.isPlainObject(json)) {
          const keys = Object.keys(json);
          if (keys.length) {
            walker(value);
            level--;
          }
        }
      }
    });
    return res;
  };
  return walker(json);
};

module.exports = _;
