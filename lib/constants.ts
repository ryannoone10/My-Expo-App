// Shared status configuration used across screens and components
export const STATUS_MAP: Record<number, { label: string; bg: string; text: string }> = {
  0: { label: 'Applied', bg: '#ad7cfbc4', text: '#0e0d0e' },
  1: { label: 'Screening', bg: '#f5fdadd7', text: '#0a0a0a' },
  2: { label: 'Interviewing', bg: '#9fe5fac5', text: '#060606' },
  3: { label: 'Offer', bg: '#d1f5a2c6', text: '#0b0b0b' },
  4: { label: 'Rejected', bg: '#fa7272b8', text: '#050505' },
};