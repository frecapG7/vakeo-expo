import { useQuery } from "@tanstack/react-query";




const getVotes = async (tripId, params) => {
    // const response = await axios.get(`/trips/${tripId}/votes`, {
    //     params
    // }) ;

    // return response.data;


    return {
        "nextCursor": "69086c2872354204d3586db2",
        "prevCursor": "6904dafbc38bded5094eb652",
        "totalResults": 2,
        "votes": [
            {
                "voters": [],
                "_id": "6904dafbc38bded5094eb652",
                "trip": "68cbc08aced392b9d0b86c8c",
                "status": "CLOSED",
                "createdBy": {
                    "_id": "68cbc08aced392b9d0b86c86",
                    "name": "Moi",
                    "avatar": "",
                    "__v": 0
                },
                "type": "DATES",
                "votes": [
                    {
                        "startDate": "2025-09-20T08:19:22.998Z",
                        "endDate": "2025-09-25T08:19:22.998Z",
                        "users": [
                            "68cbc08aced392b9d0b86c86",
                            "68cbc08aced392b9d0b86c87"
                        ],
                        "_id": "6904dafbc38bded5094eb653"
                    },
                    {
                        "startDate": "2025-09-20T08:19:22.998Z",
                        "endDate": "2025-09-25T08:19:22.998Z",
                        "users": [
                            "68cbc08aced392b9d0b86c86"
                        ],
                        "_id": "6904dafbc38bded5094eb654"
                    },
                    {
                        "startDate": "2025-10-20T08:19:22.998Z",
                        "endDate": "2025-10-25T08:19:22.998Z",
                        "users": [
                            "68cbc08aced392b9d0b86c87"
                        ],
                        "_id": "6904df4e2b93cb93eaded98e"
                    }
                ],
                "createdAt": "2025-10-31T15:51:23.081Z",
                "updatedAt": "2025-10-31T16:17:34.559Z",
                "__v": 2
            },
            {
                "_id": "69086c2872354204d3586db2",
                "trip": "68cbc08aced392b9d0b86c8c",
                "status": "OPEN",
                "createdBy": {
                    "_id": "68cbc08aced392b9d0b86c86",
                    "name": "Moi",
                    "avatar": "",
                    "__v": 0
                },
                "type": "DATES",
                "votes": [
                    {
                        "startDate": "2025-09-20T08:19:22.998Z",
                        "endDate": "2025-09-25T08:19:22.998Z",
                        "users": [
                            "68cbc08aced392b9d0b86c86",
                            "68cbc08aced392b9d0b86c87"
                        ],
                        "_id": "6904dafbc38bded5094eb653"
                    },
                    {
                        "startDate": "2025-09-20T08:19:22.998Z",
                        "endDate": "2025-09-25T08:19:22.998Z",
                        "users": [
                            "68cbc08aced392b9d0b86c86"
                        ],
                        "_id": "6904dafbc38bded5094eb654"
                    },
                    {
                        "startDate": "2025-10-20T08:19:22.998Z",
                        "endDate": "2025-10-25T08:19:22.998Z",
                        "users": [
                            "68cbc08aced392b9d0b86c87"
                        ],
                        "_id": "69086de924523241f182f187"
                    }
                ],
                "createdAt": "2025-11-03T08:47:36.912Z",
                "updatedAt": "2025-11-03T08:55:05.306Z",
                "__v": 1,
                "voters": [
                    {
                        "_id": "68cbc08aced392b9d0b86c86",
                        "name": "Moi",
                        "avatar": "",
                        "__v": 0
                    },
                    {
                        "_id": "68cbc08aced392b9d0b86c87",
                        "name": "Tome",
                        "avatar": "",
                        "__v": 0
                    }
                ]
            }
        ]
    }


}



export const useGetVotes = (tripId, params) => {
    return useQuery({
        queryKey: ["trips", tripId, "votes", params],
        queryFn: () => getVotes(tripId)
    });
}



const getVote = async (tripId, voteId) => {

    return (
        {
            "_id": "69086c2872354204d3586db2",
            "trip": "68cbc08aced392b9d0b86c8c",
            "status": "OPEN",
            "createdBy": {
                "_id": "68cbc08aced392b9d0b86c86",
                "name": "Moi",
                "avatar": "",
                "__v": 0
            },
            "type": "DATES",
            "votes": [
                {
                    "startDate": "2025-09-20T08:19:22.998Z",
                    "endDate": "2025-09-25T08:19:22.998Z",
                    "users": [
                        {
                            "_id": "68cbc08aced392b9d0b86c86",
                            "name": "Moi",
                            "avatar": "",
                            "__v": 0
                        },
                        {
                            "_id": "68cbc08aced392b9d0b86c87",
                            "name": "Tome",
                            "avatar": "",
                            "__v": 0
                        }
                    ],
                    "_id": "6904dafbc38bded5094eb653"
                },
                {
                    "startDate": "2025-10-20T08:19:22.998Z",
                    "endDate": "2025-10-25T08:19:22.998Z",
                    "users": [
                        {
                            "_id": "68cbc08aced392b9d0b86c87",
                            "name": "Tome",
                            "avatar": "",
                            "__v": 0
                        }
                    ],
                    "_id": "69086de924523241f182f187"
                },
                {
                    "startDate": "2025-11-26T00:00:00.000Z",
                    "endDate": "2025-11-29T23:59:59.999Z",
                    "users": [
                        {
                            "_id": "68cbc08aced392b9d0b86c86",
                            "name": "Moi",
                            "avatar": "",
                            "__v": 0
                        }
                    ],
                    "_id": "690b6dbcfccf3dad033e2410"
                }
            ],
            "createdAt": "2025-11-03T08:47:36.912Z",
            "updatedAt": "2025-11-05T15:31:08.117Z",
            "__v": 2,
            "voters": [
                {
                    "_id": "68cbc08aced392b9d0b86c86",
                    "name": "Moi",
                    "avatar": "",
                    "__v": 0
                },
                {
                    "_id": "68cbc08aced392b9d0b86c87",
                    "name": "Tome",
                    "avatar": "",
                    "__v": 0
                }
            ]
        }
    )
}

export const useGetVote = (tripId, voteId) => {
    return useQuery({
        queryKey: ["trips", tripId, "votes", voteId],
        queryFn: () => getVote(tripId, voteId),
        enabled: (!!tripId && !!voteId)
    });
}