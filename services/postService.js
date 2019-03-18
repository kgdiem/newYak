import moment from 'moment';
import {from} from 'rxjs';
import {Subject} from 'rxjs/Subject';

import {service} from './service';
import {MAX_POST_LENGTH, searchUrl, postUrl} from "../constants";

export const postService = {
    collectionObserver: new Subject(),
    postObserver: new Subject(),
    // Helper methods 
    formatDate: date => {
        const diff = moment.duration(moment.utc().diff(moment.utc(date)));

        const diffHours = Math.round(diff.asHours());

        return diffHours > 0 ? `${diffHours}h` : `${Math.ceil(diff.asMinutes())}m`;
    },

    getShortenedBody: postBody => {
        if(postBody.length < MAX_POST_LENGTH)
            return postBody;

        return `${postBody.slice(0, MAX_POST_LENGTH)}...`;
    },

    // API methods
    createPost: (post, coords) => from(postService._createPost(post, coords)),

    _createPost: async (post, coords) => {
        const json = {...post, ...coords}

        const res = await service._postJson(postUrl, json);

        return res;
    },

    getPost: async id => {
        const res = await service._getJson(`${postUrl}/${id}`);

        postService.postObserver.next(res);
    },

    search: async (lat, lng) => {
        const res = await service._getJson(searchUrl(lat,lng));
        
        postService.collectionObserver.next(res);
    }
}