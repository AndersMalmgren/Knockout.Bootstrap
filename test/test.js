OtherViewModel = function () {
};

TestViewModel = function () {
};

TestModel = function () {
};

DataSource = function(templates) {
    this.templates = templates;
};

DataSource.prototype = {
    loadTemplates: function(root, callback) {
        callback(this.templates[root]);
    }
};

var engine = null;
ko.setTemplateEngine = function (e) {
    engine = e;
};

ko.test = function(templates, assert) {
    var datasource = new DataSource(templates);
    var bootstrap = ko.bootstrap.init(datasource, function() {
    });

    assert(bootstrap);
};

test("When using a shared template after a none shared has been loaded", function () {
    var expected = "TestView Content";
    ko.test({
        shared: { TestView: expected },
        Other: { OtherView: "OtherView" }
    }, 
    function (bootstrap) {

        bootstrap.loadView(new OtherViewModel(), function (value) {
        });

        var template = engine.makeTemplateSource("TestView").text();
        equal(template, expected, "It should find and use shared template correctly");
    });
});

modelNameTest = function (model) {
    var expected = "TestView Content";
    ko.test({
        Test: { TestView: expected }
    },
    function (bootstrap) {

        bootstrap.loadView(new model(), function (value) {
        });

        var template = engine.makeTemplateSource("TestView").text();
        equal(template, expected, "It should find view");
    });
};

test("When using a model with a name ending with ViewModel", function () {
    modelNameTest(TestViewModel);
});

test("When using a model with a name ending with Model", function () {
    modelNameTest(TestModel);
});

test("When a view is missing", function () {
    ko.test({ shared: {}, Test: {} },
    function (bootstrap) {

        bootstrap.loadView(new TestViewModel(), function (value) {
        });

        var error = null;
        try {
            var template = engine.makeTemplateSource("TestView").text();
        } catch(e) {
            error = e;
        }

        ok(error != null, "It should give a meaningfull exception");
    });
});