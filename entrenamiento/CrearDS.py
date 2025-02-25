import os
import numpy as np
import pandas as pd

def generar_datos_usuarios_corregido_v6(n):
    
    # Generar edades entre 15 y 55
    rango_edades = range(15, 56)
    p_edades = np.concatenate([
        np.repeat(0.20 / 6, 6),   # 15-20 años
        np.repeat(0.60 / 20, 20), # 21-40 años
        np.repeat(0.20 / 15, 15), # 41-55 años
    ])
    p_edades = p_edades / p_edades.sum()
    edades = np.random.choice(rango_edades, size=n, p=p_edades)

    # Generar BMI entre 17 y 31 con un paso de 0.1
    valores_bmi = np.arange(17, 31, 0.1)  # Esto genera un array de 141 elementos entre 17 y 31
    p_bmi = np.concatenate([
        np.repeat(0.1 / 20, 20),  # Bajo peso (17.0 - 18.9)
        np.repeat(0.8 / 80, 80),  # Peso normal (19.0 - 28.9)
        np.repeat(0.1 / 40, 40)   # Sobrepeso (29.0 - 31.0)
    ])
    p_bmi = p_bmi / p_bmi.sum()
    # Generar los valores de BMI con las probabilidades dadas
    bmis = np.random.choice(valores_bmi, size=n, p=p_bmi)


    # Generar deporte (0 a 3)
    deportes = [
        np.random.choice([0, 1, 2], p=[0.50, 0.45, 0.05]) if bmi > 25 else
        np.random.choice([0, 1, 2, 3], p=[0.45, 0.4, 0.10, 0.05])
        for bmi in bmis
    ]

    # Generar estrés (0, 1, 2, 0 es nada estresado, 1 un poco estresado y 2 muy estresado)
    estres = np.random.choice([0, 1, 2], size=n, p=[0.6, 0.3, 0.1])

    # Generar sueño (0 o 1, 0 es dormir mal y 1 es dormir bien)
    sueño = np.random.choice([0, 1], size=n, p=[0.2, 0.8])

    ciclos = [
    max(20, min(40, 29 + calcular_ajuste_ciclo(edades[i], bmis[i], estres[i], sueño[i], deportes[i])))
    for i in range(n)
    ]
    periodos = [
        max(0, min(8, 5 + calcular_ajuste_periodo(edades[i], bmis[i], estres[i], sueño[i], deportes[i])))
        for i in range(n)
    ]

    return pd.DataFrame({
        "Edad": edades,
        "BMI": np.round(bmis, 1),
        "Deporte": deportes,
        "Estres": estres,
        "Sueño": sueño,
        "CicloMenstrual": ciclos,
        "Periodo": periodos
    })

def calcular_ajuste_ciclo(edad, bmi, estres, sueño, deporte):
    ajuste_edad = -4 if edad < 20 else (6 if edad > 45 else 0)
    ajuste_bmi = -3 if bmi < 18 else (3 if 25 <= bmi < 29 else (6 if bmi > 29 else 0))
    ajuste_estres = 3 if estres == 2 else (1 if estres == 1 else 0)
    ajuste_sueño = 6 if sueño == 0 else 0
    ajuste_deporte = 5 if deporte == 3 else (5 if bmi > 25 and deporte == 0 else 0)

    return ajuste_edad + ajuste_bmi + ajuste_estres + ajuste_sueño + ajuste_deporte

def calcular_ajuste_periodo(edad, bmi, estres, sueño, deporte):
    ajuste_edad = 2 if edad < 20 else (-2 if edad > 45 else 0)
    ajuste_bmi = -2 if bmi < 18 else (2 if 25 <= bmi < 29 else (4 if bmi > 29 else 0))
    ajuste_estres = -2 if estres == 2 else (-1 if estres == 1 else 0)
    ajuste_sueño = 0 if sueño == 1 else -1
    ajuste_deporte = -2 if deporte == 3 else (4 if bmi > 25 and deporte == 0 else 0)

    return ajuste_edad + ajuste_bmi + ajuste_estres + ajuste_sueño + ajuste_deporte


# Generar dataset
dataset = generar_datos_usuarios_corregido_v6(50000)

# Guardar el dataset en un único archivo CSV
carpeta_salida = "C:\\Users\\laura\\OneDrive - Universidad Europea Miguel de Cervantes\\Universidad\\UEMC\\4º\\TFG\\AppTFG\\App\\entrenamiento\\datasets"
os.makedirs(carpeta_salida, exist_ok=True)

ruta_archivo = os.path.join(carpeta_salida, "dataset50000.csv")
dataset.to_csv(ruta_archivo, index=False)

print(f"Archivo guardado: {ruta_archivo}")
print(dataset.head())
