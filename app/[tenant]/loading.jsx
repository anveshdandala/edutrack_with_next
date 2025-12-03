import LinearProgress from "@mui/material/LinearProgress";
export default function Loading() {
  return (
    <div className="w-full fixed top-0 left-0 z-50">
      {/* This will show at the very top of the screen */}
      <LinearProgress />
    </div>
  );
}
