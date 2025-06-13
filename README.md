# Informe de Seguridad, Privacidad y Ética en Sistema Académico

**Integrantes**:
- Paolo Medrano Terán – 100%
- César Pajuelo – 100%


**Curso**: Ética y seguridad de los Datos

## 1. Introducción 

Este informe tiene como objetivo detallar las medidas de seguridad, privacidad y ética implementadas en el sistema académico distribuido. Se analiza el tratamiento de los datos académicos, la protección de la información personal de los estudiantes, y las estrategias utilizadas para garantizar la seguridad y el cumplimiento de normativas locales e internacionales.

Se ha trabajado con Jupyter Notebooks a lo largo del proyecto donde cada uno de ellos ejemplifica como se realizaron las medidas de seguridad, lectura de datos, control de accesos y técnicas hashing y encriptación. Teniendo como base un entorno de unidad compartida en Google Drive :  [¡Unidad Compartida!](https://drive.google.com/drive/folders/0ABOxddMG3afxUk9PVA)

## 2. Valor de los datos en el caso de negocio 

En este proyecto, se han definido varios **KPIs** para medir el valor generado por los datos y evaluar el impacto de las variables académicas, sociales y familiares en el rendimiento de los estudiantes. Se ha establecido una base de datos con la siguiente descripción de los atributos:

### Descripción de Atributos

| Campo                | Descripción |
|----------------------|-------------|
| **student_id**       | Identificador único para cada estudiante. |
| **school**           | Nombre de la escuela ("GP" o "MS"). |
| **sex**              | Sexo del estudiante ("F" para femenino, "M" para masculino). |
| **age**              | Edad del estudiante (de 15 a 22 años). |
| **address**          | Tipo de dirección del estudiante ("U" para urbano, "R" para rural). |
| **famsize**          | Tamaño de la familia ("LE3" para ≤ 3 miembros, "GT3" para > 3 miembros). |
| **Pstatus**          | Estado de convivencia de los padres ("T" para juntos, "A" para separados). |
| **Medu**             | Nivel educativo de la madre (de 0 a 4). |
| **Fedu**             | Nivel educativo del padre (de 0 a 4). |
| **Mjob**             | Ocupación de la madre ("teacher", "health", "services", "at_home", "other"). |
| **Fjob**             | Ocupación del padre ("teacher", "health", "services", "at_home", "other"). |
| **reason**           | Razón para elegir la escuela ("home", "reputation", "course", "other"). |
| **guardian**         | Tutor del estudiante ("mother", "father", "other"). |
| **Dalc**             | Consumo de alcohol durante los días laborables (1-5). |
| **Walc**             | Consumo de alcohol durante los fines de semana (1-5). |
| **health**           | Estado de salud del estudiante (1-5). |
| **freetime**         | Tiempo libre después de la escuela (1-5). |
| **famrel**           | Calidad de las relaciones familiares (1-5). |
| **romantic**         | Relación romántica ("yes" o "no"). |
| **nursery**          | Asistió a la escuela infantil ("yes" o "no"). |
| **higher**           | Deseo de continuar con educación superior ("yes" o "no"). |
| **internet**         | Acceso a internet en casa ("yes" o "no"). |
| **paid**             | Clases adicionales pagadas ("yes" o "no"). |
| **famsup**           | Apoyo educativo familiar ("yes" o "no"). |
| **traveltime**       | Tiempo de viaje a la escuela (1-4). |
| **activities**       | Participación en actividades extracurriculares ("yes" o "no"). |
| **goout**            | Frecuencia de salidas con amigos (1-5). |
| **absences**         | Número de ausencias escolares (de 0 a 93). |
| **studytime_mat**    | Tiempo de estudio en matemáticas (1-4). |
| **failures_mat**     | Número de fracasos en matemáticas. |
| **schoolsup_mat**    | Apoyo escolar adicional en matemáticas ("yes" o "no"). |
| **G1_mat**           | Calificación del primer periodo de matemáticas (0-20). |
| **G2_mat**           | Calificación del segundo periodo de matemáticas (0-20). |
| **G3_mat**           | Calificación final en matemáticas (0-20). |
| **studytime_por**    | Tiempo de estudio en portugués (1-4). |
| **failures_por**     | Número de fracasos en portugués. |
| **schoolsup_por**    | Apoyo escolar adicional en portugués ("yes" o "no"). |
| **G1_por**           | Calificación del primer periodo de portugués (0-20). |
| **G2_por**           | Calificación del segundo periodo de portugués (0-20). |
| **G3_por**           | Calificación final en portugués (0-20). |
| **registro_id**      | Identificador único del registro del estudiante. |


Los **KPIs** propuestos permiten monitorear el progreso de los estudiantes, identificar áreas de mejora y optimizar las intervenciones educativas. Están diseñados para proporcionar insights tanto a nivel individual (por estudiante) como a nivel agregado (por curso o grupo).

A continuación, se presentan los **KPIs (Indicadores Clave de Desempeño)** implementados en el sistema:

- **Tasa de Aprobación General (Cross-Materia):**  
  Mide el éxito académico global considerando ambas materias principales (Matemáticas y Portugués).  
  Un estudiante se considera aprobado si obtiene una nota ≥ 10.5 en ambas asignaturas.  
  Este KPI permite identificar si los estudiantes mantienen un rendimiento equilibrado entre diferentes áreas del conocimiento.

- **Tasa de Absentismo Relacionada con el Rendimiento Académico:**  
  Evalúa la relación entre el número de ausencias y las calificaciones finales (G3).  
  Se utiliza un gráfico de dispersión (scatter plot) con línea de tendencia para visualizar el impacto potencial del absentismo en el rendimiento.  
  Este KPI permite detectar patrones de bajo rendimiento asociados con altos niveles de ausencias.

- **Relación entre Tiempos de Estudio y Notas (G3) por Materia:**  
  Mide la relación entre el tiempo dedicado al estudio (`studytime`) y la nota final G3, diferenciada por curso.  
  Se utiliza un gráfico de caja (boxplot) para visualizar cómo varían las calificaciones en función de los diferentes niveles de tiempo de estudio.  
  Este KPI ayuda a entender si mayores tiempos de estudio están efectivamente correlacionados con mejores resultados académicos.

- **Rendimiento Académico Promedio por Grupo de Estudiantes (Aprobados vs Desaprobados):**  
  Analiza y compara las calificaciones finales (G3) de estudiantes clasificados en dos grupos:
  - **Aprobados:** nota final G3 ≥ 10.5
  - **Desaprobados:** nota final G3 < 10.5  
  Se utiliza un gráfico de caja para visualizar la distribución de calificaciones en cada grupo.  
  Este KPI permite evaluar el nivel de dispersión y consistencia dentro de cada grupo y facilita la identificación de tendencias en el rendimiento global del curso.

- **Distribución de Calificaciones con Análisis Individual (Student-Level Insight):**  
  Para cada estudiante, se genera un análisis personalizado que muestra:
  - Su posición relativa en la distribución de calificaciones mediante un boxplot con su nota destacada.
  - Un texto interpretativo que contextualiza su nota en relación a los cuartiles del curso (**¡Te ayudo a entender tus notas!**).  
  Este KPI, de carácter individual, busca fomentar la auto-reflexión del estudiante y promover acciones de mejora personalizadas.

---

**Notas adicionales:**
- Los KPIs están diseñados para ser dinámicos y adaptables al filtro de curso seleccionado.
- En la fase de pruebas, los cálculos se realizan sobre los primeros 10 registros de cada curso para optimizar el rendimiento del sistema.
- Las visualizaciones son interactivas, facilitando una exploración más rica por parte de los usuarios.

### 4.4 Análisis Visual de KPIs Clave

A continuación se presentan visualizaciones complementarias a los KPIs definidos, con su respectiva interpretación. Estas gráficas permiten enriquecer el análisis y brindar una comprensión más profunda del desempeño y comportamiento de los estudiantes.

#### Distribución de Niveles de Ausentismo
![Ausentismo](./templates/ausentismo.png)
**Interpretación:**  
La mayoría de los estudiantes (58%) presentan un nivel de ausentismo bajo (0-5 faltas), lo cual es un indicador positivo de compromiso y asistencia regular. Sin embargo, un 23.8% cae en un nivel moderado (6-10), y un 18.2% se encuentra en niveles altos o críticos (>10 faltas), lo que podría impactar negativamente su rendimiento académico. Es importante monitorear este segmento de estudiantes y considerar intervenciones preventivas.

---

#### Indicadores Clave de Rendimiento Académico

![Indicadores Generales](./templates/INDICADORESGENERALES.png)

**Interpretación:**  
El análisis de los principales factores asociados al rendimiento académico muestra que:

- La **tasa de aprobación general** alcanza el 50%, lo que indica que la mitad de los estudiantes logra aprobar ambas materias.
- Un 17% presenta **ausentismo significativo** (>10 faltas), factor conocido por correlacionarse negativamente con el rendimiento.
- Un 24% incurre en **consumo de alcohol de riesgo**, aspecto que podría afectar tanto el desempeño como la salud general de los estudiantes.
- Solo un 10% reporta tener **acceso completo a recursos educativos**, lo que sugiere una oportunidad de mejora en la equidad y disponibilidad de herramientas de apoyo.

Estos indicadores permiten priorizar estrategias institucionales para mejorar el entorno de aprendizaje.

---

#### Tasa de Aprobación
![TasadeAprobacion](./templates/tasadeaprobación.png)

**Interpretación:**  
El análisis detallado de la tasa de aprobación revela:

- Un 37% de los estudiantes aprueba ambas materias, evidenciando un desempeño académico sólido y equilibrado.
- Un 16.2% aprueba únicamente Matemáticas, mientras que un 31.5% aprueba solo Portugués, lo que sugiere diferencias en el nivel de dificultad percibido o en el nivel de preparación en cada materia.
- El 15.3% corresponde a estudiantes que no logran aprobar ninguna de las dos asignaturas, grupo que debe ser objeto de atención prioritaria en los planes de mejora académica.

Este KPI proporciona una visión más granular que permite a los docentes y autoridades identificar patrones y áreas de refuerzo específicas.

---

**Conclusión:**  
Estas visualizaciones complementan la gestión de KPIs del sistema académico, aportando insights valiosos para la toma de decisiones orientadas a mejorar el rendimiento académico y el bienestar de los estudiantes.

## **3. Protección de Datos según Normativas Locales e Internacionales**

### **3.1 Ley Peruana de Protección de Datos Personales**
La **Ley N° 29733 (Ley de Protección de Datos Personales del Perú)** establece que los datos personales deben ser tratados de forma adecuada, asegurando la privacidad y los derechos de los usuarios. En el proyecto, protege los datos académicos, garantiza el derecho fundamental a la privacidad y establece principios como el consentimiento, la transparencia y la limitación de la finalidad para el tratamiento de datos personales. 

### **3.2 Cumplimiento de Estándares Internacionales**
En el sistema, las prácticas se alinean con estándares como el **GDPR** (Reglamento General de Protección de Datos), que exige el consentimiento explícito de los usuarios y el derecho a acceder y eliminar sus datos personales.

## 4. Medidas de Seguridad y Protección de Datos

### 4.1 Autenticación de Dos Factores (2FA)
Para garantizar que solo usuarios autorizados accedan al sistema, se ha implementado un mecanismo de autenticación de dos factores (2FA). Este proceso asegura que, además de la contraseña, los usuarios deban verificar su identidad mediante un código temporal enviado a su dispositivo móvil. Esta capa adicional de seguridad es esencial para proteger las cuentas de los usuarios, especialmente aquellas con roles administrativos y de supervisión, minimizando el riesgo de accesos no autorizados.

### 4.2 Encriptación y Hashing

Para proteger las credenciales de los usuarios, se ha implementado hashing de contraseñas utilizando el algoritmo `sha256`, el cual asegura que no puedan ser revertidas a su forma original. Esta medida es esencial para salvaguardar la confidencialidad incluso en caso de una filtración de la base de datos.

Además, se aplica encriptación de datos tanto en tránsito como en reposo utilizando el algoritmo AES-128. Esto garantiza que toda la información sensible esté protegida mientras es almacenada o transmitida por redes.

El proceso completo de encriptación se encuentra documentado en el notebook **Encriptando**, ubicado en la carpeta `Data_Seguridad`, donde se cifran múltiples campos sensibles como género, edad, dirección, historial académico, consumo de alcohol, salud, entre otros.

En cuanto al hashing, se empleó el algoritmo `sha256` para transformar las contraseñas y otros campos sensibles. Este procedimiento puede revisarse en el notebook **Hashing** de la misma carpeta. Para manejar eficientemente los más de 2.5 millones de registros, se utilizó `duckdb`, una base de datos en memoria optimizada para grandes volúmenes de datos.

### 4.3 Anonimización

Se aplicó un proceso de anonimización a los datos sensibles con el objetivo de reducir los riesgos de reidentificación de los individuos. Este proceso se detalla en el notebook **Anonimizacion**, ubicado en la carpeta `Data_Seguridad`.

Entre las transformaciones realizadas se incluyen:

- Reemplazo de categorías identificables por etiquetas genéricas o valores numéricos.
- Agrupación de edades en rangos (por ejemplo, 15-17, 18-20, 21-22) y eliminación de la edad exacta.
- Categorización de los niveles educativos en grupos como "Ninguno", "Básica", "Secundaria" y "Superior".
- Reagrupación de profesiones de los padres en categorías generales como "servicio público", "salud" u "otros".

Estas acciones permiten trabajar con los datos respetando principios de privacidad y ética, sin perder el valor analítico necesario para el desarrollo del proyecto.


### 4.4 Gestión de Accesos Basada en Roles

El sistema restringe el acceso a los datos y funcionalidades del sistema según el rol asignado a cada usuario. Los accesos han sido diseñados considerando buenas prácticas de privacidad y diferenciación de funciones:

- **Estudiantes:**  
  Tienen acceso limitado a su propio perfil y rendimiento académico.  
  Su dashboard incluye:
  - Visualización de sus calificaciones (G1, G2, G3), número de ausencias y progreso en el curso.
  - Gráficos comparativos respecto a la distribución general del curso.
  - Un boxplot interactivo que les muestra la posición relativa de su nota final.
  - Una sección de análisis textual personalizada llamada **“¡Te ayudo a entender tus notas!”** que les proporciona una interpretación de su rendimiento.

- **Profesores:**  
  Pueden consultar los registros de los estudiantes de sus clases asignadas.  
  Su dashboard permite:
  - Filtrar por curso (Matemáticas o Portugués).
  - Visualizar KPIs globales como:
    - Tasa de absentismo vs rendimiento académico.
    - Relación entre tiempos de estudio y notas (G3).
    - Rendimiento promedio por grupo de estudiantes (aprobado / desaprobado).
  - Al seleccionar un estudiante específico, el profesor accede a una vista detallada equivalente a la del estudiante:
    - Resumen de calificaciones.
    - Gráficos comparativos.
    - Boxplot con la nota del estudiante resaltada.
    - Análisis textual personalizado de su rendimiento.

- **Supervisores:**  
  Tienen permisos adicionales para revisar y generar reportes de rendimiento académico de múltiples clases.  
  Su acceso está restringido a datos no sensibles, ocultando información personal y comportamental.  
  El dashboard les permite explorar datos generales por curso, sin acceso a los campos definidos como sensibles.

- **Administradores:**  
  Tienen acceso completo a todos los datos del sistema, incluidos los datos de todos los usuarios, sin restricciones.  
  Además, pueden cambiar configuraciones del sistema y aplicar medidas de seguridad.  
  Su dashboard ofrece la vista completa de los registros, incluyendo todos los campos, tanto generales como sensibles.

---

**Notas de implementación:**
- El acceso está controlado dinámicamente según el prefijo del `registro_id` (E, P, S, A).
- La visualización y el filtrado de datos se limitan a los primeros 10 registros por rol en la fase de pruebas, para garantizar rendimiento óptimo durante la demo.
- Los cálculos de progreso y KPIs son precomputados al inicio para mejorar la experiencia de usuario.
- Se utilizan gráficos interactivos con Plotly y visualización HTML optimizada con Bootstrap.

### **4.5 Registros de Auditoría (Logs)** 

Se implementarán **registros de auditoría** para monitorear todas las actividades críticas del sistema, como accesos, modificaciones, y eliminaciones de datos. Estos registros permitirán detectar y responder rápidamente a actividades sospechosas, garantizando la integridad del sistema.

## 5. Estrategias de Privacidad de los Datos

### **5.1 Políticas y Procedimientos**
Las políticas de uso seguro de datos están basadas en el principio de **privilegio mínimo**, lo que asegura que cada usuario solo tiene acceso a la información necesaria para realizar su trabajo. Además, se establecerán **procedimientos formales** para la recolección, almacenamiento y eliminación de datos sensibles, asegurando que todo proceso esté documentado y alineado con los estándares internacionales.

### **5.2 Concientización y Formación del Equipo**
En la próxima fase, se implementará un programa de **concientización de seguridad** para todo el personal que tenga acceso al sistema. Este programa incluirá formación sobre **mejores prácticas de seguridad**, tales como la creación de contraseñas seguras y la identificación de intentos de phishing. La educación del equipo es esencial para mantener la seguridad, dado que muchas brechas de seguridad provienen de errores humanos.

## **6. Consideraciones Éticas en el Proyecto**

La implementación de sistemas que gestionan información sensible y personal, como el caso de este sistema académico, involucra una responsabilidad ética significativa. A continuación, se detallan las consideraciones éticas clave que se han tomado en cuenta durante el desarrollo y operación del sistema:

- **Privacidad** : Se asegura que solo los usuarios autorizados accedan a la información sensible, mediante el control de acceso basado en roles (Estudiantes, Profesores, Supervisores y Administradores).

- **Transparencia** : Los estudiantes son informados sobre cómo se recopilan y usan sus datos. Solo se recogen datos necesarios para el análisis del rendimiento académico.

- **Confidencialidad** : Se utiliza encriptación y hashing para proteger las contraseñas y otros datos sensibles.

- **Responsabilidad**: Los administradores del sistema tienen la responsabilidad de monitorear el uso adecuado de los datos y actuar rápidamente ante cualquier brecha de seguridad.

- **Consentimiento**:  Se asegura que los usuarios otorguen su consentimiento explícito para el procesamiento de sus datos al registrarse en el sistema.
 
## **7. Plan de Respuesta ante Incidentes de Seguridad**
 
En caso de una brecha de seguridad, el sistema cuenta con un **plan de respuesta ante incidentes** que incluye:

1. **Detección rápida del incidente**: Utilizando los registros de auditoría y monitoreo en tiempo real.
2. **Aislamiento del sistema**: En caso de detección de una fuga, se desconectarán los servidores comprometidos para evitar mayores filtraciones.
3. **Recuperación y respaldo de datos**: Se implementarán **backups** periódicos y procedimientos de **recuperación ante desastres**, asegurando que los datos puedan ser restaurados rápidamente en caso de un ataque.
## 9. Conclusión

El sistema académico ha sido diseñado con un enfoque integral de seguridad, privacidad y ética, protegiendo los datos personales y académicos de los estudiantes. Las medidas de seguridad implementadas incluyen autenticación de dos factores (2FA), encriptación de contraseñas mediante hashing, y un control de acceso basado en roles, asegurando que solo los usuarios autorizados accedan a la información pertinente.Los KPIs definidos permiten monitorear el progreso y ausencias, así como identificar áreas de mejora, mientras que las visualizaciones facilitan el análisis.

En resumen, el sistema no solo optimiza el rendimiento académico, sino que también asegura un entorno educativo ético, transparente y seguro, alineado con las mejores prácticas de protección de datos.
