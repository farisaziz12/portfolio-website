export const initSessionTracker = () => {
  (function (A, s, a, y, e, r) {
    r = window.asayer = [s, r, e, [y - 1]];
    s = document.createElement("script");
    s.src = a;
    s.async = !A;
    document.getElementsByTagName("head")[0].appendChild(s);
    r.start = function (v) {
      r.push([0]);
    };
    r.stop = function (v) {
      r.push([1]);
    };
    r.userID = function (id) {
      r.push([2, id]);
    };
    r.userAnonymousID = function (id) {
      r.push([3, id]);
    };
    r.metadata = function (k, v) {
      r.push([4, k, v]);
    };
    r.event = function (k, p) {
      r.push([5, k, p]);
    };
    r.active = function () {
      return false;
    };
    r.sessionID = function () {};
  })(0, 8628303428743813, "//static.asayer.io/tracker.js", 1, 28);
};
