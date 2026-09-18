import type {
  ApplicantRequest,
  PredictionResponse,
} from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function predictApplicant(
  applicant: ApplicantRequest,
): Promise<PredictionResponse> {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(applicant),
  });

  if (!response.ok) {
    let message = "Unable to complete the assessment.";

    try {
      const data = await response.json();

      if (typeof data?.detail === "string") {
        message = data.detail;
      }
    } catch {
      // Keep the generic message when the server response is not JSON.
    }

    throw new Error(message);
  }

  return response.json();
}
export async function getAssessments(): Promise<AssessmentHistoryItem[]> {
  const response = await fetch(`${API_URL}/assessments`);

  if (!response.ok) {
    throw new Error("Unable to load assessment history.");
  }

  return response.json();
}
export async function getAssessment(
  assessmentId: string,
): Promise<AssessmentDetail> {
  const response = await fetch(
    `${API_URL}/assessments/${assessmentId}`,
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Assessment not found.");
    }

    throw new Error("Unable to load assessment.");
  }

  return response.json();
}