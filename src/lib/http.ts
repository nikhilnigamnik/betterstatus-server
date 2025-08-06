export async function fetchStatus(url: string) {
  const startTime = performance.now();
  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || '';
    let message: string;

    if (contentType.includes('application/json')) {
      const data = await response.json();
      message = data.message || response.statusText;
    } else {
      message = response.statusText;
    }

    const endTime = performance.now();

    return {
      status: response.status,
      message,
      success: response.ok,
      responseTime: Math.round(endTime - startTime),
    };
  } catch (error) {
    const endTime = performance.now();
    return {
      status: 500,
      message: error instanceof Error ? error.message : 'Unknown error',
      success: false,
      responseTime: Math.round(endTime - startTime),
    };
  }
}
