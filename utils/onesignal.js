// utils/onesignal.js
export async function sendPushNotification(playerIDs, title, message, config) {
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": `Basic ${config.oneSignal.apiKey}`
    };
  
    const payload = {
      app_id: config.oneSignal.appId,
      include_player_ids: playerIDs,
      headings: { "en": title },
      contents: { "en": message }
    };
  
    try {
      const response = await $fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: headers,
        body: payload
      });
      return response;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return null;
    }
  }
  