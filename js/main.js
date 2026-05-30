/**
 * Main entry point - initializes all systems and starts the app
 */
(function() {
  'use strict';

  // Initialize audio UI
  AudioSystem.initUI();

  // Initialize scene manager
  SceneManager.init('sceneContainer');

  // Register all scenes
  SceneManager.register('welcome', WelcomeScene);
  SceneManager.register('cloud-tear', CloudTearScene);
  SceneManager.register('bubble-pop', BubblePopScene);
  SceneManager.register('leaf-crush', LeafCrushScene);
  SceneManager.register('sand-smooth', SandSmoothScene);

  // Start with welcome scene
  SceneManager.switchTo('welcome');

  // Tab bar navigation
  const tabBar = document.getElementById('tabBar');
  const tabs = tabBar.querySelectorAll('.tab-btn');

  tabBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const sceneName = btn.dataset.scene;

    // Initialize audio on any interaction
    AudioSystem.init();

    // Switch scene and only update tab state if the transition starts.
    if (SceneManager.switchTo(sceneName)) {
      tabs.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
    }
  });

  // Initialize AudioContext on first user gesture anywhere
  document.addEventListener('pointerdown', () => {
    AudioSystem.init();
  }, { once: true });

  console.log('🧘 情绪解压 App 已就绪');
  console.log('  ☁️  撕云  |  🫧 捏泡泡  |  🍂 碎叶  |  🏖️ 抚沙');
})();
