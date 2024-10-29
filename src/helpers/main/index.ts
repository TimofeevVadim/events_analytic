export const onDelay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
