import { Backdrop, CircularProgress } from "@mui/material";

interface LoadingBackdropProps {
  open: boolean;
}

export function LoadingBackdrop({ open }: LoadingBackdropProps) {
  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
