(function () {
  if (typeof lunr === "undefined") {
    throw new Error("Lunr must be loaded before the Chinese tokenizer.");
  }

  lunr.zh = function () {
    this.pipeline.reset();
    this.tokenizer = lunr.zh.tokenizer;
    lunr.QueryLexer.termSeparator = lunr.tokenizer.separator;
  };

  lunr.zh.tokenizer = function (value) {
    if (value == null) {
      return [];
    }

    if (Array.isArray(value)) {
      return value.map(function (token) {
        return new lunr.Token(token.toLowerCase());
      });
    }

    var runs = value.toString().toLowerCase().match(/[\u3400-\u9fff]+|[a-z0-9_]+/g) || [];
    var tokens = [];
    runs.forEach(function (run) {
      if (/^[\u3400-\u9fff]+$/.test(run)) {
        if (run.length === 1) {
          tokens.push(run);
        } else {
          for (var i = 0; i < run.length - 1; i++) {
            tokens.push(run.slice(i, i + 2));
          }
        }
      } else {
        tokens.push(run);
      }
    });

    return tokens.map(function (token) {
      return new lunr.Token(token);
    });
  };
})();
