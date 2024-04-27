
const oneSignalApiKey = 'ZjRhYzliOTEtZTI2OS00ODA4LWI1ZjYtNjY0NjkyMDBmNzI4';
const oneSignalAppId = '0cad61c6-60db-4baf-94ed-02e0b602dcc6';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { playerIds, pushTitle, pushContent } = body;

  if (!playerIds || !Array.isArray(playerIds) || playerIds.length === 0) {
    return { error: 'Invalid or missing playerIds' };
  }

  if (!pushTitle || typeof pushTitle !== 'string') {
    return { error: 'Invalid or missing pushTitle' };
  }

  if (!pushContent || typeof pushContent !== 'string') {
    return { error: 'Invalid or missing pushContent' };
  }

  const client = createClient({
    authKey: oneSignalApiKey,
    appId: oneSignalAppId,
  });

  try {
    const response = await client.createNotification({
      includePlayerIds: playerIds,
      headings: { en: pushTitle },
      contents: { en: pushContent },
    });
    return response;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { error: 'Failed to send push notification' };
  }
});