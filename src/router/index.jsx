import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout";

// Lazy load page components
const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Courses = lazy(() => import("@/components/pages/Courses"));
const Assignments = lazy(() => import("@/components/pages/Assignments"));
const Calendar = lazy(() => import("@/components/pages/Calendar"));
const StudyTimer = lazy(() => import("@/components/pages/StudyTimer"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

// Suspense wrapper component
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<div>Loading.....</div>}>
    {children}
  </Suspense>
);

// Main routes configuration
const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <SuspenseWrapper>
        <Dashboard />
      </SuspenseWrapper>
    )
  },
  {
    path: "courses",
    element: (
      <SuspenseWrapper>
        <Courses />
      </SuspenseWrapper>
    )
  },
  {
    path: "assignments",
    element: (
      <SuspenseWrapper>
        <Assignments />
      </SuspenseWrapper>
    )
  },
  {
    path: "calendar",
    element: (
      <SuspenseWrapper>
        <Calendar />
      </SuspenseWrapper>
    )
  },
  {
    path: "study-timer",
    element: (
      <SuspenseWrapper>
        <StudyTimer />
      </SuspenseWrapper>
    )
  },
  {
    path: "*",
    element: (
      <SuspenseWrapper>
        <NotFound />
      </SuspenseWrapper>
    )
  }
];

// Routes array with layout
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);