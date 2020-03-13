// https://en.wikipedia.org/wiki/Morse_code

const dotLengthMsec = 100;
const betweenSymbOfSameCharMsec = dotLengthMsec;
const dashLengthMsec = dotLengthMsec * 3;
const intervalBetweenLettersMsec = dotLengthMsec * 3;
const intervalBetweenWordsMsec = dotLengthMsec * 7;

const dotGraphRepr = '•';
const dashGraphRepr = '—';
const intervalBetweenLettersGraphRepr = ' ';
const intervalBetweenWordsGraphRepr = '   ';

const s = dotLengthMsec;
const l = dashLengthMsec;

const morseCode = {
    a: [s, l],
    b: [l, s, s, s],
    c: [l, s, l, s],
    d: [l, s, s],
    e: [s],
    f: [s, s, l, s],
    g: [l, l, s],
    h: [s, s, s, s],
    i: [s, s],
    j: [s, l, l, l],
    k: [l, s, l],
    l: [s, l, s, s],
    m: [l, l],
    n: [l, s],
    o: [l, l, l],
    p: [s, l, l, s],
    q: [l, l, s, l],
    r: [s, l, s],
    s: [s, s, s],
    t: [l],
    u: [s, s, l],
    v: [s, s, s, l],
    w: [s, l, l],
    x: [l, s, s, l],
    y: [l, s, l, l],
    z: [l, l, s, s],
    1: [s, l, l, l, l],
    2: [s, s, l, l, l],
    3: [s, s, s, l, l],
    4: [s, s, s, s, l],
    5: [s, s, s, s, s],
    6: [l, s, s, s, s],
    7: [l, l, s, s, s],
    8: [l, l, l, s, s],
    9: [l, l, l, l, s],
    0: [l, l, l, l, l],
};

function encodeWord(word) {
    let wordSignalLengths = [];
    let wordGraphicalRepresentation = [];
    for (let i = 0; i < word.length; i += 1) {
        if (Object.keys(morseCode).includes(word[i])) {
            if (i > 0) {
                wordSignalLengths.push({ off: intervalBetweenLettersMsec });
                wordGraphicalRepresentation.push(intervalBetweenLettersGraphRepr);
            }
            const oneCharacterSignalLenghs = [];
            for (let x = 0; x < morseCode[word[i]].length; x += 1) {
                if (x > 0) oneCharacterSignalLenghs.push({ off: betweenSymbOfSameCharMsec });
                oneCharacterSignalLenghs.push({ on: morseCode[word[i]][x] }); // s >> [{on: 200}, {off: 200}, {on: 200}, {off: 200}, {on: 200}]
            }
            wordSignalLengths = [...wordSignalLengths, ...oneCharacterSignalLenghs];
            const graphReprForChar = morseCode[word[i]].map(symbol => (symbol === dotLengthMsec ? dotGraphRepr : dashGraphRepr));
            wordGraphicalRepresentation = [
                ...wordGraphicalRepresentation,
                ...graphReprForChar,
            ];
        }
    }
    return { wordSignalLengths, wordGraphicalRepresentation };
}

function encodePhrase(phrase) {
    let morseSignalLengths = [];
    let morseGraphicalRepresentation = [];
    const words = phrase.toLowerCase().split(' ');
    for (let i = 0; i < words.length; i += 1) {
        if (i > 0) {
            morseSignalLengths.push({ off: intervalBetweenWordsMsec });
            morseGraphicalRepresentation.push(intervalBetweenWordsGraphRepr);
        }
        const { wordSignalLengths, wordGraphicalRepresentation } = encodeWord(words[i]);
        morseSignalLengths = [...morseSignalLengths, ...wordSignalLengths];
        morseGraphicalRepresentation = [
            ...morseGraphicalRepresentation,
            ...wordGraphicalRepresentation,
        ];
    }
    return { morseSignalLengths, morseGraphicalRepresentation };
}

module.exports = encodePhrase;
