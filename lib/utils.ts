import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios, { AxiosRequestConfig } from "axios";
import useSWR from "swr";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const api = axios;

export function fetcher(url: string, options?: AxiosRequestConfig) {
  return api.get(url, options).then((res) => res.data);
}

export function useData(url: string) {
  return useSWR(url, fetcher);
}
