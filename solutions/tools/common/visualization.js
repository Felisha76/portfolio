// Common module for CHARSET, DIGRAPHS, and visualization logic

// Define Hungarian digraphs and trigraphs
export const DIGRAPHS = ["dzs", "dz", "cs", "gy", "ly", "ny", "sz", "ty", "zs"];

// Define character set
export const CHARSET = [
    ' ', '.', ',', '?', '!', "'",'a','á','b','c','cs','d','dz','dzs','e','é','f','g','gy','h','i','í','j','k','l','ly','m','n','ny','o','ó','ö','ő','p','q','r','s','sz','t','ty','u','ú','ü','ű','v','w','x','y','z','zs'
];

// Function to create a color palette
export function createPalette(n) {
    const colors = [];
    for (let i = 0; i < n; i++) {
        const hue = Math.round((i / n) * 280);
        colors.push(`hsl(${hue}deg 70% 50%)`);
    }
    return colors;
}

// Function to tokenize text based on DIGRAPHS
export function tokenizeText(text) {
    const tokens = [];
    let i = 0;
    while (i < text.length) {
        const rest = text.slice(i).toLowerCase();
        const digraph = DIGRAPHS.find(d => rest.startsWith(d));
        if (digraph) {
            tokens.push(text.slice(i, i + digraph.length));
            i += digraph.length;
        } else {
            tokens.push(text[i]);
            i++;
        }
    }
    return tokens;
}

// Function to visualize a word as an SVG
export function visualizeWord(word) {
    if (!word) return '';

    const palette = createPalette(CHARSET.length);
    const tokens = tokenizeText(word);

    const dotSize = 5;
    const xSpacing = 15;
    const ySpacing = 1;
    const marginLeft = 15; 
    const marginTop = 10;
    const width = Math.max(120, (tokens.length + 2) * xSpacing);
    const height = Math.max(80, (CHARSET.length + 1) * ySpacing + 4);

    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background:#0e1117;display:block;border-radius:8px;">`;

    svg += `<line x1="${marginLeft}" y1="${height-marginTop}" x2="${width-10}" y2="${height-marginTop}" stroke="rgba(255,255,255,0.15)" />`;
    svg += `<line x1="${marginLeft}" y1="${marginTop}" x2="${marginLeft}" y2="${height-marginTop}" stroke="rgba(255,255,255,0.15)" />`;

    for (let i = 0; i < tokens.length - 1; i++) {
        const ci1 = CHARSET.indexOf(tokens[i].toLowerCase());
        const ci2 = CHARSET.indexOf(tokens[i+1].toLowerCase());
        const x1 = marginLeft + i * xSpacing;
        const y1 = height - marginTop - (ci1 !== -1 ? ci1 : 0) * ySpacing;
        const x2 = marginLeft + (i+1) * xSpacing;
        const y2 = height - marginTop - (ci2 !== -1 ? ci2 : 0) * ySpacing;
        svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="gray" stroke-width="1"/>`;
    }

    tokens.forEach((ch, i) => {
        const ci = CHARSET.indexOf(ch.toLowerCase());
        const cx = marginLeft + i * xSpacing;
        const cy = height - marginTop - (ci !== -1 ? ci : 0) * ySpacing;
        const color = palette[ci !== -1 ? ci : 0];
        svg += `<circle cx="${cx}" cy="${cy}" r="${dotSize}" fill="${color}" />`;
    });

    svg += `</svg>`;
    return svg;
}