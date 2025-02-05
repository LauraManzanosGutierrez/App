import * as React from "react"
import Svg, { Mask, Rect, G, Path, Defs } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */
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
        <Rect width={1082} height={1920} fill="#F3E2E6" rx={80} />
        </Mask>
        <G mask="url(#a)">
        <G filter="url(#b)" opacity={0.8}>
            <Path
            fill="#FF758F"
            d="M1184 85c0 193.3-281.605 275.5-637 275.5S-103 278.3-103 85s288.105-350 643.5-350S1184-108.3 1184 85Z"
            />
        </G>
        <G filter="url(#c)" opacity={0.8}>
            <Path fill="#FF758F" d="M-55 1747.5h1192v225H-55v-225Z" />
        </G>
        </G>
        <Defs></Defs>
    </Svg>
)
export default Fondo;
