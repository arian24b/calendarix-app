# Calendarix PWA - Cursor Rules

You are an expert developer working on **Calendarix**, a Progressive Web App (PWA) for calendar management, tasks, alarms, and productivity features. This is a mobile-first application built with modern web technologies and offline-first architecture.

## Project Context

**Calendarix** - "Organize your life with Calendarix - Events, Tasks, and Reminders"
- **Type**: Progressive Web App (PWA) with offline support
- **Target**: Mobile-first calendar and productivity application
- **Architecture**: Offline-first with API fallbacks, service layer pattern

## Core Technologies

### Frontend Stack
- **React 19** with TypeScript (strict mode)
- **Next.js 15** (App Router, standalone output)
- **Serwist** for PWA service worker and caching
- **Tailwind CSS 4.x** for styling
- **Shadcn UI** + **Radix UI** components

### Key Libraries
- **date-fns** for date manipulation (prefer over moment.js)
- **react-day-picker** for calendar components
- **react-hook-form** for form management
- **framer-motion** for animations
- **sonner** for toast notifications
- **lucide-react** for icons

### PWA & Performance
- **Serwist** service worker for caching and offline support
- **localStorage** for offline data persistence
- **Online/offline state** management patterns

## Development Guidelines

### 1. PWA-First Development
```typescript
// Always consider offline functionality
const [isOnline, setIsOnline] = useState<boolean>(
  typeof navigator !== "undefined" ? navigator.onLine : true
);

// Implement online/offline listeners
useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}, []);
```

### 2. Service Layer Architecture
- Use centralized services in `lib/services/` for data management
- Each service handles both API calls and localStorage fallbacks
- Pattern: `calendar-service.ts`, `task-service.ts`, `alarm-service.ts`, etc.

```typescript
// Service pattern example
export async function getEvents(calendarId: string): Promise<EventOut[]> {
  if (isPreviewEnvironment() || !isUserLoggedIn()) {
    return getMockEvents();
  }

  try {
    return await apiRequest<EventOut[]>({
      method: "GET",
      path: `/v1/calendars/${calendarId}/events`,
      requiresAuth: true,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return getStoredEvents(); // localStorage fallback
  }
}
```

### 3. Calendar & Date Handling
- **Always use date-fns** for date operations
- **Use ISO strings** for API communication
- **Implement timezone awareness** for calendar events
- **Format dates consistently** across components

```typescript
import { format, parseISO, isToday, startOfDay } from 'date-fns';

// Standard date formatting
const formatEventTime = (date: Date) =>
  format(date, 'HH:mm');

const formatEventDate = (date: Date) =>
  format(date, 'yyyy-MM-dd');

// Event date utilities
const isEventToday = (eventDate: Date) =>
  isToday(eventDate);
```

### 4. Mobile-First UI Patterns
- **Bottom navigation** for main app navigation
- **Sheet components** for mobile forms and modals
- **Touch-friendly** button sizes (min 44px)
- **Responsive breakpoints**: mobile-first approach

```typescript
// Mobile-first responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
</div>

// Touch-friendly interactive elements
<button className="min-h-[44px] min-w-[44px] p-3">
```

### 5. State Management Patterns
- **useState** for local component state
- **localStorage** for offline data persistence
- **URL state** for shareable app state
- **Avoid global state** unless necessary

```typescript
// Offline data persistence pattern
const [events, setEvents] = useState<CalendarEvent[]>([]);

useEffect(() => {
  const savedEvents = localStorage.getItem('localEvents');
  if (savedEvents) {
    setEvents(JSON.parse(savedEvents));
  }
}, []);

const saveEvent = (event: CalendarEvent) => {
  const updatedEvents = [...events, event];
  setEvents(updatedEvents);
  localStorage.setItem('localEvents', JSON.stringify(updatedEvents));
};
```

### 6. Error Handling & Loading States
- **Always handle loading states** with proper UI feedback
- **Graceful error fallbacks** to offline mode
- **Toast notifications** for user feedback using Sonner
- **Error boundaries** for component-level error handling

```typescript
const [isLoading, setIsLoading] = useState(false);

const handleCreateEvent = async () => {
  try {
    setIsLoading(true);
    await createEvent(eventData);
    toast.success("Event created successfully");
  } catch (error) {
    console.error("Error creating event:", error);
    toast.error("Failed to create event");
    // Fallback to localStorage
    saveEventLocally(eventData);
  } finally {
    setIsLoading(false);
  }
};
```

## Code Standards

### TypeScript Guidelines
- **Strict TypeScript** configuration
- **Interface definitions** for all data structures
- **Proper typing** for calendar events, tasks, alarms
- **Export interfaces** from service files

```typescript
// Calendar domain types
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  description?: string;
  calendarId: string;
}

interface CalendarOut {
  id: string;
  user_id: number;
  name: string;
  provider: string;
  external_calendar_id: string | null;
  created_at: string;
  updated_at: string | null;
}
```

### Component Patterns
- **Functional components** with TypeScript
- **Named exports** for components
- **Event handlers** prefixed with `handle`
- **Custom hooks** for reusable logic

```typescript
// Component structure
export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventCreate = async (eventData: CalendarEvent) => {
    // Implementation
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Component JSX */}
    </div>
  );
}
```

### Performance Optimization
- **Minimize 'use client'** - prefer Server Components
- **Optimize images** for PWA (WebP, proper sizing)
- **Lazy load** non-critical components
- **Memoize expensive calculations** with useMemo
- **Debounce user inputs** for search/filtering

### PWA-Specific Guidelines
- **Implement proper caching** strategies with Serwist
- **Handle installation prompts** appropriately
- **Background sync** for offline actions
- **Push notifications** when supported
- **Manifest.json** optimization for app-like experience

### File Organization
```
app/
├── calendar/          # Calendar feature pages
├── clock/            # Clock/alarm feature pages
├── tasks/            # Task management pages
├── events/           # Events overview pages
├── components/       # Shared UI components
│   └── ui/          # Shadcn UI components
├── sw.ts            # Service worker
└── manifest.ts      # PWA manifest

lib/
├── services/        # Business logic services
├── utils.ts         # Utility functions
└── api-client.ts    # API communication

components/
├── bottom-nav.tsx   # App navigation
├── calendar/        # Calendar-specific components
└── ui/             # Reusable UI components
```

## Key Conventions

### Calendar Application Patterns
- **Always validate dates** before API calls
- **Handle timezone considerations** for events
- **Implement conflict detection** for overlapping events
- **Provide clear visual feedback** for loading states
- **Maintain offline/online sync** strategies

### Error Handling
- **Graceful degradation** to offline mode
- **User-friendly error messages** via toast notifications
- **Automatic retry** mechanisms for failed API calls
- **Local storage** as fallback for all critical data

### Accessibility
- **ARIA labels** for calendar navigation
- **Keyboard navigation** support for date pickers
- **Screen reader** friendly event descriptions
- **Focus management** in modal dialogs

This file defines the development standards and patterns specific to the Calendarix PWA project. Follow these guidelines to maintain consistency and quality across the application.
