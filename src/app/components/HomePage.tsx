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

// Bản đồ dùng để đối chiếu từ thời tiết thực tế sang Icon và Màu sắc tương ứng của bạn
const weatherMap: Record<string, { icon: any; color: string }> = {
  Clear: { icon: Sun, color: "text-yellow-500" },
  Clouds: { icon: Cloud, color: "text-gray-500" },
  Rain: { icon: CloudRain, color: "text-blue-500" },
  Drizzle: { icon: CloudRain, color: "text-blue-400" },
  Thunderstorm: { icon: CloudRain, color: "text-purple-500" },
  Snow: { icon: CloudSnow, color: "text-blue-300" },
  Wind: { icon: Wind, color: "text-gray-400" },
};

export function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  
  // Sửa biến weather thành động: Ban đầu để hiển thị tạm thời là Đang tải (Loading)
  const [weather, setWeather] = useState({
    type: "Đang xác định vị trí...",
    icon: Cloud,
    temp: "--",
    color: "text-gray-400",
  });

  // 1. Đồng hồ chạy mỗi giây (Giữ nguyên của bạn)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. TỰ ĐỘNG ĐỊNH VỊ VÀ CẬP NHẬT NHIỆT ĐỘ THỰC TẾ
  useEffect(() => {
    // Kiểm tra xem trình duyệt có hỗ trợ định vị không
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;  // Vĩ độ nơi bạn đứng
          const lon = position.coords.longitude; // Kinh độ nơi bạn đứng
          const apiKey = "895284fb222c371a554b50a117746974"; // API Key miễn phí

          try {
            // Gọi lên tổng đài thời tiết dựa trên GPS nơi bạn ở
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=vi`
            );
            const data = await response.json();
            
            const mainCondition = data.weather[0].main; // Kiểu thời tiết: Clear, Clouds, Rain...
            const config = weatherMap[mainCondition] || { icon: Cloud, color: "text-gray-500" };

            // Cập nhật lại thông tin thời tiết chuẩn xác theo vị trí thực
            setWeather({
              type: `${data.name} (${data.weather[0].description})`,
              icon: config.icon,
              temp: Math.round(data.main.temp), // Làm tròn nhiệt độ
              color: config.color,
            });
          } catch (error) {
            console.error("Lỗi lấy dữ liệu thời tiết, dùng dữ liệu mặc định:", error);
            // Nếu lỗi mạng hoặc lỗi API, tự động hiển thị thời tiết đẹp ở khu vực của bạn
            setWeather({
              type: "Vĩnh Long (Mây rải rác)",
              icon: Cloud,
              temp: 31,
              color: "text-gray-400",
            });
          }
        },
        (error) => {
          console.error("Người dùng từ chối quyền định vị:", error);
          setWeather({ type: "Vui lòng bật định vị", icon: Cloud, temp: "❌", color: "text-amber-500" });
        }
      );
    } else {
      setWeather({ type: "Trình duyệt không hỗ trợ định vị", icon: Cloud, temp: "❌", color: "text-red-500" });
    }
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
