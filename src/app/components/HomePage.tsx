import { useState, useEffect } from "react";
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Image } from "lucide-react";

const wallpapers = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
];

const weatherConditions = [
  { type: "Sunny", icon: Sun, temp: 24, color: "text-yellow-500" },
  { type: "Cloudy", icon: Cloud, temp: 20, color: "text-gray-500" },
  { type: "Rainy", icon: CloudRain, temp: 16, color: "text-blue-500" },
  { type: "Snowy", icon: CloudSnow, temp: -2, color: "text-blue-300" },
  { type: "Windy", icon: Wind, temp: 18, color: "text-gray-400" },
];

export function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [weather] = useState(weatherConditions[0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const WeatherIcon = weather.icon;

  return (
    <div
      className="size-full flex items-center justify-center relative"
      style={{ background: wallpapers[wallpaperIndex] }}
    >
      <div className="absolute top-8 right-8 flex gap-2">
        {wallpapers.map((_, index) => (
          <button
            key={index}
            onClick={() => setWallpaperIndex(index)}
            className={`w-10 h-10 rounded-lg shadow-lg transition-all hover:scale-110 ${
              wallpaperIndex === index ? "ring-4 ring-white" : ""
            }`}
            style={{ background: wallpapers[index] }}
            aria-label={`Wallpaper ${index + 1}`}
          >
            {wallpaperIndex === index && <Image className="m-auto text-white" size={20} />}
          </button>
        ))}
      </div>

      <div className="text-center text-white">
        <div className="mb-8">
          <div className="text-8xl mb-4 drop-shadow-lg">
            {formatTime(currentTime)}
          </div>
          <div className="text-2xl opacity-90">{formatDate(currentTime)}</div>
        </div>

        <div className="mt-12 bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-center space-x-4">
            <WeatherIcon className={`${weather.color}`} size={64} strokeWidth={1.5} />
            <div className="text-left">
              <div className="text-6xl">{weather.temp}°C</div>
              <div className="text-xl opacity-90">{weather.type}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
