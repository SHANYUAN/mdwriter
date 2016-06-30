'use strict';

describe('Service: HTMLService', function () {
    var service;
    var httpBackend;
    var definitionService;

    // load the service's module
    beforeEach(module('meanMarkdownApp'));

    // instantiate service
    beforeEach(inject(function (_HTMLService_, _$httpBackend_, _definitionService_) {
        service = _HTMLService_;
        httpBackend = _$httpBackend_;
        definitionService = _definitionService_;
    }));

    it('should be defined', function () {
        expect(service).toBeDefined();
    });

    describe('OLAT functions', function() {

        describe('replaceStoryTags()', function() {

            it('should return same html given simple paragraph', function() {
                var html = "<p>test</p>";
                var page = $("<div>" + html + "</div>");
                var expected = "<p>test</p>";

                service.replaceStoryTags(page);

                expect($(page).html()).toBe(expected);
            });

            it('should replace tags with breaks before and after', function() {
                var html =  "<p>story{</p>\n" +
                            "<p>test</p>\n" +
                            "<p>}story</p>";

                var page = $("<div>" + html + "</div>");

                var expected =    "<div class=\"story\" id=\"story1\">\n" +
                                "<p>test</p>\n" +
                                "</div>";
                service.replaceStoryTags(page);

                expect($(page).html()).toBe(expected);
            });

            it('should replace multiple tags', function() {
                var html =  "<p>story{</p>\n" +
                            "<p>first paragraph</p>\n" +
                            "<p>}story</p>\n" +
                            "<p>story{</p>\n" +
                            "<p>second paragraph</p>\n" +
                            "<p>}story</p>";
                var page = $("<div>" + html + "</div>");

                var expected =    "<div class=\"story\" id=\"story1\">\n" +
                                "<p>first paragraph</p>\n" +
                                "</div>\n" +
                                "<div class=\"story\" id=\"story2\">\n" +
                                "<p>second paragraph</p>\n" +
                                "</div>";

                service.replaceStoryTags(page);

                expect($(page).html()).toBe(expected);
            });
        });

        describe('createDefinitionsTable()', function() {

            it('should do nothing when no definition was used', function() {

                var page = $('<div><p>Some text without any definitions</p></div>');

                service.createDefinitionsTable(page);

                // should not exist
                expect($("#definitions-table", page).length).toBe(0);

            });

            it('should append definitions table', function() {

                var page = $('<div><p><a href="#definitions-table" class="definition" title="die Definition">einWort</a></p></div>');

                service.createDefinitionsTable(page);

                // should have appended definitions-table
                expect($("#definitions-table", page).length).toBe(1);

                // should have added new list element
                expect($("#definitions-table ul li", page).length).toBe(1);

                // should have definition name
                expect($("#definitions-table ul li", page).text()).toBe("einWort");

            });

            it("should only append a definition once", function() {
                var page = $('<div><p><a href="#definitions-table" class="definition" title="die Definition">einWort</a><a href="#definitions-table" class="definition" title="die Definition">einWort</a></p></div>');

                service.createDefinitionsTable(page);

                // should have appended definitions-table
                expect($("#definitions-table", page).length).toBe(1);

                // should have added new list element
                expect($("#definitions-table ul li", page).length).toBe(1);

                // should have definition name
                expect($("#definitions-table ul li", page).text()).toBe("einWort");
            });

            it("should append all unique definitions", function() {
                var page = $('<div><p><a href="#definitions-table" class="definition" title="die Definition">einWort</a><a href="#definitions-table" class="definition" title="die Definition des zweiten Wortes">einZweitesWort</a></p></div>');

                service.createDefinitionsTable(page);

                // should have appended definitions-table
                expect($("#definitions-table", page).length).toBe(1);

                // should have added new list element
                expect($("#definitions-table ul li", page).length).toBe(2);

                // should have definition name
                expect($("#definitions-table ul li", page).first().text()).toBe("einWort");
                expect($("#definitions-table ul li", page).last().text()).toBe("einZweitesWort");
            });



            /*it('should return only contain definitions used in text', inject(function(definitionService) {
                var usedDefs = ["571725cd5c6b2bd90ed10b6f"];
                var expected = "<div id=\"definitions-table\" class=\"definitions-table\">\n" +
                                "<h4>Glossar</h4>\n" +
                                "<ul>\n" +
                                // only duckduck
                                "<li>\n" +
                                "<a href=\"#\" target=\"_blank\" class=\"definition\" title=\"This is the duck description!\">duckduck</a>\n" +
                                "</li>\n" +

                                "</ul>\n" +
                                "</div>\n";

        describe('replaceStoryTags()', function() {
                expect(definitions.length).toEqual(2);

                    expect(outputHtml).toEqual(expected);
                });
            }));*/

            /*it('should return empty string when no definition used in text', inject(function(definitionService) {
                //var usedDefs = [];
                var expected = "<div id=\"definitions-table\" class=\"definitions-table\">\n" +
                                "<h4>Glossar</h4>\n" +
                                "<ul>\n" +
                                // only duckduck
                                "<li>\n" +
                                "<a href=\"#\" target=\"_blank\" class=\"definition\" title=\"This is the duck description!\">duckduck</a>\n" +
                                "</li>\n" +

                                "</ul>\n" +
                                "</div>\n";


                definitionService.query(function(definitions) {
                    expect(definitions.length).toEqual(2);
                    var outputHtml = service.createDefinitionsTable(definitions);
                    console.log(outerHTML);
                    expect(outputHtml).toEqual(2);
                });
            }));*/
        });

        describe('wrapOlatHtml()', function() {
            it('should wrap content', function() {
                var inputHtml = "<p>This is a paragraph</p>";
                var title = "Test";
                var expected = '<!DOCTYPE html>\n' +
                                '<html lang="de">\n' +
                                '<head>\n' +
                                '<title>Test</title>\n' +
                                '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
                                '<meta property="dc:creator" content="Kai Christian Bruhn, Matthias Dufner, Thomas Engel, Axel Kunz" />\n' +
                                '<link rel="stylesheet" href="style/olat.css">\n' +
                                '</head>\n' +
                                '<body>\n' +
                                inputHtml + "\n" +
                                '<script src="https://code.jquery.com/jquery-2.2.3.min.js"></script>\n' +
                                '<script src="javascript/app.js"></script>\n' +
                                '</body>\n' +
                                '</html>';

                var outputHtml = service.wrapOlatHTML(inputHtml, title);

                expect(outputHtml).toEqual(expected);
            });

            it('should wrap content with styles in subfolder', function() {
                var inputHtml = "<p>This is a paragraph</p>";
                var title = "Test";
                var isFolder = true;
                var expected = '<!DOCTYPE html>\n' +
                                '<html lang="de">\n' +
                                '<head>\n' +
                                '<title>Test</title>\n' +
                                '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
                                '<meta property="dc:creator" content="Kai Christian Bruhn, Matthias Dufner, Thomas Engel, Axel Kunz" />\n' +
                                '<link rel="stylesheet" href="../style/olat.css">\n' +
                                '</head>\n' +
                                '<body>\n' +
                                inputHtml + "\n" +
                                '<script src="https://code.jquery.com/jquery-2.2.3.min.js"></script>\n' +
                                '<script src="javascript/app.js"></script>\n' +
                                '</body>\n' +
                                '</html>';

                var outputHtml = service.wrapOlatHTML(inputHtml, title, isFolder);

                expect(outputHtml).toEqual(expected);
            });

        });
    }); // end OLAT

    describe('MainzedPresentation functions', function() {

        describe('getPrMainzed()', function() {
            var file;
            beforeEach(function() {
                file = {
                    title: "Test File",
                    author: "John Doe",
                    type: "opOlat",
                    markdown:   "# heading 1\n" +
                                "This is markdown!"
                };
            });

            it("should return html", function() {
                var expected =  "<div class=\"slide\" id=\"slide1\">\n" +
                                '<h1 id="h1-1">heading 1</h1>\n' +
                                "<p>This is markdown!</p>\n" +
                                "</div>";

                expect(service.getPrMainzed(file)).toEqual(expected);

            });
        });

    });

    describe('replaceEnrichmentTags() for opMainzed', function() {
        var enrichments = [
            {
                _id: "571725cd5c6b2bd90ed10b6e",
                word: "someDefinedWord",
                //url: "www.google.de",
                text: "This is the definition description!",
                //updated_at: "2016-04-20T06:46:37.887Z",
                filetype: "opMainzed",
                category: "definition"
                //author: "John Doe"
            },{
                _id: "571725cd5c6b2bd90ed10b6e",
                 word: "pic1",
                url: "www.some-picture.com",
                text: "This is the caption.",
                title: "This is the alt",
                updated_at: "2016-04-20T06:46:37.887Z",
                filetype: "opMainzed",
                category: "picture"
                //author: "John Doe"
            }
        ];

        it('should replace definition tag', function() {
            // make jQuery compatible
            var page = $('<div><div id="read"><p>String with a {definition: someDefinedWord}!</p></div><div id="footnotes"></div></div>');

            //var inputHtml = "<p>String with a {definition: someDefinedWord}!</p>";  // string is not a defined definition

            var expected = "<div id=\"read\"><p>String with a <span id=\"" + enrichments[0]._id + "\" class=\"shortcut\">" + enrichments[0].word + "</span>!</p>" +
            "</div><div id=\"footnotes\"><div class=\"" + enrichments[0]._id + "\">" +
            "<h4>" + enrichments[0].word + "</h4><p>" + enrichments[0].text + "</p>\n</div></div>";

            //page = $("<div>" + inputHtml + "</div>");

            service.replaceEnrichmentTags(page, enrichments);
            expect($(page).html()).toBe(expected);
        });

        it('should replace definition tag that contains a link', function() {
            var enrichments = [
                {
                    _id: "571725cd5c6b2bd90ed10b6e",
                     word: "someDefinedWordWithALink",
                    text: "This is the definition description! and it contains a [link](http://www.google.de)",
                    updated_at: "2016-04-20T06:46:37.887Z",
                    filetype: "opMainzed",
                    category: "definition"
                    //author: "John Doe"
                }
            ];

            // make jQuery compatible
            var page = $('<div><div id="read"><p>String with a {definition: someDefinedWordWithALink}!</p></div><div id="footnotes"></div></div>');

            var expected = "<div id=\"read\"><p>String with a <span id=\"" + enrichments[0]._id + "\" class=\"shortcut\">" + enrichments[0].word + "</span>!</p>" +
            "</div><div id=\"footnotes\"><div class=\"" + enrichments[0]._id + "\">" +
            "<h4>" + enrichments[0].word + "</h4><p>This is the definition description! and it contains a <a href=\"http://www.google.de\" class=\"external-link\" target=\"_blank\">link</a></p>\n</div></div>";

            service.replaceEnrichmentTags(page, enrichments);
            expect($(page).html()).toBe(expected);
        });

        it("should give internal links a class", function() {
            var enrichments = [
                {
                    _id: "571725cd5c6b2bd90ed10b6e",
                     word: "someDefinedWordWithALink",
                    //url: "www.google.de",
                    text: "This is the definition description! and it contains a [internal-link](#some-anchor)",
                    updated_at: "2016-04-20T06:46:37.887Z",
                    filetype: "opMainzed",
                    category: "definition"
                    //author: "John Doe"
                }
            ];

            // make jQuery compatible
            var page = $('<div><div id="read"><p>String with a {definition: someDefinedWordWithALink}!</p></div><div id="footnotes"></div></div>');

            var expected = "<div id=\"read\"><p>String with a <span id=\"" + enrichments[0]._id + "\" class=\"shortcut\">" + enrichments[0].word + "</span>!</p>" +
            "</div><div id=\"footnotes\"><div class=\"" + enrichments[0]._id + "\">" +
            "<h4>" + enrichments[0].word + "</h4><p>This is the definition description! and it contains a <a href=\"#some-anchor\" class=\"internal-link\">internal-link</a></p>\n</div></div>";

            service.replaceEnrichmentTags(page, enrichments);
            expect($(page).html()).toBe(expected);
        });

        it("should replace definition with custom word", function() {
            var page = $('<div><div id="read"><p>String with a {definition: someDefinedWord "my custom word"}!</p></div><div id="footnotes"></div></div>');

            service.replaceEnrichmentTags(page, enrichments);

            var actual = $(page).html();
            var expected = "<div id=\"read\"><p>String with a <span id=\"" + enrichments[0]._id + "\" class=\"shortcut\">" + "my custom word" + "</span>!</p>" +
            "</div><div id=\"footnotes\"><div class=\"" + enrichments[0]._id + "\">" +
            "<h4>" + enrichments[0].word + "</h4><p>" + enrichments[0].text + "</p>\n</div></div>";

            expect(actual).toBe(expected);
        });

        it('should replace multiple definition tags', function() {
            var enrichments = [
                {
                    _id: "571725cd5c6b2bd90ed10b6e",
                    word: "someDefinedWord",
                    text: "Some description!",
                    filetype: "opMainzed",
                    category: "definition"
                    //author: "John Doe"
                },{
                    _id: "571725cd5c6b2bd90easdasd",
                    word: "someDefinedWordWithALink",
                    text: "This is the definition description! and it contains a [link](http://www.google.de)",
                    filetype: "opMainzed",
                    category: "definition"
                    //author: "John Doe"
                }
            ];

            // make jQuery compatible
            var page = $('<div><div id="read"><p>String with a {definition: someDefinedWord}!</p><p>{definition: someDefinedWordWithALink}</p></div><div id="footnotes"></div></div>');

            var expected = ['<div id="read"><p>String with a <span id="',
                            enrichments[0]._id,
                            '" class="shortcut">',
                            enrichments[0].word,
                            "</span>!</p>",
                            "<p>",
                            '<span id="571725cd5c6b2bd90easdasd" class="shortcut">',
                            'someDefinedWordWithALink',
                            '</span>',
                            "</p>",
                            "</div>",

                            '<div id="footnotes">',
                                // definition 1
                                '<div class="571725cd5c6b2bd90ed10b6e">',
                                '<h4>someDefinedWord</h4>',
                                '<p>Some description!</p>\n',
                                '</div>',

                                // definition 2
                                '<div class="571725cd5c6b2bd90easdasd">',
                                '<h4>someDefinedWordWithALink</h4>',
                                '<p>This is the definition description! and it contains a <a href="http://www.google.de" class="external-link" target="_blank">link</a></p>\n',
                                '</div>',
                            "</div>"
                        ].join("");

            service.replaceEnrichmentTags(page, enrichments);
            expect($(page).html()).toBe(expected);

            // should have appended two new spans
            expect($("#read span", page).length).toBe(2);

            // should have appended two new divs to footnotes
            expect($("#footnotes div", page).length).toBe(2);

            // check div content
            expect($("#footnotes div h4", page).last().html()).toBe("someDefinedWordWithALink");

        });

        it("should replace definition with custom word using legacy definition syntax");

        it('should replace picture tag', function() {
            var enrichments = [
                {
                    _id: "571725cd5c6b2bd90ed10b6e",
                     word: "pic1",
                    url: "www.some-picture.com",
                    text: "This is the caption.",
                    title: "This is the alt",
                    filetype: "opMainzed",
                    category: "picture"
                    //author: "John Doe"
                }
            ];

            // make jQuery compatible
            var page = $('<div><div id="read">{picture: pic1}</div></div>');

            var expected = '<div id="read"><figure id="571725cd5c6b2bd90ed10b6e">\n<img src="www.some-picture.com" class="picture" alt="' + enrichments[0].title + '">\n<figcaption>\n' + enrichments[0].text + '</figcaption>\n</figure></div>';

            service.replaceEnrichmentTags(page, enrichments);

            expect(enrichments.length).toBe(1);
            expect($(page).html()).toBe(expected);

        });

        it('should replace picturegroup tag', function() {
            var enrichments = [
                {
                    _id: "571725cd5c6b2bd90ed10b6e",
                     word: "pic1",
                    __v: 0,
                    url: "www.some-picture.com",
                    text: "This is the caption.",
                    title: "This is the alt",
                    updated_at: "2016-04-20T06:46:37.887Z",
                    filetype: "opMainzed",
                    category: "picture",
                    author: "John Doe"
                },{
                    _id: "571725cd5c6b2bd90ed10b6e",
                     word: "pic2",
                    __v: 0,
                    url: "www.some-other-picture.com",
                    text: "This is the caption.",
                    title: "This is the alt",
                    updated_at: "2016-04-20T06:46:37.887Z",
                    filetype: "opMainzed",
                    category: "picture",
                    author: "John Doe"
                }
            ];

            // make jQuery compatible
            var page = $('<div><div id="read">{picturegroup: pic1, pic2}</div></div>');

            var expected = '<div id="read"><div class="picturegroup">' +

            // figure 1
            '<figure>\n<img src="' + enrichments[0].url + '" class="picture" alt="' + enrichments[0].title + '">\n<figcaption>\n' + enrichments[0].text + '</figcaption>\n</figure>' +

            // figure 2
            '<figure>\n<img src="' + enrichments[1].url + '" class="picture" alt="' + enrichments[1].title + '">\n<figcaption>\n' + enrichments[1].text +

            '</figcaption>\n</figure>' +
            '</div></div>';

            service.replaceEnrichmentTags(page, enrichments);

            expect($(page).html()).toBe(expected);

        });

        it('should replace citation tag', function() {
            var enrichments = [
                {
                    _id: "571725cd5c6b2bd90ed10b61",
                     word: "citation1",
                    __v: 0,
                    text: "This is the citation.",
                    author: "John Doe",
                    updated_at: "2016-04-20T06:46:37.887Z",
                    filetype: "opMainzed",
                    category: "citation"
                }
            ];

            // make jQuery compatible
            var page = $('<div><div id="read">{citation: citation1}</div></div>');

            var expected = '<div id="read"><div class="citation hyphenate">' +
                            '<p>' + enrichments[0].text + '</p>\n' +
                            '<span class="author">' + enrichments[0].author + '</span>' +
                            '</div></div>';


            service.replaceEnrichmentTags(page, enrichments);

            expect($(page).html()).toBe(expected);

        });

        it("should reset used definitions for each new function call");

        it("should not throw error if definition does not exist", function() {

            // make jQuery compatible
            var page = $('<div><div id="read">{definition: def1}</div></div>');
            var handler = function() {
                service.replaceEnrichmentTags(page, []);
            };
            expect(handler).not.toThrow(new Error("unknown enrichment with shortcut: def1"));
        })

        it("should not throw error if legacy definition does not exist", function() {

            // make jQuery compatible
            var page = $('<div><div id="read">{def1}</div></div>');
            var handler = function() {
                service.replaceEnrichmentTags(page, []);
            };
            expect(handler).not.toThrow(new Error("unknown enrichment with shortcut: def1"));
        })

        it("should not throw error if picture enrichment does not exist", function() {

            // make jQuery compatible
            var page = $('<div><div id="read">{picture: pic1}</div></div>');
            var handler = function() {
                service.replaceEnrichmentTags(page, []);
            };
            expect(handler).not.toThrow(new Error("unknown enrichment with shortcut: def1"));
        });

        it("should not throw error if citation enrichment does not exist", function() {

            // make jQuery compatible
            var page = $('<div><div id="read">{citation: cit1}</div></div>');
            var handler = function() {
                service.replaceEnrichmentTags(page, []);
            };
            expect(handler).not.toThrow(new Error("unknown enrichment with shortcut: cit1"));
        });

    });

    describe("replaceEnrichmentTags() for opOlat", function() {
        it('should replace definition tag', function() {
            var enrichments = [
                {
                    _id: "571725cd5c6b2bd90ed10b6e",
                     word: "someDefinedWord",
                    //url: "www.google.de",
                    text: "This is the definition description!",
                    filetype: "opOlat",
                    category: "definition",
                    //author: "John Doe"
                }
            ];

            // make jQuery compatible
            var page = $('<div><p>String with a {definition: someDefinedWord}!</p></div>');

            var expected = '<p>String with a <a href="#definitions-table" title="' + enrichments[0].text + '" class="definition">' + enrichments[0].word + '</a>!</p>';

            service.replaceEnrichmentTags(page, enrichments);

            expect(enrichments.length).toBe(1);
            expect($(page).html()).toBe(expected);

        });

        it("should replace definition with custom word", function() {
            var enrichments = [{
                _id: "571725cd5c6b2bd90ed10b6e",
                 word: "someDefinedWord",
                //url: "www.google.de",
                text: "This is the definition description!",
                filetype: "opOlat",
                category: "definition"
                //author: "John Doe"
            }];

            var page = $('<div><p>String with a {definition: someDefinedWord "my custom word"}!</p></div>');

            service.replaceEnrichmentTags(page, enrichments);

            var actual = $(page).html();
            var expected = ['<p>String with a <a href="#definitions-table" title="',
                            enrichments[0].text,
                            '" class="definition">',
                            "my custom word",
                            '</a>!</p>'].join("");

            expect(actual).toBe(expected);
        });

        it('should replace legacy syntax definition tag', function() {
            var enrichments = [
                {
                    _id: "571725cd5c6b2bd90ed10b6e",
                     word: "legacyDefinition",
                    __v: 0,
                    url: "www.google.de",
                    text: "This is the legacy definition description!",
                    updated_at: "2016-04-20T06:46:37.887Z",
                    filetype: "opOlat",
                    category: "definition",
                    author: "John Doe"
                }
            ];

            // make jQuery compatible
            var page = $('<div><p>String with a {legacyDefinition}!</p></div>');

            var expected = '<p>String with a <a href="#definitions-table" title="' + enrichments[0].text + '" class="definition">' + enrichments[0].word + '</a>!</p>';

            service.replaceEnrichmentTags(page, enrichments);

            expect(enrichments.length).toBe(1);
            expect($(page).html()).toBe(expected);

        });

        it('should replace story tag', function() {
            var enrichments = [{
                _id: "571725cd5c6b2bd90ed10b6e",
                 word: "story1",
                __v: 0,
                url: "www.google.de",
                text: "This is the story content!",
                updated_at: "2016-04-20T06:46:37.887Z",
                filetype: "opOlat",
                category: "story",
                author: "John Doe"
            }];

            var page = $('<div><p>Some text before</p>\n{story: story1}\n<p>Some text after</p></div>');

            service.replaceEnrichmentTags(page, enrichments);

            var actual = $(page).html();
            var expected = ['<p>Some text before</p>\n',
                            '<div class="story"><p>',
                            enrichments[0].text,
                            "</p>\n</div>\n",
                            "<p>",
                            "Some text after",
                            '</p>'].join("");

            expect(actual).toBe(expected);
        });

        it('should replace legacy syntax story tag')
    });

    describe("convertOpMainzedMarkdownToHTML()", function() {

        it("should return html", function() {
            var markdown = "# heading 1\nThis is markdown!";
            var expected = '<h1 id="section-1" class="hyphenate">heading 1</h1>\n' +
                            "<p>This is markdown!</p>\n";

            expect(service.convertOpMainzedMarkdownToHTML(markdown)).toEqual(expected);
        });

        it("should custom render headers");

        it("should custom render images");

        it("should custom render links");

    });

    describe("convertOpOlatMarkdownToHTML()", function() {

        it("should return html", function() {
            var markdown = "# heading 1\nThis is markdown!";
            var expected = '<h1 id="h1-1">heading 1</h1>\n' +
                            "<p>This is markdown!</p>\n";
            expect(service.convertOpOlatMarkdownToHTML(markdown)).toEqual(expected);
        });

        it("should custom render headers");

        it("should custom render images");

        it("should custom render links");



    });

    describe("getOlat()", function() {
        it("should return html", function() {
            var file = {
                title: "Test File",
                author: "John Doe",
                type: "opOlat",
                markdown: "# heading 1\n" +
                            "This is **markdown**!"
            };

            var result = service.getOlat(file, []);
            var expected = "<h1 id=\"h1-1\">heading 1</h1>\n<p>This is <strong>markdown</strong>!</p>\n";

            expect(result).toBe(expected);
        });

        it("should add title", function() {
            var file = {
                title: "Test File",
                author: "John Doe",
                type: "opOlat",
                markdown: "# heading 1\n" +
                            "This is **markdown**!"
            };

            var config = {
                addTitle: true,
                addContentTable: false,
                addImagesTable: false
            };

            var result = service.getOlat(file, [], config);
            var expected = "<h1 class=\"page-title\" id=\"page-title\">" + file.title + "</h1><h1 id=\"h1-1\">heading 1</h1>\n<p>This is <strong>markdown</strong>!</p>\n";

            expect(result).toBe(expected);
        });

        it("should add table of content", inject(function(definitionService) {
            var file = {
                title: "Test File",
                author: "John Doe",
                type: "opOlat",
                markdown: "# heading 1\n" +
                            "This is **markdown**!"
            };

            var config = {
                addTitle: false,
                addContentTable: true,
                addImagesTable: false
            };

            var expected =  '<div id="headings-table" class="headings-table">' +
                            '<ul>' +
                            '<li><a href="#h1-1">heading 1</a></li>' +
                            '</ul>' +
                            '</div>' +
                            '<h1 id="h1-1">heading 1</h1>\n' +
                            '<p>This is <strong>markdown</strong>!</p>\n';

            var result = service.getOlat(file, [], config);
            expect(result).toBe(expected);
        }));

        it("should add table of content (with title)");
        it("should add table of content (with stories)");

        /*it("should add table of images", function() {
            var file = {
                title: "Test File",
                author: "John Doe",
                type: "opOlat",
                markdown: "# heading 1\n" +
                            "This is **markdown**!\n![awesome-image](bilder/bild.jpg \"Caption this!; John Doe; CC BY-NA; www.source.com\")"
            };

            var config = {
                addTitle: false,
                addContentTable: false,
                addImagesTable: true
            };

            var expected =  '<h1 id="h1-1">heading 1</h1>\n' +
                            '<p>This is <strong>markdown</strong>!</p>\n' +
                            '<figure id="awesome-image"><img src="bilder/bild.jpg" alt="awesome-image"><figcaption>Abb.1<br>Caption this!<br><a href="#images-table">(Quelle)</a></figcaption></figure>' +
                            "<div id=\"images-table\" class=\"images-table\">\n" +
                                            "<h4>Abbildungen</h4>\n" +
                                            "<ul>\n" +
                                            "<li>\n" +
                                            "Abb.1<br>\n" +
                                            "Test-Image<br>\n" +
                                            "John Doe<br>\n" +
                                            "CC123<br>\n" +
                                            "<a href=\"www.google.de\" target=\"_blank\">Quelle</a>\n" +
                                            "</li>\n" +
                                            "</ul>\n" +
                                            "</div>";

            var result = service.getOlat(file, [], config);

            expect(result).toBe(expected);

        });*/

        it("should add table of images (without author and license)");

        /*it("should add table of definitions", function() {

            var enrichments = [{
                _id: "571725cd5c6b2bd90ed10b6e",
                word: "google",
                text: "This is the google definition!",
                filetype: "opOlat",
                category: "definition",
                author: "John Doe"
            }]

            var page = $("<div>" + "# heading 1\nThis is {definition: someDef})" + "</div>");

            var config = {
                addTitle: false,
                addContentTable: false,
                addDefinitionsTable: true,
                addImagesTable: false
            };

            var expected = '<h1>heading 1</h1><p>This is someDef</p>\n';

            service.getOlat(page, enrichments, config);

            expect($(page).html()).toBe(expected);
        });*/

    });

    describe("getOpMainzed()", function() {

        it("should add all required divs and uls", function() {
            var file = {
                markdown: "some markdown text"
            };
            //var expected = ""
            var actual = service.getOpMainzed(file, [], {});
            var page = $('<div>' + actual + '</div>');

            expect($("div#titlepicture", page).length).toBe(1);
            expect($("div#gradient", page).length).toBe(1);
            expect($("div#footnotes", page).length).toBe(1);
            expect($("div#read", page).length).toBe(1);
            expect($("ul#nav", page).length).toBe(1);
            expect($("div#titletextbg", page).length).toBe(1);
            expect($("div#ressourcestext", page).length).toBe(1);
            expect($("div#imagecontainer", page).length).toBe(1);
        });

        it("should append converted markdown to read element", function() {
            var file = {
                markdown: "some markdown text"
            };
            var actual = service.getOpMainzed(file, [], {});
            var page = $('<div>' + actual + '</div>');
            expect($("#read", page).html()).toBe('<p>some markdown text</p>\n');
        });


    });

});
