import React, { useState, useEffect } from 'react';

const Microphone = ({ onStopRecording }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  useEffect(() => {
    // Setup MediaRecorder when the component mounts
    const getMicrophoneAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        setMediaRecorder(recorder);
      } catch (err) {
        console.error('Error accessing microphone', err);
      }
    };
    getMicrophoneAccess();
  }, []);

  const handleStartRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setIsRecording(true);

      const audioChunks = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        onStopRecording(audioBlob); // Pass audioBlob to parent
      };
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        className={`px-4 py-2 text-white rounded ${isRecording ? 'bg-red-600' : 'bg-green-600'}`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      <div className="mt-2">
        {isRecording ? <p>Recording in progress...</p> : <p>Not recording</p>}
      </div>
    </div>
  );
};

export default Microphone;
