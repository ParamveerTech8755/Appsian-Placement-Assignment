import type { ScheduleRequest, ScheduleResponse } from "../types/project.types";
import { authUtils } from "../utils/auth.utils";

const API_BASE_URL = "http://localhost:5000/api";

export const schedulerService = {
  async generateSchedule(
    projectId: number,
    request: ScheduleRequest,
  ): Promise<ScheduleResponse> {
    const response = await fetch(
      `${API_BASE_URL}/v1/projects/${projectId}/schedule`,
      {
        method: "POST",
        headers: authUtils.getAuthHeaders(),
        body: JSON.stringify(request),
      },
    );

    if (!response.ok) throw new Error("Failed to generate schedule");
    return response.json();
  },
};
