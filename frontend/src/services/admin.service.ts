import { api } from "@/config/axios";
import { generateMockBuckets } from "@/services/mock-data";
import type { Bucket, BucketEntry, ClientType } from "@/types";

/**
 * Get all buckets. Falls back to mock data.
 */
export async function getAllBuckets(): Promise<BucketEntry[]> {
  try {
    const response = await api.get<
      Record<string, Bucket>
    >("/admin/buckets");

    // Ensure response is actually a valid object before parsing
    if (!response.data || typeof response.data !== "object" || Array.isArray(response.data)) {
      throw new Error("Invalid response format: expected a JSON object");
    }

    // The backend returns Map<ClientIdentifier, Bucket> serialized as object
    return Object.entries(response.data).map(([key, bucket]) => {
      const [type, ...valueParts] = key.split(":");
      return {
        client: { type: type as ClientType, value: valueParts.join(":") },
        ...bucket,
      };
    });
  } catch {
    return generateMockBuckets();
  }
}

/**
 * Get a single bucket by client identifier.
 */
export async function getBucket(
  type: ClientType,
  id: string
): Promise<Bucket | null> {
  try {
    const response = await api.get<Bucket>("/admin/bucket", {
      params: { type, id },
    });
    return response.data;
  } catch {
    return null;
  }
}

/**
 * Delete a bucket by client identifier.
 */
export async function deleteBucket(
  type: ClientType,
  id: string
): Promise<string> {
  try {
    const response = await api.delete<string>("/admin/bucket", {
      params: { type, id },
    });
    return response.data;
  } catch {
    // Simulate success for mock mode
    await new Promise((resolve) => setTimeout(resolve, 500));
    return "Bucket deleted successfully.";
  }
}

/**
 * Reset all buckets.
 */
export async function resetAllBuckets(): Promise<string> {
  try {
    const response = await api.post<string>("/admin/reset");
    return response.data;
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return "All buckets reset successfully.";
  }
}
