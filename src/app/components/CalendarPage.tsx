import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from "lucide-react";

type ViewMode = "day" | "week" | "month";

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  color: string;
}

const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
  });

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getWeekDays = (date: Date) => {
    const days = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const addEvent = () => {
    if (newEvent.title.trim()) {
      setEvents([
        ...events,
        {
          id: Date.now(),
          title: newEvent.title,
          date: newEvent.date,
          startTime: newEvent.startTime,
          endTime: newEvent.endTime,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
      ]);
      setNewEvent({
        title: "",
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00",
        endTime: "10:00",
      });
      setShowEventModal(false);
    }
  };

  const deleteEvent = (id: number) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const getEventsForDate = (date: string) => {
    return events.filter((event) => event.date === date);
  };

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="min-h-full bg-white">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl">
              {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              {(["day", "week", "month"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-1 rounded transition-colors capitalize ${
                    viewMode === mode
                      ? "bg-white shadow-sm"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <button
              onClick={goToToday}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateDate("prev")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => navigateDate("next")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {viewMode === "week" && (
            <div className="flex flex-col">
              <div className="grid grid-cols-8 border-b border-gray-200">
                <div className="p-4"></div>
                {getWeekDays(currentDate).map((date, index) => {
                  const today = isToday(date);
                  return (
                    <div key={index} className="p-4 text-center border-l border-gray-200">
                      <div className="text-sm text-gray-500">
                        {date.toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div className={`text-2xl mt-1 ${today ? "bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto" : ""}`}>
                        {date.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-8 relative">
                <div className="flex flex-col">
                  {hours.map((hour) => (
                    <div key={hour} className="h-16 border-b border-gray-200 p-2 text-right text-sm text-gray-500">
                      {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                    </div>
                  ))}
                </div>
                {getWeekDays(currentDate).map((date, dayIndex) => {
                  const dateStr = formatDate(date);
                  const dayEvents = getEventsForDate(dateStr);
                  return (
                    <div key={dayIndex} className="relative border-l border-gray-200">
                      {hours.map((hour) => (
                        <div
                          key={hour}
                          className="h-16 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            setNewEvent({
                              ...newEvent,
                              date: dateStr,
                              startTime: `${hour.toString().padStart(2, "0")}:00`,
                              endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
                            });
                            setShowEventModal(true);
                          }}
                        />
                      ))}
                      {dayEvents.map((event) => {
                        const startMinutes = timeToMinutes(event.startTime);
                        const endMinutes = timeToMinutes(event.endTime);
                        const top = (startMinutes / 60) * 64;
                        const height = ((endMinutes - startMinutes) / 60) * 64;
                        return (
                          <div
                            key={event.id}
                            className="absolute left-1 right-1 rounded p-2 text-white text-sm overflow-hidden group cursor-pointer"
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                              backgroundColor: event.color,
                            }}
                          >
                            <div className="font-semibold truncate">{event.title}</div>
                            <div className="text-xs opacity-90">
                              {event.startTime} - {event.endTime}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteEvent(event.id);
                              }}
                              className="absolute top-1 right-1 p-1 bg-black/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === "day" && (
            <div className="flex flex-col">
              <div className="grid grid-cols-2 border-b border-gray-200">
                <div className="p-4"></div>
                <div className="p-4 text-center border-l border-gray-200">
                  <div className="text-sm text-gray-500">
                    {currentDate.toLocaleDateString("en-US", { weekday: "long" })}
                  </div>
                  <div className={`text-2xl mt-1 ${isToday(currentDate) ? "bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto" : ""}`}>
                    {currentDate.getDate()}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 relative">
                <div className="flex flex-col">
                  {hours.map((hour) => (
                    <div key={hour} className="h-16 border-b border-gray-200 p-2 text-right text-sm text-gray-500">
                      {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                    </div>
                  ))}
                </div>
                <div className="relative border-l border-gray-200">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="h-16 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setNewEvent({
                          ...newEvent,
                          date: formatDate(currentDate),
                          startTime: `${hour.toString().padStart(2, "0")}:00`,
                          endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
                        });
                        setShowEventModal(true);
                      }}
                    />
                  ))}
                  {getEventsForDate(formatDate(currentDate)).map((event) => {
                    const startMinutes = timeToMinutes(event.startTime);
                    const endMinutes = timeToMinutes(event.endTime);
                    const top = (startMinutes / 60) * 64;
                    const height = ((endMinutes - startMinutes) / 60) * 64;
                    return (
                      <div
                        key={event.id}
                        className="absolute left-1 right-1 rounded p-2 text-white text-sm overflow-hidden group cursor-pointer"
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          backgroundColor: event.color,
                        }}
                      >
                        <div className="font-semibold truncate">{event.title}</div>
                        <div className="text-xs opacity-90">
                          {event.startTime} - {event.endTime}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEvent(event.id);
                          }}
                          className="absolute top-1 right-1 p-1 bg-black/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {viewMode === "month" && (
            <div className="grid grid-cols-7">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-semibold text-gray-600 p-4 border-b border-gray-200">
                  {day}
                </div>
              ))}
              {getDaysInMonth(currentDate).map((date, index) => {
                if (!date) {
                  return <div key={index} className="border-b border-r border-gray-200 bg-gray-50" />;
                }
                const dateStr = formatDate(date);
                const dayEvents = getEventsForDate(dateStr);
                return (
                  <div
                    key={index}
                    className="min-h-24 p-2 border-b border-r border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setNewEvent({ ...newEvent, date: dateStr });
                      setShowEventModal(true);
                    }}
                  >
                    <div className={`text-sm mb-1 ${isToday(date) ? "bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center" : ""}`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs p-1 rounded text-white truncate"
                          style={{ backgroundColor: event.color }}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500">+{dayEvents.length - 3} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl">Add Event</h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-600">Event Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Meeting, Call, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-600">Date</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-600">Start Time</label>
                  <input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-600">End Time</label>
                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addEvent}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
