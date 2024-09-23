import React, { useState, useEffect } from 'react';
import Microphone from './components/Microphone';
import { transcribeAudio } from './services/deepgram';

const App = () => {
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  const [pastTranscriptions, setPastTranscriptions] = useState(
    JSON.parse(localStorage.getItem('transcriptions')) || []
  );

  const handleStopRecording = async (audioBlob) => {
    try {
      const data = await transcribeAudio(audioBlob);
      const newTranscription = data.results.channels[0].alternatives[0].transcript;
      setTranscription(newTranscription);

      const updatedTranscriptions = [...pastTranscriptions, newTranscription];
      setPastTranscriptions(updatedTranscriptions);
      localStorage.setItem('transcriptions', JSON.stringify(updatedTranscriptions));
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to transcribe audio');
      setTranscription('');
    }
  };

  return (
    <div className="app p-4 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Audio Transcription</h1>
      <Microphone onStopRecording={handleStopRecording} />
      
      {transcription && (
        <div className="transcription mt-4 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold">Transcription:</h2>
          <p>{transcription}</p>
        </div>
      )}
      
      {error && (
        <div className="error mt-4 text-red-500">
          <p>{error}</p>
        </div>
      )}

      <div className="past-transcriptions mt-6">
        <h2 className="text-xl font-semibold">Past Transcriptions:</h2>
        <ul className="list-disc pl-4">
          {pastTranscriptions.map((transcript, index) => (
            <li key={index}>{transcript}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
