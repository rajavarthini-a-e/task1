export interface SnapServeOutboundPayload {
  agentId: number;
  toNumber: string;
  webhookBaseUrl: string;
  metadata?: Record<string, unknown>;
}

export async function triggerSnapServeCall(payload: SnapServeOutboundPayload) {
  const url = process.env.SNAPSERVE_API_URL;
  const token = process.env.SNAPSERVE_API_TOKEN;
  const webhookBaseUrl = process.env.SNAPSERVE_WEBHOOK_BASE_URL;

  if (!url || !token || !webhookBaseUrl) {
    return {
      success: false,
      reason: 'SNAPSERVE_API_URL, SNAPSERVE_API_TOKEN, or SNAPSERVE_WEBHOOK_BASE_URL is not configured',
    };
  }

  const body = {
    agentId: payload.agentId,
    toNumber: payload.toNumber,
    webhookBaseUrl,
    metadata: payload.metadata,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    return {
      success: response.ok,
      status: response.status,
      body: text,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Unknown error while triggering SnapServe call',
    };
  }
}
