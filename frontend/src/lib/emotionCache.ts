import createCache from '@emotion/cache';

/* Setup emotion cache for MUI themes to work properly */
const createEmotionCache = () => createCache({ key: 'css', prepend: true });

export default createEmotionCache;
