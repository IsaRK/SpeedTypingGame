import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { PulseLoader } from "react-spinners";
import { css } from "@emotion/react";

const spinnerStyle = css`
  display: block;
  margin: 0 auto;
  border-color: black;
`;

export const Spinner: React.FunctionComponent = () => {
  return (
    <Grid container direction="column" alignItems="center">
      <Grid item>
        <Typography variant="h6">Waiting for players</Typography>
      </Grid>

      <Grid item>
        <PulseLoader
          color={"black"}
          loading={true}
          css={spinnerStyle}
          size={10}
        />
      </Grid>
    </Grid>
  );
};

export default Spinner;
