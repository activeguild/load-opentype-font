import { ImageResponse } from 'next/og';

// Image metadata
export const alt = 'Font to JSON/JS Converter';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(to bottom right, #1e3a8a, #3b82f6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 'bold', marginBottom: 20 }}>
          Font Converter
        </div>
        <div style={{ fontSize: 40, opacity: 0.9 }}>
          フォントファイルをJSON/JSに変換
        </div>
        <div style={{ fontSize: 30, opacity: 0.8, marginTop: 20 }}>
          TTF • OTF • WOFF
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
