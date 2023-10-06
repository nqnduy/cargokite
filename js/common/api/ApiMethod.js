import ApiCall from './ApiCall';

const call = async (options = {}) => {
    let res = await ApiCall(options);

    if (res) {
        try {
            let _msgs = res.message || ['Vui lòng kiểm trả lại thông tin!'];
        } catch (error) {
            console.error('error at calling api', error);
        }
    } else {
        res = {
            status: false,
            message: 'Vui lòng kiểm trả lại thông tin!',
        };
    }

    return res;
};

const POST = async (options) => {
    const res = await call({
        method: 'POST',
        ...options,
    });

    return res;
};

const PUT = async (options) => {
    const res = await call({
        method: 'PUT',
        ...options,
    });
    return res;
};

const DELETE = async (options) => {
    const res = await call({
        method: 'DELETE',
        ...options,
    });
    return res;
};

const PATCH = async (options) => {
    const res = await call({
        method: 'PATCH',
        ...options,
    });
    return res;
};

const GET = async (options) => {
    const res = await call({
        method: 'GET',
        ...options,
    });
    return res;
};

export { DELETE, GET, PATCH, POST, PUT };

