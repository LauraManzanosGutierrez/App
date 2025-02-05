import * as React from "react"
import Svg, { Mask, Rect, G, Path, Defs } from "react-native-svg"

export const Fondo = (props) => (
    <Svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 1088 1928"  
            preserveAspectRatio="xMidYMid slice" 
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
        <G filter="url(#b)" mask="url(#a)" opacity={0.8}>
        <Path fill="#FF758F" d="M-55 1747.5h1192v225H-55v-225Z" />
        </G>
        <Defs></Defs>
    </Svg>
)
export default Fondo;