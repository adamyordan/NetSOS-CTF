webpackJsonp([0,3],{

/***/ 299:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(281);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(608);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return AppService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppService = (function () {
    function AppService(http) {
        this.http = http;
        this.url_root = '/ctf';
        this.url = {
            me: this.url_root + '/api/me',
            user: this.url_root + '/api/user/',
            contest: this.url_root + '/api/contest',
            participate: this.url_root + '/api/contest/register',
            loginContest: this.url_root + '/api/contest/login',
            contestStanding: this.url_root + '/api/contest/standing',
        };
        this.supersecret = 'netsos_over_ristek';
    }
    AppService.prototype.getMe = function () {
        return this.http.get(this.url.me).map(function (res) {
            var body = res.json();
            return body || {};
        });
    };
    AppService.prototype.getUser = function (id) {
        return this.http.get(this.url.user + id).map(function (res) {
            var body = res.json();
            return body.data || {};
        });
    };
    AppService.prototype.getContests = function () {
        return this.http.get(this.url.contest).map(function (res) {
            var body = res.json();
            return body.data || {};
        });
    };
    AppService.prototype.getScoreboardData = function (contest) {
        var params = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* URLSearchParams */]();
        params.set('contest_id', contest.id);
        return this.http.get(this.url.contestStanding, { search: params }).map(function (res) {
            var body = res.json();
            return body.data || {};
        });
    };
    AppService.prototype.doParticipate = function (contest) {
        var formData = new FormData();
        formData.append('contest_id', contest.id);
        return this.http.post(this.url.participate, formData).map(function (res) {
            var body = res.json();
            return body || {};
        });
    };
    AppService.prototype.doLogin = function (contest) {
        var _this = this;
        var formData = new FormData();
        formData.append('contest_id', contest.id);
        return this.http.post(this.url.loginContest, formData).map(function (res) {
            var body = res.json();
            if (body && body.setCookie) {
                var sc = body.setCookie.split('; ');
                if (sc.length > 0) {
                    var kv = sc[0].split('=');
                    _this.setCookie(sc[0], sc[1], 1);
                }
            }
            return body || {};
        });
    };
    AppService.prototype.setCookie = function (name, value, expireDays, path) {
        if (path === void 0) { path = ""; }
        var d = new Date();
        d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
        var expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + "; " + expires + (path.length > 0 ? "; path=" + path : "");
    };
    AppService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */]) === 'function' && _a) || Object])
    ], AppService);
    return AppService;
    var _a;
}());
//# sourceMappingURL=C:/Users/Adam/Documents/SharedFolder/netsos/portal/frontend/src/app.service.js.map

/***/ },

/***/ 340:
/***/ function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 340;


/***/ },

/***/ 341:
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills_ts__ = __webpack_require__(452);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(429);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(451);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_app_module__ = __webpack_require__(450);





if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_4__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=C:/Users/Adam/Documents/SharedFolder/netsos/portal/frontend/src/main.js.map

/***/ },

/***/ 449:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_service__ = __webpack_require__(299);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppComponent = (function () {
    function AppComponent(appService) {
        var _this = this;
        this.appService = appService;
        this.contests = [];
        this.oldContests = [];
        this.selectedRoute = 'contest';
        this.refreshContestsData();
        this.refreshMeData();
        setInterval(function () {
            _this.refreshContestsData();
            _this.refreshMeData();
        }, 10000);
    }
    AppComponent.prototype.refreshContestsData = function () {
        var _this = this;
        this.appService.getContests().subscribe(function (contests) {
            _this.contests = contests.filter(function (c) { return c.active; });
            _this.oldContests = contests.filter(function (c) { return !c.active; });
            if (_this.selectedContest) {
                _this.selectedContest = contests.find(function (c) { return c.id = _this.selectedContest.id; });
                _this.appService.getScoreboardData(_this.selectedContest).subscribe(function (data) {
                    _this.selectedContest['scoreboardData'] = data;
                });
            }
        });
    };
    AppComponent.prototype.refreshMeData = function () {
        var _this = this;
        this.appService.getMe().subscribe(function (user) { return _this.me = user; });
    };
    AppComponent.prototype.isParticipating = function (user, contest) {
        if (!contest.participations)
            return false;
        var participationInstance = contest.participations.find(function (p) { return p.user.id == user.id; });
        return participationInstance != null;
    };
    AppComponent.prototype.selectContest = function (contest) {
        var _this = this;
        this.selectedContest = contest;
        this.appService.getScoreboardData(this.selectedContest).subscribe(function (data) {
            _this.selectedContest['scoreboardData'] = data;
        });
    };
    AppComponent.prototype.participate = function (contest) {
        var _this = this;
        this.appService.doParticipate(contest).subscribe(function (data) {
            if (data.ok) {
                alert('ok');
            }
            else {
                alert('failed');
            }
            _this.refreshContestsData();
        });
    };
    AppComponent.prototype.login = function (contest) {
        this.appService.doLogin(contest).subscribe(function (data) {
            if (data.ok) {
                alert('ok');
            }
            else {
                alert('failed');
            }
        });
    };
    AppComponent.prototype.go = function (contest) {
        window.open(contest.url);
    };
    AppComponent.prototype.routeToProfile = function (userId) {
        var _this = this;
        if (userId === void 0) { userId = null; }
        if (userId == null && this.me) {
            this.selectedRoute = 'profile';
            this.selectedUserId = this.me.id;
        }
        else {
            this.selectedRoute = 'profile';
            this.selectedUserId = userId;
        }
        if (this.selectedUserId != null) {
            this.appService.getUser(this.selectedUser).subscribe(function (data) { return _this.selectedUser = data; });
        }
    };
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__(606),
            styles: [__webpack_require__(605)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__app_service__["a" /* AppService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__app_service__["a" /* AppService */]) === 'function' && _a) || Object])
    ], AppComponent);
    return AppComponent;
    var _a;
}());
//# sourceMappingURL=C:/Users/Adam/Documents/SharedFolder/netsos/portal/frontend/src/app.component.js.map

/***/ },

/***/ 450:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(420);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(281);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(449);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_service__ = __webpack_require__(299);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */]
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_5__app_service__["a" /* AppService */]],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=C:/Users/Adam/Documents/SharedFolder/netsos/portal/frontend/src/app.module.js.map

/***/ },

/***/ 451:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
var environment = {
    production: false
};
//# sourceMappingURL=C:/Users/Adam/Documents/SharedFolder/netsos/portal/frontend/src/environment.js.map

/***/ },

/***/ 452:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__ = __webpack_require__(466);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__ = __webpack_require__(459);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__ = __webpack_require__(455);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__ = __webpack_require__(461);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__ = __webpack_require__(460);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__ = __webpack_require__(458);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__ = __webpack_require__(457);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__ = __webpack_require__(465);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__ = __webpack_require__(454);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__ = __webpack_require__(453);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__ = __webpack_require__(463);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__ = __webpack_require__(456);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__ = __webpack_require__(464);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__ = __webpack_require__(462);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__ = __webpack_require__(467);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__ = __webpack_require__(620);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__);
















//# sourceMappingURL=C:/Users/Adam/Documents/SharedFolder/netsos/portal/frontend/src/polyfills.js.map

/***/ },

/***/ 605:
/***/ function(module, exports) {

module.exports = ".app-root {\r\n}\r\n.card-profile {\r\n  border: 1px solid white;\r\n  padding: 20px;\r\n}\r\n.topbar {\r\n  background-color: white;\r\n  height: 50px;\r\n  border-bottom: 1px solid #ddd;\r\n  padding: 10px 20px;\r\n}\r\n.topbar-right {\r\n  float: right;\r\n}\r\n.btn-sign-out {\r\n  background-color: transparent;\r\n  border: 2px solid #545454;\r\n  border-radius: 20px;\r\n  margin: 0px 10px;\r\n  color: #545454;\r\n  font-weight: bold;\r\n}\r\n.btn-sign-out:hover {\r\n  background-color: #545454;\r\n  color: white;\r\n}\r\n.sidebar {\r\n  background-color: #545454;\r\n  width: 200px;\r\n  position: absolute;\r\n  top: 0px;\r\n  height: 100vh;\r\n}\r\n.sidebar-header {\r\n  background-color: rgba(0, 0, 0, 0.3);\r\n  padding: 10px;\r\n  text-align: center;\r\n  height: 50px;\r\n  font-size: 1.4em;\r\n  font-weight: bolder;\r\n  color: #999;\r\n}\r\n.sidebar-body {\r\n  padding: 10px;\r\n}\r\n.sidebar-item {\r\n  padding: 10px;\r\n  border: 2px solid white;\r\n  margin: 5px 0px;\r\n  border-radius: 50px;\r\n  text-align: center;\r\n  width: 100%;\r\n}\r\n.main {\r\n  margin-left: 200px;  \r\n  display: -webkit-box;  \r\n  display: -ms-flexbox;  \r\n  display: flex;\r\n}\r\n.main-half-left {\r\n  -webkit-box-flex: 1;\r\n      -ms-flex: 1;\r\n          flex: 1;\r\n  height: calc(100vh - 50px);\r\n  overflow-y: auto;\r\n  border-right: 1px solid #ddd;\r\n}\r\n.main-half-right {\r\n  -webkit-box-flex: 1;\r\n      -ms-flex: 1;\r\n          flex: 1;\r\n  height: calc(100vh - 50px);\r\n  overflow-y: auto;\r\n}\r\n.cc-header {\r\n  text-align: center;\r\n  padding: 20px 10px;\r\n}\r\n.cc-header h3 {\r\n  margin: 0px;\r\n  font-weight: bold;\r\n}\r\n.cc-nav {\r\n  height: 50px;\r\n  background-color: #ddd;\r\n}\r\n.contest-item {\r\n  background-color: white;\r\n  border: 0px solid #ddd;\r\n  padding: 20px;\r\n  margin: 20px;\r\n  border-radius: 5px;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n}\r\n.contest-item:hover {\r\n  background-color: #ddd;\r\n  color: black;\r\n  cursor: pointer;\r\n}\r\n.contest-item h3 {\r\n  margin-top: 0px;\r\n}\r\n.contest-item-left {\r\n  -webkit-box-flex: 2;\r\n      -ms-flex: 2;\r\n          flex: 2;\r\n}\r\n.contest-item-right {\r\n  -webkit-box-flex: 1;\r\n      -ms-flex: 1;\r\n          flex: 1;\r\n}\r\n.contest-item-right p {\r\n  margin-bottom: 0px;\r\n  font-family: monospace;\r\n  font-size: 0.8em;\r\n}\r\n.cd-card {\r\n  background-color: white;\r\n  margin: 20px;\r\n  padding: 20px;\r\n  border: 2px solid white;\r\n  border-radius: 5px;\r\n}\r\n.cd-card h3 {\r\n  margin-top: 0px;\r\n}\r\n.cd-card-right {\r\n  float: right;\r\n}\r\n.cd-card-right button{\r\n  margin-bottom: 5px;\r\n  background-color: transparent;\r\n  color: #555;\r\n  font-weight: bold;\r\n  border: 2px solid #ccc;\r\n}\r\n\r\n.pro-card {\r\n  background-color: white;\r\n  margin: 20px;\r\n}\r\n.with-max-width {\r\n  max-width: 400px;\r\n  margin-left: auto;\r\n  margin-right: auto;\r\n}\r\n.pro-header {\r\n  width: 100%;\r\n  text-align: center;\r\n  padding: 20px 10px;\r\n}\r\n.pro-header h3 {\r\n  margin: 0px;\r\n  font-weight: bold;\r\n}\r\n.pro-nav {\r\n  width: 100%;\r\n  height: 50px;\r\n  background-color: #ddd;\r\n}\r\n.main-no-flex {\r\n  margin-left: 200px;\r\n  height: calc(100vh - 50px);\r\n  overflow-y: auto;\r\n}\r\n.pro-card input {\r\n  box-shadow: none;\r\n  border-radius: 0;\r\n  text-align: center;\r\n}\r\n.child-text-center {\r\n  text-align: center;\r\n}\r\n.pro-card-body {\r\n  padding: 20px;\r\n  padding-top: 10px;\r\n}\r\n.pro-card-header {\r\n  padding: 8px;\r\n  padding-left: 20px;\r\n  border-bottom: 2px solid #eee;\r\n}\r\n.pro-card-header h4 {\r\n  margin: 0px;\r\n  font-weight: bold;\r\n  color: #ccc;\r\n}\r\n.username {\r\n  font-weight: bold;\r\n}"

/***/ },

/***/ 606:
/***/ function(module, exports) {

module.exports = "<div class=\"app-root\">\n  <div class=\"topbar\">\n    <div class=\"topbar-right\">\n      <span class=\"username\">{{me?.username}}</span>\n      <a class=\"btn btn-sm btn-sign-out\" href=\"{{appService?.url_root}}/logout\">Sign out</a>\n    </div>\n  </div>\n  <div class=\"sidebar\">\n    <div class=\"sidebar-header\">\n      netsosCTF\n    </div>\n    <div class=\"sidebar-body\">\n      <button class=\"btn sidebar-item\" (click)=\"selectedRoute='contest'\">Contest</button>\n      <button class=\"btn sidebar-item\" (click)=\"routeToProfile()\">Profile</button>\n    </div>\n  </div>\n  <div class=\"main-no-flex\" *ngIf=\"selectedRoute == 'profile' && selectedUser\">\n    <div class=\"pro-header\">\n      <h3>P R O F I L E</h3>\n    </div>\n    <div class=\"pro-nav\"></div>\n\n    <div>\n      <div class=\"col-lg-6\">\n        <div class=\"pro-card with-max-width\">\n          <div class=\"pro-card-header\">\n            <h4>Information</h4>\n          </div>\n          <div class=\"pro-card-body child-text-center\">\n            <div class=\"form-group\">\n              <label>Username</label>\n              <input class=\"form-control\" value={{me?.username}} disabled>\n            </div>\n            <div class=\"form-group\">\n              <label>SSO UI</label>\n              <input class=\"form-control\" value={{me?.username_ui}} disabled>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-lg-6\">\n        <div class=\"pro-card\">\n          <div class=\"pro-card-header\">\n            <h4>Participations</h4>\n          </div>\n          <div class=\"participation-item\">\n            <div class=\"pro-card-body\">\n              <table class=\"table\">\n                <thead>\n                  <tr>\n                    <th>contest</th>\n                    <th>position</th>\n                    <th>score</th>\n                  </tr>\n                </thead>\n                <tbody>\n                  <tr *ngFor=\"let participation of me?.participations\">\n                    <td>{{participation.contest?.name}}</td>\n                    <td>{{participation.position}}</td>\n                    <td>{{participation.point}}</td>\n                  </tr>\n                </tbody>\n              </table>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"main\" *ngIf=\"selectedRoute == 'contest'\">\n    <div class=\"main-half-left\">\n      <div>\n        <div class=\"contest-container\">\n          <div class=\"cc-header\">\n            <h3>C O N T E S T</h3>\n          </div>\n          <div class=\"cc-nav\">\n            \n          </div>\n          <div class=\"contest-item\" *ngFor=\"let contest of contests\"\n            (click)=\"selectContest(contest)\">\n            <div class=\"contest-item-left\">\n              <h3>{{contest.name}}</h3>\n              <p>{{contest.description}}</p>\n            </div>\n            <div class=\"contest-item-right\">\n              <p>Active: {{contest.active}}</p>\n              <p>Participated: {{isParticipating(me, contest)}}</p>\n              <p>Total Player: {{contest.participations.length}}</p>\n              <p>Time: {{contest.startTime|date}} - {{contest.endTime|date}}</p>\n            </div>\n          </div>\n          <h4 class=\"text-center\" *ngIf=\"oldContests?.length > 0\">Old Contest</h4>\n          <div class=\"contest-item\" *ngFor=\"let contest of oldContests\"\n            (click)=\"selectContest(contest)\">\n            <div class=\"contest-item-left\">\n              <h3>{{contest.name}}</h3>\n              <p>{{contest.description}}</p>\n            </div>\n            <div class=\"contest-item-right\">\n              <p>Active: {{contest.active}}</p>\n              <p>Participated: {{isParticipating(me, contest)}}</p>\n              <p>Total Player: {{contest.participations.length}}</p>\n              <p>Time: {{contest.startTime|date}} - {{contest.endTime|date}}</p>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"main-half-right\">\n      <div>\n        <div class=\"contest-detail-container\" *ngIf=\"selectedContest\">\n          <div class=\"cd-card\">\n            <h3>{{selectedContest.name}}\n            <div class=\"cd-card-right\">\n              <button class=\"btn\" \n                [disabled]=\"!selectedContest.active || isParticipating(me, selectedContest)\" \n                (click)=\"participate(selectedContest)\">participate</button>\n              <br>\n              <button class=\"btn\" \n                [disabled]=\"!selectedContest.active || !isParticipating(me, selectedContest)\"\n                (click)=\"login(selectedContest)\">login</button>\n              <br>\n              <button class=\"btn\" [disabled]=\"!selectedContest.active\"\n                (click)=\"go(selectedContest)\">pwn!</button>\n            </div>\n            </h3>\n            <p>{{selectedContest.description}}</p>\n            <div class=\"contest-item-right\">\n              <p>Active: {{selectedContest.active}}</p>\n              <p>Participated: {{isParticipating(me, selectedContest)}}</p>\n              <p>Total Player: {{selectedContest.participations.length}}</p>\n              <p>Time: {{selectedContest.startTime|date}} - {{selectedContest.endTime|date}}</p>\n            </div>\n            <h4>Leaderboard</h4>\n            <div class=\"cd-leaderboard\">\n              <table class=\"table\">\n                <thead>\n                  <tr>\n                    <th>#</th>\n                    <th>username</th>\n                    <th>point</th>\n                  </tr>\n                </thead>\n                <tbody *ngIf=\"selectedContest?.scoreboardData\">\n                  <tr *ngFor=\"let data of selectedContest?.scoreboardData\">\n                    <td>{{data.position}}</td>\n                    <td><a (click)='routeToProfile(data.user_id)'>{{data.username}}</a></td>\n                    <td>{{data.score}}</td>\n                  </tr>\n                </tbody>\n              </table>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>"

/***/ },

/***/ 621:
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(341);


/***/ }

},[621]);
//# sourceMappingURL=main.bundle.map