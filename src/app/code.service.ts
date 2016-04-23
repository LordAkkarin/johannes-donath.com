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
import {Injectable} from "angular2/core";
declare const $:any;

/**
 * Provides a representation of the code writer.
 */
export class CodeWriter {
        private code:string;
        private selector:string;
        private index = 0;
        private timerId = null;
        private currentLine = null;

        constructor(code:string, selector:string) {
                this.code = code;
                this.selector = selector;
        }

        /**
         * Starts writing data into the selected element.
         */
        write():void {
                this.timerId = window.setInterval($.proxy(this.onWrite, this), 10);
        }

        /**
         * Handles a write event.
         */
        onWrite():void {
                const newLine:boolean = (this.currentLine == null);
                const line = (this.currentLine == null ? $('<span />').addClass('line') : this.currentLine);
                const currentChar:string = this.code.charAt(this.index);

                // append text to line
                line.append((currentChar == '\n' || currentChar == '\r' ? ' ' : currentChar));
                this.index++;

                // append line to pre element
                if (newLine) {
                        $(this.selector).append(line);
                        this.currentLine = line;
                }

                // reset index if overflow occurs
                if (this.index >= this.code.length) {
                        this.index = 0;
                }

                // create a new line if newline is encountered, ignore windows newlines
                if (currentChar == '\n') {
                        line.append('<br />');
                        this.currentLine = null;
                }

                if (line.offset().top > ($(document).outerHeight() - 40)) {
                        $($(this.selector).find('span.line')[0]).remove();
                }
        }

        /**
         * Cancels writing.
         */
        cancel():void {
                window.clearInterval(this.timerId);
        }
}

/**
 * Provides a public service which is in charge of receiving and printing code.
 */
@Injectable()
export class CodeService {

        /**
         * Retrieves a code sample from the server's data directory.
         * @returns {Promise<string>|PromiseConstructor<string>}
         */
        getCode():Promise<string> {
                return new Promise<string>((resolve, reject) => {
                        $.get('data/CodeSample.java', function (code) {
                                resolve(code);
                        });
                });
        }


        printCode(selector:string):Promise<CodeWriter> {
                return new Promise<CodeWriter>((resolve, reject) => {
                        this.getCode().then(function (code) {
                                const writer = new CodeWriter(code, selector);
                                writer.write();
                                resolve(writer);
                        });
                });
        }
}
