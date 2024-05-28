import { useState } from 'react'
import './css/App.scss'

export function Tkn(props) {
	return (
	  <span className="calc-token ">
		{props.children}
	  </span>
	)
}
export function HistoryItem(props) {
	return (
		<span className="calc-history-item">
			{props.children}
		</span>
	)
}

export function Btn(props) {
  let colspan = props.colspan || 0;
  let rowspan = props.rowspan || 0;
  let onClick = props.onClick || (()=>{});

  let colspans = [
	'col-auto', 'col-span-1', 'col-span-2',
	'col-span-3', 'col-span-4', 'col-span-5',
	'col-span-6', 'col-span-7', 'col-span-8',
	'col-span-9', 'col-span-10', 'col-span-11',
	'col-span-12','col-span-full',
  ]
  let rowspans = [
	'row-auto', 'row-span-1', 'row-span-2',
	'row-span-3', 'row-span-4', 'row-span-5',
	'row-span-6', 'row-span-7', 'row-span-8',
	'row-span-9', 'row-span-10', 'row-span-11',
	'row-span-12','row-span-full',
  ]

  return (
    <div className={`calc-btn pushy z-[1]  ${colspans[colspan]} ${rowspans[rowspan]}`} onClick={(e) => onClick(e)}>
      <div className="pushy-inner flex justify-center items-center">
        {props.children}
      </div>
    </div>
  );
}

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="grid grid-cols-4 gap-2">
      <nav className="col-span-1 rounded bg-c5-100 grid grid-rows-12">
        <div className="row-span-1 bg-c5-200 pl-4 m-0 flex justify-start items-center">
          <span className="h-fit">History</span>
        </div>
        <div className="calc-history row-span-9 bg-c5-100 p-3">
          <HistoryItem>12A + 1 = 12B</HistoryItem>
          <HistoryItem>1C - 3 = 19</HistoryItem>
        </div>
        <div className="calc-history-ctrl row-span-2 bg-c5-200">
        </div>
      </nav>
      <main className="col-span-3">
        <div className="calculator">
          <div className="calc-display">
            <div className="calc-tokens">
              <Tkn>12A</Tkn>
              <Tkn>+</Tkn>
              <Tkn>E05</Tkn>
              <Tkn>+</Tkn>
              <Tkn>12A</Tkn>
              <Tkn>+</Tkn>
              <Tkn>E03</Tkn>
              <Tkn>+</Tkn>
              <Tkn>E03</Tkn>
              <Tkn>+</Tkn>
              <Tkn>12A</Tkn>
              <Tkn>+</Tkn>
              <Tkn>E03</Tkn>
              <Tkn>+</Tkn>
              <Tkn>E03</Tkn>
            </div>
            <div className="calc-input row-span-6 p-2 border rounded border-c5-300 flex justify-end items-center">
              <span className="calc-input-text text-4xl">12345A</span>
            </div>
          </div>
          <div className="calc-btns row-span-6 p-0 grid grid-cols-6">
            <div className="calc-digits col-span-4 grid grid-cols-4 grid-rows-4 gap-1 m-0">
              <Btn>1</Btn>  <Btn>2</Btn>  <Btn>3</Btn>  <Btn>4</Btn>
              <Btn>5</Btn>  <Btn>6</Btn>  <Btn>7</Btn>  <Btn>8</Btn>
              <Btn>9</Btn>  <Btn>A</Btn>  <Btn>B</Btn>  <Btn>C</Btn>
              <Btn>D</Btn>  <Btn>E</Btn>  <Btn>F</Btn>  <Btn>0</Btn>
            </div>
            <div className="calc-ops col-span-2 grid grid-cols-2 grid-rows-4 gap-1 ml-2">
              <Btn>CE</Btn> <Btn>AC</Btn>
              <Btn>+</Btn> <Btn>-</Btn>
              <Btn>×</Btn> <Btn>÷</Btn>
              <Btn colspan={2}>=</Btn>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  )
}
