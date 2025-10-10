import { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface RealTimeCountdownProps {
  expiryDate: string;
}

export function RealTimeCountdown({ expiryDate }: RealTimeCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeRemaining = (targetDate: string): TimeRemaining => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    // Calcular tempo inicial
    setTimeRemaining(calculateTimeRemaining(expiryDate));

    // Atualizar a cada segundo
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(expiryDate));
    }, 1000);

    // Limpar interval quando componente for desmontado
    return () => clearInterval(interval);
  }, [expiryDate]);

  const formatTime = (time: TimeRemaining) => {
    if (time.days > 0) {
      return {
        primary: `${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s`,
        secondary: `${time.days} dias, ${time.hours} horas, ${time.minutes} minutos e ${time.seconds} segundos`,
        isExpired: false,
      };
    } else if (time.hours > 0) {
      return {
        primary: `${time.hours}h ${time.minutes}m ${time.seconds}s`,
        secondary: `${time.hours} horas, ${time.minutes} minutos e ${time.seconds} segundos`,
        isExpired: false,
      };
    } else if (time.minutes > 0) {
      return {
        primary: `${time.minutes}m ${time.seconds}s`,
        secondary: `${time.minutes} minutos e ${time.seconds} segundos`,
        isExpired: false,
      };
    } else if (time.seconds > 0) {
      return {
        primary: `${time.seconds}s`,
        secondary: `${time.seconds} segundos`,
        isExpired: false,
      };
    } else {
      return {
        primary: "Expirado",
        secondary: "Plano expirado",
        isExpired: true,
      };
    }
  };

  const formattedTime = formatTime(timeRemaining);
  const totalDays = timeRemaining.days;
  const isUrgent = totalDays <= 7 && !formattedTime.isExpired;

  return (
    <Box sx={{ textAlign: "center", py: 2 }}>
      <Typography
        variant="h3"
        fontWeight="bold"
        sx={{
          color: formattedTime.isExpired
            ? "error.main"
            : isUrgent
              ? "warning.main"
              : "primary.main",
          fontFamily: "monospace",
          letterSpacing: "2px",
        }}
      >
        {formattedTime.primary}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        {formattedTime.isExpired
          ? "Renove seu plano"
          : `até ${totalDays > 0 ? "expirar" : "renovar"}`}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 0.5, fontStyle: "italic" }}
      >
        {formattedTime.secondary}
      </Typography>

      {totalDays <= 3 && !formattedTime.isExpired && (
        <Typography
          variant="caption"
          sx={{
            mt: 1,
            display: "block",
            color: "error.main",
            fontWeight: "bold",
            "@keyframes blink": {
              "0%, 50%": { opacity: 1 },
              "51%, 100%": { opacity: 0.3 },
            },
            animation: "blink 1s infinite",
          }}
        >
          ⚠️ ATENÇÃO: Plano expira em breve!
        </Typography>
      )}
    </Box>
  );
}
