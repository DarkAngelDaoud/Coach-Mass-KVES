/* ====================== audio, voix, vibration ====================== */
var actx = null;
function unlockAudio() {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
  } catch (e) {}
}
function tone(f, dur, delay, type, vol) {
  if (!P.sound) return;
  try {
    unlockAudio();
    if (!actx) return;
    var t0 = actx.currentTime + (delay || 0), o = actx.createOscillator(), g = actx.createGain();
    var v = (vol || 1) * Math.pow((+P.vol || 7) / 10, 2) * 0.5;
    o.type = type || 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(v, 0.0002), t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(actx.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  } catch (e) {}
}
var SND = {
  tick: function () { tone(1200, 0.04, 0, 'square', 0.35); },
  down: function () { tone(520, 0.1, 0, 'triangle', 1); },
  up: function () { tone(780, 0.1, 0, 'triangle', 1); },
  beat: function () { tone(520, 0.1, 0, 'triangle', 1); tone(780, 0.1, 0.5, 'triangle', 1); },
  count: function () { tone(700, 0.1, 0, 'sine', 1); },
  start: function () { tone(1000, 0.25, 0, 'sine', 1); },
  warn: function () { tone(900, 0.09, 0, 'square', 0.5); tone(900, 0.09, 0.16, 'square', 0.5); },
  setend: function () { tone(880, 0.16, 0, 'sine', 1); tone(660, 0.16, 0.18, 'sine', 1); tone(440, 0.3, 0.36, 'sine', 1); },
  exend: function () { SND.setend(); tone(660, 0.14, 0.75, 'triangle', 0.9); tone(990, 0.3, 0.9, 'triangle', 0.9); },
  go: function () { tone(523, 0.12, 0, 'triangle', 1); tone(659, 0.12, 0.14, 'triangle', 1); tone(784, 0.3, 0.28, 'triangle', 1); },
  newex: function () { tone(392, 0.14, 0, 'triangle', 1); tone(523, 0.14, 0.16, 'triangle', 1); tone(659, 0.14, 0.32, 'triangle', 1); tone(784, 0.35, 0.48, 'triangle', 1); },
  chime: function () { tone(988, 0.14, 0, 'sine', 0.8); tone(1318, 0.26, 0.12, 'sine', 0.8); },
  fanfare: function () { [523, 659, 784, 1046].forEach(function (f, i) { tone(f, 0.2, i * 0.18, 'triangle', 1); }); tone(1046, 0.5, 0.8, 'triangle', 1); }
};
function play(n) { if (SND[n]) SND[n](); }
function beep(f, ms) { tone(f || 880, (ms || 120) / 1000, 0, 'sine', 1); }
function flash() {
  try { runner.classList.add('flash'); setTimeout(function () { runner.classList.remove('flash'); }, 450); } catch (e) {}
}
function say(t) {
  if (!P.voice) return;
  try {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(t); u.lang = 'fr-FR'; u.rate = 1.05;
    window.speechSynthesis.speak(u);
  } catch (e) {}
}
/* Intensité : 1 = normale (impulsions telles quelles), 2 = forte (impulsions allongées, mini 90 ms), 3 = très forte (mini 160 ms).
   Les impulsions de 30-40 ms sont trop brèves pour être senties sur beaucoup de téléphones. */
function vibScale(p) {
  var lv = P.vibLevel || 2, mini = lv >= 3 ? 160 : lv === 2 ? 90 : 0, k = lv >= 3 ? 3 : lv === 2 ? 2 : 1;
  var a = Array.isArray(p) ? p : [p];
  return a.map(function (v, i) { return i % 2 === 0 ? Math.max(mini, Math.round(v * k)) : v; });
}
function vib(p) { if (P.vib) { try { return navigator.vibrate ? navigator.vibrate(vibScale(p)) : null; } catch (e) { return false; } } return null; }
var wl = null;
function wake() { try { if (navigator.wakeLock) navigator.wakeLock.request('screen').then(function (s) { wl = s; }).catch(function () {}); } catch (e) {} }
function unwake() { try { wl && wl.release(); } catch (e) {} wl = null; }
document.addEventListener('visibilitychange', function () { if (R && document.visibilityState === 'visible') wake(); });

