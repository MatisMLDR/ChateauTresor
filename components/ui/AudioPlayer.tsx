import { useState, useRef, useEffect } from "react";
import {AudioPlayerProps} from "@/types";

export function AudioPlayer({ soundLink, className }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const currentTimeRef = useRef<HTMLSpanElement | null>(null);
  const totalTimeRef = useRef<HTMLSpanElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        audioRef.current.play().then(() => {
          setIsLoading(false);
          setIsPlaying(true);
        });
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  const updateProgress = () => {
    if (audioRef.current && progressRef.current && currentTimeRef.current) {
      const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      progressRef.current.style.width = `${percent}%`;
      currentTimeRef.current.textContent = formatTime(audioRef.current.currentTime);
    }
  };

  const updateTotalTime = () => {
    if (audioRef.current && totalTimeRef.current) {
      totalTimeRef.current.textContent = formatTime(audioRef.current.duration);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('loadedmetadata', updateTotalTime);

      return () => {
        if (audio) {
          audio.removeEventListener('ended', handleEnded);
          audio.removeEventListener('timeupdate', updateProgress);
          audio.removeEventListener('loadedmetadata', updateTotalTime);
        }
      };
    }
  }, []);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex h-[56px] w-[400px] min-w-[300px] select-none items-center justify-between rounded-md bg-white px-6 shadow-md">
        <div className="cursor-pointer" onClick={togglePlay}>
          {isLoading ? (
            <div className="relative flex h-4 w-4 animate-spin items-center justify-center">
              <div className="absolute h-full w-full bg-[url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/355309/loading.png')] bg-cover bg-no-repeat"></div>
            </div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 24">
              <path
                fill="#566574"
                fillRule="evenodd"
                d={isPlaying ? 'M0 0h6v24H0zM12 0h6v24h-6z' : 'M18 12L0 24V0'}
              />
            </svg>
          )}
        </div>
        <div className="font-roboto mx-6 flex flex-grow items-center justify-between text-sm leading-5 text-gray-600">
          <span ref={currentTimeRef}>0:00</span>
          <div className="relative mx-4 h-1 flex-grow cursor-pointer rounded-md bg-gray-300">
            <div className="absolute h-full rounded-md bg-teal-500" ref={progressRef}></div>
          </div>
          <span ref={totalTimeRef}>0:00</span>
        </div>
        <audio ref={audioRef}>
          <source
            src={soundLink}
            type="audio/mpeg"
          />
        </audio>
      </div>
    </div>
  );
}
