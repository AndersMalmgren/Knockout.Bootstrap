OtherViewModel = function () {
};

TestViewModel = function () {
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

ko.test = function (templates, assert) {
    var datasource = new DataSource(templates);
    var bootstrap = ko.bootstrap.init(datasource, function () { });

    assert(bootstrap);
}

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