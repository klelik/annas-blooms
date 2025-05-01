import type { Response, Project } from '~/types';

interface UseProjects {
  get: (take?: number, randomize?: boolean) => Promise<Response<Project[]>>;
}

const useProjects = (): UseProjects => {
  const get = async (take?: number, randomize?: boolean): Promise<Response<Project[]>> => {
    const { data, error } = await useFetch<Response<Project[]>>('/api/products', {
      query: {
        take,
        random: !!randomize
      }
    });
    console.log('useFetch', data, error);
    if (error.value) {
      return {
        success: false,
        message: error.value.message || 'An unknown error occurred'
      };
    }

    if (!data.value || !data.value.data) {
      return {
        success: false,
        message: 'No data returned from the server'
      };
    }

    return {
      success: true,
      data: data.value.data,
      total: data.value.total
    };
  };

  return { get };
};

export default useProjects;
