// Shared status configuration used across screens and components
export const STATUS_MAP: Record<number, { label: string; bg: string; text: string }> = {
  0: { label: 'Applied', bg: '#FBEAF0', text: '#f26594' },
  1: { label: 'Screening', bg: '#E6F1FB', text: '#efec23' },
  2: { label: 'Interviewing', bg: '#E6F1FB', text: '#54def3' },
  3: { label: 'Offer', bg: '#EAF3DE', text: '#3B6D11' },
  4: { label: 'Rejected', bg: '#FCEBEB', text: '#A32D2D' },
};