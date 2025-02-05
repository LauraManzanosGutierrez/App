import * as React from "react";
import Svg, { Mask, Path, G, Circle } from "react-native-svg";

export const Fondo = (props) => (

    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 1088 1928"  // Ajusta el tamaño aquí si es necesario
        preserveAspectRatio="xMidYMid slice" // Esto asegura que el fondo se recorte y mantenga las proporciones
        {...props}
    >
        <Mask
        id="a"
        width={1088}
        height={1928}
        x={5}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
            maskType: "alpha",
        }}
        >
        <Path
            fill="#F3E2E6"
            d="M4 80C4 35.817 39.817 0 84 0h920c44.18 0 80 35.817 80 80v1760c0 44.18-35.82 80-80 80H84c-44.183 0-80-35.82-80-80V80Z"
        />
        <Path
            fill="#F3E2E6"
            d="M696 125c0 46.944-38.056 85-85 85s-85-38.056-85-85 38.056-85 85-85 85 38.056 85 85Z"
        />
        </Mask>
        <G mask="url(#a)">
        <Path
            fill="#FE3E63"
            d="M1233 394c0 96.65-78.35 175-175 175s-175-78.35-175-175 78.35-175 175-175 175 78.35 175 175ZM204.082 1591c0 96.65-78.35 175-175 175s-175-78.35-175-175 78.35-175 175-175 175 78.35 175 175Z"
        />
        <Circle cx={118} cy={1937} r={350} fill="#FF758F" />
        <Circle cx={574} cy={1781} r={85} fill="#FE3E63" />
        <Circle cx={607} cy={147} r={85} fill="#FE3E63" />
        <Circle cx={1084} cy={48} r={350} fill="#FF758F" />
        <Circle cx={-19} cy={63.066} r ={350}fill="#FF758F"  />
        <Circle cx={1147} cy={1891.97} r ={350} fill="#FF758F" />
        
        </G>
    </Svg>
);

export default Fondo;
