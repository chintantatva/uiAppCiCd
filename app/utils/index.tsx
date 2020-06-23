import _ from 'lodash';

export function throttle(func, timer = 700) {
    return _.debounce(func, timer, { leading: true, trailing: false })
}
