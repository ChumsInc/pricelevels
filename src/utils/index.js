/**
 * Created by steve on 8/26/2016.
 */

export const fetchOptions = {
    PostJSON: (object) => {
        return {
            credentials: 'same-origin',
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        };
    },
    Delete: () => {
        return {
            credentials: 'same-origin',
            method: 'DELETE'
        };
    }
};

export const priceCalc = {
    D: (stdPrice, discountMarkup) => {
        return discountMarkup === '' || discountMarkup === undefined
            ? stdPrice
            : (1 - (discountMarkup / 100)) * stdPrice;
    },
    P: (stdPrice, discountMarkup) => {
        return discountMarkup === '' || discountMarkup === undefined
            ? stdPrice
            : stdPrice - discountMarkup;
    },
    O: (stdPrice, discountMarkup) => discountMarkup,
    C: (stdPrice, discountMarkup) => 0,
    M: (stdPrice, discountMarkup) => 0,
};
