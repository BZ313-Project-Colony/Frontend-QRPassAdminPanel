const executeSafeProcess = async (process, onSuccess, onError) => {
    try {
        let result = await process()
        onSuccess(result.data)
    } catch (error) {
        console.log(error);
        onError(error.message)
    }
}

export default executeSafeProcess