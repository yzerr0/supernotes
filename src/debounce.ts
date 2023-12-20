function debounce <Args extends unknown[]>(
    fn: (...args: Args) => void,
    delay: number 
) {
    let timeout: number | undefined;
    return (...args: Args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

export default debounce;