export interface ApiResponse {
    success: boolean;
    message: string;
    data: any | null;
    error?: any | null;
    pagination?: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  }
  
  export const formatResponse = (params: Partial<ApiResponse>): ApiResponse => {
    return {
      success: params.success ?? false,
      message: params.message ?? '',
      data: params.data ?? null,
      ...(params.error && { error: params.error }),
      ...(params.pagination && { pagination: params.pagination })
    };
  };
  