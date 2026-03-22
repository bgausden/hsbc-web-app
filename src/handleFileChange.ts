
export const handleFileChange = (_event: Event) => {
    const outputRegion = document.getElementById('output-region');
    if (outputRegion) {
        outputRegion.innerHTML = '';
    }
}
