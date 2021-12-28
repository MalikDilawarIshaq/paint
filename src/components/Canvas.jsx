import React, {
  useState, useRef, useEffect, useCallback,
} from 'react';

function Canvas() {
  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const svgRef = useRef(null);
  const imgRef = useRef(null);
  const circleRef = useRef(null);
  const colors = ['red', 'green', 'blue', 'yellow', 'black', 'brown'];
  const borderColors = ['red', 'green', 'blue', 'yellow', 'black', 'brown'];
  const [mouseDownIs, setMouseDownIs] = useState(false);
  const [pen, setPen] = useState(false);
  const [circule, setCircule] = useState(false);
  const [fillColors, setFillColor] = useState(false);
  const [array, setArray] = useState([]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedBorder, setSelectedBorder] = useState(borderColors[0]);
  const [lastPosition, setPosition] = useState({
    x: 0,
    y: 0,
  });

  let circuleStartX = '0';
  let circuleStartY = '0';
  const myObject = {};
  useEffect(() => {
    if (canvasRef.current) {
      ctx.current = canvasRef.current.getContext('2d');
    }
  }, []);
  // ReDraw Fill shaps With Colors
  const reDrawFillShaps = (x, y, w) => {
    if (circuleStartX >= x && circuleStartX <= x + w
        && circuleStartY >= y && circuleStartY <= y + w) {
      // console.log(x,x+w,y,y+w,w,circuleStartX,circuleStartY,"ok");

      circleRef.current.style.fill = `${selectedColor}`;
      circleRef.current.style.border = `${selectedBorder}`;

      /// //            convert svg to img
      const xml = new XMLSerializer().serializeToString(svgRef.current);
      const svg64 = btoa(xml);
      const b64Start = 'data:image/svg+xml;base64,';
      const image64 = b64Start + svg64;

      imgRef.current.onload = () => {
        ctx.current.drawImage(imgRef.current, x, y, w, w);
      };
      imgRef.current.src = image64;
    }
  };
  const draw = useCallback((x, y) => {
    if (mouseDownIs && pen) {
      ctx.current.beginPath();
      ctx.current.strokeStyle = selectedColor;
      ctx.current.lineWidth = 10;
      ctx.current.lineJoin = 'round';
      ctx.current.moveTo(lastPosition.x, lastPosition.y);
      ctx.current.lineTo(x, y);
      ctx.current.closePath();
      ctx.current.stroke();

      setPosition({
        x,
        y,
      });
    }
  }, [setPosition, mouseDownIs, selectedColor, lastPosition]);
  //         draw Shaps

  const drawDragImg = (x, y) => {
    const Radius = Math.sqrt((x - circuleStartX) ** 2 + (y - circuleStartY) ** 2);
    if (circule) {
      circleRef.current.style.fill = `${selectedColor}`;
      circleRef.current.style.border = `${selectedBorder}`;
      const xml = new XMLSerializer().serializeToString(svgRef.current);
      const svg64 = btoa(xml);
      const b64Start = 'data:image/svg+xml;base64,';
      const image64 = b64Start + svg64;

      // set it as the source of the img element
      imgRef.current.onload = () => {
        // draw the image onto the canvas
        ctx.current.drawImage(
          imgRef.current,
          circuleStartX - Radius / 4,
          circuleStartY - Radius / 4,
          Radius,
          Radius,
        );
      };
      imgRef.current.src = image64;

      setCircule(false);

      // save state of canvas
      const temp = array;
      myObject.x = circuleStartX - Radius / 4;
      myObject.y = circuleStartY - Radius / 4;
      myObject.width = Radius;
      temp.push(myObject);
      setArray(temp);
    }
  };
  const mouseDown = (e) => {
    if (pen) {
      setPosition({
        x: e.pageX,
        y: e.pageY,
      });
      setMouseDownIs(true);
    } else if (circule) {
      circuleStartX = e.pageX;
      circuleStartY = e.pageY;
    } else if (fillColors) {
      circuleStartX = e.pageX;
      circuleStartY = e.pageY;
      const res = array.filter((element) => circuleStartX >= element.x
      && circuleStartX <= element.x + element.width
      && circuleStartY >= element.y && circuleStartY <= element.y + element.width);

      let result;
      if (res.length > 1) {
        result = res.reduce((r, a, i, aa) => (
          i && Math.abs(aa[r].x - circuleStartX) < Math.abs(a.x - circuleStartX) ? r : i), -1);

        reDrawFillShaps(res[result].x, res[result].y, res[result].width);
      } else if (res.length === 1) {
        reDrawFillShaps(res[0].x, res[0].y, res[0].width);
      }

      // console.log(result);
      // console.log(array,"click",circuleStartX);

      //
    }
  };

  const mouseUp = (e) => {
    if (pen) {
      setMouseDownIs(false);
    } else if (circule) {
      drawDragImg(e.pageX, e.pageY);
    }
  };

  const mouseOut = () => {
    if (pen) {
      setMouseDownIs(false);
    } else if (circule) {
    // console.log('con`t draw circule outside theCanvas');
    }
  };

  const mouseMove = (e) => {
    draw(e.pageX, e.pageY);
  };

  const clear = () => {
    ctx.current.clearRect(0, 0, ctx.current.canvas.width, ctx.current.canvas.height);
  };
  /// //  Select Circule
  const activeCircule = () => {
    setPen(false);
    setCircule(true);
  };
  /// / Fill colors in circule
  const fillColor = () => {
    // clear();
    setFillColor(true);
  };
  const focus = () => {

  };
  const blur = () => {

  };

  /// /// Delete all States of canvas
  const removeAll = () => {
    setArray([]);
    ctx.current.clearRect(0, 0, ctx.current.canvas.width, ctx.current.canvas.height);
  };

  return (
    <div>
            <canvas
        ref={canvasRef}
        width={1260}
        height={535}
        style={{ border: '1px solid #000', margin: '5px', cursor: 'crosshair' }}
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
        onMouseOut={mouseOut}
        onMouseMove={mouseMove}
        onFocus={focus}
        onBlur={blur}
      />
      <label htmlFor="colors" style={{ marginLeft: '5px' }}>Select Color : </label>
      <select id="colors" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} style={{ marginLeft: '10px' }}>
        {
                    colors.map(
                      (color) => <option key={color} value={color}>{color}</option>,
                    )
                }
      </select>

      <label htmlFor="borders" style={{ marginLeft: '15px' }}> Select Border : </label>
      <select id="borders" value={selectedBorder} onChange={(e) => setSelectedBorder(e.target.value)} style={{ marginLeft: '5px' }}>
        {
                    borderColors.map(
                      (border) => <option key={border} value={border}>{border}</option>,
                    )
        }
      </select>
      <button type="button" onClick={clear} style={{ marginLeft: '25px' }}>Clear</button>
      <button type="button" onClick={() => setPen(true)} style={{ marginLeft: '25px' }}>pen</button>
      <button data-testid="testId" type="button" onClick={activeCircule} style={{ marginLeft: '25px' }}>Circule</button>
      <button type="button" onClick={fillColor} style={{ marginLeft: '25px' }}>Fill Color</button>
      <button type="button" onClick={removeAll} style={{ marginLeft: '25px' }}>Remove All</button>
      <svg onClick={activeCircule} ref={svgRef} height="100" width="100" style={{ display: 'none' }}>
        <circle ref={circleRef} cx="50" cy="50" r="40" stroke={selectedBorder} strokeWidth="3" fill="pink" />
      </svg>
      <img alt="img" ref={imgRef} style={{ display: 'none' }} />
      {/* <button></button> */}
    </div>
  );
}

export default Canvas;
