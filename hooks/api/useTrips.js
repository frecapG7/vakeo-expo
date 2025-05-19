import { useMutation, useQuery } from "@tanstack/react-query";

const postTrip = async (trip) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      console.log("Trip posted:", JSON.stringify(trip));
      resolve({
        ...trip,
        id: Math.floor(Math.random() * 1000), // Simulate an ID for the new trip
      });
    }, 3000)
  );
};

export const usePostTrip = () => {
  return useMutation({
    mutationFn: postTrip,
    onSuccess: (data) => {
      console.log("Trip posted successfully:", data);
    },
  });
};

const getTrip = async (tripId) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      console.log("Trip fetched:", tripId);
      resolve({
        id: tripId,
        name: "Luberon V3",
        startDate: "2023-10-01",
        endDate: "2023-10-10",
        users: [
          {
            id: 1,
            name: "Moi",
          },
          {
            id: 2,
            name: "Willy",
          },
          {
            id: 3,
            name: "Mélanie",
          },
        ],
        author: 1,
      });
    }, 3000)
  );
};

export const useGetTrip = (tripId) => {
  return useQuery({
    queryKey: ["trips", tripId],
    queryFn: () => getTrip(tripId),
    enabled: !!tripId,
  });
};
