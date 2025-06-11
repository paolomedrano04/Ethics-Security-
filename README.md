# Informe de Seguridad, Privacidad y Ética en Sistema Académico
**Integrantes** : Paolo Medrano Terán - César Pajuelo 


**Curso**: Ética y seguridad de los Datos

Mostrar siempre los detalles

Copiar código
# I will create the .md content for the user and save it to a file.

markdown_content = """
## 1. Introducción 
## 2. Valor de los datos en el caso de negocio 

En este proyecto, se han definido varios **KPIs** para medir el valor generado por los datos y evaluar el impacto de las variables académicas, sociales y familiares en el rendimiento de los estudiantes. Se ha establecido una base de datos con la siguiente descripción de los atributos:

### Descripción de Atributos

1. **student_id**: Identificador único para cada estudiante.
2. **school**: Nombre de la escuela ("GP" o "MS").
3. **sex**: Sexo del estudiante ("F" para femenino, "M" para masculino).
4. **age**: Edad del estudiante (de 15 a 22 años).
5. **address**: Tipo de dirección del estudiante ("U" para urbano, "R" para rural).
6. **famsize**: Tamaño de la familia ("LE3" para menos de 3 miembros, "GT3" para más de 3 miembros).
7. **Pstatus**: Estado de convivencia de los padres ("T" para juntos, "A" para separados).
8. **Medu**: Nivel educativo de la madre (de 0 a 4).
9. **Fedu**: Nivel educativo del padre (de 0 a 4).
10. **Mjob**: Ocupación de la madre ("teacher", "health", "services", "at_home", "other").
11. **Fjob**: Ocupación del padre ("teacher", "health", "services", "at_home", "other").
12. **reason**: Razón para elegir la escuela ("home", "reputation", "course", "other").
13. **guardian**: Tutor del estudiante ("mother", "father", "other").
14. **Dalc**: Consumo de alcohol durante los días laborables (1-5).
15. **Walc**: Consumo de alcohol durante los fines de semana (1-5).
16. **health**: Estado de salud del estudiante (1-5).
17. **freetime**: Tiempo libre después de la escuela (1-5).
18. **famrel**: Calidad de las relaciones familiares (1-5).
19. **romantic**: Relación romántica ("yes" o "no").
20. **nursery**: Asistió a la escuela infantil ("yes" o "no").
21. **higher**: Deseo de continuar con educación superior ("yes" o "no").
22. **internet**: Acceso a internet en casa ("yes" o "no").
23. **paid**: Clases adicionales pagadas ("yes" o "no").
24. **famsup**: Apoyo educativo familiar ("yes" o "no").
25. **traveltime**: Tiempo de viaje a la escuela (1-4).
26. **activities**: Participación en actividades extracurriculares ("yes" o "no").
27. **goout**: Frecuencia de salidas con amigos (1-5).
28. **absences**: Número de ausencias escolares (de 0 a 93).
29. **studytime_mat**: Tiempo de estudio en matemáticas (1-4).
30. **failures_mat**: Número de fracasos en matemáticas.
31. **schoolsup_mat**: Apoyo escolar adicional en matemáticas ("yes" o "no").
32. **G1_mat**: Calificación del primer periodo de matemáticas (0-20).
33. **G2_mat**: Calificación del segundo periodo de matemáticas (0-20).
34. **G3_mat**: Calificación final en matemáticas (0-20).
35. **studytime_por**: Tiempo de estudio en portugués (1-4).
36. **failures_por**: Número de fracasos en portugués.
37. **schoolsup_por**: Apoyo escolar adicional en portugués ("yes" o "no").
38. **G1_por**: Calificación del primer periodo de portugués (0-20).
39. **G2_por**: Calificación del segundo periodo de portugués (0-20).
40. **G3_por**: Calificación final en portugués (0-20).
41. **registro_id**: Identificador único del registro del estudiante.

Los **KPIs** propuestos permitirán monitorear el progreso de los estudiantes, identificar áreas de mejora y optimizar las intervenciones educativas. A continuación, se presentan los **KPIs (Indicadores Clave de Desempeño)** para el análisis:


- **Tasa de Absentismo Relacionada con el rendimiento académico **
- **Relación entre tiempos de estudio y notas (G3) por materia**
- **Rendimiento académico promedio por grupo de estudiantes (Aprobatorios y Desaprobatorios )**

## **3. Protección de Datos según Normativas Locales e Internacionales**

### **3.1 Ley Peruana de Protección de Datos Personales**
La **Ley N° 29733 (Ley de Protección de Datos Personales del Perú)** establece que los datos personales deben ser tratados de forma adecuada, asegurando la privacidad y los derechos de los usuarios. En el proyecto, protege los datos académicos, garantiza el derecho fundamental a la privacidad y establece principios como el consentimiento, la transparencia y la limitación de la finalidad para el tratamiento de datos personales. 

### **3.2 Cumplimiento de Estándares Internacionales**
En el sistema, las prácticas se alinean con estándares como el **GDPR** (Reglamento General de Protección de Datos), que exige el consentimiento explícito de los usuarios y el derecho a acceder y eliminar sus datos personales.

## 4. Medidas de Seguridad y Protección de Datos

### 4.1 Autenticación de Dos Factores (2FA)
Para garantizar que solo usuarios autorizados accedan al sistema, se ha implementado un mecanismo de autenticación de dos factores (2FA). Este proceso asegura que, además de la contraseña, los usuarios deban verificar su identidad mediante un código temporal enviado a su dispositivo móvil. Esta capa adicional de seguridad es esencial para proteger las cuentas de los usuarios, especialmente aquellas con roles administrativos y de supervisión, minimizando el riesgo de accesos no autorizados.

### 4.2 Encriptación y Hashing

Las contraseñas de los usuarios se protegen mediante hashing utilizando el algoritmo bcrypt, una técnica que asegura que las contraseñas no puedan ser revertidas a su formato original. Esta protección es crucial para garantizar la confidencialidad de las credenciales de acceso, incluso en el caso de una brecha de seguridad en la base de datos. Además, se utiliza encriptación de datos en tránsito y en reposo para proteger toda la información sensible mientras se encuentra almacenada o en comunicación a través de redes.

### 4.3 Gestión de Accesos Basada en Roles
El sistema restringe el acceso a los datos y funcionalidades del sistema según el rol asignado a cada usuario:

- **Estudiantes:** Tienen acceso limitado a su propio perfil y rendimiento académico.
- **Profesores:** Pueden consultar y modificar los registros de los estudiantes de sus clases asignadas.

- **Supervisores:**  Tienen permisos adicionales para revisar y generar reportes de rendimiento académico de múltiples clases.

- **Administradores:** Tienen acceso completo a todos los datos del sistema, incluidos los datos de todos los usuarios, así como la capacidad de gestionar configuraciones del sistema y aplicar medidas de seguridad.

Este control de acceso garantiza que cada usuario solo acceda a la información necesaria para cumplir con sus responsabilidades, minimizando el riesgo de exposición de datos.


## 5. Estrategias de Privacidad de los Datos

## **6. Consideraciones Éticas en el Proyecto**


## **7. Plan de Respuesta ante Incidentes de Seguridad**

## 8. Recomendaciones para Fortalecer la Seguridad


## 9. Conclusión

