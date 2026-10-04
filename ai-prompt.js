'use strict';
function createAIPrompt({name,width,height,pixels,bytes,board,screenHeight,address,request}) {
  const rows=[];
  for(let i=0;i<bytes.length;i+=16) rows.push(bytes.slice(i,i+16).map(v=>'0x'+v.toString(16).padStart(2,'0').toUpperCase()).join(', '));
  return `你是一位 Arduino 教學助教。請依照下列設定與圖案資料，協助我完成 OLED 作品。

【硬體設定】
開發板：${board}
顯示器：I²C SSD1306，128 × ${screenHeight}
I²C 位址：${address}（若無法顯示，請說明如何確認實際位址）
程式庫：Adafruit GFX Library、Adafruit SSD1306

【我的需求】
${request.trim() || '請將圖案置中顯示，提供完整 Arduino 程式與簡單說明。'}

【圖案資料】
作品名稱：${JSON.stringify(name)}
圖案寬度：${width} pixels
圖案高度：${height} pixels
亮點數：${pixels.reduce((sum,v)=>sum+v,0)}
資料大小：${bytes.length} bytes
格式：Adafruit GFX drawBitmap 使用的 1-bit 黑白點陣。
順序：由上往下逐列，每列由左往右；每個 byte 的最高位元（MSB）對應左側像素。
每列使用 ${Math.ceil(width/8)} bytes；不足 8 個像素時，該列最後一個 byte 的低位元補 0。1 表示亮，0 表示暗。
向量與文字已轉成下列點陣，請完整保留，勿改畫成別的圖案。

const uint8_t artwork[] PROGMEM = {
${rows.map(r=>'  '+r).join(',\n')}
};

【請提供】
1. 完整可編譯的 .ino 程式，包含 include、螢幕初始化、setup()、loop() 及完整 artwork 陣列，勿以省略號代替資料。
2. 使用 display.drawBitmap(x, y, artwork, ${width}, ${height}, SSD1306_WHITE) 繪製，再呼叫 display.display()。
3. 說明需要安裝的程式庫與對應開發板的 SDA / SCL 接線；供電電壓請依實際 OLED 模組規格確認。
4. 用繁體中文與適合初學者的方式，說明座標、圖案資料和程式流程。
5. 如果需求還缺少按鈕、感測器或腳位資訊，請先詢問，不要假設已經接好。
${height>screenHeight?'注意：圖案高度超過指定螢幕，請先詢問我要縮小圖案還是更換螢幕，不要默默裁切。':'圖案可放入所選螢幕；若需置中，起點為 ('+Math.floor((128-width)/2)+', '+Math.floor((screenHeight-height)/2)+')。'}
`;
}
