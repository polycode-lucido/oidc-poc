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
import stateStyles from '../../styles/components/filters/TagFilter.module.css';
import { useTranslation } from '../../lib/translations';

import { TagFilterType } from '../../lib/common/filter';

interface TagFilterProps {
  value: TagFilterType;
  onChange: (tags: TagFilterType) => void;
}

export default function TagFilter({
  value: selectedTags,
  onChange,
}: TagFilterProps) {
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
            {i18n.t('components.filters.tagFilter.title')}
          </Typography>
        </Box>

        {/* checkbox group */}
        <FormGroup className={stateStyles.formGroup}>
          {selectedTags
            ? Object.keys(selectedTags).map((language: string) => (
                <FormControlLabel
                  key={language}
                  className={stateStyles.formGroupLabel}
                  control={
                    <Checkbox
                      checked={selectedTags[language] || false}
                      onClick={() => {
                        onChange({
                          ...selectedTags,
                          [language]: !selectedTags[language],
                        });
                      }}
                    />
                  }
                  label={language}
                />
              ))
            : null}
        </FormGroup>
      </Box>
    </Box>
  );
}
