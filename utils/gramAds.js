export async function showGramAds(chatId) {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzMjQwNiIsImp0aSI6ImI0NDc1NjYwLTU1ZjUtNDI1NC1iNDJhLTRkNzIyNjI3Mzg0YSIsIm5hbWUiOiLQkdCw0LrRgdC40LoiLCJib3RpZCI6IjE0NDM4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMjQwNiIsIm5iZiI6MTc0NjM2MzMxMCwiZXhwIjoxNzQ2NTcyMTEwLCJpc3MiOiJTdHVnbm92IiwiYXVkIjoiVXNlcnMifQ.5r8_8SRFBVXlf4kpLroY0lHCGjrdFanuTyhcY083PiY";

  try {
    const headers = new Headers();
    headers.append("Authorization", `bearer ${token}`);

    const sendPostDto = { SendToChatId: chatId };
    const json = JSON.stringify(sendPostDto);
    const content = new Blob([json], { type: "application/json" });

    const response = await fetch("https://api.gramads.net/ad/SendPost", {
      method: "POST",
      body: content,
      headers: headers,
    });

    if (!response.ok) {
      console.error('GramAds error:', await response.text());
      return false;
    }

    const result = await response.text();
    console.log('GramAds result:', result);
    return true;
  } catch (error) {
    console.error('GramAds error:', error);
    return false;
  }
}
