import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import logger from '../utils/logger';

const NOTIFICATION_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'placement', label: 'Placement' },
  { value: 'result', label: 'Result' },
  { value: 'event', label: 'Event' },
];

const LIMIT_OPTIONS = [5, 10, 15, 20, 25, 50];

function ToolbarFilters({ type, onTypeChange, limit, onLimitChange, limitOptions }) {
  const limits = limitOptions || LIMIT_OPTIONS;

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    logger.info('ToolbarFilters', 'Filter type changed', { from: type, to: newType });
    onTypeChange(newType);
  };

  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    logger.info('ToolbarFilters', 'Limit changed', { from: limit, to: newLimit });
    onLimitChange(newLimit);
  };

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap">
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="type-filter-label">Notification Type</InputLabel>
        <Select
          labelId="type-filter-label"
          value={type}
          label="Notification Type"
          onChange={handleTypeChange}
        >
          {NOTIFICATION_TYPES.map((t) => (
            <MenuItem key={t.value} value={t.value}>
              {t.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel id="limit-filter-label">Per Page</InputLabel>
        <Select
          labelId="limit-filter-label"
          value={limit}
          label="Per Page"
          onChange={handleLimitChange}
        >
          {limits.map((l) => (
            <MenuItem key={l} value={l}>
              {l}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}

export default React.memo(ToolbarFilters);
