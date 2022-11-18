import { PlayArrow } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, IconButton, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from './TopLevelAccordion';

import runValidatorAPI from '../../lib/api/playground';
import { useLoginContext } from '../../lib/loginContext';
import { toastError } from '../base/toast/Toast';
import { useEditorContext } from './CodeEditorContext';
import Validator, { IValidatorStatus } from './Validator';

import styles from '../../styles/components/playground/Validators.module.css';
import { useTranslation } from '../../lib/translations';

export default function Validators() {
  const { i18n } = useTranslation();

  const context = useEditorContext();

  const { credentialsManager } = useLoginContext();

  const [expand, setExpand] = React.useState<boolean>(false);

  const [expandedValidator, setExpandedValidator] = React.useState<
    number | undefined
  >(undefined);

  const [validatorStatus, setValidatorStatus] = React.useState<
    Array<IValidatorStatus>
  >(
    Array(context.validators.length).fill({
      success: false,
      latestRun: false,
      output: { stdout: '', stderr: '' },
      loading: false,
    })
  );

  // invalidate last run if code changed
  useEffect(() => {
    setValidatorStatus((oldStatuses) =>
      oldStatuses.map((validator) => ({
        ...validator,
        latestRun: false,
      }))
    );
  }, [context.code]);

  useEffect(() => {
    // check for the validator to expand when status is updated
    if (context.lastOutput.testId) {
      const index = context.validators.findIndex(
        (e) => e.id === context.lastOutput.testId
      );

      const expanded = index === -1 ? undefined : index;

      // expand only if needed
      if (
        typeof expanded !== 'undefined' &&
        validatorStatus[expanded].latestRun &&
        !validatorStatus[expanded].success
      ) {
        setExpand(true);
        setExpandedValidator(expanded);
      }
    }
  }, [context.lastOutput.testId, context.validators, validatorStatus]);

  const runValidator = async (index: number) => {
    let result;
    let stderr = '';
    let stdout = '';
    let success = false;
    try {
      result = await runValidatorAPI(
        context.validators[index].id || '',
        context.code,
        context.language,
        credentialsManager
      );

      if (result.status === 201) {
        success = result.data.success;
        stderr = result.data.codeResult.stderr || '';
        stdout = result.data.codeResult.stdout || '';
      } else {
        stderr = i18n.t('components.playground.validators.runAllError');
      }
    } catch (e) {
      toastError(
        <Typography>
          {i18n.t('components.playground.validators.runAllError')}
        </Typography>
      );
      stderr = i18n.t('components.playground.validators.runAllError');
    } finally {
      context.setLastOutput({
        stderr,
        stdout,
        testId: context.validators[index].id,
      });
    }

    return {
      stderr,
      stdout,
      success,
    };
  };

  const handleRunAllValidators = async () => {
    setValidatorStatus((oldStatuses) =>
      oldStatuses.map((validator) => ({
        ...validator,
        loading: true,
      }))
    );

    const newStatuses = [...validatorStatus];
    for (let i = 0; i < context.validators.length; i += 1) {
      // here we want to run the validators synchronously
      // eslint-disable-next-line no-await-in-loop
      const result = await runValidator(i);
      newStatuses[i] = {
        latestRun: true,
        loading: false,
        success: result.success,
        output: { stdout: result.stdout, stderr: result.stderr },
      };
      // stop on first error
      if (!result.success) break;
    }
    // set new status
    setValidatorStatus(newStatuses);
  };

  const handleRunValidator = async (index: number) => {
    // set loading
    setValidatorStatus((oldStatuses) => {
      const newStatuses = [...oldStatuses];
      newStatuses[index] = {
        ...newStatuses[index],
        loading: true,
      };
      return newStatuses;
    });

    // call api

    const result = await runValidator(index);

    // set new status
    setValidatorStatus((oldStatuses) => {
      const newStatuses = [...oldStatuses];
      newStatuses[index] = {
        latestRun: true,
        loading: false,
        success: result.success,
        output: { stdout: result.stdout, stderr: result.stderr },
      };
      return newStatuses;
    });
  };

  const toggleExpand = () => {
    setExpand(!expand);
  };

  return (
    <Accordion expanded={expand}>
      <AccordionSummary
        className={styles.head}
        expandIcon={
          <IconButton onClick={toggleExpand} className={styles.expandButton}>
            <ExpandMoreIcon />
          </IconButton>
        }
      >
        <div
          className={styles.clickableSummary}
          role="presentation"
          onClick={toggleExpand}
        >
          <Typography variant="h6" className={styles.autoMargin}>
            {i18n.t('components.playground.validators.title')}
          </Typography>

          <Box width="1em" />

          <Typography className={styles.autoMargin} color="text.secondary">
            {Math.floor(
              (validatorStatus.filter((s) => s.success).length * 100) /
                context.validators.length
            )}{' '}
            {i18n.t('components.playground.validators.passed')}
          </Typography>

          <Box flexGrow={1} />
        </div>

        <LoadingButton
          size="medium"
          variant="contained"
          sx={{ margin: 'auto' }}
          startIcon={<PlayArrow />}
          loading={validatorStatus.some((s) => s.loading)}
          onClick={handleRunAllValidators}
          // disabled={!validatorStatus.some((s) => !s.latestRun)} // disable if all tests have bee run
        >
          {i18n.t('components.playground.validators.runAll')}
        </LoadingButton>
      </AccordionSummary>

      <AccordionDetails>
        {context.validators.map((validator, index) => (
          <Validator
            toggleExpanded={() => {
              setExpandedValidator(
                index === expandedValidator ? undefined : index
              );
            }}
            expanded={expandedValidator === index}
            data={validator}
            index={index}
            onRun={() => handleRunValidator(index)}
            status={validatorStatus[index]}
            highlight={context.lastOutput.testId === validator.id}
            key={validator.id}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
