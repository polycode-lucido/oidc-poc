import React from 'react';
import {
  useTheme,
  Box,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
} from '@mui/material';

import styles from '../../styles/components/filters/Filter.module.css';
import stateStyles from '../../styles/components/filters/StateFilter.module.css';
import { useTranslation } from '../../lib/translations';

import { StateFilterType } from '../../lib/common/filter';

interface StateFilterProps {
  value: StateFilterType;
  onChange: (newState: StateFilterType) => void;
}

export default function StateFilter({ value, onChange }: StateFilterProps) {
  // import mui theme
  const theme = useTheme();
  const { i18n } = useTranslation();

  return (
    <Box
      className={`${styles.container} ${stateStyles.container}`}
      sx={{ border: `1px solid ${theme.palette.text.secondary}` }}
    >
      <Box className={stateStyles.innerContainer}>
        {/* title */}
        <Box className={stateStyles.titleContainer}>
          <Typography className={stateStyles.title}>
            {i18n.t('components.filters.stateFilter.title')}
          </Typography>
        </Box>

        {/* checkbox group */}
        <FormGroup className={stateStyles.formGroup}>
          <FormControlLabel
            className={stateStyles.formGroupLabel}
            control={
              <Checkbox
                onClick={() => onChange({ ...value, done: !value.done })}
                checked={value.done}
              />
            }
            value="done"
            label="Done"
          />
          <FormControlLabel
            className={stateStyles.formGroupLabel}
            control={
              <Checkbox
                onClick={() => onChange({ ...value, started: !value.started })}
                checked={value.started}
              />
            }
            value="started"
            label="Started"
          />
        </FormGroup>
      </Box>
    </Box>
  );
}
