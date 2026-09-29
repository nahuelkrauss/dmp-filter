# DMP / SR Monitor

Tablero local bilingüe (English / Español) para explorar exportaciones de Service Requests de DMP. No requiere instalar nada ni enviar los datos a un servidor: abre `index.html` en un navegador moderno y selecciona un archivo `.xlsx`, `.xls` o `.csv`. Cambia el idioma desde el selector `EN / ES` de la barra superior.

## Funciones

- English and Spanish interface, including reports, filters, messages, request details, and date formatting.
- Vistas de todas las SR, solicitudes con `Ready to invoice` al 100%, agrupación por Pfizer Digital PM y solicitudes en `Develop`.
- Búsqueda global y filtros combinables por cualquiera de las columnas; los encabezados habituales se muestran traducidos sin modificar los datos originales.
- Tabla ordenable, detalle de solicitud y exportación CSV de los resultados filtrados.
- El Excel se procesa en la memoria del navegador; no se guarda ni se transmite.

El lector de Excel se incluye localmente en `vendor/` para que la aplicación funcione sin cargar dependencias desde internet. Los datos deben tener encabezados en la primera fila, como en la exportación estándar de DMP.
