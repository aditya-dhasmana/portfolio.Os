import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { BatteryFull, Signal, Wifi } from "lucide-react";

const StatusBar = ({ compact = false }) => {
  const [now, setNow] = useState(() => dayjs());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(dayjs()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className={compact ? "mobile-status mobile-status-compact" : "mobile-status"}>
      <time>{now.format("HH:mm")}</time>
      <div className="mobile-status-icons">
        <Signal size={14} />
        <Wifi size={14} />
        <BatteryFull size={17} />
      </div>
    </div>
  );
};

export default StatusBar;
