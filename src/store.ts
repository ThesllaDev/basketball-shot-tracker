import { create } from 'zustand';

export const shotTypes = ["All", "3-Point", "Mid-Range", "Free Throw"];

interface Shot {
  id: number;
  date: Date;
  shot: string;
  attempted: number;
  made: number;
  percentage: number;
}

interface Store {
  shots: Shot[];
  totalAttempts: number;
  totalMakes: number;
  shootingPercentage: number;
  statsByType: Record<string, { totalMade: number; totalAttempted: number; percentage: number }>;
  addShot: (shot: Omit<Shot, 'id'>) => void;
  calculateTotals: () => void;
  calculateStatsByType: () => void;
  shotTypes: string[];
  updateShot: (updatedShot: Shot) => void;
  deleteShot: (id: number) => void;
  loadFromLocalStorage: () => void;
}

const LOCAL_STORAGE_KEY = "basketballShotTracker";

export const useStore = create<Store>((set, get) => ({
  shots: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"),
  totalAttempts: 0,
  totalMakes: 0,
  shootingPercentage: 0,
  statsByType: {},
  shotTypes,
  addShot: (shot) => {
    set((state) => {
        const newShot = { ...shot, id: Date.now(), percentage: (shot.made / shot.attempted) * 100 };
        const newShots = [...state.shots, newShot];

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newShots));

        return { shots: newShots };
    });

    get().calculateTotals();
    get().calculateStatsByType();
  },
  calculateTotals: () => set((state) => {
    const totalAttempts = state.shots.reduce((acc, shot) => acc + shot.attempted, 0);
    const totalMakes = state.shots.reduce((acc, shot) => acc + shot.made, 0);
    const shootingPercentage = totalAttempts > 0 ? (totalMakes / totalAttempts) * 100 : 0;
    return { totalAttempts, totalMakes, shootingPercentage };
  }),
  calculateStatsByType: () => set((state) => {
    const statsByType = shotTypes.reduce((acc, type) => {
      const filteredShots = type === "All" ? state.shots : state.shots.filter((shot) => shot.shot === type);
      const totalAttempted = filteredShots.reduce((sum, shot) => sum + shot.attempted, 0);
      const totalMade = filteredShots.reduce((sum, shot) => sum + shot.made, 0);
      const percentage = totalAttempted > 0 ? (totalMade / totalAttempted) * 100 : 0;
      acc[type] = { totalMade, totalAttempted, percentage };
      return acc;
    }, {} as Record<string, { totalMade: number; totalAttempted: number; percentage: number }>);

    return { statsByType };
  }),
  updateShot: (updatedShot) => {
    set((state) => {
        const shots = state.shots.map((shot) =>
            shot.id === updatedShot.id
                ? { ...updatedShot, percentage: (updatedShot.made / updatedShot.attempted) * 100 }
                : shot
        );

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(shots));

        return { shots };
    });

    get().calculateTotals();
    get().calculateStatsByType();
  },
  deleteShot: (id) => {
    set((state) => {
        const shots = state.shots.filter((shot) => shot.id !== id);

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(shots));

        return { shots };
    });

    get().calculateTotals();
    get().calculateStatsByType();
  },
  loadFromLocalStorage: () => {
    const savedShots = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]").map((shot: any) => ({
        ...shot,
        date: new Date(shot.date),
    }));

    set({ shots: savedShots });

    get().calculateTotals();
    get().calculateStatsByType();
  },
}));
