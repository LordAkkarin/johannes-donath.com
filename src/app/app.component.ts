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
import {Component, OnInit} from "angular2/core";
import {IndexComponent} from "./index.component";
import { ReferencesComponent } from './references.component';
import { OpenSourceComponent } from './opensource.component';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {CodeService} from "./code.service";
declare const $:any;

@Component({
        selector: 'portfolio',
        templateUrl: 'partial/layout.html',
        providers:   [CodeService],
        directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
        {
                path: '/',
                name: 'Index',
                component: IndexComponent,
                useAsDefault: true
        },
        {
                path: '/references',
                name: 'References',
                component: ReferencesComponent
        },
        {
                path: '/open-source',
                name: 'OpenSource',
                component: OpenSourceComponent
        }
])
export class AppComponent implements OnInit {
        private codeService : CodeService;

        constructor(private _codeService : CodeService) {
                this.codeService = _codeService;
        }

        /**
         * {@inheritDoc}
         */
        ngOnInit():any {
                $('#page-loader').dimmer('hide');
                this.codeService.printCode('#code-container > pre > .content');
        }
}
