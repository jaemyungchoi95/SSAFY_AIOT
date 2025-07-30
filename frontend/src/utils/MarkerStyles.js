export const getMarkerColor = (status) => {
    switch (status) {
        case 'critical': return '#FF7575';
        case 'warning': return '#FFBC5F';
        default: return '#396DF0';
    }
}