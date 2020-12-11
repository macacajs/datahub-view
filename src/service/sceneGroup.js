import request from '../common/request';

const { uniqId: projectUniqId } = window.context || {};

export async function getSceneGroupList () {
  return request(`/api/sceneGroup?projectUniqId=${projectUniqId}`, 'GET');
};

export async function getOneSceneGroup ({ uniqId }) {
  return request(`/api/sceneGroup/${uniqId}`, 'GET');
};

export async function createSceneGroup ({ sceneGroupName, description }) {
  return request('/api/sceneGroup', 'POST', {
    projectUniqId,
    sceneGroupName,
    description,
  });
};

export async function updateSceneGroup ({ uniqId, ...payload }) {
  const fileds = [
    'sceneGroupName', 'description',
    'interfaceList', 'enable',
  ];
  const postData = {};
  for (const field of fileds) {
    if (payload.hasOwnProperty(field)) postData[field] = payload[field];
  }
  return request(`/api/sceneGroup/${uniqId}`, 'PUT', postData);
};

export async function deleteSceneGroup ({ uniqId }) {
  return request(`/api/sceneGroup/${uniqId}`, 'DELETE');
};
