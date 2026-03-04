import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TournamentPageShell from "../features/tournament-ui/components/TournamentPageShell";
import InlineBanner from "../features/tournament-ui/components/InlineBanner";
import {
  autoGeneratePoolMatches,
  createMatch,
  generatePools,
  getMatchCandidates,
  getMatches,
  getTournamentDivisions,
  getTournamentRegistrations,
  getTournamentStats,
  reorderTournamentRegistrations,
  saveMatchResults,
  updateMatch,
} from "../features/tournament-ui/api/tournamentApi";

const formatDateTime = (dateValue) => {
  if (!dateValue) {
    return "TBD";
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return "TBD";
  }

  return parsedDate.toLocaleString();
};

const toDateInputValue = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toTimeInputValue = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const hours = String(parsedDate.getHours()).padStart(2, "0");
  const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const normalizeOptionalPositiveInt = (value, fieldLabel) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const numericValue = Number(value);
  if (!Number.isInteger(numericValue) || numericValue <= 0) {
    throw new Error(`${fieldLabel} must be a positive integer.`);
  }

  return numericValue;
};

const sortRegistrationsBySeed = (registrations) => {
  return [...registrations].sort((left, right) => {
    const leftSeed = Number(left.seed);
    const rightSeed = Number(right.seed);
    const leftHasSeed = Number.isInteger(leftSeed) && leftSeed > 0;
    const rightHasSeed = Number.isInteger(rightSeed) && rightSeed > 0;

    if (leftHasSeed && rightHasSeed && leftSeed !== rightSeed) {
      return leftSeed - rightSeed;
    }

    if (leftHasSeed && !rightHasSeed) {
      return -1;
    }

    if (!leftHasSeed && rightHasSeed) {
      return 1;
    }

    return `${left.team_name || ""}`.localeCompare(`${right.team_name || ""}`);
  });
};

const normalizeGroupId = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const BOARD_STAGED_MESSAGE = "Board changes are staged locally. Save when ready.";
const EMPTY_OUTCOME_STATS = {
  rules: null,
  team_stats: [],
  player_stats: [],
};

const normalizeOutcomeStats = (statsPayload) => ({
  rules:
    statsPayload && typeof statsPayload === "object"
      ? statsPayload.rules || null
      : null,
  team_stats: Array.isArray(statsPayload?.team_stats)
    ? statsPayload.team_stats
    : [],
  player_stats: Array.isArray(statsPayload?.player_stats)
    ? statsPayload.player_stats
    : [],
});

const buildDefaultScoreRows = () => [
  {
    game_number: 1,
    team1_score: "",
    team2_score: "",
  },
];

const normalizeScoreRows = (rows) => {
  const firstRow = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  return [
    {
      game_number: 1,
      team1_score:
        firstRow?.team1_score === null || firstRow?.team1_score === undefined
          ? ""
          : `${firstRow.team1_score}`,
      team2_score:
        firstRow?.team2_score === null || firstRow?.team2_score === undefined
          ? ""
          : `${firstRow.team2_score}`,
    },
  ];
};

const summarizeScoreRows = (rows) => {
  const [row] = normalizeScoreRows(rows);
  if (row.team1_score === "" || row.team2_score === "") {
    return {
      team1Wins: 0,
      team2Wins: 0,
      winnerSide: null,
    };
  }

  const team1Score = Number(row.team1_score);
  const team2Score = Number(row.team2_score);
  if (
    !Number.isInteger(team1Score) ||
    !Number.isInteger(team2Score) ||
    team1Score === team2Score
  ) {
    return {
      team1Wins: 0,
      team2Wins: 0,
      winnerSide: null,
    };
  }

  if (team1Score > team2Score) {
    return {
      team1Wins: 1,
      team2Wins: 0,
      winnerSide: 1,
    };
  }

  return {
    team1Wins: 0,
    team2Wins: 1,
    winnerSide: 2,
  };
};

const RegistrationCard = ({
  registration,
  onDragStart,
  onDropBefore,
  compact = false,
  moveOptions = null,
  onQuickMove = null,
}) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDropBefore}
      className={`bg-white border border-gray-300 rounded-md p-2 shadow-sm cursor-move ${
        compact ? "text-xs" : "text-sm"
      }`}
    >
      <p className="font-semibold text-gray-900">#{registration.seed || "-"} {registration.team_name}</p>
      <p className="text-gray-600">Registration #{registration.id}</p>
      {registration.group_id ? (
        <p className="text-gray-600">Pool {registration.group_id}</p>
      ) : null}
      {moveOptions && onQuickMove ? (
        <div className="mt-2 md:hidden">
          <label className="block text-[10px] text-gray-500 font-semibold mb-1">
            Quick Move
          </label>
          <select
            value={`${normalizeGroupId(registration.group_id) ?? "none"}`}
            onChange={(event) => onQuickMove(registration, event.target.value)}
            className="w-full border border-gray-300 rounded-md p-1.5 text-xs bg-white"
          >
            {moveOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
};

const TournamentSchedulePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("scheduler");
  const [divisions, setDivisions] = useState([]);
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [boardRegistrations, setBoardRegistrations] = useState([]);
  const [boardDirty, setBoardDirty] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [matches, setMatches] = useState([]);
  const [outcomeStats, setOutcomeStats] = useState(EMPTY_OUTCOME_STATS);

  const [loadingBase, setLoadingBase] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [savingBoard, setSavingBoard] = useState(false);
  const [submittingMatch, setSubmittingMatch] = useState(false);
  const [savingMatchId, setSavingMatchId] = useState(null);
  const [generatingPools, setGeneratingPools] = useState(false);
  const [generatingMatches, setGeneratingMatches] = useState(false);
  const [savingScoreMatchId, setSavingScoreMatchId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [snakePoolCount, setSnakePoolCount] = useState("2");
  const [poolLaneCount, setPoolLaneCount] = useState(2);
  const [dragState, setDragState] = useState(null);

  const [autoGenerateForm, setAutoGenerateForm] = useState({
    scheduled_date: "",
    scheduled_time: "09:00",
    location_prefix: "Pool Play",
    minutes_between_matches: "30",
  });

  const [manualMatchForm, setManualMatchForm] = useState({
    registration1_id: "",
    registration2_id: "",
    scheduled_date: "",
    scheduled_time: "",
    location: "",
  });

  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editingMatchForm, setEditingMatchForm] = useState({
    registration1_id: "",
    registration2_id: "",
    scheduled_date: "",
    scheduled_time: "",
    location: "",
  });
  const [scoreDraftsByMatchId, setScoreDraftsByMatchId] = useState({});

  const clearFeedback = () => {
    setError("");
    setMessage("");
  };

  const stageBoardChanges = () => {
    setBoardDirty(true);
    setError("");
    setMessage(BOARD_STAGED_MESSAGE);
  };

  const getTokenOrRedirect = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please log in to manage tournament scheduling.");
      navigate("/login", {
        replace: true,
        state: { from: `/events/${id}/schedule` },
      });
      return null;
    }

    return token;
  };

  const selectedDivision = useMemo(
    () => divisions.find((division) => String(division.id) === String(selectedDivisionId)),
    [divisions, selectedDivisionId]
  );

  const selectedDivisionRegistrations = useMemo(() => {
    if (!selectedDivisionId) {
      return [];
    }

    return sortRegistrationsBySeed(
      boardRegistrations.filter(
        (registration) =>
          String(registration.tournament_division_id) === String(selectedDivisionId)
      )
    );
  }, [boardRegistrations, selectedDivisionId]);

  const selectedDivisionUnassigned = useMemo(
    () =>
      selectedDivisionRegistrations.filter(
        (registration) => !registration.group_id
      ),
    [selectedDivisionRegistrations]
  );

  const selectedDivisionPoolIds = useMemo(() => {
    const existingPoolIds = selectedDivisionRegistrations
      .map((registration) => Number(registration.group_id))
      .filter((poolId) => Number.isInteger(poolId) && poolId > 0);

    const highestPoolId = existingPoolIds.length ? Math.max(...existingPoolIds) : 0;
    const targetPoolCount = Math.max(poolLaneCount, highestPoolId, 1);

    return Array.from({ length: targetPoolCount }, (_, index) => index + 1);
  }, [selectedDivisionRegistrations, poolLaneCount]);

  const selectedDivisionPools = useMemo(() => {
    const byPool = new Map();

    selectedDivisionPoolIds.forEach((poolId) => {
      byPool.set(poolId, []);
    });

    selectedDivisionRegistrations.forEach((registration) => {
      const poolId = Number(registration.group_id);
      if (Number.isInteger(poolId) && poolId > 0) {
        if (!byPool.has(poolId)) {
          byPool.set(poolId, []);
        }
        byPool.get(poolId).push(registration);
      }
    });

    return byPool;
  }, [selectedDivisionRegistrations, selectedDivisionPoolIds]);

  const poolMoveOptions = useMemo(
    () => [
      { value: "none", label: "Unassigned" },
      ...selectedDivisionPoolIds.map((poolId) => ({
        value: String(poolId),
        label: `Pool ${poolId}`,
      })),
    ],
    [selectedDivisionPoolIds]
  );

  const divisionSeedColumns = useMemo(() => {
    return divisions.map((division) => ({
      ...division,
      registrations: sortRegistrationsBySeed(
        boardRegistrations.filter(
          (registration) =>
            String(registration.tournament_division_id) === String(division.id)
        )
      ),
    }));
  }, [divisions, boardRegistrations]);

  const visibleTeamStats = useMemo(
    () =>
      (Array.isArray(outcomeStats?.team_stats) ? outcomeStats.team_stats : []).filter(
        (teamStats) =>
          String(teamStats.division_id || "") === String(selectedDivisionId || "")
      ),
    [outcomeStats, selectedDivisionId]
  );

  const visiblePlayerStats = useMemo(() => {
    const visibleTeamIds = new Set(visibleTeamStats.map((teamStats) => teamStats.team_id));
    return (
      Array.isArray(outcomeStats?.player_stats) ? outcomeStats.player_stats : []
    ).filter((playerStats) => visibleTeamIds.has(playerStats.team_id));
  }, [outcomeStats, visibleTeamStats]);

  const displayedScoreRules = useMemo(
    () => ({
      target_score: Number(outcomeStats?.rules?.target_score) || 21,
      overtime_cap: Number(outcomeStats?.rules?.overtime_cap) || 25,
      win_by: Number(outcomeStats?.rules?.win_by) || 2,
    }),
    [outcomeStats]
  );

  useEffect(() => {
    const existingPoolIds = selectedDivisionRegistrations
      .map((registration) => Number(registration.group_id))
      .filter((poolId) => Number.isInteger(poolId) && poolId > 0);

    const maxPoolId = existingPoolIds.length ? Math.max(...existingPoolIds) : 1;
    if (!boardDirty) {
      setPoolLaneCount(maxPoolId);
      return;
    }

    if (maxPoolId > poolLaneCount) {
      setPoolLaneCount(maxPoolId);
    }
  }, [selectedDivisionRegistrations, poolLaneCount, boardDirty]);

  const loadBaseData = async () => {
    const token = getTokenOrRedirect();
    if (!token) {
      return;
    }

    try {
      setLoadingBase(true);
      setError("");

      const [divisionsPayload, registrationsPayload] = await Promise.all([
        getTournamentDivisions(token, id),
        getTournamentRegistrations(token, id),
      ]);

      const parsedDivisions = Array.isArray(divisionsPayload) ? divisionsPayload : [];
      const parsedRegistrations = Array.isArray(registrationsPayload)
        ? registrationsPayload
        : [];

      setDivisions(parsedDivisions);
      setAllRegistrations(parsedRegistrations);
      setBoardRegistrations(parsedRegistrations);
      setBoardDirty(false);
      setDragState(null);

      if (parsedDivisions.length === 0) {
        setSelectedDivisionId("");
        return;
      }

      setSelectedDivisionId((previousDivisionId) => {
        if (
          previousDivisionId &&
          parsedDivisions.some(
            (division) => String(division.id) === String(previousDivisionId)
          )
        ) {
          return previousDivisionId;
        }

        return String(parsedDivisions[0].id);
      });
    } catch (loadError) {
      setError(loadError?.message || "Unable to load tournament data.");
    } finally {
      setLoadingBase(false);
    }
  };

  const loadScheduleData = async (divisionId) => {
    if (!divisionId) {
      setCandidates([]);
      setMatches([]);
      setOutcomeStats(EMPTY_OUTCOME_STATS);
      return;
    }

    const token = getTokenOrRedirect();
    if (!token) {
      return;
    }

    try {
      setLoadingSchedule(true);
      setError("");

      const [candidatesPayload, matchesPayload, statsPayload] = await Promise.all([
        getMatchCandidates(token, id, divisionId),
        getMatches(token, id, { divisionId }),
        getTournamentStats(token, id),
      ]);

      setCandidates(Array.isArray(candidatesPayload) ? candidatesPayload : []);
      setMatches(Array.isArray(matchesPayload) ? matchesPayload : []);
      setOutcomeStats(normalizeOutcomeStats(statsPayload));
    } catch (loadError) {
      setError(loadError?.message || "Unable to load schedule data.");
    } finally {
      setLoadingSchedule(false);
    }
  };

  useEffect(() => {
    loadBaseData();
  }, [id]);

  useEffect(() => {
    if (selectedDivisionId) {
      loadScheduleData(selectedDivisionId);
    }
  }, [id, selectedDivisionId]);

  useEffect(() => {
    setScoreDraftsByMatchId((previous) => {
      const next = {};
      matches.forEach((match) => {
        next[match.id] = normalizeScoreRows(previous[match.id]);
      });
      return next;
    });
  }, [matches]);

  const persistRegistrationUpdates = async (updates, successMessage) => {
    const token = getTokenOrRedirect();
    if (!token) {
      return false;
    }

    if (!Array.isArray(updates) || updates.length === 0) {
      return true;
    }

    try {
      setSavingBoard(true);
      clearFeedback();

      const payload = await reorderTournamentRegistrations(token, id, updates);
      const normalizedRegistrations = Array.isArray(payload) ? payload : [];
      setAllRegistrations(normalizedRegistrations);
      setBoardRegistrations(normalizedRegistrations);
      setBoardDirty(false);
      setMessage(successMessage);
      await loadScheduleData(selectedDivisionId);
      return true;
    } catch (persistError) {
      setError(persistError?.message || "Unable to persist board changes.");
      await loadBaseData();
      return false;
    } finally {
      setSavingBoard(false);
      setDragState(null);
    }
  };

  const startDivisionSeedDrag = (registration) => {
    setDragState({
      boardType: "division-seeds",
      registrationId: registration.id,
      sourceDivisionId: Number(registration.tournament_division_id),
      sourceGroupId: registration.group_id ? Number(registration.group_id) : null,
    });
  };

  const startPoolDrag = (registration) => {
    setDragState({
      boardType: "pools",
      registrationId: registration.id,
      sourceDivisionId: Number(registration.tournament_division_id),
      sourceGroupId: registration.group_id ? Number(registration.group_id) : null,
    });
  };

  const handleDivisionSeedDrop = (targetDivisionId, beforeRegistrationId = null) => {
    if (!dragState || dragState.boardType !== "division-seeds") {
      return;
    }

    const sourceDivisionId = Number(dragState.sourceDivisionId);
    const destinationDivisionId = Number(targetDivisionId);

    setBoardRegistrations((previous) => {
      const draggedRegistration = previous.find(
        (registration) => registration.id === dragState.registrationId
      );
      if (!draggedRegistration) {
        return previous;
      }

      const buildListForDivision = (divisionId) =>
        sortRegistrationsBySeed(
          previous.filter(
            (registration) =>
              Number(registration.tournament_division_id) === Number(divisionId)
          )
        );

      const sourceList = buildListForDivision(sourceDivisionId).filter(
        (registration) => registration.id !== draggedRegistration.id
      );

      let destinationList;
      if (sourceDivisionId === destinationDivisionId) {
        destinationList = sourceList;
      } else {
        destinationList = buildListForDivision(destinationDivisionId).filter(
          (registration) => registration.id !== draggedRegistration.id
        );
      }

      const movedRegistration = {
        ...draggedRegistration,
        tournament_division_id: destinationDivisionId,
        group_id:
          sourceDivisionId === destinationDivisionId
            ? normalizeGroupId(draggedRegistration.group_id)
            : null,
      };

      const insertIndex =
        beforeRegistrationId === null
          ? destinationList.length
          : destinationList.findIndex(
              (registration) => registration.id === beforeRegistrationId
            );

      destinationList.splice(
        insertIndex < 0 ? destinationList.length : insertIndex,
        0,
        movedRegistration
      );

      const patchById = new Map();
      sourceList.forEach((registration, index) => {
        patchById.set(registration.id, {
          ...registration,
          tournament_division_id: sourceDivisionId,
          seed: index + 1,
          group_id: normalizeGroupId(registration.group_id),
        });
      });

      destinationList.forEach((registration, index) => {
        patchById.set(registration.id, {
          ...registration,
          tournament_division_id: destinationDivisionId,
          seed: index + 1,
          group_id: normalizeGroupId(registration.group_id),
        });
      });

      return previous.map((registration) => patchById.get(registration.id) || registration);
    });

    stageBoardChanges();
    setDragState(null);
  };

  const handlePoolDrop = (targetGroupId, beforeRegistrationId = null) => {
    if (!dragState || dragState.boardType !== "pools") {
      return;
    }

    const currentDivisionId = Number(selectedDivisionId);
    if (!currentDivisionId) {
      return;
    }

    setBoardRegistrations((previous) => {
      const divisionRegistrations = sortRegistrationsBySeed(
        previous.filter(
          (registration) =>
            Number(registration.tournament_division_id) === currentDivisionId
        )
      );

      const draggedRegistration = divisionRegistrations.find(
        (registration) => registration.id === dragState.registrationId
      );
      if (!draggedRegistration) {
        return previous;
      }

      const divisionPoolIds = divisionRegistrations
        .map((registration) => normalizeGroupId(registration.group_id))
        .filter((poolId) => poolId !== null);

      const highestPoolId = divisionPoolIds.length ? Math.max(...divisionPoolIds) : 0;
      const laneKeys = [
        null,
        ...Array.from(
          { length: Math.max(poolLaneCount, highestPoolId, 1) },
          (_, index) => index + 1
        ),
      ];
      const lanes = new Map(laneKeys.map((laneKey) => [laneKey, []]));

      divisionRegistrations.forEach((registration) => {
        const laneKey = normalizeGroupId(registration.group_id);
        if (!lanes.has(laneKey)) {
          lanes.set(laneKey, []);
        }
        lanes.get(laneKey).push(registration);
      });

      lanes.forEach((laneRegistrations) => {
        const index = laneRegistrations.findIndex(
          (registration) => registration.id === draggedRegistration.id
        );
        if (index >= 0) {
          laneRegistrations.splice(index, 1);
        }
      });

      const destinationLaneKey = normalizeGroupId(targetGroupId);
      if (!lanes.has(destinationLaneKey)) {
        lanes.set(destinationLaneKey, []);
      }

      const destinationLane = lanes.get(destinationLaneKey);
      const movedRegistration = {
        ...draggedRegistration,
        group_id: destinationLaneKey,
      };

      const insertIndex =
        beforeRegistrationId === null
          ? destinationLane.length
          : destinationLane.findIndex(
              (registration) => registration.id === beforeRegistrationId
            );

      destinationLane.splice(
        insertIndex < 0 ? destinationLane.length : insertIndex,
        0,
        movedRegistration
      );

      const flattened = [];
      laneKeys.forEach((laneKey) => {
        const laneRegistrations = lanes.get(laneKey) || [];
        laneRegistrations.forEach((registration) => {
          flattened.push({
            ...registration,
            group_id: laneKey,
          });
        });
      });

      const patchById = new Map(
        flattened.map((registration, index) => [
          registration.id,
          {
            ...registration,
            tournament_division_id: currentDivisionId,
            seed: index + 1,
            group_id: normalizeGroupId(registration.group_id),
          },
        ])
      );

      return previous.map((registration) => patchById.get(registration.id) || registration);
    });

    stageBoardChanges();
    setDragState(null);
  };

  const buildReorderUpdatesFromBoard = () => {
    const baselineById = new Map(
      allRegistrations.map((registration) => [Number(registration.id), registration])
    );

    return boardRegistrations
      .map((registration) => {
        const baseline = baselineById.get(Number(registration.id));
        if (!baseline) {
          return null;
        }

        const currentDivisionId = Number(registration.tournament_division_id);
        const currentSeed = Number(registration.seed);
        const currentGroupId = normalizeGroupId(registration.group_id);

        const baselineDivisionId = Number(baseline.tournament_division_id);
        const baselineSeed = Number(baseline.seed);
        const baselineGroupId = normalizeGroupId(baseline.group_id);

        if (
          currentDivisionId === baselineDivisionId &&
          currentSeed === baselineSeed &&
          currentGroupId === baselineGroupId
        ) {
          return null;
        }

        return {
          registration_id: Number(registration.id),
          tournament_division_id: currentDivisionId,
          seed: currentSeed,
          group_id: currentGroupId,
        };
      })
      .filter(Boolean);
  };

  const handleSaveBoardChanges = async () => {
    const updates = buildReorderUpdatesFromBoard();
    if (!updates.length) {
      setBoardDirty(false);
      setMessage("No pending board changes to save.");
      return;
    }

    await persistRegistrationUpdates(updates, "Board changes saved.");
  };

  const handleResetBoardChanges = () => {
    setBoardRegistrations(allRegistrations);
    setBoardDirty(false);
    setDragState(null);

    const selectedId = Number(selectedDivisionId);
    if (selectedId) {
      const existingPoolIds = allRegistrations
        .filter(
          (registration) => Number(registration.tournament_division_id) === selectedId
        )
        .map((registration) => normalizeGroupId(registration.group_id))
        .filter((poolId) => poolId !== null);
      const maxPoolId = existingPoolIds.length ? Math.max(...existingPoolIds) : 1;
      setPoolLaneCount(maxPoolId);
    }

    setError("");
    setMessage("Discarded unsaved board changes.");
  };

  const handleRemoveEmptyPoolLane = (poolId) => {
    const currentDivisionId = Number(selectedDivisionId);
    const normalizedPoolId = Number(poolId);
    if (!currentDivisionId || !Number.isInteger(normalizedPoolId) || normalizedPoolId <= 0) {
      return;
    }

    const poolRegistrations = selectedDivisionPools.get(normalizedPoolId) || [];
    if (poolRegistrations.length > 0) {
      return;
    }

    const willShiftPoolAssignments = selectedDivisionRegistrations.some(
      (registration) => {
        const groupId = normalizeGroupId(registration.group_id);
        return groupId !== null && groupId > normalizedPoolId;
      }
    );

    if (willShiftPoolAssignments) {
      setBoardRegistrations((previous) =>
        previous.map((registration) => {
          if (Number(registration.tournament_division_id) !== currentDivisionId) {
            return registration;
          }

          const groupId = normalizeGroupId(registration.group_id);
          if (groupId !== null && groupId > normalizedPoolId) {
            return {
              ...registration,
              group_id: groupId - 1,
            };
          }

          return registration;
        })
      );
      stageBoardChanges();
    }

    setPoolLaneCount((previous) => Math.max(previous - 1, 1));
  };

  const handleQuickMoveRegistration = (registration, targetPoolValue) => {
    const currentDivisionId = Number(selectedDivisionId);
    if (!currentDivisionId || !registration?.id) {
      return;
    }

    const destinationGroupId =
      targetPoolValue === "none" ? null : normalizeGroupId(targetPoolValue);

    setBoardRegistrations((previous) => {
      const divisionRegistrations = sortRegistrationsBySeed(
        previous.filter(
          (entry) =>
            Number(entry.tournament_division_id) === currentDivisionId
        )
      );
      const movedRegistration = divisionRegistrations.find(
        (entry) => Number(entry.id) === Number(registration.id)
      );
      if (!movedRegistration) {
        return previous;
      }

      const poolIds = divisionRegistrations
        .map((entry) => normalizeGroupId(entry.group_id))
        .filter((poolId) => poolId !== null);
      const maxPoolId = poolIds.length ? Math.max(...poolIds) : 0;
      const laneKeys = [
        null,
        ...Array.from(
          { length: Math.max(poolLaneCount, maxPoolId, 1) },
          (_, index) => index + 1
        ),
      ];
      if (destinationGroupId && !laneKeys.includes(destinationGroupId)) {
        laneKeys.push(destinationGroupId);
      }

      const lanes = new Map(laneKeys.map((laneKey) => [laneKey, []]));
      divisionRegistrations.forEach((entry) => {
        const laneKey = normalizeGroupId(entry.group_id);
        if (!lanes.has(laneKey)) {
          lanes.set(laneKey, []);
        }
        lanes.get(laneKey).push(entry);
      });

      lanes.forEach((laneEntries) => {
        const index = laneEntries.findIndex(
          (entry) => Number(entry.id) === Number(movedRegistration.id)
        );
        if (index >= 0) {
          laneEntries.splice(index, 1);
        }
      });

      const destinationLane = lanes.get(destinationGroupId) || [];
      destinationLane.push({ ...movedRegistration, group_id: destinationGroupId });
      lanes.set(destinationGroupId, destinationLane);

      const flattened = [];
      laneKeys.forEach((laneKey) => {
        (lanes.get(laneKey) || []).forEach((entry) => {
          flattened.push({
            ...entry,
            group_id: laneKey,
          });
        });
      });

      const patchById = new Map(
        flattened.map((entry, index) => [
          Number(entry.id),
          {
            ...entry,
            seed: index + 1,
            tournament_division_id: currentDivisionId,
            group_id: normalizeGroupId(entry.group_id),
          },
        ])
      );

      return previous.map((entry) => patchById.get(Number(entry.id)) || entry);
    });

    if (destinationGroupId && destinationGroupId > poolLaneCount) {
      setPoolLaneCount(destinationGroupId);
    }

    stageBoardChanges();
  };

  const handleGeneratePools = async () => {
    const token = getTokenOrRedirect();
    if (!token || !selectedDivisionId) {
      return;
    }

    try {
      setGeneratingPools(true);
      clearFeedback();

      const normalizedPoolCount = normalizeOptionalPositiveInt(
        snakePoolCount,
        "Pool count"
      );

      await generatePools(token, id, selectedDivisionId, {
        pool_count: normalizedPoolCount,
      });

      setPoolLaneCount(normalizedPoolCount);
      await loadBaseData();
      setMessage("Snake-draft pools generated successfully.");
    } catch (generationError) {
      setError(generationError?.message || "Unable to generate pools.");
    } finally {
      setGeneratingPools(false);
    }
  };

  const handleAutoGenerateMatches = async (event) => {
    event.preventDefault();

    const token = getTokenOrRedirect();
    if (!token || !selectedDivisionId) {
      return;
    }

    try {
      setGeneratingMatches(true);
      clearFeedback();

      const payload = {
        scheduled_time: autoGenerateForm.scheduled_time,
        location_prefix: autoGenerateForm.location_prefix.trim(),
        minutes_between_matches: normalizeOptionalPositiveInt(
          autoGenerateForm.minutes_between_matches,
          "Minutes between matches"
        ),
      };
      if (autoGenerateForm.scheduled_date) {
        payload.scheduled_date = autoGenerateForm.scheduled_date;
      }

      const generatedPayload = await autoGeneratePoolMatches(
        token,
        id,
        selectedDivisionId,
        payload
      );
      setMessage(
        `Auto-generation complete: ${generatedPayload?.created_count || 0} created, ${generatedPayload?.skipped_count || 0} skipped.`
      );
      await loadScheduleData(selectedDivisionId);
    } catch (generationError) {
      setError(generationError?.message || "Unable to auto-generate pool matches.");
    } finally {
      setGeneratingMatches(false);
    }
  };

  const updateAutoGenerateField = (field) => (event) => {
    setAutoGenerateForm((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
  };

  const handleManualMatchFormChange = (event) => {
    const { name, value } = event.target;
    setManualMatchForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateManualMatch = async (event) => {
    event.preventDefault();

    const token = getTokenOrRedirect();
    if (!token) {
      return;
    }

    const { registration1_id, registration2_id, scheduled_date, scheduled_time, location } =
      manualMatchForm;

    if (
      !registration1_id ||
      !registration2_id ||
      !scheduled_date ||
      !scheduled_time ||
      !location.trim()
    ) {
      setError("Please complete all manual match fields before scheduling.");
      return;
    }

    if (registration1_id === registration2_id) {
      setError("Team 1 and Team 2 must be different teams.");
      return;
    }

    try {
      setSubmittingMatch(true);
      clearFeedback();

      await createMatch(token, id, {
        registration1_id: Number(registration1_id),
        registration2_id: Number(registration2_id),
        scheduled_date,
        scheduled_time,
        location: location.trim(),
      });

      setMessage("Match scheduled successfully.");
      setManualMatchForm((previous) => ({
        ...previous,
        registration1_id: "",
        registration2_id: "",
        scheduled_date: "",
        scheduled_time: "",
        location: "",
      }));

      await loadScheduleData(selectedDivisionId);
    } catch (scheduleError) {
      setError(scheduleError?.message || "Unable to schedule match.");
    } finally {
      setSubmittingMatch(false);
    }
  };

  const beginMatchEdit = (match) => {
    setEditingMatchId(match.id);
    setEditingMatchForm({
      registration1_id: String(match.registration1_id),
      registration2_id: String(match.registration2_id),
      scheduled_date: toDateInputValue(match.scheduled_at),
      scheduled_time: toTimeInputValue(match.scheduled_at),
      location: match.location || "",
    });
  };

  const cancelMatchEdit = () => {
    setEditingMatchId(null);
    setEditingMatchForm({
      registration1_id: "",
      registration2_id: "",
      scheduled_date: "",
      scheduled_time: "",
      location: "",
    });
  };

  const handleEditingMatchFormChange = (event) => {
    const { name, value } = event.target;
    setEditingMatchForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSaveMatchEdit = async (matchId) => {
    const token = getTokenOrRedirect();
    if (!token) {
      return;
    }

    try {
      setSavingMatchId(matchId);
      clearFeedback();

      if (
        !editingMatchForm.registration1_id ||
        !editingMatchForm.registration2_id ||
        !editingMatchForm.scheduled_date ||
        !editingMatchForm.scheduled_time ||
        !editingMatchForm.location.trim()
      ) {
        throw new Error("All match edit fields are required.");
      }

      if (editingMatchForm.registration1_id === editingMatchForm.registration2_id) {
        throw new Error("Team 1 and Team 2 must be different teams.");
      }

      await updateMatch(token, id, matchId, {
        registration1_id: Number(editingMatchForm.registration1_id),
        registration2_id: Number(editingMatchForm.registration2_id),
        scheduled_date: editingMatchForm.scheduled_date,
        scheduled_time: editingMatchForm.scheduled_time,
        location: editingMatchForm.location.trim(),
      });

      setMessage("Match updated successfully.");
      cancelMatchEdit();
      await loadScheduleData(selectedDivisionId);
    } catch (updateError) {
      setError(updateError?.message || "Unable to update match.");
    } finally {
      setSavingMatchId(null);
    }
  };

  const handleScoreDraftChange = (matchId, gameIndex, field, value) => {
    setScoreDraftsByMatchId((previous) => {
      const currentRows = normalizeScoreRows(previous[matchId]);
      const updatedRows = currentRows.map((row, index) =>
        index === gameIndex
          ? {
              ...row,
              [field]: value,
            }
          : row
      );
      return {
        ...previous,
        [matchId]: updatedRows,
      };
    });
  };

  const handleSaveMatchScores = async (match) => {
    const token = getTokenOrRedirect();
    if (!token) {
      return;
    }

    try {
      setSavingScoreMatchId(match.id);
      clearFeedback();

      const currentRows = normalizeScoreRows(
        scoreDraftsByMatchId[match.id]
      );
      const hasPartialRows = currentRows.some(
        (row) =>
          (row.team1_score === "" && row.team2_score !== "") ||
          (row.team1_score !== "" && row.team2_score === "")
      );
      if (hasPartialRows) {
        throw new Error(
          "Each game row must include both team scores, or leave both blank."
        );
      }

      const completedRows = currentRows
        .filter((row) => row.team1_score !== "" && row.team2_score !== "")
        .map((row, index) => ({
          game_number: Number(row.game_number || index + 1),
          team1_score: Number(row.team1_score),
          team2_score: Number(row.team2_score),
        }));

      if (!completedRows.length) {
        throw new Error("Enter at least one completed game score.");
      }

      const payload = await saveMatchResults(token, id, match.id, {
        games: completedRows,
      });
      const normalizedSavedRows = Array.isArray(payload?.games)
        ? payload.games.map((game, index) => ({
            game_number: Number(game.game_number || index + 1),
            team1_score: `${game.team1_score}`,
            team2_score: `${game.team2_score}`,
          }))
        : normalizeScoreRows(scoreDraftsByMatchId[match.id]);

      setScoreDraftsByMatchId((previous) => ({
        ...previous,
        [match.id]: normalizedSavedRows,
      }));

      const winnerName =
        payload?.result_summary?.winner_team_name ||
        (Number(payload?.winner_id) === Number(match.registration1_id)
          ? match.team1_name
          : match.team2_name);
      setMessage(`Scores saved. Winner: ${winnerName || "Recorded"}.`);
      await loadScheduleData(selectedDivisionId);
    } catch (saveError) {
      setError(saveError?.message || "Unable to save match scores.");
    } finally {
      setSavingScoreMatchId(null);
    }
  };

  return (
    <TournamentPageShell
      kicker="Tournament Operator Console"
      title="Division Scheduling and Pools"
      subtitle="Manage seeded divisions, pools, scheduling, and scoring from a single workspace."
      actions={
        <>
          <button
            type="button"
            onClick={() => navigate(`/events/${id}/manage`)}
            className="op-btn px-4 py-2 text-sm bg-[var(--op-surface)] text-[var(--op-secondary)] border border-[var(--op-border)] hover:bg-[var(--op-surface-muted)]"
          >
            Back To Management
          </button>
          <button
            type="button"
            onClick={() => navigate(`/events/${id}/details`)}
            className="op-btn px-4 py-2 text-sm bg-[var(--op-primary)] text-white hover:bg-[var(--op-primary-strong)]"
          >
            Tournament Details
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveSection("scheduler")}
            className={`op-btn px-3 py-2 rounded-full border text-sm ${
              activeSection === "scheduler"
                ? "bg-[var(--op-primary)] text-white border-[var(--op-primary)]"
                : "bg-[var(--op-surface)] text-[var(--op-primary)] border-[var(--op-border)]"
            }`}
          >
            Scheduler
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("board")}
            className={`op-btn px-3 py-2 rounded-full border text-sm ${
              activeSection === "board"
                ? "bg-[var(--op-primary)] text-white border-[var(--op-primary)]"
                : "bg-[var(--op-surface)] text-[var(--op-primary)] border-[var(--op-border)]"
            }`}
          >
            Seeds & Pools Board
          </button>
        </div>

        {loadingBase ? (
          <InlineBanner tone="info" title="Loading" message="Loading tournament data..." />
        ) : null}
        {error ? <InlineBanner tone="error" title="Action Required" message={error} /> : null}
        {message ? <InlineBanner tone="success" title="Saved" message={message} /> : null}

        {!loadingBase ? (
          <>
            <section className="border border-gray-200 rounded-md p-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div>
                  <label htmlFor="division-select" className="font-semibold block mb-1">
                    Active Division
                  </label>
                  <select
                    id="division-select"
                    value={selectedDivisionId}
                    onChange={(event) => setSelectedDivisionId(event.target.value)}
                    className="w-full sm:w-80 border border-gray-300 rounded-md p-2"
                    disabled={!divisions.length}
                  >
                    {divisions.length === 0 ? (
                      <option value="">No divisions available</option>
                    ) : (
                      divisions.map((division) => (
                        <option key={division.id} value={division.id}>
                          {division.division_name} (#{division.id})
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={loadBaseData}
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 transition-colors"
                >
                  Refresh Data
                </button>
              </div>

              {selectedDivision ? (
                <p className="mt-2 text-sm text-gray-700">
                  Selected division: <span className="font-semibold">{selectedDivision.division_name}</span>
                </p>
              ) : null}
            </section>

            {activeSection === "board" ? (
              <>
                <section className="border border-gray-200 rounded-md p-4 space-y-4">
                  <h2 className="text-lg font-semibold text-blue-900">
                    Division Seeds (Drag to Reorder or Move Across Divisions)
                  </h2>
                  <p className="text-sm text-gray-700">
                    Dragging here updates seed order. Dropping into another division also changes that team's division.
                  </p>
                  <div className="flex flex-wrap gap-2 items-center">
                    <button
                      type="button"
                      onClick={handleSaveBoardChanges}
                      disabled={!boardDirty || savingBoard}
                      className="px-4 py-2 rounded-md bg-blue-900 text-white hover:bg-blue-800 transition-colors disabled:bg-gray-400"
                    >
                      {savingBoard ? "Saving..." : "Save Board Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={handleResetBoardChanges}
                      disabled={!boardDirty || savingBoard}
                      className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      Reset Draft
                    </button>
                    {boardDirty ? (
                      <span className="text-sm font-medium text-orange-700">
                        Unsaved changes
                      </span>
                    ) : (
                      <span className="text-sm text-gray-600">No unsaved changes</span>
                    )}
                  </div>

                  {savingBoard ? (
                    <p className="text-sm text-blue-700">Saving board changes...</p>
                  ) : null}

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    {divisionSeedColumns.map((division) => (
                      <div
                        key={`division-seed-col-${division.id}`}
                        className="border border-gray-200 rounded-md p-3 bg-gray-50 min-h-[220px]"
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => handleDivisionSeedDrop(division.id, null)}
                      >
                        <h3 className="font-semibold text-blue-900 mb-2">
                          {division.division_name}
                        </h3>
                        <div className="space-y-2">
                          {division.registrations.length === 0 ? (
                            <p className="text-sm text-gray-600">No teams in this division.</p>
                          ) : (
                            division.registrations.map((registration) => (
                              <RegistrationCard
                                key={`division-seed-card-${registration.id}`}
                                registration={registration}
                                compact
                                onDragStart={() => startDivisionSeedDrag(registration)}
                                onDropBefore={() =>
                                  handleDivisionSeedDrop(division.id, registration.id)
                                }
                              />
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="border border-gray-200 rounded-md p-4 space-y-4">
                  <div className="flex flex-wrap gap-3 items-end">
                    <div>
                      <label htmlFor="snake-pool-count" className="font-semibold block mb-1 text-sm">
                        Snake Pool Count
                      </label>
                      <input
                        id="snake-pool-count"
                        type="number"
                        min="1"
                        value={snakePoolCount}
                        onChange={(event) => setSnakePoolCount(event.target.value)}
                        className="w-28 border border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleGeneratePools}
                      disabled={generatingPools || !selectedDivisionId}
                      className="px-4 py-2 rounded-md bg-indigo-700 text-white hover:bg-indigo-600 transition-colors disabled:bg-gray-400"
                    >
                      {generatingPools ? "Generating..." : "Generate Snake Pools"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPoolLaneCount((previous) => previous + 1)}
                      className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
                    >
                      Add Pool Lane
                    </button>
                  </div>

                  <h2 className="text-lg font-semibold text-blue-900">
                    {selectedDivision?.division_name || "Division"} Pools Board
                  </h2>
                  <p className="text-sm text-gray-700">
                    Drag cards between "Unassigned Division Seeds" and pool lanes. Changes are staged locally until you click Save Board Changes.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div
                      className="border border-yellow-200 rounded-md p-3 bg-yellow-50 min-h-[240px]"
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => handlePoolDrop(null, null)}
                    >
                      <h3 className="font-semibold text-yellow-900 mb-2">
                        Unassigned Division Seeds
                      </h3>
                      <div className="space-y-2">
                        {selectedDivisionUnassigned.length === 0 ? (
                          <p className="text-sm text-yellow-800">All teams are assigned to pools.</p>
                        ) : (
                          selectedDivisionUnassigned.map((registration) => (
                            <RegistrationCard
                              key={`pool-unassigned-${registration.id}`}
                              registration={registration}
                              onDragStart={() => startPoolDrag(registration)}
                              onDropBefore={() => handlePoolDrop(null, registration.id)}
                              moveOptions={poolMoveOptions}
                              onQuickMove={handleQuickMoveRegistration}
                            />
                          ))
                        )}
                      </div>
                    </div>

                    {selectedDivisionPoolIds.map((poolId) => {
                      const poolRegistrations = selectedDivisionPools.get(poolId) || [];
                      const canRemoveLane =
                        poolRegistrations.length === 0 && selectedDivisionPoolIds.length > 1;
                      return (
                        <div
                          key={`pool-lane-${poolId}`}
                          className="border border-indigo-100 rounded-md p-3 bg-indigo-50 min-h-[240px]"
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={() => handlePoolDrop(poolId, null)}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-indigo-900">Pool {poolId}</h3>
                            {canRemoveLane ? (
                              <button
                                type="button"
                                onClick={() => handleRemoveEmptyPoolLane(poolId)}
                                className="text-xs px-2 py-1 rounded border border-red-300 text-red-700 bg-white hover:bg-red-50"
                                aria-label={`Remove empty pool ${poolId}`}
                                title="Remove empty pool lane"
                              >
                                x
                              </button>
                            ) : null}
                          </div>
                          <div className="space-y-2">
                            {poolRegistrations.length === 0 ? (
                              <p className="text-sm text-indigo-800">
                                No teams assigned yet.
                              </p>
                            ) : (
                              poolRegistrations.map((registration) => (
                                <RegistrationCard
                                  key={`pool-${poolId}-${registration.id}`}
                                  registration={registration}
                                  onDragStart={() => startPoolDrag(registration)}
                                  onDropBefore={() =>
                                    handlePoolDrop(poolId, registration.id)
                                  }
                                  moveOptions={poolMoveOptions}
                                  onQuickMove={handleQuickMoveRegistration}
                                />
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            ) : (
              <>
                <section className="border border-gray-200 rounded-md p-4 space-y-4">
                  <h2 className="text-lg font-semibold text-blue-900">Auto-Generate Pool Matches</h2>
                  <p className="text-sm text-gray-700">
                    Leave Start Date blank to use the tournament start date.
                  </p>
                  <form
                    onSubmit={handleAutoGenerateMatches}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3"
                  >
                    <div>
                      <label className="font-semibold block mb-1 text-sm" htmlFor="auto-date">
                        Start Date (optional)
                      </label>
                      <input
                        id="auto-date"
                        type="date"
                        value={autoGenerateForm.scheduled_date}
                        onChange={updateAutoGenerateField("scheduled_date")}
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-sm" htmlFor="auto-time">
                        Start Time
                      </label>
                      <input
                        id="auto-time"
                        type="time"
                        value={autoGenerateForm.scheduled_time}
                        onChange={updateAutoGenerateField("scheduled_time")}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-sm" htmlFor="auto-loc">
                        Location Prefix
                      </label>
                      <input
                        id="auto-loc"
                        value={autoGenerateForm.location_prefix}
                        onChange={updateAutoGenerateField("location_prefix")}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-sm" htmlFor="auto-gap">
                        Minutes Between
                      </label>
                      <input
                        id="auto-gap"
                        type="number"
                        min="1"
                        value={autoGenerateForm.minutes_between_matches}
                        onChange={updateAutoGenerateField("minutes_between_matches")}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                      />
                    </div>
                    <div className="md:col-span-2 lg:col-span-5">
                      <button
                        type="submit"
                        disabled={generatingMatches || !selectedDivisionId}
                        className="px-4 py-2 rounded-md bg-green-700 text-white hover:bg-green-600 transition-colors disabled:bg-gray-400"
                      >
                        {generatingMatches ? "Generating..." : "Auto-Generate Matches"}
                      </button>
                    </div>
                  </form>
                </section>

                <section className="border border-gray-200 rounded-md p-4 space-y-4">
                  <h2 className="text-lg font-semibold text-blue-900">Manual Match Scheduling</h2>
                  <form onSubmit={handleCreateManualMatch} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="registration1_id" className="font-semibold block mb-1">
                          Team 1
                        </label>
                        <select
                          id="registration1_id"
                          name="registration1_id"
                          value={manualMatchForm.registration1_id}
                          onChange={handleManualMatchFormChange}
                          className="w-full border border-gray-300 rounded-md p-2"
                          required
                        >
                          <option value="">Select first team</option>
                          {candidates.map((candidate) => (
                            <option key={`team1-${candidate.registration_id}`} value={candidate.registration_id}>
                              Seed {candidate.seed || "-"} | {candidate.team_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="registration2_id" className="font-semibold block mb-1">
                          Team 2
                        </label>
                        <select
                          id="registration2_id"
                          name="registration2_id"
                          value={manualMatchForm.registration2_id}
                          onChange={handleManualMatchFormChange}
                          className="w-full border border-gray-300 rounded-md p-2"
                          required
                        >
                          <option value="">Select second team</option>
                          {candidates.map((candidate) => (
                            <option key={`team2-${candidate.registration_id}`} value={candidate.registration_id}>
                              Seed {candidate.seed || "-"} | {candidate.team_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="scheduled_date" className="font-semibold block mb-1">
                          Match Date
                        </label>
                        <input
                          type="date"
                          id="scheduled_date"
                          name="scheduled_date"
                          value={manualMatchForm.scheduled_date}
                          onChange={handleManualMatchFormChange}
                          className="w-full border border-gray-300 rounded-md p-2"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="scheduled_time" className="font-semibold block mb-1">
                          Match Time
                        </label>
                        <input
                          type="time"
                          id="scheduled_time"
                          name="scheduled_time"
                          value={manualMatchForm.scheduled_time}
                          onChange={handleManualMatchFormChange}
                          className="w-full border border-gray-300 rounded-md p-2"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="location" className="font-semibold block mb-1">
                          Match Location
                        </label>
                        <input
                          id="location"
                          name="location"
                          value={manualMatchForm.location}
                          onChange={handleManualMatchFormChange}
                          className="w-full border border-gray-300 rounded-md p-2"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingMatch}
                      className="px-4 py-2 rounded-md bg-blue-900 text-white hover:bg-blue-800 transition-colors disabled:bg-gray-400"
                    >
                      {submittingMatch ? "Scheduling..." : "Schedule Match"}
                    </button>
                  </form>
                </section>

                <section className="border border-gray-200 rounded-md p-4">
                  <h2 className="text-lg font-semibold text-blue-900 mb-3">
                    Scheduled Matches ({matches.length})
                  </h2>

                  {loadingSchedule ? <p className="text-sm text-gray-700">Loading matches...</p> : null}

                  {matches.length === 0 ? (
                    <p className="text-gray-700">No matches have been scheduled for this division.</p>
                  ) : (
                    <div className="overflow-x-auto border border-gray-200 rounded-md">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-3 font-semibold">Teams</th>
                            <th className="text-left p-3 font-semibold">Date & Time</th>
                            <th className="text-left p-3 font-semibold">Location</th>
                            <th className="text-left p-3 font-semibold">Format</th>
                            <th className="text-left p-3 font-semibold">Winner</th>
                            <th className="text-left p-3 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {matches.map((match) => {
                            const isEditing = editingMatchId === match.id;

                            return (
                              <tr key={match.id} className="border-t border-gray-200 align-top">
                                <td className="p-3 min-w-[220px]">
                                  {isEditing ? (
                                    <div className="space-y-2">
                                      <select
                                        name="registration1_id"
                                        value={editingMatchForm.registration1_id}
                                        onChange={handleEditingMatchFormChange}
                                        className="w-full border border-gray-300 rounded-md p-1"
                                      >
                                        {candidates.map((candidate) => (
                                          <option key={`edit-1-${candidate.registration_id}`} value={candidate.registration_id}>
                                            {candidate.team_name}
                                          </option>
                                        ))}
                                      </select>
                                      <select
                                        name="registration2_id"
                                        value={editingMatchForm.registration2_id}
                                        onChange={handleEditingMatchFormChange}
                                        className="w-full border border-gray-300 rounded-md p-1"
                                      >
                                        {candidates.map((candidate) => (
                                          <option key={`edit-2-${candidate.registration_id}`} value={candidate.registration_id}>
                                            {candidate.team_name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  ) : (
                                    <span>
                                      {match.team1_name} vs {match.team2_name}
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 min-w-[220px]">
                                  {isEditing ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <input
                                        type="date"
                                        name="scheduled_date"
                                        value={editingMatchForm.scheduled_date}
                                        onChange={handleEditingMatchFormChange}
                                        className="border border-gray-300 rounded-md p-1"
                                      />
                                      <input
                                        type="time"
                                        name="scheduled_time"
                                        value={editingMatchForm.scheduled_time}
                                        onChange={handleEditingMatchFormChange}
                                        className="border border-gray-300 rounded-md p-1"
                                      />
                                    </div>
                                  ) : (
                                    <span>{formatDateTime(match.scheduled_at)}</span>
                                  )}
                                </td>
                                <td className="p-3 min-w-[180px]">
                                  {isEditing ? (
                                    <input
                                      name="location"
                                      value={editingMatchForm.location}
                                      onChange={handleEditingMatchFormChange}
                                      className="w-full border border-gray-300 rounded-md p-1"
                                    />
                                  ) : (
                                    <span>{match.location || "TBD"}</span>
                                  )}
                                </td>
                                <td className="p-3 min-w-[100px]">
                                  <span>Single Game</span>
                                </td>
                                <td className="p-3 min-w-[150px]">
                                  {Number(match.winner_id) === Number(match.registration1_id)
                                    ? match.team1_name
                                    : Number(match.winner_id) === Number(match.registration2_id)
                                    ? match.team2_name
                                    : "Not set"}
                                </td>
                                <td className="p-3 min-w-[170px]">
                                  {isEditing ? (
                                    <div className="flex flex-col gap-2">
                                      <button
                                        type="button"
                                        onClick={() => handleSaveMatchEdit(match.id)}
                                        disabled={savingMatchId === match.id}
                                        className="px-3 py-1 rounded bg-blue-900 text-white hover:bg-blue-800 disabled:bg-gray-400"
                                      >
                                        {savingMatchId === match.id ? "Saving..." : "Save"}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={cancelMatchEdit}
                                        className="px-3 py-1 rounded bg-gray-100 border border-gray-300 text-gray-800 hover:bg-gray-200"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => beginMatchEdit(match)}
                                      className="px-3 py-1 rounded bg-indigo-700 text-white hover:bg-indigo-600"
                                    >
                                      Edit Match
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                <section className="border border-gray-200 rounded-md p-4 space-y-4">
                  <h2 className="text-lg font-semibold text-blue-900">Record Match Scores</h2>
                  <p className="text-sm text-gray-700">
                    Rules: first to {displayedScoreRules.target_score}, win by{" "}
                    {displayedScoreRules.win_by}, overtime cap {displayedScoreRules.overtime_cap}.
                  </p>

                  {matches.length === 0 ? (
                    <p className="text-gray-700">Schedule matches to start entering scores.</p>
                  ) : (
                    <div className="space-y-4">
                      {matches.map((match) => {
                        const scoreRows = normalizeScoreRows(
                          scoreDraftsByMatchId[match.id]
                        );
                        const scoreSummary = summarizeScoreRows(scoreRows);
                        const winnerPreview =
                          scoreSummary.winnerSide === 1
                            ? match.team1_name
                            : scoreSummary.winnerSide === 2
                            ? match.team2_name
                            : "No winner yet";

                        return (
                          <div
                            key={`scores-${match.id}`}
                            className="border border-gray-200 rounded-md p-3 space-y-3 bg-gray-50"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <p className="font-semibold text-blue-900">
                                  {match.team1_name} vs {match.team2_name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Match #{match.id} | Single-game result
                                </p>
                              </div>
                              <div className="text-sm text-gray-700">
                                Preview: {match.team1_name} {scoreSummary.team1Wins} -{" "}
                                {scoreSummary.team2Wins} {match.team2_name} | {winnerPreview}
                              </div>
                            </div>

                            <div className="space-y-2">
                              {scoreRows.map((gameRow, gameIndex) => (
                                <div
                                  key={`score-row-${match.id}-${gameIndex}`}
                                  className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center"
                                >
                                  <p className="text-sm font-medium text-gray-700">
                                    Game {gameRow.game_number}
                                  </p>
                                  <label className="text-xs text-gray-600 sm:col-span-2">
                                    {match.team1_name}
                                    <input
                                      type="number"
                                      min="0"
                                      value={gameRow.team1_score}
                                      onChange={(event) =>
                                        handleScoreDraftChange(
                                          match.id,
                                          gameIndex,
                                          "team1_score",
                                          event.target.value
                                        )
                                      }
                                      className="mt-1 w-full border border-gray-300 rounded-md p-2"
                                    />
                                  </label>
                                  <label className="text-xs text-gray-600 sm:col-span-2">
                                    {match.team2_name}
                                    <input
                                      type="number"
                                      min="0"
                                      value={gameRow.team2_score}
                                      onChange={(event) =>
                                        handleScoreDraftChange(
                                          match.id,
                                          gameIndex,
                                          "team2_score",
                                          event.target.value
                                        )
                                      }
                                      className="mt-1 w-full border border-gray-300 rounded-md p-2"
                                    />
                                  </label>
                                </div>
                              ))}
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => handleSaveMatchScores(match)}
                                disabled={savingScoreMatchId === match.id}
                                className="px-3 py-1 rounded bg-green-700 text-white hover:bg-green-600 disabled:bg-gray-400"
                              >
                                {savingScoreMatchId === match.id
                                  ? "Saving Scores..."
                                  : "Save Scores"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>

                <section className="border border-gray-200 rounded-md p-4 space-y-4">
                  <h2 className="text-lg font-semibold text-blue-900">Division Results Snapshot</h2>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800 mb-2">Team Records</h3>
                    {visibleTeamStats.length === 0 ? (
                      <p className="text-sm text-gray-700">No completed match results yet.</p>
                    ) : (
                      <div className="overflow-x-auto border border-gray-200 rounded-md">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="p-2 text-left font-semibold">Team</th>
                              <th className="p-2 text-left font-semibold">Seed</th>
                              <th className="p-2 text-left font-semibold">Wins</th>
                              <th className="p-2 text-left font-semibold">Losses</th>
                            </tr>
                          </thead>
                          <tbody>
                            {visibleTeamStats.map((teamStats) => (
                              <tr
                                key={`team-stats-${teamStats.registration_id}`}
                                className="border-t border-gray-200"
                              >
                                <td className="p-2">{teamStats.team_name}</td>
                                <td className="p-2">{teamStats.seed || "-"}</td>
                                <td className="p-2">{teamStats.wins}</td>
                                <td className="p-2">{teamStats.losses}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm text-gray-800 mb-2">Player Records</h3>
                    {visiblePlayerStats.length === 0 ? (
                      <p className="text-sm text-gray-700">
                        No player stats available until completed results are entered.
                      </p>
                    ) : (
                      <div className="overflow-x-auto border border-gray-200 rounded-md">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="p-2 text-left font-semibold">Player</th>
                              <th className="p-2 text-left font-semibold">Team</th>
                              <th className="p-2 text-left font-semibold">Wins</th>
                              <th className="p-2 text-left font-semibold">Losses</th>
                            </tr>
                          </thead>
                          <tbody>
                            {visiblePlayerStats.map((playerStats) => (
                              <tr
                                key={`player-stats-${playerStats.user_id}-${playerStats.team_id}`}
                                className="border-t border-gray-200"
                              >
                                <td className="p-2">
                                  {playerStats.username ||
                                    `${playerStats.first_name || ""} ${
                                      playerStats.last_name || ""
                                    }`.trim()}
                                </td>
                                <td className="p-2">{playerStats.team_name}</td>
                                <td className="p-2">{playerStats.wins}</td>
                                <td className="p-2">{playerStats.losses}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}

          </>
        ) : null}
      </div>
    </TournamentPageShell>
  );
};

export default TournamentSchedulePage;
