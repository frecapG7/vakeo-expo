import { storage } from "@/storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface StorageTrip {
    id: string,
    name: string,
    img: string,
    me: string
}



const getStorageTrips = (): Array<StorageTrip> => {

    console.log(storage.size);
    return storage.getAllKeys()
        .filter(key => key.startsWith("trips."))
        .map(key => storage.getString(key))
        .filter(value => !!value)
        .map(value => JSON.parse(value));
}

export const useGetStorageTrips = () => {
    return useQuery({
        queryKey: ["storage", "trips"],
        queryFn: getStorageTrips
    })
}

const getStorageTrip = (id: string): StorageTrip | null => {
    const stringTrip = storage.getString(`trips.${id}`);
    if (stringTrip)
        return JSON.parse(stringTrip);
    return null;
}

export const useGetStorageTrip = (id: string) => {
    return useQuery({
        queryFn: () => getStorageTrip(id),
        queryKey: ["storage", "trips", id]
    });
}


const addTripStorage = (trip: StorageTrip): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            storage.set(`trips.${trip.id}`, JSON.stringify(trip));
            resolve();
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
}

export const useAddStorageTrip = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (trip: StorageTrip) => addTripStorage(trip),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: ["storage", "trips"]
        })
    })
}

const updateStorageTrip = (trip: StorageTrip): Promise<StorageTrip> => {
    return new Promise((resolve) => {
        storage.set(`trips.${trip.id}`, JSON.stringify(trip));
        resolve(trip);
    }
    );
}




export const useUpdateStorageTrip = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (trip: StorageTrip) => updateStorageTrip(trip),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["storage", "trips"] })
    })
}


