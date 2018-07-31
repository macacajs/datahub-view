import request from '../common/request';

export async function getSchema ({ interfaceUniqId }) {
  return request(`/api/schema?interfaceUniqId=${interfaceUniqId}`, 'GET');
};

export async function updateSchema ({ interfaceUniqId, type, data }) {
  return request(`/api/schema/${type}`, 'PUT', {
    interfaceUniqId,
    data,
  });
};

