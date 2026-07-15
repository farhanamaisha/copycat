// apps/frontend/features/clone/useCloneTraining.ts
"use client";

import { useState, useCallback } from "react";
import {
  MOCK_CLONE_PROFILE,
  MOCK_TRAINING_SESSIONS,
} from "@/lib/systemsMockData";
import type {
  CloneProfile,
  TrainingSession,
  CloneMemoryItem,
  CloneGoal,
  CloneTrait,
} from "@/types/systems";

export function useCloneTraining() {
  const [clone, setClone] = useState<CloneProfile>(MOCK_CLONE_PROFILE);
  const [sessions, setSessions] = useState<TrainingSession[]>(MOCK_TRAINING_SESSIONS);
  const [isTraining, setIsTraining] = useState(false);
  const [lastSession, setLastSession] = useState<TrainingSession | null>(null);

  const trainClone = useCallback(
    async (prompt: string, response: string): Promise<TrainingSession> => {
      setIsTraining(true);
      await new Promise((r) => setTimeout(r, 1400));

      const deltas: Record<string, number> = {
        Humor: Math.floor(Math.random() * 4) - 1,
        Creativity: Math.floor(Math.random() * 5),
        Empathy: Math.floor(Math.random() * 3),
        Logic: Math.floor(Math.random() * 3) - 1,
        Curiosity: Math.floor(Math.random() * 4),
      };

      const quality: TrainingSession["quality"] =
        response.length > 200 ? "excellent" : response.length > 100 ? "high" : "medium";

      const session: TrainingSession = {
        id: `ts_${Date.now()}`,
        cloneId: clone.id,
        prompt,
        userResponse: response,
        aiAnalysis: `Response pattern analysis complete. Detected ${Object.entries(deltas)
          .filter(([, v]) => v > 0)
          .map(([k]) => k)
          .join(", ")} trait signals.`,
        traitDeltas: deltas,
        pointsEarned: quality === "excellent" ? 10 : quality === "high" ? 7 : 4,
        duration: Math.floor(response.length / 5),
        quality,
        createdAt: new Date().toISOString(),
      };

      // Update clone
      setClone((prev) => ({
        ...prev,
        personalityProgress: Math.min(100, prev.personalityProgress + 0.8),
        trainingCount: prev.trainingCount + 1,
        traits: prev.traits.map((t) => ({
          ...t,
          value: Math.min(100, Math.max(0, t.value + (deltas[t.name] ?? 0))),
          lastUpdated: new Date().toISOString(),
        })),
      }));

      setSessions((prev) => [session, ...prev]);
      setLastSession(session);
      setIsTraining(false);
      return session;
    },
    [clone.id]
  );

  const updateTrait = useCallback((traitId: string, value: number) => {
    setClone((prev) => ({
      ...prev,
      traits: prev.traits.map((t) =>
        t.id === traitId ? { ...t, value: Math.min(100, Math.max(0, value)) } : t
      ),
    }));
  }, []);

  const addMemory = useCallback(
    (memory: Omit<CloneMemoryItem, "id" | "cloneId" | "createdAt" | "lastAccessed" | "accessCount">) => {
      const newMemory: CloneMemoryItem = {
        ...memory,
        id: `m_${Date.now()}`,
        cloneId: clone.id,
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        accessCount: 0,
      };
      setClone((prev) => ({ ...prev, memories: [newMemory, ...prev.memories] }));
    },
    [clone.id]
  );

  const deleteMemory = useCallback((id: string) => {
    setClone((prev) => ({
      ...prev,
      memories: prev.memories.filter((m) => m.id !== id),
    }));
  }, []);

  const updateGoalProgress = useCallback((goalId: string, progress: number) => {
    setClone((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === goalId
          ? { ...g, progress, isCompleted: progress >= 100, completedAt: progress >= 100 ? new Date().toISOString() : undefined }
          : g
      ),
    }));
  }, []);

  const addInterest = useCallback((interest: string) => {
    setClone((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests
        : [...prev.interests, interest],
    }));
  }, []);

  const removeInterest = useCallback((interest: string) => {
    setClone((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  }, []);

  return {
    clone,
    sessions,
    isTraining,
    lastSession,
    trainClone,
    updateTrait,
    addMemory,
    deleteMemory,
    updateGoalProgress,
    addInterest,
    removeInterest,
  };
}