import { AxiosRequestConfig } from "axios";
import api from "./api";

export abstract class BaseService {
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await api.get<T>(url, config);

      return response.data;
    } catch (error) {
      this.handleError(error);

      throw error;
    }
  }

  protected async post<T>(
    url: string,
    payload?: unknown,
    successMessage?: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await api.post<T>(url, payload, config);

      if (successMessage) {
        // Notification.success(successMessage);
      }

      return response.data;
    } catch (error) {
      this.handleError(error);

      throw error;
    }
  }

  protected async put<T>(
    url: string,
    payload?: unknown,
    successMessage?: string,
  ): Promise<T> {
    try {
      const response = await api.put<T>(url, payload);

      if (successMessage) {
        //Notification.success(successMessage);
      }

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  protected async delete<T>(url: string, successMessage?: string): Promise<T> {
    try {
      const response = await api.delete<T>(url);

      if (successMessage) {
        // Notification.success(successMessage);
      }

      return response.data;
    } catch (error) {
      this.handleError(error);

      throw error;
    }
  }

  private handleError(error: any) {
    // const message = error?.response?.data?.message ?? "Something went wrong";
    // Notification.error(message);
  }
}
