# Informe de Seguridad, Privacidad y Ética en Sistema Académico

**Integrantes**:
- Paolo Medrano Terán – 100%
- César Pajuelo Reyes – 100%
- ChristianFrisancho Mayorga - 100%

## 1. Introducción 

En el contexto de un sistema académico distribuido simulado, este proyecto se enfoca en la aplicación de técnicas de privacidad y seguridad de datos sobre un conjunto sensible de registros estudiantiles, con el objetivo de explorar cómo salvaguardar la privacidad de los individuos sin comprometer la utilidad analítica del dataset. Además, se analizan las implicancias éticas del tratamiento de la información, con énfasis en la equidad algorítmica, la transparencia en los modelos y el respeto al consentimiento de los usuarios.

Este trabajo se realiza en cumplimiento con los principios de la Ley N.° 29733 de Protección de Datos Personales del Perú y el Reglamento General de Protección de Datos (GDPR), incorporando una Evaluación de Impacto en la Protección de Datos (DPIA) que identifica y mitiga los riesgos a lo largo del ciclo de vida de los datos.

El sistema implementado permite visualizar indicadores clave de rendimiento académico (KPIs), generar recomendaciones personalizadas, y gestionar accesos diferenciados para distintos roles (estudiantes, docentes, supervisores y administradores), todo bajo un esquema seguro y respetuoso de la privacidad. Asimismo, se han incorporado técnicas como encriptación, hashing, anonimización y control de accesos, y se ha reflexionado sobre el uso ético y socialmente responsable de estos sistemas en el contexto peruano.
## 2. Justificación 

La gestión académica moderna enfrenta el desafío de equilibrar el análisis de datos educativos con la protección de la privacidad de los estudiantes. En países como Perú, donde persisten brechas tecnológicas, sociales y de seguridad ciudadana, es aún más crucial implementar sistemas responsables que eviten la exposición de datos sensibles. Este proyecto propone una arquitectura segura, ética y educativa, que sirva como modelo de buenas prácticas para entornos escolares y universitarios en transformación digital.
## 3.Objetivo General 
Desarrollar un sistema académico simulado que permita aplicar técnicas de privacidad diferencial, seguridad de datos y principios éticos, evaluando el impacto de estas medidas sobre la utilidad analítica del conjunto de datos y el rendimiento del modelo, en concordancia con los marcos regulatorios locales e internacionales.
###  3.1 Objetivos específicos 
- Identificar los riesgos de privacidad, seguridad y ética asociados al uso de datos educativos.
- Implementar técnicas de anonimización, hashing y encriptación sobre atributos sensibles del dataset.
- Aplicar medidas de privacidad diferencial y justificar sus parámetros con base en literatura y estudios previos.
- Evaluar el impacto de estas medidas en la calidad de los análisis y visualizaciones de KPIs académicos.
- Desarrollar dashboards diferenciados por rol de usuario, garantizando el principio de mínimo privilegio.
- Reflexionar sobre el consentimiento, el sesgo algorítmico, la equidad de acceso y el uso ético de los modelos predictivos en educación.
- Diseñar un backend funcional y un frontend demostrativo que permita visualizar los resultados del sistema.
# Desarrollo
## 1. Identificar los riesgos de privacidad, seguridad y ética asociados al uso de datos educativos
Durante la primera fase del proyecto se realizó un análisis exhaustivo del conjunto de datos académicos, identificando atributos sensibles como el género, edad, consumo de alcohol, ausencias escolares, historial académico y situación familiar. Estos atributos fueron clasificados según su nivel de sensibilidad y posible impacto ético en caso de exposición. Se discutieron posibles escenarios de riesgo como la reidentificación por combinación de atributos, discriminación algorítmica y sesgo institucional, considerando el contexto educativo peruano y los riesgos de inseguridad digital y filtración de datos por terceros.

**Este análisis se encuentra reflejado en la sección de “Medidas de Seguridad y Protección de Datos” del informe inicial, y fue complementado por la DPIA enlazada en el informe final.****

## 2. Implementar técnicas de anonimización, hashing y encriptación sobre atributos sensibles del dataset
Como se documentó en la primera entrega del proyecto, se aplicaron técnicas concretas sobre los datos sensibles:
- Anonimización: Agrupación de edades, generalización de profesiones parentales y recategorización de niveles educativos.
- Hashing: Se utilizó el algoritmo sha256 para transformar contraseñas y campos de autenticación.
- Encriptación: Se cifraron los datos sensibles en tránsito y en reposo utilizando AES-128.
**Estos procedimientos se implementaron en los notebooks Hashing, Encriptando y Anonimizacion dentro de la carpeta Data_Seguridad, y están documentados paso a paso en Jupyter Notebooks.**

### 3. Aplicar medidas de privacidad diferencial y justificar sus parámetros con base en literatura y estudios previos
Adicionalmente a lo mencionado en el informe parcial, se aplicó ruido gaussiano específicamente a las calificaciones académicas (G3) en los dashboards, con el objetivo de reducir la posibilidad de reidentificación indirecta sin afectar significativamente las visualizaciones generales.

El uso de ruido gaussiano es justificado por su efectividad en contextos donde se busca preservar la distribución global de los datos, manteniendo la coherencia en promedios y percentiles para análisis estadísticos, especialmente útiles en KPIs visuales. Esta técnica es recomendada por OpenDP y se alinea con principios de privacidad diferencial aproximada ((ε, δ)-DP).

Las decisiones sobre los parámetros de ruido se respalda en : 
[Referencia ruido gaussiano ](https://projects.iq.harvard.edu/files/opendp/files/opendp_white_paper_11may2020.pdf)

### 4. Evaluar el impacto de estas medidas en la calidad de los análisis y visualizaciones de KPIs académicos
Las transformaciones aplicadas afectaron ligeramente la precisión de algunos análisis, pero sin comprometer la utilidad general del sistema. Por ejemplo:

- Los KPIs como tasa de aprobación, ausentismo vs rendimiento y boxplots por rol se mantuvieron interpretables.

- El uso de agrupaciones y anonimización mantuvo la representatividad de los datos.

**Esto puede verificarse en la sección “4.4 Análisis Visual de KPIs Clave” de la primera entrega, donde se muestran visualizaciones y su interpretación después del tratamiento.**

### 5. Desarrollar dashboards diferenciados por rol de usuario, garantizando el principio de mínimo privilegio
Se implementaron dashboards adaptados a los siguientes roles: Estudiante, Profesor, Supervisor y Administrador. Cada uno accede solo a los datos permitidos por su rol:
- Los estudiantes solo ven su información.
- Los profesores acceden a sus grupos.
- Los supervisores solo a datos agregados.
- Los administradores ven todo el sistema.

**Esta lógica se programó usando prefijos de registro_id y está detallada en la sección 4.4 del informe.**

### 6. Evaluación de Impacto en la Protección de Datos (DPIA)
Como parte esencial de este proyecto, se ha desarrollado una Evaluación de Impacto en la Protección de Datos (DPIA), la cual permite identificar riesgos potenciales en el ciclo de vida de los datos, proponer medidas de mitigación y asegurar el cumplimiento con los principios de privacidad y seguridad.
La DPIA desarrollada aborda aspectos como:
  - Propósito del procesamiento y fuentes de datos.
  - Naturaleza, alcance, contexto y riesgos asociados.
  - Medidas de seguridad adoptadas para prevenir accesos no autorizados, sesgos, o reidentificación.
  - Cumplimiento con normativas como la Ley N° 29733 del Perú y el GDPR.
El análisis detallado se encuentra disponible en el siguiente enlace:
🔗 [DPIA del Proyecto - Enlace al documento PDF](https://docs.google.com/document/d/14K-pkhg5VUPvi9n2ZrfCwhe4MpiyvWOk1q7cb5Pwuw8/edit?usp=sharing)

### 7. Reflexión Ética sobre Consentimiento, Sesgo Algorítmico, Equidad y Modelos Predictivos en Educación

Como se trabajó en la primera parte del proyecto, es fundamental reflexionar sobre varios aspectos éticos relacionados con los datos educativos y el futuro uso de modelos predictivos, que en este caso aún no se han implementado, pero podría darse sin ningún problema para un análisis más detallado que pueda enriquecer decisiones de los docentes o supervisores.

- **Consentimiento informado**: El sistema está diseñado para que los estudiantes otorguen consentimiento explícito al registrarse, en caso ser menores de edad serán sus apoderados, con información clara sobre los fines del procesamiento, los datos utilizados y sus derechos (derechos ARCO), en consonancia con la Ley N° 29733 y el GDPR. Este requisito de transparencia está alineado con los principios de supervisión humana y respeto a la privacidad promovidos por Floridi & Cowls en su marco ético.
- **Sesgo algorítmico**: Durante el desarrollo del sistema, se reconoció que los algoritmos predictivos pueden replicar o amplificar desigualdades existentes si no se diseñan con cuidado, en variables como 'internet' y 'address'. Por ejemplo:
- Atributos como nivel educativo de los padres o el acceso a internet pueden sesgar las predicciones de rendimiento si no se contextualizan adecuadamente.
- Se propuso una estrategia de balanceo en el entrenamiento de modelos para evitar que subgrupos minoritarios (por sexo, tipo de dirección o estado familiar) sean desventajados en la inferencia.
- **Equidad de acceso**: Un hallazgo clave del análisis de KPIs fue que solo el 10% de los estudiantes reporta tener acceso completo a recursos educativos. Esto revela una brecha digital que limita el impacto potencial de cualquier sistema predictivo. Si bien el modelo puede identificar estudiantes en riesgo, sin acceso equitativo a herramientas de mejora, las recomendaciones no se traducen en cambios reales.
Por tanto, se enfatiza que cualquier sistema predictivo debe ir acompañado de políticas institucionales que aseguren recursos y oportunidades para todos los estudiantes por igual.

Ética predictiva: Se discutió la responsabilidad institucional al utilizar predicciones sobre rendimiento académico.

**Estas reflexiones se encuentran detalladas en la sección 6 del informe.**

# Reflexión y Soluciones:

**Revisión del Modelo**: Realizar auditorías periódicas de los modelos para detectar y corregir sesgos. Esto implica la implementación de algoritmos de fairness (justicia), que busquen equilibrar las probabilidades de resultados para diferentes grupos.

**Uso de Datos Diversos y Balanceados**: Asegurarse de que los conjuntos de datos de entrenamiento sean representativos de todas las categorías de estudiantes y no estén sesgados hacia un grupo específico. Esto puede implicar la recolección de datos adicionales o la modificación de los conjuntos existentes para balancear las representaciones.

**Evaluación de Impacto Ético:** Evaluar cómo las decisiones automatizadas del modelo afectan a los diferentes grupos de estudiantes y cómo se pueden mitigar esos efectos.

