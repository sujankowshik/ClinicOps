'use client';

import { useState, useRef } from 'react';
import { Mic, MicOff, Play, Square, Loader2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { voiceTriage, VoiceTriageOutput } from '@/ai/flows/voice-triage-flow';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function VoiceTriagePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [age, setAge] = useState<number>(30);
  const [result, setResult] = useState<VoiceTriageOutput | null>(null);
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = handleRecordingStop;
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setResult(null);
      setTranscribedText(null);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please ensure permissions are granted.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRecordingStop = async () => {
    setIsLoading(true);
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      try {
        const response = await voiceTriage({ audioDataUri: base64Audio, age });
        setResult(response);
      } catch (error) {
        console.error('Error during triage:', error);
        alert('An error occurred during triage. Please try again.');
      } finally {
        setIsLoading(false);
        audioChunksRef.current = [];
      }
    };
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Bot /> AI Voice Triage
          </CardTitle>
          <CardDescription>
            Press record and describe your symptoms. Our AI will provide a preliminary analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="age">Patient's Age</Label>
            <Input 
              id="age" 
              type="number" 
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-24"
              disabled={isRecording || isLoading}
            />
          </div>
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              size="icon"
              className="h-20 w-20 rounded-full"
              disabled={isLoading}
            >
              {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </Button>
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Analyzing...' : isRecording ? 'Recording...' : 'Press to start recording'}
            </p>
          </div>

          {isLoading && <Loader2 className="mx-auto h-8 w-8 animate-spin" />}

          {result && (
            <div className="space-y-4 rounded-lg border bg-card p-4">
              <h3 className="font-semibold text-lg">Triage Result</h3>
              <div className="flex items-center gap-4">
                <Button onClick={togglePlayback} size="icon" variant="outline">
                  {isPlaying ? <Square className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <p className="text-muted-foreground">Listen to the AI's summary</p>
                <audio
                  ref={audioRef}
                  src={result.audioResponseUri}
                  onEnded={() => setIsPlaying(false)}
                />
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Potential Diagnosis:</h4>
                <div className="flex flex-wrap gap-2">
                    {result.evaluation.potentialDiagnoses.map((diag, i) => (
                        <Badge key={i} variant="secondary">{diag}</Badge>
                    ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Recommended Department:</h4>
                <p>{result.evaluation.recommendedDepartment}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Severity:</h4>
                <p>{result.evaluation.severityAssessment}</p>
              </div>
              {result.evaluation.additionalRecommendations && (
                 <div className="space-y-2">
                    <h4 className="font-semibold">Recommendations:</h4>
                    <p className="text-muted-foreground text-sm">{result.evaluation.additionalRecommendations}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
