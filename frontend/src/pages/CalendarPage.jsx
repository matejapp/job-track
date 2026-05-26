import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import AppShell from "../components/layout/AppShell";
import TopBar from "../components/layout/TopBar";
import ApplicationModal from "../components/modals/ApplicationModal";
import { addApplication, getJobApplications } from "../api/JobApplications";
import { getActivitiesByJob } from "../api/Activities";
import { toastError, toastInfo, toastSuccess } from "../Utils/ToastUtils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function buildCells(year, month) {
  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Mon = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const cells = [];

  for (let i = startWeekday - 1; i >= 0; i--)
    cells.push({ day: prevMonthDays - i, other: true });

  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, other: false, date: new Date(year, month, d) });

  while (cells.length % 7 !== 0 || cells.length < 35)
    cells.push({ day: cells.length - daysInMonth - startWeekday + 1, other: true });

  return cells;
}

function timeRemaining(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  if (diff < 0)   return `${Math.abs(diff)}d ago`;
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 7)   return `In ${diff}d`;
  return `In ${Math.floor(diff / 7)}w`;
}

export default function CalendarPage() {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: apps = [] } = useQuery({
    queryKey: ["apps"],
    queryFn: getJobApplications,
  });

  const addMutation = useMutation({
    mutationFn: addApplication,
    onMutate: () => toastInfo("Adding application..."),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["apps"] }); toastSuccess("Application added"); setModalOpen(false); },
    onError: (err) => toastError(err.message),
  });

  const activitiesQueries = useQueries({
    queries: apps.map((app) => ({
      queryKey: ["activities", app.id],
      queryFn: () => getActivitiesByJob(app.id),
      staleTime: 30_000,
    })),
  });

  const allActivities = activitiesQueries.flatMap((q, i) =>
    (q.data ?? []).map((act) => ({
      ...act,
      jobId: apps[i]?.id,
      jobRole: apps[i]?.role,
      jobName: apps[i]?.name,
    }))
  );

  const year  = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const cells = buildCells(year, month);

  // Build events from apps (applied dates)
  const eventsByDay = {};
  apps.forEach((a) => {
    if (!a.applied) return;
    const d = new Date(a.applied);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const key = d.getDate();
      (eventsByDay[key] = eventsByDay[key] || []).push({
        title: a.name,
        kind: a.stage === "interview" ? "interview" : a.stage === "offer" ? "offer" : "deadline",
        appId: a.id,
      });
    }
  });

  // Add activity events on their scheduled date
  allActivities.forEach((act) => {
    if (!act.date || act.completed) return;
    const d = new Date(act.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const key = d.getDate();
      (eventsByDay[key] = eventsByDay[key] || []).push({
        title: act.name,
        kind: "activity",
        appId: act.jobId,
      });
    }
  });

  // Active pipeline sidebar
  const upcoming = [...apps]
    .filter((a) => ["interview", "offer"].includes(a.stage))
    .sort((a, b) => new Date(a.applied) - new Date(b.applied))
    .slice(0, 5);

  // All upcoming non-completed activities sorted by date
  const upcomingActivities = [...allActivities]
    .filter((act) => !act.completed)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1));
  const goToday   = () => setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1));

  return (
    <AppShell>
      <TopBar crumbs={["Workspace", "Calendar"]} onAdd={() => setModalOpen(true)} />

      <div className="content page-enter">
        <div className="content-head">
          <div className="eyebrow">— Schedule</div>
          <h1>Calendar</h1>
          <p>Interviews, follow-ups, and deadlines in one view.</p>
        </div>

        {/* Toolbar */}
        <div className="cal-toolbar">
          <span className="cal-title">{MONTHS[month]} {year}</span>
          <div className="cal-nav">
            <button className="iconbtn" onClick={prevMonth} aria-label="Previous month">
              <ChevronLeft size={14} />
            </button>
            <button className="iconbtn" onClick={nextMonth} aria-label="Next month">
              <ChevronRight size={14} />
            </button>
          </div>
          <button className="chip" onClick={goToday}>Today</button>
          <span style={{ flex: 1 }} />
          <button className="chip" style={{ gap: 5 }}>
            Month <ChevronDown size={11} />
          </button>
        </div>

        {/* Month grid */}
        <div className="cal-grid">
          {DAYS.map((d) => (
            <div key={d} className="cal-head">{d}</div>
          ))}
          {cells.map((c, i) => {
            const isToday = !c.other
              && c.day === today.getDate()
              && month === today.getMonth()
              && year === today.getFullYear();
            const events = (!c.other && eventsByDay[c.day]) || [];
            return (
              <div key={i} className={`cal-day${c.other ? " is-other" : ""}${isToday ? " is-today" : ""}`}>
                <span className="cal-day-n">{c.day}</span>
                {events.slice(0, 3).map((e, j) => (
                  <div
                    key={j}
                    className={`cal-event ${e.kind}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/applications/${e.appId}`)}
                    title={e.title}
                  >
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{e.title}</span>
                  </div>
                ))}
                {events.length > 3 && (
                  <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "var(--mono)" }}>
                    +{events.length - 3} more
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Below grid: active pipeline + upcoming activities */}
        <div className="cal-side">
          {/* Active pipeline */}
          <div className="card">
            <div className="card-head">
              <h3><span className="lbl">A</span> Active pipeline</h3>
            </div>
            {upcoming.length > 0 ? (
              <div className="upcoming">
                {upcoming.map((a) => {
                  const date = a.applied ? new Date(a.applied) : new Date();
                  const kindClass = a.stage === "offer" ? "offer" : "interview";
                  return (
                    <div
                      className="upcoming-item"
                      key={a.id}
                      onClick={() => navigate(`/applications/${a.id}`)}
                    >
                      <div className="up-date">
                        <span className="d">{date.getDate()}</span>
                        <span className="m">{date.toLocaleString("en", { month: "short" })}</span>
                      </div>
                      <div className="up-body">
                        <div className="title">{a.role} · {a.name}</div>
                        <div className="sub">
                          <span
                            className={`pill ${kindClass}`}
                            style={{ height: 18, fontSize: 10, padding: "0 7px" }}
                          >
                            <span className="pdot" />
                            {a.stage.charAt(0).toUpperCase() + a.stage.slice(1)}
                          </span>
                          {a.location && <><span className="dot">·</span><span>{a.location}</span></>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: "20px 0", textAlign: "center", color: "var(--muted)", fontSize: 13, fontStyle: "italic" }}>
                No active applications
              </div>
            )}
          </div>

          {/* Upcoming activities */}
          <div className="card">
            <div className="card-head">
              <h3><span className="lbl">B</span> Upcoming activities</h3>
            </div>
            {upcomingActivities.length > 0 ? (
              <div className="upcoming">
                {upcomingActivities.map((act) => {
                  const date = new Date(act.date);
                  return (
                    <div
                      className="upcoming-item"
                      key={act.id}
                      onClick={() => navigate(`/applications/${act.jobId}`)}
                    >
                      <div className="up-date">
                        <span className="d">{date.getDate()}</span>
                        <span className="m">{date.toLocaleString("en", { month: "short" })}</span>
                      </div>
                      <div className="up-body">
                        <div className="title">{act.name}</div>
                        <div className="sub">{act.jobRole} · {act.jobName}</div>
                      </div>
                      <div className="up-time">{timeRemaining(act.date)}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: "20px 0", textAlign: "center", color: "var(--muted)", fontSize: 13, fontStyle: "italic" }}>
                No upcoming activities
              </div>
            )}
          </div>
        </div>
      </div>

      <ApplicationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(data) => addMutation.mutate(data)}
      />
    </AppShell>
  );
}
