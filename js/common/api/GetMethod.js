import { GET } from './ApiMethod';

const getData = {
    list: async (type) => {
        const { data } = await GET({
            path: `/${type}`
        })
        if (!data) {
            console.log("Something went wrong")
        }
        return data;
    },
    byId: async (type, id) => {
        const { data } = await GET({
            path: `/${type}/${id}`,
        });

        if (!data) {
            console.log("Something went wrong")
        }
        return data;
    }
}

export default getData;