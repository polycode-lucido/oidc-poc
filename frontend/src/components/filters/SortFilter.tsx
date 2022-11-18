import React from 'react';
import {
  useTheme,
  Box,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@mui/material';

import styles from '../../styles/components/filters/Filter.module.css';
import sortStyles from '../../styles/components/filters/SortFilter.module.css';
import { useTranslation } from '../../lib/translations';

import { SortFilterType } from '../../lib/common/filter';

type Props = {
  value: SortFilterType;
  onChange: (sort: SortFilterType) => void;
};

export default function SortFilter({ value, onChange }: Props) {
  // import mui theme
  const theme = useTheme();
  const { i18n } = useTranslation();

  return (
    <Box
      className={styles.container}
      sx={{ border: `1px solid ${theme.palette.text.secondary}` }}
    >
      <Box className={sortStyles.innerContainer}>
        {/* title */}
        <Box className={sortStyles.titleContainer}>
          <Typography className={sortStyles.title}>
            {i18n.t('components.filters.sortFilter.title')}
          </Typography>
        </Box>

        {/* radio group */}
        <RadioGroup
          className={sortStyles.radioGroup}
          defaultValue={value}
          name="radio-buttons-group"
          onChange={(event) => onChange(event.target.value as SortFilterType)}
        >
          <FormControlLabel
            className={sortStyles.formGroupLabel}
            value="name"
            control={<Radio />}
            label={i18n.t('components.filters.sortFilter.name')}
          />
          <FormControlLabel
            className={sortStyles.formGroupLabel}
            value="date"
            control={<Radio />}
            label={i18n.t('components.filters.sortFilter.date')}
          />
          <FormControlLabel
            className={sortStyles.formGroupLabel}
            value="completion"
            control={<Radio />}
            label={i18n.t('components.filters.sortFilter.completion')}
          />
        </RadioGroup>
      </Box>
    </Box>
  );
}
