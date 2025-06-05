# Informe de Seguridad, Privacidad y Ética en Sistema Académico
**Integrantes** : Paolo Medrano Terán - César Pajuelo 


**Curso**: Ética y seguridad de los Datos

## 1. Introdución 
## 2. Valor de los datos en el caso de negocio 
En este proyecto, se han definido varios KPIs para medir el valor generado por los datos y evaluar el impacto de las variables académicas, sociales y familiares en el rendimiento de los estudiantes. Los KPIs propuestos permitirán monitorear el progreso de los estudiantes, identificar áreas de mejora y optimizar las intervenciones educativas. A continuación se presentan los **KPIs (Indicadores Clave de Desempeño)**  para el análisis:

- **Rendi**
- **ITEM2**
- **ITEM3**
- **ITEM4**

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

