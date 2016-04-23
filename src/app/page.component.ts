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
import {ComponentInstruction, OnActivate, OnDeactivate} from 'angular2/router';
declare const $:any;

/**
 * Provides an abstract base component for all pages.
 */
export abstract class PageComponent implements OnActivate, OnDeactivate {

        /**
         * {@inheritDoc}
         */
        routerOnActivate(nextInstruction:ComponentInstruction, prevInstruction:ComponentInstruction):any|Promise<any> {
                return new Promise((resolve, reject) => {
                        $('portfolio').slideDown(250, function() {
                                resolve();
                        });
                });
        }

        /**
         * {@inheritDoc}
         */
        routerOnDeactivate(nextInstruction:ComponentInstruction, prevInstruction:ComponentInstruction):any|Promise<any> {
                return new Promise((resolve, reject) => {
                        $('portfolio').slideUp(250, function() {
                                resolve();
                        });
                });
        }
}
