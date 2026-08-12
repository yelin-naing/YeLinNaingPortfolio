window.addEventListener('load', function(){
/* ===== MASCOT 3D: standing lion in hoodie, cap, baggy jeans, sneakers ===== */
(function(){
  var dock = document.getElementById('mascotDock');
  var host = document.getElementById('mascotCanvas');
  if (!dock || !host || typeof THREE === 'undefined') return;
  try {
    var probe = document.createElement('canvas');
    if (!(probe.getContext('webgl') || probe.getContext('experimental-webgl'))) return;
  } catch(e){ return; }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W = host.clientWidth || 118, H = host.clientHeight || 168;

  var renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(34, W/H, 0.1, 60);
  camera.position.set(0, 1.68, 6.7);
  camera.lookAt(0, 1.46, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa4ac, 0.76));
  var key = new THREE.DirectionalLight(0xffffff, 0.90);
  key.position.set(-3.2, 5.4, 4.2);
  key.castShadow = true;
  key.shadow.mapSize.width = 512; key.shadow.mapSize.height = 512;
  key.shadow.camera.near = 0.5; key.shadow.camera.far = 18;
  key.shadow.camera.left = -3.5; key.shadow.camera.right = 3.5;
  key.shadow.camera.top = 4.2; key.shadow.camera.bottom = -1;
  key.shadow.radius = 3;
  scene.add(key);
  var rim = new THREE.DirectionalLight(0xffffff, 0.34);
  rim.position.set(3, 2.4, -3);
  scene.add(rim);

  function mat(c, r){ return new THREE.MeshStandardMaterial({color:c, roughness:r===undefined?0.76:r, metalness:0.02}); }
  var FUR     = mat(0xEDF1F3, 0.80);
  var LIGHT   = mat(0xFFFFFF, 0.74);
  var MANE    = mat(0x1B2127, 0.62);
  var MANE2   = mat(0x2A323A, 0.62);
  var DARK    = mat(0x12171C, 0.48);
  var EAR     = mat(0x39424A, 0.70);
  var HOODIE  = mat(0xD7DDE1, 0.88);
  var HOOD_DK = mat(0xB4BEC4, 0.88);
  var JEANS   = mat(0x8D979E, 0.92);
  var JEANS_D = mat(0x76818A, 0.92);
  var SOLE    = mat(0x2A323A, 0.60);
  var CAP     = mat(0x1B2127, 0.66);
  var BLUSH   = mat(0xC4CED4, 0.9);

  var lion = new THREE.Group();
  scene.add(lion);

  var SPH = new THREE.SphereGeometry(1, 22, 16);
  function add(geo, m, x, y, z, parent){
    var mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    (parent || lion).add(mesh);
    return mesh;
  }

  // ---------- sneakers ----------
  [-0.27, 0.27].forEach(function(x){
    var sole = add(SPH, SOLE, x, 0.075, 0.07);
    sole.scale.set(0.215, 0.062, 0.30);
    var upper = add(SPH, LIGHT, x, 0.155, 0.04);
    upper.scale.set(0.205, 0.105, 0.245);
    var toe = add(SPH, LIGHT, x, 0.125, 0.20);
    toe.scale.set(0.175, 0.085, 0.115);
    var tongue = add(SPH, HOOD_DK, x, 0.225, -0.02);
    tongue.scale.set(0.135, 0.075, 0.10);
  });

  // ---------- baggy jeans ----------
  [-0.27, 0.27].forEach(function(x){
    var leg = add(new THREE.CylinderGeometry(0.185, 0.235, 0.52, 16), JEANS, x, 0.48, 0);
    var cuff = add(new THREE.CylinderGeometry(0.238, 0.238, 0.10, 16), JEANS_D, x, 0.27, 0);
  });
  var waist = add(SPH, JEANS, 0, 0.82, 0);
  waist.scale.set(0.44, 0.26, 0.36);

  // ---------- hoodie ----------
  var torso = add(SPH, HOODIE, 0, 1.22, 0);
  torso.scale.set(0.52, 0.46, 0.44);
  var hem = add(new THREE.CylinderGeometry(0.475, 0.50, 0.14, 20), HOOD_DK, 0, 0.92, 0);
  var pocket = add(SPH, HOOD_DK, 0, 1.06, 0.30);
  pocket.scale.set(0.28, 0.14, 0.18);
  // drawstrings
  [-0.105, 0.105].forEach(function(x){
    add(new THREE.CylinderGeometry(0.019, 0.019, 0.28, 8), LIGHT, x, 1.30, 0.44);
  });
  // hood, resting down behind the neck
  var hood = add(SPH, HOODIE, 0, 1.50, -0.26);
  hood.scale.set(0.42, 0.30, 0.28);
  var hoodLip = add(SPH, HOOD_DK, 0, 1.58, -0.14);
  hoodLip.scale.set(0.40, 0.13, 0.20);

  // ---------- arms in hoodie sleeves ----------
  function makeArm(side){
    var g = new THREE.Group();
    g.position.set(side * 0.49, 1.44, 0);
    lion.add(g);
    add(new THREE.CylinderGeometry(0.135, 0.125, 0.50, 14), HOODIE, 0, -0.25, 0, g);
    add(new THREE.CylinderGeometry(0.128, 0.128, 0.09, 14), HOOD_DK, 0, -0.52, 0, g);
    var paw = add(SPH, FUR, 0, -0.62, 0, g);
    paw.scale.setScalar(0.125);
    return g;
  }
  var armL = makeArm(-1), armR = makeArm(1);
  armL.rotation.z = -0.17;
  armR.rotation.z =  0.17;

  // ---------- tail ----------
  var tail = new THREE.Group();
  tail.position.set(0, 0.92, -0.34);
  lion.add(tail);
  var tArm = add(new THREE.CylinderGeometry(0.04, 0.05, 0.52, 10), MANE, 0, -0.10, -0.15, tail);
  tArm.rotation.x = -0.85;
  var tuft = add(SPH, MANE, 0, -0.29, -0.38, tail);
  tuft.scale.set(0.12, 0.17, 0.12);

  // ---------- head (bigger = cuter) ----------
  var head = new THREE.Group();
  head.position.set(0, 2.14, 0.02);
  head.scale.setScalar(1.08);
  lion.add(head);

  // mane: bars all round except the crown, where the cap sits
  var maneRing = new THREE.Group();
  head.add(maneRing);
  var barGeo = new THREE.BoxGeometry(0.135, 0.42, 0.135);
  var COUNT = 14;
  for (var i = 0; i < COUNT; i++){
    var a = (i / COUNT) * Math.PI * 2;
    var deg = a * 180 / Math.PI;
    if (deg > 40 && deg < 140) continue;      // leave the crown clear for the cap
    var bar = new THREE.Mesh(barGeo, i % 2 ? MANE2 : MANE);
    bar.position.set(Math.cos(a) * 0.60, Math.sin(a) * 0.60, -0.05);
    bar.rotation.z = a - Math.PI/2;
    bar.castShadow = true;
    maneRing.add(bar);
  }
  var maneCore = add(SPH, MANE, 0, -0.03, -0.11, head);
  maneCore.scale.set(0.58, 0.56, 0.40);

  [-0.36, 0.36].forEach(function(x){
    var e = add(SPH, FUR, x, 0.30, 0.02, head);
    e.scale.set(0.145, 0.145, 0.09);
    var inner = add(SPH, EAR, x, 0.32, 0.10, head);
    inner.scale.set(0.08, 0.08, 0.05);
  });

  var face = add(SPH, FUR, 0, 0, 0.10, head);
  face.scale.set(0.50, 0.48, 0.44);

  // ---------- cap, worn backwards ----------
  var capG = new THREE.Group();
  capG.position.set(0, 0.30, 0.02);
  capG.rotation.x = -0.10;
  head.add(capG);
  var dome = add(SPH, CAP, 0, 0, 0, capG);
  dome.scale.set(0.455, 0.30, 0.44);
  var capBand = add(new THREE.CylinderGeometry(0.455, 0.455, 0.075, 20), MANE2, 0, -0.02, 0, capG);
  var brim = add(SPH, MANE2, 0, -0.03, -0.50, capG);
  brim.scale.set(0.30, 0.045, 0.22);
  var button = add(SPH, MANE2, 0, 0.30, 0, capG);
  button.scale.setScalar(0.045);

  // ---------- face features ----------
  var muzzle = add(SPH, LIGHT, 0, -0.15, 0.42, head);
  muzzle.scale.set(0.25, 0.19, 0.19);
  var nose = add(SPH, DARK, 0, -0.06, 0.55, head);
  nose.scale.set(0.072, 0.060, 0.058);

  var eyeGeo = new THREE.SphereGeometry(0.088, 16, 12);   // bigger eyes
  add(eyeGeo, DARK, -0.180, 0.07, 0.455, head);
  add(eyeGeo, DARK,  0.180, 0.07, 0.455, head);
  var glintGeo = new THREE.SphereGeometry(0.030, 8, 6);
  var glintMat = new THREE.MeshBasicMaterial({color:0xffffff});
  [[-0.152, 0.105],[0.208, 0.105]].forEach(function(p){
    add(glintGeo, glintMat, p[0], p[1], 0.520, head);
  });
  // cheeks
  [-0.315, 0.315].forEach(function(x){
    var b = add(SPH, BLUSH, x, -0.075, 0.335, head);
    b.scale.set(0.105, 0.062, 0.055);
  });

  // ---------- contact shadow ----------
  var cnv = document.createElement('canvas'); cnv.width = cnv.height = 128;
  var ctx = cnv.getContext('2d');
  var g2 = ctx.createRadialGradient(64,64,0,64,64,64);
  g2.addColorStop(0,'rgba(18,23,28,0.34)');
  g2.addColorStop(0.55,'rgba(18,23,28,0.12)');
  g2.addColorStop(1,'rgba(18,23,28,0)');
  ctx.fillStyle = g2; ctx.fillRect(0,0,128,128);
  var shadowMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2),
    new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cnv), transparent:true, depthWrite:false})
  );
  shadowMesh.rotation.x = -Math.PI/2;
  shadowMesh.position.y = 0.005;
  scene.add(shadowMesh);

  dock.classList.add('has3d');

  // ================= interaction =================
  var targetYaw=0, targetPitch=0, yaw=0, pitch=0;
  var spin=0, spinVel=0, hop=0, hopVel=0;
  var wave=0, waveT=0;
  var dragging=false, lastX=0, moved=0;

  if (!reduce && window.matchMedia('(pointer:fine)').matches){
    window.addEventListener('mousemove', function(e){
      if (dragging) return;
      var r = host.getBoundingClientRect();
      targetYaw   = Math.max(-0.6, Math.min(0.6, (e.clientX - (r.left + r.width/2)) / 420));
      targetPitch = Math.max(-0.3, Math.min(0.36, (e.clientY - (r.top + r.height/2)) / 480));
    }, {passive:true});
  }

  host.addEventListener('pointerdown', function(e){
    dragging = true; lastX = e.clientX; moved = 0;
    if (host.setPointerCapture) host.setPointerCapture(e.pointerId);
  });
  host.addEventListener('pointermove', function(e){
    if (!dragging) return;
    var d = e.clientX - lastX; lastX = e.clientX;
    moved += Math.abs(d); spinVel += d * 0.0016;
  });
  function endDrag(){ dragging = false; }
  host.addEventListener('pointerup', endDrag);
  host.addEventListener('pointercancel', endDrag);
  host.addEventListener('click', function(e){
    if (moved > 6){ e.stopPropagation(); moved = 0; }
  }, true);

  window.mascotHop = function(){
    if (hop < 0.02) hopVel = 0.075;
    waveT = 1;
  };

  // ================= loop =================
  var running = true, t = 0, raf = null;
  document.addEventListener('visibilitychange', function(){
    running = !document.hidden; if (running && !raf) tick();
  });
  if ('IntersectionObserver' in window){
    new IntersectionObserver(function(en){
      running = en[0].isIntersecting && !document.hidden;
      if (running && !raf) tick();
    }, {threshold:0.01}).observe(host);
  }

  function tick(){
    if (!running){ raf = null; return; }
    raf = requestAnimationFrame(tick);
    t += 0.016;

    yaw   += (targetYaw - yaw) * 0.08;
    pitch += (targetPitch - pitch) * 0.08;
    spin  += spinVel; spinVel *= 0.92;

    hopVel -= 0.0055;
    hop = Math.max(0, hop + hopVel);
    if (hop === 0 && hopVel < 0) hopVel = 0;

    waveT = Math.max(0, waveT - 0.011);
    wave += (waveT - wave) * 0.14;

    var idle = reduce ? 0 : Math.sin(t * 1.5);

    lion.rotation.y = spin + yaw * 0.7;
    lion.position.y = hop + (reduce ? 0 : idle * 0.012);
    torso.scale.y = 0.46 + (reduce ? 0 : idle * 0.007);

    head.rotation.y = yaw * 0.5;
    head.rotation.x = pitch * 0.45;
    if (!reduce) maneRing.rotation.z = Math.sin(t * 0.5) * 0.07 + hop * 0.9;

    var sway = reduce ? 0 : idle * 0.05;
    armL.rotation.z = -0.17 - sway;
    armR.rotation.z = 0.17 + sway + wave * 2.30 + (wave > 0.05 ? Math.sin(t * 11) * 0.20 * wave : 0);

    shadowMesh.scale.setScalar(1 - hop * 0.5);
    shadowMesh.material.opacity = 1 - hop * 1.4;

    renderer.render(scene, camera);
  }
  tick();

  window.addEventListener('resize', function(){
    var w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    camera.aspect = w/h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
  });
})();
});
