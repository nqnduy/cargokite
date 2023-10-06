const CONFIG = {
    PUBLIC_API_BASE_PATH: process.env.PUBLIC_API_BASE_PATH || '',
}

if (typeof window != 'undefined') {
    window.__config__ = CONFIG;
    // console.log(CONFIG);
} else {
    // console.log(CONFIG);
}

export default CONFIG;