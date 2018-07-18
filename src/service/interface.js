import request from '../common/request';

const { uniqId: projectUniqId } = window.context;

export async function getInterfaceList () {
  return request(`/api/interface?projectUniqId=${projectUniqId}`, 'GET');
};

export async function createInterface ({ pathname, description, method = 'GET' }) {
  return request('/api/interface', 'POST', {
    projectUniqId,
    pathname,
    description,
    method,
  });
};

export async function updateInterface ({ uniqId, pathname, description, method }) {
  return request(`/api/interface/${uniqId}`, 'PUT', {
    pathname,
    description,
    method,
  });
};

export async function deleteInterface ({ uniqId }) {
  return request(`/api/interface/${uniqId}`, 'DELETE');
};
