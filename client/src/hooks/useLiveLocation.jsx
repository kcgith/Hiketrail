import { useEffect } from "react";

export default function useLiveLocation(socket, activityId, userId) {
  useEffect(() => {
    if (!socket || !activityId || !userId) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, heading, speed } = position.coords;

        socket.emit("sendLocation", {
          activityId,
          userId,
          latitude,
          longitude,
          accuracy,
          heading,
          speed
        });
      },
      (err) => console.error("Location error:", err),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [socket, activityId, userId]);
}
