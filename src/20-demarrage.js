applyRotate();
render();
requestAnimationFrame(frame);
if ('serviceWorker' in navigator) { window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); }); }
window.__coach = { D: function () { return D; }, startSession: startSession, render: render, setTab: function (t) { tab = t; render(); } };
