const API_URL = import.meta.env.VITE_BASE_API;

async function request(path,body) {
    const res = await fetch(API_URL + path,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}))
    
    if(!res.ok){
        if (data?.error?.message) {
            const err = new Error(data.error.message);
            err.code = data.error.code;
            err.traceId = data.traceId;
            err.status = res.status;
            throw err;
        }

        if (Array.isArray(data?.errors)) {
            const err = new Error(data.errors.map((e) => e.message).join(", "));
            err.code = "VALIDATION_FAILED";
            err.fieldErrors = data.errors;
            err.status = res.status;
            throw err;
        }
        throw new Error(`Request failed ${res.status}`);
    }

    return data;
}

export const login = ({email, password}) => request('/auth/login',{email, password});
export const register = ({name, email, password}) => request('/auth/register',{name, email, password});