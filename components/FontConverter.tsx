'use client';

import { useState, ChangeEvent } from 'react';
import { convertFont, ConversionOptions } from '@/lib/fontConverter';

export default function FontConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [options, setOptions] = useState<ConversionOptions>({
    reverseWinding: false,
    restrictCharacters: false,
    characterRange: '',
    characterSet: '',
    outputFormat: 'json',
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setOutput('');
    }
  };

  const handleConvert = async () => {
    if (!file) {
      alert('フォントファイルを選択してください');
      return;
    }

    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await convertFont(arrayBuffer, options);
      setOutput(result);
    } catch (error) {
      console.error('変換エラー:', error);
      alert('フォントの変換に失敗しました: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!output) return;

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const extension = options.outputFormat === 'json' ? 'json' : 'js';
    a.download = `${file?.name.replace(/\.[^/.]+$/, '')}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* GitHub Link */}
      <a
        href="https://github.com/activeguild/load-opentype-font"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 group"
        aria-label="GitHub Repository"
      >
        <img
          src="/github.svg"
          alt="GitHub"
          className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-200 group-hover:scale-110"
        />
      </a>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Font to JSON/JS Converter
          </h1>
          <p className="text-gray-600">
            opentype.jsを使用してフォントファイルをJSON/JavaScript形式に変換
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                フォントファイルを選択
              </label>
              <input
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100
                  cursor-pointer"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  選択中: {file.name}
                </p>
              )}
            </div>

            {/* Options */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">オプション</h3>

              <div className="space-y-4">
                {/* Output Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    出力形式
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value="json"
                        checked={options.outputFormat === 'json'}
                        onChange={(e) =>
                          setOptions({ ...options, outputFormat: 'json' })
                        }
                        className="mr-2"
                      />
                      JSON
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value="javascript"
                        checked={options.outputFormat === 'javascript'}
                        onChange={(e) =>
                          setOptions({ ...options, outputFormat: 'javascript' })
                        }
                        className="mr-2"
                      />
                      JavaScript (typeface.js)
                    </label>
                  </div>
                </div>

                {/* Reverse Winding */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.reverseWinding}
                      onChange={(e) =>
                        setOptions({ ...options, reverseWinding: e.target.checked })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      パスの向きを反転 (Reverse winding)
                    </span>
                  </label>
                </div>

                {/* Restrict Characters */}
                <div>
                  <label className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={options.restrictCharacters}
                      onChange={(e) =>
                        setOptions({
                          ...options,
                          restrictCharacters: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">文字を制限</span>
                  </label>

                  {options.restrictCharacters && (
                    <div className="ml-6 space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          文字範囲 (例: 65-90)
                        </label>
                        <input
                          type="text"
                          value={options.characterRange}
                          onChange={(e) =>
                            setOptions({
                              ...options,
                              characterRange: e.target.value,
                              characterSet: '',
                            })
                          }
                          placeholder="65-90"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          または特定の文字
                        </label>
                        <input
                          type="text"
                          value={options.characterSet}
                          onChange={(e) =>
                            setOptions({
                              ...options,
                              characterSet: e.target.value,
                              characterRange: '',
                            })
                          }
                          placeholder="ABCあいう123"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Convert Button */}
            <div className="border-t pt-6">
              <button
                onClick={handleConvert}
                disabled={!file || loading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium
                  hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                  transition-colors duration-200"
              >
                {loading ? '変換中...' : '変換'}
              </button>
            </div>
          </div>
        </div>

        {/* Download Button */}
        {output && (
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="text-center">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">変換完了</h3>
              </div>
              <button
                onClick={handleDownload}
                className="bg-green-600 text-white py-3 px-6 rounded-md font-medium
                  hover:bg-green-700 transition-colors duration-200"
              >
                ダウンロード
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
