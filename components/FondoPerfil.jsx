import * as React from "react"
import Svg, { Mask, Rect, G, Ellipse } from "react-native-svg"
const Fondo = (props) => (
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
    <Rect width={1080} height={1920} fill="#FFB3C1" rx={80} />
    </Mask>
    <G mask="url(#a)">
    <Ellipse cx={540} cy={135} fill="#FF758F" rx={940} ry={625} />
    </G>
</Svg>
)
export default Fondo
