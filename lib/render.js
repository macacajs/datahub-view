'use strict';

const fs = require('fs');
const path = require('path');

const template = path.join(__dirname, '..', 'index.html');

module.exports = (context, options = {}) => {
  return new Promise((resolve, reject) => {
    const content = fs
      .readFileSync(template, 'utf8')
      .replace(/<!--\s*data\s*-->/, () => {
        return `
          <script>
            window.pageConfig = ${JSON.stringify(options)};
            window.context = ${JSON.stringify(context)};
          </script>
        `;
      })
      .replace(/<!--\s*title\s*-->/, () => {
        return `${options.title} - DataHub`;
      });
    resolve(content);
  });
};
