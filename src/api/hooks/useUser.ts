import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../client";

export interface User {
  id: string;
  email?: string;
  name?: string;
  rut?: string;
}

export async function fetchUser(): Promise<User | null> {
  try {
    const { data } = await apiClient.get<User>("/user/me");
    return data;
  } catch {
    return null;
  }
}

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
}
