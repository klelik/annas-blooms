import type { RouterConfig } from '@nuxt/schema';

function scrollTo(position: any, delay: number = 750): Promise<any> {
  return new Promise(resolve => {
    setTimeout(() => resolve(position), delay);
  });
}

export default <RouterConfig>{
  scrollBehavior(target, source, savedScrollPosition) {
    if (target.hash) {
      return { el: target.hash, top: 30, behavior: 'smooth' };
    } else if (savedScrollPosition) {
      return scrollTo(savedScrollPosition);
    }

    return scrollTo({ top: 0, behavior: 'smooth' });
  }
};
