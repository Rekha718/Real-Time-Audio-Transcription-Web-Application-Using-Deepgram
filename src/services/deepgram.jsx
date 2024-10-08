export const transcribeAudio = async (audioBlob) => {
  const apiKey = '2909135d3d20e0018817fbff6f485e771c3365a2';
  const formData = new FormData();
  formData.append('audio', audioBlob, 'audio.webm');

  const response = await fetch('https://api.deepgram.com/v1/listen', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`,
    },
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('Deepgram Error:', result);
    throw new Error('Transcription failed');
  }

  return result;
};
