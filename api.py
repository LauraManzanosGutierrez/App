from flask import Flask, request, jsonify
import mysql.connector
from datetime import datetime, timedelta  # Importar datetime correctamente
from flask_cors import CORS
from pymongo import MongoClient
import jwt

import pandas as pd
import joblib
from tensorflow import keras
import os

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos MySQL
db_config = {
    'host': '127.0.0.1',  # Cambiar si MySQL está en otro servidor
    'user': 'root',  # Nombre de usuario
    'password': 'Margaritas_1',  # Contraseña
    'database': 'mydb'  # Nombre de la base de datos
}

# Configuración de la base de datos MongoDB
mongo_client = MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client["TFG"]  # Reemplaza con el nombre de tu base de datos en MongoDB
usuarios_collection = mongo_db["usuarios"]  # Seleccionar la colección de usuarios

try:
    mongo_db.command("ping")
    print("Conexión a MongoDB exitosa")
except Exception as e:
    print(f"Error conectando a MongoDB: {e}")

SECRET_KEY = "your_secret_key"

# Conectar a la base de datos
def obtener_conexion():
    return mysql.connector.connect(**db_config)

# Función para obtener el autor con valor por defecto
def obtener_autor():
    return request.json.get('autor', 'Usuario desconocido')

# Función para crear una respuesta con los campos comunes
def crear_respuesta(id_pregunta, autor, respuesta_data):
    respuesta_data["id"] = None
    respuesta_data["fecha"] = str(datetime.now())  # Fecha actual
    respuesta_data["autor"] = autor
    respuesta_data["id_pregunta"] = id_pregunta
    return respuesta_data

# Función para ejecutar una consulta en la base de datos
def ejecutar_query(query, params=None, fetch=False):
    try:
        conn = obtener_conexion()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query, params)
        if fetch:
            return cursor.fetchall()
        conn.commit()
        return cursor.lastrowid
    except Exception as e:
        raise Exception(f"Error en la consulta: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def generar_token(usuario_id, nombre_usuario):
    payload = {
        "exp": datetime.utcnow() + timedelta(days=1),
        "iat": datetime.utcnow(),
        "sub": usuario_id,
        "nombre": nombre_usuario
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def validar_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    

def modelo_general(usuario, edad, peso, altura, deporte, estres, sueno):
    try:
        # Definir la ruta completa de los modelos
        model_ciclo_path = r"C:\Users\laura\OneDrive - Universidad Europea Miguel de Cervantes\Universidad\UEMC\4º\TFG\AppTFG\App\entrenamiento\modelo_ciclo.keras"
        model_periodo_path = r"C:\Users\laura\OneDrive - Universidad Europea Miguel de Cervantes\Universidad\UEMC\4º\TFG\AppTFG\App\entrenamiento\modelo_periodo.keras"
        scaler_path = r"C:\Users\laura\OneDrive - Universidad Europea Miguel de Cervantes\Universidad\UEMC\4º\TFG\AppTFG\App\entrenamiento\scaler.pkl"

        # Cargar los modelos y el scaler desde las rutas absolutas
        model_ciclo = keras.models.load_model(model_ciclo_path)
        model_periodo = keras.models.load_model(model_periodo_path)
        scaler = joblib.load(scaler_path)

        # Calcular BMI
        bmi = round(peso / (altura ** 2), 2)

        # Crear un DataFrame con los datos de la usuaria
        nuevos_datos = pd.DataFrame([[edad, bmi, deporte, estres, sueno]], 
                                    columns=['Edad', 'BMI', 'Deporte', 'Estres', 'Sueño'])

        # Normalizar los datos con el scaler previamente cargado
        nuevos_datos_normalizados = scaler.transform(nuevos_datos)
        print("Valores normalizados de la nueva entrada:", nuevos_datos_normalizados)

        # Realizar la predicción con los modelos
        pred_ciclo_general = model_ciclo.predict(nuevos_datos_normalizados)
        pred_periodo_general = model_periodo.predict(nuevos_datos_normalizados)

        carpeta_usuario = rf"C:\Users\laura\OneDrive - Universidad Europea Miguel de Cervantes\Universidad\UEMC\4º\TFG\AppTFG\App\entrenamiento\datosUsuarias\datos{usuario}"
        if not os.path.exists(carpeta_usuario):
            os.makedirs(carpeta_usuario)

        # Crear un DataFrame con los datos originales y las predicciones
        datos_completos = nuevos_datos.copy()
        datos_completos['duracionCiclo'] = round(float(pred_ciclo_general[0][0]))
        datos_completos['duracionPeriodo'] = round(float(pred_periodo_general[0][0]))

        # Guardar los datos en un archivo CSV
        ruta_csv = os.path.join(carpeta_usuario, f"{usuario}.csv")
        datos_completos.to_csv(ruta_csv, index=False)

        # Devolver las predicciones
        return {
            "duracionCiclo": round(float(pred_ciclo_general[0][0]), 0),
            "duracionPeriodo": round(float(pred_periodo_general[0][0]), 0)
        }
    except Exception as e:
        print(f"Error en modelo_general: {e}")
        raise


@app.route('/login', methods=['POST'])
def login():
    datos = request.get_json()
    email = datos.get('email')
    contraseña = datos.get('contraseña')
    print(f"Email recibido: {email}, Contraseña recibida: {contraseña}")

    query = "SELECT idUsuario, usuario, contraseña, estado FROM Usuarios WHERE email = %s"
    resultado = ejecutar_query(query, (email,), fetch=True)
    print(f"Resultado de la consulta: {resultado}")

    if resultado:
        if resultado[0]['estado'] == 0:
            return jsonify({"error": "Este usuario ya no existe", "code": "USER_NOT_EXIST"}), 200
        if resultado[0]['contraseña'] == contraseña:
            usuario_id = resultado[0]['idUsuario']
            nombre_usuario = resultado[0]['usuario']
            token = generar_token(usuario_id, nombre_usuario)
            return jsonify({"token": token}), 200
    return jsonify({"error": "Credenciales inválidas", "code": "INVALID_CREDENTIALS"}), 200

# Ruta para crear una nueva pregunta
@app.route("/preguntas", methods=["POST"])
def crear_pregunta():
    autor = obtener_autor()
    nueva_pregunta = request.json
    nueva_pregunta["fecha"] = str(datetime.now())  # Fecha actual
    nueva_pregunta["autor"] = autor

    query = """
        INSERT INTO Preguntas (Usuarios_idUsuario, titulo, contenido, fecha)
        VALUES (%s, %s, %s, %s)
    """
    try:
        id_pregunta = ejecutar_query(query, (nueva_pregunta['idUsuario'], nueva_pregunta['titulo'], nueva_pregunta['contenido'], nueva_pregunta['fecha']))
        nueva_pregunta["id"] = id_pregunta
        return jsonify({"mensaje": "Pregunta creada", "pregunta": nueva_pregunta}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ruta para obtener todas las preguntas (con respuestas asociadas)
@app.route("/preguntas", methods=["GET"])
def obtener_preguntas():
    query_preguntas = """
        SELECT Preguntas.*, 
            CASE 
                WHEN Usuarios.estado = 0 THEN 'Anónimo' 
                ELSE Usuarios.usuario 
            END AS usuario
        FROM Preguntas
        JOIN Usuarios ON Preguntas.Usuarios_idUsuario = Usuarios.idUsuario
        ORDER BY Preguntas.idPreguntas DESC
    """
    try:
        preguntas_db = ejecutar_query(query_preguntas, fetch=True)
        for pregunta in preguntas_db:
            query_respuestas = """
                SELECT Respuesta.*, 
                    CASE 
                        WHEN Usuarios.estado = 0 THEN 'Anónimo' 
                        ELSE Usuarios.usuario 
                    END AS usuario
                FROM Respuesta
                JOIN Usuarios ON Respuesta.Usuarios_idUsuario = Usuarios.idUsuario
                WHERE Respuesta.Preguntas_idPreguntas = %s
            """
            respuestas_db = ejecutar_query(query_respuestas, (pregunta['idPreguntas'],), fetch=True)
            pregunta['respuestas'] = respuestas_db
        return jsonify({"preguntas": preguntas_db}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/preguntas/<int:id>", methods=["GET"])
def obtener_pregunta(id):
    try:
        query_pregunta = """
            SELECT Preguntas.*, 
                CASE 
                    WHEN Usuarios.estado = 0 THEN 'Anónimo' 
                    ELSE Usuarios.usuario 
                END AS usuario
            FROM Preguntas
            JOIN Usuarios ON Preguntas.Usuarios_idUsuario = Usuarios.idUsuario
            WHERE Preguntas.idPreguntas = %s
        """
        pregunta = ejecutar_query(query_pregunta, (id,), fetch=True)
        query_respuestas = """
            SELECT Respuesta.*, 
                CASE 
                    WHEN Usuarios.estado = 0 THEN 'Anónimo' 
                    ELSE Usuarios.usuario 
                END AS usuario
            FROM Respuesta
            JOIN Usuarios ON Respuesta.Usuarios_idUsuario = Usuarios.idUsuario
            WHERE Respuesta.Preguntas_idPreguntas = %s
        """
        respuestas = ejecutar_query(query_respuestas, (pregunta[0]['idPreguntas'],), fetch=True)
        return jsonify({"pregunta": pregunta[0], "respuestas": respuestas}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/preguntas/<int:id_pregunta>/respuestas", methods=["POST"])
def responder_pregunta(id_pregunta):
    datos_respuesta = request.json

    # Verificar que los campos necesarios están presentes
    campos_necesarios = ["idUsuario", "contenido"]
    for campo in campos_necesarios:
        if campo not in datos_respuesta:
            return jsonify({"error": f"Falta el campo {campo}"}), 400

    id_usuario = datos_respuesta["idUsuario"]
    contenido = datos_respuesta["contenido"]

    query = """
        INSERT INTO Respuesta (Preguntas_idPreguntas, Usuarios_idUsuario, contenido, fecha)
        VALUES (%s, %s, %s, %s)
    """
    
    try:
        fecha_actual = datetime.now()
        id_respuesta = ejecutar_query(query, (id_pregunta, id_usuario, contenido, fecha_actual))
        nueva_respuesta = {
            "id": id_respuesta,
            "Preguntas_idPreguntas": id_pregunta,
            "Usuarios_idUsuario": id_usuario,
            "contenido": contenido,
            "fecha": fecha_actual
        }
        return jsonify({"respuesta": nueva_respuesta}), 201
    except Exception as e:
        return jsonify({"error": f"Error en la consulta: {str(e)}"}), 500
    
# Ruta para obtener respuestas de una pregunta específica
@app.route("/preguntas/<int:id_pregunta>/respuestas", methods=["GET"])
def obtener_respuestas(id_pregunta):
    if id_pregunta <= 0:
        return jsonify({"error": "Pregunta no encontrada"}), 404

    query = "SELECT * FROM Respuesta WHERE Preguntas_idPreguntas = %s"
    try:
        respuestas_db = ejecutar_query(query, (id_pregunta,), fetch=True)
        return jsonify({"respuestas": respuestas_db}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ruta para obtener todas las noticias
@app.route("/noticias", methods=["GET"])
def obtener_noticias():
    # Consulta SQL modificada para ordenar por fecha en orden descendente
    query_noticias = "SELECT * FROM noticias ORDER BY fecha DESC"
    try:
        noticias_db = ejecutar_query(query_noticias, fetch=True)
        return jsonify({"noticias": noticias_db}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/noticias/<int:id>", methods=["GET"])
def obtener_noticia_especifica(id):
    try:
        noticia = ejecutar_query("SELECT * FROM Noticias WHERE idNoticias = %s", (id,), fetch=True)
        return jsonify({"noticia": noticia}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ruta para crear un nuevo usuario con todos los detalles
@app.route("/usuarios", methods=["POST"])
def crear_usuario_completo():
    datos_usuario = request.json

    # Verificar que los campos necesarios están presentes
    campos_necesarios = ["usuario", "email", "contraseña", "edad", "peso", "altura", "deporte", "estres", "sueño", "fechaUltimoCiclo", "duracionCiclo", "duracionPeriodo"]
    for campo in campos_necesarios:
        if campo not in datos_usuario:
            return jsonify({"error": f"Falta el campo {campo}"}), 400

    usuario = datos_usuario["usuario"]
    email = datos_usuario["email"]
    contraseña = datos_usuario["contraseña"]
    edad = datos_usuario["edad"]
    peso = datos_usuario["peso"]
    altura = datos_usuario["altura"]
    deporte = datos_usuario["deporte"]
    estres = datos_usuario["estres"]
    sueño = datos_usuario["sueño"]
    fechaUltimoCiclo = datos_usuario["fechaUltimoCiclo"]
    duracionCiclo = datos_usuario["duracionCiclo"]
    duracionPeriodo = datos_usuario["duracionPeriodo"]

    # Validar y convertir altura
    try:
        if altura < 3:  # Alturas menores a 3 se consideran en metros, se convierten a centímetros
            altura = altura * 100
        altura_metros = altura / 100  # Convertir la altura de cm a metros
        bmi = round(peso / (altura_metros ** 2), 2)  # Fórmula del BMI redondeada a 2 decimales
    except ZeroDivisionError:
        return jsonify({"error": "La altura no puede ser cero"}), 400
    except Exception as e:
        return jsonify({"error": f"Error en el cálculo del BMI: {str(e)}"}), 400

    query = """
        INSERT INTO Usuarios (usuario, email, contraseña, edad, peso, altura, BMI, deporte, estres, sueño, fechaUltimoCiclo, duracionCiclo, duracionPeriodo)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    try:
        # Ejecutar el query de inserción y obtener el idUsuario generado
        id_usuario = ejecutar_query(query, (usuario, email, contraseña, edad, peso, altura, bmi, deporte, estres, sueño, fechaUltimoCiclo, duracionCiclo, duracionPeriodo))
        datos_usuario["idUsuario"] = id_usuario
        datos_usuario["BMI"] = bmi
        return jsonify({"mensaje": "Usuario creado", "usuario": datos_usuario}), 201
    except Exception as e:
        return jsonify({"error": f"Error en la consulta: {str(e)}"}), 500
    
@app.route("/usuarios/<int:id>", methods=["GET"])
def obtener_usuario(id):
    try:
        usuario = ejecutar_query("SELECT usuario, nombre, apellidos, email, peso, edad, altura FROM Usuarios WHERE idUsuario = %s", (id,), fetch=True)
        if usuario:
            usuario = usuario[0]
            # Formatear el peso y la altura
            usuario['peso'] = int(usuario['peso']) if usuario['peso'] is not None else None
            usuario['altura'] = round(usuario['altura'] / 100, 2) if usuario['altura'] is not None else None
            return jsonify({"usuario": usuario}), 200
        else:
            return jsonify({"error": "Usuario no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/usuarios/<int:id>", methods=["PUT"])
def actualizar_usuario(id):
    datos_usuario = request.json

    # Verificar que se ha enviado al menos un campo para actualizar
    if not datos_usuario:
        return jsonify({"error": "No se han proporcionado datos para actualizar"}), 400

    # Lista de campos permitidos para actualizar
    campos_permitidos = ["usuario", "nombre", "apellidos", "email", "contraseña", "altura", "peso", "edad"]

    # Filtrar solo los campos válidos que se encuentran en los datos enviados
    campos_a_actualizar = {campo: datos_usuario[campo] for campo in campos_permitidos if campo in datos_usuario}

    if not campos_a_actualizar:
        return jsonify({"error": "Ningún campo válido para actualizar"}), 400

    # Formatear el peso y la altura
    if "peso" in campos_a_actualizar:
        campos_a_actualizar["peso"] = f"{float(campos_a_actualizar['peso']):.2f}"
    if "altura" in campos_a_actualizar:
        campos_a_actualizar["altura"] = f"{float(campos_a_actualizar['altura']) * 100:.2f}"

    # Calcular el BMI si se proporcionan peso y altura
    if "peso" in campos_a_actualizar and "altura" in campos_a_actualizar:
        peso = float(campos_a_actualizar["peso"])
        altura = float(campos_a_actualizar["altura"]) / 100  # Convertir altura a metros
        bmi = peso / (altura ** 2)
        campos_a_actualizar["bmi"] = round(bmi, 2)  # Redondear el BMI a 2 decimales

    # Construir dinámicamente la consulta SQL
    set_clause = ", ".join([f"{campo} = %s" for campo in campos_a_actualizar.keys()])
    valores = list(campos_a_actualizar.values()) + [id]

    query = f"""
        UPDATE Usuarios
        SET {set_clause}
        WHERE idUsuario = %s
    """

    try:
        ejecutar_query(query, tuple(valores))
        return jsonify({"mensaje": "Usuario actualizado correctamente"}), 200
    except Exception as e:
        return jsonify({"error": f"Error en la consulta: {str(e)}"}), 500


# Ruta para recuperar la contraseña
@app.route("/contraseña", methods=["POST"])
def recuperar_contraseña():
    datos = request.json
    email = datos.get("email")
    contraseña = datos.get("contraseña")

    if not email or not contraseña:
        return jsonify({"error": "Correo electrónico y nueva contraseña son requeridos"}), 400

    query = "UPDATE Usuarios SET contraseña = %s WHERE email = %s"
    try:
        ejecutar_query(query, (contraseña, email))
        return jsonify({"mensaje": "Contraseña actualizada correctamente"}), 200
    except Exception as e:
        return jsonify({"error": f"Error en la consulta: {str(e)}"}), 500

@app.route("/recordatorios", methods=["POST"])
def crear_recordatorio():
    datos_recordatorio = request.json

    # Verificar que los campos necesarios están presentes
    campos_necesarios = ["titulo", "contenido", "fecha", "hora", "Usuarios_idUsuario"]
    for campo in campos_necesarios:
        if campo not in datos_recordatorio:
            return jsonify({"error": f"Falta el campo {campo}"}), 400

    titulo = datos_recordatorio["titulo"]
    contenido = datos_recordatorio["contenido"]
    fecha = datos_recordatorio["fecha"]
    hora = datos_recordatorio["hora"]
    Usuarios_idUsuario = datos_recordatorio["Usuarios_idUsuario"]

    query = """
        INSERT INTO Recordatorios (titulo, contenido, fecha, hora, Usuarios_idUsuario)
        VALUES (%s, %s, %s, %s, %s)
    """
    try:
        id_recordatorio = ejecutar_query(query, (titulo, contenido, fecha, hora, Usuarios_idUsuario))
        datos_recordatorio["idRecordatorios"] = id_recordatorio
        return jsonify({"mensaje": "Recordatorio creado", "recordatorio": datos_recordatorio}), 201
    except Exception as e:
        return jsonify({"error": f"Error en la consulta: {str(e)}"}), 500

# filepath: /c:/Users/laura/OneDrive - Universidad Europea Miguel de Cervantes/Universidad/UEMC/4º/TFG/Foro/foro.py
@app.route("/estado/<int:id>", methods=["PUT"])
def actualizar_estado_usuario(id):
    datos = request.get_json()
    nuevo_estado = datos.get("estado")

    if nuevo_estado is None:
        return jsonify({"error": "El estado es requerido"}), 400

    query = "UPDATE Usuarios SET estado = %s WHERE idUsuario = %s"
    try:
        ejecutar_query(query, (nuevo_estado, id))
        return jsonify({"mensaje": "Estado del usuario actualizado correctamente"}), 200
    except Exception as e:
        return jsonify({"error": f"Error en la consulta: {str(e)}"}), 500
    
@app.route("/datosUsuario/<int:id>", methods=["GET"])
def obtener_datos_usuario(id):
    try:
        usuario = ejecutar_query("SELECT idUsuario, edad, BMI FROM Usuarios WHERE idUsuario = %s", (id,), fetch=True)
        if usuario:
            usuario = usuario[0]
            return jsonify({"usuario": usuario}), 200
        else:
            return jsonify({"error": "Usuario no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/datosUsuario", methods=["POST"])
def crear_datos_usuario():
    datos_usuario = request.json

    # Verificar que los campos necesarios están presentes
    campos_necesarios = ["idUsuario", "edad", "BMI", "deporte", "sueño", "estres", "duraciónCiclo", "duraciónPeriodo"]
    for campo in campos_necesarios:
        if campo not in datos_usuario:
            return jsonify({"error": f"Falta el campo {campo}"}), 400

    # Insertar los datos en la colección de MongoDB
    try:
        usuarios_collection.insert_one(datos_usuario)
        return jsonify({"mensaje": "Datos del usuario creados correctamente"}), 201
    except Exception as e:
        return jsonify({"error": f"Error al insertar en MongoDB: {str(e)}"}), 500

@app.route("/datosUsuarioPeriodo/<int:idUsuario>", methods=["GET"])
def obtener_datos_usuario_periodo(idUsuario):
    try:
        # Buscar usuario con idUsuario como entero
        usuario = usuarios_collection.find_one({"idUsuario": idUsuario}, {"_id": 0, "duracionCiclo": 1, "duracionPeriodo": 1})
        
        if usuario:
            return jsonify({"usuario": usuario}), 200
        else:
            return jsonify({"error": "Usuario no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": f"Error al obtener los datos del usuario: {str(e)}"}), 500

@app.route('/predecir', methods=['POST'])
def predecir():
    try:
        # Obtener datos del cuerpo de la solicitud
        data = request.json
        usuario = data['usuario']
        edad = data['edad']
        peso = data['peso']
        altura = data['altura']
        deporte = data['deporte']
        estres = data['estres']
        sueño = data['sueño']

        # Ejecutar el modelo
        resultado = modelo_general(usuario, edad, peso, altura, deporte, estres, sueño)

        # Devolver el resultado
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500    

if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")