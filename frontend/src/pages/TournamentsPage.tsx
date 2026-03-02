import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TabButton from "../components/TabButton";
import EventCard from "../components/EventCard";
import { placeholderEvents } from "../utils/placeholderEvents";
import TournamentPageShell from "../features/tournament-ui/components/TournamentPageShell";
import InlineBanner from "../features/tournament-ui/components/InlineBanner";
import { getTournamentList } from "../features/tournament-ui/api/tournamentApi";

const toSafeDate = (dateValue: string | undefined) => {
  if (!dateValue) {
    return null;
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
};

const getEventPhase = (event: any) => {
  const normalizedStatus = (event.registrationStatus || "").toLowerCase();
  if (
    normalizedStatus === "upcoming" ||
    normalizedStatus === "open" ||
    normalizedStatus === "closing"
  ) {
    return "upcoming";
  }
  if (normalizedStatus === "in_progress") {
    return "in_progress";
  }
  if (normalizedStatus === "completed" || normalizedStatus === "closed") {
    return "completed";
  }

  const now = new Date();
  const startDate = toSafeDate(event.date);
  const endDate = toSafeDate(event.endDate || event.date);

  if (!startDate || !endDate) {
    return "upcoming";
  }

  if (now < startDate) {
    return "upcoming";
  }

  if (now > endDate) {
    return "completed";
  }

  return "in_progress";
};

const TournamentsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getTournamentList();

        if (!Array.isArray(data) || data.length === 0) {
          setEvents(placeholderEvents);
          return;
        }

        const formattedEvents = data.map((tournament: any) => ({
          date: tournament.start_date || "TBD",
          endDate: tournament.end_date || tournament.start_date || "TBD",
          city: tournament.city || "TBD",
          eventName: tournament.name || "Tournament Event",
          description:
            tournament.description || "Join us for this tournament event.",
          teamsRegistered: tournament.teams_registered || 0,
          teamLimit: tournament.max_teams || tournament.team_limit || 20,
          registrationStatus: tournament.status || "upcoming",
          id: tournament.id,
        }));

        setEvents(formattedEvents);
      } catch {
        setError("Using demo data - backend connection failed");
        setEvents(placeholderEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    let scoped = [...events];

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      scoped = scoped.filter(
        (event) =>
          event.eventName.toLowerCase().includes(query) ||
          event.city.toLowerCase().includes(query)
      );
    }

    if (activeTab === "upcoming") {
      scoped = scoped.filter((event) => {
        const phase = getEventPhase(event);
        return phase === "upcoming" || phase === "in_progress";
      });
    } else if (activeTab === "past") {
      scoped = scoped.filter((event) => getEventPhase(event) === "completed");
    }

    return scoped;
  }, [events, searchQuery, activeTab]);

  const handleCreate = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login", {
        replace: true,
        state: { from: "/events/create" },
      });
      return;
    }

    navigate("/events/create", { replace: true });
  };

  return (
    <TournamentPageShell
      kicker="Events"
      title="Discover Tournaments"
      subtitle="Search, filter, and open events across upcoming, active, and completed states."
      maxWidth="1220px"
      actions={
        <button
          onClick={handleCreate}
          className="op-btn px-4 py-2 bg-[var(--op-primary)] text-white hover:bg-[var(--op-primary-strong)]"
        >
          Create Tournament
        </button>
      }
    >
      <div className="space-y-4">
        {location.state?.message ? (
          <InlineBanner tone="success" title="Update" message={location.state.message} />
        ) : null}
        {error ? <InlineBanner tone="warning" title="Notice" message={error} /> : null}

        <div className="op-card p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <TabButton active={activeTab === "upcoming"} onClick={() => setActiveTab("upcoming")}>
              Upcoming
            </TabButton>
            <TabButton active={activeTab === "past"} onClick={() => setActiveTab("past")}>
              Past
            </TabButton>
            <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")}>
              All
            </TabButton>
          </div>

          <input
            type="text"
            placeholder="Search by event name or city"
            className="op-input w-full md:w-80 p-2.5"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

        {loading ? (
          <InlineBanner tone="info" title="Loading" message="Fetching events..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id || index} {...event} />
            ))}
          </div>
        )}
      </div>
    </TournamentPageShell>
  );
};

export default TournamentsPage;
