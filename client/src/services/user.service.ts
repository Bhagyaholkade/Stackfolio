import api from './api';
import { User, Repository, ApiResponse } from '@/types';

export const userService = {
  async getByUsername(username: string): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>(`/users/${username}`);
    return response.data;
  },

  async updateProfile(
    username: string,
    data: {
      name?: string;
      bio?: string;
      location?: string;
      website?: string;
      company?: string;
    }
  ): Promise<ApiResponse<User>> {
    const response = await api.put<ApiResponse<User>>(
      `/users/${username}`,
      data
    );
    return response.data;
  },

  async getRepos(
    username: string,
    params?: {
      sort?: 'updated' | 'created' | 'name' | 'stars';
      direction?: 'asc' | 'desc';
      page?: number;
      per_page?: number;
    }
  ): Promise<ApiResponse<Repository[]>> {
    const response = await api.get<ApiResponse<Repository[]>>(
      `/users/${username}/repos`,
      { params }
    );
    return response.data;
  },

  async follow(username: string): Promise<{ success: boolean }> {
    const response = await api.put(`/users/${username}/follow`);
    return response.data;
  },

  async unfollow(username: string): Promise<{ success: boolean }> {
    const response = await api.delete(`/users/${username}/follow`);
    return response.data;
  },

  async getFollowers(
    username: string,
    params?: { page?: number; per_page?: number }
  ): Promise<ApiResponse<User[]>> {
    const response = await api.get<ApiResponse<User[]>>(
      `/users/${username}/followers`,
      { params }
    );
    return response.data;
  },

  async getFollowing(
    username: string,
    params?: { page?: number; per_page?: number }
  ): Promise<ApiResponse<User[]>> {
    const response = await api.get<ApiResponse<User[]>>(
      `/users/${username}/following`,
      { params }
    );
    return response.data;
  },
};

export default userService;
