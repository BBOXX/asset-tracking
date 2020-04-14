exports = module.exports = {};

joi = require('joi');

exports.validateLatLng = function(latLng) {
    const schema = joi.object({
            'req': joi.array().items(
                joi.object().keys({
                    'lng': joi.number().min(-180).max(180).required(),
                    'lat': joi.number().min(-90).max(90).required()
                })
            ).length(2)
    });

    const result = joi.validate(latLng, schema);
    console.log(result)
    return result;

}

exports.validateAssetId = function(id) {
    const schema = joi.string().regex(/^[a-z0-9]{16}$/).required();

    const result = joi.validate(id, schema);
    return result;
}

exports.validateDate = function validateDate(start, end) {
    const date = {
        'start': start,
        'end': end
    }
    const schema = joi.object().keys({
        'start': joi.date().iso().less(end).required(),
        'end': joi.date().iso().greater(start).required()
    })

    const result = joi.validate(date, schema);
    console.log(result);
    return result;
}
