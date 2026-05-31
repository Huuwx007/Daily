import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { PomodoroPage } from "./components/PomodoroPage";
import { CalendarPage } from "./components/CalendarPage";
import { TodoListPage } from "./components/TodoListPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "pomodoro", Component: PomodoroPage },
      { path: "calendar", Component: CalendarPage },
      { path: "todos", Component: TodoListPage },
    ],
  },
]);
