'use strict';

angular.module('meanApp')
    .service('apiSvc', [ function () {
        this.url = 'http://localhost:8020/';
    }]);
