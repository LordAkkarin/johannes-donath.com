/// <reference path="../../node_modules/angular2/typings/browser.d.ts" />
/*
 * Copyright 2016 Johannes Donath <johannesd@torchmind.com>
 * and other copyright owners as documented in the project's IP log.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {provide, enableProdMode} from "angular2/core";
import {bootstrap} from "angular2/platform/browser";
import {AppComponent} from "./app.component";
import {LocationStrategy, HashLocationStrategy, ROUTER_PROVIDERS} from 'angular2/router';

// NOTE: You may want to remove this line when developing your application as it disables some assertions within the
// framework in favor of performance!
enableProdMode();

/**
 * As per Angular2 requirements we will manually bootstrap the application. This will automatically register context
 * objects for the passed component (in this case <portfolio>).
 */
bootstrap(AppComponent, [ROUTER_PROVIDERS, provide(LocationStrategy, {useClass: HashLocationStrategy})]);
