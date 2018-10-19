import request from '../common/request';

export async function getProjectList () {
  return request('/api/project', 'GET');
};

export async function createProject ({ projectName, description }) {
  return request('/api/project', 'POST', {
    projectName,
    description,
  });
};

export async function updateProject ({ uniqId, projectName, description }) {
  return request(`/api/project/${uniqId}`, 'PUT', {
    projectName,
    description,
  });
};

export async function deleteProject ({ uniqId }) {
  return request(`/api/project/${uniqId}`, 'DELETE');
};

export const uploadServer = '/api/project/upload';

export function getDownloadAddress ({ uniqId }) {
  return `/api/project/download/${uniqId}`;
};
