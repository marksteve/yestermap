import create from 'zustand'

export const useHistory = create((set) => ({
  yearsAgo: 2,
  setYearsAgo: (yearsAgo) => set({ yearsAgo }),
}))
