'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@marlion/ui';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  onTypingSpeed?: (speed: number) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onTranscript, onTypingSpeed, disabled }: VoiceRecorderProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        startTimeRef.current = Date.now();
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + ' ';
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();

      // Calculate typing speed (characters per second)
      const duration = (Date.now() - startTimeRef.current) / 1000;
      const speed = transcript.length / duration;
      if (onTypingSpeed) {
        onTypingSpeed(speed);
      }

      if (transcript.trim()) {
        onTranscript(transcript.trim());
      }
      setTranscript('');
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={isListening ? stopListening : startListening}
        disabled={disabled}
        className={`relative w-20 h-20 rounded-full transition-all duration-300 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 scale-110'
            : 'bg-blue-600 hover:bg-blue-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isListening ? (
          <>
            <div className="absolute inset-0 rounded-full bg-red-500 animate-pulse-ring"></div>
            <svg
              className="w-10 h-10 text-white mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <rect x="7" y="5" width="2" height="10" rx="1" />
              <rect x="11" y="5" width="2" height="10" rx="1" />
            </svg>
          </>
        ) : (
          <svg
            className="w-10 h-10 text-white mx-auto"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>

      {isListening && (
        <div className="text-center">
          <p className="text-blue-400 font-semibold mb-2">Listening...</p>
          {transcript && (
            <p className="text-slate-400 text-sm max-w-md">{transcript}</p>
          )}
        </div>
      )}

      {!isListening && (
        <p className="text-slate-400 text-sm">
          {disabled ? 'Please wait...' : 'Click mic to answer'}
        </p>
      )}
    </div>
  );
}
