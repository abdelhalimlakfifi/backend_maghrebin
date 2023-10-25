function internalError(errorMessage = "Internal Server Error"){
    return {
        status: 500,
        message: errorMessage
    }
}



module.exports = {internalError}