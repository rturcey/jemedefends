export const statusClass = (status: 'default' | 'valid' | 'invalid') =>
  [
    'block w-full rounded-lg border-2 px-3 py-2 text-sm font-medium bg-white',
    'transition-all focus:outline-none focus:ring-2',
    status === 'valid' && 'border-green-500 focus:border-green-500 focus:ring-green-500/30',
    status === 'invalid' && 'border-orange-500 focus:border-orange-500 focus:ring-orange-500/30',
    status === 'default' && 'border-gray-300 focus:border-blue-600 focus:ring-blue-600/20',
  ]
    .filter(Boolean)
    .join(' ');
