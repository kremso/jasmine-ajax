getJasmineRequireObj().MockAjax = function($ajax) {
  function MockAjax(global) {
    var requestTracker = new $ajax.RequestTracker(),
      stubTracker = new $ajax.StubTracker(),
      paramParser = new $ajax.ParamParser(),
      realAjaxFunction = global.XMLHttpRequest,
      realXdr = global.XDomainRequest,
      mockAjaxFunction = $ajax.fakeRequest(global, requestTracker, stubTracker, paramParser);

    this.install = function() {
      global.XMLHttpRequest = mockAjaxFunction;
      global.XDomainRequest = mockAjaxFunction;
    };

    this.uninstall = function() {
      global.XMLHttpRequest = realAjaxFunction;
      global.XDomainRequest = realXdr;

      this.stubs.reset();
      this.requests.reset();
      paramParser.reset();
    };

    this.stubRequest = function(url, data, method) {
      var stub = new $ajax.RequestStub(url, data, method);
      stubTracker.addStub(stub);
      return stub;
    };

    this.withMock = function(closure) {
      this.install();
      try {
        closure();
      } finally {
        this.uninstall();
      }
    };

    this.addCustomParamParser = function(parser) {
      paramParser.add(parser);
    };

    this.requests = requestTracker;
    this.stubs = stubTracker;
  }

  return MockAjax;
};
