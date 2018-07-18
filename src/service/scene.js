import request from '../common/request';

export async function getSceneList ({ interfaceUniqId }) {
  return request(`/api/scene?interfaceUniqId=${interfaceUniqId}`, 'GET');
};

export async function createScene ({ sceneName, data }) {
  return request('/api/scene', 'POST', {
    sceneName,
    data,
  });
};

export async function updateScene ({ uniqId, sceneName, data }) {
  return request(`/api/interface/${uniqId}`, 'PUT', {
    sceneName,
    data,
  });
};

export async function deleteScene ({ uniqId }) {
  return request(`/api/scene/${uniqId}`, 'DELETE');
};
