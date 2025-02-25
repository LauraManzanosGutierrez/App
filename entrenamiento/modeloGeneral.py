import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
from tensorflow import keras
import joblib
import os

# Cargar los datos
data_path = r"C:\Users\laura\OneDrive - Universidad Europea Miguel de Cervantes\Universidad\UEMC\4º\TFG\AppTFG\App\entrenamiento\datasets\dataset50000.csv"
data = pd.read_csv(data_path, encoding="latin1")

# Definir las variables independientes (X) y las variables dependientes (y_ciclo y y_periodo)
X = data[['Edad', 'BMI', 'Deporte', 'Estres', 'Sueño']]
y_ciclo = data['CicloMenstrual']
y_periodo = data['Periodo']

# Dividir los datos en conjunto de entrenamiento (70%) y test (30%) para ambas variables
X_train_full, X_test, y_train_full_ciclo, y_test_ciclo = train_test_split(X, y_ciclo, train_size=0.7, shuffle=False)
_, _, y_train_full_periodo, y_test_periodo = train_test_split(X, y_periodo, train_size=0.7, shuffle=False)

# Dividir el conjunto de entrenamiento en entrenamiento (90%) y validación (10%) para ambas variables
X_train, X_val, y_train_ciclo, y_val_ciclo = train_test_split(X_train_full, y_train_full_ciclo, train_size=0.9, shuffle=False)
_, _, y_train_periodo, y_val_periodo = train_test_split(X_train_full, y_train_full_periodo, train_size=0.9, shuffle=False)

# Normalizamos las entradas
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
joblib.dump(scaler, "scaler.pkl")
X_val = scaler.transform(X_val)
X_test = scaler.transform(X_test)

# Definir la red neuronal para la predicción del ciclo menstrual
model = keras.models.Sequential([
    keras.layers.InputLayer(input_shape=(X_train.shape[1],)),
    keras.layers.Dense(400, activation="relu"),
    keras.layers.Dense(200, activation="relu"),
    keras.layers.Dense(100, activation="relu"),
    keras.layers.Dense(50, activation="relu"),
    keras.layers.Dense(1)  # Salida continua
])

# Definir la red neuronal para la predicción del periodo
modelP = keras.models.Sequential([
    keras.layers.InputLayer(input_shape=(X_train.shape[1],)),
    keras.layers.Dense(400, activation="relu"),
    keras.layers.Dense(200, activation="relu"),
    keras.layers.Dense(100, activation="relu"),
    keras.layers.Dense(50, activation="relu"),
    keras.layers.Dense(1)  # Salida continua
])

# Resumen del modelo
model.summary()
modelP.summary() 

# Compilación
model.compile(loss="mean_squared_error", optimizer="adam", metrics=["mae"])
modelP.compile(loss="mean_squared_error", optimizer="adam", metrics=["mae"])

# Callback para Early Stopping
early_stopping = keras.callbacks.EarlyStopping(
    monitor="val_loss",  # Se detiene si la pérdida de validación deja de mejorar
    patience=10,          # Espera 10 épocas antes de detenerse
    restore_best_weights=True  # Restaura los mejores pesos obtenidos
)

# Entrenamiento para el modelo del ciclo menstrual con Early Stopping
history = model.fit(X_train, y_train_ciclo, batch_size=64, epochs=100, validation_data=(X_val, y_val_ciclo), callbacks=[early_stopping])

# Entrenamiento para el modelo del periodo con Early Stopping
historyP = modelP.fit(X_train, y_train_periodo, batch_size=64, epochs=100, validation_data=(X_val, y_val_periodo), callbacks=[early_stopping])

# Graficar la historia del entrenamiento del modelo del ciclo menstrual
pd.DataFrame(history.history).plot(figsize=(8, 5))
plt.gca().set_ylim(0, 2)
plt.grid(True)
plt.xlabel("Epochs")
plt.title("Entrenamiento - Predicción del Ciclo Menstrual")
plt.show()

# Graficar la historia del entrenamiento del modelo del periodo
pd.DataFrame(historyP.history).plot(figsize=(8, 5))
plt.gca().set_ylim(0, 2)
plt.grid(True)
plt.xlabel("Epochs")
plt.title("Entrenamiento - Predicción del Periodo")
plt.show()

# Evaluar el modelo en el conjunto de test
test_loss, test_mae = model.evaluate(X_test, y_test_ciclo, verbose=0)
print(f"Test Loss (Ciclo Menstrual) (MSE): {test_loss}")
print(f"Test MAE (Ciclo Menstrual): {test_mae}")

test_lossP, test_maeP = modelP.evaluate(X_test, y_test_periodo, verbose=0)
print(f"Test Loss (Periodo) (MSE): {test_lossP}")
print(f"Test MAE (Periodo): {test_maeP}")

# Guardar modelos en formato .keras
model.save("modelo_ciclo.keras")
modelP.save("modelo_periodo.keras")