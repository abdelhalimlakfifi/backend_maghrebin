require('dotenv').config();

function internalError(errorMessage = "Internal Server Error", error){

    if(process.env.MODE !== "development")
    {
        return {
            status: 500,
            message: errorMessage
        }

        throw error
    }
}



module.exports = {internalError}