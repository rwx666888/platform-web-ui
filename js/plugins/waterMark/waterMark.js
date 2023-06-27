function setWatermark(str1, str2) {
  var id = '1_23452384164_123412415';

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id));
  }

  var can = document.createElement('canvas');
  // 设置canvas画布大小
  can.width = 280;
  can.height = 180;

  var cans = can.getContext('2d');
  cans.rotate(-20 * Math.PI / 180); // 水印旋转角度
  cans.font = '15px Vedana';
  cans.fillStyle = 'rgba(200, 200, 200, 0.18)';
  cans.textAlign = 'left';
  cans.textBaseline = 'Middle';
  cans.fillText(str1, can.width / 8, can.height); // 水印在画布的位置x，y轴
  cans.fillText(str2, can.width / 8, can.height + 22);

  var div = document.createElement('div');
  div.id = id;
  div.style.pointerEvents = 'none';
  div.style.top = '40px';
  div.style.left = '0px';
  div.style.position = 'fixed';
  div.style.zIndex = '100000';
  div.style.width = document.documentElement.clientWidth + 'px';
  div.style.height = document.documentElement.clientHeight + 'px';
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat';
  document.body.appendChild(div);
  return id;
}

// 添加水印方法
function setWaterMark(str1, str2) {
  var id = setWatermark(str1, str2);
  if (document.getElementById(id) === null) {
    id = setWatermark(str1, str2);
  }
  window.onresize = function(){
    setWatermark(str1, str2);
  }
}

// 移除水印方法
function removeWatermark(){
  var id = '1_23452384164_123412415';
  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id));
  }
  window.onresize = null;
}