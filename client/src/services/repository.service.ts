import api from './api';
import {
  Repository,
  FileEntry,
  FileContent,
  Commit,
  Branch,
  ApiResponse,
} from '@/types';

export const repositoryService = {
  async create(data: {
    name: string;
    description?: string;
    visibility?: 'public' | 'private';
    initReadme?: boolean;
    gitignoreTemplate?: string;
    license?: string;
  }): Promise<ApiResponse<Repository>> {
    const response = await api.post<ApiResponse<Repository>>('/repos', data);
    return response.data;
  },

  async get(owner: string, repo: string): Promise<ApiResponse<Repository>> {
    const response = await api.get<ApiResponse<Repository>>(
      `/repos/${owner}/${repo}`
    );
    return response.data;
  },

  async update(
    owner: string,
    repo: string,
    data: Partial<Repository>
  ): Promise<ApiResponse<Repository>> {
    const response = await api.put<ApiResponse<Repository>>(
      `/repos/${owner}/${repo}`,
      data
    );
    return response.data;
  },

  async delete(owner: string, repo: string): Promise<{ success: boolean }> {
    const response = await api.delete(`/repos/${owner}/${repo}`);
    return response.data;
  },

  async getFileTree(
    owner: string,
    repo: string,
    branch: string,
    path: string = ''
  ): Promise<ApiResponse<FileEntry[]>> {
    const url = path
      ? `/repos/${owner}/${repo}/tree/${branch}/${path}`
      : `/repos/${owner}/${repo}/tree/${branch}`;
    const response = await api.get<ApiResponse<FileEntry[]>>(url);
    return response.data;
  },

  async getFileContent(
    owner: string,
    repo: string,
    branch: string,
    path: string
  ): Promise<ApiResponse<FileContent>> {
    const response = await api.get<ApiResponse<FileContent>>(
      `/repos/${owner}/${repo}/blob/${branch}/${path}`
    );
    return response.data;
  },

  async getCommits(
    owner: string,
    repo: string,
    branch: string,
    perPage: number = 30
  ): Promise<ApiResponse<Commit[]>> {
    const response = await api.get<ApiResponse<Commit[]>>(
      `/repos/${owner}/${repo}/commits/${branch}`,
      { params: { per_page: perPage } }
    );
    return response.data;
  },

  async getBranches(
    owner: string,
    repo: string
  ): Promise<ApiResponse<Branch[]>> {
    const response = await api.get<ApiResponse<Branch[]>>(
      `/repos/${owner}/${repo}/branches`
    );
    return response.data;
  },

  async star(owner: string, repo: string): Promise<{ success: boolean }> {
    const response = await api.put(`/repos/${owner}/${repo}/star`);
    return response.data;
  },

  async unstar(owner: string, repo: string): Promise<{ success: boolean }> {
    const response = await api.delete(`/repos/${owner}/${repo}/star`);
    return response.data;
  },

  async fork(
    owner: string,
    repo: string,
    name?: string
  ): Promise<ApiResponse<Repository>> {
    const response = await api.post<ApiResponse<Repository>>(
      `/repos/${owner}/${repo}/fork`,
      { name }
    );
    return response.data;
  },

  async search(params: {
    q: string;
    sort?: 'stars' | 'forks' | 'updated';
    order?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<Repository[]>> {
    const response = await api.get<ApiResponse<Repository[]>>('/repos/search', {
      params,
    });
    return response.data;
  },

  async uploadFiles(
    owner: string,
    repo: string,
    branch: string,
    files: File[],
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ uploadedFiles: string[]; errors?: string[] }>> {
    const formData = new FormData();

    // Get file paths (preserving folder structure for folder uploads)
    const filePaths: string[] = [];
    files.forEach((file) => {
      formData.append('files', file);
      // Use webkitRelativePath if available (folder upload), otherwise use name
      const filePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
      filePaths.push(filePath);
    });

    formData.append('branch', branch);
    formData.append('filePaths', JSON.stringify(filePaths));
    formData.append('message', `Upload ${files.length} file(s) via web interface`);

    const response = await api.post<ApiResponse<{ uploadedFiles: string[]; errors?: string[] }>>(
      `/repos/${owner}/${repo}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      }
    );
    return response.data;
  },
};

export default repositoryService;
