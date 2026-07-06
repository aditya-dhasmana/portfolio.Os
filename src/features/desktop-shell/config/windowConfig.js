/**
 * PURPOSE:
 * Define desktop shell window defaults.
 * RESPONSIBILITY:
 * Store initial z-index, default sizes, and initial state for each desktop window.
 * USED BY:
 * Desktop shell window store and window wrapper.
 * DEPENDS ON:
 * Desktop window IDs.
 * SHOULD NOT HANDLE:
 * Rendering windows, opening windows, portfolio content, or mobile shell behavior.
 * SCALING NOTES:
 * Add new desktop windows here only when they participate in desktop shell window management.
 */

export const INITIAL_Z_INDEX = 1000;

export const DEFAULT_WINDOW_SIZES = {
  finder: { width: 900, height: 650 },
  contact: { width: 600, height: 500 },
  resume: { width: 800, height: 650 },
  safari: { width: 1200, height: 700 },
  photos: { width: 1000, height: 650 },
  terminal: { width: 700, height: 500 },
  vsCode: { width: 1100, height: 700 },
  txtfile: { width: 500, height: 600 },
  imgfile: { width: 760, height: 560 },
};

const createWindowConfig = (size) => ({
  isOpen: false,
  isMinimized: false,
  sizeMode: "normal",
  zIndex: INITIAL_Z_INDEX,
  data: null,
  size,
  position: null,
  lastNormalSize: size,
  lastNormalPosition: null,
});

export const WINDOW_CONFIG = {
  finder: createWindowConfig(DEFAULT_WINDOW_SIZES.finder),
  contact: createWindowConfig(DEFAULT_WINDOW_SIZES.contact),
  resume: createWindowConfig(DEFAULT_WINDOW_SIZES.resume),
  safari: createWindowConfig(DEFAULT_WINDOW_SIZES.safari),
  photos: createWindowConfig(DEFAULT_WINDOW_SIZES.photos),
  terminal: createWindowConfig(DEFAULT_WINDOW_SIZES.terminal),
  vsCode: createWindowConfig(DEFAULT_WINDOW_SIZES.vsCode),
  txtfile: createWindowConfig(DEFAULT_WINDOW_SIZES.txtfile),
  imgfile: createWindowConfig(DEFAULT_WINDOW_SIZES.imgfile),
};
