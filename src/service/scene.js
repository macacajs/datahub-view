import request from '../common/request';

export async function getSceneList ({ interfaceUniqId }) {
  return request(`/api/scene?interfaceUniqId=${interfaceUniqId}`, 'GET');
};

export async function createScene ({ interfaceUniqId, sceneName, contextConfig, data }) {
  return request('/api/scene', 'POST', {
    interfaceUniqId,
    sceneName,
    contextConfig,
    data,
  });
};

export async function updateScene ({ uniqId, interfaceUniqId, sceneName, contextConfig, data }) {
  return request(`/api/scene/${uniqId}`, 'PUT', {
    interfaceUniqId,
    sceneName,
    contextConfig,
    data,
  });
};

export async function deleteScene ({ uniqId }) {
  return request(`/api/scene/${uniqId}`, 'DELETE');
};
