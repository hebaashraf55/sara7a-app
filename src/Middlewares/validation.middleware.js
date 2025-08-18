

export const validation = (schema) => {
    return(req,res,next) => {

    const validationError = [];
    for (const key of Object.keys(schema)) {
        const validationResults = schema[key] .validate(req[key], { abortEarly : false})
                
    if(validationResults.error){
        validationError.push({
            key , 
            datails : validationResults.error.details[0].message
        })
        } }

    if(validationError.length){
        return res.status(400).json({error : "validation error" ,  datails : validationError})
    }
    return next()
    }
  
}
    
