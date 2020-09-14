import create from 'zustand'

export const useHistory = create((set) => ({
  yearsAgo: 2,
  setYearsAgo: (yearsAgo) => set({ yearsAgo }),
  data: {
    type: 'FeatureCollection',
    features: [],
  },
  setData: (data) => set({ data }),
}))
