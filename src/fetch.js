/**
 * Created by steve on 8/24/2016.
 */

import 'whatwg-fetch';

export default self.fetch.bind(self);
export const Headers = self.Headers;
export const Request = self.Request;
export const Response = self.Response;

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
