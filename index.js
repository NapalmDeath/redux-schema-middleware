import { normalize } from 'normalizr';


const apiParser = store => next => action => {
    const { schema } = action;
    if (!schema || !action.payload) {
        return next(action);
    }

    function actionWith(data) {
        return Object.assign({}, action, data);
    }

    const parsedResponse = normalize(action.payload, schema);
    return next(actionWith({ parsedResponse }));
};

export default apiParser;