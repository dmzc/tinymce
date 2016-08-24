define(
  'ephox.katamari.test.AsyncProps',

  [
    'ephox.katamari.api.Arr',
    'ephox.wrap.Jsc',
    'global!Promise'
  ],

  function (Arr, Jsc, Promise) {
    var checkProp = function (label, arbitraries, f) {
      return Jsc.check(
        Jsc.forall.apply(Jsc, arbitraries.concat([ f ])),
        {

        }
      ).then(function (result) {
        if (result === true) { return Promise.resolve(result); }
        else return Promise.reject(result);
      });
    };

    var checkProps = function (props) {
      return Arr.foldl(props, function (b, prop) {
        return b.then(function () {
          return checkProp(prop.label, prop.arbs, prop.f);
        });
      }, Promise.resolve(true));
    };

    var futureToPromise = function (future) {
      var lazy = future.toLazy();
      return new Promise(function (resolve, reject) {
        lazy.get(function (data) {
          resolve(data);
        });
      });
    };

    var checkFuture = function (future, predicate) {
      return futureToPromise(future).then(function (answer) {
        return new Promise(function (resolve, reject) {
          return predicate(answer).fold(
            function (err) { reject(err); },
            function (v) { resolve(true); }
          );
        });
      });
    };

    return {
      checkProp: checkProp,
      checkProps: checkProps,
      futureToPromise: futureToPromise,
      checkFuture: checkFuture
    };
  }
);