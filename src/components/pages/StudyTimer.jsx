import React, { useState, useEffect } from 'react';
import { studySessionService } from '@/services/api/studySessionService';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import ProgressRing from '@/components/molecules/ProgressRing';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

function StudyTimer() {
  const [duration, setDuration] = useState(25); // minutes
  const [timeRemaining, setTimeRemaining] = useState(0); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isRunning && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused, timeRemaining]);

  async function loadSessions() {
    try {
      setLoading(true);
      const data = await studySessionService.getAll();
      setSessions(data.sort((a, b) => new Date(b.endTime) - new Date(a.endTime)).slice(0, 10));
    } catch (error) {
      toast.error('Failed to load session history');
    } finally {
      setLoading(false);
    }
  }

  function handleStart() {
    const totalSeconds = duration * 60;
    setTimeRemaining(totalSeconds);
    setIsRunning(true);
    setIsPaused(false);
    setSessionStartTime(new Date().toISOString());
    toast.info('Study session started!');
  }

  function handlePause() {
    setIsPaused(true);
    toast.info('Session paused');
  }

  function handleResume() {
    setIsPaused(false);
    toast.info('Session resumed');
  }

  function handleStop() {
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(0);
    setSessionStartTime(null);
    toast.info('Session stopped');
  }

  async function handleSessionComplete() {
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(0);

    const endTime = new Date().toISOString();
    
try {
      await studySessionService.create({
        start_time_c: sessionStartTime,
        end_time_c: endTime
      });
      
      await loadSessions();
      toast.success('Study session completed! Great work!');
    } catch (error) {
      toast.error('Failed to save session');
    }
    
    setSessionStartTime(null);
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  }

  const progress = isRunning ? ((duration * 60 - timeRemaining) / (duration * 60)) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Timer Card */}
        <Card className="bg-white shadow-elevated">
          <div className="p-8">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <ApperIcon name="Clock" className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Study Timer
                </h1>
              </div>

              {/* Timer Display */}
              <div className="flex justify-center">
                <ProgressRing
                  progress={progress}
                  size={240}
                  strokeWidth={12}
                  className="text-primary"
                >
                  <div className="text-center">
                    <div className="text-6xl font-bold text-gray-800">
                      {isRunning ? formatTime(timeRemaining) : formatTime(duration * 60)}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      {isRunning ? (isPaused ? 'Paused' : 'In Progress') : 'Ready to start'}
                    </div>
                  </div>
                </ProgressRing>
              </div>

              {/* Duration Input */}
              {!isRunning && (
                <div className="max-w-xs mx-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="120"
                    value={duration}
                    onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-center text-lg font-semibold"
                  />
                </div>
              )}

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                {!isRunning ? (
                  <Button
                    onClick={handleStart}
                    variant="primary"
                    size="lg"
                    icon="Play"
                  >
                    Start Session
                  </Button>
                ) : (
                  <>
                    {isPaused ? (
                      <Button
                        onClick={handleResume}
                        variant="primary"
                        size="lg"
                        icon="Play"
                      >
                        Resume
                      </Button>
                    ) : (
                      <Button
                        onClick={handlePause}
                        variant="secondary"
                        size="lg"
                        icon="Pause"
                      >
                        Pause
                      </Button>
                    )}
                    <Button
                      onClick={handleStop}
                      variant="outline"
                      size="lg"
                      icon="Square"
                    >
                      Stop
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Session History */}
        <Card className="bg-white shadow-elevated">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <ApperIcon name="History" className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-800">Recent Sessions</h2>
            </div>

            {loading ? (
              <Loading />
            ) : sessions.length === 0 ? (
              <Empty message="No study sessions yet. Start your first session!" />
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
<div
                    key={session.Id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <ApperIcon name="Clock" className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {formatDuration(session.duration_c)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(session.endTime), 'MMM d, yyyy • h:mm a')}
                        </div>
                      </div>
                    </div>
                    <ApperIcon name="CheckCircle" className="w-5 h-5 text-success" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default StudyTimer;