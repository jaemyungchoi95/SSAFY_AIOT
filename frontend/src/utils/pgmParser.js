/**
 * PGM 파일 내용을 파싱하는 함수 (P2, P5 형식 지원)
 * @param {ArrayBuffer} arrayBuffer - PGM 파일의 ArrayBuffer 데이터
 * @returns {{width: number, height: number, maxGray: number, pixels: number[] |Uint8Array}}
 */
export function parsePGM(arrayBuffer) {
  const dataView = new DataView(arrayBuffer);
  const textDecoder = new TextDecoder('ascii');

  // 헤더를 파싱하기 위해 최대 512바이트까지만 텍스트로 읽습니다.
  const headerText = textDecoder.decode(arrayBuffer.slice(0, 512));

  const lines = headerText
    .split('\n')
    .filter((line) => !line.startsWith('#'))
    .filter((line) => line.trim() !== '');

  const magicNumber = lines.shift().trim();
  if (magicNumber !== 'P2' && magicNumber !== 'P5') {
    throw new Error(
      `Unsupported PGM format: ${magicNumber}. Only P2 and P5 aresupported.`,
    );
  }

  const [width, height] = lines.shift().trim().split(/\s+/).map(Number);
  const maxGray = Number(lines.shift().trim());

  // 헤더의 끝을 찾습니다. (매직넘버, 크기, 최대값 라인)
  // 헤더는 3개의 정보 라인으로 구성됩니다.
  let headerEndIndex = 0;
  let lineCount = 0;
  for (let i = 0; i < arrayBuffer.byteLength && lineCount < 3; i++) {
    if (dataView.getUint8(i) === 0x0a) {
      // 0x0A는 개행문자(\n)
      lineCount++;
    }
    if (lineCount === 3) {
      headerEndIndex = i + 1;
      break;
    }
  }

  if (magicNumber === 'P5') {
    // Binary (P5)
    // 헤더 바로 다음부터가 실제 픽셀 데이터입니다.
    const pixels = new Uint8Array(arrayBuffer, headerEndIndex);
    return { width, height, maxGray, pixels };
  } else {
    // ASCII (P2)
    // 헤더 이후의 전체 텍스트를 디코딩합니다.
    const bodyText = textDecoder.decode(arrayBuffer.slice(headerEndIndex));
    const pixels = bodyText.trim().split(/\s+/).map(Number);
    return { width, height, maxGray, pixels };
  }
}
