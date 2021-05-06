import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#000000",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
    fontFamily: ['"Montserrat", sans-serif'].join(","),
    h6: {
      fontFamily: '"Montserrat", sans-serif',
    },
  },
});
