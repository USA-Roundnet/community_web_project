import { useNavigate } from "react-router-dom";
import StatusPill from "../features/tournament-ui/components/StatusPill";

interface EventCardProps {
  date: string;
  endDate?: string;
  city: string;
  eventName: string;
  description: string;
  teamsRegistered: number;
  teamLimit: number;
  registrationStatus: string;
  id?: number;
}

const toneFromStatus = (status: string) => {
  const normalized = (status || "").toLowerCase();
  if (normalized === "upcoming" || normalized === "open" || normalized === "closing") {
    return "upcoming";
  }
  if (normalized === "in_progress") {
    return "in_progress";
  }
  if (normalized === "completed" || normalized === "closed") {
    return "completed";
  }
  return "neutral";
};

const EventCard = (event: EventCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="op-card text-left p-4 w-full hover:shadow-md transition"
      onClick={() => navigate(`/events/${event.id}`)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="op-display text-lg font-semibold text-[var(--op-primary-strong)]">
            {event.eventName}
          </h3>
          <p className="op-ui text-sm text-[var(--op-text-muted)] mt-1">{event.city}</p>
        </div>
        <StatusPill
          label={(event.registrationStatus || "unknown").replace("_", " ")}
          tone={toneFromStatus(event.registrationStatus)}
        />
      </div>

      <p className="op-ui text-sm text-[var(--op-text-muted)] mt-2 line-clamp-2">
        {event.description}
      </p>

      <div className="op-ui mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <div className="op-card-muted p-2">
          <p className="text-xs uppercase tracking-wide text-[var(--op-text-muted)]">Dates</p>
          <p className="font-semibold">{event.date} {event.endDate ? `- ${event.endDate}` : ""}</p>
        </div>
        <div className="op-card-muted p-2">
          <p className="text-xs uppercase tracking-wide text-[var(--op-text-muted)]">Teams</p>
          <p className="font-semibold">
            {event.teamLimit
              ? `${event.teamsRegistered}/${event.teamLimit}`
              : `${event.teamsRegistered}`}
          </p>
        </div>
      </div>
    </button>
  );
};

export default EventCard;
