export function getResponseData(response){
    return response.data?.data;
}

export function getResponseMessage(response) {
    return response.data?.message;
}

export function getResponseRequestId(response) {
    return response.data?.requestId;
}