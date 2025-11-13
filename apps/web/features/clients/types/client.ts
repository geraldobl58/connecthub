import {
  ClientResponse,
  CreateClient,
  UpdateClient,
  ClientsListResponse,
  ClientsQueryParams,
} from "../schemas/client";

export type {
  ClientResponse,
  CreateClient,
  UpdateClient,
  ClientsListResponse,
  ClientsQueryParams,
};

export interface ClientsInfoResponse {
  success: boolean;
  message?: string;
  data?: ClientsListResponse;
}

export interface ClientDetailResponse {
  success: boolean;
  message?: string;
  data?: ClientResponse;
}

export interface ClientActionResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}
