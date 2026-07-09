import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllBuckets,
  deleteBucket,
  resetAllBuckets,
} from "@/services/admin.service";
import type { ClientType } from "@/types";

export function useBuckets() {
  return useQuery({
    queryKey: ["buckets"],
    queryFn: getAllBuckets,
    refetchInterval: 30000, // Auto-refresh every 30s
  });
}

export function useDeleteBucket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, id }: { type: ClientType; id: string }) =>
      deleteBucket(type, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["buckets"] });
    },
  });
}

export function useResetBuckets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetAllBuckets,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["buckets"] });
    },
  });
}
