import { Done, PlayArrow, Warning } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, IconButton, styled, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { Validator as IValidator } from '../../lib/api/content';

import styles from '../../styles/components/playground/Validator.module.css';
import { useTranslation } from '../../lib/translations';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters square elevation={0} {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:first-of-type': {
    borderTopRightRadius: '5px',
    borderTopLeftRadius: '5px',
  },
  '&:last-child': {
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  backgroundColor: 'transparent',
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary {...props} />
))(() => ({
  cursor: 'initial !important',
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
export interface IValidatorStatus {
  success: boolean;
  latestRun: boolean;
  output: { stdout: string; stderr: string };
  loading: boolean;
}

interface ValidatorProps {
  status: IValidatorStatus;
  onRun: () => void;
  data: IValidator;
  index: number;
  highlight: boolean;
  expanded: boolean;
  toggleExpanded: () => void;
}

export default function Validator({
  status,
  onRun,
  data,
  index: id,
  highlight,
  expanded,
  toggleExpanded,
}: ValidatorProps) {
  const { i18n } = useTranslation();

  const backgroundColor = status.success ? '#00C4B644' : '#FF200044';

  const buttonId = `validator-button-${id}`;

  const handleRun = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    onRun();
  };

  return (
    <Accordion expanded={expanded}>
      <AccordionSummary
        expandIcon={
          <Box className={styles.expandButtonContainer}>
            {!data.isHidden && (
              <IconButton
                onClick={toggleExpanded}
                className={styles.expandButton}
              >
                <ExpandMoreIcon />
              </IconButton>
            )}
          </Box>
        }
        className={styles.head}
        sx={{
          backgroundColor:
            highlight && status.latestRun ? backgroundColor : 'inherit',
        }}
      >
        <div
          className={styles.clickableSummary}
          role="presentation"
          onClick={toggleExpanded}
        >
          <Typography className={styles.autoMargin}>
            {i18n.t('components.playground.validator.#')}
            {id + 1}
          </Typography>
          <Box width="1rem" />
          {data.isHidden && (
            <Typography className={styles.autoMargin} color="text.secondary">
              {i18n.t('components.playground.validator.hidden')}
            </Typography>
          )}

          <Box flexGrow={1} />
          {status.latestRun && status.success && (
            <Done className={styles.autoMargin} color="success" />
          )}
          {status.latestRun && !status.success && (
            <Warning className={styles.autoMargin} color="error" />
          )}
          <Box width="1rem" />
        </div>
        <LoadingButton
          size="small"
          className={styles.autoMargin}
          variant="outlined"
          startIcon={<PlayArrow />}
          onClick={handleRun}
          id={buttonId}
        >
          {i18n.t('components.playground.validator.run')}
        </LoadingButton>
      </AccordionSummary>
      {!data.isHidden && (
        <AccordionDetails>
          <Box className={styles.description}>
            <Typography>
              {i18n.t('components.playground.validator.input')}
            </Typography>
            <pre className={styles.outputPre}>{data.input?.stdin}</pre>
            <Typography>
              {i18n.t('components.playground.validator.expected')}
            </Typography>
            <pre className={styles.outputPre}>{data.expected?.stdout}</pre>
          </Box>
        </AccordionDetails>
      )}
    </Accordion>
  );
}
