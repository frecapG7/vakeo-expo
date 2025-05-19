import { useQuery } from "@tanstack/react-query";

const getActivities = async (id) => {
  return [
    {
      id: 1,
      name: "Randonnée",
      startDate: "",
      endDate: "",
      user: ["*"],
    },
    {
      id: 2,
      name: "Visite de la grotte",
      startDate: "",
      endDate: "",
      user: ["1", "2"],
    },
  ];
};

export const useGetActivities = (tripId) => {
  return useQuery({
    queryKey: ["activities", tripId],
    queryFn: () => getActivities(tripId),
    enabled: !!tripId,
  });
};
