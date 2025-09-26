export interface InfoRequest {
    title: string
    type: string
}
export interface ResponseRequest {
    status: boolean
    info: InfoRequest
}

export interface ResponseError extends ResponseRequest {
    message: any
    response: any
    status: false
    data: {
        message: string
    }
}
export interface ResponseSuccess<ResponseData> extends ResponseRequest {
    status: true
    data: ResponseData
}
