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
import {Component} from "angular2/core";
import {PageComponent} from "./page.component";
import {ComponentInstruction, ROUTER_DIRECTIVES} from 'angular2/router';
declare const $:any;

const TAB_NAMES = [
        'observer',
        'gofast',
        'johannesdonath'
];

@Component({
        templateUrl: 'partial/references.html',
        directives: [ROUTER_DIRECTIVES]
})
export class ReferencesComponent extends PageComponent{
        private index : number = 0;

        /**
         * {@inheritDoc}
         */
        routerOnActivate(nextInstruction:ComponentInstruction, prevInstruction:ComponentInstruction):any|Promise<any> {
                return super.routerOnActivate(nextInstruction, prevInstruction).then(function() {
                        $.tab('change tab', TAB_NAMES[0]);
                });
        }

        /**
         * {@inheritDoc}
         */
        routerOnDeactivate(nextInstruction:ComponentInstruction, prevInstruction:ComponentInstruction):any|Promise<any> {
                return new Promise((resolve, reject) => {
                        super.routerOnDeactivate(nextInstruction, prevInstruction).then(function() {
                                $.tab('destroy');
                                resolve();
                        });
                });
        }

        /**
         * Checks whether the current tab is the first page within the list.
         * @returns {boolean}
         */
        firstPage() : boolean {
                return this.index == 0;
        }

        /**
         * Checks whether the current tab is the last page within the list.
         * @returns {boolean}
         */
        lastPage() : boolean {
                return this.index == (TAB_NAMES.length - 1);
        }

        /**
         * Switches to the previous page (if not already on the first page).
         * @returns {boolean}
         */
        previousPage() : boolean {
                if (this.index == 0) {
                        return;
                }

                $.tab('change tab', TAB_NAMES[--this.index]);
                return false;
        }

        /**
         * Switches to the next page (if not already on the last page).
         * @returns {boolean}
         */
        nextPage() : boolean {
                if (this.index == (TAB_NAMES.length - 1)) {
                        return;
                }

                $.tab('change tab', TAB_NAMES[++this.index]);
                return false;
        }
}
