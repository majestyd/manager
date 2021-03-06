import { isEmpty } from 'ramda';
import * as React from 'react';

import { makeStyles, Theme } from 'src/components/core/styles';
import Typography from 'src/components/core/Typography';
import Grid from 'src/components/Grid';
import { Props as TextFieldProps } from 'src/components/TextField';
import * as zxcvbn from 'zxcvbn';
import StrengthIndicator from '../PasswordInput/StrengthIndicator';
import HideShowText from './HideShowText';

type Props = TextFieldProps & {
  value?: string;
  required?: boolean;
  disabledReason?: string;
  hideStrengthLabel?: boolean;
  hideHelperText?: boolean;
  hideValidation?: boolean;
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    position: 'relative',
    marginBottom: theme.spacing(1),
    paddingBottom: theme.spacing(1) / 2
  },
  strengthIndicator: {
    position: 'relative',
    top: -5,
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%'
    }
  },
  infoText: {
    fontSize: '0.85rem',
    marginTop: 12
  }
}));

type CombinedProps = Props;

const PasswordInput: React.FC<CombinedProps> = props => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const {
    value,
    required,
    disabledReason,
    hideStrengthLabel,
    hideHelperText,
    hideValidation,
    ...rest
  } = props;

  const classes = useStyles();

  const strength = React.useMemo(() => maybeStrength(value), [value]);

  return (
    <React.Fragment>
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <HideShowText
            {...rest}
            tooltipText={disabledReason}
            value={value}
            onChange={onChange}
            fullWidth
            required={required}
          />
        </Grid>
        {!hideValidation && (
          <Grid item xs={12} className={`${classes.strengthIndicator} py0`}>
            <StrengthIndicator
              strength={strength}
              hideStrengthLabel={hideStrengthLabel}
            />
          </Grid>
        )}
      </Grid>
      {!hideHelperText && (
        <Typography variant="body1" className={classes.infoText}>
          Password must be at least 6 characters and contain at least two of the
          following character classes: uppercase letters, lowercase letters,
          numbers, and punctuation.
        </Typography>
      )}
    </React.Fragment>
  );
};

const maybeStrength = (value?: string) => {
  if (!value || isEmpty(value)) {
    return null;
  } else {
    const score = zxcvbn(value).score;
    if (score === 4) {
      return 3;
    }
    return score;
  }
};

export default React.memo(PasswordInput);
